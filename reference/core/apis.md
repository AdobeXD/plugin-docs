# Available APIs

## Principal API modules

* [selection](../selection.md) - Indicates the selected nodes and related context
    * This object is passed as an argument to your command handler function (see above)
* [scenegraph](../scenegraph.md) - APIs available on document nodes
    * Normally you can use these APIs by simply accessing the arguments passed to your command's handler function
      (`selection` and `documentRoot`).
    * To create _new_ nodes in the document, load this module explicitly to access the constructor functions:
      <br>`var Rectangle = require("scenegraph").Rectangle;`
      <br>`var node = new Rectangle();`
* [commands](../commands.md) - Invoke commands to change the document structure and perform other complex operations.
    * Load this module explicitly: `var commands = require("commands");`
* [storage](../uxp/using-file-apis) - Read and write files on disk
    * Load this module explicitly: `const fs = require("uxp").storage.localFileSystem;`
* [Network](../network-IO.md) - Use browser-style `XMLHttpRequest`, `fetch()`, and `WebSocket` APIs to access the network.
    * These APIs are in the global namespace, so you can use them without any `require()` statements
* [clipboard](../clipboard.md) - Copy text to the clipboard.
    * Load this module explicitly: `var clipboard = require("clipboard");`

## Helper classes

* [SceneNodeList](../SceneNodeList.md) - This is the type of the `children` property on scenenodes
