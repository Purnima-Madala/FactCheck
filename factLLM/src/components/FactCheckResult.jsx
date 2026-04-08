import ErrorMeter from './ErrorMeter';
import SourceList from './SourceList';

const FactCheckResult = ({ result }) => {
  if (!result) return null;

  const { query, verdict, errorPercentage, sources, explanation } = result;

  const getVerdictClass = () => {
    switch (verdict) {
      case 'true': return 'verdict-true';
      case 'false': return 'verdict-false';
      case 'misleading': return 'verdict-misleading';
      default: return 'verdict-unverified';
    }
  };

  return (
    <div className="result-card">
      <div className="claim-header">
        <div className="claim-text">“{query}”</div>
        <span className={`verdict-badge ${getVerdictClass()}`}>
          {verdict.toUpperCase()}
        </span>
      </div>

      <ErrorMeter percentage={errorPercentage} />

      <div className="explanation">
        <strong>Explanation:</strong> {explanation}
      </div>

      <SourceList sources={sources} />
    </div>
  );
};

export default FactCheckResult;