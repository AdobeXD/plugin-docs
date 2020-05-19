# Gitbook plugin for bulk redirects

This plugin lets you create bulk redirects of URLs as part of Gitbook generation. This is useful if you need to add multiple redirects for articles without adding them to the `SUMMARY.md`.

If you need to redirect individual pages, use the [redirect plugin](https://github.com/ketan/gitbook-plugin-redirect).

## Installation

Add this to your `book.json` plugin list:

```json
{
    "plugins": [ "bulk-redirect" ]
}
```

## Usage

Configuration for this plugin is specified in `book.json` in the `pluginsConfig` object, with the key `bulk-redirect`. There are two important configuration options for this plugin (discussed below): `basepath` and `redirectsFile`.

```json
"pluginsConfig": {
    "bulk-redirect": {
        "basepath": "/",
        "redirectsFile": "redirects.json"
    }
}
```

### basepath

`basepath` is a string containing a path against which the `to` URLs in the `redirects` list (present in `redirectsFile`) are resolved. It can be used to specify path to the directory in which the compiled book will be hosted, relative to the root of the domain. E.g., if the book is to be hosted at `http://example.com/book/`, then set the value of `basepath` to `/book/`. The trailing slash is necessary to ensure URLs resolve properly.

If the book is hosted at the root of the domain, e.g. `http://example.com/`, then you can leave this unspecified.

**For example:**

```json
"pluginsConfig": {
    "bulk-redirect": {
        "basepath": "/user/current/",
        "redirectsFile": "redirects.json"
    }
}
```


### `redirects` in redirects.json 

The `redirects` contains an array of objects. This array should be present in another file. This relative path of this file should be passed in the `redirectsFile` field.  

Each object in the `redirects` array has 2 important keys: `from` and `to`.

- **`from`**: This key should contain the URL of the old HTML, relative to the root of the book output.
- **`to`**: This key should contain the URL of the new HTML, relative to the root of the book output. If a `basepath` is provided, it is used to resolve the URL given in `to`.

**For example: redirects.json**

```json
{
    "redirects": [
            {
                "from": "oldpage.html",
                "to": "newpage.html"
            },
            {
                "from": "olddir/oldpage.html",
                "to": "newdir/newpage.html"
            },
        ]
}
```


This will create the pages `oldpage.html` and `olddir/oldpage.html` in the output and they will redirect to `/newpage.html` and `/newdir/newpage.html` respectively.
