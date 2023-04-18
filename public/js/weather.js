const cityInput = document.getElementById('city-input');
const form = document.getElementById('search-form');

const widget = {
    city: document.getElementById('widget-city'),
    temperature: document.getElementById('widget-temperature'),
    description: document.getElementById('widget-description'),
    icon: document.getElementById('widget-icon'),
    feelsLike: document.getElementById('widget-feels'),
    humidity: document.getElementById('widget-humidity'),
    wind: document.getElementById('widget-wind-speed'),
    windDeg: document.getElementById('widget-wind-deg'),
    pressure: document.getElementById('widget-pressure'),
    sunrise: document.getElementById('widget-sunrise'),
    sunset: document.getElementById('widget-sunset'),
    visibility: document.getElementById('widget-visibility'),
    title: document.getElementById('widget-title'),

    hourlyDiv: document.getElementById('hourly-forecast'),
    errorMsg: document.getElementById('error-msg')

};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchByCity();
});

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `/api/weather/${lat}/${lon}`;

            axios.get(url).then((res) => {
                weatherReport(res.data);
            })
                .catch((err) => {
                    widget.errorMsg.innerText = err.response.data.message;
                    widget.errorMsg.classList.remove('d-none');
                })
        })
    }
})

function searchByCity() {
    const place = cityInput.value;
    const url = `/api/weather/${place}`;
    widget.errorMsg.classList.add('d-none');


    axios.get(url).then((res) => {
        weatherReport(res.data);
    })
        .catch((err) => {
            widget.errorMsg.innerText = err.response.data.message;
            widget.errorMsg.classList.remove('d-none');
        })
    cityInput.value = '';
}

function weatherReport(data) {
    if (!data.current) { return };
    const { current } = data;

    widget.city.innerText = current.name;
    widget.title.innerText = current.name;
    widget.temperature.innerText = Math.floor(current.main.temp - 273) + '°C';
    widget.description.innerText = current.weather[0].description;
    widget.icon.src = `http://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
    widget.feelsLike.innerText = Math.floor(current.main.feels_like - 273) + '°C';
    widget.humidity.innerText = current.main.humidity + '%';
    widget.wind.innerText = current.wind.speed + 'm/s';
    widget.windDeg.style.transform = `rotate(${current.wind.deg}deg)`;
    widget.pressure.innerText = current.main.pressure + 'hPa';
    widget.sunrise.innerText = new Date(current.sys.sunrise * 1000).toLocaleTimeString().replace(":00", "");
    widget.sunset.innerText = new Date(current.sys.sunset * 1000).toLocaleTimeString().replace(":00", "");
    widget.visibility.innerText = current.visibility / 1000 + 'km';

    hourForecast(data);
}

function hourForecast(data) {
    widget.hourlyDiv.innerHTML = '';
    data.forecast.list && data.forecast.list.forEach((hour) => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString().replace(":00 ", "");
        const temp = Math.floor(hour.main.temp - 273) + '°C';
        const icon = `http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
        const description = hour.weather[0].description;

        const hourlyCard = createhourlyCard(time, temp, icon, description);
        widget.hourlyDiv.appendChild(hourlyCard);
    })
}

function createhourlyCard(time, temp, icon, description) {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <div class="card">
        <img src="${icon}" class="card-img-top weather-icon" alt="${time}">
        <div class="card-body">
            <h5 class="card-title">${time}</h5>
            <h5 class="card-title">${temp}</h5>
            <p class="card-text">${description}</p>
        </div>
    </div>`;

    return div;
}