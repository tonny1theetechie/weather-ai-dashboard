import React, { useEffect, useRef, useState } from 'react';
import locations from '../data/kenyaCounties';

const sortedCounties = [...locations.counties].sort((a, b) => a.localeCompare(b));

function SearchBar({ onSearch, loading }) {
  const [county, setCounty] = useState('');
  const [countyFilter, setCountyFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredCounties = sortedCounties.filter((name) => name.toLowerCase().includes(countyFilter.toLowerCase()));
  const displayText = county || 'Select a county to view the weather condition';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    if (loading) return;
    setDropdownOpen((current) => !current);
  };

  const handleFilterChange = (event) => {
    setCountyFilter(event.target.value);
  };

  const handleCountySelect = (name) => {
    setCounty(name);
    setDropdownOpen(false);
    setCountyFilter('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!county) return;
    onSearch({ type: 'county', county });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} ref={wrapperRef}>
      <div className="search-controls">
        <div className="county-dropdown-group">
          <button
            type="button"
            className={`county-dropdown-trigger ${county ? '' : 'placeholder'}`}
            onClick={handleDropdownToggle}
            disabled={loading}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{displayText}</span>
            <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>▾</span>
          </button>

          {dropdownOpen && (
            <div className="county-dropdown-menu">
              <input
                type="search"
                placeholder="Search counties, e.g. Kiambu"
                className="county-filter"
                value={countyFilter}
                onChange={handleFilterChange}
                disabled={loading}
                autoFocus
              />
              <div className="county-dropdown-options" role="listbox">
                {filteredCounties.length > 0 ? (
                  filteredCounties.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`county-dropdown-option ${county === name ? 'selected' : ''}`}
                      onClick={() => handleCountySelect(name)}
                      disabled={loading}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="ward-unavailable">No matching counties. Try another letter.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || !county}>
          Search
        </button>
      </div>
      {sortedCounties.length === 0 && <p className="field-note">County data are not available. Use city search.</p>}
    </form>
  );
}

export default SearchBar;
