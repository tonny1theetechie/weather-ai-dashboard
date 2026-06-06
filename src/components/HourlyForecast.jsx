import React from 'react';

function HourlyForecast({ hours }) {
  if (!hours || !hours.length) return null;

  return (
    <section className="hourly-forecast card">
      <div className="section-title">
        <h3>Hourly Forecast</h3>
      </div>
      <div className="hourly-list">
        {hours.map((hour) => {
          const timeString = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div className="hour-card" key={hour.time_epoch}>
              <p>{timeString}</p>
              {hour.condition?.icon && (
                <div className="hour-card__icon" aria-label={hour.condition.text}>
                  {hour.condition.icon}
                </div>
              )}
              <p>{Math.round(hour.temp_c)}°</p>
              <p>{hour.condition?.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HourlyForecast;
