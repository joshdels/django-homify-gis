// filter.js
console.log("Hello Josh Filter");

// Store current filter values globally (accessible from map.js)
let priceMin = 0;
let priceMax = 9999999;
let amenities = [];

// Desktop and mobile options
const desktopOptions = document.querySelectorAll('.dropdown-menu .form-check-input');
const mobileOptions = document.querySelectorAll('#mobileFilters .form-check-input');

const filterButtonDesktop = document.getElementById("submitButtonDesktop");
const filterButtonMobile = document.getElementById("submitButtonMobile");

// Function to collect selected filters
function getSelectedFilters(isMobile = false) {
    const userChoice = [];
    if (isMobile) {
        priceMin = parseFloat(document.getElementById("priceMinMobile").value);
        priceMax = parseFloat(document.getElementById("priceMaxMobile").value);
        mobileOptions.forEach(val => { if (val.checked) userChoice.push(val.value); });
    } else {
        priceMin = parseFloat(document.getElementById("rangeMin").value);
        priceMax = parseFloat(document.getElementById("rangeMax").value);
        desktopOptions.forEach(val => { if (val.checked) userChoice.push(val.value); });
    }
    amenities = userChoice;
}

// Event listeners for filter buttons
filterButtonDesktop.addEventListener("click", function() {
    getSelectedFilters(false);
    if (typeof fetchProperties === "function") fetchProperties(); // call map fetch
});

filterButtonMobile.addEventListener("click", function() {
    getSelectedFilters(true);
    if (typeof fetchProperties === "function") fetchProperties(); // call map fetch
});
