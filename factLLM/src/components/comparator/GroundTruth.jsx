import { useState } from 'react';
import './GroundTruth.css';

const GroundTruth = ({ groundTruth, consensusScore }) => {
  const [showSources, setShowSources] = useState(false);

  const getConsensusColor = () => {
    if (consensusScore >= 85) return 'var(--success-green)';
    if (consensusScore >= 70) return 'var(--primary-cyan)';
    if (consensusScore >= 50) return 'var(--warning-orange)';
    return 'var(--error-red)';
  };

  const getTruthIcon = (isTrue) => {
    return isTrue ? '✓' : '✗';
  };

  return (
    <div className="ground-truth">
      <div className="ground-truth-header">
        <div className="header-icon">🔍</div>
        <h3>Ground Truth Analysis</h3>
        <div className="consensus-badge" style={{ borderColor: getConsensusColor() }}>
          <span className="consensus-label">Consensus Score</span>
          <span className="consensus-value" style={{ color: getConsensusColor() }}>
            {consensusScore}%
          </span>
        </div>
      </div>

      <div className="ground-truth-content">
        <div className="truth-card">
          <div className={`truth-verdict ${groundTruth.isTrue ? 'true' : 'false'}`}>
            <div className="verdict-icon">
              {getTruthIcon(groundTruth.isTrue)}
            </div>
            <div className="verdict-text">
              {groundTruth.isTrue ? 'VERIFIED TRUE' : 'VERIFIED FALSE'}
            </div>
          </div>
          
          <div className="truth-explanation">
            <p>{groundTruth.explanation}</p>
          </div>

          <div className="truth-sources">
            <button 
              className="sources-toggle"
              onClick={() => setShowSources(!showSources)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {showSources ? 'Hide Sources' : 'Show Sources'} ({groundTruth.sources?.length || 0})
              <svg className={`toggle-icon ${showSources ? 'rotated' : ''}`} viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>

            {showSources && (
              <div className="sources-list animate-slide-down">
                {groundTruth.sources?.map((source, idx) => (
                  <div key={idx} className="source-item">
                    <div className="source-icon">📄</div>
                    <div className="source-content">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-title">
                        {source.title}
                      </a>
                      <p className="source-excerpt">{source.excerpt}</p>
                      <div className="source-meta">
                        <span className="source-reliability" style={{
                          background: source.reliability === 'high' ? 'var(--success-green)' :
                                     source.reliability === 'medium' ? 'var(--warning-orange)' : 'var(--error-red)'
                        }}>
                          {source.reliability} confidence
                        </span>
                        <span className="source-date">{source.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="confidence-metrics">
          <div className="metric">
            <div className="metric-label">Factual Accuracy</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: `${consensusScore}%`, background: getConsensusColor() }}>
                <div className="metric-shimmer"></div>
              </div>
            </div>
            <div className="metric-value">{consensusScore}%</div>
          </div>

          <div className="metric">
            <div className="metric-label">Source Reliability</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '92%', background: 'var(--primary-cyan)' }}>
                <div className="metric-shimmer"></div>
              </div>
            </div>
            <div className="metric-value">92%</div>
          </div>

          <div className="metric">
            <div className="metric-label">Cross-Reference Score</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '88%', background: 'var(--primary-purple)' }}>
                <div className="metric-shimmer"></div>
              </div>
            </div>
            <div className="metric-value">88%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundTruth;