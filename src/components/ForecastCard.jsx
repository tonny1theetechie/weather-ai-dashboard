import React from 'react';

function ForecastCard({ day }) {
  if (!day) return null;

  const date = new Date(day.date);
  const title = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <article className="forecast-card card">
      <p className="forecast-card__day">{title}</p>
      {day.day.condition.icon && (
        <div className="forecast-card__icon" aria-label={day.day.condition.text}>
          {day.day.condition.icon}
        </div>
      )}
      <p className="forecast-card__condition">{day.day.condition.text}</p>
      <div className="forecast-card__temps">
        <span>{Math.round(day.day.maxtemp_c)}°</span>
        <span>{Math.round(day.day.mintemp_c)}°</span>
      </div>
    </article>
  );
}

export default ForecastCard;
