# FIXME: Force-lowercase user-supplied headers before merging them into the request?
# FIXME: Deep-merge query-string arguments between URL and argument?
# FIXME: Named arrays for multipart/form-data?
# FIXME: Are arrays of streams in `data` correctly recognized as being streams?

# Core modules
urlUtil = require "url"
querystring = require "querystring"
stream = require "stream"
http = require "http"
https = require "https"
util = require "util"

# Utility modules
Promise = require "bluebird"
_ = require "lodash"
S = require "string"
formFixArray = require "form-fix-array"
errors = require "errors"
debug = require("debug")
debugRequest = debug("bhttp:request")
debugResponse = debug("bhttp:response")
extend = require "extend"
devNull = require "dev-null"

# Other third-party modules
formData = require "form-data2"
concatStream = require "concat-stream"
toughCookie = require "tough-cookie"
streamLength = require "stream-length"
sink = require "through2-sink"
spy = require "through2-spy"

# For the version in the user agent, etc.
packageConfig = require "../package.json"

bhttpErrors = {}

# Error types

errors.create
	name: "bhttpError"
	scope: bhttpErrors

errors.create
	name: "ConflictingOptionsError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

errors.create
	name: "UnsupportedProtocolError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

errors.create
	name: "RedirectError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

errors.create
	name: "MultipartError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

errors.create
	name: "ConnectionTimeoutError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

errors.create
	name: "ResponseTimeoutError"
	parents: bhttpErrors.bhttpError
	scope: bhttpErrors

# Utility functions

ofTypes = (obj, types) ->
	match = false
	for type in types
		match = match or obj instanceof type
	return match

addErrorData = (err, request, response, requestState) ->
	err.request = request
	err.response = response
	err.requestState = requestState
	return err

isStream = (obj) ->
	obj? and (ofTypes(obj, [stream.Readable, stream.Duplex, stream.Transform]) or obj.hasOwnProperty("_bhttpStreamWrapper"))

# Middleware
# NOTE: requestState is an object that signifies the current state of the overall request; eg. for a response involving one or more redirects, it will hold a 'redirect history'.
prepareSession = (request, response, requestState) ->
	debugRequest "preparing session"
	Promise.try ->
		if requestState.sessionOptions?
			# Request options take priority over session options
			request.options = _.merge _.clone(requestState.sessionOptions), request.options

		# Create a headers parameter if it doesn't exist yet - we'll need to add some stuff to this later on
		# FIXME: We may need to do a deep-clone of other mutable options later on as well; otherwise, when getting a redirect in a session with pre-defined options, the contents may not be correctly cleared after following the redirect.
		if request.options.headers?
			request.options.headers = _.clone(request.options.headers, true)
		else
			request.options.headers = {}

		# If we have a cookie jar, start out by setting the cookie string.
		if request.options.cookieJar?
			Promise.try ->
				# Move the cookieJar to the request object, the http/https module doesn't need it.
				request.cookieJar = request.options.cookieJar
				delete request.options.cookieJar

				# Get the current cookie string for the URL
				request.cookieJar.get request.url
			.then (cookieString) ->
				debugRequest "sending cookie string: %s", cookieString
				request.options.headers["cookie"] = cookieString
				Promise.resolve [request, response, requestState]
		else
			Promise.resolve [request, response, requestState]

prepareDefaults = (request, response, requestState) ->
	debugRequest "preparing defaults"
	Promise.try ->
		# These are the options that we need for response processing, but don't need to be passed on to the http/https module.
		request.responseOptions =
			discardResponse: request.options.discardResponse ? false
			keepRedirectResponses: request.options.keepRedirectResponses ? false
			followRedirects: request.options.followRedirects ? true
			noDecode: request.options.noDecode ? false
			decodeJSON: request.options.decodeJSON ? false
			stream: request.options.stream ? false
			justPrepare: request.options.justPrepare ? false
			redirectLimit: request.options.redirectLimit ? 10
			onDownloadProgress: request.options.onDownloadProgress
			responseTimeout: request.options.responseTimeout

		# Whether chunked transfer encoding for multipart/form-data payloads is acceptable. This is likely to break quietly on a lot of servers.
		request.options.allowChunkedMultipart ?= false

		# Whether we should always use multipart/form-data for payloads, even if querystring-encoding would be a possibility.
		request.options.forceMultipart ?= false

		# If no custom user-agent is defined, set our own
		request.options.headers["user-agent"] ?= "bhttp/#{packageConfig.version}"

		# Normalize the request method to lowercase.
		request.options.method = request.options.method.toLowerCase()

		Promise.resolve [request, response, requestState]

