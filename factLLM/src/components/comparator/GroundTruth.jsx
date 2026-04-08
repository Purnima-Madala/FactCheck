const GroundTruth = ({ groundTruth, consensusScore }) => {
  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'true': return 'verdict-true';
      case 'false': return 'verdict-false';
      case 'misleading': return 'verdict-misleading';
      default: return 'verdict-unverified';
    }
  };

  return (
    <div className="ground-truth-section">
      <div className="ground-truth-header">
        <div className="ground-truth-title">
          <span>🎯 Ground Truth</span>
        </div>
        <div className="consensus-meter">
          <span style={{ color: 'var(--text-secondary)' }}>Consensus:</span>
          <span className="consensus-score">{consensusScore}%</span>
        </div>
      </div>
      
      <div className="ground-truth-content">
        <div>
          <span className={`verdict-large ${getVerdictClass(groundTruth.verdict)}`}>
            {groundTruth.verdict}
          </span>
          <div className="explanation-box" style={{ marginTop: '1rem' }}>
            <strong>Explanation:</strong>
            <p style={{ marginTop: '0.5rem' }}>{groundTruth.explanation}</p>
          </div>
        </div>
        
        <div className="sources-box">
          <strong>📚 Verified Sources</strong>
          {groundTruth.sources.length > 0 ? (
            <ul className="sources-list">
              {groundTruth.sources.map((source, idx) => (
                <li key={idx}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    {source.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              No sources available for this claim.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundTruth;