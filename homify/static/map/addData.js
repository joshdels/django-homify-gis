let map = L.map("map", {
  zoomControl: false,
}).setView([12.8797, 121.7740], 6);

// // Layers
// let locationLayer;
// $.getJSON('http://127.0.0.1:8000/location-data/', function(data) {
//   if (locationLayer) {
//     map.removeLayer(locationLayer);
//   }

//   let location = L.geoJSON(data, {
//     pointToLayer: function(feature, latlng) {
//       return L.circleMarker(latlng, {
//         color: "white",
//         fillColor: "purple",
//         fillOpacity: 1,
//         fill: true,
//         radius: 6,
//         interactive: true
//       })
//     },
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup(
//         `
//         <div class="card shadow border-0" style="width: 100%; max-width: 18rem;">
//           <img src="{% static 'leaflet/img/istockphoto-876864896-612x612.jpg' %}" class="card-img-top img-fluid" alt="Preview image">
//               <div class="card-body">
//                 <h5 class="mb-2" id="card-header">₱${feature.properties.rent_per_month}/month</h5>
//                 <p class="m-0 mb-1" id="card-text-1"> <strong> ${feature.properties.type} </strong> | <strong> 
//                   ${feature.properties.area_sqm}</strong> sqm  | <strong>${feature.properties.no_rooms}</strong> bed/s</p>
//                 <p class="m-0" id="card-text-2"> ${feature.properties.address}</p>
//               </div>
            
//             <button class="btn btn-primary open-modal-btn w-100" data-id="${feature.properties.id}">View Details</button>
//           </div>
//         </div>
//         `
//       );

//       layer.on({
//         mouseover: function(e) {
//           e.target.setStyle({
//             fillColor: "green",
//             radius: 8
//           });
//         },
//         mouseout: function(e) {
//           e.target.setStyle({
//             fillColor: "purple",
//             radius: 6
//           });
//         },
//       });
//     }
//   }).addTo(map)
// });




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
  position: 'bottomright',  
}).addTo(map);

L.control.zoom({
  position: 'topright'
}).addTo(map);


// Keep track of the current marker
let currentMarker = null;

// Geoman
const addNewBtn = document.getElementById("pinbtn");

L.DomEvent.on(addNewBtn, "click", function (e) {
  L.DomEvent.stopPropagation(e);
  L.DomEvent.preventDefault(e);

  if (currentMarker) {
    map.removeLayer(currentMarker);
    currentMarker = null;
  }

  // Enable drawing

  const customIcon = L.divIcon({
    html: '<i class="bi bi-geo-alt-fill" style="font-size:32px;color:red;display:flex;align-items:center;justify-content:center;width:48px;height:48px;"></i>',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 45]  
  });

  map.pm.enableDraw("Marker", {
    markerStyle: {
      icon: customIcon
    }
  });

  map.once("pm:create", (e) => {
    const layer = e.layer;

    // Save new marker
    currentMarker = layer;
    layer.addTo(map);
    map.pm.disableDraw();

    const geojson = layer.toGeoJSON();
    const coordinates = geojson.geometry.coordinates;

    console.log(coordinates);
    console.log(coordinates[1]);
    console.log(coordinates[0]);
    
    const latInput = document.querySelector('input[name="latitude"]');
    const lngInput = document.querySelector('input[name="longitude"]');

    latInput.value = coordinates[1];
    lngInput.value = coordinates[0];

  });
});


