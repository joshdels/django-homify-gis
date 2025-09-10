// Initialize Leaflet map
let map = L.map('map-listing', {
    zoomControl: false,
    // gestureHandling: true
}).setView([12.8797, 121.7740], 6);

// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 }).addTo(map);
let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 });
let OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 22 });

let basemaps = { "Road": terrain, "Satellite": satellite, "OSM": OpenStreetMap_HOT };
L.control.layers(basemaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

// Layer to hold markers
let locationLayer;
let markerMap = {}; // reset per fetch

function fetchProperties() {
    $.getJSON('/map-data/all-properties', {

        
    }, function(data) {
        // Remove old layer and reset markerMap
        if (locationLayer) map.removeLayer(locationLayer);
        markerMap = {};

        locationLayer = L.geoJSON(data.features, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    color: "white",
                    fillColor: "purple",
                    fillOpacity: 1,
                    radius: 6,
                    interactive: true
                });
            },
        }).addTo(map);

        // Fit bounds if needed
        if (data.length) map.fitBounds(locationLayer.getBounds(), { maxZoom: 7, padding: [50, 50] });

        renderPropertyList(data.features);
    });
}


fetchProperties();
