# Urban Energy 3D Visualization

This is an example of visualizing energy data of urban buildings using [CesiumJS](https://www.cesium.com/platform/cesiumjs/) and [3D Tiles](https://cesium.com/why-cesium/3d-tiles/), so that the data can be viewed in a web browser.
This guide assumes that you already have the basic knowledge about CesiumJS. The following CesiumJS tutorials are recommended:
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
var tileset = new Cesium.Cesium3DTileset({
  url: 'data/Essen/tileset.json' // URL to tileset
});
myViewer.scene.primitives.add(tileset);
```

#### 4) Colorize the building based your data
This demo uses [randomly generated data of annual building heating demand in the whole city](https://github.com/TheMaggieSimpson/urban-energy-3D-vis/blob/master/data/essen_heatDemand.json). Each building in this data has an ID and annual heating demand. The building ID is unique and correspond with the building dataset in 3D Tiles.
The code below categorizes heating demand into 9 categories, and put each building in the 3D Tiles accordingly based on its annual heating demand.

```
let dataset25, dataset50, dataset75, dataset100, dataset125, dataset150, dataset200, dataset250, dataset251, datasetNone
    
  for (idx = 0; idx < json.length; idx++) {
    let buildingID = json[idx]["gml_id"] // Building ID on the JSON file
    let param = json[idx]["annual_heat_demand"] // Visualized parameter
    param = parseFloat(param.replace(",","."))
                    
    if (param == "" || isNaN(param)){
      if (!datasetNone) {
        datasetNone = '(regExp("'+buildingID+'").test(${gmlID}))' // "gmlID" refers the to variable name of the Building ID in the tileset file
      } else {
        datasetNone += '|| (regExp("'+buildingID+'").test(${gmlID}))'
      }
    } else if (param <= 25){
      if (!dataset25) {
        dataset25 = '(regExp("'+buildingID+'").test(${gmlID}))'
      } else {
        dataset25 += '|| (regExp("'+buildingID+'").test(${gmlID}))'
      }
    } else if (param <= 50) {
      if (!dataset50) {
        dataset50 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset50 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 75) {
      if (!dataset75) {
        dataset75 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset75 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 100) {
      if (!dataset100) {
        dataset100 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset100 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 125) {
      if (!dataset125) {
        dataset125 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset125 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 150) {
      if (!dataset150) {
        dataset150 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset150 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 200) {
      if (!dataset200) {
        dataset200 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset200 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param <= 250) {
      if (!dataset250) {
        dataset250 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset250 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    } else if (param > 250) {
      if (!dataset251) {
        dataset251 = '(regExp("'+buildingID+'").test(${gmlID}))';
      } else {
        dataset251 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
      }
    }
  }
```
Next, the buildings are colored according to their annual heating demand category.
```
// style the tileset based on heat demand
tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
        conditions: [
            [dataset25, "color('#61B949')"], // 0-25 kWh/m²a
            [dataset50, "color('#A4C711')"], // 26-50 kWh/m²a
            [dataset75, "color('#B2D531')"], // 51-75 kWh/m²a
            [dataset100, "color('#D1E023')"], // 76-100 kWh/m²a
            [dataset125, "color('#F6EC00')"], // 101-125 kWh/m²a
            [dataset150, "color('#FECE02')"], // 126-150 kWh/m²a
            [dataset200, "color('#F9A717')"], // 151-200 kWh/m²a
            [dataset250, "color('#F56D1F')"], // 201-250 kWh/m²a
            [dataset251, "color('#F22E22')"], // > 250 kWh/m²a
            ['true', 'color("white")'] // for all buildings that do not have heat demand data
        ]
    }
});
```