// -----------------------------
// Initialize Leaflet map
// -----------------------------
let map = L.map('map-listing', {
    zoomControl: false,
    gestureHandling: true,
    minZoom: 15,
    maxZoom: 22,
}).setView([12.8797, 121.7740], 15);

// -----------------------------
// Base layers
// -----------------------------
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 })
let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', { maxZoom: 22 }).addTo(map);
let OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 22 });

let basemaps = { "Road": terrain, "Satellite": satellite, "OSM": OpenStreetMap_HOT };
L.control.layers(basemaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

// -----------------------------
// Custom "Recenter" button
// -----------------------------
var legendControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function(map) {
        var div = L.DomUtil.create("div", "leaflet-home");
        div.innerHTML = `<button id="legend-home"> <i class="bi bi-house-door"></i> Recenter</button>`;

        // Button action
        let btn = div.querySelector("#legend-home");
        L.DomEvent.on(btn, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            map.fitBounds(locationLayer.getBounds(), { maxZoom: 18, padding: [50, 50] });
        });

        // Prevent map interaction when clicking
        L.DomEvent.disableClickPropagation(div);

        return div;
    }
});
map.addControl(new legendControl());

// -----------------------------
// Google Maps button (top-left)
// -----------------------------
var GoogleMapsControl = L.Control.extend({
    options: { position: 'topleft' },

    onAdd: function(map) {
        var div = L.DomUtil.create("div", "leaflet-googlemaps-btn");
        div.innerHTML = `
            <button id="googlemaps-btn" 
                <i class="bi bi-pin-map"></i> Get Direction
                
            </button>
        `;

        let btn = div.querySelector("#googlemaps-btn");
        L.DomEvent.on(btn, "click", (e) => {
            L.DomEvent.stopPropagation(e);

            // Get current map center
            let center = map.getCenter();
            let gmapsUrl = `https://www.google.com/maps?q=${center.lat},${center.lng}`;

            // Open Google Maps in new tab
            window.open(gmapsUrl, "_blank");
        });

        // Prevent map drag/zoom when clicking button
        L.DomEvent.disableClickPropagation(div);

        return div;
    }
});

// Add the button to the map
map.addControl(new GoogleMapsControl());

// -----------------------------
// Layer to hold markers
// -----------------------------
let locationLayer;
let markerMap = {}; // reset per fetch

// -----------------------------
// Fetch property GeoJSON
// -----------------------------
function fetchProperties(id) {
    $.getJSON(`/map-data/single-property/${id}/`, function(data) {
        // Remove old layer and reset
        if (locationLayer) map.removeLayer(locationLayer);
        markerMap = {};

        // Add markers
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
                                margin: auto;">
                                <i class="bi bi-house-door-fill" style="font-size: 14px; color: white;"></i>
                            </div>
                        </div>`
                    })
                })
            },
        }).addTo(map);

        // Fit to bounds
        map.fitBounds(locationLayer.getBounds(), { maxZoom: 18, padding: [50, 50] });

        renderPropertyList(data.features);
    });
}

fetchProperties();

// -----------------------------
// Share listing function
// -----------------------------
function shareListing(address) {
  const url = window.location.href;
  const shareData = {
    title: "Homify Listing",
    text: "Check out this property: " + address,
    url: url
  };

  if (navigator.share) {
    navigator.share(shareData).catch(console.error);
  } else {
    // Copy to clipboard & show modal
    navigator.clipboard.writeText(url).then(() => {
      document.getElementById("share-link").value = url;
      document.getElementById("shareModal").style.display = "block";
    });
  }
}

// Close modal
function closeShareModal() {
  document.getElementById("shareModal").style.display = "none";
}
