const departDateInput = document.getElementById('departureDate');
const returnDateInput = document.getElementById('returnDate');
const way = document.getElementById('way');
const bookForm = document.getElementById('book-flight');
const originCountry = document.getElementById('originCountry');
const originAirport = document.getElementById('originAirport');
const destinationCountry = document.getElementById('destinationCountry');
const destinationAirport = document.getElementById('destinationAirport');
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress-bar');
const prevBtns = document.querySelectorAll('.card-footer button[data-step="previous"]');
const nextBtns = document.querySelectorAll('.card-footer button[data-step="next"]');
const scheduleSearchBtn = document.getElementById('searchSchedule');
let currentStep = 0;

let temp;
let reservation = {
  originCountry: '',
  originAirport: '',
  destinationCountry: '',
  destinationAirport: '',
  flight: '',
  departureDate: '',
  way: '',
  returnDate: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  seats: '',
}

function updateProgress() {
  const progress = (currentStep / (steps.length - 1)) * 100;
  progressBar.style.width = `${progress}%`;
}

function showStep(index = 0) {
  steps[currentStep]?.classList.remove('show');
  steps[currentStep]?.classList.add('d-none');
  steps[index]?.classList.remove('d-none');
  steps[index]?.classList.add('show');
  currentStep = index;
  updateProgress();
}

prevBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    showStep(index);
  });
});

nextBtns.forEach((btn, index) => {
  btn.addEventListener('click', function () {
    const form = this.form;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    saveForm(form);
    showStep(index + 1);
  });
});

updateProgress();

if (departDateInput && returnDateInput) {
  departDateInput.min = new Date().toISOString().split('T')[0];
  departDateInput.max = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

departDateInput?.addEventListener('change', function () {
  returnDateInput.min = departDateInput.value;
  returnDateInput.value = departDateInput.value;
  returnDateInput.max = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
});

saveForm = async (form) => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (form.id === 'form-step-1') {
    reservation.originCountry = data.originCountry;
    reservation.originAirport = data.originAirport;
    reservation.destinationCountry = data.destinationCountry;
    reservation.destinationAirport = data.destinationAirport;
  }
  if (form.id === 'form-step-2') {
    
    reservation.flight = data.flight;
    reservation.departureDate = data.departureDate;
    reservation.way = data.way;
    reservation.returnDate = (reservation.way === 'one-way') ? 'n/a' : data.returnDate;
  }
  if (form.id === 'form-step-3') {
    reservation.firstName = data.firstName;
    reservation.lastName = data.lastName;
    reservation.email = data.email;
    reservation.phone = data.phone;
  }
  if (form.id === 'form-step-4') {
    reservation.seats = data.seats;

    const nextForm = document.getElementById('form-step-5');
    nextForm.querySelectorAll('span[data-form="confirm"]').forEach((e) => {
      e.innerText = reservation[e.dataset.fieldName];
    });
    await getRouteMapImage(nextForm.querySelector('#route-map-image'), reservation.flight);
  }
  if (form.id === 'form-step-5') {
    bookFlight();
  }
}

async function getRouteMapImage(imgElement, flight_id) {
  axios.get(`/api/flight/route/image?flight_id=${reservation.flight}`)
    .then((res) => {
      imgElement.src = `data:image/png;base64,${res.data.map}`;
    })
    .catch((err) => {
      imgElement.src = '/images/no_image.jpg';
    });
}

way && way.addEventListener('change', function () {
  if (way.value === 'one-way') {
    returnDateInput.disabled = true;
  } else {
    returnDateInput.disabled = false;
  }
});

destinationAirport && originAirport && addAiroportChangeListener(destinationAirport, originAirport);

function addAiroportChangeListener(originAirport, destinationAirport) {
  originAirport.addEventListener('change', function () {
    reportAirportEuality()
  });
  destinationAirport.addEventListener('change', function () {
    reportAirportEuality()
  });
}

