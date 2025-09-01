let map = L.map("map", {
  zoomControl: false,
}).setView([12.8797, 121.7740], 6);

// Layers
$.getJSON("http://127.0.0.1:8001/map-data/user-properties", function (data) {
  let location = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        color: "white",
        fillColor: "purple",
        fillOpacity: 1,
        fill: true,
        radius: 6,
        interactive: true,
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `
        <p> Hello Private Users</p> 
        `
      );

      // layer.on({
      //   mouseover: function(e) {
      //     e.target.setStyle({
      //       fillColor: "green",
      //       radius: 8
      //     });
      //   },
      //   mouseout: function(e) {
      //     e.target.setStyle({
      //       fillColor: "purple",
      //       radius: 6
      //     });
      //   },
      // });
    },
  }).addTo(map);
     map.fitBounds(location.getBounds(), {
      maxZoom: 7,
      padding: [50, 50]
     }
    )
});

$.getJSON("/boundary-data/", function (data) {
  let boundary = L.geoJSON(data, {
    style: {
      color: "black",
      fillOpacity: 0,
      weight: 1,
      dashArray: "2,4",
    },
    interactive: false,
  }).addTo(map);
  map.fitBounds(boundary.getBounds(), {
    maxZoom: 12,
    padding: [50, 50]
  });
});

// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 22,
}).addTo(map);


let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
})


var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});


let basemaps = {
  "Road": terrain,
  "Satellite": satellite,
  "OSM": OpenStreetMap_HOT,
}

L.control.layers(basemaps, null, {
  position: 'bottomright'
}).addTo(map);

L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);

//Print
L.easyPrint({
  title: "Print",
  position: "topright",
  exportOnly: true,
  hideControlContainer: true,
  filename: "homify-map",
}).addTo(map);

const addNewBtn = document.getElementById("add-new-location");

L.DomEvent.on(addNewBtn, "click", function (e) {
  L.DomEvent.stopPropagation(e);
  L.DomEvent.preventDefault(e);

  map.pm.enableDraw("Marker");

  map.once("pm:create", (e) => {
    const layer = e.layer;
    layer.addTo(map);

    map.pm.disableDraw();

    const geojson = layer.toGeoJSON();
    const coords = geojson.geometry.coordinates;

    // Redirect to add-location with lng & lat query params
    window.location.href = `/add-location/?lng=${coords[0]}&lat=${coords[1]}`;
  });
});

 
