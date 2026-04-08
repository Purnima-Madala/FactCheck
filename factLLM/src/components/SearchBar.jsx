import { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder, suggestions = [], isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <div className="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={placeholder || "Search or enter a claim..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSuggestions(true)}
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button type="button" className="clear-btn" onClick={handleClear}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          )}
          <button type="submit" className="search-btn" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <div className="search-loader"></div>
            ) : (
              <>
                <span>Analyze</span>
                <svg className="search-arrow" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {filteredSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-icon">🔍</div>
              <div className="suggestion-text">{suggestion}</div>
              <div className="suggestion-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
