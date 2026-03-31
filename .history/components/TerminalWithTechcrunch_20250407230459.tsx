"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const NUCLEUS_RADIUS = 100;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  turbo: { x: number; y: number };
};

// Class to handle nucleus formation
class NucleusController {
  particles: HTMLSpanElement[] = [];
  letterElements: HTMLSpanElement[] = [];
  container: HTMLDivElement;
  nucleusElement: HTMLDivElement | null = null;
  nucleusCenter: { x: number, y: number } = { x: 0, y: 0 };
  animationFrameId: number | null = null;
  particlePositions: { x: number, y: number, angle: number, distance: number, speed: number }[] = [];
  active: boolean = false;
  
  constructor(particles: HTMLSpanElement[], letterElements: HTMLSpanElement[], container: HTMLDivElement) {
    this.particles = particles;
    this.letterElements = letterElements;
    this.container = container;
  }
  
  initialize() {
    // Create nucleus element
    this.nucleusElement = document.createElement("div");
    this.nucleusElement.className = "absolute rounded-full z-10 transition-all duration-700";
    this.nucleusElement.style.width = "0px";
    this.nucleusElement.style.height = "0px";
    this.nucleusElement.style.opacity = "0";
    this.nucleusElement.style.background = "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(236,73,153,0.3) 70%, rgba(236,73,153,0) 100%)";
    this.nucleusElement.style.boxShadow = "0 0 40px 10px rgba(168,85,247,0.4)";
    this.nucleusElement.style.transition = "width 1s ease-out, height 1s ease-out, opacity 0.5s ease-in";
    
    const containerRect = this.container.getBoundingClientRect();
    this.nucleusCenter = {
      x: containerRect.width / 2,
      y: containerRect.height / 3
    };
    
    this.nucleusElement.style.left = `${this.nucleusCenter.x}px`;
    this.nucleusElement.style.top = `${this.nucleusCenter.y}px`;
    this.nucleusElement.style.transform = "translate(-50%, -50%)";
    
    this.container.appendChild(this.nucleusElement);
    
    // Setup initial positions for particles
    this.particlePositions = this.particles.map(() => ({
      x: 0,
      y: 0,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * NUCLEUS_RADIUS * 0.8 + NUCLEUS_RADIUS * 0.2,
      speed: 0.005 + Math.random() * 0.01
    }));
  }
  
  start() {
    this.active = true;
    
    // First, collapse the TECHCRUNCH text to center
    this.letterElements.forEach((letter, index) => {
      setTimeout(() => {
        letter.style.transition = "all 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
        letter.style.transform = "scale(0.1)";
        letter.style.opacity = "0";
        letter.style.filter = "blur(2px)";
      }, index * 80); // Stagger the collapse
    });
    
    // After text collapses, start forming the nucleus
    setTimeout(() => {
      if (!this.active) return;
      
      // Show nucleus
      if (this.nucleusElement) {
        this.nucleusElement.style.width = `${NUCLEUS_RADIUS * 2}px`;
        this.nucleusElement.style.height = `${NUCLEUS_RADIUS * 2}px`;
        this.nucleusElement.style.opacity = "1";
      }
      
      // Move particles to form the nucleus shell
      this.particles.forEach((particle, index) => {
        // Get original position
        const rect = particle.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        // Calculate relative position
        const originalX = rect.left - containerRect.left + rect.width / 2;
        const originalY = rect.top - containerRect.top + rect.height / 2;
        
        // Save original position to particle element
        particle.dataset.originalX = originalX.toString();
        particle.dataset.originalY = originalY.toString();
        
        // First move to nucleus
        setTimeout(() => {
          particle.style.transition = "all 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
          particle.style.opacity = "1";
          particle.style.color = `hsl(${270 + Math.random() * 40}, 70%, 65%)`;
          particle.style.textShadow = "0 0 5px rgba(168, 85, 247, 0.8)";
          
          // Position on nucleus shell
          const angle = this.particlePositions[index].angle;
          const distance = this.particlePositions[index].distance;
          
          const x = this.nucleusCenter.x + Math.cos(angle) * distance;
          const y = this.nucleusCenter.y + Math.sin(angle) * distance;
          
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.transform = "scale(1.2)";
          
          // Remove original animation
          particle.classList.remove("animate-floatSoft");
        }, Math.random() * 500 + 500);
      });
      
      // Start the orbital animation
      this.animateParticles();
    }, this.letterElements.length * 80 + 500);
  }
  
