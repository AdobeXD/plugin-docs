/* jshint globalstrict: true */
/* global require */
/* global module */
"use strict";

var tokenize = require("./lib/tokenize");
var match = require("./lib/match");

/**
 * Matches a pattern against a string.
 * "*" is a wildcard for any sequence of characters.
 *
 * @param {string} The pattern to match against
 * @param {string} The String to match
 * @returns {boolean}
 */
module.exports = function(pattern, str) {
    return match(
        tokenize(pattern),
        str
    );
};