prepareUrl = (request, response, requestState) ->
	debugRequest "preparing URL"
	Promise.try ->
		# Parse the specified URL, and use the resulting information to build a complete `options` object
		urlOptions = urlUtil.parse request.url, true

		_.extend request.options, {hostname: urlOptions.hostname, port: urlOptions.port}
		request.options.path = urlUtil.format {pathname: urlOptions.pathname, query: request.options.query ? urlOptions.query}
		request.protocol = S(urlOptions.protocol).chompRight(":").toString()

		Promise.resolve [request, response, requestState]

prepareProtocol = (request, response, requestState) ->
	debugRequest "preparing protocol"
	Promise.try ->
		request.protocolModule = switch request.protocol
			when "http" then http
			when "https" then https # CAUTION / FIXME: Node will silently ignore SSL settings without a custom agent!
			else null

		if not request.protocolModule?
			return Promise.reject() new bhttpErrors.UnsupportedProtocolError "The protocol specified (#{protocol}) is not currently supported by this module."

		request.options.port ?= switch request.protocol
			when "http" then 80
			when "https" then 443

		Promise.resolve [request, response, requestState]

prepareOptions = (request, response, requestState) ->
	debugRequest "preparing options"
	Promise.try ->
		# Do some sanity checks - there are a number of options that cannot be used together
		if (request.options.formFields? or request.options.files?) and (request.options.inputStream? or request.options.inputBuffer?)
			return Promise.reject addErrorData(new bhttpErrors.ConflictingOptionsError("You cannot define both formFields/files and a raw inputStream or inputBuffer."), request, response, requestState)

		if request.options.encodeJSON and (request.options.inputStream? or request.options.inputBuffer?)
			return Promise.reject addErrorData(new bhttpErrors.ConflictingOptionsError("You cannot use both encodeJSON and a raw inputStream or inputBuffer.", undefined, "If you meant to JSON-encode the stream, you will currently have to do so manually."), request, response, requestState)

		# If the user plans on streaming the response, we need to disable the agent entirely - otherwise the streams will block the pool.
		if request.responseOptions.stream
			request.options.agent ?= false

		Promise.resolve [request, response, requestState]

