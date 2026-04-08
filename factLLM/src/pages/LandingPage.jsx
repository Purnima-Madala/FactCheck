import { useNavigate } from 'react-router-dom';
import ComparisonGraph3D from '../components/Background3D/ComparisonGraph3D';

const LandingPage = () => {
  const navigate = useNavigate();

  const graphData = [
    { label: 'GPT-4', value: 8 },
    { label: 'Claude', value: 12 },
    { label: 'Gemini', value: 45 },
    { label: 'LLaMA', value: 28 },
  ];

  const featuredChecks = [
    {
      claim: "The moon is made of cheese",
      verdict: "false",
      models: [
        { name: "GPT-4", error: 2 },
        { name: "Claude", error: 3 },
        { name: "Gemini", error: 5 }
      ]
    },
    {
      claim: "Water boils at 100°C at sea level",
      verdict: "true",
      models: [
        { name: "GPT-4", error: 1 },
        { name: "Claude", error: 2 },
        { name: "Gemini", error: 3 }
      ]
    },
    {
      claim: "Vaccines cause autism",
      verdict: "false",
      models: [
        { name: "GPT-4", error: 1 },
        { name: "Claude", error: 3 },
        { name: "Gemini", error: 4 }
      ]
    },
    {
      claim: "Humans use only 10% of their brain",
      verdict: "false",
      models: [
        { name: "GPT-4", error: 4 },
        { name: "Claude", error: 6 },
        { name: "Gemini", error: 9 }
      ]
    }
  ];

  const handleTryNow = () => {
    navigate('/comparator');
  };

  const handleFeaturedClick = (claim) => {
    navigate('/comparator', { state: { presetQuery: claim } });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Detect AI
            <span className="gradient-text"> Hallucinations </span>
            Instantly
          </h1>
          <p>
            Compare responses from multiple AI models, identify hallucinations, 
            and verify claims with trusted sources. Make informed decisions with 
            our advanced fact-checking platform.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={handleTryNow}>
              Try Comparator Now →
            </button>
            <button className="btn btn-secondary">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <ComparisonGraph3D data={graphData} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>99.8%</h3>
            <p>Detection Accuracy</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Claims Verified</p>
          </div>
          <div className="stat-item">
            <h3>5+</h3>
            <p>AI Models Compared</p>
          </div>
        </div>
      </section>

      {/* Featured Checks */}
      <section className="featured-section">
        <h2 className="section-title">
          Featured <span className="highlight">Fact Checks</span>
        </h2>
        <p className="section-subtitle">See how different AI models perform on popular claims</p>
        <div className="featured-grid">
          {featuredChecks.map((item, idx) => (
            <div 
              key={idx} 
              className="featured-card"
              onClick={() => handleFeaturedClick(item.claim)}
            >
              <div className="featured-claim">"{item.claim}"</div>
              <span className={`featured-verdict ${
                item.verdict === 'true' ? 'verdict-true' : 'verdict-false'
              }`}>
                {item.verdict}
              </span>
              <div className="featured-models">
                {item.models.map((model, midx) => (
                  <div key={midx} className="model-badge">
                    <span>{model.name}</span>
                    <span className="model-score" style={{ 
                      color: model.error <= 5 ? 'var(--primary-emerald)' : 
                             model.error <= 15 ? 'var(--primary-amber)' : 'var(--primary-rose)'
                    }}>
                      {model.error}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It <span className="highlight">Works</span></h2>
        <p className="section-subtitle">Simple, transparent, and reliable</p>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Enter a Claim</h4>
            <p>Type any statement you want to verify</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>AI Models Respond</h4>
            <p>Multiple AI models provide their analysis</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Detect Hallucinations</h4>
            <p>Our system identifies inconsistencies and errors</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Get Ground Truth</h4>
            <p>See verified facts with trusted sources</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Detect AI Hallucinations?</h2>
        <p>Start comparing AI models and verify claims with confidence</p>
        <button className="btn btn-primary btn-large" onClick={handleTryNow}>
          Launch Comparator →
        </button>
      </section>
    </div>
  );
};

export default LandingPage;