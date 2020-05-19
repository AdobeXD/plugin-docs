/*global describe, it*/

'use strict';

var parse = require('../lib/parse'),
    fs = require('fs'),
    path = require('path'),
    assert = require('chai').assert;


function getFixture(name) {
  var fixturePath = path.resolve(__dirname, 'fixtures', name + '.txt'),
      stream = fs.createReadStream(fixturePath);
  stream.pause();
  return stream;
}


describe('parser', function () {
  
  it('should parse a simple group', function (done) {
    parse(getFixture('single-group'))
      .then(function (parsed) {
        assert.isObject(parsed);
        assert.property(parsed, 'groups');
        assert.isArray(parsed.groups);
        assert.lengthOf(parsed.groups, 1);
        var group = parsed.groups[0];
        assert.isObject(group);
        
        assert.property(group, 'agents');
        assert.isArray(group.agents);
        assert.lengthOf(group.agents, 1);
        assert.strictEqual(group.agents[0], '*');
        
        assert.property(group, 'rules');
        assert.isArray(group.rules);
        assert.lengthOf(group.rules, 1);
        var rule = group.rules[0];
        
        assert.isObject(rule);
        assert.propertyVal(rule, 'rule', 'disallow');
        assert.propertyVal(rule, 'path', '/');
        
        done();
      })
      .catch(done);
  });
  
  it('should parse multiple agents', function (done) {
    parse(getFixture('multiple-agents'))
      .then(function (parsed) {
        assert.deepPropertyVal(parsed, 'groups[0].agents[0]', '*');
        assert.deepPropertyVal(parsed, 'groups[0].agents[1]', 'agent1');
        assert.deepPropertyVal(parsed, 'groups[0].agents[2]', 'agent2');
        
        done();
      })
      .catch(done);
  });
  
  it('should ignore group members outside of a group', function (done) {
    parse(getFixture('member-outside'))
      .then(function (parsed) {
        assert.deepPropertyVal(parsed, 'groups[0].agents[0]', '*');
        assert.lengthOf(parsed.groups[0].agents, 1);
        
        done();
      })
      .catch(done);
  });
  
  it('should parse extensions', function (done) {
    parse(getFixture('with-sitemap'))
      .then(function (parsed) {
        assert.deepPropertyVal(parsed, 'extensions[0].extension', 'sitemap');
        assert.deepPropertyVal(parsed, 'extensions[0].value', '/sitemap.xml');
        assert.deepPropertyVal(parsed, 'extensions[1].extension', 'sitemap');
        assert.deepPropertyVal(parsed, 'extensions[1].value', 'http://example.com/alt_sitemap.xml');
        done();
      })
      .catch(done);
  });
  
  it('should parse multiple groups', function (done) {
    parse(getFixture('multiple-groups'))
      .then(function (parsed) {
        assert.deepPropertyVal(parsed, 'groups[0].agents[0]', '*');
        assert.deepPropertyVal(parsed, 'groups[0].agents[1]', 'agent1');
        assert.deepPropertyVal(parsed, 'groups[0].rules[0].rule', 'disallow');
        assert.deepPropertyVal(parsed, 'groups[0].rules[0].path', '/path1');
        assert.deepPropertyVal(parsed, 'groups[0].rules[1].rule', 'allow');
        assert.deepPropertyVal(parsed, 'groups[0].rules[1].path', '/path2');

        assert.deepPropertyVal(parsed, 'groups[1].agents[0]', 'agent2');
        assert.deepPropertyVal(parsed, 'groups[1].rules[0].rule', 'allow');
        assert.deepPropertyVal(parsed, 'groups[1].rules[0].path', '/');

        assert.deepPropertyVal(parsed, 'groups[2].agents[0]', 'agent3');
        assert.deepPropertyVal(parsed, 'groups[2].rules[0].rule', 'disallow');
        assert.deepPropertyVal(parsed, 'groups[2].rules[0].path', '/path3');
        
        done();
      })
      .catch(done);
  });
  
});
