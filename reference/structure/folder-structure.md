# Folder structure

 When you have the right structure for your XD plugin, it will look like this:

```
my-plugin-folder
├── main.js
└── manifest.json
```

## Your plugin's parent folder

Create a new folder for your plugin with any name you like.


## Your plugin files

Within the parent folder, you'll need _at minimum_ two files, with these _exact_ names:


1.   `manifest.json` is your plugin’s manifest.

    This file is where you include _facts_ about your plugin, such as its name, the menu item(s) it adds to XD, and so on. [Learn about the manifest here](./manifest.md).

1.   `main.js` is your plugin’s code. 

    This file contains your JavaScript code that implements the logic for your plugin. [Learn more about `main.js` here](./handlers.md).


These two files go into your plugin's parent directory.

The `manifest.json` and `main.js` files stored in your plugin's parent directory are the bare minimum requirement for your plugin to work, but it's possible to have more JavaScript files if you want. You can learn about including further JavaScript files in our [JavaScript concepts section on using `require`](/reference/javascript/javascript-support.html#can-i-use-require).


## Next steps

Read on to learn about the two required files:

- [manifest.json](./manifest.md)
- [main.js](./handlers.md)