const SourceList = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return (
      <div className="sources-section">
        <h3 className="sources-title">📚 Sources</h3>
        <p style={{ color: '#6b7280' }}>No sources available for this claim.</p>
      </div>
    );
  }

  return (
    <div className="sources-section">
      <h3 className="sources-title">📚 Verified Sources ({sources.length})</h3>
      {sources.map((source, idx) => (
        <div key={idx} className="source-item">
          <a 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="source-title"
          >
            {source.title}
            <span style={{ fontSize: '0.8rem' }}>↗</span>
          </a>
          <div className="source-excerpt">{source.excerpt}</div>
          {source.relevance && (
            <div className="source-relevance">
              Relevance: {Math.round(source.relevance * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SourceList;