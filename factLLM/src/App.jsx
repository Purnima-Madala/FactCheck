import { useState } from 'react';
import SearchBar from './components/SearchBar';
import FactCheckResult from './components/FactCheckResult';
import { factCheck } from './services/mockApi';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await factCheck(query);
      setResult(data);
    } catch (err) {
      setError('Failed to verify claim. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FactCheck AI</h1>
        <div className="subhead">Detect hallucinations • Verify sources • Know the truth</div>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Analyzing claim...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && result && <FactCheckResult result={result} />}

      {!isLoading && !error && !result && (
        <div className="empty-state">
          <p>🔍 Enter a statement above to check its accuracy.</p>
        </div>
      )}

      <footer className="app-footer">
        <p>Sources are simulated for demonstration. Real backend coming soon.</p>
      </footer>
    </div>
  );
}

export default App;