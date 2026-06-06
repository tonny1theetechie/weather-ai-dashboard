import React from 'react';

function Loader() {
  return (
    <div className="loader">
      <div className="spinner" />
      <span>Loading weather data...</span>
    </div>
  );
}

export default Loader;
