import { useState, useEffect } from 'react';
import './ErrorMeter.css';

const ErrorMeter = ({ errors, title = "Hallucination Risk Analysis" }) => {
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    const animations = {};
    Object.keys(errors).forEach(model => {
      animations[model] = 0;
      const interval = setInterval(() => {
        setAnimatedValues(prev => {
          const current = prev[model] || 0;
          if (current < errors[model]) {
            return { ...prev, [model]: Math.min(current + 1, errors[model]) };
          }
          clearInterval(interval);
          return prev;
        });
      }, 20);
    });
    return () => Object.values(interval).forEach(clearInterval);
  }, [errors]);

  const getRiskLevel = (error) => {
    if (error <= 5) return { text: 'Low', color: 'var(--success-green)', icon: '🟢' };
    if (error <= 15) return { text: 'Medium', color: 'var(--warning-orange)', icon: '🟡' };
    return { text: 'High', color: 'var(--error-red)', icon: '🔴' };
  };

  const maxError = Math.max(...Object.values(errors), 1);

  return (
    <div className="error-meter">
      <div className="error-meter-header">
        <h3>{title}</h3>
        <div className="error-meter-stats">
          <span>Average Error: {(Object.values(errors).reduce((a,b) => a+b, 0) / Object.values(errors).length).toFixed(1)}%</span>
        </div>
      </div>

      <div className="error-bars">
        {Object.entries(errors).map(([model, error]) => {
          const risk = getRiskLevel(error);
          return (
            <div key={model} className="error-bar-item">
              <div className="error-bar-label">
                <span className="model-name">{model}</span>
                <span className="error-percent" style={{ color: risk.color }}>
                  {risk.icon} {animatedValues[model] || 0}%
                </span>
              </div>
              <div className="error-bar-container">
                <div 
                  className="error-bar-fill"
                  style={{ 
                    width: `${(error / maxError) * 100}%`,
                    background: `linear-gradient(90deg, ${risk.color}, ${risk.color}cc)`
                  }}
                >
                  <div className="error-shimmer"></div>
                </div>
              </div>
              <div className="error-risk" style={{ color: risk.color }}>
                {risk.text} Risk
              </div>
            </div>
          );
        })}
      </div>

      <div className="error-meter-footer">
        <div className="risk-indicator">
          <div className="risk-dot low"></div>
          <span>Low Risk (0-5%)</span>
        </div>
        <div className="risk-indicator">
          <div className="risk-dot medium"></div>
          <span>Medium Risk (6-15%)</span>
        </div>
        <div className="risk-indicator">
          <div className="risk-dot high"></div>
          <span>High Risk (16%+)</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorMeter;