# http-equiv-refresh [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Parse an HTML meta refresh value.


## Installation

[Node.js](http://nodejs.org/) `>= 0.10` is required. To install, type this at the command line:
```shell
npm install http-equiv-refresh
```


## Usage
```js
var parseMetaRefresh = require("http-equiv-refresh");
 
parseMetaRefresh("5; url=http://domain.com/");
//=> { timeout:5, url:"http://domain.com/" }

parseMetaRefresh("5");
//=> { timeout:5, url:null }
```


[npm-image]: https://img.shields.io/npm/v/http-equiv-refresh.svg
[npm-url]: https://npmjs.org/package/http-equiv-refresh
[travis-image]: https://img.shields.io/travis/stevenvachon/http-equiv-refresh.svg
[travis-url]: https://travis-ci.org/stevenvachon/http-equiv-refresh
