# link-types [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Parse an HTML attribute value containing [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).


Note: this library is not responsible for parsing any HTML.


## Installation

[Node.js](http://nodejs.org/) `>= 0.10` is required. To install, type this at the command line:
```shell
npm install link-types
```


## Usage
```js
var linkTypes = require("link-types");

linkTypes("nofollow");
//=> ["nofollow"]
 
linkTypes(" tag  NOFOLLOW ");
//=> ["tag", "nofollow"]

linkTypes.map(" tag   NOFOLLOW ");
//=> { tag:true, nofollow:true }
```


[npm-image]: https://img.shields.io/npm/v/link-types.svg
[npm-url]: https://npmjs.org/package/link-types
[travis-image]: https://img.shields.io/travis/stevenvachon/link-types.svg
[travis-url]: https://travis-ci.org/stevenvachon/link-types
