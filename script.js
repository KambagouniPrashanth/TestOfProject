const searchInput = document.getElementById("search-input").value;

const apiUrl = `https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=2023-09-16&checkout=2023-09-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;

const apiKey = '1433e86e95msh95bf8abb7a20967p1f9e24jsn0911d4dfa9e9';

let userLocation;

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    }
}

function fetchListings() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const listingsContainer = document.getElementById("listings-container");
        listingsContainer.innerHTML = "";

        data.listings.forEach(listing => {
            const listingCard = createListingCard(listing);
            listingsContainer.appendChild(listingCard);

            const directionsButton = listingCard.querySelector(".directions-button");
            directionsButton.addEventListener("click", () => openDirections(listing.location));
        });
    })
    .catch(error => console.error('Error:', error));
}

function createListingCard(listing) {
    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card");

    const reviewsP = document.createElement("p");
    reviewsP.innerHTML = `Reviews: ${listing.reviews_count} | Average Rating: ${calculateAverageRating(listing.reviews)}`;

    const hostDetails = document.createElement("p");
    hostDetails.innerText = `Hosted by ${createHostDetails(listing.host)}`;

    const amenitiesPreview = document.createElement("p");
    amenitiesPreview.innerText = `Amenities: ${createAmenitiesPreview(listing.amenities)}`;

    const rareFindIndicator = document.createElement("p");
    rareFindIndicator.innerText = "Rare Find";
    rareFindIndicator.style.color = "green";

    if (listing.is_rare_find) {
        listingCard.appendChild(rareFindIndicator);
    }

    const superhostIndicator = document.createElement("p");
    superhostIndicator.innerText = "Superhost";
    superhostIndicator.style.color = "red";

    if (listing.host.is_superhost) {
        listingCard.appendChild(superhostIndicator);
    }

    const costButton = document.createElement("button");
    costButton.innerText = "Show Booking Cost Breakdown";
    costButton.addEventListener("click", () => showBookingCostBreakdown(listing));

    const directionsButton = document.createElement("button");
    directionsButton.innerText = "Get Directions";
    directionsButton.addEventListener("click", () => openDirections(listing.location));

    listingCard.innerHTML = `
        <img src="${listing.image}" alt="${listing.title}">
        <div class="listing-info">
            <h2>${listing.title}</h2>
            <p>${listing.propertyType} · ${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
            <p>${listing.price} per night</p>
            <p>${listing.location}</p>
        </div>
    `;

    listingCard.appendChild(reviewsP);
    listingCard.appendChild(hostDetails);
    listingCard.appendChild(amenitiesPreview);
    listingCard.appendChild(costButton);
    listingCard.appendChild(directionsButton);

    return listingCard;
}

function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
        return "No reviews yet";
    }

    let sum = 0;
    for (let review of reviews) {
        sum += review.rating;
    }

    return (sum / reviews.length).toFixed(1);
}

function createHostDetails(host) {
    let hostText = host.name;

    if (host.is_superhost) {
        hostText += " (Superhost)";
    }

    return hostText;
}

function createAmenitiesPreview(amenities) {
    const previewAmenities = amenities.slice(0, 3);
    let previewText = previewAmenities.join(", ");

    if (amenities.length > 3) {
        const extraCount = amenities.length - 3;
        previewText += `, and ${extraCount} more`;
    }

    return previewText;
}

function showBookingCostBreakdown(listing) {
    const additionalFees = listing.price * 0.10; // Assuming additional fees are 10% of base price
    const totalCost = listing.price + additionalFees;

    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    document.body.appendChild(modal);
}

function openDirections(location) {
    const url = `https://www.google.com/maps/dir//${location.latitude},${location.longitude}`;
    window.open(url, "_blank");
}

const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
    fetchListings();
});

window.addEventListener("DOMContentLoaded", () => {
    fetchListings();
});