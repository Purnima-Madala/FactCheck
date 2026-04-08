import AIModelCard from './AIModelCard';

const ModelComparison = ({ modelResponses, modelScores }) => {
  if (!modelResponses || !modelScores) return null;

  return (
    <div className="models-grid">
      {Object.entries(modelResponses).map(([modelId, response]) => (
        <AIModelCard
          key={modelId}
          modelId={modelId}
          response={response}
          score={modelScores[modelId]}
        />
      ))}
    </div>
  );
};

export default ModelComparison;