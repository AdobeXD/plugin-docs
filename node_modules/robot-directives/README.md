# robot-directives [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

> Parse robot directives within HTML meta and/or HTTP headers.

* `<meta name="robots" value="noindex,nofollow">`
* `X-Robots-Tag: noindex,nofollow`
* etc

Note: this library is not responsible for parsing any HTML.


## Installation

[Node.js](http://nodejs.org/) `>= 0.10` is required; `< 4.0` will need an `Object.assign` polyfill. To install, type this at the command line:
```shell
npm install robot-directives
```

## Usage
```js
var RobotDirectives = require("robot-directives");

var instance = new RobotDirectives(options);

instance.header("googlebot: noindex");
instance.meta("bingbot", "unavailable_after: 1-Jan-3000 00:00:00 EST");
instance.meta("robots", "noarchive,nocache,nofollow");

instance.is(RobotDirectives.NOFOLLOW);
//=> true

instance.is([ RobotDirectives.NOFOLLOW, RobotDirectives.FOLLOW ]);
//=> false

instance.isNot([ RobotDirectives.ARCHIVE, RobotDirectives.FOLLOW ]);
//=> true

instance.is(RobotDirectives.NOINDEX, {
	currentTime: function(){ return new Date("jan 1 3001").getTime() },
	userAgent: "Bingbot/2.0"
});
//=> true

RobotDirectives.isBot("googlebot");
//=> true
```


## Constants
Directives for use in comparison (and avoiding typos).
* `RobotDirectives.ALL`
* `RobotDirectives.ARCHIVE`
* `RobotDirectives.CACHE`
* `RobotDirectives.FOLLOW`
* `RobotDirectives.IMAGEINDEX`
* `RobotDirectives.INDEX`
* `RobotDirectives.NOARCHIVE`
* `RobotDirectives.NOCACHE`
* `RobotDirectives.NOFOLLOW`
* `RobotDirectives.NOIMAGEINDEX`
* `RobotDirectives.NOINDEX`
* `RobotDirectives.NONE`
* `RobotDirectives.NOODP`
* `RobotDirectives.NOSNIPPET`
* `RobotDirectives.NOTRANSLATE`
* `RobotDirectives.ODP`
* `RobotDirectives.SNIPPET`
* `RobotDirectives.TRANSLATE`


## Methods

### `.header(value)`
Parses, stores and cascades the value of an `X-Robots-Tag` HTTP header.

### `.is(directive[, options])`
Validates a directive or a list of directives against parsed instructions. `directive` can be a `String` or an `Array`. `options`, if defined, will override any such defined in the constructor during instantiation. A value of `true` is returned if all directives are valid.

### `.isNot(directive[, options])`
Inversion of `is()`. A value of `true` is returned if all directives are *not* valid.

### `.meta(name, content)`
Parses, stores and cascades the data within a `<meta>` HTML element.

### `.oneIs(directives[, options])`
A variation of `.is()`. A value of `true` is returned if at least one directive is valid.

### `.oneIsNot(directives[, options])`
Inversion of `oneIs()`. A value of `true` is returned if at least one directive is *not* valid.


## Functions

### `isBot(botname)`
Returns `true` if `botname` is a valid bot/crawler/spider name or user-agent.


## Options

### `options.allIsReadonly`
Type: `Boolean`  
Default value: `true`  
Declaring the `"all"` directive will not affect other directives when `true`. This is how most search crawlers perform.

### `options.currentTime`
Type: `Function`  
Default value: `function(){ return Date.now() }`  
The date to use when checking if `unavailable_after` has expired.

### `options.restrictive`
Type: `Boolean`  
Default value: `true`  
Directive conflicts will be resolved by selecting the most restrictive value. Example: `"noindex,index"` will resolve to `"noindex"` because it is more restrictive. This is how Googlebot behaves, but others may differ.

### `options.userAgent`
Type: `String`  
Default value: `""`  
The HTTP user-agent to use when retrieving instructions via `is()` and `isNot()`.


[npm-image]: https://img.shields.io/npm/v/robot-directives.svg
[npm-url]: https://npmjs.org/package/robot-directives
[travis-image]: https://img.shields.io/travis/stevenvachon/robot-directives.svg
[travis-url]: https://travis-ci.org/stevenvachon/robot-directives
[david-image]: https://img.shields.io/david/stevenvachon/robot-directives.svg
[david-url]: https://david-dm.org/stevenvachon/robot-directives
