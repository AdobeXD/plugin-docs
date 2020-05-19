# maybe-callback [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Maybe call a callback if it really is who it says it is.


## Installation

[Node.js](http://nodejs.org/) is required. To install, type this at the command line:
```shell
npm install maybe-callback
```


## Usage
```js
var maybeCallback = require('maybe-callback');
 
function callback(arg) {
    return arg + 1;
}

maybeCallback(callback)(1);  //=> 2
maybeCallback(null)(1);  //=> undefined

var once = maybeCallback.once(callback);
once(1); //=> 2
once(1); //=> undefined
```


[npm-image]: https://img.shields.io/npm/v/maybe-callback.svg
[npm-url]: https://npmjs.org/package/maybe-callback
[travis-image]: https://img.shields.io/travis/robskillington/maybe-callback.svg
[travis-url]: https://travis-ci.org/robskillington/maybe-callback
