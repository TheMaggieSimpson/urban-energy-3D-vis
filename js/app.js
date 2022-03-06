var myViewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    url : 'https://a.tile.openstreetmap.org/'
  }),
  animation: false,
  timeline: false,
  geocoder: false,
  baseLayerPicker: false,
});
myViewer.scene.globe.depthTestAgainstTerrain = true;

var tileset = new Cesium.Cesium3DTileset({
  url: 'data/Essen/tileset.json' // URL to tileset
});
myViewer.scene.primitives.add(tileset);

tileset.readyPromise.then(function () {
  myViewer.zoomTo(
    tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius / 0.5)
  );

  // set the altitude of the tileset
  let height = -110; // reset this value if needed
  let cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
  let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
  let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
  let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
});

// read heat demand data from a JSON file
$.getJSON( "data/essen_heatDemand.json", function(data) {
  console.log( "success" );
})
.done(function( json ) {
  // parse the data and group the buildings based on the value of their heating demand
  // [boundary, dataset to color the buildings, color]
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

  })
  .fail(function( textStatus, error ) {
    let err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });