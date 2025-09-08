// ==========================
// Initialize Leaflet map
// ==========================
let map = L.map("map", {
    zoomControl: false,
    gestureHandling: true
}).setView([12.8797, 121.7740], 6);

// ==========================
// Basemaps
// ==========================
let terrain = L.tileLayer("http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}", { maxZoom: 22 }).addTo(map);
let satellite = L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", { maxZoom: 22 });
let osmHot = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    maxZoom: 22,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let basemaps = { "Road": terrain, "Satellite": satellite, "OSM": osmHot };
L.control.layers(basemaps, null, { position: "bottomright" }).addTo(map);
L.control.zoom({ position: "topright" }).addTo(map);
L.control.fullscreen({ position: "topright", title: "View Fullscreen", titleCancel: "Exit Fullscreen" }).addTo(map);

// ==========================
// Recenter Button
// ==========================



// ==========================
// Legend
// ==========================
let LegendControl = L.Control.extend({
    options: { position: "bottomleft" },
    onAdd: function () {
        let div = L.DomUtil.create("div", "info-legend");
        div.innerHTML = `
            <h6 style="margin:0 0 5px 0; font-weight:bold;">
                <i style="background: purple; width: 18px; height: 18px; display:inline-block; margin-right:5px; border-radius: 50%"></i>
                Properties
            </h6>
            <p style="margin:0; font-size:12px; font-style:italic;">
                Click on the <span style="color:purple;">purple circles</span> to view information
            </p>
        `;
        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});
map.addControl(new LegendControl());

// ==========================
// Utility
// ==========================
function displayValue(value) {
    if (value === null || value === undefined) return "--";
    if (typeof value === "string") {
        let v = value.trim().toLowerCase();
        if (["null", "undefined", ""].includes(v)) return "--";
    }
    return value;
}

// ==========================
// Fetch and Render Properties
// ==========================
let locationLayer;

function fetchProperties() {
    $.getJSON("/map-data/user-properties", function (data) {
        if (locationLayer) map.removeLayer(locationLayer);

        locationLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                color: "white",
                fillColor: "purple",
                fillOpacity: 1,
                radius: 6,
                interactive: true
            }),
            onEachFeature: (feature, layer) => {
                const prop = feature.properties;

                layer.bindPopup(`
                    <div class="card">
                        <img src="${prop.images[0]?.image_url || ''}" class="card-img-top" alt="Property image">
                        <div class="card-body">
                            <h5 class="mb-2">₱${Math.round(Number(prop.price))} /mo</h5>
                            <p class="card-text m-0 mb-1">
                                ${prop.property_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} <br>
                                <strong>${displayValue(prop.floor_area)}</strong> sqm | 
                                <strong>${displayValue(prop.bedrooms)}</strong> bed/s
                            </p>
                            <a href="/listings/${feature.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                        </div>
                    </div>
                `);

                layer.on({
                    mouseover: (e) => e.target.setStyle({ fillColor: "green", radius: 8 }),
                    mouseout: (e) => e.target.setStyle({ fillColor: "purple", radius: 6 })
                });
            }
        }).addTo(map);

    });
}

// ==========================
// Events
// ==========================
map.on("moveend", fetchProperties);
fetchProperties();
