let map = L.map('map', {
  zoomControl: false,
  gestureHandling: true,
}).setView([51.505, -0.09], 13);

// Layers
let locationLayer;
$.getJSON('/map-data/all-properties', function(data) {
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
      const prop = feature.properties
        layer.bindPopup(
          `
          <div class="card">
            <img src="${prop.images[0].image_url}" class="card-img-top" alt="Property image">
            <div class="card-body">
              <h5 class="mb-2" id="card-header">₱${Math.round(Number(prop.price))} /mo </h5>
              
              <!-- Property details -->
              <p class="card-text m-0 mb-1">
                ${prop.category.charAt(0).toUpperCase() +prop.category.slice(1)} <br>
                <strong>${prop.floor_area}</strong> sqm | <strong>${prop.bedrooms}</strong> bed/s
              </p>

              <!-- View Details button -->
              <a href="/listings/${feature.id}" class="btn btn-outline-primary btn-sm">View Details</a>
            </div>
          </div>
          `,
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
   map.fitBounds(location.getBounds(), {
    maxZoom: 7,
    padding: [50, 50]
   })
});




// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 22,
}).addTo(map);


let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
})

var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 22
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
});

let basemaps = {
  "Road": terrain,
  "Satellite": satellite,
  "OSM": OpenStreetMap_HOT,
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

// Add Utils Leaflet
var MyPanel = L.Control.extend({
  onAdd: function(map) {
    var div = L.DomUtil.create('div', 'my-panel');
    div.innerHTML = "hello world";
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});

// Add instance of the control
map.addControl(new MyPanel({ position: 'topright' }));



