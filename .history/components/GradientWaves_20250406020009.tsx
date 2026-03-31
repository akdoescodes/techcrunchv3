// GradientWaves.tsx

import React, { useEffect, useRef } from 'react';

const GradientWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        let time = 0;
        
        const gradientWave = () => {
          ctx.clearRect(0, 0, width, height);

          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, '#ff00ff');
          gradient.addColorStop(0.5, '#00ffff');
          gradient.addColorStop(1, '#ff00ff');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          
          // Draw the wave
          const amplitude = 50;
          const frequency = 0.02;
          const phaseShift = 0.02;
          
          ctx.moveTo(0, height / 2);
          for (let x = 0; x < width; x++) {
            const y = Math.sin(x * frequency + time) * amplitude + height / 2;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          // Apply fill
          ctx.fill();

          // Update time for animation effect
          time += phaseShift;

          // Call animation recursively
          requestAnimationFrame(gradientWave);
        };
        
        gradientWave();
      }
    }
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default GradientWaves;
