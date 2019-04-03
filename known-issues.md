# XD Plugin API Known Issues

## General Issues

- Developer/Side-loading Specific
  - Plugin menus and handlers may not be in-sync across documents during development
    - If someone modifies a plugin's files on disk while XD is running, and then opens more windows in XD, any windows that were open before reflect the old version of the plugin while windows that were opened later reflect the new version of the plugin. The menu bar will always reflect the old version of the plugin regardless of which window is current.

## Plugin Management

- If Plugin Manager is open when you invoke Reload Plugins, it will not reflect any changes to the manifest (plugin name, description, icon) until you close & reopen it.

## Scenegraph

- It is possible to set nodes to 0 width or 0 height.
  - Scenenode setters block negative size values but allow 0 size, even though in many cases it is equally nonsensical. We do block 0 size in the UI.
  - In the past, XD's renderer would fail asserts (possibly even crash) with 0-size objects. I couldn't repro that any more, but unless we're covering it well as an officially supported case, it could easily regress again. There are some other minor bugs though, e.g. sharing fails if you have any 0-width/height artboards and bitmap export fails if any of the top-level items you're trying to export are 0-width/height.
- Longer plugin command names may be truncated in the menu on Windows
  - Workaround: keep your plugin command names short!

## Assets Panel

- Plugins can modify the Assets panel contents while running in the background. Do not rely on this - in a future release, it will be blocked. Only make modifications to the document (including Assets panel) while the plugin is running a user-invoked command.

## User Interface

- Checkboxes may fail to render correctly if in a scrollable container. To work around this issue, make sure the containing element has a background color. (`transparent` does not count; macOS only.)
- It is not possible to trigger the emoji selector in a text field on macOS.
- SVG images are not supported in the UI.
- When tabbing in a scroll view, the scroll view is not automatically scrolled to ensure the target control is in view (macOS Only).
- Inline layout is not supported. Inline elements will render as `block` elements instead.

### HTML Elements

- `<option>` tags *must* have a `value` attribute, or referencing the `select`'s `value` property will return `undefined`.
- `<select value="…"/>` does not show the value as selected. Instead, get a reference to the element and call `setAttribute("value", …)`.
- If you don’t specify a width for your `form`, block elements inside may not take up the entire width. Workaround: always set a width for your `form` elements.
- `form`s only support `method="dialog"`. They do not submit to a URL automatically.
- It is not currently possible to specify the tab order.
- The size of a `<textarea>` cannot be set with `rows` or `cols`. Use CSS styles `height` and `width` respectively.
- `<input type="radio"/>` is not currently supported.
- `<progress>` is not currently supported.
- HTML5 input validation is not supported.
- Images that fail to load will not render any “broken icon” image in place.
- Input elements do not accept `defaultValue`.
- `<option>` tags do not support `disabled` attributes.
- `<label for="id"/>` is not supported. Wrap `<label>` around the control instead.
- `<input type="file" />` is not supported.
- `<input type="color" />` is not supported.

### CSS

- `line-height` is currently implemented incorrectly. This will be fixed in a future release. For now, avoid `line-height`.
- It is not currently possible to assign multiple border colors to a container.
- `:active` is not currently supported.
- `baseline` alignment is not currently supported.
- Full CSS cascade and inheritance is not currently supported.
- Media queries are not supported.
- `em` unit is not supported.
- The `font` shorthand CSS rule is not supported.
- `text-transform` is not supported
- `cursor` is not supported
- Styles of elements within a `span` are ignored.
- In order to clip an image (say, with `border-radius: 10px`), you must also specify `overflow: hidden`.
- `z-index` is not supported. To achieve z-index behavior, use the DOM order instead.
- CSS transitions and animations are not supported.

### DOM

- When a dialog is closed, it is not removed from the DOM. This is per spec. If you want the dialog to be removed from the DOM, you must call `HTMLDialogElement#remove` explicitly.
- When applying HTML using `innerHTML`, event handlers and scripts are not parsed. This is by design.

### Events

- Interactive elements do not support `Pointer%` events
- `keypress` and `keyup` are not currently supported on macOS.

## Network I/O

- On macOS, it is not possible to use self-signed certificates with secure Websockets.
- Websockets do not support extensions.
- XHR can only send binary content using an ArrayBuffer -- Blob is not supported.
- XHR does not support cookies.
- `responseURL` is not supported on XHR

## File I/O

- `Blob` is not supported. Use `ArrayBuffer` instead.
