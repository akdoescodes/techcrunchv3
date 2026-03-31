"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number; z: number };
  turbo: { x: number; y: number; z: number };
  hasGlow: boolean;
  size: number;
};

// Create a more complex geometric structure with interlocking rings
class ComplexRingStructure {
  origin: Vector3;
  container: HTMLDivElement;
  rings: ComplexRing[] = [];
  particles: ParticleData[] = [];

  constructor(origin: Vector3, container: HTMLDivElement) {
    this.origin = origin;
    this.container = container;
  }

  generateStructure() {
    // Primary rings
    this.createRing(380, { x: 0, y: 0, z: 0 }, 80, 1);
    this.createRing(450, { x: 90, y: 0, z: 0 }, 90, 1);
    this.createRing(450, { x: 0, y: 90, z: 0 }, 90, 1);
    
    // Secondary diagonal rings
    this.createRing(400, { x: 45, y: 45, z: 0 }, 80, 0.9);
    this.createRing(400, { x: 45, y: -45, z: 0 }, 80, 0.9);
    this.createRing(400, { x: 0, y: 45, z: 45 }, 80, 0.9);
    this.createRing(400, { x: 0, y: -45, z: 45 }, 80, 0.9);
    
    // Tertiary smaller rings
    this.createRing(300, { x: 60, y: 30, z: 15 }, 60, 0.8);
    this.createRing(300, { x: -60, y: 30, z: 15 }, 60, 0.8);
    this.createRing(320, { x: 30, y: 60, z: 15 }, 65, 0.8);
    this.createRing(320, { x: 30, y: -60, z: 15 }, 65, 0.8);
    
    // Quaternary outer rings
    this.createRing(520, { x: 10, y: 10, z: 0 }, 100, 0.7);
    this.createRing(520, { x: -10, y: -10, z: 0 }, 100, 0.7);
    
    // Center cluster rings
    this.createRing(200, { x: 120, y: 30, z: 60 }, 50, 1);
    this.createRing(180, { x: 30, y: 120, z: 60 }, 45, 1);
    this.createRing(160, { x: 60, y: 60, z: 120 }, 40, 1);
  }

  createRing(radius: number, rotation: Vector3, count: number, opacity: number) {
    const ring = new ComplexRing(
      this.origin,
      radius,
      {
        x: (rotation.x * Math.PI) / 180,
        y: (rotation.y * Math.PI) / 180,
        z: (rotation.z * Math.PI) / 180,
      },
      count,
      this.container,
      opacity
    );
    
    this.rings.push(ring);
    
    const newParticles = ring.generateParticles(outsideParticles);
    this.particles = [...this.particles, ...newParticles];
    
    return ring;
  }

  destroy() {
    this.particles.forEach(p => p.el.remove());
    this.rings = [];
    this.particles = [];
  }
}

class ComplexRing {
  origin: Vector3;
  radius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  baseOpacity: number;

  constructor(origin: Vector3, radius: number, rotation: Vector3, count: number, container: HTMLDivElement, baseOpacity: number = 1) {
    this.origin = origin;
    this.radius = radius;
    this.rotation = rotation;
    this.count = count;
    this.container = container;
    this.baseOpacity = baseOpacity;
  }

