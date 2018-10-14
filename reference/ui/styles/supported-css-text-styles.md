# Supported CSS Text Styles

| Style | Unsupported Elements | Notes |
| :--- | :--- | :--- | :--- |
| [color](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#color) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [Supported Colors](/plugin-docs/reference/ui/styles/..supported-colors.md);[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| [letter-spacing](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#letter-spacing) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
| [font-family](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#font-family) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family); Partial support |
| [font-size](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#font-size) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| [font-style](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#font-style) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style) |
| [font-weight](/plugin-docs/reference/ui/styles/supported-css-text-styles.html#font-weight) | `BUTTON`,`INPUT`,`SELECT`,`OPTION`,`TEXTAREA` | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |


> **Info**
>
> The following text styles are not supported:
>
> `content`,`counter-*`,`direction`,`font`,`font-display`,`font-feature-settings`,`font-kerning`,`font-language-overrride`,`font-optical-sizing`,`font-size-adjust`,`font-stretch`,`font-synthesis`,`font-variant-*`,`hyphens`,`initial-letter`,`initial-letter-align`,`quotes`,`ruby-align`,`ruby-position`,`tab-size`,`text-combine-upright`,`text-decoration-*`,`text-emphasis-%`,`text-indent`,`text-justify`,`text-orientation`,`text-rendering`,`text-shadow`,`text-transform`,`text-underline-position`,`unicode-bidi`,`widows`,`word-break`,`word-spacing`,`word-wrap`,`writing-mode`

## color

`color` sets the color of text. Color can be specified using HEX color strings, `rgb` and `rgba` color values, `hsl` and `hsla` values, and other color spaces \(such as CMYK\). For more, [see the supported colors and forms](./supported-colors.md).

**Supported Values**

* `initial`
* `inherit`
* `transparent`
* [colors](./supported-colors.md)

**Example**

```
color: red;
color: #FF0000;
color: rgba(255, 0, 0, 1);
```

## letter-spacing

 The spacing between letters can be controlled using the`letter-spacing` property. Note that `0` indicates that no additional spacing should be inserted between letters. If you use a _negative_ value, the letters will get closer together, whereas a positive value will spread individual letters further apart.

> **Tip**
>
> There is a limit to how close letters can bet before overlapping entirely. Once this limit is reached, no amount of increasing the negative value will change the rendering. As such, it's not possible to render a string reversed simply by decreasing the spacing enough.

**Supported Values**

* `auto`
* spacing in `px`
* spacing in percent (`%`)

## font-family

`font-family` is used to determine the typeface with which text is rendered. If a font name is specified that doesn't exist on the system, the default font will be used instead.



This property does not support multiple fonts as fallbacks, nor does it support the common `monospace`, `serif`, and other font families. You should specify only _one_ font family, without quotes. Otherwise the style will be ignored.

**Supported Values**

* Font name

**Example**

```css
font-family: Helvetica;
```

## font-size

The font size determines the size of the text. The default font size is determined based on the context of the element.

**Supported Values**

* `auto`
* size in `px`
* size in percent (`%`)

## font-style

Determines the style of the text. The only supported style is `italic`, assuming the font supports italics.

**Supported Values**

* `normal`
* `italic`

## font-weight

Sets the font's weight, or line thickness. If a font doesn't support a given weight, another weight will be substituted.

**Supported Values**

* `lighter`
* `normal`
* `bold`
* `bolder`
* `50`
* `100`
* `200`
* `300`
* `400`
* `500`
* `550`
* `600`
* `700`
* `800`
* `850`
* `900`
* `950`
* `1000`

**Example**

```css
font-weight: bold;
font-weight: 700;
```