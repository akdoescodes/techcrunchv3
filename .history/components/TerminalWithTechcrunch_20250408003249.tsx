"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const MOUSE_INFLUENCE_RADIUS = 150;
const MOUSE_ATTRACT_STRENGTH = 0.2;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<{el: HTMLSpanElement, x: number, y: number, ox: number, oy: number}[]>([]);
  const animationRef = useRef<number>();

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Animation loop
  const animate = () => {
    particlesRef.current.forEach(particle => {
      // Calculate distance to mouse
      const dx = mousePos.x - particle.x;
      const dy = mousePos.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Move toward mouse if within influence radius
      if (distance < MOUSE_INFLUENCE_RADIUS && distance > 5) {
        const force = MOUSE_ATTRACT_STRENGTH * (1 - distance / MOUSE_INFLUENCE_RADIUS);
        particle.x += dx * force;
        particle.y += dy * force;
      } else {
        // Return to original position
        particle.x += (particle.ox - particle.x) * 0.05;
        particle.y += (particle.oy - particle.y) * 0.05;
      }

      // Update position
      particle.el.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    // Clear existing particles
    particlesRef.current.forEach(p => p.el.remove());
    particlesRef.current = [];

    // Create new particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      const x = Math.random() * terminal.offsetWidth;
      const y = Math.random() * terminal.offsetHeight;

      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute pointer-events-none z-0 transition-transform duration-300";
      span.style.left = "0";
      span.style.top = "0";
      span.style.fontWeight = "bold";
      span.style.fontFamily = "'Fira Code', monospace";
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      span.style.opacity = `${0.5 + Math.random() * 0.5}`;
      span.style.transform = `translate(${x}px, ${y}px)`;

      terminal.appendChild(span);

      particlesRef.current.push({
        el: span,
        x,
        y,
        ox: x,
        oy: y
      });
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      particlesRef.current.forEach(p => p.el.remove());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10">
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Terminal content */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
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
      </div>
    </div>
  );
}