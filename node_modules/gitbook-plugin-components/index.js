var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');

var urls = [];

module.exports = {
  // Map of hooks
  hooks: {
    "page": function (page) {
      if (this.output.name != 'website') return page;

      var lang = this.isLanguageBook() ? this.config.values.language : '';
      if (lang) lang = lang + '/';

      var outputUrl = this.output.toURL('_book/' + lang + page.path);

      urls.push({
        url: outputUrl + (outputUrl.substr(-5, 5) !== '.html' ? 'index.html' : '')
      });

      return page;
    },

    "finish": function() {
      var $, $el, html;
      var templatePath = this.config.get('pluginsConfig.components.templatePath');
      var templates = this.config.get('pluginsConfig.components.templates');
      if (typeof templatePath === 'undefined') templatePath = 'docs/components';

      urls.forEach(item => {
        html = fs.readFileSync(item.url, {encoding: 'utf-8'});
        $ = cheerio.load(html);

        $('body').find('.gitbookPluginComponent').remove()

        templates.forEach(template => {
          var singleTemplatePath = templatePath + '/' + template.name + '.html';
          if (singleTemplatePath && fs.existsSync(singleTemplatePath)) {
            var templateHTML = (fs.readFileSync(singleTemplatePath, {encoding: 'utf-8'}));
            templateHTML = '<div class="gitbookPluginComponent">' + templateHTML + '</div>';
            $el = $(template.target);
            if (template.prepend !== "false") {
              $el.prepend(templateHTML);
            } else {
              $el.append(templateHTML);
            }
          }
        });

        fs.writeFileSync(item.url, $.root().html(), {encoding: 'utf-8'});
      })
    }
  }
};
