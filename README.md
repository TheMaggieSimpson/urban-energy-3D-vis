# Urban Energy 3D Visualization

This is an example of visualizing energy data of urban buildings using [CesiumJS](https://www.cesium.com/platform/cesiumjs/) and [3D Tiles](https://cesium.com/why-cesium/3d-tiles/), so that the data can be viewed in a web browser.
This guide assumes that you already have the basic knowledge about CesiumJS. The following CesiumJS tutorials are recommended to better understand this guide:
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
This demo uses [randomly generated data of annual building heating demand in the whole city](https://github.com/TheMaggieSimpson/urban-energy-3D-vis/blob/master/data/essen_heatDemand.json). Each building in this data has an ID and annual heating demand. The building ID is unique and corresponds with the building dataset in 3D Tiles.
The code below categorizes heating demand into 10 categories, and put each building in the 3D Tiles accordingly based on its annual heating demand.

```
let arrDataset = [
    [25, null, "color('#61B949')"], [50, null, "color('#A4C711')"], [75, null, "color('#B2D531')"],
    [100, null, "color('#D1E023')"], [125, null, "color('#F6EC00')"], [150, null, "color('#FECE02')"],
    [200, null, "color('#F9A717')"], [250, null, "color('#F56D1F')"], [251, null, "color('#F22E22')"]
  ];

  for (idx = 0; idx < json.length; idx++) {
    let buildingId = json[idx]["gml_id"]; // Building ID on the JSON file
    let param = json[idx]["annual_heat_demand"]; // Visualized parameter
    param = parseFloat(param.replace(",","."));

    let i = 0;
    while ( param > arrDataset[i][0] && i < arrDataset.length-1) {
      i++;
    }
    // Merge the string
    if (arrDataset[i][1]) {
      // merging
      arrDataset[i][1] += '|| (regExp("'+buildingId+'").test(${gmlID}))'; // "gmlID" refers the to variable name of the Building ID in the tileset file
    } else {
      // initialization
      arrDataset[i][1] = '(regExp("'+buildingId+'").test(${gmlID}))';
    }
  }
```
Next, the buildings are colored according to their annual heating demand category.
```
// style the tileset based on heat demand
tileset.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      [arrDataset[0][1], arrDataset[0][2]], // 0-25 kWh/m²a
      [arrDataset[1][1], arrDataset[1][2]], // 26-50 kWh/m²a
      [arrDataset[2][1], arrDataset[2][2]], // 51-75 kWh/m²a
      [arrDataset[3][1], arrDataset[3][2]], // 76-100 kWh/m²a
      [arrDataset[4][1], arrDataset[4][2]], // 101-125 kWh/m²a
      [arrDataset[5][1], arrDataset[5][2]], // 126-150 kWh/m²a
      [arrDataset[6][1], arrDataset[6][2]], // 151-200 kWh/m²a
      [arrDataset[7][1], arrDataset[7][2]], // 201-250 kWh/m²a
      [arrDataset[8][1], arrDataset[8][2]], // > 250 kWh/m²a
      ['true', 'color("white")'] // for all buildings that do not have heat demand value
    ]
  }
});
```