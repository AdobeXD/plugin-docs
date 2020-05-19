const fs = require('fs')

const groupBy = require('lodash.groupby')
const map = require('lodash.map')

module.exports = {
  blocks: {
    recentlyupdated: {
      process(block) {
        const stack = []
        const articles = []

        this.summary.walk(article => {
          if (article.path) {
            stack[article.depth - 1] = article.title

            articles.push({
              fullTitle: stack.slice(0, article.depth).join(' > '),
              mtime: fs.statSync(this.resolve(article.path)).mtime,
              url: encodeURI(this.output.toURL(article.path))
            })
          }
        })

        const recent = articles.sort((a, b) => b.mtime - a.mtime)

        const options = block.kwargs

        const since = options.since || 0
        const limit = 'limit' in options
          ? options.limit || Infinity
          : 10

        const filtered = recent.filter(({ mtime }) => mtime >= since)
        const limited = filtered.slice(0, limit)

        const groups = groupBy(limited, ({ mtime }) => mtime.toDateString())

        return map(groups, (articles, date) => (
          `<h6>${date}</h6><ul>` +
            articles.map(article => (
              `<li><a href="${article.url}">${article.fullTitle}</a>`
            )).join('') +
          '</ul>'
        )).join('')
      }
    }
  }
}
