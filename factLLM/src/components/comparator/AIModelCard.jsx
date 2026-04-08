import { useState } from 'react';
import ModelCard from "./ModelCard";

const ModelCard = ({ model, response, score, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 90) return '#00ff88';
    if (score >= 70) return '#00f2fe';
    if (score >= 50) return '#ff9f43';
    return '#ff3366';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🎯';
    if (score >= 70) return '👍';
    if (score >= 50) return '⚠️';
    return '❌';
  };

  const modelColors = {
    'GPT-4': '#10b981',
    'Claude': '#3b82f6',
    'Gemini': '#8b5cf6',
    'LLaMA': '#f59e0b'
  };

  return (
    <div 
      className={`model-card ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className="model-card-glow"></div>
      
      <div className="model-card-header">
        <div className="model-icon" style={{ background: modelColors[model] || '#6b7280' }}>
          <span className="model-emoji">🤖</span>
        </div>
        <div className="model-info">
          <h3 className="model-name">{model}</h3>
          <div className="model-score">
            <div className="score-ring">
              <svg viewBox="0 0 36 36" className="score-svg">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getScoreColor(score)}
                  strokeWidth="3"
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  className="score-path"
                />
              </svg>
              <span className="score-value">{score}%</span>
            </div>
          </div>
        </div>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg className={`expand-icon ${isExpanded ? 'rotated' : ''}`} viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
      </div>

      <div className="model-card-body">
        <div className="response-content">
          <div className="response-badge">
            <span className="badge-icon">💬</span>
            Response
          </div>
          <p className="response-text">{response}</p>
        </div>

        <div className="confidence-section">
          <div className="confidence-header">
            <span>Confidence Score</span>
            <span className="confidence-percent">{score}%</span>
          </div>
          <div className="confidence-bar-container">
            <div 
              className="confidence-bar-fill"
              style={{ 
                width: `${score}%`,
                background: `linear-gradient(90deg, ${getScoreColor(score)}, ${getScoreColor(score)}cc)`
              }}
            >
              <div className="confidence-shimmer"></div>
            </div>
          </div>
        </div>

        <div className="model-actions">
          <button className="action-btn analyze-btn">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Deep Analysis
          </button>
          <button className="action-btn share-btn">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v12" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="model-card-footer animate-slide-down">
          <div className="analysis-details">
            <div className="detail-item">
              <span className="detail-label">Hallucination Risk:</span>
              <span className={`detail-value ${score < 70 ? 'high' : score < 85 ? 'medium' : 'low'}`}>
                {score < 70 ? 'High' : score < 85 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Response Time:</span>
              <span className="detail-value">{Math.floor(Math.random() * 500 + 200)}ms</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Token Usage:</span>
              <span className="detail-value">{Math.floor(response.length / 4)} tokens</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCard;