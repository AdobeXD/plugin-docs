# Standard library
path = require "path"
stream = require "stream"

# Third-party dependencies
uuid = require "uuid"
mime = require "mime"
combinedStream2 = require "combined-stream2"
Promise = require "bluebird"
_ = require "lodash"
debug = require("debug")("form-data2")

CRLF = "\r\n"

# Utility functions
ofTypes = (obj, types) ->
	match = false
	for type in types
		match = match or obj instanceof type
	return match


module.exports = class FormData
	constructor: ->
		@_firstHeader = false
		@_closingHeaderAppended = false
		@_boundary = "----" + uuid.v4()
		@_headers = { "content-type": "multipart/form-data; boundary=#{@_boundary}" }
		@_stream = combinedStream2.create()

	_getStreamMetadata: (source, options) -> # FIXME: Make work with deferred sources (ie. callback-provided)
		debug "obtaining metadata for source: %s", source.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")
		fullPath = options.filename ? source.client?._httpMessage?.path ? source.path

		if fullPath? # This is a file...
			filename = path.basename(fullPath)
			contentType = options.contentType ? source.headers?["content-type"] ? mime.lookup(filename)
			contentLength = options.knownLength ? options.contentLength ? source.headers?["content-length"] # FIXME: Is this even used anywhere?
		else # Probably just a plaintext form value, or an unidentified stream
			contentType = options.contentType ? source.headers?["content-type"]
			contentLength = options.knownLength ? options.contentLength ? source.headers?["content-length"]

		return {filename: filename, contentType: contentType, contentLength: contentLength}

	_generateHeaderFields: (name, metadata) ->
		debug "generating headers for: %s", metadata
		headerFields = []

		if metadata.filename?
			escapedFilename = metadata.filename.replace '"', '\\"'
			headerFields.push "Content-Disposition: form-data; name=\"#{name}\"; filename=\"#{escapedFilename}\""
		else
			headerFields.push "Content-Disposition: form-data; name=\"#{name}\""

		if metadata.contentType?
			headerFields.push "Content-Type: #{metadata.contentType}"

		debug "generated headers: %s", headerFields
		return headerFields.join CRLF

	_appendHeader: (name, metadata) ->
		if @_firstHeader == false
			debug "appending header"
			leadingCRLF = ""
			@_firstHeader = true
		else
			debug "appending first header"
			leadingCRLF = CRLF

		headerFields = @_generateHeaderFields name, metadata

		@_stream.append new Buffer(leadingCRLF + "--#{@_boundary}" + CRLF + headerFields + CRLF + CRLF)

	_appendClosingHeader: ->
		debug "appending closing header"
		@_stream.append new Buffer(CRLF + "--#{@_boundary}--")

	append: (name, source, options = {}) ->
		debug "appending source"
		if @_closingHeaderAppended
			throw new Error "The stream has already been prepared for usage; you either piped it or generated the HTTP headers. No new sources can be appended anymore."

		if not ofTypes(source, [stream.Readable, stream.Duplex, stream.Transform, Buffer, Function]) and typeof source != "string"
			throw new Error "The provided value must be either a readable stream, a Buffer, a callback providing either of those, or a string."

		if typeof source == "string"
			source = new Buffer(source) # If the string isn't UTF-8, this won't end well!
			options.contentType ?= "text/plain"

		metadata = @_getStreamMetadata source, options
		@_appendHeader name, metadata

		@_stream.append source, options

	done: ->
		# This method should be called when the user is finished adding streams. It adds the termination header at the end of the combined stream. When piping, this method is automatically called!
		debug "called 'done'"

		if not @_closingHeaderAppended
			@_closingHeaderAppended = true
			@_appendClosingHeader()

	getBoundary: ->
		return @_boundary

	getHeaders: (callback) ->
		# Returns the headers needed to correctly transmit the generated multipart/form-data blob. We will first need to call @done() to make sure that the multipart footer is there - from this point on, no new sources can be appended anymore.
		@done()

		Promise.try =>
			@_stream.getCombinedStreamLength()
		.then (length) ->
			debug "total combined stream length: %s", length
			Promise.resolve { "content-length": length }
		.catch (err) ->
			# We couldn't get the stream length, most likely there was a stream involved that `stream-length` does not support.
			debug "WARN: could not get total combined stream length"
			Promise.resolve { "transfer-encoding": "chunked" }
		.then (sizeHeaders) =>
			Promise.resolve _.extend(sizeHeaders, @_headers)
		.nodeify(callback)

	getLength: (callback) ->
		@_stream.getCombinedStreamLength(callback)

	pipe: (target) ->
		@done()

		# Pass through to the underlying `combined-stream`.
		debug "piping underlying combined-stream2 to target writable"
		@_stream.pipe target
