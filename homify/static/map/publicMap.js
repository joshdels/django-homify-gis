let map = L.map('map', {
  zoomControl: false
}).setView([51.505, -0.09], 13);

// Layers
let locationLayer;
$.getJSON('http://127.0.0.1:8000/map-data/all-properties', function(data) {
  if (locationLayer) {
    map.removeLayer(locationLayer);
  }

  let location = L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        color: "white",
        fillColor: "purple",
        fillOpacity: 1,
        fill: true,
        radius: 6,
        interactive: true
      })
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        `
        `
      );

      layer.on({
        mouseover: function(e) {
          e.target.setStyle({
            fillColor: "green",
            radius: 8
          });
        },
        mouseout: function(e) {
          e.target.setStyle({
            fillColor: "purple",
            radius: 6
          });
        },
      });
    }
  }).addTo(map)
   map.fitBounds(location.getBounds())
});

$.getJSON('http://127.0.0.1:8000/boundary-data/', function(data) {
  let boundary = L.geoJSON(data, {
    style: {
      color: "black",
      fillOpacity: 0,
      weight: 1,
      dashArray: '2,4'
    },
    interactive: false
  }).addTo(map);
  map.fitBounds(boundary.getBounds())
})


// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 19,
}).addTo(map);

let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
})


var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

let basemaps = {
  "Satellite": satellite,
  "Terrain": terrain,
  "Voyager": CartoDB_Voyager,
}


L.control.layers(basemaps, null, {
  position: 'bottomright'
}).addTo(map);

L.control.zoom({
  position: 'topright'
}).addTo(map);

//Print
L.easyPrint({	
  title: 'Print',
	position: 'topright',
  exportOnly: true,
  hideControlContainer: true,
  filename: 'homify-map',
}).addTo(map);





