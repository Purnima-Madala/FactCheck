import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ComparisonGraph3D from '../components/Background3D/ComparisonGraph3D';
import './LandingPage.css'; // We'll create this

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const heroRef = useRef(null);

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
      confidence: 94,
      models: [
        { name: "GPT-4", error: 2, color: "#10b981" },
        { name: "Claude", error: 3, color: "#3b82f6" },
        { name: "Gemini", error: 5, color: "#8b5cf6" }
      ]
    },
    {
      claim: "Water boils at 100°C at sea level",
      verdict: "true",
      confidence: 99,
      models: [
        { name: "GPT-4", error: 1, color: "#10b981" },
        { name: "Claude", error: 2, color: "#3b82f6" },
        { name: "Gemini", error: 3, color: "#8b5cf6" }
      ]
    },
    {
      claim: "Vaccines cause autism",
      verdict: "false",
      confidence: 98,
      models: [
        { name: "GPT-4", error: 1, color: "#10b981" },
        { name: "Claude", error: 3, color: "#3b82f6" },
        { name: "Gemini", error: 4, color: "#8b5cf6" }
      ]
    },
    {
      claim: "Humans use only 10% of their brain",
      verdict: "false",
      confidence: 87,
      models: [
        { name: "GPT-4", error: 4, color: "#10b981" },
        { name: "Claude", error: 6, color: "#f59e0b" },
        { name: "Gemini", error: 9, color: "#ef4444" }
      ]
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTryNow = () => {
    navigate('/comparator');
  };

  const handleFeaturedClick = (claim) => {
    navigate('/comparator', { state: { presetQuery: claim } });
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="cyber-bg">
        <div className="grid-lines"></div>
        <div className="glow-orb" style={{ 
          left: `${mousePosition.x}px`, 
          top: `${mousePosition.y}px` 
        }}></div>
        <div className="noise-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            AI HALLUCINATION DETECTOR v2.0
          </div>
          
          <h1 className="glitch-text" data-text="Detect AI Hallucinations">
            Detect AI
            <span className="gradient-text"> Hallucinations </span>
            Instantly
          </h1>
          
          <p className="hero-description">
            Compare responses from multiple AI models, identify hallucinations, 
            and verify claims with trusted sources. Make informed decisions with 
            our advanced fact-checking platform.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary-cyber" onClick={handleTryNow}>
              <span className="btn-content">
                Launch Comparator
                <svg className="btn-icon" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              <span className="btn-glow"></span>
            </button>
            
            <button className="btn-secondary-cyber">
              <svg className="play-icon" viewBox="0 0 24 24">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
              Watch Demo
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">99.8%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Claims Verified</div>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <div className="stat-value">5+</div>
              <div className="stat-label">AI Models</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-container">
            <ComparisonGraph3D data={graphData} />
            <div className="scan-line"></div>
          </div>
        </div>
      </section>

      {/* Featured Checks with Hologram Effect */}
      <section className="featured-section">
        <div className="section-header">
          <div className="section-tag">REAL-TIME ANALYSIS</div>
          <h2 className="section-title">
            Featured <span className="highlight">Fact Checks</span>
            <div className="title-underline"></div>
          </h2>
          <p className="section-subtitle">See how different AI models perform on popular claims</p>
        </div>

        <div className="featured-grid">
          {featuredChecks.map((item, idx) => (
            <div 
              key={idx} 
              className={`featured-card ${activeCard === idx ? 'active' : ''}`}
              onClick={() => handleFeaturedClick(item.claim)}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ '--delay': `${idx * 0.1}s` }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="claim-header">
                  <span className="claim-quote">"</span>
                  <div className="claim-text">{item.claim}</div>
                  <span className="claim-quote">"</span>
                </div>
                
                <div className="verdict-section">
                  <div className={`verdict-badge ${item.verdict}`}>
                    <span className="verdict-dot"></span>
                    {item.verdict.toUpperCase()}
                  </div>
                  <div className="confidence-meter">
                    <div className="confidence-label">Confidence</div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${item.confidence}%` }}
                      >
                        <span className="confidence-value">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="models-section">
                  <div className="models-title">Model Analysis</div>
                  <div className="models-list">
                    {item.models.map((model, midx) => (
                      <div key={midx} className="model-item">
                        <div className="model-info">
                          <div className="model-dot" style={{ background: model.color }}></div>
                          <span className="model-name">{model.name}</span>
                        </div>
                        <div className="model-error">
                          <div className="error-chart">
                            <div 
                              className="error-bar"
                              style={{ 
                                width: `${model.error}%`,
                                background: model.error <= 5 ? '#10b981' : 
                                         model.error <= 15 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                          <span className="error-value">{model.error}% error</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <span className="analyze-link">
                    Analyze this claim
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Futuristic Timeline */}
      <section className="process-section">
        <div className="section-header">
          <div className="section-tag">THE PROCESS</div>
          <h2 className="section-title">
            How It <span className="highlight">Works</span>
            <div className="title-underline"></div>
          </h2>
        </div>

        <div className="process-timeline">
          {[
            { step: "01", title: "Enter Claim", desc: "Type any statement you want to verify", icon: "⌨️" },
            { step: "02", title: "AI Analysis", desc: "Multiple AI models provide responses", icon: "🤖" },
            { step: "03", title: "Hallucination Detection", desc: "Identify inconsistencies in real-time", icon: "🔍" },
            { step: "04", title: "Ground Truth", desc: "Verified facts with trusted sources", icon: "✓" }
          ].map((item, idx) => (
            <div key={idx} className="process-step">
              <div className="step-connector">
                <div className="step-circle">
                  <span className="step-number">{item.step}</span>
                  <div className="pulse-ring"></div>
                </div>
                {idx < 3 && <div className="connector-line"></div>}
              </div>
              <div className="step-content">
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section with Particle Effect */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="particle-field">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{ 
                '--duration': `${Math.random() * 10 + 5}s`,
                '--delay': `${Math.random() * 5}s`,
                '--x': `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="cta-content">
          <div className="cta-badge">READY TO START?</div>
          <h2>Ready to Detect<br />AI Hallucinations?</h2>
          <p>Start comparing AI models and verify claims with confidence</p>
          <button className="btn-primary-cyber btn-large" onClick={handleTryNow}>
            <span className="btn-content">
              Launch Comparator Now
              <svg className="btn-icon" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span className="btn-glow"></span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;