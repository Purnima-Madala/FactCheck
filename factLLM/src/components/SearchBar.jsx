import { useState } from 'react';

const SearchBar = ({ onSearch, isLoading, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSearch(input.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter a claim to fact-check..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || disabled}
        />
        <button 
          type="submit" 
          className="search-button" 
          disabled={isLoading || disabled}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;