preparePayload = (request, response, requestState) ->
	debugRequest "preparing payload"
	Promise.try ->
		# Persist the download progress event handler on the request object, if there is one.
		request.onUploadProgress = request.options.onUploadProgress

		# If a 'files' parameter is present, then we will send the form data as multipart data - it's most likely binary data.
		multipart = request.options.forceMultipart or request.options.files?

		# Similarly, if any of the formFields values are either a Stream or a Buffer, we will assume that the form should be sent as multipart.
		multipart = multipart or _.any request.options.formFields, (item) ->
			item instanceof Buffer or isStream(item)

		# Really, 'files' and 'formFields' are the same thing - they mostly have different names for 1) clarity and 2) multipart detection. We combine them here.
		_.extend request.options.formFields, request.options.files

		# For a last sanity check, we want to know whether there are any Stream objects in our form data *at all* - these can't be used when encodeJSON is enabled.
		containsStreams = _.any request.options.formFields, (item) -> isStream(item)

		if request.options.encodeJSON and containsStreams
			return Promise.reject() new bhttpErrors.ConflictingOptionsError "Sending a JSON-encoded payload containing data from a stream is not currently supported.", undefined, "Either don't use encodeJSON, or read your stream into a string or Buffer."

		if request.options.method not in ["get", "head", "delete"]
			# Prepare the payload, and set the appropriate headers.
			if (request.options.encodeJSON or request.options.formFields?) and not multipart
				# We know the payload and its size in advance.
				debugRequest "got url-encodable form-data"

				if request.options.encodeJSON
					debugRequest "... but encodeJSON was set, so we will send JSON instead"
					request.options.headers["content-type"] = "application/json"
					request.payload = JSON.stringify request.options.formFields ? null
				else if not _.isEmpty request.options.formFields
					# The `querystring` module copies the key name verbatim, even if the value is actually an array. Things like PHP don't understand this, and expect every array-containing key to be suffixed with []. We'll just append that ourselves, then.
					request.options.headers["content-type"] = "application/x-www-form-urlencoded"
					request.payload = querystring.stringify formFixArray(request.options.formFields)
				else
					request.payload = ""

				request.options.headers["content-length"] = request.payload.length

				return Promise.resolve()
			else if request.options.formFields? and multipart
				# This is going to be multipart data, and we'll let `form-data` set the headers for us.
				debugRequest "got multipart form-data"
				formDataObject = new formData()

				for fieldName, fieldValue of formFixArray(request.options.formFields)
					if not _.isArray fieldValue
						fieldValue = [fieldValue]

					for valueElement in fieldValue
						if valueElement._bhttpStreamWrapper?
							streamOptions = valueElement.options
							valueElement = valueElement.stream
						else
							streamOptions = {}

						formDataObject.append fieldName, valueElement, streamOptions

				request.payloadStream = formDataObject

				Promise.try ->
					formDataObject.getHeaders()
				.then (headers) ->
					if headers["content-transfer-encoding"] == "chunked" and not request.options.allowChunkedMultipart
						Promise.reject addErrorData(new MultipartError("Most servers do not support chunked transfer encoding for multipart/form-data payloads, and we could not determine the length of all the input streams. See the documentation for more information."), request, response, requestState)
					else
						_.extend request.options.headers, headers
						Promise.resolve()
			else if request.options.inputStream?
				# A raw inputStream was provided, just leave it be.
				debugRequest "got inputStream"
				Promise.try ->
					request.payloadStream = request.options.inputStream

					if request.payloadStream._bhttpStreamWrapper? and (request.payloadStream.options.contentLength? or request.payloadStream.options.knownLength?)
						Promise.resolve(request.payloadStream.options.contentLength ? request.payloadStream.options.knownLength)
					else
						streamLength request.options.inputStream
				.then (length) ->
					debugRequest "length for inputStream is %s", length
					request.options.headers["content-length"] = length
				.catch (err) ->
					debugRequest "unable to determine inputStream length, switching to chunked transfer encoding"
					request.options.headers["content-transfer-encoding"] = "chunked"
			else if request.options.inputBuffer?
				# A raw inputBuffer was provided, just leave it be (but make sure it's an actual Buffer).
				debugRequest "got inputBuffer"
				if typeof request.options.inputBuffer == "string"
					request.payload = new Buffer(request.options.inputBuffer) # Input string should be utf-8!
				else
					request.payload = request.options.inputBuffer

				debugRequest "length for inputBuffer is %s", request.payload.length
				request.options.headers["content-length"] = request.payload.length

				return Promise.resolve()
			else
				# No payload specified.
				return Promise.resolve()
		else
			# GET, HEAD and DELETE should not have a payload. While technically not prohibited by the spec, it's also not specified, and we'd rather not upset poorly-compliant webservers.
			# FIXME: Should this throw an Error?
			return Promise.resolve()
	.then ->
		Promise.resolve [request, response, requestState]

prepareCleanup = (request, response, requestState) ->
	debugRequest "preparing cleanup"
	Promise.try ->
		# Remove the options that we're not going to pass on to the actual http/https library.
		delete request.options[key] for key in ["query", "formFields", "files", "encodeJSON", "inputStream", "inputBuffer", "discardResponse", "keepRedirectResponses", "followRedirects", "noDecode", "decodeJSON", "allowChunkedMultipart", "forceMultipart", "onUploadProgress", "onDownloadProgress"]

		# Lo-Dash apparently has no `map` equivalent for object keys...?
		fixedHeaders = {}
		for key, value of request.options.headers
			fixedHeaders[key.toLowerCase()] = value
		request.options.headers = fixedHeaders

		Promise.resolve [request, response, requestState]

