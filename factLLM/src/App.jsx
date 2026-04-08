import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FactCheckResult from './components/FactCheckResult';
import { factCheck, checkBackendHealth } from './services/api';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };
    checkHealth();
    
    // Optional: Poll health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await factCheck(query);
      setResult(data);
      
      // Clear offline warning if backend was previously offline
      if (backendStatus === 'offline') {
        setBackendStatus('online');
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
      
      // Check if backend is actually offline
      if (err.message.includes('connect') || err.message.includes('Network')) {
        setBackendStatus('offline');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FactCheck AI</h1>
        <div className="subhead">Detect hallucinations • Verify sources • Know the truth</div>
        
        {/* Backend status indicator */}
        {backendStatus === 'offline' && (
          <div style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#fee2e2',
            borderRadius: '40px',
            color: '#991b1b',
            fontSize: '0.9rem',
            display: 'inline-block'
          }}>
            ⚠️ Backend offline - Start server at localhost:3001
          </div>
        )}
      </header>

      <SearchBar 
        onSearch={handleSearch} 
        isLoading={isLoading} 
        disabled={backendStatus === 'offline'}
      />

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Analyzing claim with AI...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
        </div>
      )}

      {!isLoading && !error && result && <FactCheckResult result={result} />}

      {!isLoading && !error && !result && (
        <div className="empty-state">
          <p>🔍 Enter a statement above to check its accuracy.</p>
          {backendStatus === 'online' && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Powered by NVIDIA NIM + Google Fact Check Tools
            </p>
          )}
        </div>
      )}

      <footer className="app-footer">
        <p>
          {backendStatus === 'online' 
            ? '✅ Connected to fact-checking service' 
            : '⏳ Waiting for backend connection...'}
        </p>
      </footer>
    </div>
  );
}

export default App;