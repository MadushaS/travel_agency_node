const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const ratingSelect = document.querySelector('#rating');
const placesList = document.querySelector('#placeList');

let map;
let markers = [];
const position = { lat: null, lng: null };

function initMap() {
  console.log(position);

  map = new google.maps.Map(document.getElementById('map'),{
    center: position,
    zoom: 18,

  });

  const center = new google.maps.LatLng(position.lat, position.lng);
  map.panTo(center);
  map.zoom = 17;

  const searchBox = new google.maps.places.SearchBox(
    document.getElementById("search-box")
  );

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });


  // Create a PlacesService object to send search requests
  const service = new google.maps.places.PlacesService(map);

  // Listen for form submit and apply filters
  document.querySelector('#filter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters(service);
  });

  // add event listener for "Get Directions" button
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  document.getElementById("get-directions").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name
  });

  // Add marker to markers array
  markers.push(marker);

  // Add click event listener to show place info window
  marker.addListener('click', function () {
    const infowindow = new google.maps.InfoWindow({
      content: `<h6>${place.name}</h6>
                <p>${place.formatted_address}</p>
                <p>Rating: ${place.rating ? place.rating : 'N/A'}</p>`
    });
    infowindow.open(map, marker);
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function applyFilters(service) {
  const search = searchInput.value;
  const category = categorySelect.value;
  const rating = ratingSelect.value;

  // Create request object with search parameters
  const request = {
    query: search,
    type: category,
    rating: rating,
    location: map.getCenter(),
    radius: '500',
  };

  // Send search request and handle response
  service.textSearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Clear previous markers and list items
      clearMarkers();
      placesList.innerHTML = '';

      // Create markers and list items for each place
      results.forEach(result => {
        createMarker(result);
        const placeCard = cardMaker(result);
        placesList.appendChild(placeCard);
      });
    } else {
      console.error('Search request failed with status:', status);
    }
  });
}

function cardMaker(place) {
  const placeCard = document.createElement("div");
  placeCard.classList.add("card", "mb-3", "col-md-4");

  // Create the place card body element
  const placeCardBody = document.createElement("div");
  placeCardBody.classList.add("row", "no-gutters");

  // Create the place image element
  const placeImage = document.createElement("img");
  placeImage.src = place.photos ? place.photos[0].getUrl({ maxWidth: 350, maxHeight: 350 }) : `/images/no_image.jpg`;
  placeImage.classList.add("card-img");

  // Create the place details element
  const placeDetails = document.createElement("div");
  placeDetails.classList.add("col-md-8");

  // Create the place details body element
  const placeDetailsBody = document.createElement("div");
  placeDetailsBody.classList.add("card-body");

  // Create the place name element
  const placeName = document.createElement("h5");
  placeName.classList.add("card-title");
  placeName.textContent = place.name;

  // Create the place address element
  const placeAddress = document.createElement("p");
  placeAddress.classList.add("card-text");
  placeAddress.textContent = place.formatted_address;

  // Create the place rating element
  const placeRating = document.createElement("p");
  placeRating.classList.add("card-text");
  placeRating.innerHTML = `Rating: ${place.rating} <i class="fas fa-star"></i>`;

  // Append the elements to the card and card body
  placeCardBody.appendChild(placeImage);
  placeCardBody.appendChild(placeDetails);

  placeDetails.appendChild(placeDetailsBody);
  placeDetailsBody.appendChild(placeName);
  placeDetailsBody.appendChild(placeAddress);
  placeDetailsBody.appendChild(placeRating);

  placeCard.appendChild(placeCardBody);

  // Append the card to the place list
  return placeCard;
}

const param = window.location.search;
const urlParams = new URLSearchParams(param);
if (urlParams.get('lat') && urlParams.get('long')) {
  position.lat = parseFloat(urlParams.get('lat'));
  position.lng = parseFloat(urlParams.get('long'));
} else if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (e) {
    console.log(`lat: ${e.coords.latitude}, long: ${e.coords.longitude}`);
    position.lat = parseFloat(e.coords.latitude);
    position.lng = parseFloat(e.coords.longitude);
  }, function (e) {
    position.lat = 6.9271;
    position.lng = 79.8612;
  }); 
}
else {
  position.lat = 6.9271;
  position.lng = 79.8612;
}
initMap();


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}
