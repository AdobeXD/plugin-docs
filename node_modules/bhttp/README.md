# bhttp

A sane HTTP client library for Node.js with Streams2 support.

[![](//img.shields.io/gratipay/joepie91.svg)](https://gratipay.com/joepie91)

## Why bhttp?

There are already a few commonly used HTTP client libraries for Node.js, but all of them have issues:

* The core `http` module is rather low-level, and even relatively simple requests take a lot of work to make correctly. It also automatically uses a limited amount of agents for HTTP requests (in Node.js 0.10), which slows down concurrent HTTP requests when you're streaming the responses somewhere.
* `request` is buggy, only supports old-style streams, has the same 'agent' problem as `http`, the documentation is poor, and the API is not very intuitive.
* `needle` is a lot simpler, but suffers from the same 'agent' problem, and the API can be a bit annoying in some ways. It also doesn't have a proper session API.
* `hyperquest` (mostly) solves the 'agent' problem correctly, but has a very spartan API. Making non-GET requests is more complex than it should be.

All these issues (and more) are solved in `bhttp`. It offers the following:

* A simple, well-documented API.
* Sane default behaviour.
* Minimal behind-the-scenes 'magic', meaning less opportunities for bugs to be introduced. No 'gotchas' in dealing with response streams either.
* Support for `multipart/form-data` (eg. file uploads), __with support for Streams2__, and support for legacy streams.
* Fully automatic detection of desired payload type - URL-encoded, multipart/form-data, or even a stream or Buffer directly. Just give it the data you want to send, and it will make sure it arrives correctly. Optionally, you can also specify JSON encoding (for JSON APIs).
* Easy-to-use session mechanics - a new session will automatically give you a new cookie jar, cookies are kept track of automatically, and 'default options' are deep-merged.
* Streaming requests are kept out of the agent pool - ie. no blocking of other requests.
* Optionally, a Promises API (you can also use nodebacks).
* Progress events! For both uploading and downloading.

## Caveats

`bhttp` does not yet use a HTTPS-capable agent. This means that all SSL-related options are currently ignored by default (per Node.js `http` documentation).

__This does *not* mean that you cannot use `bhttp` for HTTPS requests!__ If you need secure HTTPS requests, just make sure to specify a [custom `https` agent](https://nodejs.org/api/https.html#https_class_https_agent).

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

My income consists entirely of donations for my projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate using Bitcoin, PayPal, Gratipay, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the `.coffee` files, not the `.js` files.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

A simple example:

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

Promise.try(function() {
	return bhttp.get("http://icanhazip.com/");
}).then(function(response) {
	console.log("Your IP is:", response.body.toString());
});
```

... or, using nodebacks:

```javascript
var bhttp = require("bhttp");

bhttp.get("http://icanhazip.com/", {}, function(err, response) {
	console.log("Your IP is:", response.body.toString());
});
```

### Streaming

Demonstrating both streaming responses and using a stream in form data for a request:

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

Promise.try(function() {
	return bhttp.get("http://somesite.com/bigfile.mp4", {stream: true});
}).then(function(response) {
	return bhttp.post("http://somehostingservice.com/upload", {
		fileOne: response,
		fileTwo: fs.createReadStream("./otherbigfile.mkv")
	});
}).then(function(response) {
	console.log("Response from hosting service:", response.body.toString());
});
```

... or, using nodebacks:

```javascript
var bhttp = require("bhttp");

bhttp.get("http://somesite.com/bigfile.mp4", {stream: true}, function(err, responseOne) {
	var payload = {
		fileOne: responseOne,
		fileTwo: fs.createReadStream("./otherbigfile.mkv")
	};

	bhttp.post("http://somehostingservice.com/upload", payload, {}, function(err, responseTwo) {
		console.log("Response from hosting service:", responseTwo.body.toString());
	})
})
```

### Progress events

Upload progress events:

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

Promise.try(function() {
	return bhttp.post("http://somehostingservice.com/upload", {
		file: fs.createReadStream("./bigfile.mkv")
	}, {
		onUploadProgress: function(completedBytes, totalBytes) {
			console.log("Upload progress:", (completedBytes / totalBytes * 100), "%");
		}
	});
}).then(function(response) {
	console.log("Response from hosting service:", response.body.toString());
});
```

Download progress events:

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

Promise.try(function() {
	return bhttp.get("http://somehostingservice.com/bigfile.mkv", {stream: true});
}).then(function(response) {
	response.on("progress", function(completedBytes, totalBytes) {
		console.log("Download progress:", (completedBytes / totalBytes * 100), "%");
	});

	response.pipe(fs.createWriteStream("./bigfile.mkv"));
});
```

### Sessions

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

var session = bhttp.session({ headers: {"user-agent": "MyCustomUserAgent/2.0"} });

// Our new session now automatically has a cookie jar, and also uses our preset option(s).

Promise.try(function(){
	return session.get("http://hypotheticalsite.com/cookietest"); // Assume that this site now sets a cookie
}).then(function(response){
	return session.get("http://hypotheticalsite.com/other-endpoint"); // This now sends along the cookie!
});
```

## API

The various error types are documented at the bottom of this README.

### bhttp.head(url, [options, [callback]])
### bhttp.get(url, [options, [callback]])
### bhttp.delete(url, [options, [callback]])
### bhttp.post(url, [data, [options, [callback]]])
### bhttp.put(url, [data, [options, [callback]]])
### bhttp.patch(url, [data, [options, [callback]]])

Convenience methods that pre-set the request method, and automatically send along the payload using the correct options for `bhttp.request`.

* __url__: The URL to request, with protocol. When using HTTPS, please be sure to read the 'Caveats' section.
* __data__: *Optional, only for POST/PUT/PATCH.* The payload to send along.
* __options__: *Optional.* Extra options for the request. More details under the documentation for the `bhttp.request` method below.
* __callback__: *Optional.* When using the nodeback API, the callback to use. If not specified, a Promise will be returned.

The `data` payload can be one of the following things:

* __String / Buffer__: The contents will be written to the request as-is.
* __A stream__: The entire stream will be written to the request as-is.
* __An object__: Will be encoded as form data, and can contain any combination of Strings, Buffers, streams, and arrays of any of those. When only strings are used, the form data is querystring-encoded - if Buffers or streams are used, it will be encoded as multipart/form-data.

Further documentation for these methods, such as the response attributes, can be found in the below section for `bhttp.request`.

### bhttp.request(url, [options, [callback]])

Makes a request, and returns the response object asynchronously. The response object is a standard `http.IncomingMessages` with a few additional properties (documented below the argument list).

Note that (progress) event handlers must be specified in the `options` or (in the case of download progress events) as an event listener on the response object - as `bhttp` uses Promises, it is not technically possible to return an EventEmitter.

* __url__: The URL to request, with protocol. When using HTTPS, please be sure to read the 'Caveats' section.
* __options__: *Optional.* Extra options for the request. Any other options not listed here will be passed on directly to the `http` or `https` module.
	* __Basic options__
		* __stream__: *Defaults to `false`.* Whether the response is meant to be streamed. If `true`, the response body won't be parsed, an unread response stream is returned, and the request is kept out of the 'agent' pool.
		* __headers__: Any extra request headers to set. (Non-custom) header names must be lowercase.
		* __followRedirects__: *Defaults to `true`.* Whether to automatically follow redirects or not (the redirect history is available as the `redirectHistory` property on the response).
		* __redirectLimit__: *Defaults to `10`.* The maximum amount of redirects to follow before erroring out, to prevent redirect loops.
	* __Encoding and decoding__
		* __forceMultipart__: *Defaults to `false`.* Ensures that `mulipart/form-data` encoding is used, no matter what the payload contents are.
		* __encodeJSON__: *Defaults to `false`.* When set to `true`, the request payload will be encoded as JSON. This cannot be used if you are using any streams in your payload.
		* __decodeJSON__: *Defaults to `false`.* When set to `true`, the response will always be decoded as JSON, no matter what the `Content-Type` says. You'll probably want to keep this set to `false` - most APIs send the correct `Content-Type` headers, and in those cases `bhttp` will automatically decode the response as JSON.
		* __noDecode__: *Defaults to `false`.* Never decode the response, even if the `Content-Type` says that it's JSON.
	* __Request payloads__ (you won't need these when using the shorthand methods)
		* __inputBuffer__: A Buffer or String to send as the entire payload.
		* __inputStream__: A stream to send as the entire payload.
		* __formFields__: Form data to encode. This can also include files to upload.
		* __files__: Form data to send explicitly as a file. This will automatically enable `multipart/form-data` encoding.
	* __Advanced options__
		* __method__: The request method to use. You don't need this when using the shorthand methods.
		* __cookieJar__: A custom cookie jar to use. You'll probably want to use `bhttp.session()` instead.
		* __responseTimeout__: The timeout, in milliseconds, after which the request should be considered to have failed if no response is received yet. Note that this measures from the start of the request to the start of the response, and is *not* a connection timeout. If a timeout occurs, a ResponseTimeoutError will be thrown asynchronously (see error documentation below).
		* __allowChunkedMultipart__: *Defaults to `false`.* Many servers don't support `multipart/form-data` when it is transmitted with chunked transfer encoding (eg. when the stream length is unknown), and silently fail with an empty request payload - this is why `bhttp` disallows it by default. If you are *absolutely certain* that the endpoint supports this functionality, you can override the behaviour by setting this to `true`.
		* __discardResponse__: *Defaults to `false`.* Whether to throw away the response without reading it. Only really useful for fire-and-forget calls. This is almost never what you want.
		* __keepRedirectResponses__: *Defaults to `false`.* Whether to keep the response streams of redirects. You probably don't need this. __When enabling this, you must *explicitly* read out every single redirect response, or you will experience memory leaks!__
		* __justPrepare__: *Defaults to `false`.* When set to `true`, bhttp just prepares the request, and doesn't actually carry it out; useful if you want to make some manual modifications. Instead of a response, the method will asynchronously return an array with the signature `[request, response, requestState]` that you will need to pass into the `bhttp.makeRequest()` method.
	* __Event handlers__
		* __onUploadProgress__: A callback to call for upload progress events (this covers both input streams and form data). The callback signature is `(completedBytes, totalBytes, request)`. If the total size is not known, `totalBytes` will be `undefined`. The `request` variable will hold the request object that the progress event applies to - this is relevant when dealing with automatic redirect following, where multiple requests may occur.
		* __onDownloadProgress__: A callback to call for download progress events. The callback signature is `(completedBytes, totalBytes, response)`. If the total size is not known, `totalBytes` will be `undefined`. The `response` variable will hold the response object that the progress event applies to - this is relevant when dealing with automatic redirect following, where multiple responses may occur. *Note that using the `progress` event on a response object is usually a more practical option!*

* __callback__: *Optional.* When using the nodeback API, the callback to use. If not specified, a Promise will be returned.

A few extra properties are set on the response object (which is a `http.IncomingMessage`):

* __body__: When `stream` is set to `false` (the default), this will contain the response body. This can be either a Buffer or, in the case of a JSON response, a decoded JSON object.
* __redirectHistory__: An array containing the redirect responses, if any, in chronological order. Response bodies are discarded by default; if you do not want this, use the `keepRedirectResponses` option.
* __request__: The request configuration that was generated by `bhttp`. You probably don't need this.
* __requestState__: The request state that was accumulated by `bhttp`. You probably don't need this.

Additionally, there's an extra event on the `response` object:

* __'progress' (completedBytes, totalBytes)__: The 'download progress' for the response body. This works the same as the `onDownloadProgress` option, except the event will be specific to this response, and it allows for somewhat nicer syntax. Make sure to attach this handler *before* you start reading the response stream!

`bhttp` can automatically parse the metadata for the following types of streams:

* `fs` streams
* `http` and `bhttp` responses
* `request` requests
* `combined-stream` streams (assuming all the underlying streams are of one of the types listed here)

If you are using a different type of stream, you can wrap the stream using `bhttp.wrapStream` to manually specify the needed metadata.

### bhttp.session([defaultOptions])

This will create a new session. The `defaultOptions` will be deep-merged with the options specified for each request (where the request-specific options have priority).

A new cookie jar is automatically created, unless you either specify a custom `cookieJar` option or set the `cookieJar` option to `false` (in which case no cookie jar is used).

### bhttp.wrapStream(stream, options)

This will return a 'stream wrapper' containing explicit metadata for a stream. You'll need to use it when passing an unsupported type of stream to a `data` parameter or `formFields`/`files` option.

* __stream__: The stream to wrap.
* __options__: The options for this stream. All options are optional, but recommended to specify.
	* __contentLength__: The length of the stream in bytes.
	* __contentType__: The MIME type of the stream.
	* __filename__: The filename of the stream.

The resulting wrapper can be passed on to the `bhttp` methods as if it were a regular stream.

### bhttp.makeRequest(request, response, requestState)

When using the `justPrepare` option, you can use this method to proceed with the request after manual modifications. The function signature is identical to the signature of the array returned when using `justPrepare`. `response` will usually be `null`, but must be passed on as is, to account for future API changes.

## Error types

All these correctly extend the `Error` class - this means that you can use them as a `.catch` predicate when using Promises, and that you can use `instanceof` on them when using the nodeback API.

### bhttp.bhttpError

The base class for all errors generated by `bhttp`. You usually don't need this.

### bhttp.ConflictingOptionsError

You have specified two or more request options that cannot be used together.

The error message will contain more details.

### bhttp.UnsupportedProtocolError

You tried to load a URL that isn't using either the HTTP or HTTPS protocol. Only HTTP and HTTPS are currently supported.

### bhttp.RedirectError

A redirect was encountered that could not be followed.

This could be because the redirect limit was reached, or because the HTTP specification doesn't allow automatic following of the redirect that was encountered.

The error message will contain more details.

### bhttp.MultipartError

Something went wrong while generating the multipart/form-data stream.

Currently, this will only be thrown if you try to use chunked transfer encoding for a multipart stream - a common situation where this can occur, is when you pass in streams with an unknown length.

To resolve this error, you must either explicitly specify the length of the streams using `bhttp.wrapStream` or, if the target server supports it, enable the `allowChunkedMultipart` option.

### bhttp.ConnectionTimeoutError

The connection timed out.

The connection timeout is defined by the operating system, and cannot currently be overridden.

### bhttp.ResponseTimeoutError

The response timed out.

The response timeout can be specified using the `responseTimeout` option, and it is measured from the start of the request to the start of the response. If no response is received within the `responseTimeout`, a `ResponseTimeoutError` will be thrown asynchronously, and the request will be aborted.

__You should not set a `responseTimeout` for requests that involve large file uploads!__ Because a response can only be received *after* the request has completed, any file/stream upload that takes longer than the `responseTimeout`, will result in a `ResponseTimeoutError`.
