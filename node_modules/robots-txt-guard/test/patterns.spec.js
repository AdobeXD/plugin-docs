/*global describe, it*/

'use strict';

var patterns = require('../lib/patterns'),
    assert = require('chai').assert;

// cases from:
// https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt

describe('patterns', function () {

  function assertMatch(pattern, string) {
    assert.ok(pattern.test(string), string);
  }

  function assertNoMatch(pattern, string) {
    assert.notOk(pattern.test(string), string);
  }

  describe('userAgent', function () {

    it('should match simple pattern', function () {
      var pattern = patterns.userAgent('googlebot-news');

      assert.strictEqual(pattern.specificity, 14);

      assertMatch(pattern, 'Googlebot-News');
      assertMatch(pattern, 'googlebot-news');
      assertMatch(pattern, 'agsfdgooglebot-newsdafdga');

      assertNoMatch(pattern, 'googlebot');
      assertNoMatch(pattern, 'Googlebot');
      assertNoMatch(pattern, 'woobot');
    });

    it('should match wildcard', function () {
      var pattern = patterns.userAgent('*');

      assert.strictEqual(pattern.specificity, 0);

      assertMatch(pattern, 'Googlebot-News');
      assertMatch(pattern, 'googlebot-news');
      assertMatch(pattern, 'googlebot');
      assertMatch(pattern, 'Googlebot');
      assertMatch(pattern, 'woobot');
    });

  });

  describe('path', function () {
    
    it('should match simple pattern', function () {
      var pattern = patterns.path('/fish');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/fish');
      assertMatch(pattern, '/fish.html');
      assertMatch(pattern, '/fish/salmon.html');
      assertMatch(pattern, '/fishheads');
      assertMatch(pattern, '/fishheads/yummy.html');
      assertMatch(pattern, '/fish.php?id=anything');

      assertNoMatch(pattern, '/Fish.asp');
      assertNoMatch(pattern, '/catfish');
      assertNoMatch(pattern, '/?id=fish');
    });
    
    it('should match ending wildcard', function () {
      var pattern = patterns.path('/fish*');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/fish');
      assertMatch(pattern, '/fish.html');
      assertMatch(pattern, '/fish/salmon.html');
      assertMatch(pattern, '/fishheads');
      assertMatch(pattern, '/fishheads/yummy.html');
      assertMatch(pattern, '/fish.php?id=anything');

      assertNoMatch(pattern, '/cat/fish/dog');
      assertNoMatch(pattern, '/Fish.asp');
      assertNoMatch(pattern, '/catfish');
      assertNoMatch(pattern, '/?id=fish');
    });
    
    it('should match trailing slash', function () {
      var pattern = patterns.path('/fish/');

      assert.strictEqual(pattern.specificity, 6);

      assertMatch(pattern, '/fish/');
      assertMatch(pattern, '/fish/?id=anything');
      assertMatch(pattern, '/fish/salmon.htm');

      assertNoMatch(pattern, '/fish');
      assertNoMatch(pattern, '/fish.html');
      assertNoMatch(pattern, '/Fish/Salmon.asp');
    });
    
    it('should handle missing start slash', function () {
      var pattern = patterns.path('fish/');

      assert.strictEqual(pattern.specificity, 6);

      assertMatch(pattern, '/fish/');
      assertMatch(pattern, '/fish/?id=anything');
      assertMatch(pattern, '/fish/salmon.htm');

      assertNoMatch(pattern, '/cat/fish/dog');
      assertNoMatch(pattern, '/fish');
      assertNoMatch(pattern, '/fish.html');
      assertNoMatch(pattern, '/Fish/Salmon.asp');
    });
    
    it('should handle wildcards', function () {
      var pattern = patterns.path('/*.php');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/filename.php');
      assertMatch(pattern, '/folder/filename.php');
      assertMatch(pattern, '/folder/filename.php?parameters');
      assertMatch(pattern, '/folder/any.php.file.html');
      assertMatch(pattern, '/filename.php/');

      assertNoMatch(pattern, '/');
      assertNoMatch(pattern, '/filenamephp');
      assertNoMatch(pattern, '/windows.PHP');
    });
    
    it('should handle end directive', function () {
      var pattern = patterns.path('/*.php$');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/filename.php');
      assertMatch(pattern, '/folder/filename.php');

      assertNoMatch(pattern, '/filename.php?parameters');
      assertNoMatch(pattern, '/filename.php/');
      assertNoMatch(pattern, '/filename.php5');
      assertNoMatch(pattern, '/windows.PHP');
    });
    
    it('should handle wildcards in the middle', function () {
      var pattern = patterns.path('/fish*.php');

      assert.strictEqual(pattern.specificity, 9);

      assertMatch(pattern, '/fish.php');
      assertMatch(pattern, '/fishheads/catfish.php?parameters');

      assertNoMatch(pattern, '/Fish.PHP');
    });
    
  });

});
