"use strict";

var cheerio = require('cheerio');

var uuid = require('uuid/v4');

var generateLightBoxHTML = function generateLightBoxHTML(img) {
  return '<a href="' + img.attr('src') + '" data-lightbox="' + uuid() + '" data-title="' + img.attr('alt') + '">' + img + '</a>';
};

var getAssets = function getAssets() {
  // let config = this.config.get('pluginsConfig.lightbox');
  // if (config.hasOwnProperty('jquery') && config['jquery'] === false) {
  //     assets['js'] = ['jquery.min.js'].concat(assets['js'])
  // }
  return {
    assets: './dist/assets',
    js: ['jquery.min.js', 'lightbox.min.js'],
    css: ['lightbox.min.css']
  };
};

module.exports = {
  book: getAssets(),
  hooks: {
    page: function page(_page) {
      var $ = cheerio.load(_page.content);
      $('img').each(function (index, img) {
        var target = $(img);
        target.replaceWith(generateLightBoxHTML(target));
      });
      _page.content = $.html();
      return _page;
    }
  }
};