import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModelComparison from '../components/comparator/ModelComparison';
import GroundTruth from '../components/comparator/GroundTruth';
import { queryAIModels } from '../services/mockAPI';
import './ComparatorPage.css';

const ComparatorPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "The moon is made of cheese",
    "Water boils at 100°C at sea level",
    "Vaccines cause autism",
    "The earth is flat",
    "Humans only use 10% of their brain"
  ];

  useEffect(() => {
    const preset = location.state?.presetQuery;
    if (preset) {
      setQuery(preset);
      const timer = setTimeout(() => {
        handleSubmit(undefined, preset);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e, inputQuery) => {
    if (e?.preventDefault) e.preventDefault();
    const trimmedQuery = (inputQuery ?? query).trim();
    if (!trimmedQuery || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setQuery(trimmedQuery);

    try {
      const data = await queryAIModels(trimmedQuery);
      setResult(data);
    } catch (err) {
      setError('Failed to analyze claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      handleSubmit(undefined, suggestion);
    }, 100);
  };

  return (
    <div className="comparator-page">
      {/* Cyber Background */}
      <div className="cyber-bg">
        <div className="grid-lines"></div>
        <div className="noise-overlay"></div>
        <div className="scanlines"></div>
      </div>

      {/* Header Section */}
      <div className="comparator-header">
        <div className="header-badge">
          <span className="badge-dot"></span>
          AI HALLUCINATION DETECTOR
          <span className="badge-version">v2.0</span>
        </div>
        <h1 className="glitch-text">
          AI Hallucination
          <span className="gradient-text"> Comparator</span>
        </h1>
        <p className="header-description">
          Compare responses from multiple AI models and see which ones hallucinate
        </p>
      </div>

      {/* Query Section */}
      <div className="query-section">
        <div className="query-container">
          <form onSubmit={handleSubmit} className="query-form">
            <div className="input-wrapper">
              <div className="input-glow"></div>
              <div className="input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <input
                type="text"
                className="query-input"
                placeholder="Enter any claim to verify... (e.g., 'The moon is made of cheese')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? (
                  <div className="btn-loader"></div>
                ) : (
                  <>
                    <span>Analyze</span>
                    <svg className="btn-arrow" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="suggestions-section">
            <button 
              className="suggestions-toggle"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Try these examples
            </button>
            
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, idx) => (
                  <div 
                    key={idx} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">🔍</span>
                    <span>{suggestion}</span>
                    <span className="suggestion-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="hologram-loader">
            <div className="hologram-ring"></div>
            <div className="hologram-ring"></div>
            <div className="hologram-ring"></div>
            <div className="loader-text">
              <span className="loader-dot">.</span>
              <span className="loader-dot">.</span>
              <span className="loader-dot">.</span>
            </div>
          </div>
          <div className="loading-steps">
            <div className="loading-step">
              <div className="step-indicator active"></div>
              <span>Querying AI models...</span>
            </div>
            <div className="loading-step">
              <div className={`step-indicator ${isLoading ? 'pulse' : ''}`}></div>
              <span>Analyzing responses...</span>
            </div>
            <div className="loading-step">
              <div className="step-indicator"></div>
              <span>Detecting hallucinations...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h3>Analysis Failed</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => handleSubmit(new Event('submit'))}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" fill="none"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isLoading && !error && result && (
        <div className="results-section">
          <div className="results-header">
            <div className="results-badge">
              <span className="badge-icon">📊</span>
              ANALYSIS COMPLETE
            </div>
            <div className="query-display">
              <span className="query-label">Claim:</span>
              <span className="query-text">"{result.originalQuery || query}"</span>
            </div>
          </div>

          <div className="results-grid">
            <div className="model-comparison-wrapper">
              <div className="section-title">
                <div className="title-icon">🤖</div>
                <h2>Model Responses</h2>
                <div className="title-line"></div>
              </div>
              <ModelComparison 
                modelResponses={result.responses} 
                modelScores={result.scores} 
              />
            </div>

            <div className="ground-truth-wrapper">
              <div className="section-title">
                <div className="title-icon">✓</div>
                <h2>Ground Truth</h2>
                <div className="title-line"></div>
              </div>
              <GroundTruth 
                groundTruth={result.groundTruth} 
                consensusScore={result.consensusScore} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && !result && !location.state?.presetQuery && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-animation">
              <div className="empty-circle"></div>
              <div className="empty-icon">🔍</div>
              <div className="empty-pulse"></div>
            </div>
            <h3>Ready to Detect Hallucinations?</h3>
            <p>Enter any claim above to see how different AI models respond and identify which ones might be hallucinating.</p>
            <div className="empty-features">
              <div className="feature-chip">
                <span>✓</span> Real-time comparison
              </div>
              <div className="feature-chip">
                <span>✓</span> Multi-model analysis
              </div>
              <div className="feature-chip">
                <span>✓</span> Confidence scoring
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparatorPage;