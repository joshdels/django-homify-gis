// Initialize Leaflet map
let map = L.map('map-listing', {
    zoomControl: false,
    gestureHandling: true,
    minZoom: 15,
    maxZoom: 22,
}).setView([12.8797, 121.7740], 6);

// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 })
let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 }).addTo(map);;
let OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 22 });

let basemaps = { "Road": terrain, "Satellite": satellite, "OSM": OpenStreetMap_HOT };
L.control.layers(basemaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);


var legendControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function(map) {
        var div = L.DomUtil.create("div", "leaflet-home");
        div.innerHTML = `
            <button id="legend-btn"> Recenter
            </button>
        `;

        // Whole button action
        let btn = div.querySelector("#legend-btn");
        L.DomEvent.on(btn, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            alert("🏠 Home button clicked!");
            // Example: map.setView([12.8797, 121.7740], 6);
        });

        // Prevent map interactions
        L.DomEvent.disableClickPropagation(div);

        return div;
    }
});

let legend = new legendControl();
map.addControl(legend);

// Layer to hold markers
let locationLayer;
let markerMap = {}; // reset per fetch

function fetchProperties(id) {
    $.getJSON(`/map-data/single-property/${id}/`, function(data) {
        // Remove old layer and reset markerMap
        if (locationLayer) map.removeLayer(locationLayer);
        markerMap = {};

        locationLayer = L.geoJSON(data.features, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: "custom-pin",
                        html: `
                        <div style="position: relative; width: 32px; height: 32px;">
                            <div style="
                                background: purple;
                                border: 2px solid white;
                                border-radius: 50%;
                                width: 30px;
                                height: 30px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 0 6px rgba(0,0,0,0.3);
                                margin: auto;
                            ">
                                <i class="bi bi-house-door-fill" style="font-size: 14px; color: white;"></i>
                            </div>
                        </div>
                        `
                    })
                });
            },
        }).addTo(map);


        // Fit bounds if needed
        map.fitBounds(locationLayer.getBounds(), { maxZoom: 18, padding: [50, 50] });

        renderPropertyList(data.features);
    });
}

fetchProperties();
