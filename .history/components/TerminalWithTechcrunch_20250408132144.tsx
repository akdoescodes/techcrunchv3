"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 80;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  turbo: { x: number; y: number };
  hasGlow: boolean;
  angle: number;
  radius: number;
  baseRadius: number;
  speed: number;
  opacity: number;
};

// Enhanced center configuration
const CENTER_CONFIG = {
  useFixed: false,
  offsetX: 0,
  offsetY: -10 // Slightly higher than center
};

class Ring {
  origin: Vector3;
  radius: number;
  baseRadius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  rotationSpeed: number;
  currentRotation: number = 0;

  constructor(origin: Vector3, radius: number, rotation: Vector3, count: number, container: HTMLDivElement) {
    this.origin = origin;
    this.radius = radius;
    this.baseRadius = radius;
    this.rotation = {
      x: (rotation.x * Math.PI) / 180,
      y: (rotation.y * Math.PI) / 180,
      z: (rotation.z * Math.PI) / 180,
    };
    this.count = count;
    this.container = container;
    this.rotationSpeed = 0.002 + Math.random() * 0.003;
  }

  updateOrigin(newOrigin: Vector3) {
    this.origin = newOrigin;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
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

      const finalX = this.origin.x + x3;
      const finalY = this.origin.y + y3;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      const hasGlow = Math.random() < 0.3;
      const hue = 260 + Math.random() * 60;
      const saturation = 90;
      const lightness = 60 + Math.random() * 20;
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        span.style.textShadow = `0 0 ${8 + Math.random() * 8}px hsl(${hue}, ${saturation}%, ${lightness}%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;
      span.style.opacity = "0";
      span.style.transition = "opacity 1.5s ease, transform 1.5s ease";

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: finalX, y: finalY },
        hasGlow,
        angle,
        radius: this.radius,
        baseRadius: this.radius,
        speed: 0.5 + Math.random() * 0.5,
        opacity: 0.7 + Math.random() * 0.3
      });
    }
  }

  updateTurboPositions() {
    this.currentRotation += this.rotationSpeed;
    
    this.particles.forEach((p, i) => {
      if (p.el) {
        // Add slight offset to angle for more organic movement
        const angle = p.angle + this.currentRotation * p.speed;
        
        const x = this.radius * Math.cos(angle);
        const y = this.radius * Math.sin(angle);
        let z = 0;

        const { x: rx, y: ry, z: rz } = this.rotation;
        let y1 = y * Math.cos(rx) - z * Math.sin(rx);
        let z1 = y * Math.sin(rx) + z * Math.cos(rx);
        let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
        let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

        const finalX = this.origin.x + x3;
        const finalY = this.origin.y + y3;

        p.el.style.left = `${finalX}px`;
        p.el.style.top = `${finalY}px`;
        p.el.style.opacity = p.opacity.toString();
        p.el.style.transform = `rotateX(${this.rotation.x * 180/Math.PI}deg) rotateY(${this.rotation.y * 180/Math.PI}deg) scale(${0.9 + Math.sin(angle * 2) * 0.1})`;
      }
    });
  }

  updateOriginalPositions() {
    this.particles.forEach(p => {
      if (p.el) {
        p.el.style.left = `${p.original.x}px`;
        p.el.style.top = `${p.original.y}px`;
        p.el.style.opacity = "0";
        p.el.style.transform = "none";
      }
    });
  }

  updateMouseInfluence(mouseX: number, mouseY: number) {
    const dx = mouseX - this.origin.x;
    const dy = mouseY - this.origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 300;
    const influence = Math.max(0, 1 - distance / maxDistance);
    
    // Make rings expand when mouse is near
    this.radius = this.baseRadius * (1 + influence * 0.5);
    
    this.particles.forEach(p => {
      const angleDiff = Math.abs(p.angle - Math.atan2(dy, dx));
      const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;
      const particleInfluence = influence * (1 - normalizedDiff);
      
      if (p.el) {
        p.el.style.transform = `rotateX(${this.rotation.x * 180/Math.PI}deg) rotateY(${this.rotation.y * 180/Math.PI}deg) scale(${1 + particleInfluence * 0.3})`;
        
        if (p.hasGlow) {
          p.el.style.textShadow = `0 0 ${8 + particleInfluence * 15}px currentColor`;
        }
      }
    });
  }

  destroy() {
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  // Enhanced ring configurations - larger and more dynamic
  const ringConfigs = [
    { radius: 300, rotation: { x: 84, y: 0, z: 30 }, count: 120 },
    { radius: 250, rotation: { x: 20, y: 90, z: 10 }, count: 100 },
    { radius: 350, rotation: { x: 84, y: 180, z: 0 }, count: 80 },
    { radius: 400, rotation: { x: 84, y: 0, z: -30 }, count: 100 },
    { radius: 200, rotation: { x: 45, y: 45, z: 0 }, count: 60 },
  ];

  const calculateCenterPosition = (): Vector3 | null => {
    if (!terminalRef.current) return null;
    
    const terminalWidth = terminalRef.current.offsetWidth;
    const terminalHeight = terminalRef.current.offsetHeight;
    
    let centerX, centerY;
    
    if (CENTER_CONFIG.useFixed) {
      centerX = CENTER_CONFIG.fixedX;
      centerY = CENTER_CONFIG.fixedY;
    } else {
      centerX = terminalWidth / 2 + (terminalWidth * CENTER_CONFIG.offsetX / 100);
      centerY = terminalHeight / 2 + (terminalHeight * CENTER_CONFIG.offsetY / 100);
    }
    
    return {
      x: centerX,
      y: centerY,
      z: 0
    };
  };

  const updateRingsCenterPositions = () => {
    const center = calculateCenterPosition();
    if (center) {
      ringsRef.current.forEach(ring => {
        ring.updateOrigin(center);
        if (isTurboMode) {
          ring.updateTurboPositions();
        }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!terminalRef.current) return;
    
    const rect = terminalRef.current.getBoundingClientRect();
    mousePositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateRingPositions);
    }
  };

  const handleMouseLeave = () => {
    mousePositionRef.current = { x: 0, y: 0 };
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  };

  const updateRingPositions = () => {
    if (isTurboMode) {
      ringsRef.current.forEach(ring => {
        ring.updateMouseInfluence(mousePositionRef.current.x, mousePositionRef.current.y);
      });
    }
    animationFrameRef.current = requestAnimationFrame(updateRingPositions);
  };

  useEffect(() => {
    updateRingsCenterPositions();
  }, [isTurboMode]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      }
      @keyframes glowPulseInside {
        0% { opacity: 0.6; text-shadow: 0 0 5px currentColor; }
        100% { opacity: 0.9; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
      }
      @keyframes floatSoft {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(2deg); }
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

    // Create more floating particles inside
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animation = `floatSoft ${8 + Math.random() * 8}s ease-in-out infinite`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      const hasGlow = Math.random() < 0.3;
      const hue = 260 + Math.random() * 60;
      if (hasGlow) {
        span.style.color = `hsl(${hue}, 100%, 75%)`;
        span.style.textShadow = `0 0 10px hsl(${hue}, 100%, 75%)`;
        span.style.animation += `, glowPulseInside ${5 + Math.random() * 5}s infinite alternate`;
        span.style.opacity = '0.7';
      } else {
        span.style.color = `hsl(${hue}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    const center = calculateCenterPosition();
    if (!center) return;

    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.rotation, cfg.count, container);
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    });

    const resizeObserver = new ResizeObserver(() => {
      updateRingsCenterPositions();
    });
    
    if (terminal) {
      resizeObserver.observe(terminal);
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(r => r.destroy());
      document.head.removeChild(style);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (terminal) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    ringsRef.current.forEach(ring => {
      if (isTurboMode) {
        ring.updateTurboPositions();
      } else {
        ring.updateOriginalPositions();
      }
      
      ring.particles.forEach(p => {
        const el = p.el;
        if (isTurboMode) {
          el.style.transition = "opacity 1s ease, transform 1s ease, left 1.5s cubic-bezier(0.16,1,0.3,1), top 1.5s cubic-bezier(0.16,1,0.3,1)";
          el.style.opacity = p.opacity.toString();
          
          if (p.hasGlow) {
            el.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate`;
            el.style.textShadow = `0 0 15px currentColor, 0 0 30px currentColor`;
          }
        } else {
          el.style.transition = "opacity 0.8s ease, transform 0.8s ease, left 2s ease-out, top 2s ease-out";
          el.style.opacity = "0";
          
          if (p.hasGlow) {
            el.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
            el.style.textShadow = `0 0 8px currentColor`;
          }
        }
      });
    });

    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
      terminalRef.current.style.transition = "transform 1s ease";
    }
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
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-all duration-500"
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "450px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
            transform: isTurboMode ? "translateZ(100px) scale(1.05)" : "none",
            textShadow: isTurboMode ? "0 0 20px rgba(168,85,247,0.5)" : "none"
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
          className={`absolute right-4 bottom-4 text-xs py-1 px-3 rounded-md border ${
            isTurboMode
              ? "bg-purple-900/80 border-purple-500 text-white shadow-[0_0_10px_#a855f7] hover:shadow-[0_0_15px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-300 z-20`}
        >
          {isTurboMode ? "TURBO MODE ▲" : "TURBO MODE ▼"}
        </button>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-all duration-1000"
          style={{ 
            transform: isTurboMode ? "translateZ(-100px) scale(1.2)" : "none",
            opacity: isTurboMode ? 0.4 : 0.3
          }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-all duration-1000"
          style={{ 
            transform: isTurboMode ? "translateZ(100px) scale(1.3)" : "none",
            opacity: isTurboMode ? 0.3 : 0.2
          }}
        />
      </div>
    </div>
  );
}