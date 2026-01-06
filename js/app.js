import { WeatherService } from "./weatherService.js";
import { WeatherUI } from "./ui.js";
import { CONFIG } from "./config.js";
import { Storage } from './storage.js';

const service = new WeatherService(CONFIG.API_KEY);
const ui = new WeatherUI();

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const locationBtn = document.getElementById('locationBtn');
const unitToggleBtn = document.getElementById('unitToggle');

let lastWeatherData = null;
let lastForecastData = null;
let autocompleteTimeout;


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    ui.showLoading();

    try {
        const weather = await service.getCurrentWeather(city);
        const forecast = await service.getForecast(city);

        lastWeatherData = weather;
        lastForecastData = forecast;

        ui.displayCurrentWeather(weather);
        ui.displayForecast(forecast);
    } catch (error) {
        console.error(error);
        ui.showError('City not found or API error');
    }
});


locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        ui.showError('Geolocation is not supported');
        return;
    }

    ui.showLoading();

    navigator.geolocation.getCurrentPosition(
        async position => {
            const { latitude, longitude } = position.coords;

            try {
                const weather = await service.getWeatherByCoords(latitude, longitude);

                // Forecast API does NOT support coords in your service
                const forecast = await service.getForecast(weather.name);

                lastWeatherData = weather;
                lastForecastData = forecast;

                ui.displayCurrentWeather(weather);
                ui.displayForecast(forecast);
            } catch (error) {
                console.error(error);
                ui.showError('Unable to fetch location weather');
            }
        },
        () => ui.showError('Location access denied')
    );
});


unitToggleBtn.addEventListener('click', () => {
    ui.currentUnit = ui.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';

    unitToggleBtn.textContent =
        ui.currentUnit === 'celsius' ? 'Switch to °F' : 'Switch to °C';

    if (lastWeatherData) {
        ui.displayCurrentWeather(lastWeatherData);
    }

    if (lastForecastData) {
        ui.displayForecast(lastForecastData);
    }
});


document.addEventListener('click', async (e) => {
    // Autocomplete selection
    if (e.target.closest('#autocomplete-list li')) {
        const city = e.target.dataset.city;

        input.value = city;
        ui.clearAutocomplete();
        ui.showLoading();

        try {
            const weather = await service.getCurrentWeather(city);
            const forecast = await service.getForecast(city);

            lastWeatherData = weather;
            lastForecastData = forecast;

            ui.displayCurrentWeather(weather);
            ui.displayForecast(forecast);
        } catch {
            ui.showError('Unable to fetch weather');
        }

        return;
    }

    // Add to favourites
    if (e.target.classList.contains('fav-btn')) {
        const city = e.target.dataset.city;
        Storage.saveFavourite(city);
        ui.renderFavourites(Storage.getFavourites());
    }

    // Remove favourite city
    if (e.target.classList.contains('remove-fav-btn')) {
        const city = e.target.dataset.city;
        Storage.removeFavourite(city);
        ui.renderFavourites(Storage.getFavourites());
    }

    // Click favourite city
    if (e.target.classList.contains('fav-city-btn')) {
        const city = e.target.dataset.city;

        ui.showLoading();
        try {
            const weather = await service.getCurrentWeather(city);
            const forecast = await service.getForecast(city);

            lastWeatherData = weather;
            lastForecastData = forecast;

            ui.displayCurrentWeather(weather);
            ui.displayForecast(forecast);
        } catch {
            ui.showError('Unable to load favourite city');
        }
    }

    // Share
    if (e.target.classList.contains('share-btn')) {
        if (!lastWeatherData) return;

        const city = lastWeatherData.name;
        const temp =
            ui.currentUnit === 'celsius'
                ? `${Math.round(lastWeatherData.main.temp)}°C`
                : `${Math.round((lastWeatherData.main.temp * 9/5) + 32)}°F`;

        const condition = lastWeatherData.weather[0].description;

        const shareText =
            `Weather in ${city}:\n` +
            `🌡 Temperature: ${temp}\n` +
            `☁ Condition: ${condition}`;

        if (navigator.share) {
            navigator.share({
                title: `Weather in ${city}`,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Weather details copied to clipboard!');
        }
    }

});

// Autocomplete
input.addEventListener('input', () => {
    clearTimeout(autocompleteTimeout);

    const query = input.value.trim();

    autocompleteTimeout = setTimeout(async () => {
        if (query.length < 2) {
            ui.clearAutocomplete();
            return;
        }

        const results = await service.getCitySuggestions(query);
        ui.showAutocomplete(results);
    }, 300); 
});



function applyThemeByTime() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 19;

    document.body.classList.toggle('light-theme', isDayTime);
}

applyThemeByTime();

ui.renderFavourites(Storage.getFavourites());
