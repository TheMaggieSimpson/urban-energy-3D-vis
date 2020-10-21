// HTML overlay for showing feature name on mouseover
var nameOverlay = document.createElement('div');
myViewer.container.appendChild(nameOverlay);
nameOverlay.className = 'backdrop';
nameOverlay.style.display = 'none';
nameOverlay.style.position = 'absolute';
nameOverlay.style.bottom = '0';
nameOverlay.style.left = '0';
nameOverlay.style['pointer-events'] = 'none';
nameOverlay.style.padding = '4px';
nameOverlay.style.backgroundColor = 'black';
nameOverlay.style.color = 'white';
nameOverlay.style.fontFamily = 'monospace';
nameOverlay.style.fontSize = '0.75em';

// Information about the currently selected feature
var selected = {
    feature: undefined,
    originalColor: new Cesium.Color()
};

// Get default left click handler for when a feature is not picked on left click
var clickHandler = myViewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Information about the currently highlighted feature
var highlighted = {
    feature : undefined,
    originalColor : new Cesium.Color()
};

var overlayContent
// Color a feature yellow on hover.
myViewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
    // If a feature was previously highlighted, undo the highlight
    if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
    }
    // Pick a new feature
    var pickedFeature = myViewer.scene.pick(movement.endPosition);
    if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
    }
    // A feature was picked, so show it's overlay content
    nameOverlay.style.display = 'block'
    nameOverlay.style.bottom = myViewer.canvas.clientHeight - movement.endPosition.y + 'px'
    nameOverlay.style.left = movement.endPosition.x + 'px'
    var name = pickedFeature.getProperty('gmlID')
    if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty('id')
    }
    nameOverlay.textContent = name;

    // Highlight the feature if it's not already selected.
    if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.YELLOW;
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

myViewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    // If a feature was previously selected, undo the highlight
    if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor;
        selected.feature = undefined;
    }
    // Pick a new feature
    var pickedFeature = myViewer.scene.pick(movement.position);
    if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
    }
    // Select the feature if it's not already selected
    if (selected.feature === pickedFeature) {
        return;
    }
    selected.feature = pickedFeature;
    // Save the selected feature's original color
    if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
        highlighted.feature = undefined;
    } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
    }
    // Highlight newly selected feature
    pickedFeature.color = Cesium.Color.LIME;
    
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);