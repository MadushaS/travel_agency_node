// Define API endpoint
const apiEndpoint = "/api/hotels/";
let temp;

// Define search form and result container elements
const searchForm = document.querySelector("#search-form");
const resultContainer = document.querySelector("#hotels-container");
const seeMoreBtn = document.querySelector("#see-more-btn");

// Define default search parameters
let searchParams = {
    area: "sri lanka",
};

// Function to get hotels data from API
async function getHotelsData() {
    // Show loader
    resultContainer.innerHTML =
        '<div class="text-center my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    try {
        // Make API request with search parameters
        const { data } = await axios.get(`${apiEndpoint}${searchParams.area}`);
        temp = data;
        // Check if data is returned
        if (data.length > 0) {
            // Create hotels HTML cards
            let hotelsHtml = "";
            data.forEach((e) => {
                const hotel = e.result_object;
                hotelsHtml += `
        <div class="col-md-4 mb-4">
            <div class="card">
            <img src="${hotel.photo.images.medium.url}" width="${hotel.photo.images.medium.width
                    }" class="card-img-top" alt="${hotel.name}">
                <div class="card-body">
                    <h5 class="card-title">${hotel.name}</h5>
                    <p class="card-text">${hotel.location_string}</p>
                    <div class="row">
                    <div class="col">
                        <p class="card-text"><small class="text-muted">Rating: ${hotel.rating
                    }</small></p>
                    </div>
                    <div class="col">
                        <p class="card-text"><small class="text-muted">Number of reviews: ${hotel.num_reviews
                    }</small></p>
                    </div>
                    </div>
                    <div class="btn-group">
                    <a href="/hotels/book?name=${hotel.name}" class="btn btn-primary">Book now</a>
                    <a href="/map?lat=${hotel.latitude}&long=${hotel.longitude}" class="btn btn-secondary">View on map</a>
                    </div>
                </div>
            </div>
        </div>
        `;
            });

            // Display hotels HTML cards
            resultContainer.innerHTML = hotelsHtml;

            // Show see more button if there are more results
            if (data.length === searchParams.limit) {
                seeMoreBtn.style.display = "block";
            } else {
                seeMoreBtn.style.display = "none";
            }
        } else {
            // Display message if no data is returned
            resultContainer.innerHTML =
                '<div class="alert alert-warning my-5" role="alert">No hotels found.</div>';
            seeMoreBtn.style.display = "none";
        }
    } catch (error) {
        // Display error message if API request fails
        resultContainer.innerHTML = '<div class="alert alert-danger my-5" role="alert">Error fetching data from API.</div>';
        seeMoreBtn.style.display = "none";
        console.error(error);
    }
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Get search input value
    const searchInput = document.querySelector("#search-input");
    const searchValue = searchInput.value;

    // Update search parameters with new area value
    searchParams.area = searchValue;
    searchParams.page = 1;

    // Get hotels data with updated search parameters
    getHotelsData();
}

// Function to handle see more button click
function handleSeeMoreClick() {
    // Increment page parameter
    searchParams.page++;

    // Get hotels data with updated page parameter
    getHotelsData();
}

// Add event listeners to search form and see more button
searchForm.addEventListener("submit", handleFormSubmit);
//seeMoreBtn.addEventListener("click", handleSeeMoreClick);

// Get hotels data with default search parameters when page loads
getHotelsData();
