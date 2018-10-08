# The `main.js` file

All plugins must have a `main.js` file, which serves as the entry point for execution of your JavaScript code. This file is where all the fun happens!

Below, we'll cover some points to help you get oriented with `main.js`.


## Wiring your code to the manifest

Your `main.js` file exports a map linking each `commandId` from the manifest to a _handler function_ in your code:

```js
function sayHello(selection, documentRoot) {
    console.log("Hello, world!");
}

module.exports.commands = {
    helloCommand: sayHello
};
```

TBD Explanation of connection:
- function
- exports
- manifest


## Contextual arguments

The handler function (in the above example, `sayHello`) receives two contextual arguments from XD:

* The current [selection](../selection.md) state
* The root node of the entire document (see [scenegraph > RootNode](../scenegraph.md#rootnode))

The argument names `selection` and `documentRoot` are arbitrary, but are considered convention. We use those names throughout our documentation.


## Accessing app APIs

See [Available APIs](../core/apis.md) to learn about available APIs and how to access them. Most APIs are loaded using `require()`, but a few can be accessed directly as globals, and some key API objects are passed directly to your command handler function
([see menu item handlers](./handlers.md)).


## Loading more code files

TBD