#!/usr/bin/env node
"use strict";

var _BrokenLinkChecker = _interopRequireDefault(require("./BrokenLinkChecker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _BrokenLinkChecker.default(process.argv.slice(2)).launch();