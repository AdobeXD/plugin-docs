# Gitbook Plugin Components

Adds the ability to use 'components' (basically, html templates).

## Install

Add 'components' to the book.json plugins array:

```json
{
  "plugins": ["components"],
}
```

Then make sure to run `install` after adding the plugin:

```
gitbook install
```

...and then:

```
gitbook serve
```

## Configuration options

You can see an example config options below for `book.json`.

This will look for `docs/components/header.html` and prepend it to `body`.

Then it will look for `docs/components/footer.html` and append it to `.book`.

```json
{
  "pluginsConfig": {
    "components": {
      "templatePath": "docs/components",
      "templates": [
        {
          "name": "header",
          "target": "body",
          "prepend": "true"
        },
        {
          "name": "footer",
          "target": ".book",
          "prepend": "false"
        }
      ]
    }
  }
}
```

Default values for `templatePath` is `docs/components` and default for `prepend` is `true`.
