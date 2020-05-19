# limited-request-queue [![NPM Version][npm-image]][npm-url] [![Bower Version][bower-image]][bower-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

> Interactively manage concurrency for outgoing requests.

Features:
* Concurrency & rate limiting prevents overload on your server
* Per-Host concurrency limiting prevents overload on everyone else's server
* Pause/Resume at any time
* Works in the browser (~6.5KB)

```js
// Will work with any similar module, not just "request"
var request = require("request");
var RequestQueue = require("limited-request-queue");

var queue = new RequestQueue(null, {
	item: function(input, done) {
		request(input.url, function(error, response) {
			done();
		});
	},
	end: function() {
		console.log("Queue completed!");
	}
});

var urls = ["http://website.com/dir1/", "http://website.com/dir2/"];
urls.forEach(queue.enqueue, queue);

setTimeout(queue.pause, 500);
setTimeout(queue.resume, 5000);
```


## Installation

[Node.js](http://nodejs.org/) `>= 0.10` is required; `< 4.0` will need an `Object.assign` polyfill. To install, type this at the command line:
```shell
npm install limited-request-queue --save-dev
```


## Constructor
```js
new RequestQueue(options, handlers);
```


## Methods

### .dequeue(id)
Removes a queue item from the queue. Use of this function is likely not needed as items are auto-dequeued when their turn is reached. Returns `true` on success or an `Error` on failure.

### .enqueue(input)
Adds a URL to the queue. `input` can either be a URL `String` or an `Object`. Returns a queue ID on success or an `Error` on failure.

If `input` is an `Object`, it will acccept the following keys:

* `url`: a URL `String` or [`url.parse()`](https://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost)-compatible `Object`.
* `data`: additional data to be stored in the queue item.
* `id`: a unique ID (`String` or `Number`). If not defined, one will be generated.

### .length()
Returns the total number of items in the queue, active and non-active.

### .numActive()
Returns the number of items whose requests are currently in progress.

### .numQueued()
Returns the number of items that have not yet made requests.

### .pause()
Pauses the queue, but will not pause any active requests.

### .resume()
Resumes the queue.


## Options

### options.ignorePorts
Type: `Boolean`  
Default value: `true`  
Whether or not to treat identical hosts of different ports as a single concurrent group. **Example:** when `true`, http://mywebsite.com:80 and http://mywebsite.com:8080 may not have outgoing connections at the same time, but http://mywebsite.com:80 and http://yourwebsite.com:8080 will.

### options.ignoreSchemes
Type: `Boolean`  
Default value: `true`  
Whether or not to treat identical hosts of different schemes/protocols as a single concurrent group. **Example:** when `true`, http://mywebsite.com and https://mywebsite.com may not have outgoing connections at the same time, but http://mywebsite.com and https://yourwebsite.com will.

### options.ignoreSubdomains
Type: `Boolean`  
Default value: `true`  
Whether or not to treat identical hosts of different subdomains as a single concurrent group. **Example:** when `true`, http://mywebsite.com and http://www.mywebsite.com may not have outgoing connections at the same time, but http://mywebsite.com and http://www.yourwebsite.com will.

This option is not available in the browser version (due to extreme file size).

### options.maxSockets
Type: `Number`  
Default value: `Infinity`  
The maximum number of connections allowed at any given time. A value of `0` will prevent anything from going out. A value of `Infinity` will provide no concurrency limiting.

### options.maxSocketsPerHost
Type: `Number`  
Default value: `1`  
The maximum number of connections per host allowed at any given time. A value of `0` will prevent anything from going out. A value of `Infinity` will provide no per-host concurrency limiting.

### options.rateLimit
Type: `Number`  
Default value: `0`  
The number of milliseconds to wait before each request. For a typical rate limiter, also set `maxSockets` to `1`.


## Handlers

### handlers.end
Called when the last item in the queue has been completed.

### handlers.item
Called when a queue item's turn has been reached. Arguments are: `input`, `done`.


[npm-image]: https://img.shields.io/npm/v/limited-request-queue.svg
[npm-url]: https://npmjs.org/package/limited-request-queue
[bower-image]: https://img.shields.io/bower/v/limited-request-queue.svg
[bower-url]: https://github.com/stevenvachon/limited-request-queue
[travis-image]: https://img.shields.io/travis/stevenvachon/limited-request-queue.svg
[travis-url]: https://travis-ci.org/stevenvachon/limited-request-queue
[david-image]: https://img.shields.io/david/stevenvachon/limited-request-queue.svg
[david-url]: https://david-dm.org/stevenvachon/limited-request-queue
