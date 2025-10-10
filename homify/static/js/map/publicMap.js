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
L.control.fullscreen({position: 'topright', title: 'View Fullscreen', titleCancel: 'Exit Fullscreen'}).addTo(map);

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
let firstLoad = true;

function fetchProperties(filter = null) {
    let bounds = map.getBounds();
    let sw = bounds.getSouthWest();
    let ne = bounds.getNorthEast();

    if (filter) {
        let payload = {
            swLat: sw.lat,
            swLng: sw.lng,
            neLat: ne.lat,
            neLng: ne.lng,
            ...filter // merge filter values
        };

        $.ajax({
            url: '/map-data/all-properties/', 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: handlePropertyResponse,
            error: function (err) {
                console.error("POST error:", err);
            }
        });

    } else {
        $.getJSON('/map-data/all-properties/', {
            swLat: sw.lat,
            swLng: sw.lng,
            neLat: ne.lat,
            neLng: ne.lng
        }, handlePropertyResponse);
    }
}

// common handler
function handlePropertyResponse(data) {
    if (locationLayer) map.removeLayer(locationLayer);
    markerMap = {};

    locationLayer = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: "white",
                fillColor: "purple",
                fillOpacity: 1,
                radius: 6,
                interactive: true
            });
        },
        onEachFeature: function (feature, layer) {
            const prop = feature.properties;

            markerMap[prop.id] = markerMap[prop.id] || [];
            markerMap[prop.id].push(layer);

            layer.bindPopup(`
                <div class="card">
                    <img src="${prop.images[0]?.image_url || ''}" class="card-img-top" alt="Property image">
                    <div class="card-body">
                        <h5 class="mb-2">₱${Math.round(Number(prop.price))} /mo</h5>
                        <p class="card-text m-0 mb-1">
                            ${prop.property_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} <br>
                            <strong>${prop.floor_area || "--"}</strong> sqm | 
                            <strong>${prop.bedrooms || "--"}</strong> bed/s
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

    if (firstLoad && data.features.length > 0) {
        map.fitBounds(locationLayer.getBounds(), { maxZoom: 10, padding: [5, 5] });
        firstLoad = false;
    }

    renderPropertyList(data.features);
}

function renderPropertyList(features) {
    let listDiv = $('#property-list');
    let numberOfProperty = $('#available-properties');

    listDiv.empty();
    numberOfProperty.empty();

    if (!features.length) {
        listDiv.append(`
        <div class="col-12 mb-3 d-flex justify-content-center">
            <div class="card shadow-sm border-0 text-center p-4">
                <h5 class="fw-bold text-danger mb-2">No Properties Found</h5>
                <p class="text-muted mb-0">
                    Try zooming out, moving the map, or adjusting your filters.
                </p>
            </div>
        </div>
        `);
        numberOfProperty.append(`0`);
        return;
    }

    numberOfProperty.append(features.length);

    features.forEach(feature => {
        const prop = feature.properties;
        const id = feature.id;

        let html = `
        <div class="col-12 col-md-6 col-lg-6 mb-3 d-flex property-card" data-id="${id}">
          <a href="/listings/${id}" class="w-100 text-decoration-none text-dark">
            <div class="card shadow-sm h-100 border-0 d-flex flex-column">
              <img src="${prop.images[0]?.image_url || 'https://via.placeholder.com/400x180'}"
                  class="card-img-top img-fluid rounded-top"
                  alt="Property image"
                  style="height: 180px; object-fit: cover;">

              <div class="card-body flex-grow-1">
                <p class="fw-bold h4 mb-2">₱${Math.round(Number(prop.price))}/mo </p>
                <p class="small mb-0">
                  ${prop.property_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || ''} |
                  <strong>${prop.floor_area || "--"}</strong> sqm | 
                  <strong>${prop.bedrooms || "--"}</strong> bed/s
                </p>
                <p>${prop.address || ''}</p>
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
            if (marker) marker.forEach(m => m.setStyle({ fillColor: "green", radius: 8 }));
        },
        function () {
            let id = $(this).data("id");
            let marker = markerMap[id];
            if (marker) marker.forEach(m => m.setStyle({ fillColor: "purple", radius: 6 }));
        }
    );
}

// map events
map.on('moveend', () => fetchProperties());
fetchProperties();


// TESTING
const divHeight = document.getElementById('search-panel');
const offsetHeight = divHeight.offsetHeight;
const computedStyle = window.getComputedStyle(divHeight);;
const rect  = divHeight.getBoundingClientRect();
const contentHeight = divHeight.clientHeight;