  generateParticles(charList: string[]): ParticleData[] {
    const particles: ParticleData[] = [];
    
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      let x = this.radius * Math.cos(angle);
      let y = this.radius * Math.sin(angle);
      let z = 0;

      const { x: rx, y: ry, z: rz } = this.rotation;
      
      // Apply rotation matrices
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      const finalX = this.origin.x + x3;
      const finalY = this.origin.y + y3;
      const finalZ = this.origin.z + z2;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      // Distance from center affects size
      const distFromCenter = Math.sqrt(x3*x3 + y3*y3 + z2*z2);
      const sizeScale = Math.max(0.6, 1 - (distFromCenter / (this.radius * 2)));
      const size = 1 + (sizeScale * 0.5);
      
      span.style.fontSize = `${size}rem`;
      
      // Randomly decide if this particle should have glow (20% chance)
      const hasGlow = Math.random() < 0.25;
      const hue = 60 + Math.floor(Math.random() * 40);
      
      // Style based on position in 3D space
      const brightness = Math.max(45, 55 + (z2 / 10));
      const saturation = Math.max(70, 90 - Math.abs(z2 / 10));
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, 100%, ${brightness}%)`;
        span.style.textShadow = `0 0 8px hsl(${hue}, 100%, ${brightness}%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${brightness - 10}%)`;
      }
      
      span.style.opacity = `${this.baseOpacity * (0.6 + Math.random() * 0.4)}`;

      // Set initial random position
      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;
      const startZ = Math.random() * 200 - 100;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;
      span.style.zIndex = `${Math.floor(startZ)}`;

      this.container.appendChild(span);

      particles.push({
        el: span,
        original: { x: startX, y: startY, z: startZ },
        turbo: { x: finalX, y: finalY, z: finalZ },
        hasGlow,
        size
      });
    }
    
    return particles;
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const complexStructureRef = useRef<ComplexRingStructure | null>(null);

  useEffect(() => {
    // Add glow animation to global styles
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
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Clear existing particles
    insideParticlesRef.current.forEach(p => p.remove());
    if (complexStructureRef.current) {
      complexStructureRef.current.destroy();
    }
    
    insideParticlesRef.current = [];

    // Create inside terminal particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      // Randomly decide if this particle should have glow (25% chance)
      const hasGlow = Math.random() < 0.25;
      if (hasGlow) {
        span.style.color = `hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.textShadow = `0 0 6px hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.animation += `, glowPulseInside ${4 + Math.random() * 5}s infinite alternate`;
        span.style.opacity = '0.7';
      } else {
        span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    // Create the surrounding complex structure
    const center = {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2,
      z: 0,
    };

    const complexStructure = new ComplexRingStructure(center, container);
    complexStructure.generateStructure();
    complexStructureRef.current = complexStructure;

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      if (complexStructureRef.current) {
        complexStructureRef.current.destroy();
      }
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Toggle between random and geometric positions
    if (!complexStructureRef.current) return;
    
    complexStructureRef.current.particles.forEach(p => {
      const el = p.el;
      
      // Apply 3D transformations
      if (isTurboMode) {
        // Calculate depth (z) based perspective 
        const zDepth = p.turbo.z;
        const scale = 1 - (zDepth / 2000); // Scale based on z depth
        
        el.style.left = `${p.turbo.x}px`;
        el.style.top = `${p.turbo.y}px`;
        el.style.transform = `scale(${scale}) rotateX(${zDepth/10}deg)`;
        el.style.zIndex = `${Math.floor(p.turbo.z)}`;
      } else {
        el.style.left = `${p.original.x}px`;
        el.style.top = `${p.original.y}px`;
        el.style.transform = "";
        el.style.zIndex = `${Math.floor(p.original.z)}`;
      }
      
      // Adjust opacity and glow based on mode
      el.style.opacity = isTurboMode ? `${0.7 + (p.size * 0.1)}` : "0.5";
      
      // Enhance glow in turbo mode
      if (p.hasGlow) {
        if (isTurboMode) {
          el.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate`;
          el.style.textShadow = `0 0 15px currentColor, 0 0 25px currentColor`;
        } else {
          el.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
          el.style.textShadow = `0 0 8px currentColor`;
        }
      }
    });

    // Apply 3D effect to terminal
    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
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
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-transform duration-500"
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
            transform: isTurboMode ? "translateZ(100px)" : "none",
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
              ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_6px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-300 z-20`}
        >
          {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
        </button>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-500"
          style={{ transform: isTurboMode ? "translateZ(-100px)" : "none" }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-500"
          style={{ transform: isTurboMode ? "translateZ(100px)" : "none" }}
        />
      </div>
    </div>
  );
}