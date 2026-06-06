import React from 'react';
import { crops, evaluateCropSuitability, getSoilMoistureAdvice } from '../data/agriculturalData';

function AgriculturalAdvisory({ weatherData }) {
  if (!weatherData?.current) {
    return null;
  }

  const { current } = weatherData;
  const temperature = current.temp_c || 0;
  const humidity = current.humidity || 0;
  const precipitation = current.precip_mm || 0;

  const weatherInput = {
    temperature,
    humidity,
    precipitation
  };

  const cropsArray = Object.values(crops);
  const cropsWithScores = cropsArray.map((crop) => ({
    ...crop,
    evaluation: evaluateCropSuitability(crop, weatherInput)
  }));

  const topCrops = cropsWithScores
    .sort((a, b) => b.evaluation.suitability - a.evaluation.suitability)
    .slice(0, 4);

  const soilMoisture = getSoilMoistureAdvice(humidity, precipitation, temperature);

  const pestRisk = (() => {
    if (humidity > 70 && temperature >= 22 && temperature <= 28) {
      return { level: 'HIGH', color: '#ef4444' };
    } else if (humidity > 60 || (temperature >= 18 && temperature <= 30)) {
      return { level: 'MODERATE', color: '#f59e0b' };
    } else {
      return { level: 'LOW', color: '#10b981' };
    }
  })();

  return (
    <section className="agricultural-section card">
      <div className="ag-header">
        <h3>Agricultural Advisory</h3>
        <p className="ag-subtitle">Crop suitability and farming recommendations based on current weather</p>
      </div>

      <div className="ag-grid">
        {/* Soil Moisture Card */}
        <div className="ag-metric-card">
          <h4>Soil Moisture</h4>
          <div className="moisture-indicator" style={{ borderColor: soilMoisture.color }}>
            <div className="moisture-level" style={{ background: soilMoisture.color }}>
              {soilMoisture.level}
            </div>
          </div>
          <p className="ag-metric-advice">{soilMoisture.advice}</p>
        </div>

        {/* Pest Risk Card */}
        <div className="ag-metric-card">
          <h4>Pest Risk Level</h4>
          <div
            className="pest-risk-badge"
            style={{ borderColor: pestRisk.color, background: `${pestRisk.color}15` }}
          >
            <span style={{ color: pestRisk.color, fontWeight: 'bold' }}>
              {pestRisk.level}
            </span>
          </div>
          <p className="ag-metric-advice">
            {pestRisk.level === 'HIGH'
              ? 'High humidity and warmth favor pest breeding. Increase monitoring.'
              : pestRisk.level === 'MODERATE'
              ? 'Moderate conditions. Maintain regular pest scouting.'
              : 'Favorable conditions against pests. Continue preventive care.'}
          </p>
        </div>

        {/* Temperature & Humidity */}
        <div className="ag-metric-card">
          <h4>Temperature</h4>
          <div className="metric-value">{temperature}°C</div>
          <p className="ag-metric-info">
            {temperature > 28 ? 'Hot' : temperature < 15 ? 'Cool' : 'Moderate'} conditions for crop growth
          </p>
        </div>

        <div className="ag-metric-card">
          <h4>Humidity</h4>
          <div className="metric-value">{humidity}%</div>
          <p className="ag-metric-info">
            {humidity > 70 ? 'High moisture' : humidity > 50 ? 'Moderate' : 'Low humidity'} levels
          </p>
        </div>
      </div>

      {/* Top Recommended Crops */}
      <div className="ag-crops-section">
        <h4>Most Suitable Crops Today</h4>
        <div className="crops-grid">
          {topCrops.map((crop) => (
            <div key={crop.name} className="crop-card">
              <div className="crop-header">
                {crop.icon && <span className="crop-emoji">{crop.icon}</span>}
                <span className="crop-name">{crop.name}</span>
              </div>
              <div className="crop-score">
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${crop.evaluation.suitability}%`,
                      background:
                        crop.evaluation.suitability >= 80
                          ? '#10b981'
                          : crop.evaluation.suitability >= 60
                          ? '#f59e0b'
                          : '#ef4444'
                    }}
                  />
                </div>
                <span className="score-text">{Math.round(crop.evaluation.suitability)}%</span>
              </div>
              <div className="crop-status">
                <p>
                  <strong>Temperature:</strong> {crop.evaluation.tempStatus}
                </p>
                <p>
                  <strong>Humidity:</strong> {crop.evaluation.humidityStatus}
                </p>
              </div>
              <p className="crop-season">Planting season: {crop.plantingSeason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Farming Tips */}
      <div className="ag-tips">
        <h4>Recommendations</h4>
        <div className="ag-tips-content">
          <div className="tip-item">
            <p className="tip-label">Humidity Management</p>
            <p>
              {humidity > 70
                ? 'High humidity detected. Ensure adequate crop ventilation to reduce fungal disease risk.'
                : humidity < 40
                ? 'Low humidity conditions. Plan irrigation schedules to prevent water stress in crops.'
                : 'Humidity levels are favorable. Continue with regular crop monitoring.'}
            </p>
          </div>
          <div className="tip-item">
            <p className="tip-label">Temperature Considerations</p>
            <p>
              {temperature > 28
                ? 'Hot conditions expected. Increase watering frequency and consider providing shade for sensitive crop varieties.'
                : temperature < 15
                ? 'Cool conditions may slow growth in heat-loving crops. Monitor crop development closely.'
                : 'Temperature is suitable for most crops. Maintain regular management practices.'}
            </p>
          </div>
          <div className="tip-item">
            <p className="tip-label">Rainfall Outlook</p>
            <p>
              {precipitation > 10
                ? 'Heavy rain is expected. Ensure drainage systems are functioning properly and delay pesticide application until conditions dry.'
                : precipitation > 0
                ? 'Light rain is forecasted. This is a good opportunity for planting or transplanting activities.'
                : 'No rain is expected. Plan irrigation accordingly to maintain soil moisture.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgriculturalAdvisory;
