import { useState, useEffect } from 'react';
import './AnimatedCard.css';

const AnimatedCard = ({ children, delay = 0, type = 'fadeInUp', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'card-hidden';
    switch(type) {
      case 'fadeInUp': return 'animate-fade-in-up';
      case 'fadeInDown': return 'animate-fade-in-down';
      case 'slideInLeft': return 'animate-slide-in-left';
      case 'slideInRight': return 'animate-slide-in-right';
      case 'scaleIn': return 'animate-scale-in';
      case 'rotateIn': return 'animate-rotate-in';
      default: return 'animate-fade-in-up';
    }
  };

  return (
    <div className={`animated-card ${getAnimationClass()} ${className}`}>
      <div className="card-shine"></div>
      <div className="card-content-wrapper">
        {children}
      </div>
    </div>
  );
};

export const HoverCard = ({ children, className = '' }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <div
      className={`hover-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        '--mouse-x': `${coords.x}%`,
        '--mouse-y': `${coords.y}%`
      }}
    >
      {isHovering && <div className="hover-glow"></div>}
      {children}
    </div>
  );
};

export const GlowCard = ({ children, className = '' }) => {
  return (
    <div className={`glow-card ${className}`}>
      <div className="glow-border"></div>
      <div className="glow-content">{children}</div>
    </div>
  );
};

export default AnimatedCard;