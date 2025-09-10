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
let firstLoad = true;

function getCookie(name) {
    // This will get the csrf to by pass the protection
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

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
                            <p class="card-text m-0 mb-2">
                                ${prop.property_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} <br>
                                <strong>${displayValue(prop.floor_area)}</strong> sqm | 
                                <strong>${displayValue(prop.bedrooms)}</strong> bed/s
                            </p>

                            <div class="d-flex gap-2">
                                
                                <a href="/listings/${feature.id}" class="btn btn-outline-primary btn-sm ">View Details</a>
                                <a href="/listings/${feature.id}/update" class="btn btn-success btn-sm text-white">Edit</a>
                                <button class="btn btn-danger btn-sm text-white" onclick="
                                    const f = document.createElement('form');
                                    f.method='post';
                                    f.action='/listings/${feature.id}/delete/';
                                    const csrf = document.createElement('input');
                                    csrf.type='hidden';
                                    csrf.name='csrfmiddlewaretoken';
                                    csrf.value='${csrftoken}'; 
                                    f.appendChild(csrf);
                                    document.body.appendChild(f);
                                    f.submit();
                                ">
                                Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `);

                layer.on({
                    mouseover: (e) => e.target.setStyle({ fillColor: "green", radius: 8 }),
                    mouseout: (e) => e.target.setStyle({ fillColor: "purple", radius: 6 })
                });
            }
            
        }).addTo(map);

        if(firstLoad) {
            map.fitBounds(locationLayer.getBounds(), {
                maxZoom: 10,
                padding: [5, 5],
            });
            firstLoad = false;
        }

    });
}

// ==========================
// Events
// ==========================
map.on("moveend", fetchProperties);
fetchProperties();
