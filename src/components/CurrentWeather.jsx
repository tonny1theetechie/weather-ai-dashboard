import React from 'react';

function CurrentWeather({ location, current }) {
  if (!current || !location) return null;

  return (
    <section className="current-weather card">
      <div className="current-weather__header">
        <div>
          <h2>{location.name}, {location.country}</h2>
          <p>{location.region} · Local time {location.localtime}</p>
        </div>
        {current.condition?.icon && (
          <span className="weather-emoji" role="img" aria-label={current.condition.text}>
            {current.condition.icon}
          </span>
        )}
      </div>

      <div className="current-weather__stats">
        <div className="stat-block">
          <span className="stat-value">{Math.round(current.temp_c || current.temp || 0)}°C</span>
          <span className="stat-label">Temperature</span>
        </div>
        <div className="stat-block">
          <span className="stat-value">{current.condition?.text || 'Clear'}</span>
          <span className="stat-label">Condition</span>
        </div>
        <div className="stat-block">
          <span className="stat-value">{current.humidity != null ? `${current.humidity}%` : 'N/A'}</span>
          <span className="stat-label">Humidity</span>
        </div>
        <div className="stat-block">
          <span className="stat-value">{current.wind_kph ?? current.wind_kph ?? 0} km/h</span>
          <span className="stat-label">Wind</span>
        </div>
        <div className="stat-block">
          <span className="stat-value">{Math.round(current.feelslike_c || 0)}°C</span>
          <span className="stat-label">Feels like</span>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
