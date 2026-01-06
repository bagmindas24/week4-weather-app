# Weather Application

## Project Description
A responsive weather application that fetches real-time weather data from OpenWeatherMap API. Features include current weather, 5-day forecast, city search with autocomplete, temperature conversion, and favorite cities storage. The app is designed to be user-friendly and responsive across all devices.

---

## Features
- **Current Weather Conditions**: Displays real-time weather data for the searched city.
- **5-Day Weather Forecast**: Provides a detailed forecast for the next five days.
- **City Search with Autocomplete**: Suggests city names as you type.
- **Celsius/Fahrenheit Conversion**: Toggle between temperature units.
- **Favorite Cities Storage**: Save and manage your favorite cities.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Error Handling**: Displays user-friendly error messages for API failures.
- **Loading States**: Indicates when data is being fetched.

---

## Setup Instructions

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- A text editor (e.g., VS Code) for code modifications.
- An API key from OpenWeatherMap.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd week4-weather-app
   ```
3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your OpenWeatherMap API key to the `.env` file:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```
5. Open `index.html` in your browser to view the app.

---

## Code Structure

### File Hierarchy
```
week4-weather-app/
│── index.html
│── css/
│   ├── style.css
│   ├── weather-icons.css
│   └── responsive.css
│── js/
│   ├── app.js
│   ├── weatherService.js
│   ├── ui.js
│   ├── storage.js
│   └── config.js
│── assets/
│   ├── icons/
│   └── images/
│── README.md
│── .env.example
└── .gitignore
```

### Key Files
- **index.html**: The main HTML structure of the app.
- **css/**: Contains styles for layout, responsiveness, and weather icons.
- **js/**: Contains JavaScript modules for app functionality:
  - `app.js`: Main application logic and event handling.
  - `weatherService.js`: Handles API calls and caching.
  - `ui.js`: Manages DOM updates and user interface.
  - `storage.js`: Handles localStorage operations for favorites.
  - `config.js`: Stores API configuration.
- **assets/**: Contains icons and images used in the app.
- **.env.example**: Template for environment variables.

---

## API Used
- **OpenWeatherMap API**: Provides current weather, 5-day forecast, and city suggestions.

---

## Quality Standards Checklist
- [x] Clear project goals and objectives.
- [x] Step-by-step setup instructions.
- [x] Well-organized code structure.
- [x] Responsive design for all devices.
- [x] User-friendly error handling and loading states.
- [x] Favorite cities functionality.
- [x] Celsius/Fahrenheit toggle.

---

## Visual Documentation
### Screenshots
- **Home Page**: Displays current weather and forecast.
- **Search Functionality**: Autocomplete suggestions for city names.
- **Responsive Design**: Optimized for mobile and tablet views.

---

## Testing Evidence
- **Test Cases**:
  - Search for a valid city: Displays weather data.
  - Search for an invalid city: Displays error message.
  - Toggle temperature units: Updates displayed temperatures.
  - Add/remove favorite cities: Updates the favorites list.
  - Use geolocation: Displays weather for current location.

---

## Component Architecture
### Component Hierarchy
- **WeatherService**: Handles API calls and caching.
- **WeatherUI**: Updates the DOM with weather data.
- **Storage**: Manages localStorage for favorites.

### Data Flow
1. User inputs a city name.
2. `WeatherService` fetches data from the API.
3. `WeatherUI` updates the DOM with the fetched data.
4. `Storage` saves favorite cities to localStorage.

---

## Deployment
- Deploy the app to GitHub Pages:
  1. Push the code to a GitHub repository.
  2. Enable GitHub Pages in the repository settings.
  3. Access the app via the provided GitHub Pages URL.