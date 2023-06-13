const statusBox = document.getElementById("insertStatus");
const deleteModalEl = document.getElementById("deleteConfirmModal");
const insertItemModalEl = document.getElementById("addProductModal");
const deleteConfirmed = deleteModalEl.querySelector("#deleteConfirmed");
const deleteStatus = document.getElementById("delete-status");
const newItemForm = document.getElementById("newItem");
const deleteButtons = document.querySelectorAll("#productList .deleteProduct");
const categoriesRadio = document.querySelectorAll("#categoryInput input[type='radio']");

categoriesRadio.forEach(radio => {
    radio.addEventListener("change", (e) => {
        updateFormProperties(e.target.value);
    });
});

deleteButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const productId = button.dataset.productId;

        console.log(button.id);

        deleteModalEl.dataset.productId = productId;
        deleteModalEl.dataset.userId = userId;

        bootstrap.Modal.getOrCreateInstance(deleteModalEl).show();
    })
});

deleteConfirmed.addEventListener("click", (e) => {
    const productId = deleteModalEl.dataset.productId;
    const userId = deleteModalEl.dataset.userId;
    resetStatusBox(deleteStatus);
    axios.delete(`/api/marketplace/delete-product/${productId}/${userId}`)
        .then((res) => {
            if (res.status === 200) {
                document.getElementById("productList").removeChild(
                    document.getElementById(`product-${productId}`)
                );
                updateStatusDiv(deleteStatus, true, -1);
                setTimeout(() => {
                    bootstrap.Modal.getInstance(deleteModalEl).hide();
                    resetStatusBox(deleteStatus);
                }, 1000);
            } else {
                updateStatusDiv(deleteStatus, false, -1);
            }
        })
        .catch((err) => {
            updateStatusDiv(deleteStatus, false, -1);
        });
    deleteModalEl.dataset.productId = "";
});

newItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    resetStatusBox(statusBox);

    const formData = new FormData(newItemForm);
    axios.post("/api/marketplace/add-product", formData)
        .then((res) => {
            if (res.status === 201) {
                newItemForm.reset();
                updateStatusDiv(statusBox, true, 1);
                document.getElementById("productList").appendChild(
                    generateProductElement(res.data.product)
                );
                setTimeout(() => {
                    bootstrap.Modal.getInstance(insertItemModalEl).hide();
                    resetStatusBox(statusBox);
                }, 1000);
                document.getElementById("productList").lastChild.scrollIntoView();
            } else {
                updateStatusDiv(statusBox, false, 1);
            }
        })
        .catch((err) => {
            updateStatusDiv(statusBox, false, 1);
            console.log(err);
        });
});

function resetStatusBox(div) {
    div.classList.remove("d-none");
    div.classList.remove("alert-success");
    div.classList.remove("alert-danger");
    div.innerHTML = "";
}

