import { CONFIG } from './config.js';

export class WeatherService {
    constructor(apiKey){
        this.apiKey = apiKey;
        this.baseUrl = CONFIG.BASE_URL;
        this.cache = new Map();
        this.cacheDuration = 10 * 60 * 1000;
    }

    async getCurrentWeather(city){
        const cacheKey = `current_${city.toLowerCase()}`;
        const cached = this.getFromCache(cacheKey);
        if(cached) return cached;

        const response = await fetch(
            `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`
        );

        if(!response.ok){
            throw new Error("Failed to fetch current weather");
        }

        const data = await response.json();
        this.saveToCache(cacheKey, data);
        return data;
    }

    async getForecast(city){
        const cacheKey = `forecast_${city.toLowerCase()}`;
        const cached = this.getFromCache(cacheKey);
        if(cached) return cached;

        const response = await fetch(`${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`);

        if(!response.ok){
            throw new Error("Failed to fetch forecast");
        }

        const data = await response.json();
        this.saveToCache(cacheKey, data);
        return data;
    }

    async getWeatherByCoords(lat, lon) {
        const cacheKey = `coords_${lat}_${lon}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(
            `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        );

        if (!response.ok) {
            throw new Error('Location weather fetch failed');
        }

        const data = await response.json();
        this.saveToCache(cacheKey, data);
        return data;
    }

    async getWeatherAlerts(lat, lon) {
        const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${this.apiKey}`
        );

        if (!response.ok) {
            throw new Error('Alert fetch failed');
        }

        return response.json();
    }

    async getCitySuggestions(query) {
        if (!query || query.length < 2) return [];

        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
        );

        if (!response.ok) return [];

        return response.json();
    }


    getFromCache(key){
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    saveToCache(key, data){
        this.cache.set(key, {data, timestamp: Date.now()});
    }
}