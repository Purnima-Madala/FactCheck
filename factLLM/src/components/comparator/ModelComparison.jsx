import { useState, useEffect } from 'react';
import ModelCard from './ModelCard';
import './ModelComparison.css';

const ModelComparison = ({ modelResponses, modelScores }) => {
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const [sortedModels, setSortedModels] = useState([]);

  useEffect(() => {
    let models = Object.keys(modelResponses).map(model => ({
      name: model,
      response: modelResponses[model],
      score: modelScores[model]
    }));

    if (sortBy === 'score') {
      models.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'name') {
      models.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filterBy !== 'all') {
      models = models.filter(model => {
        if (filterBy === 'high') return model.score >= 85;
        if (filterBy === 'medium') return model.score >= 70 && model.score < 85;
        if (filterBy === 'low') return model.score < 70;
        return true;
      });
    }

    setSortedModels(models);
  }, [modelResponses, modelScores, sortBy, filterBy]);

  const getAverageScore = () => {
    const scores = Object.values(modelScores);
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  return (
    <div className="model-comparison">
      <div className="comparison-controls">
        <div className="controls-left">
          <div className="stat-badge">
            <span className="stat-label">Models Analyzed</span>
            <span className="stat-value">{Object.keys(modelResponses).length}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Average Score</span>
            <span className="stat-value" style={{ color: 'var(--primary-neon)' }}>
              {getAverageScore()}%
            </span>
          </div>
        </div>

        <div className="controls-right">
          <div className="sort-control">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Confidence Score</option>
              <option value="name">Model Name</option>
            </select>
          </div>

          <div className="filter-control">
            <label>Filter:</label>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">All Models</option>
              <option value="high">High Confidence (85%+)</option>
              <option value="medium">Medium Confidence (70-84%)</option>
              <option value="low">Low Confidence (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="models-list">
        {sortedModels.map((model, idx) => (
          <ModelCard
            key={model.name}
            model={model.name}
            response={model.response}
            score={model.score}
            index={idx}
          />
        ))}
      </div>

      <div className="comparison-insights">
        <div className="insight-card">
          <div className="insight-icon">🎯</div>
          <div className="insight-content">
            <h4>Top Performer</h4>
            <p>{sortedModels[0]?.name} with {sortedModels[0]?.score}% confidence</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">⚠️</div>
          <div className="insight-content">
            <h4>Hallucination Risk</h4>
            <p>{sortedModels[sortedModels.length - 1]?.name} shows highest hallucination potential</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <h4>Consensus Level</h4>
            <p>{getAverageScore()}% average agreement across models</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;