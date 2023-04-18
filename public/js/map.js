let map;

function initMap(_lat, _long, _zoom = 10) {
  const mapOptions = {
    center: { lat: _lat, lng: _long },
    zoom: _zoom,
  };

  // create the map
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // create the search box and link it to the UI element
  const searchBox = new google.maps.places.SearchBox(
    document.getElementById("search-box")
  );

  // set the bounds of the search box to the map's viewport
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // create the markers array to store the markers
  const markers = [];

  // listen for the event fired when the user selects a prediction from the search box
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    // if there are no places, do nothing
    if (places.length == 0) {
      return;
    }

    // clear out the old markers
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers.length = 0;

    // for each place, create a marker and center the map on it
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      // create a marker for each place
      const marker = new google.maps.Marker({
        map,
        title: place.name,
        position: place.geometry.location,
      });

      markers.push(marker);

      if (place.geometry.viewport) {
        // only geocodes have viewport
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  });

  // add event listener for "Get Directions" button
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  document.getElementById("get-directions").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

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
