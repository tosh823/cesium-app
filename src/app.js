require('cesium/Widgets/widgets.css');
require('./css/styles.css');

var axios = require('axios');
var Cesium = require('cesium/Cesium');
Cesium.BingMapsApi.defaultKey = "AiMlFcA_DUmJ-ShjLpX_mudqS6LFGw4r1rcCrYanKfSVTiOpmcFoNwEqKo04okVH";

// 5a685d5f027a64771170f31d
// 59fae4f73730003a7c10e6a3
var viewer = new Cesium.Viewer('cesiumContainer');
axios.get("http://live3dmodelservice.ubicomp.oulu.fi/aika/oulu/api/city/all")
    .then(function (response) {

        for (var i = 0; i < response.data.length; i++) {
            var building = response.data[i];
            var url = "http://live3dmodelservice.ubicomp.oulu.fi/aika" + building.url;
            var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: url,
            }));

            /*
            debugShowBoundingVolume: true,
                debugShowGeometricError: true,
                debugShowRenderingStatistics: true,
                debugShowUrl: true
            */

            tileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
                if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
                    console.log('Loading completed - ' + url);
                    return;
                }
            });

            tileset.readyPromise.then(function (tileset) {
                var boundingSphere = tileset.boundingSphere;
                var center = boundingSphere.center;
                var transform = Cesium.Transforms.headingPitchRollToFixedFrame(center, new Cesium.HeadingPitchRoll());
                var move = new Cesium.Cartesian3(0, 0, -23);
                Cesium.Matrix4.multiplyByTranslation(transform, move, transform);
                tileset.modelMatrix = transform;

                viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius / 4.0));
                viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            });
        }
    })
    .catch(function (error) {

    });

