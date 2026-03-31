"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 300;
const NUCLEUS_RADIUS = 100; // Radius for the nucleus circle
const NUCLEUS_GLOW_COLOR = "rgba(168, 85, 247, 0.3)"; // Purple glow color

type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number, y: number };
  target: { x: number, y: number };
};

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const nucleusRef = useRef<HTMLDivElement>(null);

  const insideParticlesRef = useRef<ParticleData[]>([]);
  const ring1Particles = useRef<ParticleData[]>([]);
  const ring2Particles = useRef<ParticleData[]>([]);
  const ring3Particles = useRef<ParticleData[]>([]);

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup first
    insideParticlesRef.current.forEach(p => p.el.remove());
    [ring1Particles, ring2Particles, ring3Particles].forEach(ring => ring.current.forEach(p => p.el.remove()));
    insideParticlesRef.current = [];
    ring1Particles.current = [];
    ring2Particles.current = [];
    ring3Particles.current = [];

    // Create nucleus glow effect
    if (nucleusRef.current) {
      nucleusRef.current.style.boxShadow = `0 0 ${NUCLEUS_RADIUS}px ${NUCLEUS_GLOW_COLOR}`;
      nucleusRef.current.style.animation = "pulse 2s infinite alternate";
    }

    // Inside particles (arranged in a nucleus circle)
    const centerX = terminal.offsetWidth / 2;
    const centerY = terminal.offsetHeight / 2 - 50; // Slightly above center

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-10 transition-all duration-1000";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      span.style.opacity = `${0.7 + Math.random() * 0.3}`;
      span.style.filter = "drop-shadow(0 0 2px currentColor)";

      // Position particles in a circle with some randomness
      const angle = (i * 2 * Math.PI) / INSIDE_PARTICLE_COUNT;
      const radius = NUCLEUS_RADIUS * (0.7 + Math.random() * 0.3); // Some variation in radius
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Add some initial offset for animation
      const startX = centerX + (Math.random() - 0.5) * 20;
      const startY = centerY + (Math.random() - 0.5) * 20;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;
      terminal.appendChild(span);

      // Animate to final position
      setTimeout(() => {
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
      }, 100);

      insideParticlesRef.current.push({ 
        el: span, 
        original: { x: startX, y: startY }, 
        target: { x, y } 
      });
    }

    // Add subtle floating animation
    const animateNucleus = () => {
      insideParticlesRef.current.forEach((particle, i) => {
        const angle = (i * 2 * Math.PI) / INSIDE_PARTICLE_COUNT;
        const time = Date.now() / 1000;
        const floatAmount = 5; // How much particles float around
        
        const x = particle.target.x + Math.sin(time + angle) * floatAmount;
        const y = particle.target.y + Math.cos(time * 0.7 + angle) * floatAmount;
        
        particle.el.style.left = `${x}px`;
        particle.el.style.top = `${y}px`;
      });
      requestAnimationFrame(animateNucleus);
    };
    animateNucleus();

    // Outer rings (same as before)
    const containerCenterX = container.offsetWidth / 2;
    const containerCenterY = container.offsetHeight / 2;

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
        let x = containerCenterX + RING_RADIUS * Math.cos(angle);
        let y = containerCenterY + RING_RADIUS * Math.sin(angle);

        if (axis === "X") {
          y = containerCenterY + RING_RADIUS * Math.sin(angle) * Math.cos(Math.PI / 4);
        } else if (axis === "Y") {
          x = containerCenterX + RING_RADIUS * Math.cos(angle) * Math.cos(Math.PI / 4);
        }

        // Random start pos
        const randomX = Math.random() * container.offsetWidth;
        const randomY = Math.random() * container.offsetHeight;
        span.style.left = `${randomX}px`;
        span.style.top = `${randomY}px`;
        span.style.opacity = "0.5";
        container.appendChild(span);

        ringRef.current.push({ 
          el: span, 
          original: { x: randomX, y: randomY }, 
          target: { x, y } 
        });
      }
    };

    createRing(ring1Particles, "Z");
    createRing(ring2Particles, "X");
    createRing(ring3Particles, "Y");

    return () => {
      insideParticlesRef.current.forEach(p => p.el.remove());
      [ring1Particles, ring2Particles, ring3Particles].forEach(ring => ring.current.forEach(p => p.el.remove()));
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

    // Make nucleus glow brighter on hover
    if (nucleusRef.current) {
      nucleusRef.current.style.opacity = isHovered ? "0.8" : "0.5";
    }
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
      `}</style>
      
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
        {/* Nucleus glow effect */}
        <div 
          ref={nucleusRef}
          className="absolute rounded-full pointer-events-none z-5"
          style={{
            width: `${NUCLEUS_RADIUS}px`,
            height: `${NUCLEUS_RADIUS}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: NUCLEUS_GLOW_COLOR,
            opacity: 0.5,
            marginTop: "-50px" // Match the particle offset
          }}
        />

        {/* Top gradient bar */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Window controls */}
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* TECHCRUNCH title */}
        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10"
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