function updateStatusDiv(div, status, type = -1) {
    if (status) {
        div.classList.remove("alert-danger");
        div.classList.add("alert-success");
        div.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <span>Product ${type === -1 ? "deleted" : "added"} successfully</span>
            `;
    } else {
        div.classList.remove("alert-success");
        div.classList.add("alert-danger");
        div.innerHTML = `
            <i class="fas fa-times-circle me-2"></i>
            <span>Error ${type === -1 ? "deleting the" : "adding the"} product</span>
            `;
    }
}

function generateProductElement(product) {
    const element = document.createElement("li");
    element.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "product-with-image", "p-3", "mb-3", "rounded", "border");
    element.id = `product-${product._id}`;
    element.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${product.image}" alt="${product.name}" class="img-fluid me-3 rounded-circle shadow product-image">
            <div>
                <h5 class="mb-0 font-weight-bold">${product.name}</h5>
                <small class="text-muted font-weight-bold">${product.description}</small>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <span class="badge bg-primary rounded-pill me-3">$${product.price}</span>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-danger me-2 deleteProduct"  data-product-id="${product._id}"><i
                        class="fas fa-trash"></i></button>
                <button type="button" class="btn btn-secondary"><i
                        class="fas fa-edit"></i></button>
            </div>
        </div>
    `;
    return element;
}

function generateFormElement(label, name, type, placeholder, required = false) {
    return `
        <div class="mb-3">
            <label for="${name}" class="form-label">${label}</label>
            <input type="${type}" id="${name}" name="${name}" class="${type == "checkbox" ? "form-check-input form-check-inline" : "form-control"}" placeholder="${placeholder}" ${required ? 'required' : ''}>
        </div>
    `;
}

function generateSelectElement(label, name, options) {
    let optionsHTML = '';
    for (let i = 0; i < options.length; i++) {
        optionsHTML += `<option value="${options[i].value}">${options[i].label}</option>`;
    }
    return `
        <div class="mb-3">
            <label for="${name}" class="form-label">${label}</label>
            <select id="${name}" name="${name}" class="form-select">
            ${optionsHTML}
            </select>
        </div>
    `;
}

function generateTextareaElement(label, name, placeholder, required = false) {
    return `
        <div class="mb-3">
            <label for="${name}" class="form-label">${label}</label>
            <textarea id="${name}" name="${name}" class="form-control" placeholder="${placeholder}" ${required ? 'required' : ''}></textarea>
        </div>
        `;
}

function generateCheckBoxes(label, name, required = false, checkboxes) {
    let checkboxesHTML = '';
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxesHTML += `
            <div class="form-check">
            <input type="checkbox" id="label-${checkboxes[i].value}" name="${checkboxes[i].name}" class="form-check-input form-check-inline">
            <label class="form-check-label" for="label-${checkboxes[i].value}">${checkboxes[i].label}</label>
            </div>
            `;
    }
    return `
        <div class="mb-3">
        <label class="form-label">${label}</label>
            ${checkboxesHTML}
            </div>
        `;
}


