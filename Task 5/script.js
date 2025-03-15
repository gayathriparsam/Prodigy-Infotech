// API Key
const API_KEY = "4ddd8317d9c7448b913124338251503"
const BASE_URL = "https://api.weatherapi.com/v1"

// DOM Elements
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const currentLocationButton = document.getElementById("current-location-button")
const weatherContainer = document.getElementById("weather-container")
const loader = document.getElementById("loader")
const errorContainer = document.getElementById("error-container")
const errorMessage = document.getElementById("error-message")

// Current Weather Elements
const locationName = document.getElementById("location-name")
const currentDate = document.getElementById("current-date")
const weatherIcon = document.getElementById("weather-icon")
const currentTemp = document.getElementById("current-temp")
const weatherDescription = document.getElementById("weather-description")
const feelsLike = document.getElementById("feels-like")
const windSpeed = document.getElementById("wind-speed")
const humidity = document.getElementById("humidity")
const pressure = document.getElementById("pressure")

// Forecast Elements
const forecastContainer = document.getElementById("forecast-container")
const hourlyContainer = document.getElementById("hourly-container")

// Event Listeners
searchButton.addEventListener("click", () => {
  const location = searchInput.value.trim()
  if (location) {
    getWeatherData(location)
  }
})

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const location = searchInput.value.trim()
    if (location) {
      getWeatherData(location)
    }
  }
})

currentLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    showLoader()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        getWeatherData(`${latitude},${longitude}`)
      },
      (error) => {
        hideLoader()
        showError("Unable to retrieve your location. Please allow location access or search manually.")
        console.error("Geolocation error:", error)
      },
    )
  } else {
    showError("Geolocation is not supported by your browser. Please search manually.")
  }
})

// Initialize the app
function initApp() {
  // Default to user's location if available
  if (navigator.geolocation) {
    showLoader()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        getWeatherData(`${latitude},${longitude}`)
      },
      () => {
        // If user denies location, use a default city
        hideLoader()
        getWeatherData("London")
      },
    )
  } else {
    // Fallback to default city if geolocation not available
    getWeatherData("London")
  }
}

// Fetch Weather Data
async function getWeatherData(location) {
  showLoader()
  hideError()

  try {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`)

    if (!response.ok) {
      throw new Error(`Weather data not found for "${location}"`)
    }

    const data = await response.json()
    displayWeatherData(data)
    hideLoader()
    weatherContainer.classList.remove("hidden")
  } catch (error) {
    hideLoader()
    weatherContainer.classList.add("hidden")
    showError(error.message)
    console.error("Error fetching weather data:", error)
  }
}

// Display Weather Data
function displayWeatherData(data) {
  // Current Weather
  const current = data.current
  const location = data.location

  locationName.textContent = `${location.name}, ${location.country}`
  currentDate.textContent = formatDate(location.localtime)
  weatherIcon.src = `https:${current.condition.icon}`
  weatherIcon.alt = current.condition.text
  currentTemp.textContent = `${Math.round(current.temp_c)}°C`
  weatherDescription.textContent = current.condition.text
  feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`
  windSpeed.textContent = `${current.wind_kph} km/h`
  humidity.textContent = `${current.humidity}%`
  pressure.textContent = `${current.pressure_mb} hPa`

  // Forecast
  displayForecast(data.forecast.forecastday)

  // Hourly Forecast
  displayHourlyForecast(data.forecast.forecastday[0].hour, location.localtime)
}

// Display Forecast
function displayForecast(forecastData) {
  forecastContainer.innerHTML = ""

  forecastData.forEach((day) => {
    const date = new Date(day.date)
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
    const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    const forecastCard = document.createElement("div")
    forecastCard.className = "forecast-card"
    forecastCard.innerHTML = `
            <div class="forecast-date">
                <div>${dayName}</div>
                <div>${monthDay}</div>
            </div>
            <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="forecast-condition">${day.day.condition.text}</div>
            <div class="forecast-temp">
                <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
            </div>
        `

    forecastContainer.appendChild(forecastCard)
  })
}

// Display Hourly Forecast
function displayHourlyForecast(hourlyData, localTime) {
  hourlyContainer.innerHTML = ""

  // Get current hour from local time
  const currentHour = new Date(localTime).getHours()

  // Filter hourly data to show only future hours
  const futureHours = hourlyData.filter((hour) => {
    const hourTime = new Date(hour.time).getHours()
    return hourTime >= currentHour
  })

  // If we're late in the day, we might not have many future hours
  // In that case, just show the remaining hours
  const hoursToShow = futureHours.length > 0 ? futureHours : hourlyData.slice(0, 8)

  // Limit to 8 hours
  const limitedHours = hoursToShow.slice(0, 8)

  limitedHours.forEach((hour) => {
    const time = new Date(hour.time)
    const hourFormatted = time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })

    const hourlyItem = document.createElement("div")
    hourlyItem.className = "hourly-item"
    hourlyItem.innerHTML = `
            <div class="hourly-time">${hourFormatted}</div>
            <img class="hourly-icon" src="https:${hour.condition.icon}" alt="${hour.condition.text}">
            <div class="hourly-temp">${Math.round(hour.temp_c)}°C</div>
        `

    hourlyContainer.appendChild(hourlyItem)
  })
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Show Loader
function showLoader() {
  loader.style.display = "flex"
}

// Hide Loader
function hideLoader() {
  loader.style.display = "none"
}

// Show Error
function showError(message) {
  errorContainer.style.display = "flex"
  errorMessage.textContent = message
}

// Hide Error
function hideError() {
  errorContainer.style.display = "none"
}

// Initialize the app when the page loads
window.addEventListener("load", initApp)

