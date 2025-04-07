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
  ringIndex: number; // Which ring this particle belongs to
  angleOffset: number; // Initial angle offset within the ring
  hasGlow: boolean;
};

// Global variables to track rotation
const ringRotations: number[] = [0, 0, 0, 0]; // One rotation value per ring
const ringRotationSpeeds = [0.005, 0.003, 0.004, 0.002]; // Different speeds for each ring

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const outsideParticlesRef = useRef<ParticleData[]>([]);
  const animationRef = useRef<number>();

  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 100 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 80 },
    { radius: 550, rotation: { x: 90, y: 180, z: 0 }, count: 60 },
    { radius: 460, rotation: { x: 84, y: 0, z: -30 }, count: 60 },
  ];

  // Calculate position for a particle on a ring with current rotation
  const calculateRingPosition = (
    ringIndex: number, 
    angleOffset: number, 
    additionalRotation: number = 0
  ): { x: number, y: number } => {
    if (!terminalRef.current) return { x: 0, y: 0 };

    const terminal = terminalRef.current;
    const ringConfig = ringConfigs[ringIndex];
    
    // Center of the terminal
    const centerX = terminal.offsetLeft + terminal.offsetWidth / 2;
    const centerY = terminal.offsetTop + terminal.offsetHeight / 2;
    
    // Calculate angle with rotation
    const angle = angleOffset + additionalRotation;
    
    // Basic position on circle
    const x = Math.cos(angle) * ringConfig.radius;
    const y = Math.sin(angle) * ringConfig.radius;
    
    // Apply 3D rotation from config
    const rx = (ringConfig.rotation.x * Math.PI) / 180;
    const ry = (ringConfig.rotation.y * Math.PI) / 180;
    const rz = (ringConfig.rotation.z * Math.PI) / 180;
    
    // Apply rotations (simplified matrix transformations)
    let y1 = y * Math.cos(rx);
    let z1 = y * Math.sin(rx);
    
    let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    
    let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    let y3 = y1 * Math.cos(rz) + x2 * Math.sin(rz);
    
    // Add center offset
    return {
      x: centerX + x3,
      y: centerY + y3,
    };
  };

  // Set up animation and particles
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
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Clean up existing particles
    insideParticlesRef.current.forEach(p => p.remove());
    outsideParticlesRef.current.forEach(p => p.el.remove());
    insideParticlesRef.current = [];
    outsideParticlesRef.current = [];

    // Reset rotations
    ringRotations.fill(0);

    // Create inside particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
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

    // Create outside particles in rings
    let particleCount = 0;
    ringConfigs.forEach((config, ringIndex) => {
      for (let i = 0; i < config.count; i++) {
        // Calculate position
        const angleOffset = (i / config.count) * Math.PI * 2;
        const initialPos = calculateRingPosition(ringIndex, angleOffset);
        
        // Random positions when not in turbo mode
        const randomX = Math.random() * container.offsetWidth;
        const randomY = Math.random() * container.offsetHeight;
        
        // Create particle
        const span = document.createElement("span");
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all";
        span.style.left = `${randomX}px`;
        span.style.top = `${randomY}px`;
        span.style.fontWeight = "bold";
        span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
        span.style.transition = "left 0.5s ease, top 0.5s ease, opacity 0.5s ease, transform 0.5s ease";
        
        const hasGlow = Math.random() < 0.2;
        if (hasGlow) {
          span.style.color = `hsl(${60 + Math.random() * 40}, 100%, 70%)`;
          span.style.textShadow = `0 0 8px hsl(${60 + Math.random() * 40}, 100%, 70%)`;
          span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
        } else {
          span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;
        }
        
        container.appendChild(span);
        
        // Store particle data
        outsideParticlesRef.current.push({
          el: span,
          original: { x: randomX, y: randomY },
          ringIndex,
          angleOffset,
          hasGlow
        });
        
        particleCount++;
      }
    });

    // Animation function for rotating rings
    const animate = () => {
      if (isTurboMode) {
        // Update each ring's rotation
        ringRotations.forEach((_, index) => {
          ringRotations[index] += ringRotationSpeeds[index];
        });
        
        // Update particles based on new rotations
        outsideParticlesRef.current.forEach(particle => {
          if (isTurboMode) {
            const newPos = calculateRingPosition(
              particle.ringIndex, 
              particle.angleOffset,
              ringRotations[particle.ringIndex]
            );
            
            particle.el.style.left = `${newPos.x}px`;
            particle.el.style.top = `${newPos.y}px`;
            
            // No transition during rotation for smoothness
            particle.el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          }
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      outsideParticlesRef.current.forEach(p => p.el.remove());
      document.head.removeChild(style);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle turbo mode changes
  useEffect(() => {
    outsideParticlesRef.current.forEach(particle => {
      const el = particle.el;
      
      if (isTurboMode) {
        // Move to ring position first with transition
        const pos = calculateRingPosition(particle.ringIndex, particle.angleOffset);
        el.style.transition = "left 0.5s ease, top 0.5s ease, opacity 0.5s ease, transform 0.5s ease";
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.opacity = "0.8";
        el.style.transform = "rotateX(45deg)";
        
        if (particle.hasGlow) {
          el.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate`;
          el.style.textShadow = `0 0 15px currentColor, 0 0 25px currentColor`;
        }
      } else {
        // Return to original random position
        el.style.transition = "left 0.5s ease, top 0.5s ease, opacity 0.5s ease, transform 0.5s ease";
        el.style.left = `${particle.original.x}px`;
        el.style.top = `${particle.original.y}px`;
        el.style.opacity = "0.5";
        el.style.transform = "";
        
        if (particle.hasGlow) {
          el.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
          el.style.textShadow = `0 0 8px currentColor`;
        }
      }
    });

    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
    }
    
    // Reset rotations when toggling turbo mode
    if (!isTurboMode) {
      ringRotations.fill(0);
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