function updateFormProperties(category) {
    var additionalPropertiesDiv = document.getElementById("additional-properties");

    // Clear existing form properties
    additionalPropertiesDiv.innerHTML = "";

    console.log(category);
    // Generate and insert form properties based on selected category
    if (category === "accommodation") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Amenities (comma-separated)", "hotel_amenities", "text", "Enter hotel amenities", true)}
        `;
    } else if (category === "tours") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Duration", "tour_duration", "text", "Enter duration", true)}
            ${generateFormElement("Includes", "tour_includes", "text", "Enter includes (comma-separated)", true)}
        `;
    } else if (category === "transportation") {
        additionalPropertiesDiv.innerHTML += `
            ${generateSelectElement("Vehicle Type", "vehicle_type", [
                { label: "Car", value: "car" },
                { label: "Bus", value: "bus" },
                { label: "Van", value: "van" },
                { label: "Motorcycle", value: "motorcycle" }
            ])}
            ${generateFormElement("Model", "vehicle_model", "text", "Enter model", true)}
            ${generateFormElement("Year", "vehicle_year", "number", "Enter year", true)}
            ${generateFormElement("Color", "vehicle_color", "text", "Enter color", true)}
            ${generateFormElement("Luggage Capacity", "luggage_capacity", "number", "Enter luggage capacity", true)}
            ${generateFormElement("Seats", "number", "seats", "Enter number of seats", true)}
            ${generateFormElement("Transmission", "transmission", "text", "Enter transmission type", true)}
            ${generateFormElement("Fuel Type", "fuel_type", "text", "Enter fuel type", true)}
        `;  
    } else if (category === "experiences") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Duration", "duration", "text", "Enter duration", true)}
            ${generateFormElement("Includes", "includes", "text", "Enter includes (comma-separated)", true)}
            ${generateTextareaElement("Highlights (comma-separated)", "highlights", "Enter highlights", true)}
            ${generateTextareaElement("Itinerary (comma-separated)", "itinerary", "Enter itinerary", true)}
            ${generateTextareaElement("What to bring (comma-separated)", "bring", "Enter what to bring", false)}
            ${generateTextareaElement("What to wear (comma-separated)", "wear", "Enter what to wear", false)}
            ${generateTextareaElement("Additional Info (comma-separated)", "info", "Enter additional info", false)}
        `;
    } else if (category === "wildlife") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Duration", "duration", "text", "Enter duration", true)}
            ${generateFormElement("Includes", "includes", "text", "Enter includes (comma-separated)", true)}
            ${generateTextareaElement("Transportation", "transporatation", "Enter transportation details", false)}
            ${generateTextareaElement("Additional Info (comma-separated)", "info", "Enter additional info", false)}
        `;
    } else if (category === "beaches") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Duration", "duration", "text", "Enter duration", true)}
            ${generateFormElement("Includes", "includes", "text", "Enter includes (comma-separated)", true)}
            `;
    } else if (category === "historical") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Duration", "duration", "text", "Enter duration", true)}
            ${generateFormElement("Includes", "includes", "text", "Enter includes (comma-separated)", true)}
            ${generateFormElement("Heritage Sites", "heritage_sites", "text", "Enter sites (comma-separated)", true)}
            ${generateFormElement("Archaeological Sites", "archaeo_sites", "text", "Enter sites (comma-separated)", true)}
            ${generateFormElement("Religious Sites", "religious_sites", "text", "Enter sites (comma-separated)", true)}
            ${generateFormElement("Museums", "museums", "text", "Enter museums (comma-separated)", true)}

            `;
    } else if (category === "food") {
        additionalPropertiesDiv.innerHTML += `
            ${generateFormElement("Includes", "includes", "text", "Enter includes (comma-separated)", true)}
            ${generateFormElement("Cuisine Type", "cousine", "text", "Enter cuisine type", true)}
            ${generateCheckBoxes('Dietery Restrictions', "restrictions", false, [
                { label: "Vegetarian", name: "vegetarian", value: "vegetarian" },
                { label: "Vegan", name: "vegan", value: "vegan" },
                { label: "Gluten-free", name: "gluten-free", value: "gluten-free" },
                { label: "Halal", name: "halal", value: "halal" },
                { label: "Kosher", name: "kosher", value: "kosher" },
                { label: "Other", name: "other", value: "other" }
            ])}
            ${generateFormElement("Meal Type", "meal_type", "text", "Enter meal type (ex: breakfast)", false)}
            ${generateFormElement("Meal Time", "meal_time", "text", "Enter meal time (ex: 7:00 AM)", false)}
            ${generateFormElement("Meal Style", "meal_style", "text", "Enter meal style (ex: buffet)"), false}
        `;
    } else if (category === "shopping") {
        additionalPropertiesDiv.innerHTML += `
            <div class="row">
            <div class="col-md-6">
                ${generateFormElement("Material", "material", "text", "Enter product material")}
            </div>
            <div class="col-md-6">
                ${generateFormElement("Size", "size", "text", "Enter product size (optional)", false)}
            </div>
            </div>
            <div class="row">
            <div class="col-md-6">
                ${generateFormElement("Color", "color", "text", "Enter product color (optional)", false)}
            </div>
            </div>
            ${generateFormElement("Weight (grams)", "weight", "number", "Enter product weight (optional)", false)}
            ${generateFormElement("Manufacturer", "manufacturer", "text", "Enter product manufacturer (optional)", false)}
            ${generateFormElement("Manufacturer Country", "country", "text", "Enter product manufacturer country (optional)", false)}
        `;
    } else if (category === "wellness") {
        additionalPropertiesDiv.innerHTML += `
            <div class="row">
                <div class="col-md-6">
                ${generateFormElement("Therapist", "therapist", "text", "Enter product therapist")}
                </div>
                <div class="col-md-6">
                ${generateFormElement("Duration", "duration", "text", "Enter product duration")}
                </div>
            </div>
            ${generateFormElement("Amenities", "amenities", "textarea", "Enter product amenities")}
        `;
    }
}
