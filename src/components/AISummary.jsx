import React from 'react';

function AISummary({ summary, location }) {
  if (!summary) return null;

  return (
    <section className="ai-summary card">
      <div className="section-title">
        <h3>AI Weather Insight</h3>
        <p className="location-label">{location?.name ? `For ${location.name}, ${location.country}` : ''}</p>
      </div>
      <p>{summary}</p>
    </section>
  );
}

export default AISummary;
