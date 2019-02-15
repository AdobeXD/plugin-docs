# How to create a simple UI

Let’s walk through creating a simple XD plugin UI together.

We'll keep things simple in this tutorial and only cover creating a small UI by writing HTML, CSS, and JavaScript.

At the end of the tutorial, we'll suggest some next steps for going deeper with the XD plugin APIs.


## Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- A text editor to write your code in (like VSCode, Sublime Text, Bracket, Atom, etc)
- [Quick Start Tutorial](/tutorials/quick-start)
- [Debugging Tutorial](/tutorials/debugging/index.md)

## Development Steps

> **Info**
> Complete code for this plugin can be found [on GitHub](https://github.com/AdobeXD/Plugin-Samples/tree/master/how-to-create-a-simple-ui).


### 1. Create plugin scaffold

First, edit the manifest file for the plugin you created in our [Quick Start Tutorial](/tutorials/quick-start).

Replace the JSON object in your manifest with the one below, noting the changes for the following fields:

1. `id`
1. `name`
1. `uiEntryPoints[0].label`
1. `uiEntryPoints[0].commandId`

```json
{
    "id": "ID_FROM_IO_CONSOLE",
    "name": "How to create a simple UI",
    "version": "1.0.0",
    "host": {
        "app": "XD",
        "minVersion": "13.0.0"
    },
    "uiEntryPoints": [
        {
            "type": "menu",
            "label": "How to create a simple UI",
            "commandId": "myPluginCommand"
        }
    ]
}

Then, update your `main.js` file, mapping the manifest's `commandId` to a handler function.

Replace the content of your `main.js` file with the following code:

```js
function myPluginCommand(selection) {
    // The body of this function is added later
}

module.exports = {
    commands: {
        myPluginCommand
    }
};
```

The remaining steps in this tutorial describe additional edits to the `main.js` file.

### 2. Write your HTML and CSS
```js
const yourHtml = // [1]
    `
    <!-- [2] -->
    <style>
        .visible {
            display: flex;
        }
        .hidden {
            display: none;
        }
        .dialog {
            height: 170px;
            width: 300px;
        }
    </style>
    <!-- [3] -->
    <form method="dialog" class="dialog">
        <h1 class="h1">Create Custom Size Post</h1>
        <hr>
        <label>
            <span>Choose Platform</span>
            <select id="platform">
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="pinterest">Pinterest</option>
                <option value="custom" selected>Custom</option>
            </select>
        </label>
        <div id="custom" class="hidden">
            <!-- [4] -->
            <input type="text" uxp-quiet="true" id="width"
                placeholder="width" />
            <input type="text" uxp-quiet="true" id="height"
                placeholder="height" />
        </div>
        <footer>
            <!-- [5] -->
            <button id="cancel" type="reset" uxp-variant="primary">Cancel</button>
            <button id="ok" type="submit" uxp-variant="cta">OK</button>
        </footer>
    </form>`;
```
1. Make sure to write your HTML and save it to a JavaScript `const`.
2. To keep this simple, add a `style` tag here and add CSS classes here.
3. Add a `<form>` tag and add three sections to the form. This form will have a title in an `h1` tag, select options in a `label` tag, text inputs in a `div`, and two buttons in the `footer` tag.
4. Note that one XD specific class is used, `uxp-quiet="true"` for the input fields. This will draw only a border at the bottom of the input field and provide more of a XD-like feeling. (reference: [Buttons](/reference/ui/elements/textfields))
5. Note that some XD specific classes are used. `uxp-variant="primary"` styles the button consistent with XD's primary button and `uxp-variant="cta"` styles the button consistent with XD's call to action button. (reference: [Buttons](/reference/ui/elements/buttons))

### 3. Write a helper function to create a modal dialog
```js
function createDialog() {
    dialog = document.createElement("dialog"); // [1]
    dialog.innerHTML = yourHtml; // [2]

    const cancelButton = dialog.querySelector("#cancel"); // [3]
    const platformSelect = dialog.querySelector("#platform");
    const customInput = dialog.querySelector("#custom");

    cancelButton.onclick = () => dialog.close("reasonCanceled"); // [4]

    platformSelect.onchange = () => {  // [5]
        customInput.className = "hidden";
        switch (platformSelect.value) {
            case "facebook":
                dialog.querySelector("#width").value = 1200;
                dialog.querySelector("#height").value = 628;
                break;
            case "instagram":
                dialog.querySelector("#width").value = 1080;
                dialog.querySelector("#height").value = 1080;
                break;
            case "pinterest":
                dialog.querySelector("#width").value = 735;
                dialog.querySelector("#height").value = 1102;
                break;
            default:
                customInput.className = "visible";
        }
    }
    document.appendChild(dialog); // [6]
}
```

1.  Creates a dialog element.
2.  Sets the `innerHTML` property of the `dialog` element with the HTML code you wrote.
3.  Creates constants for accessing HTML tags by ID elements. 
4.  Adds a click handler to the close button that closes the dialog when user hits "cancel"
5.  Adds a change handler to the dropdown element to assign correct banner sizes based on user's choice.
6.  Appends the `dialog` object to the `document`.

### 4. Write a helper function to create customized banners

```js
const commands = require("commands");  // [1]

function createCustomBanner(selection, width, height) { // [2]

	commands.duplicate() // [3]
	const duplicated = selection.items[0]; // [4]

	duplicated.resize(width, height); // [5]
	duplicated.moveInParentCoordinates(600, 600); // [6]
}
```

This code does the following:

1.  Gets reference to the `commands` class. 
2.  Defines your helper function. Note that `selection` parameter refers to user's selection of XD object(s)
3.  `duplicate` method creates a copy of the selected object (the original banner).
4.  After the `duplicate` method is run, the first item of the `selection` becomes the duplicated object. Let's declare a constant for it.
5.  `resize` method resizes the duplicated banner with the hardcoded `width` and `height` value.
6.  `moveInParentCoordinates` moves the new banner 300 pixels off the top and 300 pixels off the left side of the original object.

### 5. Write the main fuction
```js
function myPluginCommand(selection) {  // [1]
    if (!dialog) createDialog(); // [2]
    return dialog.showModal().then(function (result) { // [3]
        if (result !== "reasonCanceled") { // [4]
            createCustomBanner(
                selection,
                Number(dialog.querySelector("#width").value),
                Number(dialog.querySelector("#height").value)
            );
        }
    });
}

module.exports = { // [5]
    commands: {
        myPluginCommand
    }
};

```
1.  Defines your handler function. The handler function will run when the user selects the _How to create a simple UI_ menu command in the app's _Plugins_ menu.
2.  Creates a dialog using the `createDialog` helper function created in in Step#3 earlier.
3.  The `showModal` method returns a Promise object which can be chained with `.then`. Code written inside `.then` will be invoked when the dialog closes.
4.  If the reason is not `reasonCanceled`, meaning user hit the "submit" button, the `createCustomBanner` function created in Step#4 is invoked to create a custom banner based on user's inputs. 
5.  Exports a map object, which associates the JavaScript handler function (`myPluginCommand`) with the `commandId` property declared in the manifest earlier. The command ID must match the `commandId` value declared in your manifest exactly.

### 5. Run your plugin

So you’ve written a plugin! How do we run it?

If you haven’t already done so, launch XD and open a new document. Then navigate to the _Plugins > Create Rectangle_ menu item.

Alternatively, if XD was already open, select _Plugins > Development > Reload Plugins_.

![A rectangle on the artboard](/../images/on-canvas.png)


## Next Steps

- Browse the [UI API references](/reference/ui)
- Browse the [API references](/reference/how-to-read.md)
- Learn about [debugging plugins](/tutorials/debugging/index.md)
- Follow our [tutorials](/tutorials/)
- See working code in our [sample repos on GitHub](https://github.com/AdobeXD/Plugin-Samples)
