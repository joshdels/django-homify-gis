console.log("Hello Josh Filter");

// --- CSRF Token helper ---
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// --- Global filter values ---
let priceMin = 0;
let priceMax = 9999999;
let amenities = [];

// --- Options ---
const desktopOptions = document.querySelectorAll('.dropdown-menu .form-check-input');
const mobileOptions = document.querySelectorAll('#mobileFilters .form-check-input');

const filterButtonDesktop = document.getElementById("submitButtonDesktop");
const filterButtonMobile = document.getElementById("submitButtonMobile");

// --- Collect filters ---
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
    return { priceMin, priceMax, amenities };
}

// --- Desktop filter submit ---
filterButtonDesktop.addEventListener("click", function() {
    console.log("running desktop");

    const filters = getSelectedFilters(false);

    fetch("http://127.0.0.1:8001/map-data/all-properties/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken  
        },
        body: JSON.stringify(filters)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from Django:", data);
        // TODO: update UI here
    })
    .catch(err => console.error("Fetch error:", err));
});

// --- Mobile filter submit ---
filterButtonMobile.addEventListener("click", function() {
    const filters = getSelectedFilters(true);

    fetch("http://127.0.0.1:8001/map-data/all-properties/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(filters)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from Django (mobile):", data);
    })
    .catch(err => console.error("Fetch error:", err));
});
