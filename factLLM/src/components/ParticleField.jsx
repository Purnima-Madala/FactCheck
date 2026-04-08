import { useEffect, useRef } from 'react';
import './ParticleField.css';

const ParticleField = ({ count = 100, color = '#00f2fe', interactive = true }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (interactive) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 100;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
      }
    }

    particles.current = Array(count).fill().map(() => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      
      particles.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      ctx.beginPath();
      ctx.strokeStyle = `${color}20`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, color, interactive]);

  return <canvas ref={canvasRef} className="particle-field" />;
};

export default ParticleField;