function reportAirportEuality() {
  if (destinationAirport.value === originAirport.value) {
    alert('Origin and destination cannot be the same');
    destinationAirport.value = '';
  }
}

scheduleSearchBtn && scheduleSearchBtn.addEventListener('click', function () {
  if (scheduleSearchBtn.form.checkValidity()) {
    getSchedules(reservation.originAirport,reservation.destinationAirport, document.getElementById('scheduleTableDiv'));
    return;
  }
  scheduleSearchBtn.form.reportValidity();
});

originCountry && originCountry.addEventListener('change', async function (e) {
  const origin = originCountry.value;
  getLocation(originCountry.value, originAirport);
});

destinationCountry && destinationCountry?.addEventListener('change', async function (e) {
  const dest = destinationCountry.value;
  await getLocation(destinationCountry.value, destinationAirport);
});

async function getLocation(country, param_airport) {
  let { data } = await axios.get('/api/flight/airports/' + country);
  param_airport.innerHTML = "";
  data.forEach((airport) => {
    let x = document.createElement('option');
    x.value = airport.icao;
    x.innerText = airport.name;
    param_airport.appendChild(x);
  })
}

async function getSchedules(origin, destination, fillTableDiv) {
  const form_reservation = {
    origin: origin,
    destination: destination,
    departureDate: departDateInput.value,
  }
  let { data } = await axios.post(`/api/flight/schedules`, form_reservation);
  const tbl = document.createElement('table');
  tbl.classList.add('table');
  tbl.classList.add('table-striped');
  tbl.classList.add('table-bordered');
  tbl.classList.add('table-hover');
  tbl.classList.add('table-responsive');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  ['Select', 'Flight', 'Origin', 'Destination', 'Departure', 'Meal', 'Business Seats', 'Couch Seats', 'First class Seats'].forEach((e) => {
    const th = document.createElement('th');
    th.innerText = e;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  tbl.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach((e) => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';

    const tdSelect = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'flight';
    input.value = e.flightId;
    input.required = true;
    input.classList.add('form-check-input');
    tdSelect.appendChild(input);
    tr.appendChild(tdSelect);

    const tdFlight = document.createElement('td');
    tdFlight.innerText = e.flightNumber;
    tr.appendChild(tdFlight);

    const tdOrigin = document.createElement('td');
    tdOrigin.innerText = e.origin;
    tr.appendChild(tdOrigin);

    const tdDestination = document.createElement('td');
    tdDestination.innerText = e.destination;
    tr.appendChild(tdDestination);

    const tdDeparture = document.createElement('td');
    tdDeparture.innerText = e.scheduledIn.split('T')[1].split('Z')[0];
    tr.appendChild(tdDeparture);

    const tdMeal = document.createElement('td');
    tdMeal.innerText = e.mealService;
    tr.appendChild(tdMeal);

    const tdBusiness = document.createElement('td');
    tdBusiness.innerText = e.seatsCabinBusiness;
    tr.appendChild(tdBusiness);

    const tdCouch = document.createElement('td');
    tdCouch.innerText = e.seatsCabinCoach;
    tr.appendChild(tdCouch);

    const tdFirst = document.createElement('td');
    tdFirst.innerText = e.seatsCabinFirst;
    tr.appendChild(tdFirst);

    tbody.appendChild(tr);
  })

  tbl.appendChild(tbody);
  fillTableDiv.innerHTML = tbl.outerHTML;
  fillTableDiv.querySelectorAll('input').forEach((e) => {
    e.addEventListener('click', function () {
      nextBtns[1].disabled = false;
    });
  });
  fillTableDiv.querySelectorAll('tr').forEach((e) => {
    e.addEventListener('click', function () {
      e.querySelector('input').click();
    });
  });
}

function bookFlight() {
  axios.post('/api/flight/reservations', reservation)
    .then((res) => {
      alert(res.data.messege);
      //window.location.href = '/reservations';
    })
    .catch((err) => {
      alert(err);
    });
}