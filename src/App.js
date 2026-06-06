import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { getWeatherByCity, getWeatherByCoords, getWeatherByGeo } from './api/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import AISummary from './components/AISummary';
import AgriculturalAdvisory from './components/AgriculturalAdvisory';
import Loader from './components/Loader';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const fetchWeatherByGeo = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getWeatherByGeo();
      setWeatherData(data);
    } catch (geoError) {
      setError(geoError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLocationWeather = useCallback(async () => {
    if (!navigator.geolocation) {
      await fetchWeatherByGeo();
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setWeatherData(data);
        } catch (geoError) {
          await fetchWeatherByGeo();
        } finally {
          setLoading(false);
        }
      },
      async () => {
        await fetchWeatherByGeo();
      },
      { timeout: 8000 }
    );
  }, [fetchWeatherByGeo]);

  useEffect(() => {
    loadLocationWeather();
  }, [loadLocationWeather]);

  const handleSearch = async (search) => {
    setLoading(true);
    setError('');

    let query = '';
    if (typeof search === 'string') {
      query = search;
    } else if (search.type === 'city') {
      query = search.query;
    } else if (search.type === 'county') {
      query = `${search.county} County, Kenya`;
    } else {
      query = '';
    }

    if (!query) {
      setError('Please provide a valid search query.');
      setLoading(false);
      return;
    }

    try {
      const data = await getWeatherByCity(query);
      setWeatherData(data);
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  };

  const forecastDays = weatherData?.forecast?.forecastday || [];
  const hourlyHours = forecastDays?.[0]?.hour || [];
  const summary = weatherData?.ai_summary || weatherData?.current?.condition?.text || 'A quick AI summary will appear here once weather data loads.';

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="dashboard">
        <header className="topbar card">
          <div>
            <p className="eyebrow">Kenya Weather Intelligence</p>
            <h1>Weather AI Dashboard</h1>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        <section className="search-section card">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        {loading && <Loader />}

        {error && <div className="error-card card">{error}</div>}

        {weatherData && (
          <>
            <CurrentWeather location={weatherData.location} current={weatherData.current} />

            <div className="forecast-layout">
              <section className="forecast-panel card">
                <div className="section-title">
                  <h3>7-Day Forecast</h3>
                </div>
                <div className="forecast-grid">
                  {forecastDays.map((day) => (
                    <ForecastCard key={day.date} day={day} />
                  ))}
                </div>
              </section>

              <AISummary summary={summary} location={weatherData.location} />
            </div>

            <AgriculturalAdvisory weatherData={weatherData} />

            <HourlyForecast hours={hourlyHours} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
