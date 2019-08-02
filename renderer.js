// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// import 'ol/ol.css';
// import {Map, View} from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';

// const map = new Map({
//   target: 'map',
//   layers: [
//     new TileLayer({
//       source: new OSM()
//     })
//   ],
//   view: new View({
//     center: [0, 0],
//     zoom: 0
//   })
// });
const fs = require ('fs');

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';


var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'green', width: 1})
});

var styleFunction = function (feature) {
        
  var styles = {
    'Point': new Style({
      image: image
    }),
    'LineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 1
      })
    }),
    'MultiLineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 1
      })
    }),
    'MultiPoint': new Style({
      image: image
    }),
    'MultiPolygon': new Style({
      stroke: new Stroke({
        color: 'yellow',
        width: 1
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.1)'
      })
    }),
    'Polygon': new Style({
      stroke: new Stroke({
        color: 'blue',
        // lineDash: [4],
        width: 0.5
      }),
      fill: new Fill({
        color: 'rgba(0, 200, 255, 0.0)'
      }),
      text: new Text({
        text: feature.getProperties().name,
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({color: 'white', width: 0.5})
        })
    }),
    'GeometryCollection': new Style({
      stroke: new Stroke({
        color: 'magenta',
        width: 2
      }),
      fill: new Fill({
        color: 'magenta'
      }),
      image: new CircleStyle({
        radius: 10,
        fill: null,
        stroke: new Stroke({
          color: 'magenta'
        })
      })
    }),
    'Circle': new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)'
      })
    })
  };
        
  return styles[feature.getGeometry().getType()];
};

var geojsonObject = JSON.parse(fs.readFileSync('data/mgrs_grid.json'));

      var vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObject, {
          featureProjection: 'EPSG:3857' // Web Mercator
        }),
        
      });

      var vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction
      });

      var map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });