import { useState } from 'react';
import ModelComparison from '../components/comparator/ModelComparison';
import GroundTruth from '../components/comparator/GroundTruth';
import { queryAIModels } from '../services/mockAIService';

const ComparatorPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await queryAIModels(query);
      setResult(data);
    } catch (err) {
      setError('Failed to analyze claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comparator-page">
      <div className="comparator-header">
        <h1>AI Hallucination Comparator</h1>
        <p>Compare responses from multiple AI models and see which ones hallucinate</p>
      </div>

      <div className="query-section">
        <form onSubmit={handleSubmit} className="query-form">
          <input
            type="text"
            className="query-input"
            placeholder="Enter any claim to verify... (e.g., 'The moon is made of cheese')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Compare AI Responses'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Try: "The moon is made of cheese" • "Water boils at 100°C at sea level" • "Vaccines cause autism" • "The earth is flat"
        </div>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Querying AI models and analyzing responses...</p>
        </div>
      )}

      {error && (
        <div className="error-state" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--error)' }}>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && result && (
        <>
          <ModelComparison 
            modelResponses={result.responses} 
            modelScores={result.scores} 
          />
          <GroundTruth 
            groundTruth={result.groundTruth} 
            consensusScore={result.consensusScore} 
          />
        </>
      )}

      {!isLoading && !error && !result && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            👆 Enter a claim above to see how different AI models respond
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparatorPage;