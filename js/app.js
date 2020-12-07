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
    var height = -110; // reset this value if needed
    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  });

  // read heat demand data from a JSON file
  $.getJSON( "data/essen_heatDemand.json", function(data) {
    console.log( "success" );
  })
  .done(function( json ) {
    // parse the data and group the buildings based on the value of their heating demand
    var dataset25, dataset50, dataset75, dataset100, dataset125, dataset150, dataset200, dataset250, dataset251, datasetNone
    
    for (idx = 0; idx < json.length; idx++) {
      var buildingID = json[idx]["gml_id"] // Building ID on the JSON file
      var param = json[idx]["annual_heat_demand"] // Visualized parameter
      param = parseFloat(param.replace(",","."))
                    
      if (param == "" || isNaN(param)){
        if (!datasetNone) {
          datasetNone = '(regExp("'+buildingID+'").test(${gmlID}))' // "gmlID" refers the to variable name of the Building ID in the tileset file
        }
        else {
          datasetNone += '|| (regExp("'+buildingID+'").test(${gmlID}))'
        }
      }
      else if (param <= 25){
        if (!dataset25) {
          dataset25 = '(regExp("'+buildingID+'").test(${gmlID}))'
        }
        else {
          dataset25 += '|| (regExp("'+buildingID+'").test(${gmlID}))'
        }
      }
      else if (param <= 50) {
        if (!dataset50) {
          dataset50 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset50 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 75) {
        if (!dataset75) {
          dataset75 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset75 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 100) {
        if (!dataset100) {
          dataset100 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset100 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 125) {
        if (!dataset125) {
          dataset125 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset125 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 150) {
        if (!dataset150) {
          dataset150 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset150 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 200) {
        if (!dataset200) {
          dataset200 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset200 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param <= 250) {
        if (!dataset250) {
          dataset250 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset250 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
      else if (param > 250) {
        if (!dataset251) {
          dataset251 = '(regExp("'+buildingID+'").test(${gmlID}))';
        }
        else {
          dataset251 += '|| (regExp("'+buildingID+'").test(${gmlID}))';
        }
      }
    }

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

  })
  .fail(function( textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });