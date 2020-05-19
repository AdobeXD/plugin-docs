'use strict';

var _styleOptions = require('./styleOptions');

var cheerio = require('cheerio');

var getStyleName = function getStyleName($blockquote) {
  var $strong = $blockquote.find('p:first-child > strong:first-child');
  // if there is no strong tag then the user has not defined a style
  if (!$strong || $strong.length === 0) {
    return;
  }
  // we dont want to render the strong tag because it is just telling us what style to use
  $strong.remove();

  return $strong.text().toLowerCase();
};
var getStyleOption = function getStyleOption(styleName) {
  return _styleOptions.styleOptions[styleName];
};

var getIconHtml = function getIconHtml(icon) {
  if (!icon) {
    return '';
  }
  return '<div class="hints-icon"><i class="fa ' + icon + '"></i></div>';
};
var generateBlockquoteHtml = function generateBlockquoteHtml(_ref) {
  var style = _ref.style,
      _ref$icon = _ref.icon,
      icon = _ref$icon === undefined ? '' : _ref$icon,
      content = _ref.content;

  var iconHtml = getIconHtml(icon);
  return '<div class="alert alert-' + style + ' hints-alert">' + ('' + iconHtml) + ('<div class="hints-container">' + content + '</div>') + '</div>';
};
module.exports = {
  book: {
    assets: './assets',
    css: ['plugin-styled-blockquotes.css']
  },
  hooks: {
    page: function page(_page) {
      var $ = cheerio.load(_page.content);

      $('blockquote').each(function (i, blockquote) {
        // define the cheerio elements
        var $blockquote = $(blockquote);
        var styleOption = getStyleOption(getStyleName($blockquote));
        if (!styleOption) {
          return;
        }
        // define elements needed for the blockquote html
        var style = styleOption.style,
            icon = styleOption.icon;

        var content = $blockquote.html();
        var blockquoteHtml = generateBlockquoteHtml({ style: style, icon: icon, content: content });
        // append the new blockquote (as a div) to the parent
        $blockquote.before(blockquoteHtml);
        // remove the old blockquote tag, so we dont get the default styling
        $blockquote.remove();
        // update the page content html with the new html
        _page.content = $('body').html();
      });
      return _page;
    }
  }
};