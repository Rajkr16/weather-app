const searchBtn = document.querySelector('.searchBtn');
const cityNameInput = document.querySelector('.citySearch');
const apiKey = 'b8e6343adb114d2c88af0939f6b1a6c4';
const WeatherDegree = document.querySelector('.weatherInput');
const weatherUL = document.querySelector('.weather-ul');
const gettingStartedBtn = document.querySelector('.getting-started-btn');

// Init Swiper
const swiper = new Swiper('.mySwiper', {
  slidesPerView: 2.3,
  spaceBetween: 12,
  freeMode: true,
  breakpoints: {
    480: { slidesPerView: 3.2, spaceBetween: 14 },
    640: { slidesPerView: 4.2, spaceBetween: 16 },
    768: { slidesPerView: 5, spaceBetween: 16 }
  }
});

// Front page transition
gettingStartedBtn.addEventListener('click', function () {
  document.querySelector('.frontpage').classList.add('active');
  document.querySelector('.weather-container').classList.add('active');
});

// Allow Enter key search
cityNameInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') searchBtn.click();
});

// Build main weather card (index 0)
function buildMainCard(cityName, item) {
  const temp = (item.main.temp - 273.15).toFixed(1);
  const date = item.dt_txt.split(' ')[0];
  return `
    <div class="location-data">
      <div class="location-content">
        <i class='bx bxs-map'></i>
        <h3>${cityName}</h3>
      </div>
      <p class="date-text">${date}</p>
    </div>
    <div class="weather-Degree">
      <div class="degree-main">
        <h1>${temp}°</h1>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
             alt="${item.weather[0].description}" class="weather-Degree-img">
      </div>
      <h2 class="weather-desc">${item.weather[0].description}</h2>
    </div>
    <div class="weather-pallete">
      <div class="pallete-data">
        <div class="pallete-icon"><i class='bx bx-water'></i></div>
        <small>${item.main.pressure} hPa</small>
        <span>Pressure</span>
      </div>
      <div class="pallete-divider"></div>
      <div class="pallete-data">
        <div class="pallete-icon"><i class='bx bxs-droplet-half'></i></div>
        <small>${item.main.humidity}%</small>
        <span>Humidity</span>
      </div>
      <div class="pallete-divider"></div>
      <div class="pallete-data">
        <div class="pallete-icon"><i class='bx bx-wind'></i></div>
        <small>${item.wind.speed} m/s</small>
        <span>Wind</span>
      </div>
    </div>
  `;
}

// Build forecast slide (index 1+)
function buildForecastCard(item) {
  const temp = (item.main.temp - 273.15).toFixed(1);
  const date = item.dt_txt.split(' ')[0];
  return `
    <li class="swiper-slide weather-data">
      <span>${date}</span>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
           alt="${item.weather[0].description}" class="forecast-img">
      <small>${temp}°</small>
    </li>
  `;
}

// Fetch weather details
function gettingWeatherDetails(cityName, lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const seenDays = [];
      const fiveDays = data.list.filter(item => {
        const day = new Date(item.dt_txt).getDate();
        if (!seenDays.includes(day)) { seenDays.push(day); return true; }
        return false;
      });

      cityNameInput.value = '';
      WeatherDegree.innerHTML = '';
      weatherUL.innerHTML = '';

      fiveDays.forEach((item, i) => {
        if (i === 0) {
          WeatherDegree.insertAdjacentHTML('beforeend', buildMainCard(cityName, item));
        } else {
          weatherUL.insertAdjacentHTML('beforeend', buildForecastCard(item));
        }
      });

      // Update swiper after new slides
      swiper.update();
    })
    .catch(() => alert('Error fetching weather data. Please try again.'));
}

// Search button
searchBtn.addEventListener('click', function () {
  const cityName = cityNameInput.value.trim();
  if (!cityName) {
    alert('Please enter a city name.');
    return;
  }
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(geoUrl)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        alert(`"${cityName}" is not a valid city name.`);
        return;
      }
      const { name, lat, lon } = data[0];
      gettingWeatherDetails(name, lat, lon);
    })
    .catch(() => alert('Error fetching city coordinates. Please try again.'));
});
