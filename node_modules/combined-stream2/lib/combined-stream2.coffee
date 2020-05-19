stream = require "stream"
Promise = require "bluebird"
streamLength = require "stream-length"
debug = require("debug")("combined-stream2")

# FIXME: .error handler on streams?

# Utility functions
ofTypes = (obj, types) ->
	match = false
	for type in types
		match = match or obj instanceof type
	return match

isStream = (obj) ->
	return ofTypes obj, [stream.Readable, stream.Duplex, stream.Transform, stream.Stream]

makeStreams2 = (sourceStream) ->
	# Adapted from https://github.com/feross/multistream/blob/master/index.js
	if not sourceStream or typeof sourceStream == "function" or sourceStream instanceof Buffer or sourceStream._readableState?
		debug "already streams2 or otherwise compatible"
		return sourceStream

	if sourceStream.httpModule?
		# This is a special case for `request`, because it does weird stream hackery.
		# NOTE: The caveat is that this will buffer up in memory.
		debug "found `request` stream, using PassThrough stream..."
		return sourceStream.pipe(new stream.PassThrough())

	debug "wrapping stream..."
	wrapper = new stream.Readable().wrap(sourceStream)

	if sourceStream.destroy?
		wrapper.destroy = sourceStream.destroy.bind(sourceStream)

	debug "returning streams2-wrapped stream"
	return wrapper

# The actual stream class definition
class CombinedStream extends stream.Readable
	constructor: ->
		super
		@_reading = false
		@_sources = []
		@_currentSource = null
		@_sourceDataAvailable = false
		@_wantData = false

	append: (source, options = {}) ->
		# Only readable binary data sources are allowed.
		if not ofTypes source, [stream.Readable, stream.Duplex, stream.Transform, stream.Stream, Buffer, Function]
			throw new Error "The provided source must be either a readable stream or a Buffer, or a callback providing either of those. If it is currently a string, you need to convert it to a Buffer yourself and ensure that the encoding is correct."

		debug "appending source: %s", source.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")
		@_sources.push [makeStreams2(source), options]

	getStreamLengths: ->
		debug "getting stream lengths"
		if @_reading
			Promise.reject new Error("You can't obtain the stream lengths anymore once you've started reading!")
		else
			Promise.try =>
				@_resolveAllSources()
			.then (actualSources) =>
				@_sources = actualSources
				Promise.resolve actualSources
			.map (source) ->
				if source[1]?.knownLength? or source[1]?.contentLength?
					Promise.resolve source[1]?.knownLength ? source[1]?.contentLength
				else
					streamLength source[0]

	getCombinedStreamLength: (callback) ->
		debug "getting combined stream length"
		Promise.try =>
			@getStreamLengths()
		.reduce ((total, current) -> total + current), 0
		.nodeify(callback)

	_resolveAllSources: ->
		debug "resolving all sources"
		Promise.all (@_resolveSource(source) for source in @_sources)

	_resolveSource: (source) ->
		# If the 'source' is a function, then it's actually a callback that will *return* the source. We call the callback, and supply it with a `next` function that will post-process the source, and eventually trigger the actual read.
		new Promise (resolve, reject) => # WARN?
			if source[0] instanceof Function
				debug "resolving %s", source[0].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")
				source[0] (realSource) =>
					resolve [realSource, source[1]]
			else
				# It's a regular source, so we immediately continue.
				debug "source %s is already resolved", source[0].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")
				resolve source

	_initiateRead: ->
		Promise.try =>
			@_reading = true
			@_resolveAllSources()
		.then (actualSources) =>
			@_sources = actualSources
			Promise.resolve()

	_read: (size) ->
		Promise.try =>
			if @_reading == false
				@_initiateRead()
			else
				Promise.resolve()
		.then =>
			@_doRead size

	_doRead: (size) ->
		# FIXME: We should probably try to do something with `size` ourselves. Just passing it on for now, but it'd be nice to implement it properly in the future - this might help efficiency in some cases.
		Promise.try =>
			if @_currentSource == null
				# We're not currently actively reading from any sources. Set a new source to be the current source.
				@_nextSource size
			else
				# We haven't changed our source - immediately continue with the actual read.
				Promise.resolve()
		.then =>
			@_doActualRead size

	_nextSource: (readSize) ->
		if @_sources.length == 0
			# We've run out of sources - signal EOF and bail.
			debug "ran out of streams; pushing EOF"
			@push null
			return

		@_currentSource = @_sources.shift()[0]
		@_currentIsStream = isStream @_currentSource
		debug "switching to new source (stream = %s): %s", @_currentIsStream, @_currentSource.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")

		if @_currentIsStream
			@_currentSource.once "end", =>
				# We've depleted the stream (ie. we've read 'null') The current source should be set to `null`, so that on the next read a new source will be picked. We'll also immediately trigger the next read - the stream will be expecting to receive *some* kind of data before calling the next read itself.
				@_currentSource = null
				@_doRead readSize # FIXME: This should probably use the last-requested read size, not the one that was requested when *setting up* the `end` event.

			@_currentSource.on "readable", =>
				debug "received readable event, setting sourceDataAvailable to true"
				@_sourceDataAvailable = true

				if @_wantData
					debug "wantData queued, reading"
					@_doStreamRead()

		Promise.resolve()

	# We're wrapping the actual reading code in a separate function, so as to facilitate source-returning callbacks in the sources list.
	_doActualRead: (size) =>
		# FIXME: Apparently, it may be possible to push more than one chunk in a single _read call. The implementation specifics of this should probably be looked into - that could perhaps make our stream a bit more efficient. On the other hand, shouldn't we leave this for the Writable to decide?
		new Promise (resolve, reject) =>
			if @_currentIsStream
				# This is a readable stream of some sort - we'll do a read, and pass on the result. We'll pass on the `size` parameter, but there's no guarantee that anything will actually be done with it.
				if @_sourceDataAvailable
					@_doStreamRead()
					return resolve()
				else
					debug "want data, but no readable event fired yet, setting wantData to true"
					@_wantData = true
					return resolve() # We haven't actually read anything yet, but whatever.
			else
				# This is a Buffer - we'll push it as is, and immediately mark it as completed.
				chunk = @_currentSource

				# We need to unset it *before* pushing the chunk, because otherwise V8 will sometimes not give control back to this function, and a second read may occur before the source can be unset.
				@_currentSource = null

				if chunk != null # FIXME: ???
					debug "pushing buffer %s", chunk.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")
					@push chunk
				else
					debug "WARN: current source was null, pushing empty buffer"
					@push new Buffer("")

				resolve()

	_doStreamRead: =>
		Promise.try =>
			@_sourceDataAvailable = false
			@_wantData = false
			chunk = @_currentSource.read()

			# Since Node.js v0.12, a stream will apparently return null when it is finished... we need to filter this out, to prevent it from ending our combined stream prematurely.
			if chunk?
				@push chunk

			Promise.resolve()

# Public module API
module.exports =
	create: (options) ->
		# We implement the same API as the original `combined-stream`, for drop-in compatibility reasons.
		return new CombinedStream(options)
