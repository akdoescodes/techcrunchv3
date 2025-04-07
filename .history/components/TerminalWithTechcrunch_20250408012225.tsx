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
  turbo: { x: number; y: number };
  hasGlow: boolean;
  angle: number;
  radius: number;
};

class Ring {
  origin: Vector3;
  radius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  rotationSpeed: number;
  currentRotation: number = 0;
  animationId: number | null = null;
  lastFrameTime: number = 0;

  constructor(origin: Vector3, radius: number, rotation: Vector3, count: number, container: HTMLDivElement, rotationSpeed: number = 0.2) {
    this.origin = origin;
    this.radius = radius;
    this.rotation = {
      x: (rotation.x * Math.PI) / 180,
      y: (rotation.y * Math.PI) / 180,
      z: (rotation.z * Math.PI) / 180,
    };
    this.count = count;
    this.container = container;
    this.rotationSpeed = rotationSpeed * 2; // Double the speed
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      const { x, y } = this.calculatePosition(angle);
      
      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300 ease-out"; // Smoother transition
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.willChange = "transform, opacity"; // Optimize for animations
      
      const hasGlow = Math.random() < 0.3; // More glow particles
      if (hasGlow) {
        span.style.color = `hsl(${60 + Math.random() * 40}, 100%, 75%)`;
        span.style.textShadow = `0 0 8px currentColor`;
        span.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate ease-in-out`;
      } else {
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 65%)`;
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: this.origin.x + x, y: this.origin.y + y },
        hasGlow,
        angle,
        radius: this.radius
      });
    }
  }

  calculatePosition(angle: number): { x: number, y: number } {
    let x = this.radius * Math.cos(angle);
    let y = this.radius * Math.sin(angle);
    let z = 0;

    const { x: rx, y: ry, z: rz } = this.rotation;
    let y1 = y * Math.cos(rx) - z * Math.sin(rx);
    let z1 = y * Math.sin(rx) + z * Math.cos(rx);
    let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

    return { x: x3, y: y3 };
  }

  startRotation() {
    if (this.animationId) return;
    
    this.lastFrameTime = performance.now();
    
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      
      // Frame-rate independent rotation
      this.currentRotation += this.rotationSpeed * (deltaTime / 16);
      this.updateParticlePositions();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  stopRotation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  updateParticlePositions() {
    this.particles.forEach(p => {
      if (!p.el) return;
      
      const newAngle = p.angle + this.currentRotation;
      const { x, y } = this.calculatePosition(newAngle);
      
      p.turbo = { 
        x: this.origin.x + x, 
        y: this.origin.y + y 
      };
      
      // Direct assignment for smoother animation
      p.el.style.transform = `translate3d(${p.turbo.x}px, ${p.turbo.y}px, 0)`;
    });
  }

  destroy() {
    this.stopRotation();
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringsRef = useRef<Ring[]>([]);

  // Faster rotation speeds and optimized particle counts
  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 80, speed: 0.02 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 60, speed: 0.03 },
    { radius: 550, rotation: { x: 90, y: 180, z: 0 }, count: 50, speed: 0.015 },
    { radius: 460, rotation: { x: 84, y: 0, z: -30 }, count: 50, speed: 0.025 },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0%, 100% { opacity: 0.8; text-shadow: 0 0 10px currentColor; }
        50% { opacity: 1; text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      }
      @keyframes glowPulseInside {
        0%, 100% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        50% { opacity: 0.9; text-shadow: 0 0 15px currentColor, 0 0 20px currentColor; }
      }
      @keyframes floatSoft {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
      }
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup
    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    insideParticlesRef.current = [];
    ringsRef.current = [];

    // Create inside particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animation = `floatSoft ${4 + Math.random() * 8}s infinite ease-in-out`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.willChange = "transform";
      
      const hasGlow = Math.random() < 0.3;
      if (hasGlow) {
        span.style.color = `hsl(${260 + Math.random() * 60}, 100%, 80%)`;
        span.style.textShadow = `0 0 8px hsl(${260 + Math.random() * 60}, 100%, 80%)`;
        span.style.animation += `, glowPulseInside ${2 + Math.random() * 3}s infinite ease-in-out`;
        span.style.opacity = '0.8';
      } else {
        span.style.color = `hsl(${260 + Math.random() * 60}, 80%, 70%)`;
        span.style.opacity = `${0.5 + Math.random() * 0.4}`;
      }

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    // Calculate center point for rings
    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    // Create rings
    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.rotation, cfg.count, container, cfg.speed);
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
    // Toggle rotation based on turbo mode
    ringsRef.current.forEach(ring => {
      if (isTurboMode) {
        ring.startRotation();
      } else {
        ring.stopRotation();
      }
    });

    // Update particle states
    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        el.style.transition = isTurboMode 
          ? "transform 0.3s ease-out, opacity 0.3s ease-out" 
          : "transform 0.5s ease-out, opacity 0.5s ease-out";
        
        if (!isTurboMode) {
          el.style.transform = `translate3d(${p.original.x}px, ${p.original.y}px, 0)`;
        }
        
        el.style.opacity = isTurboMode ? "0.9" : "0.6";
        
        if (p.hasGlow) {
          el.style.animation = isTurboMode 
            ? `glowPulse ${1 + Math.random()}s infinite ease-in-out` 
            : `glowPulse ${2 + Math.random() * 2}s infinite ease-in-out`;
          el.style.textShadow = isTurboMode 
            ? `0 0 20px currentColor, 0 0 30px currentColor` 
            : `0 0 10px currentColor`;
        }
      });
    });

    // Terminal 3D effect
    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode 
        ? "translateZ(50px) scale(1.02)" 
        : "translateZ(0) scale(1)";
      terminalRef.current.style.transition = "transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)";
    }
    
    return () => ringsRef.current.forEach(ring => ring.stopRotation());
  }, [isTurboMode]);

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
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10"
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px) scale(1.05)" : "translateZ(0) scale(1)",
            transition: "transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)",
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

        <button
          onClick={() => setIsTurboMode(!isTurboMode)}
          className={`absolute right-4 bottom-4 text-xs py-1 px-2 rounded border ${
            isTurboMode
              ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_10px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-300 z-20`}
        >
          {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
        </button>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-500"
          style={{ 
            transform: isTurboMode ? "translateZ(-100px) scale(1.2)" : "translateZ(0) scale(1)",
            transition: "transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)"
          }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-500"
          style={{ 
            transform: isTurboMode ? "translateZ(100px) scale(1.5)" : "translateZ(0) scale(1)",
            transition: "transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)"
          }}
        />
      </div>
    </div>
  );
}