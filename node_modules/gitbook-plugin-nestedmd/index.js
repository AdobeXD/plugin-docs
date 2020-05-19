var _ = require('lodash');
var marked = require('marked');
var markdownAttr = / data-markdown[ >]/;

function replaceContent(src) {
  var nodes = marked.lexer(src);
  _.each(nodes, function(n) {
    if (n.type === 'html' && markdownAttr.test(n.text.substring(0, n.text.indexOf('>') + 1))) {
      var bodyStart = n.text.indexOf('>') + 1;
      var bodyEnd = n.text.lastIndexOf('<');
      var body = marked(replaceContent(n.text.substring(bodyStart, bodyEnd)));
      var content = n.text.substring(0, bodyStart) + body + n.text.substring(bodyEnd);
      src = src.replace(n.text, content);
    }
  });
  return src;
}

function processContent(_page) {
  _page.content = replaceContent(_page.content);
  return _page;
}

module.exports = {
  hooks: {
    'page:before': processContent
  }
};
