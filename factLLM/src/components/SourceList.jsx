import { useState } from 'react';
import './SourceList.css';

const SourceList = ({ sources }) => {
  const [filter, setFilter] = useState('all');
  const [expandedSource, setExpandedSource] = useState(null);

  const getReliabilityColor = (reliability) => {
    switch(reliability) {
      case 'high': return 'var(--success-green)';
      case 'medium': return 'var(--warning-orange)';
      case 'low': return 'var(--error-red)';
      default: return 'var(--text-muted)';
    }
  };

  const filteredSources = sources.filter(source => {
    if (filter === 'all') return true;
    return source.reliability === filter;
  });

  return (
    <div className="source-list">
      <div className="source-list-header">
        <h3>Verified Sources</h3>
        <div className="source-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({sources.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Reliability
          </button>
          <button 
            className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium Reliability
          </button>
        </div>
      </div>

      <div className="sources-grid">
        {filteredSources.map((source, idx) => (
          <div 
            key={idx} 
            className={`source-card ${expandedSource === idx ? 'expanded' : ''}`}
            style={{ '--delay': `${idx * 0.1}s` }}
          >
            <div className="source-card-header">
              <div className="source-type-icon">
                {source.type === 'academic' ? '🎓' : source.type === 'news' ? '📰' : '🔗'}
              </div>
              <div className="source-info">
                <div className="source-title">{source.title}</div>
                <div className="source-meta">
                  <span className="source-domain">{source.domain}</span>
                  <span className="source-date">{source.date}</span>
                </div>
              </div>
              <div 
                className="source-reliability"
                style={{ background: getReliabilityColor(source.reliability) }}
              >
                {source.reliability}
              </div>
            </div>

            <div className="source-card-body">
              <p className="source-excerpt">{source.excerpt}</p>
              
              <div className="source-stats">
                <div className="stat">
                  <span className="stat-label">Citations</span>
                  <span className="stat-value">{source.citations || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Cross-references</span>
                  <span className="stat-value">{source.crossReferences || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Verification Score</span>
                  <span className="stat-value">{source.verificationScore || 0}%</span>
                </div>
              </div>

              <button 
                className="expand-source-btn"
                onClick={() => setExpandedSource(expandedSource === idx ? null : idx)}
              >
                {expandedSource === idx ? 'Show Less' : 'Show More'}
                <svg className={`expand-icon ${expandedSource === idx ? 'rotated' : ''}`} viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>

              {expandedSource === idx && (
                <div className="source-details animate-slide-down">
                  <div className="detail-section">
                    <h4>Key Findings</h4>
                    <ul>
                      {source.keyFindings?.map((finding, i) => (
                        <li key={i}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>Methodology</h4>
                    <p>{source.methodology}</p>
                  </div>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="source-link"
                  >
                    Read Full Article →
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceList;