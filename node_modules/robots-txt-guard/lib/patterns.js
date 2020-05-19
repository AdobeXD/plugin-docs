'use strict';

// translates a robots.txt glob patterns to regexes

function escapeRegExp(regexString) {
  return regexString
    .replace(/[\*\/\-\[\]\{\}\(\)\+\?\.\,\\\^\$\|\#]/g, '\\$&');
}

exports.path = function makePathPattern(pattern) {
  var firstChar = pattern[0],
      lastChar  = pattern[pattern.length - 1],      
      matchEnd  = lastChar === '$';

  if (firstChar !== '/') {
    pattern = '/' + pattern;
  }

  // strip last character if $
  pattern = pattern.replace(/\$$/, '');

  // wildcards are ignored in specificity
  var specificityString = pattern.replace(/\*/g, '');

  pattern = pattern
    .split('*')
    .map(escapeRegExp)
    .join('(?:.*)');

  pattern = '^' + pattern;
  if (matchEnd) {
    pattern += '$';
  }

  var regexp = new RegExp(pattern);

  function test(path) {
    return regexp.test(path);
  }

  return {
    specificity: specificityString.length,
    test: test
  };
};

function alwaysTrue() {
  return true;
}

exports.userAgent = function makeUserAgentPattern(pattern) {
  if (pattern === '*') {
    return {
      specificity: 0,
      test: alwaysTrue
    };
  }

  var specificityString = pattern;

  pattern = escapeRegExp(pattern);

  var regexp = new RegExp(pattern, 'i');

  function test(path) {
    return regexp.test(path);
  }

  return {
    specificity: specificityString.length,
    test: test
  };
};
