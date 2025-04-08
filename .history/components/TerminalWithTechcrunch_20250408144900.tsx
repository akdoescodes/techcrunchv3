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
  turbo: { x: number; y: number; z: number }; // Added z coordinate for better 3D positioning
  hasGlow: boolean;
  angle: number;
  radius: number;
  orbitSpeed: number; // Individual orbit speed for particle
  orbitDirection: number; // Direction of orbit (1 or -1)
  verticalOffset: number; // Vertical oscillation offset
};

class Ring {
  origin: Vector3;
  radius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  oscillationSpeed: number;
  currentTime: number = 0;
  animationId: number | null = null;
  depth: number; // Added depth for 3D effect
  tilt: number; // Added tilt for more dynamic appearance

  constructor(
    origin: Vector3, 
    radius: number, 
    rotation: Vector3, 
    count: number, 
    container: HTMLDivElement, 
    oscillationSpeed: number = 0.005,
    depth: number = 100,
    tilt: number = 15
  ) {
    this.origin = origin;
    this.radius = radius;
    this.rotation = {
      x: (rotation.x * Math.PI) / 180,
      y: (rotation.y * Math.PI) / 180,
      z: (rotation.z * Math.PI) / 180,
    };
    this.count = count;
    this.container = container;
    this.oscillationSpeed = oscillationSpeed;
    this.depth = depth;
    this.tilt = tilt;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      let x = this.radius * Math.cos(angle);
      let y = this.radius * Math.sin(angle);
      let z = Math.sin(angle * 2) * this.depth; // Add vertical dimension with sine wave

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
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      // Enhanced glow effect with varying colors
      const hue = 50 + Math.random() * 60; // Gold to yellow-orange range
      const hasGlow = Math.random() < 0.3; // Increased glow chance for more visual impact
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, 100%, 75%)`;
        span.style.textShadow = `0 0 10px hsl(${hue}, 100%, 70%), 0 0 15px hsl(${hue}, 80%, 60%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${hue}, 90%, 60%)`;
      }

      // Randomized initial positions for more organic appearance
      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      // Each particle gets its own orbit characteristics
      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: finalX, y: finalY, z: z2 }, // Store z for depth rendering
        hasGlow,
        angle,
        radius: this.radius,
        orbitSpeed: this.oscillationSpeed * (0.5 + Math.random()), // Varied speeds
        orbitDirection: Math.random() > 0.5 ? 1 : -1, // Random direction
        verticalOffset: Math.random() * Math.PI * 2 // Random phase offset for vertical motion
      });
    }
  }

  startRotation() {
    if (this.animationId) return; // Already animating
    
    const animate = () => {
      this.currentTime += 0.01;
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
      
      // Each particle moves independently with its own characteristics
      const newAngle = p.angle + (this.currentTime * p.orbitSpeed * p.orbitDirection);
      
      // Vertical oscillation for more dynamic 3D effect
      const verticalWave = Math.sin(newAngle * 2 + p.verticalOffset) * this.depth;
      
      // Calculate new positions with enhanced 3D movement
      let x = p.radius * Math.cos(newAngle);
      let y = p.radius * Math.sin(newAngle);
      let z = verticalWave;

      // Apply ring tilt and rotation
      const tiltRad = (this.tilt * Math.PI) / 180;
      const extraTilt = Math.sin(this.currentTime * 0.2) * 10 * (Math.PI / 180); // Subtle breathing effect

      const { x: rx, y: ry, z: rz } = this.rotation;
      // Apply additional dynamic tilt
      let y1 = y * Math.cos(rx + extraTilt) - z * Math.sin(rx + extraTilt);
      let z1 = y * Math.sin(rx + extraTilt) + z * Math.cos(rx + extraTilt);
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      const finalX = this.origin.x + x3;
      const finalY = this.origin.y + y3;
      
      // Calculate visual size based on Z position for perspective effect
      const perspectiveFactor = 1 + (z2 / 2000); // Adjust divisor for perspective intensity
      const scale = Math.max(0.6, Math.min(1.5, perspectiveFactor));
      
      // Update turbo position with z coordinate for depth sorting
      p.turbo = { x: finalX, y: finalY, z: z2 };
      
      // Apply position and perspective scaling
      p.el.style.left = `${p.turbo.x}px`;
      p.el.style.top = `${p.turbo.y}px`;
      p.el.style.transform = `scale(${scale})`;
      
      // Adjust opacity based on z-position for depth effect
      p.el.style.opacity = `${0.4 + (z2 > 0 ? 0.6 : 0.3)}`;
      
      // z-index based on z-position for proper layering
      p.el.style.zIndex = `${Math.round(z2)}`;
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

  // Enhanced ring configurations for better 3D effect
  const ringConfigs = [
    { radius: 460, rotation: { x: 75, y: 10, z: 20 }, count: 120, speed: 0.003, depth: 150, tilt: 25 },
    { radius: 380, rotation: { x: 30, y: 70, z: -15 }, count: 100, speed: 0.005, depth: 180, tilt: 20 },
    { radius: 550, rotation: { x: -15, y: 60, z: 5 }, count: 80, speed: 0.002, depth: 120, tilt: 15 },
    { radius: 320, rotation: { x: 60, y: -20, z: -10 }, count: 90, speed: 0.004, depth: 200, tilt: 30 },
  ];

  useEffect(() => {
    // Add enhanced glow animations to global styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        50% { opacity: 0.9; text-shadow: 0 0 12px currentColor, 0 0 20px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 18px currentColor, 0 0 25px currentColor; }
      }
      @keyframes glowPulseInside {
        0% { opacity: 0.6; text-shadow: 0 0 5px currentColor; }
        50% { opacity: 0.8; text-shadow: 0 0 8px currentColor, 0 0 12px currentColor; }
        100% { opacity: 0.9; text-shadow: 0 0 15px currentColor, 0 0 20px currentColor; }
      }
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      // Enhanced internal particles with stronger glow
      const hasGlow = Math.random() < 0.3;
      const hue = 260 + Math.random() * 60; // Purple to blue range
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, 100%, 75%)`;
        span.style.textShadow = `0 0 8px hsl(${hue}, 100%, 75%), 0 0 12px hsl(${hue}, 90%, 65%)`;
        span.style.animation += `, glowPulseInside ${4 + Math.random() * 5}s infinite alternate`;
        span.style.opacity = '0.8';
      } else {
        span.style.color = `hsl(${hue}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    // Center position with slight offset for visual interest
    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    // Create rings with enhanced 3D configurations
    ringConfigs.forEach(cfg => {
      const ring = new Ring(
        center, 
        cfg.radius, 
        cfg.rotation, 
        cfg.count, 
        container, 
        cfg.speed, 
        cfg.depth, 
        cfg.tilt
      );
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
    // Start or stop animation based on turbo mode
    ringsRef.current.forEach(ring => {
      if (isTurboMode) {
        ring.startRotation();
      } else {
        ring.stopRotation();
      }
    });

    // Enhanced visual effects based on turbo mode
    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        
        // In non-turbo mode, reset to original positions with transition
        if (!isTurboMode) {
          el.style.left = `${p.original.x}px`;
          el.style.top = `${p.original.y}px`;
          el.style.transform = "";
          el.style.zIndex = "0";
        }
        
        // Enhanced visual treatment in turbo mode
        el.style.opacity = isTurboMode ? "0.9" : "0.5";
        el.style.transition = isTurboMode ? "all 0.3s" : "all 1.2s";
        
        // Enhanced glow effects in turbo mode
        if (p.hasGlow) {
          if (isTurboMode) {
            el.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate`;
            el.style.textShadow = `0 0 15px currentColor, 0 0 25px currentColor, 0 0 35px currentColor`;
          } else {
            el.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
            el.style.textShadow = `0 0 8px currentColor`;
          }
        }
      });
    });

    // Enhanced terminal effect in turbo mode
    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode 
        ? "translateZ(50px) rotateX(5deg)" 
        : "none";
    }
    
    // Cleanup function to stop animations when component unmounts
    return () => {
      ringsRef.current.forEach(ring => ring.stopRotation());
    };
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{
        perspective: "1200px", // Enhanced perspective for more dramatic 3D
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_15px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-all duration-700"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#10101a0d",
          overflow: "hidden",
          boxShadow: isTurboMode ? "0 0 25px rgba(168, 85, 247, 0.5)" : "0 0 15px rgba(168, 85, 247, 0.4)",
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-all duration-700"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px) scale(1.05)" : "none",
            textShadow: isTurboMode ? "0 0 30px rgba(236, 72, 153, 0.4)" : "none",
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
              ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_12px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-500 z-20`}
        >
          {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
        </button>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-700"
          style={{ transform: isTurboMode ? "translateZ(-100px) scale(1.2)" : "none" }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-700"
          style={{ transform: isTurboMode ? "translateZ(100px) scale(1.2)" : "none" }}
        />
      </div>
    </div>
  );
}