# form-data2

A Streams2-compatible drop-in replacement for the `form-data` module. Through the wrapping done by the underlying `combined-stream2` module, old-style streams are also supported.

Takes a number of streams or Buffers, and turns them into a valid `multipart/form-data` stream.

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

My income consists entirely of donations for my projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate using Bitcoin, PayPal, Gratipay, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the `.coffee` files, not the `.js` files.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Migrating from `form-data`

While `form-data2` was designed to be roughly API-compatible with the `form-data` module, there are a few notable differences:

* `form-data2` does __not__ do HTTP requests. It is purely a multipart/form-data encoder. This means you should use a different module for your HTTP requests, such as [`bhttp`](https://www.npmjs.com/package/bhttp), [`request`](https://www.npmjs.com/package/request), or the core `http` module. `bhttp` uses `form-data2` internally - that means you won't have to manually use `form-data2`.
* The `header` option for the `form.append()` options object is not (yet) implemented. This means that you cannot currently set custom field headers.
* There is no `form.getLengthSync()` method. Length retrieval is always asynchronous.
* The `form.getHeaders` method is __always asynchronous__ (whereas in the original `form-data`, it is synchronous). Due to the requirements for obtaining the stream length reliably, there is no synchronous equivalent.
* A `form-data2` stream is not a real stream. Only the `form.pipe()` method is implemented, other stream methods are unavailable. This may change in the future.

## Usage

```javascript
var FormData = require('form-data2');
var fs = require('fs');

var form = new FormData();
form.append('my_field', 'my value');
form.append('my_buffer', new Buffer(10));
form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
```

### Getting the HTTP headers

```javascript
Promise = require("bluebird");
util = require("util");

Promise.try(function(){
	form.getHeaders();
}).then(function(headers){
	console.log("Stream headers:", util.inspect(headers));
}).catch(function(err){
	console.log("Something went wrong!");
});
```

... or using nodebacks:

```javascript
form.getHeaders(function(err, headers){
	if(err) {
		console.log("Something went wrong!");
	} else {
		console.log("Stream headers:", util.inspect(headers));
	}
});
```

## API

Note that this is __not__ a real stream, and does therefore not expose the regular `stream.Readable` properties. The `pipe` method will simply pipe the underlying `combined-stream2` stream into the specified target. If you want to access the stream directly for some reason, use `form._stream`.

### append(name, source, [options])

Adds a new data source to the multipart/form-data stream.

This module will *not* automatically handle arrays for you - if you need to send an array, you will need to call this method for each element individually, using the same `[]`-suffixed field name for each element.

* __name__: The name of the form field.
* __source__: The data source to add. This can be a stream, a Buffer, or a UTF-8 string.
* __options__: *Optional.* Additional options for the stream.
	* __contentLength__: The total length of the stream. Useful if your stream is of a type that [`stream-length`](https://www.npmjs.com/package/stream-length) can't automatically determine the length of. Also available under the alias `knownLength`, for backwards compatibility reasons.
	* __contentType__: The MIME type of the source. It's recommended to *always* specify this manually; however, if it's not supplied, `form-data2` will attempt to determine it for you where possible.
	* __filename__: The filename of the source, if it is a file or should be represented as such. It's recommended to *always* specify this manually (if the source is a file of some sort); however, if it's not supplied, `form-data2` will attempt to determine it for you where possible.

### getHeaders([callback])

Asynchronously returns the HTTP request headers that you will need to successfully transmit this stream, as an object.

All object keys are lower-case. To use the headers, simply merge them into the headers object for your request.

If you specify a `callback`, it will be treated as a nodeback. If you do *not* specify a `callback`, a Promise will be returned.

### pipe(target)

Pipes the `multipart/form-data` stream into the `target` stream.

### done()

__You probably don't need to call this.__

Calling this method will append the multipart/form-data footer to the stream. It is called automatically when you `pipe` the stream into something else.

### getBoundary()

__You probably don't need to call this.__

Returns the form boundary used in the `multipart/form-data` stream.

### getLength([callback])

__You probably don't need to call this.__

Asynchronously returns the total length of the stream in bytes.

If you specify a `callback`, it will be treated as a nodeback. If you do *not* specify a `callback`, a Promise will be returned.
