'use strict';

var patterns = require('./patterns');


function moreSpecificFirst(obj1, obj2) {
  return obj2.pattern.specificity - obj1.pattern.specificity;
}

module.exports = function makeGuard(config) {
  var groups = [];

  // flatten agents
  config.groups
    .forEach(function (group) {
      var rules = group.rules
        .filter(function (rule) {
          return !!rule.path;
        })
        .map(function (rule) {
          return {
            pattern: patterns.path(rule.path),
            allow: rule.rule.toLowerCase() !== 'disallow'
          };
        })
        .sort(moreSpecificFirst);

      group.agents
        .forEach(function (agent) {
          groups.push({
            pattern: patterns.userAgent(agent),
            rules: rules
          });
        });
    });

  groups.sort(moreSpecificFirst);

  function findGroup(userAgent) {
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.pattern.test(userAgent)) {
        return group;
      }
    }
    return null;
  }

  function matchRule(rules, path) {
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (rule.pattern.test(path)) {
        return rule.allow;
      }
    }
    // no rule matched? assume allowed
    return true;
  }

  function isAllowed(userAgent, path) {
    var group = findGroup(userAgent);
    if (group) {
      return matchRule(group.rules, path);
    }
    // no group matched? assume allowed
    return true;
  }

  function isDissalowAll(userAgent) {
    var group = findGroup(userAgent);
    if (group) {
      var allowRules = group.rules.filter(function (rule) {
        return rule.allow;
      });
      return allowRules.length <= 0;
    }
    // no group matched? assume allowed
    return false;
  }

  return {
    isAllowed: isAllowed,
    isDissalowAll: isDissalowAll
  };
};
