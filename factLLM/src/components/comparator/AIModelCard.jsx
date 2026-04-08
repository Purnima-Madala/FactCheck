const AIModelCard = ({ modelId, response, score }) => {
  const getErrorLevel = (percentage) => {
    if (percentage <= 30) return 'success';
    if (percentage <= 70) return 'warning';
    return 'error';
  };

  const errorLevel = getErrorLevel(score.errorPercentage);

  return (
    <div className="model-card">
      <div className="model-header">
        <div className="model-name">
          <div className="model-icon" style={{ background: response.color }}>
            {response.icon}
          </div>
          <h3>{response.model}</h3>
        </div>
        <span className={`model-badge bg-${errorLevel}`} style={{ 
          background: errorLevel === 'success' ? 'var(--success-light)' : 
                      errorLevel === 'warning' ? 'var(--warning-light)' : 
                      'var(--error-light)',
          color: errorLevel === 'success' ? '#14532d' : 
                 errorLevel === 'warning' ? '#854d0e' : 
                 '#991b1b'
        }}>
          {score.confidence}% Confident
        </span>
      </div>
      
      <div className="model-response">
        <p className="response-text">{response.text}</p>
      </div>
      
      <div className="model-footer">
        <div className="error-score">
          <div className="error-label">
            <span>Hallucination Risk</span>
            <span className={`text-${errorLevel}`}><strong>{score.errorPercentage}%</strong></span>
          </div>
          <div className="error-bar">
            <div 
              className={`error-fill bg-${errorLevel}`}
              style={{ 
                width: `${score.errorPercentage}%`,
                background: errorLevel === 'success' ? 'var(--success)' : 
                           errorLevel === 'warning' ? 'var(--warning)' : 
                           'var(--error)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelCard;