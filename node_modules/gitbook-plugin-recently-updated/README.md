# gitbook-plugin-recently-updated
> Lists recently updated articles, arranged by date

## Installation

Install via `yarn` or `npm`:

```bash
# Yarn
yarn add github:jwarby/gitbook-plugin-recently-updated

# NPM
npm install --save jwarby/gitbook-plugin-recently-updated
```

Add to plugins in `book.json`:

```json
...
  "plugins": [
    ...
    "recently-updated"
    ...
  ]
...
```

## Usage

```
{% recentlyupdated %}{% endrecentlyupdated %}
```

## Options

### `limit` (default: `10`)

Controls maximum number of articles to display, eg show only the last 5 updated
articles:

```
{% recentlyupdated limit="5" %}{% endrecentlyupdated %}
```

### `since` (default: `0`)

Show articles changed since specified JavaScript timestamp (milliseconds), eg
show articles changed on or after 4th Dec 2017 00:00:00 (UTC):

```
{% recentlyupdated since="1512345600000" %}{% endrecentlyupdated %}
```

To disable the `limit` param and show **all** articles changed since the
specified timestamp (instead of the default 10), set it to an empty value:

```
{% recentlyupdated since="1512345600000", limit="" %}{% endrecentlyupdated %}
```

## Example output

###### Tue Dec 05 2017

- [Chapter 3 > My most recently updated article](http://example.com)
- [Chapter 1 > My second-most recently updated article](http://example.com)

###### Fri Dec 01 2017

- [Chapter 2 > An article I modified last week](http://example.com)
