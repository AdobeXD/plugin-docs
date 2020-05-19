module.exports = {

  website: {
    assets: "./assets",
    js: [
      "collapse.js"
    ],
    css: [
      "collapse.css"
    ]
  },

  blocks: {
    collapse: {
      process: function (blk) {
        const open = this.output.name !== 'website'
        const processMarkDown = blk.kwargs.process !== false
        const title = blk.kwargs.title || ''

        function format(body, summary, shouldOpen) {
          const openTag = shouldOpen === true ? 'open': ''
          summary = summary || ''
          body = body || ''

          return '<details ' + openTag + '><summary>' + summary + '</summary>' + body + '</details>';
        }

        return processMarkDown === false ?
          format(blk.body, title) :
          this.renderBlock('markdown', blk.body, open)
          .then(function (data) {
            return format(data, title, open)
          });
      }
    }
  }
};
