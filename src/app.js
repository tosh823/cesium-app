require('cesium/Widgets/widgets.css');
require('./css/styles.css');

var Cesium = require('cesium/Cesium');
Cesium.BingMapsApi.defaultKey = "AiMlFcA_DUmJ-ShjLpX_mudqS6LFGw4r1rcCrYanKfSVTiOpmcFoNwEqKo04okVH";

var viewer = new Cesium.Viewer('cesiumContainer');
// cube http://localhost:8003/oulu/tilesets/sample
// dragon http://localhost:8003/oulu/tilesets/dragon
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url : 'http://localhost:8003/oulu/tilesets/sample',
    debugShowBoundingVolume: true,
    debugShowGeometricError: true,
    debugColorizeTiles: true,
    debugShowRenderingStatistics: true
}));

tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberOfTilesProcessing) {
    if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
        console.log('Stopped loading');
        return;
    }
    console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberOfTilesProcessing);
});

tileset.readyPromise.then(function(tileset) {
    viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
});
