# Urban Energy 3D Visualization

This is an example of visualizing energy data of urban buildings using [CesiumJS](https://www.cesium.com/platform/cesiumjs/) and 3D Tiles, so that the data can be viewed in a web browser. This guide assumes that you already have the basic knowledge about CesiumJS. The following CesiumJS tutorials are recommended:
- For beginners, visit the [quickstart](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)
- [Adding your own 3D Model](https://cesium.com/learn/cesiumjs-learn/cesiumjs-interactive-building/)
- [Styling the 3D Tiles](https://cesium.com/learn/cesiumjs-learn/cesiumjs-3d-tiles-styling/)

### Demo
https://themaggiesimpson.github.io/urban-energy-3D-vis/

![Urban-Energy-3D-Vis](https://raw.githubusercontent.com/TheMaggieSimpson/urban-energy-3D-vis/master/data/Untitled.png)

### The Steps
1. Get your 3D city model
1. Convert the model into 3D Tiles
1. Put the converted 3D Tiles in Cesium
1. Colorize the building based on your data

#### 1) Get your 3D city model
The 3D city model used in this demo is the 3D model of Essen, a city in Germany, in [CityGML](https://www.citygml.org) format. It is taken from https://www.opengeodata.nrw.de/produkte/geobasis/3dg/.

#### 2) Convert the model into 3D Tiles
Whatever data format you have, the 3D city model must be converted into 3D Tiles. You can use [FME](https://www.safe.com/fme/) or other conversion tools to convert your 3D city model into 3D Tiles.

#### 3) Put the converted 3D Tiles in CesiumJS
To put the 3D Tiles, go to your JavaScript file, where you put your CesiumJS codes, and then define the location of your 3D Tiles.
```
...
var tileset = new Cesium.Cesium3DTileset({
  url: 'data/Essen/tileset.json' // URL to tileset
});
myViewer.scene.primitives.add(tileset);
...
```

#### 4) Colorize the building based your data
This demo uses randomly generated data of annual building heat demand in the whole city.