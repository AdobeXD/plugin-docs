# robots-txt-parse [![Build Status](https://travis-ci.org/Woorank/robots-txt-parse.svg)](https://travis-ci.org/Woorank/robots-txt-parse)

Streaming robots.txt parser

## usage

```js
var parse = require('robots-txt-parse'),
    fs    = require('fs');

parse(fs.createReadStream(__dirname + '/robots.txt'))
  .then(function (robots) {
    console.log(robots)
  });

```
assuming this file
```
user-agent: *
user-agent: googlebot
disallow: /

user-agent: twitterbot
disallow: /
allow: /twitter

Sitemap: http://www.example.com/sitemap.xml
```
produces following output
```json
{
  "groups": [{
    "agents": [ "*", "googlebot" ],
    "rules": [
      { "rule": "disallow", "path": "/" }
    ]
  }, {
    "agents": [ "twitterbot" ],
    "rules": [
      { "rule": "disallow", "path": "/" },
      { "rule": "allow", "path": "/twitter" }
    ]
  }],
  "extensions": [
    { "extension": "sitemap", "value": "http://www.example.com/sitemap.xml" }
  ]
}
```