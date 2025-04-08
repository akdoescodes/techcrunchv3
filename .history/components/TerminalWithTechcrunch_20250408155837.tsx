"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  target: { x: number; y: number };
  hasGlow: boolean;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  delay: number;
  wobble: { x: number; y: number; speed: number };
};

class Ring {
  origin: Vector3;
  radius: number;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  animationId: number | null = null;
  isAnimating: boolean = false;
  currentProgress: number = 0;
  lastTimestamp: number = 0;

  constructor(origin: Vector3, radius: number, count: number, container: HTMLDivElement) {
    this.origin = origin;
    this.radius = radius;
    this.count = count;
    this.container = container;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);

      const finalX = this.origin.x + x;
      const finalY = this.origin.y + y;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-1000 ease-out";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.opacity = "0";
      span.style.willChange = "transform, opacity";
      
      // Size variation
      const size = 0.5 + Math.random() * 1.5;
      span.style.fontSize = `${size * 0.75}rem`;
      
      // Glow effects with more variation
      const hasGlow = Math.random() < 0.3;
      const hue = 60 + Math.random() * 40;
      const saturation = 80 + Math.random() * 20;
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, 70%)`;
        span.style.textShadow = `0 0 ${8 + Math.random() * 8}px hsl(${hue}, ${saturation}%, 70%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${50 + Math.random() * 20}%)`;
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        target: { x: finalX, y: finalY },
        hasGlow,
        angle,
        radius: this.radius,
        size,
        speed: 0.8 + Math.random() * 0.4,
        delay: Math.random() * 0.5,
        wobble: {
          x: 2 + Math.random() * 8,
          y: 2 + Math.random() * 8,
          speed: 0.5 + Math.random() * 1.5
        }
      });
    }
  }

  animateToPositions() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentProgress = 0;
    this.lastTimestamp = performance.now();
    
    const animate = (timestamp: number) => { i) => {
        if (!p.el) return;
        
        // Apply individual delay
        const progress = Math.max(0, Math.min(1, (this.currentProgress - p.delay) / (1 - p.delay));
        
        if (progress <= 0) return;
        
        // Cubic easing out
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // Calculate current position with easing
        const currentX = p.original.x + (p.target.x - p.original.x) * easedProgress;
        const currentY = p.original.y + (p.target.y - p.original.y) * easedProgress;
        
        // Add wobble effect
        const wobbleX = Math.sin(timestamp * 0.001 * p.wobble.speed) * p.wobble.x * (1 - easedProgress);
        const wobbleY = Math.cos(timestamp * 0.001 * p.wobble.speed * 0.7) * p.wobble.y * (1 - easedProgress);
        
        p.el.style.transform = `translate(${wobbleX}px, ${wobbleY}px) scale(${0.8 + easedProgress * 0.4})`;
        p.el.style.left = `${currentX}px`;
        p.el.style.top = `${currentY}px`;
        p.el.style.opacity = `${easedProgress * 0.8}`;
      });
      
      if (this.currentProgress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  resetToOriginalPositions() {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animationId!);
      this.isAnimating = false;
    }
    
    this.particles.forEach(p => {
      if (!p.el) return;
      
      p.el.style.transition = `all ${0.5 + Math.random() * 1}s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out`;
      p.el.style.left = `${p.original.x}px`;
      p.el.style.top = `${p.origina
      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      
      this.currentProgress = Math.min(this.currentProgress + (delta / 1000) * 0.5, 1);
      
      this.particles.forEach((p,l.y}px`;
      p.el.style.opacity = "0";
      p.el.style.transform = "none";
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringsRef = useRef<Ring[]>([]);

  const ringConfigs = [
    { radius: 460, count: 120, speed: 1.2 },
    { radius: 300, count: 90, speed: 1.0 },
    { radius: 550, count: 70, speed: 0.8 },
    { radius: 460, count: 80, speed: 1.1 },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 15px currentColor, 0 0 20px currentColor; }
      }
      @keyframes glowPulseInside {
        0% { opacity: 0.6; text-shadow: 0 0 3px currentColor; }
        100% { opacity: 0.9; text-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
      }
      @keyframes floatSoft {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];

    // Create inside particles with more variation
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      // Size variation
      const size = 0.5 + Math.random() * 1.5;
      span.style.fontSize = `${size * 0.75}rem`;
      
      // Enhanced glow effects
      const hasGlow = Math.random() < 0.3;
      const hue = 260 + Math.random() * 60;
      const saturation = 80 + Math.random() * 20;
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, 75%)`;
        span.style.textShadow = `0 0 ${6 + Math.random() * 6}px hsl(${hue}, ${saturation}%, 75%)`;
        span.style.animation += `, glowPulseInside ${4 + Math.random() * 5}s infinite alternate`;
        span.style.opacity = '0.7';
      } else {
        span.style.color = `hsl(${hue}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }

      // Random z-index for depth
      span.style.zIndex = `${Math.floor(Math.random() * 10)}`;

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.count, container);
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    });

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(r => r.destroy());
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isHovered) {
      ringsRef.current.forEach(ring => ring.animateToPositions());
      if (terminalRef.current) {
        terminalRef.current.style.transform = "translateZ(50px) scale(1.02)";
        terminalRef.current.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    } else {
      ringsRef.current.forEach(ring => ring.resetToOriginalPositions());
      if (terminalRef.current) {
        terminalRef.current.style.transform = "none";
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={terminalRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-all duration-500 hover:shadow-[0_0_20px_#a855f7]"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
      >
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-all duration-500"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isHovered ? "translateZ(100px) scale(1.05)" : "none",
            textShadow: isHovered ? "0 0 20px rgba(168, 85, 247, 0.5)" : "none"
          }}
        >
          TECHCRUNCH
        </h1>

        <div className="text-left w-full space-y-1 z-10">
          <p>
            <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300"> $ find events --category="tech" --sort="date"</span>
          </p>
          <p className="text-pink-500 animate-pulse">Crunching data...</p>
          <p className="text-green-600 font-semibold">Found 6 mind-blowing tech events!</p>
        </div>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-all duration-500"
          style={{ 
            transform: isHovered ? "translateZ(-100px) scale(1.2)" : "none",
            opacity: isHovered ? 0.4 : 0.3
          }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-all duration-500"
          style={{ 
            transform: isHovered ? "translateZ(100px) scale(1.5)" : "none",
            opacity: isHovered ? 0.3 : 0.2
          }}
        />
      </div>
    </div>
  );
}