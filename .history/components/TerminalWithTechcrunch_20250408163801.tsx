"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 300;
const MOUSE_ATTRACTION_RADIUS = 150;
const MOUSE_ATTRACTION_FORCE = 0.1;

type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number, y: number };
  target: { x: number, y: number };
  current: { x: number, y: number };
  velocity: { x: number, y: number };
};

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const techcrunchRef = useRef<HTMLHeadingElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  const insideParticlesRef = useRef<ParticleData[]>([]);
  const ring1Particles = useRef<ParticleData[]>([]);
  const ring2Particles = useRef<ParticleData[]>([]);
  const ring3Particles = useRef<ParticleData[]>([]);

  // Mouse movement tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

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

    // Inside particles (inside terminal)
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      
      const x = Math.random() * terminal.offsetWidth;
      const y = Math.random() * terminal.offsetHeight;
      
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      terminal.appendChild(span);

      insideParticlesRef.current.push({
        el: span,
        original: { x, y },
        target: { x, y },
        current: { x, y },
        velocity: { x: 0, y: 0 }
      });
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

        ringRef.current.push({ 
          el: span, 
          original: { x: randomX, y: randomY }, 
          target: { x, y },
          current: { x: randomX, y: randomY },
          velocity: { x: 0, y: 0 }
        });
      }
    };

    createRing(ring1Particles, "Z");
    createRing(ring2Particles, "X");
    createRing(ring3Particles, "Y");

    // Animation loop
    const animate = () => {
      if (isHovered) {
        // Attract inner particles to mouse
        insideParticlesRef.current.forEach((p) => {
          const dx = mousePos.current.x - p.current.x;
          const dy = mousePos.current.y - p.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MOUSE_ATTRACTION_RADIUS) {
            // Apply attraction force
            const force = MOUSE_ATTRACTION_FORCE * (1 - distance / MOUSE_ATTRACTION_RADIUS);
            p.velocity.x += dx * force * 0.01;
            p.velocity.y += dy * force * 0.01;
          } else {
            // Return to original position
            p.velocity.x += (p.original.x - p.current.x) * 0.01;
            p.velocity.y += (p.original.y - p.current.y) * 0.01;
          }

          // Apply velocity with damping
          p.velocity.x *= 0.9;
          p.velocity.y *= 0.9;
          p.current.x += p.velocity.x;
          p.current.y += p.velocity.y;

          // Update position
          p.el.style.left = `${p.current.x}px`;
          p.el.style.top = `${p.current.y}px`;
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current!);
      insideParticlesRef.current.forEach(p => p.el.remove());
      [ring1Particles, ring2Particles, ring3Particles].forEach(ring => ring.current.forEach(p => p.el.remove()));
    };
  }, [isHovered]);

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

    // TechCrunch glow effect
    if (techcrunchRef.current) {
      techcrunchRef.current.style.textShadow = isHovered 
        ? "0 0 10px #a855f7, 0 0 20px #ec4899, 0 0 30px #f97316"
        : "none";
    }
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
        onMouseMove={handleMouseMove}
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

        {/* TECHCRUNCH title */}
        <h1
          ref={techcrunchRef}
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-all duration-300"
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