# The guts of the module

prepareRequest = (request, response, requestState) ->
	debugRequest "preparing request"
	# FIXME: Mock httpd for testing functionality.
	Promise.try ->
		middlewareFunctions = [
			prepareSession
			prepareDefaults
			prepareUrl
			prepareProtocol
			prepareOptions
			preparePayload
			prepareCleanup
		]

		promiseChain = Promise.resolve [request, response, requestState]

		middlewareFunctions.forEach (middleware) -> # We must use the functional construct here, to avoid losing references
			promiseChain = promiseChain.spread (_request, _response, _requestState) ->
				middleware(_request, _response, _requestState)

		return promiseChain

makeRequest = (request, response, requestState) ->
	debugRequest "making %s request to %s", request.options.method.toUpperCase(), request.url
	Promise.try ->
		# Instantiate a regular HTTP/HTTPS request
		req = request.protocolModule.request request.options

		timeoutTimer = null

		new Promise (resolve, reject) ->
			# Connection timeout handling, if one is set.
			if request.responseOptions.responseTimeout?
				debugRequest "setting response timeout timer to #{request.responseOptions.responseTimeout}ms..."
				req.on "socket", (socket) ->
					timeoutHandler = ->
						debugRequest "a response timeout occurred!"
						req.abort()
						reject addErrorData(new bhttpErrors.ResponseTimeoutError("The response timed out."))

					timeoutTimer = setTimeout(timeoutHandler, request.responseOptions.responseTimeout)

			# Set up the upload progress monitoring.
			totalBytes = request.options.headers["content-length"]
			completedBytes = 0

			progressStream = spy (chunk) ->
				completedBytes += chunk.length
				req.emit "progress", completedBytes, totalBytes

			if request.onUploadProgress?
				req.on "progress", (completedBytes, totalBytes) ->
					request.onUploadProgress(completedBytes, totalBytes, req)

			# This is where we write our payload or stream to the request, and the actual request is made.
			if request.payload?
				# The entire payload is a single Buffer. We'll still pretend that it's a stream for our progress events, though, to provide a consistent API.
				debugRequest "sending payload"
				req.emit "progress", request.payload.length, request.payload.length
				req.write request.payload
				req.end()
			else if request.payloadStream?
				# The payload is a stream.
				debugRequest "piping payloadStream"
				if request.payloadStream._bhttpStreamWrapper?
					request.payloadStream.stream
						.pipe progressStream
						.pipe req
				else
					request.payloadStream
						.pipe progressStream
						.pipe req
			else
				# For GET, HEAD, DELETE, etc. there is no payload, but we still need to call end() to complete the request.
				debugRequest "closing request without payload"
				req.end()

			# In case something goes wrong during this process, somehow...
			req.on "error", (err) ->
				if err.code == "ETIMEDOUT"
					debugRequest "a connection timeout occurred!"
					reject addErrorData(new bhttpErrors.ConnectionTimeoutError("The connection timed out."))
				else
					reject err

			req.on "response", (res) ->
				if timeoutTimer?
					debugResponse "got response in time, clearing response timeout timer"
					clearTimeout(timeoutTimer)
				resolve res
	.then (response) ->
		Promise.resolve [request, response, requestState]

