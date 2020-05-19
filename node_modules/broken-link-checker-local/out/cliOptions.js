"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultOptions = _interopRequireDefault(require("broken-link-checker/lib/internal/defaultOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Command line options available
 * @type {Object}
 * @property {yargs.Option<String[]>} [exclude=[]] A keyword/glob to match links against. Can be
 * used multiple times.
 * @property {yargs.Option<Boolean>} [exclude-external=false] Will not check external links.
 * @property {yargs.Option<Boolean>} [exclude-internal=false] Will not check internal links.
 * @property {yargs.Option<Number>} [filter-level=1] The types of tags and attributes that are
 * considered links.
 * @property {yargs.Option<Boolean>} [follow=false] Force-follow robot exclusions.
 * @property {yargs.Option<Boolean>} [get=false] Change request method to GET.
 * @property {yargs.Option<Boolean>} [recursive=false] Recursively scan "crawl" the HTML
 * document(s).
 * @property {yargs.Option<String>} [user-agent] The user agent to use for link checks.
 * @property {yargs.Option<Boolean>} [verbose=false] Display excluded links.
 */
const CliOptions = {
  exclude: {
    desc: 'A keyword/glob to match links against. Can be used multiple times.',
    default: _defaultOptions.default.excludedKeywords
  },
  'exclude-external': {
    desc: 'Will not check external links.',
    alias: 'e',
    type: 'boolean',
    default: false
  },
  'exclude-internal': {
    desc: 'Will not check internal links.',
    alias: 'i',
    type: 'boolean',
    default: false
  },
  'filter-level': {
    desc: 'The types of tags and attributes that are considered links.\n' + '  0: clickable links\n' + '  1: 0 + media, iframes, meta refreshes\n' + '  2: 1 + stylesheets, scripts, forms\n' + '  3: 2 + metadata\n',
    type: 'number',
    default: _defaultOptions.default.filterLevel
  },
  follow: {
    desc: 'Force-follow robot exclusions.',
    alias: 'f',
    type: 'boolean',
    default: false
  },
  get: {
    desc: 'Change request method to GET.',
    alias: 'g',
    type: 'boolean',
    default: false
  },
  ordered: {
    desc: 'Maintain the order of links as they appear in their HTML document.',
    alias: 'o',
    type: 'boolean',
    default: false
  },
  recursive: {
    desc: 'Recursively scan "crawl" the HTML document(s).',
    alias: 'r',
    type: 'boolean',
    default: false
  },
  'base-url': {
    desc: 'Serve files using alternative base url.',
    alias: 'b',
    type: 'string',
    default: '/'
  },
  'user-agent': {
    desc: 'The user agent to use for link checks.',
    type: 'string',
    default: _defaultOptions.default.userAgent
  },
  verbose: {
    desc: 'Display excluded links.',
    alias: 'v',
    type: 'boolean',
    default: false
  }
};
var _default = CliOptions;
/**
 * @external {yargs.Option} http://yargs.js.org/docs/#methods-optionskey-opt
 */

exports.default = _default;