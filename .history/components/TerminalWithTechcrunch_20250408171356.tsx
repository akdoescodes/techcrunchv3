"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 300;

type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number, y: number };
  target: { x: number, y: number };
  glowIntensity: number;
  glowInterval: NodeJS.Timeout | null;
};

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ring1Particles = useRef<ParticleData[]>([]);
  const ring2Particles = useRef<ParticleData[]>([]);
  const ring3Particles = useRef<ParticleData[]>([]);

  // Function to make particles glow randomly
  const startRandomGlow = (particle: ParticleData) => {
    if (particle.glowInterval) clearInterval(particle.glowInterval);
    
    particle.glowInterval = setInterval(() => {
      // Only glow some of the time (30% chance)
      if (Math.random() > 0.7) {
        const intensity = 0.7 + Math.random() * 0.3;
        particle.glowIntensity = intensity;
        
        // Apply glow effect
        particle.el.style.textShadow = `0 0 ${8 * intensity}px hsl(${60 + Math.random() * 40}, 90%, ${55 + intensity * 20}%)`;
        particle.el.style.opacity = `${intensity}`;
        
        // Fade out after a short time
        setTimeout(() => {
          particle.el.style.textShadow = 'none';
          particle.el.style.opacity = '0.5';
        }, 200 + Math.random() * 300);
      }
    }, 1000 + Math.random() * 3000);
  };

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup first
    insideParticlesRef.current.forEach(p => p.remove());
    [ring1Particles, ring2Particles, ring3Particles].forEach(ring => {
      ring.current.forEach(p => {
        if (p.glowInterval) clearInterval(p.glowInterval);
        p.el.remove();
      });
    });
    insideParticlesRef.current = [];
    ring1Particles.current = [];
    ring2Particles.current = [];
    ring3Particles.current = [];

    // Inside particles (inside terminal)
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

    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    const createRing = (ringRef: typeof ring1Particles, axis: "Z" | "X" | "Y") => {
      for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
        const span = document.createElement("span");
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-1000";
        span.style.fontWeight = "bold";
        span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

        // Calculate ring positions
        const angle = (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT;
        let x = centerX + RING_RADIUS * Math.cos(angle);
        let y = centerY + RING_RADIUS * Math.sin(angle);

        if (axis === "X") {
          y = centerY + RING_RADIUS * Math.sin(angle) * Math.cos(Math.PI / 4);
        } else if (axis === "Y") {
          x = centerX + RING_RADIUS * Math.cos(angle) * Math.cos(Math.PI / 4);
        }

        // Random start pos
        const randomX = Math.random() * container.offsetWidth;
        const randomY = Math.random() * container.offsetHeight;
        span.style.left = `${randomX}px`;
        span.style.top = `${randomY}px`;
        span.style.opacity = "0.5";
        container.appendChild(span);

        const particleData: ParticleData = { 
          el: span, 
          original: { x: randomX, y: randomY }, 
          target: { x, y },
          glowIntensity: 0,
          glowInterval: null
        };

        ringRef.current.push(particleData);
        startRandomGlow(particleData);
      }
    };

    createRing(ring1Particles, "Z");
    createRing(ring2Particles, "X");
    createRing(ring3Particles, "Y");

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      [ring1Particles, ring2Particles, ring3Particles].forEach(ring => {
        ring.current.forEach(p => {
          if (p.glowInterval) clearInterval(p.glowInterval);
          p.el.remove();
        });
      });
    };
  }, []);

  // Handle hover state changes
  useEffect(() => {
    const updateRingParticles = (ringRef: typeof ring1Particles) => {
      ringRef.current.forEach((p) => {
        const span = p.el;
        if (isHovered) {
          span.style.left = `${p.target.x}px`;
          span.style.top = `${p.target.y}px`;
          span.style.opacity = "0.9";
        } else {
          span.style.left = `${p.original.x}px`;
          span.style.top = `${p.original.y}px`;
          span.style.opacity = "0.5";
        }
      });
    };

    updateRingParticles(ring1Particles);
    updateRingParticles(ring2Particles);
    updateRingParticles(ring3Particles);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top gradient bar */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Window controls */}
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* TECHCRUNCH title with conditional glow effect */}
        <h1
          className={`font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-all duration-500 ${
            isHovered ? "drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" : ""
          }`}
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
          }}
        >
          TECHCRUNCH
        </h1>

        {/* Terminal output */}
        <div className="text-left w-full space-y-1 z-10">
          <p>
            <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300">
              $ find events --category="tech" --sort="date"
            </span>
          </p>
          <p className="text-pink-500 animate-pulse">Crunching data...</p>
          <p className="text-green-600 font-semibold">
            Found 6 mind-blowing tech events!
          </p>
        </div>

        {/* Glowing blobs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
      </div>
    </div>
  );
}