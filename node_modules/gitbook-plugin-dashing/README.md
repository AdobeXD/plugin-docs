# Dashing for GitBook

[![Travis](https://img.shields.io/travis/LukeCarrier/gitbook-plugin-dashing.svg?style=flat-square)](https://travis-ci.org/LukeCarrier/gitbook-plugin-dashing)
[![npm](https://img.shields.io/npm/v/gitbook-plugin-dashing.svg?style=flat-square)](https://www.npmjs.com/package/gitbook-plugin-dashing)

Derive [en-](http://www.thepunctuationguide.com/en-dash.html) and [em-dashes](http://www.thepunctuationguide.com/em-dash.html) from hyphens.

---

## Installation

Add the following entries to your `book.json`:

```json
{
  "plugins": [
    "dashing"
  ],
  "pluginConfig": {
    "dashing": {
      "selectors": [
        "h1, h2, h3, h4, h5, h6, p, ul, ol"
      ]
    }
  }
}
```

If you'd like to maintain a local installation of the plugin, run the following:

```
$ npm install --save-dev gitbook-plugin-dashing
```

## Usage

This plugin replaces `---` with `&mdash;` and `--` with `&ndash;` in each page's content for each of the supplied selectors. Just replace hyphens with the appropriate character, like so:

```markdown
# Sample

The 2010--2011 season was our best yet.

Upon discovering the errors---all 124 of them---the publisher immediately recalled the books.
```

> Sample
>
> The 2010–2011 season was our best yet.
>
> Upon discovering the errors—all 124 of them—the publisher immediately recalled the books.

## Testing

Tests are written with [Jasmine](https://jasmine.github.io/) and use [the GitBook integration tests framework](https://github.com/todvora/gitbook-tester). Run them with:

```
$ npm test
```
