// Initialize map
const map = L.map("map", { zoomControl: false })
  .setView([12.8797, 121.7740], 6);

// Base layers
const terrain = L.tileLayer("http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}", { maxZoom: 22 }).addTo(map);
const satellite = L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", { maxZoom: 22 });
const cartoVoyager = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 22,
});
const osmHot = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", { maxZoom: 19 });

// Basemap collection
const basemaps = { Road: terrain, Satellite: satellite, OSM: osmHot, Voyager: cartoVoyager };

// Controls
L.control.layers(basemaps, null, { position: "bottomright" }).addTo(map);
L.control.zoom({ position: "topright" }).addTo(map);

// Marker handling
let currentMarker = null;
const customIcon = L.divIcon({
  html: '<i class="bi bi-geo-alt-fill" style="font-size:32px;color:red;display:flex;align-items:center;justify-content:center;width:48px;height:48px;"></i>',
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 45],
});

// Pin button
const addNewBtn = document.getElementById("pinbtn");
L.DomEvent.on(addNewBtn, "click", (e) => {
  L.DomEvent.stopPropagation(e);
  L.DomEvent.preventDefault(e);

  if (currentMarker) {
    map.removeLayer(currentMarker);
    currentMarker = null;
  }

  map.pm.enableDraw("Marker", { markerStyle: { icon: customIcon } });

  map.once("pm:create", (e) => {
    currentMarker = e.layer.addTo(map);
    map.pm.disableDraw();

    const [lng, lat] = e.layer.toGeoJSON().geometry.coordinates;
    document.querySelector('input[name="latitude"]').value = lat;
    document.querySelector('input[name="longitude"]').value = lng;
  });
});
