# How to work with paths

This sample demonstrates how to create path objects in XD. The path objects are used to construct a pie chart. The plugin code can be found [here](https://github.com/AdobeXD/Plugin-Guides/tree/master/Guides/how-to-create-path-objects-guide).

## Contents

1. [Technology Used](how-to-create-path-objects-guide.md#technology-used)
2. [Prerequisites](how-to-create-path-objects-guide.md#prerequisites)
3. [Development Steps](how-to-create-path-objects-guide.md#development-steps)
4. [Next Steps](how-to-create-path-objects-guide.md#next-steps)

## Technology Used

* References: [XD Scenegraph - Path](https://github.com/AdobeXD/Plugin-Guides/tree/2d9ccbfb0d863bea69dadcc420a962c539c46156/Guides/how-to-create-path-objects-guide/references/selection.md)

## Prerequisites

* Basic knowledge of HTML, CSS, and JavaScript.
* Basic knowledge of [Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
* [Getting Started Guide](../getting-started/getting-started-guide.md)

## Development Steps

### 1.  Create plugin scaffold

As described in the [Getting Started Guide](../getting-started/getting-started-guide.md), create the directory for your plugin:

```text
$ cd ~/Library/Application Support/Adobe/Adobe XD CC (Prerelease)/plugins
$ mkdir com.adobe.xd.createPieChart
$ cd com.adobe.xd.createPieChart
$ touch manifest.json
$ touch main.js
```

Edit the manifest file for your plugin:

```javascript
{
    "id": "com.adobe.xd.createPieChart",
    "name": "Create Pie Chart sample plugin",
    "host": {
        "app": "XD",
        "minVersion": "8.0"
    },
    "version": "1.0.0",
    "uiEntryPoints": [
        {
            "type": "menu",
            "label": "Create Pie Chart",
            "commandId": "createPieChartCommand"
        }
    ]
}
```

In the main.js file, link the commandId to a handler function

```javascript
function createPieChartHandlerFunction(selection) {
    // The body of this function is added later
}

module.exports = { 
    commands: {
        "createPieChartCommand": createPieChartHandlerFunction
    }
};
```

The remaining steps in this guide describe additional edits to the main.js file.

### 2.  Get references to the `Path` and `Color` classes from XD’s `scenegraph` module

```text
const { Path, Color } = require("scenegraph");
```

`Path` and `Color` classes are imported and ready to be used.

### 3. Create a helper function to calculate the coordinates of a point on a circle

```text
function pointOnCircle(radius, angle) {
    const radians = angle * 2. * Math.PI / 360.;
    const xcoord = radius * Math.cos(radians);
    const ycoord = radius * Math.sin(radians);
    return xcoord + "," + ycoord;
}
```

The angle is expressed in degrees. It must be converted to radians before passing it to the sine and cosine functions.

### 3. Create a helper function that adds a single pie wedge to the scene graph

```text
function createWedge(selection, radius, startAngle, endAngle, color) { // [1]
    const startPt = pointOnCircle(radius, startAngle);
    const endPt = pointOnCircle(radius, endAngle);
    const pathData = `M0,0 L${startPt} A${radius},${radius},0,0,1,${endPt} L0,0`; // [2]
    const wedge = new Path(); // [3]
    wedge.pathData = pathData; // [4]
    wedge.fill = new Color(color); // [5]
    wedge.translation = {x: radius, y: radius};  // [6]
    selection.insertionParent.addChild(wedge); // [7]
}
```

1. This function accepts five parameters - the current selection in the scene graph \(`selection`\), the pie chart radius \(`chartRadius`\), start radian of the wedge \(`startAngle`\), end radian of the wedge \(`endAngle`\), and color of the wedge \(`color`\)
2. Based on these paramenters, `pathData` is constructed. The pen is moved to the origin, a line is drawn to the first point on the edge of the circle, an arc is drawn to the second point on the edge of the circle, and then a line is drawn back to the origin.  For more information on how to create path data, please refer to [Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
3. Create a new instance of `Path`
4. Set `pathData`
5. Set the color of the path object
6. Move the path object down and to the right by `radius` units.  As a result, the pie chart will appear with its top left corner positioned at `0,0`.
7. Insert the path object into the currently-selected artboard

### 4. Create the main handler function, which creates four wedges

```text
function createPieChartHandlerFunction(selection) {
    createWedge(selection, 100, 0, 90, "red");
    createWedge(selection, 100, 90, 135, "blue");
    createWedge(selection, 100, 135, 225, "yellow");
    createWedge(selection, 100, 225, 360, "purple");
}
```

Note that the end angle of each wedge matches the start angle of the next wedge. As a result, the wedges fit together to create a complete pie chart.

### 5. Execute the plugin

Ater saving all your changes, reload the plugin in XD and invoke it. The result should be similar to the following:

![](../.gitbook/assets/pie-chart.png)

## Next Steps

Ready for more? Take a look at other guides:

* [Guides](https://github.com/AdobeXD/Plugin-Guides/tree/2d9ccbfb0d863bea69dadcc420a962c539c46156/Guides/README.md)

