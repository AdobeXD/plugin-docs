calmcard
========

**not-so-wild wildcard string matching**

Calmcard provides a simple string pattern matching with `*` as the only special character which is a placeholder for
any sequence of characters, unless it is escaped.

Calmcard was made to have a `glob` like tool for arbitrary strings where slashes have no special meaning. It also does
explicitly not use regular expressions because of speed, proper escaping and because writing regular expression strings
in JavaScript gets messy and unreadable very quick.

## Examples

* `foo*bar` will match "foo123bar"
* `foo\*bar` will match "foo\*bar" but not "foo123bar"

## Installation

Currently, calmcard is built for node.js and available via NPM.

    npm install calmcard

## Usage

```js
    var calmcard = require("calmcard");

    calmcard("foo*bar", "foo123bar"); // -> true
    calmcard("foo*bar", "foobar"); // -> false
```