processResponse = (request, response, requestState) ->
	debugResponse "processing response, got status code %s", response.statusCode

	# When we receive the response, we'll buffer it up and/or decode it, depending on what the user specified, and resolve the returned Promise. If the user just wants the raw stream, we resolve immediately after receiving a response.

	Promise.try ->
		# First, if a cookie jar is set and we received one or more cookies from the server, we should store them in our cookieJar.
		if request.cookieJar? and response.headers["set-cookie"]?
			promises = for cookieHeader in response.headers["set-cookie"]
				debugResponse "storing cookie: %s", cookieHeader
				request.cookieJar.set cookieHeader, request.url
			Promise.all promises
		else
			Promise.resolve()
	.then ->
		# Now the actual response processing.
		response.request = request
		response.requestState = requestState
		response.redirectHistory = requestState.redirectHistory

		if response.statusCode in [301, 302, 303, 307] and request.responseOptions.followRedirects
			if requestState.redirectHistory.length >= (request.responseOptions.redirectLimit - 1)
				return Promise.reject addErrorData(new bhttpErrors.RedirectError("The maximum amount of redirects ({request.responseOptions.redirectLimit}) was reached."))

			# 301: For GET and HEAD, redirect unchanged. For POST, PUT, PATCH, DELETE, "ask user" (in our case: throw an error.)
			# 302: Redirect, change method to GET.
			# 303: Redirect, change method to GET.
			# 307: Redirect, retain method. Make same request again.
			switch response.statusCode
				when 301
					switch request.options.method
						when "get", "head"
							return redirectUnchanged request, response, requestState
						when "post", "put", "patch", "delete"
							return Promise.reject addErrorData(new bhttpErrors.RedirectError("Encountered a 301 redirect for POST, PUT, PATCH or DELETE. RFC says we can't automatically continue."), request, response, requestState)
						else
							return Promise.reject addErrorData(new bhttpErrors.RedirectError("Encountered a 301 redirect, but not sure how to proceed for the #{request.options.method.toUpperCase()} method."))
				when 302, 303
					return redirectGet request, response, requestState
				when 307
					if request.containsStreams and request.options.method not in ["get", "head"]
						return Promise.reject addErrorData(new bhttpErrors.RedirectError("Encountered a 307 redirect for POST, PUT or DELETE, but your payload contained (single-use) streams. We therefore can't automatically follow the redirect."), request, response, requestState)
					else
						return redirectUnchanged request, response, requestState
		else if request.responseOptions.discardResponse
			response.pipe(devNull()) # Drain the response stream
			Promise.resolve response
		else
			totalBytes = response.headers["content-length"]
			if totalBytes? # Otherwise `undefined` will turn into `NaN`, and we don't want that.
				totalBytes = parseInt(totalBytes)
			completedBytes = 0

			progressStream = sink (chunk) ->
				completedBytes += chunk.length
				response.emit "progress", completedBytes, totalBytes

			if request.responseOptions.onDownloadProgress?
				response.on "progress", (completedBytes, totalBytes) ->
					request.responseOptions.onDownloadProgress(completedBytes, totalBytes, response)

			new Promise (resolve, reject) ->
				# This is a very, very dirty hack - however, using .pipe followed by .pause breaks in Node.js v0.10.35 with "Cannot switch to old mode now". Our solution is to monkeypatch the `on` and `resume` methods to attach the progress event handler as soon as something else is attached to the response stream (or when it is drained). This way, a user can also pipe the response in a later tick, without the stream draining prematurely.
				_resume = response.resume.bind(response)
				_on = response.on.bind(response)
				_progressStreamAttached = false

				attachProgressStream = ->
					# To keep this from sending us into an infinite loop.
					if not _progressStreamAttached
						debugResponse "attaching progress stream"
						_progressStreamAttached = true
						response.pipe(progressStream)

				response.on = (eventName, handler) ->
					debugResponse "'on' called, #{eventName}"
					if eventName == "data" or eventName == "readable"
						attachProgressStream()
					_on(eventName, handler)

				response.resume = ->
					attachProgressStream()
					_resume()

				# Continue with the regular response processing.
				if request.responseOptions.stream
					resolve response
				else
					response.on "error", (err) ->
						reject err

					response.pipe concatStream (body) ->
						# FIXME: Separate module for header parsing?
						if request.responseOptions.decodeJSON or ((response.headers["content-type"] ? "").split(";")[0] == "application/json" and not request.responseOptions.noDecode)
							try
								response.body = JSON.parse body
							catch err
								reject err
						else
							response.body = body

						resolve response

	.then (response) ->
		Promise.resolve [request, response, requestState]

# Some wrappers

doPayloadRequest = (url, data, options, callback) ->
	# A wrapper that processes the second argument to .post, .put, .patch shorthand API methods.
	# FIXME: Treat a {} for data as a null? Otherwise {} combined with inputBuffer/inputStream will error.
	if isStream(data)
		options.inputStream = data
	else if ofTypes(data, [Buffer]) or typeof data == "string"
		options.inputBuffer = data
	else
		options.formFields = data

	@request url, options, callback

