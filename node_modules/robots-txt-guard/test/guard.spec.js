/*global describe, it*/

'use strict';

var guard = require('../lib/guard'),
    assert = require('chai').assert;



describe('guard', function () {

  it('should pick most specific rule', function () {

    // both groups should behave the same, regardless of the order of the rules
    var robotsTxt = guard({
      groups: [{
        agents: [ 'agent1' ],
        rules: [
          { rule: 'allow', path: '/' },
          { rule: 'disallow', path: '/fish' }
        ]
      }, {
        agents: [ 'agent2' ],
        rules: [
          { rule: 'disallow', path: '/fish' },
          { rule: 'allow', path: '/' }
        ]
      }]
    });

    assert.ok(robotsTxt.isAllowed('agent1', '/hello'), '1');
    assert.notOk(robotsTxt.isAllowed('agent1', '/fish'), '2');

    assert.ok(robotsTxt.isAllowed('agent2', '/hello'), '3');
    assert.notOk(robotsTxt.isAllowed('agent2', '/fish'), '4');

    assert.ok(robotsTxt.isAllowed('default', '/hello'), '5');

  });

  it('should pick most specific agent', function () {

    // both groups should behave the same, regardless of the order of the rules
    var robotsTxt = guard({
      groups: [{
        agents: [ 'agent', 'agent2' ],
        rules: [
          { rule: 'disallow', path: '/disallow1' }
        ]
      }, {
        agents: [ '*' ],
        rules: [
          { rule: 'disallow', path: '/disallow2' }
        ]
      }, {
        agents: [ 'agent1' ],
        rules: [
          { rule: 'disallow', path: '/disallow3' }
        ]
      }]
    });

    assert.notOk(robotsTxt.isAllowed('agent1', '/disallow3'), '1');
    assert.ok(robotsTxt.isAllowed('agent1', '/disallow1'), '2');
    assert.ok(robotsTxt.isAllowed('agent1', '/disallow2'), '3');

    assert.notOk(robotsTxt.isAllowed('hello', '/disallow2'), '4');
    assert.ok(robotsTxt.isAllowed('hello', '/disallow1'), '5');
    assert.ok(robotsTxt.isAllowed('hello', '/disallow3'), '6');

    assert.notOk(robotsTxt.isAllowed('agent', '/disallow1'), '7');
    assert.ok(robotsTxt.isAllowed('agent', '/disallow2'), '8');
    assert.ok(robotsTxt.isAllowed('agent', '/disallow3'), '9');

    assert.notOk(robotsTxt.isAllowed('agent2', '/disallow1'), '10');
    assert.ok(robotsTxt.isAllowed('agent2', '/disallow2'), '11');
    assert.ok(robotsTxt.isAllowed('agent2', '/disallow3'), '12');

  });

  it('should pick most specific agent', function () {

    // both groups should behave the same, regardless of the order of the rules
    var robotsTxt = guard({
      groups: [{
        agents: [ '*' ],
        rules: [
          { rule: 'disallow', path: '' }
        ]
      }]
    });

    assert.ok(robotsTxt.isAllowed('agent', '/'), '1');
    assert.ok(robotsTxt.isAllowed('agent', '/path'), '2');

  });

  it('should detect disallow all', function () {

    // both groups should behave the same, regardless of the order of the rules
    var robotsTxt = guard({
      groups: [{
        agents: [ '*' ],
        rules: [
          { rule: 'disallow', path: '/' }
        ]
      }, {
        agents: [ 'googlebot' ],
        rules: [
          { rule: 'disallow', path: '/' },
          { rule: 'allow', path: '/fish' }
        ]
      }]
    });

    assert.isTrue(robotsTxt.isDissalowAll('somebot'));
    assert.isFalse(robotsTxt.isDissalowAll('googlebot'));

  });

  it('should correctly detect if path is allowed with noindex', function () {

    var robotsTxt = guard(
      {
        groups: [
          {
            agents: [ '*' ],
            rules: [
              { rule: 'allow', path: '/path1' },
              { rule: 'disallow', path: '/*/path2/' },
              { rule: 'noindex', path: '/*/path2/' },
              { rule: 'noindex', path: '/*/path3/' }
            ]
          }
        ]
      }
    );

    assert.ok(robotsTxt.isAllowed('agent', '/'), '1');
    assert.ok(robotsTxt.isAllowed('agent', '/path1'), '2');
    assert.notOk(robotsTxt.isAllowed('agent', '/*/path2/'), '3');
    assert.ok(robotsTxt.isAllowed('agent', '/*/path3/'), '4');
  });

});