  animateParticles() {
    if (!this.active) return;
    
    this.particles.forEach((particle, index) => {
      const pos = this.particlePositions[index];
      pos.angle += pos.speed;
      
      const x = this.nucleusCenter.x + Math.cos(pos.angle) * pos.distance;
      const y = this.nucleusCenter.y + Math.sin(pos.angle) * pos.distance;
      
      particle.style.transition = "none"; // Remove transition for smooth movement
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
    });
    
    this.animationFrameId = requestAnimationFrame(() => this.animateParticles());
  }
  
  stop() {
    this.active = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Restore nucleus
    if (this.nucleusElement) {
      this.nucleusElement.style.width = "0px";
      this.nucleusElement.style.height = "0px";
      this.nucleusElement.style.opacity = "0";
    }
    
    // Restore letters
    this.letterElements.forEach((letter) => {
      letter.style.transition = "all 0.5s ease";
      letter.style.transform = "scale(1)";
      letter.style.opacity = "1";
      letter.style.filter = "none";
    });
    
    // Restore particles to their original positions
    this.particles.forEach((particle) => {
      const originalX = particle.dataset.originalX;
      const originalY = particle.dataset.originalY;
      
      particle.style.transition = "all 0.8s ease";
      
      if (originalX && originalY) {
        // Return to original positions
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
      }
      
      particle.style.opacity = `${0.4 + Math.random() * 0.5}`;
      particle.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      particle.style.textShadow = "none";
      particle.style.transform = "scale(1)";
      
      // Restore animation
      particle.classList.add("animate-floatSoft");
      particle.style.animationDuration = `${6 + Math.random() * 6}s`;
    });
  }
  
  cleanup() {
    if (this.nucleusElement) {
      this.nucleusElement.remove();
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

class Ring {
  origin: Vector3;
  radius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];

  constructor(origin: Vector3, radius: number, rotation: Vector3, count: number, container: HTMLDivElement) {
    this.origin = origin;
    this.radius = radius;
    this.rotation = {
      x: (rotation.x * Math.PI) / 180,
      y: (rotation.y * Math.PI) / 180,
      z: (rotation.z * Math.PI) / 180,
    };
    this.count = count;
    this.container = container;
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
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: finalX, y: finalY },
      });
    }
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
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const nucleusControllerRef = useRef<NucleusController | null>(null);

  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 100 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 80 },
    { radius: 150, rotation: { x: 60, y: 45, z: 70 }, count: 60 },
  ];

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    insideParticlesRef.current = [];
    
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];

    // Create inside particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    // Create outer rings
    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.rotation, cfg.count, container);
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    });

    // Initialize nucleus controller
    if (letterRefs.current.length > 0 && insideParticlesRef.current.length > 0) {
      nucleusControllerRef.current = new NucleusController(
        insideParticlesRef.current, 
        letterRefs.current, 
        terminal
      );
      nucleusControllerRef.current.initialize();
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(r => r.destroy());
      nucleusControllerRef.current?.cleanup();
    };
  }, []);

  // Handle turbo mode transitions
  useEffect(() => {
    // Animate outside particles
    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        el.style.left = `${isTurboMode ? p.turbo.x : p.original.x}px`;
        el.style.top = `${isTurboMode ? p.turbo.y : p.original.y}px`;
        el.style.opacity = isTurboMode ? "0.8" : "0.5";
        el.style.transform = isTurboMode ? "rotateX(45deg)" : "";
      });
    });

    // Terminal effect
    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
    }

    // Nucleus controller
    if (nucleusControllerRef.current) {
      if (isTurboMode) {
        nucleusControllerRef.current.start();
      } else {
        nucleusControllerRef.current.stop();
      }
    }
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-transform duration-500"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
          transformStyle: "preserve-3d",
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500 relative"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px)" : "none",
          }}
        >
          {"TECHCRUNCH".split("").map((letter, index) => (
            <span
              key={index}
              ref={el => el && (letterRefs.current[index] = el)}
              style={{ 
                display: "inline-block", 
                transition: "all 0.5s ease",
                position: "relative"
              }}
            >
              {letter}
            </span>
          ))}
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