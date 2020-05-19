'use strict';

var split   = require('split'),
    through = require('through'),
    combine = require('stream-combiner'),
    Promise = require('bluebird');




var START_GROUP  = 'START_GROUP',
    GROUP_MEMBER = 'GROUP_MEMBER',
    NON_GROUP    = 'NON_GROUP';

function parseLine(line) {
  var commentFree = line.replace(/#.*$/, ''),
      index       = commentFree.indexOf(':');

  if(index === -1) return null;

  var field = commentFree.substr(0,index).trim().toLowerCase(),
      value = commentFree.substr(index+1).trim();

  switch (field) {
    case 'user-agent':
      return {
        type : START_GROUP,
        agent: value
      };
    case 'allow':
    case 'disallow':
      return {
        type: GROUP_MEMBER,
        rule: field,
        path: value
      };
    default:
      return {
        type : NON_GROUP,
        field: field,
        value: value
      };
  }
}


function tokenize() {
  return through(function (line) {
    var token = parseLine(line);
    if (token) {
      this.queue(token);
    }
  });
}


module.exports = function parse(content) {
  var result = {
    groups: [],
    extensions: []
  };

  var prevToken    = null,
      currentGroup = null;

  var build = through(function (token) {
    switch (token.type) {
      case START_GROUP:
        if (prevToken !== START_GROUP) {
          currentGroup = {
            agents  : [],
            rules   : []
          };
          result.groups.push(currentGroup);
        }
        currentGroup.agents.push(token.agent);
        break;
      case GROUP_MEMBER:
        if (currentGroup) {
          currentGroup.rules.push({
            rule: token.rule,
            path: token.path
          });
        }
        break;
      case NON_GROUP:
        result.extensions.push({
          extension: token.field,
          value: token.value
        });
        break;
    }

    prevToken = token.type;
  });


  return new Promise(function (resolve, reject) {
    combine(
      content,
      split(),
      tokenize(),
      build
    )
      .on('error', reject)
      .on('end', function () {
        resolve(result);
      });
  });
};

