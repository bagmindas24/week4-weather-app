export class WeatherUI {
    constructor() {
        this.currentWeatherEl = document.getElementById('currentWeather');
        this.forecastEl = document.getElementById('forecast');
        this.autocompleteList = document.getElementById('autocomplete-list');
        this.searchInput = document.getElementById('searchInput');
        this.currentUnit = 'celsius';
    }

    displayCurrentWeather(data) {
        if (!data || !data.main || !data.weather) {
            this.showError('Invalid weather data');
            return;
        }

        const temp = this.convertTemp(data.main.temp);
        const iconId = data.weather[0]?.id ?? 800;
        const description =
            data.weather[0]?.description
                ? data.weather[0].description.replace(/^\w/, c => c.toUpperCase())
                : 'Clear sky';

        this.currentWeatherEl.innerHTML = `
            <article class="weather-card">
                <header>
                    <h2>${data.name}, ${data.sys.country}</h2>

                    <div class="card-actions">
                        <button class="fav-btn" data-city="${data.name}">
                            ⭐ Add to Favourites
                        </button>

                        <button class="share-btn" aria-label="Share weather">
                            🔗 Share
                        </button>
                    </div>
                </header>

                <section class="weather-main">
                    <p class="temperature">
                        ${temp}°${this.currentUnit === 'celsius' ? 'C' : 'F'}
                    </p>

                    <figure>
                        <i class="wi wi-owm-${iconId}" aria-hidden="true"></i>
                        <figcaption>${description}</figcaption>
                    </figure>
                </section>

                <section class="weather-details">
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind: ${data.wind.speed} m/s</p>
                    <p>Pressure: ${data.main.pressure} hPa</p>
                </section>
            </article>
        `;

        const tempEl = this.currentWeatherEl.querySelector('.temperature');
        tempEl?.classList.add('updated');
        setTimeout(() => tempEl?.classList.remove('updated'), 300);
    }

    displayForecast(data) {
        if (!data || !Array.isArray(data.list)) {
            this.forecastEl.innerHTML =
                `<p role="alert">Forecast not available</p>`;
            return;
        }

        const days = this.groupByDay(data.list);

        this.forecastEl.innerHTML = `
            <section class="forecast-container">
                ${days.slice(0, 5).map(day => `
                    <article class="forecast-day">
                        <h3>${new Date(day.dt * 1000).toDateString()}</h3>
                        <i class="wi wi-owm-${day.weather[0]?.id ?? 800}" aria-hidden="true"></i>
                        <p>
                            ${this.convertTemp(day.main.temp)}°
                            ${this.currentUnit === 'celsius' ? 'C' : 'F'}
                        </p>
                    </article>
                `).join('')}
            </section>
        `;
    }


    showAutocomplete(results) {
        if (!results || results.length === 0) {
            this.clearAutocomplete();
            return;
        }

        this.autocompleteList.innerHTML = results.map(item => `
            <li data-city="${item.name}">
                ${item.name}, ${item.country}
            </li>
        `).join('');

        this.autocompleteList.classList.add('show');

        
        this.autocompleteList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                this.searchInput.value = li.dataset.city;
                this.clearAutocomplete();
                this.searchInput.focus();
            });
        });
    }

    clearAutocomplete() {
        this.autocompleteList.innerHTML = '';
        this.autocompleteList.classList.remove('show');
    }

    renderFavourites(cities) {
        const list = document.getElementById('favouriteList');
        if (!list || !Array.isArray(cities)) return;

        list.innerHTML = cities.map(city => `
            <li class="fav-item">
                <button class="fav-city-btn" data-city="${city}">
                    ${city}
                </button>

                <button 
                    class="remove-fav-btn" 
                    data-city="${city}" 
                    aria-label="Remove ${city} from favourites">
                    ✖
                </button>
            </li>
        `).join('');
    }
    convertTemp(temp) {
        return this.currentUnit === 'celsius'
            ? Math.round(temp)
            : Math.round((temp * 9 / 5) + 32);
    }

    groupByDay(list) {
        const map = {};
        list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!map[date]) map[date] = item;
        });
        return Object.values(map);
    }

    showLoading() {
        this.currentWeatherEl.innerHTML =
            `<p role="status">Loading weather data...</p>`;
        this.forecastEl.innerHTML = '';
    }

    showError(message) {
        this.currentWeatherEl.innerHTML =
            `<p role="alert">${message}</p>`;
        this.forecastEl.innerHTML = '';
    }
}
