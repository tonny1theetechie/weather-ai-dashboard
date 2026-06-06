const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';
const IPINFO_URL = 'https://ipinfo.io/json';

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const weatherIconMap = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
  }
  return response.json();
}

function formatLocationTime(time, timezone) {
  try {
    return new Date(time).toLocaleString('en-KE', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return time;
  }
}

function getWeatherText(code) {
  return weatherCodeMap[code] || 'Unknown conditions';
}

function getWeatherIcon(code) {
  return weatherIconMap[code] || '❔';
}

function findNearestHourIndex(dateString, times) {
  const target = new Date(dateString).getTime();
  return times.reduce(
    (best, time, index) => {
      const diff = Math.abs(new Date(time).getTime() - target);
      return diff < best.diff ? { index, diff } : best;
    },
    { index: 0, diff: Infinity }
  ).index;
}

function buildSummary(locationName, current, daily) {
  const today = daily?.[0];
  if (!current || !today) {
    return 'Weather data is ready.';
  }
  return `It is currently ${Math.round(current.temp_c)}°C in ${locationName}. Expect ${current.condition.text.toLowerCase()} today with a high of ${Math.round(today.day.maxtemp_c)}°C and a low of ${Math.round(today.day.mintemp_c)}°C.`;
}

function buildHourlyItems(hourly, date) {
  return hourly.time
    .map((time, index) => ({
      time,
      time_epoch: Math.floor(new Date(time).getTime() / 1000),
      temp_c: hourly.temperature_2m[index],
      condition: {
        text: getWeatherText(hourly.weathercode[index]),
        icon: getWeatherIcon(hourly.weathercode[index]),
      },
      humidity: hourly.relativehumidity_2m ? hourly.relativehumidity_2m[index] : null,
      wind_kph: hourly.windspeed_10m ? hourly.windspeed_10m[index] : null,
      feelslike_c: hourly.apparent_temperature ? hourly.apparent_temperature[index] : null,
    }))
    .filter((item) => item.time.startsWith(date));
}

async function reverseGeocode(lat, lon) {
  const url = `${REVERSE_GEOCODE_URL}?format=json&lat=${lat}&lon=${lon}&zoom=10`;
  return fetchJson(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'weather-ai-dashboard/1.0',
    },
  });
}

async function geocodeCity(city) {
  const q = encodeURIComponent(`${city} kenya`);
  const url = `${GEOCODE_URL}?format=json&q=${q}&countrycodes=ke&limit=1`;
  const data = await fetchJson(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'weather-ai-dashboard/1.0',
    },
  });
  if (!data || !data.length) {
    throw new Error('Location not found');
  }
  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    display_name: data[0].display_name,
  };
}

async function fetchWeatherData(lat, lon) {
  const timezone = 'Africa/Nairobi';
  const query = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    hourly: 'temperature_2m,weathercode,relativehumidity_2m,apparent_temperature,windspeed_10m',
    timezone,
  });
  const url = `${BASE_URL}?${query.toString()}`;
  return fetchJson(url);
}

function buildWeatherResponse(weatherData, locationData, locationOverride = null) {
  const timezone = weatherData.timezone || 'Africa/Nairobi';
  const current = weatherData.current_weather;
  const localtime = current?.time ? formatLocationTime(current.time, timezone) : '';
  const location = {
    name:
      locationOverride?.name ||
      locationData?.address?.city ||
      locationData?.address?.town ||
      locationData?.address?.village ||
      locationData?.address?.county ||
      locationData?.address?.state ||
      'Kenya',
    region: locationOverride?.region || locationData?.address?.state || locationData?.address?.region || '',
    country: locationOverride?.country || locationData?.address?.country || 'Kenya',
    localtime,
  };
  const currentHourIndex = findNearestHourIndex(current.time, weatherData.hourly.time);
  const currentHumidity = currentHourIndex >= 0 ? weatherData.hourly.relativehumidity_2m[currentHourIndex] : null;
  const currentFeelsLike = currentHourIndex >= 0 ? weatherData.hourly.apparent_temperature[currentHourIndex] : null;
  const currentWeather = {
    temp_c: current.temperature,
    condition: {
      text: getWeatherText(current.weathercode),
      icon: getWeatherIcon(current.weathercode),
    },
    humidity: currentHumidity,
    wind_kph: current.windspeed,
    feelslike_c: currentFeelsLike,
  };
  const forecastday = weatherData.daily.time.map((date, index) => ({
    date,
    day: {
      maxtemp_c: weatherData.daily.temperature_2m_max[index],
      mintemp_c: weatherData.daily.temperature_2m_min[index],
      condition: {
        text: getWeatherText(weatherData.daily.weathercode[index]),
        icon: getWeatherIcon(weatherData.daily.weathercode[index]),
      },
    },
    hour: buildHourlyItems(weatherData.hourly, date),
  }));
  return {
    location,
    current: currentWeather,
    forecast: { forecastday },
    ai_summary: buildSummary(location.name, currentWeather, forecastday),
  };
}

export async function getWeatherByGeo() {
  const geo = await fetchJson(IPINFO_URL, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!geo.loc) {
    throw new Error('Unable to determine location from IP');
  }
  const [lat, lon] = geo.loc.split(',').map(Number);
  const locationData = await reverseGeocode(lat, lon);
  const weatherData = await fetchWeatherData(lat, lon);
  return buildWeatherResponse(weatherData, locationData);
}

export async function getWeatherByCoords(lat, lon, locationOverride = null) {
  const locationData = locationOverride ? null : await reverseGeocode(lat, lon);
  const weatherData = await fetchWeatherData(lat, lon);
  return buildWeatherResponse(weatherData, locationData, locationOverride);
}

export async function getWeatherByCity(city) {
  const geo = await geocodeCity(city);
  const locationData = await reverseGeocode(geo.lat, geo.lon);
  const weatherData = await fetchWeatherData(geo.lat, geo.lon);
  return buildWeatherResponse(weatherData, locationData);
}
