import { useState } from 'react';
import './FactCheckResult.css';

const FactCheckResult = ({ claim, verdict, confidence, sources }) => {
  const [expandedSource, setExpandedSource] = useState(null);

  const getVerdictIcon = () => {
    switch(verdict) {
      case 'true': return '✅';
      case 'false': return '❌';
      case 'misleading': return '⚠️';
      default: return '❓';
    }
  };

  const getVerdictColor = () => {
    switch(verdict) {
      case 'true': return 'var(--success-green)';
      case 'false': return 'var(--error-red)';
      case 'misleading': return 'var(--warning-orange)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="fact-check-result">
      <div className="fact-check-header">
        <div className="claim-container">
          <span className="claim-label">Claim:</span>
          <span className="claim-text">"{claim}"</span>
        </div>
      </div>

      <div className="verdict-container" style={{ borderColor: getVerdictColor() }}>
        <div className="verdict-icon">{getVerdictIcon()}</div>
        <div className="verdict-info">
          <div className="verdict-label">Verdict</div>
          <div className="verdict-value" style={{ color: getVerdictColor() }}>
            {verdict.toUpperCase()}
          </div>
        </div>
        <div className="confidence-info">
          <div className="confidence-label">Confidence</div>
          <div className="confidence-value">{confidence}%</div>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence}%`, background: getVerdictColor() }}></div>
          </div>
        </div>
      </div>

      {sources && sources.length > 0 && (
        <div className="sources-container">
          <h4>Supporting Sources</h4>
          <div className="sources-grid">
            {sources.map((source, idx) => (
              <div 
                key={idx} 
                className={`source-card ${expandedSource === idx ? 'expanded' : ''}`}
                onClick={() => setExpandedSource(expandedSource === idx ? null : idx)}
              >
                <div className="source-header">
                  <div className="source-icon">📚</div>
                  <div className="source-title">{source.title}</div>
                  <div className="source-expand">{expandedSource === idx ? '−' : '+'}</div>
                </div>
                {expandedSource === idx && (
                  <div className="source-details">
                    <p>{source.excerpt}</p>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">
                      Read full article →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fact-check-footer">
        <div className="footer-badge">
          <span>🔍</span> Fact-checked by AI Hallucination Detector
        </div>
        <div className="footer-badge">
          <span>📅</span> Real-time analysis
        </div>
      </div>
    </div>
  );
};

export default FactCheckResult;