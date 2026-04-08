import { useEffect, useRef } from 'react';
import './Background3D.css';

const Background3D = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'bg-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.opacity = Math.random() * 0.5;
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 15000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-3d" ref={containerRef}>
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="bg-content">{children}</div>
    </div>
  );
};

export default Background3D;