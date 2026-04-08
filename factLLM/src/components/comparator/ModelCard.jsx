import { useState } from 'react';
import './ModelCard.css';

const ModelCard = ({ model, response, score, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 90) return '#00ff88';
    if (score >= 70) return '#00f2fe';
    if (score >= 50) return '#ff9f43';
    return '#ff3366';
  };

  return (
    <div className={`model-card ${isExpanded ? 'expanded' : ''}`} style={{ '--delay': `${index * 0.08}s` }}>
      <div className="model-card-glow"></div>
      <div className="model-card-header">
        <div className="model-badge" style={{ background: getScoreColor(score) }}>
          {model}
        </div>
        <span className="model-score-label">Confidence</span>
        <span className="model-score-value">{score}%</span>
        <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide' : 'Details'}
        </button>
      </div>

      <div className="model-card-body">
        <p className="model-response">{response}</p>
      </div>

      <div className="confidence-track">
        <div className="confidence-fill" style={{ width: `${score}%`, background: getScoreColor(score) }} />
      </div>

      {isExpanded && (
        <div className="model-card-details">
          <div className="detail-row">
            <span>Hallucination Risk</span>
            <strong>{score < 70 ? 'High' : score < 85 ? 'Medium' : 'Low'}</strong>
          </div>
          <div className="detail-row">
            <span>Token Estimate</span>
            <strong>{Math.max(20, Math.round(response.length / 4))} tokens</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCard;
