/* jshint globalstrict: true */
/* global require */
/* global module */
"use strict";

var calmcard = require("../calmcard");

module.exports = {

    testNoWildcard: function(test) {
        test.expect(2);
        test.strictEqual(calmcard("foobar", "foobar"), true);
        test.strictEqual(calmcard("foobar", "something"), false);
        test.done();
    },

    testSingleWildcard: function(test) {
        test.expect(2);

        var pattern = "foo*bar";
        var correct = "foo123bar";
        var incorrect = "foobar";

        test.strictEqual(calmcard(pattern, correct), true);
        test.strictEqual(calmcard(pattern, incorrect), false);
        test.done();
    },

    testEscapedWildcard: function(test) {
        test.expect(2);

        var pattern = "foo*bar\\*bla";
        var correct = "foo123bar*bla";
        var incorrect = "foo123bar123bla";

        test.strictEqual(calmcard(pattern, correct), true);
        test.strictEqual(calmcard(pattern, incorrect), false);
        test.done();
    },

    testCollapseWildcards: function(test) {
        test.expect(2);

        var pattern = "foo****bar";
        var correct = "foo123bar";
        var incorrect = "foobar";

        test.strictEqual(calmcard(pattern, correct), true);
        test.strictEqual(calmcard(pattern, incorrect), false);
        test.done();
    },

    testWildCardAtBeginnig: function(test) {
        test.expect(2);
        test.strictEqual(calmcard("*bar", "foobar"), true);
        test.strictEqual(calmcard("*bar", "fooba"), false);
        test.done();
    },

    testWildCardAtEnd: function(test) {
        test.expect(2);

        var pattern = "foo*";
        var correct = "foobar";
        var incorrect = "fobar";

        test.strictEqual(calmcard("foo*", "foobar"), true);
        test.strictEqual(calmcard("foo*", "fobar"), false);
        test.done();
    },

    testEmptyPattern: function(test) {
        test.expect(2);
        test.strictEqual(calmcard("", ""), true);
        test.strictEqual(calmcard("", "foobar"), false);
        test.done();
    },

    testBackSlashes: function(test) {
        test.expect(4);
        test.strictEqual(calmcard("foo\\\\bar", "foo\\bar"), true);
        test.strictEqual(calmcard("foo\\\\\\*bar", "foo\\*bar"), true);
        test.strictEqual(calmcard("foo\\\\ \\*bar", "foo\\ *bar"), true);
        test.strictEqual(calmcard("foo\\\\bar", "foobar"), false);
        test.done();
    },

    testEmptyString: function(test) {
        test.expect(2);

        test.strictEqual(calmcard("", ""), true);
        test.strictEqual(calmcard("*", ""), false);
        test.done();
    },

    testComplexPattern: function(test) {
        test.expect(2);
        var pattern = "**foo**\\***bar***";
        test.strictEqual(calmcard(pattern, "123foo456*789bar0"), true);
        test.strictEqual(calmcard(pattern, "123foo45\\*789bar"), false);
        test.done();
    }
}
