# Styled hint blocks in your docs

Check out our [Examples](https://jim-moody.github.io/gitbook-plugin-styled-blockquotes) to see exactly what this plugin provides!

## Installation

Add the below to your `book.json` file, then run `gitbook install` :

```json
{
  "plugins": ["styled-blockquotes"]
}
```

## Usage

It is highly recommended that you check out our [Examples](https://jim-moody.github.io/gitbook-plugin-styled-blockquotes) gitbook to see clear examples of how to use this plugin. If you _really_ don't want to click on that link, you can check out this basic example below :smile:

**Markdown**

```md
> **info**
> Content goes here
```

**Rendered HTML**
![Example Markdown](https://user-images.githubusercontent.com/26190589/33686292-6cb04078-daa2-11e7-9be2-0e0eef05f4dc.png)

**Note:** Replace "info-icon" with any of the [available styles](#available-styles) to change the style (case does not matter)

### Available Styles

* `info`
* `tip`
* `danger`
* `success`

Append `no-icon` to add the styling without the icon

## Acknowledgements

This project borrowed heavily from the following plugins:

* [Richquotes Plugin](https://github.com/erixtekila/gitbook-plugin-richquotes)
* [Hints Plugin](https://github.com/GitbookIO/plugin-hints)
