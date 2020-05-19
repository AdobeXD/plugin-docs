# robots-txt-guard [![Build Status](https://travis-ci.org/Woorank/robots-txt-guard.svg)](https://travis-ci.org/Woorank/robots-txt-guard)

Validate urls against robots.txt rules. Configure with output from [robots-txt-parse](https://github.com/Woorank/robots-txt-parse/)

## Usage

```js
var guard = require('robots-txt-guard');

var robotsTxt = guard({
  groups: [{
    agents: [ '*' ],
    rules: [
      { rule: 'allow', path: '/' }
    ]
  }, {
    agents: [ 'googlebot', 'twitterbot' ],
    rules: [
      { rule: 'disallow', path: '/tmp/*' },
      { rule: 'disallow', path: '/temporary/*' }
    ]
  }]
});

robotsTxt.isAllowed('Googlebot', '/tmp/abc'); // false
robotsTxt.isAllowed('mozilla', '/tmp/abc'); // true
robotsTxt.isAllowed('googlebot-news', '/home.html'); // true
```
