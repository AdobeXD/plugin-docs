through2-spy
============

[![NPM](https://nodei.co/npm/through2-sink.png)](https://nodei.co/npm/through2-sink/)

This is a super thin wrapper around [through2](http://npm.im/through2) for creating simple 'terminus' streams, that do nothing but look at the chunk received.

This module is heavily based on Bryce B. Baril's [through2-spy](https://www.npmjs.com/package/through2-spy), with the `.push` call removed. Why? So that you can have the same functionality at the *end* of a pipeline, without buffering everything up. It was originally written to help implement progress events in [bhttp](https://www.npmjs.com/package/bhttp). If you were to just use `through2-spy` for this, then [this](https://github.com/joyent/node/issues/14477) would happen.

Pass a function to run as each chunk goes through your stream pipeline. Return an Error to abort the pipeline.

```js

var sink = require("through2-sink")

var count = 0
var countChunks = sink(function (chunk) {
  count++
})

// vs. with through2:
var countChunks = through2(function (chunk, encoding, callback) {
  count++
  return callback()
})

// Then use your sink:
source.pipe(countChunks)

// Additionally accepts `wantStrings` argument to conver buffers into strings
var nsaregex = /(open source)|(foss)|(node\.js)|(mods are asleep)|(post sinks)/i
var prizm = sink({wantStrings: true}, function (str) {
  var buggyWiretap = str.match(nsaregex)
  if (buggyWiretap) {
    this.emit("OMGTERRIST", buggyWiretap[0], str)
  }
})

prizm.on("OMGTERRIST", sendDrone(/* ... */))

internet.pipe(prizm) // can't have the terrists getting their packets!

// Return an Error to abort the pipeline
var Meter = sink.ctor({maxBytes: 1024, bytes: 0}, function (chunk) {
  this.options.bytes += chunk.length
  if (this.options.bytes >= this.options.maxBytes) return new Error("Over 1024 byte limit!")
})

var meter = new Meter()

```

API
---

`require("through2-sink")([options], fn)`
---

Create a `through2-sink` instance that will call `fn(chunk)` and then silently pass through data downstream.

`require("through2-sink").ctor([options], fn)`
---

Create a `through2-sink` Type that can be instantiated via `new Type()` or `Type()` to create reusable sinks.

`require("through2-sink").obj([options], fn)`
---

Create a `through2-sink` that defaults to `objectMode = true`.

`require("through2-sink").objCtor([options], fn)`
---

Create a `through2-sink` Type that defaults to `objectMode = true`.

Options
-------

  * wantStrings: Automatically call chunk.toString() for the super lazy.
  * all other through2 options

LICENSE
=======

MIT
