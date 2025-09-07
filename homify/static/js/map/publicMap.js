// Initialize Leaflet map
let map = L.map('map', {
    zoomControl: false,
    gestureHandling: true
}).setView([12.8797, 121.7740], 6);

// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 }).addTo(map);
let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 });
let OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 22 });

let basemaps = { "Road": terrain, "Satellite": satellite, "OSM": OpenStreetMap_HOT };
L.control.layers(basemaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

// Legend
var legendControl = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function(map) {
        var div = L.DomUtil.create("div", "info-legend");
        div.innerHTML = `
            <div style="position: relative">
                <button id="legend-close" style="position:absolute;top:0;right:0;border:none;background:none;font-size:16px;cursor:pointer;">&times;</button>
                <h6 style="margin:0 0 5px 0; font-weight:bold;">
                    <i style="background: purple; width: 18px; height: 18px; display:inline-block; margin-right:5px; border-radius: 50%"></i>
                    Properties
                </h6>
                <p style="margin:0; font-size:12px; font-style:italic;">
                    Click on the <span style="color:purple;">purple circles</span> <br>to view information
                </p>
            </div>
        `;
        let closeBtn = div.querySelector("#legend-close");
        L.DomEvent.on(closeBtn, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            map.removeControl(this);
        });
        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});
let legend = new legendControl();
map.addControl(legend);

// Layer to hold markers
let locationLayer;
let markerMap = {}; // reset per fetch

function fetchProperties() {
    let bounds = map.getBounds();
    let sw = bounds.getSouthWest();
    let ne = bounds.getNorthEast();

    $.getJSON('/map-data/all-properties', {
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng
        
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
            onEachFeature: function(feature, layer) {
                const prop = feature.properties;

                markerMap[prop.id] = markerMap[prop.id] || [];
                markerMap[prop.id].push(layer);

                function displayValue(value) {
                    if (value === null || value === undefined) return "--";
                    if (typeof value === "string") {
                        let v = value.trim().toLowerCase();
                        if (v === "null" || v === "undefined" || v === "") return "--";
                    }
                    return value;
                }

                layer.bindPopup(`
                    <div class="card">
                        <img src="${prop.images[0]?.image_url || ''}" class="card-img-top" alt="Property image">
                        <div class="card-body">
                            <h5 class="mb-2">₱${Math.round(Number(prop.price))} /mo</h5>
                            <p class="card-text m-0 mb-1">
                                ${prop.category.charAt(0).toUpperCase() + prop.category.slice(1)} <br>
                                 <strong>${displayValue(prop.floor_area)}</strong> sqm | 
                                 <strong>${displayValue(prop.bedrooms)}</strong> bed/s
                            </p>
                            <a href="/listings/${feature.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                        </div>
                    </div>
                `);

                layer.on({
                    mouseover: function(e) {
                        e.target.setStyle({ fillColor: "green", radius: 8 });
                    },
                    mouseout: function(e) {
                        e.target.setStyle({ fillColor: "purple", radius: 6 });
                    },
                });
            }
        }).addTo(map);

        // Fit bounds if needed
        if (data.length) map.fitBounds(locationLayer.getBounds(), { maxZoom: 7, padding: [50, 50] });

        renderPropertyList(data.features);
    });
}

function renderPropertyList(features) {
    let listDiv = $('#property-list');
    listDiv.empty();

    if (!features.length) {
        listDiv.append('<p>No properties in this area.</p>');
        return;
    }

    features.forEach(feature => {
        const prop = feature.properties;
        const id = feature.id
        let html = `
        <div class="col-12 col-md-6 col-lg-6 mb-3 d-flex property-card">
          <a href="/listings/${id}" class="w-100 text-decoration-none text-dark">
            <div class="card shadow-sm h-100 border-0 d-flex flex-column">
              <img src="${prop.images[0]?.image_url || 'https://via.placeholder.com/400x180'}"
                  class="card-img-top img-fluid rounded-top"
                  alt="Property image"
                  style="height: 180px; object-fit: cover;">

              <div class="card-body flex-grow-1">
                <h5 class="card-title text-truncate">${prop.description || 'No description'}</h5>
                <p class="mb-2 small">
                  ${prop.category} | ${prop.property_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || ''}
                </p>
                <p class="fw-bold mb-0">₱${Math.round(Number(prop.price))}</p>
              </div>
            </div>
          </a>
        </div>
        `;
        listDiv.append(html);
    });

    // Hover effect
    $(".property-card").hover(
        function () {
            let id = $(this).data("id");
            let marker = markerMap[id];
            if (marker) marker.setStyle({ fillColor: "green", radius: 8 });
        },
        function () {
            let id = $(this).data("id");
            let marker = markerMap[id];
            if (marker) marker.setStyle({ fillColor: "purple", radius: 6 });
        }
    );
}

// Map events
map.on('moveend', fetchProperties);
fetchProperties();
