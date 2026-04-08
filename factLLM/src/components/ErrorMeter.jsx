const ErrorMeter = ({ percentage }) => {
  let level = 'low';
  if (percentage > 30 && percentage <= 70) level = 'medium';
  else if (percentage > 70) level = 'high';

  return (
    <div className="error-meter-section">
      <div className="meter-label">
        <span>Hallucination / Error Likelihood</span>
        <span><strong>{percentage}%</strong></span>
      </div>
      <div className="meter-bar-bg">
        <div 
          className={`meter-bar-fill fill-${level}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ErrorMeter;