import { useEffect, useRef } from 'react';
import './ComparisonGraph3D.css';

const ComparisonGraph3D = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawBar = (x, y, width, height, color, label, value, index, total) => {
      const perspective = 0.8;
      const topY = y - height * perspective;
      
      // Front face
      ctx.fillStyle = color;
      ctx.fillRect(x, y - height, width, height);
      
      // Top face (3D effect)
      ctx.beginPath();
      ctx.moveTo(x, y - height);
      ctx.lineTo(x + width * 0.2, y - height - height * 0.2);
      ctx.lineTo(x + width * 0.8, y - height - height * 0.2);
      ctx.lineTo(x + width, y - height);
      ctx.fill();
      
      // Right face
      ctx.fillStyle = `${color}cc`;
      ctx.beginPath();
      ctx.moveTo(x + width, y - height);
      ctx.lineTo(x + width * 0.8, y - height - height * 0.2);
      ctx.lineTo(x + width * 0.8, y - height * 0.2);
      ctx.lineTo(x + width, y);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + width / 2, y + 20);
      
      // Value
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`${value}%`, x + width / 2, y - height - 10);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / (data.length + 1);
      const maxHeight = canvas.height * 0.6;
      const startX = barWidth;
      const baseY = canvas.height - 50;

      data.forEach((item, index) => {
        const height = (item.value / 100) * maxHeight;
        const x = startX + index * barWidth;
        
        // Color based on value
        let color;
        if (item.value <= 20) color = '#00ff88';
        else if (item.value <= 40) color = '#00f2fe';
        else if (item.value <= 60) color = '#ff9f43';
        else color = '#ff3366';
        
        drawBar(x, baseY, barWidth - 10, height, color, item.label, item.value, index, data.length);
      });

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = baseY - (i / 4) * maxHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`${i * 25}%`, 5, y - 2);
      }

      rotation += 0.005;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [data]);

  return <canvas ref={canvasRef} className="comparison-graph-3d" />;
};

export default ComparisonGraph3D;