redirectGet = (request, response, requestState) ->
	debugResponse "following forced-GET redirect to %s", response.headers["location"]
	Promise.try ->
		options = _.clone(requestState.originalOptions)
		options.method = "get"

		delete options[key] for key in ["inputBuffer", "inputStream", "files", "formFields"]

		doRedirect request, response, requestState, options

redirectUnchanged = (request, response, requestState) ->
	debugResponse "following same-method redirect to %s", response.headers["location"]
	Promise.try ->
		options = _.clone(requestState.originalOptions)
		doRedirect request, response, requestState, options

doRedirect = (request, response, requestState, newOptions) ->
	Promise.try ->
		if not request.responseOptions.keepRedirectResponses
			response.pipe(devNull()) # Let the response stream drain out...

		requestState.redirectHistory.push response
		bhttpAPI._doRequest urlUtil.resolve(request.url, response.headers["location"]), newOptions, requestState

createCookieJar = (jar) ->
	# Creates a cookie jar wrapper with a simplified API.
	return {
		set: (cookie, url) ->
			new Promise (resolve, reject) =>
				@jar.setCookie cookie, url, (err, cookie) ->
					if err then reject(err) else resolve(cookie)
		get: (url) ->
			new Promise (resolve, reject) =>
				@jar.getCookieString url, (err, cookies) ->
					if err then reject(err) else resolve(cookies)
		jar: jar
	}

# The exposed API

bhttpAPI =
	head: (url, options = {}, callback) ->
		options.method = "head"
		@request url, options, callback
	get: (url, options = {}, callback) ->
		options.method = "get"
		@request url, options, callback
	post: (url, data, options = {}, callback) ->
		options.method = "post"
		doPayloadRequest.bind(this) url, data, options, callback
	put: (url, data, options = {}, callback) ->
		options.method = "put"
		doPayloadRequest.bind(this) url, data, options, callback
	patch: (url, data, options = {}, callback) ->
		options.method = "patch"
		doPayloadRequest.bind(this) url, data, options, callback
	delete: (url, options = {}, callback) ->
		options.method = "delete"
		@request url, options, callback
	request: (url, options = {}, callback) ->
		@_doRequest(url, options).nodeify(callback)
	_doRequest: (url, options, requestState) ->
		# This is split from the `request` method, so that the user doesn't have to pass in `undefined` for the `requestState` when they want to specify a `callback`.
		Promise.try =>
			request = {url: url, options: _.clone(options)}
			response = null
			requestState ?= {originalOptions: _.clone(options), redirectHistory: []}
			requestState.sessionOptions ?= @_sessionOptions ? {}

			prepareRequest request, response, requestState
		.spread (request, response, requestState) =>
			if request.responseOptions.justPrepare
				Promise.resolve [request, response, requestState]
			else
				Promise.try ->
					bhttpAPI.executeRequest request, response, requestState
				.spread (request, response, requestState) ->
					# The user likely only wants the response.
					Promise.resolve response
	executeRequest: (request, response, requestState) ->
		# Executes a pre-configured request.
		Promise.try ->
			makeRequest request, response, requestState
		.spread (request, response, requestState) ->
			processResponse request, response, requestState
	session: (options) ->
		options ?= {}
		options = _.clone options
		session = {}

		for key, value of this
			if value instanceof Function
				value = value.bind(session)
			session[key] = value

		if not options.cookieJar?
			options.cookieJar = createCookieJar(new toughCookie.CookieJar())
		else if options.cookieJar == false
			delete options.cookieJar
		else
			# Assume we've gotten a cookie jar.
			options.cookieJar = createCookieJar(options.cookieJar)

		session._sessionOptions = options

		return session
	wrapStream: (stream, options) ->
		# This is a method for wrapping a stream in an object that also contains metadata.
		return {
			_bhttpStreamWrapper: true
			stream: stream
			options: options
		}

extend(bhttpAPI, bhttpErrors)

module.exports = bhttpAPI

# That's all, folks!
