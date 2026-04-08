import { useEffect, useRef } from 'react';
import './AnimationBackground.css';

const AnimationBackground = ({ variant = 'cyber', intensity = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawCyber = () => {
      // Grid lines
      ctx.strokeStyle = `rgba(0, 242, 254, ${0.05 * intensity})`;
      ctx.lineWidth = 1;
      
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.1 * intensity})`;
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.01 + time + i) * 50 * intensity +
            Math.cos(x * 0.02 + time * 1.5) * 30 * intensity;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawMatrix = () => {
      const chars = '01アイウエオカキクケコ';
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops = Array(Math.floor(columns)).fill(1);

      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * intensity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = `rgba(0, 242, 254, ${0.5 * intensity})`;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const drawNeon = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(10, 10, 15, ${0.8})`);
      gradient.addColorStop(1, `rgba(5, 5, 8, ${0.9})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating orbs
      for (let i = 0; i < 5 * intensity; i++) {
        ctx.beginPath();
        const x = canvas.width / 2 + Math.sin(time * 0.5 + i) * canvas.width * 0.3;
        const y = canvas.height / 2 + Math.cos(time * 0.3 + i) * canvas.height * 0.2;
        const radius = 50 * intensity;
        
        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        radialGradient.addColorStop(0, `rgba(0, 242, 254, ${0.1 * intensity})`);
        radialGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = radialGradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      time += 0.02;
      
      switch(variant) {
        case 'cyber':
          drawCyber();
          break;
        case 'matrix':
          drawMatrix();
          break;
        case 'neon':
          drawNeon();
          break;
        default:
          drawCyber();
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [variant, intensity]);

  return <canvas ref={canvasRef} className="animation-background" />;
};

export default AnimationBackground;