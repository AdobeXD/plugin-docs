# combined-stream2

A drop-in Streams2-compatible replacement for the `combined-stream` module.

Supports most of the `combined-stream` API. Automatically wraps Streams1 streams, so that they work as well.

Both Promises and nodebacks are supported.

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

My income consists entirely of donations for my projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate using Bitcoin, PayPal, Gratipay, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the `.coffee` files, not the `.js` files.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Migrating from `combined-stream`

Note that there are a few important differences between `combined-stream` and `combined-stream2`:

* You cannot supply strings, only Buffers and streams. This is because `combined-stream2` doesn't know what the encoding of your string would be, and can't guess safely. You will need to manually encode strings to a Buffer before passing them on to `combined-stream2`.
* The `pauseStreams` option does not exist. All streams are read lazily in non-flowing mode; that is, no data is read until something explicitly tries to read the combined stream.
* The `maxDataSize` option does not exist.
* The `.write()`, `.end()` and `.destroy()` methods are not (yet) implemented.
* There is a `.getCombinedStreamLength()` method that asynchronously returns the total length of all streams (or an error if it cannot be determined). __This method will 'resolve' all callback-supplied streams, as if the stream were being read.__

Most usecases will not be affected by these differences, but your mileage may vary.

## Using `combined-stream2` with `request`

__There's an important caveat when trying to append a `request` stream to a `combined-stream2`.__

Because `request` does a bunch of strange non-standard hackery with streams, it doesn't play nicely with `combined-stream2` (and many other writable/transform streams). For convenience, `combined-stream2` contains a built-in workaround using a `PassThrough` stream specifically for dealing with `request` streams, but __this workaround will likely result in the entire response being buffered into memory.__

Passing in response objects (that is, the object provided in the `response` event handler for a `request` call) is *completely unsupported* - trying to do so will likely break `combined-stream2`. You *must* pass in the `request` object, rather than the `response` object.

I seriously suggest you consider using [`bhttp`](https://www.npmjs.com/package/bhttp) instead - it has much more predictable behaviour.

## Usage

```javascript
var CombinedStream = require('combined-stream2');
var fs = require('fs');

var combinedStream = CombinedStream.create();
combinedStream.append(fs.createReadStream('file1.txt'));
combinedStream.append(fs.createReadStream('file2.txt'));

combinedStream.pipe(fs.createWriteStream('combined.txt'));
```

### Appending a stream asynchronously (lazily)

The function will only be called when you try to either read/pipe the combined stream, or retrieve the total stream length.
```javascript
combinedStream.append(function(next){
	next(fs.createReadStream('file3.txt'));
});
```

### Getting the combined length of all streams

See the API documentation below for more details.

```javascript
Promise = require("bluebird");

Promise.try(function(){
	combinedStream.getCombinedStreamLength()
}).then(function(length){
	console.log("Total stream length is " + length + " bytes.");
}).catch(function(err){
	console.log("Could not determine the total stream length!");
});
```

... or using nodebacks:

```javascript
combinedStream.getCombinedStreamLength(function(err, length){
	if(err) {
		console.log("Could not determine the total stream length!");
	} else {
		console.log("Total stream length is " + length + " bytes.");
	}
});
```

## API

Since `combined-stream2` is a `stream.Readable`, it inherits the [regular Readable stream properties](http://nodejs.org/api/stream.html#stream_class_stream_readable). Aside from that, the following methods exist:

### CombinedStream.create()

Creates and returns a new `combinedStream`. Contrary to the `.create()` method for the original `combined-stream` module, this method does not accept options.

### combinedStream.append(source, [options])

Adds a source to the combined stream. Valid sources are streams, Buffers, and callbacks that return either of the two (asynchronously).

* __source__: The source to add.
* __options__: *Optional.* Additional stream options.
	* __contentLength__: The length of the stream. Useful if your stream type is not supported by [`stream-length`](https://www.npmjs.com/package/stream-length), but you know the length of the stream in advance. Also available as `knownLength` for backwards compatibility reasons.

### combinedStream.getCombinedStreamLength([callback])

__This method will 'resolve' all callback-supplied streams, as if the stream were being read.__

Asynchronously returns the total length of all streams (and Buffers) together. If the total length cannot be determined (ie. at least one of the streams is of an unsupported type), an error is thrown asynchronously.

If you specify a `callback`, it will be treated as a nodeback. If you do *not* specify a `callback`, a Promise will be returned.

This functionality uses the [`stream-length`](https://www.npmjs.com/package/stream-length) module.

### combinedStream.pipe(target)

Like for other Streams2 Readable streams, this will start piping the combined stream contents into the `target` stream.

After calling this, you can no longer append new streams.
