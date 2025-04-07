"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const MOUSE_INFLUENCE_RADIUS = 150;
const MOUSE_ATTRACT_STRENGTH = 0.1;

type Particle = {
  el: HTMLSpanElement;
  originalX: number;
  originalY: number;
  x: number;
  y: number;
  hasGlow: boolean;
};

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Start off-screen
  const particlesRef = useRef<Particle[]>([]);
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
  const animateParticles = () => {
    particlesRef.current.forEach(particle => {
      // Calculate distance to mouse
      const dx = mousePos.x - particle.x;
      const dy = mousePos.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Move toward mouse if within influence radius
      if (distance < MOUSE_INFLUENCE_RADIUS) {
        const directionX = dx / distance;
        const directionY = dy / distance;
        const strength = MOUSE_ATTRACT_STRENGTH * (1 - distance / MOUSE_INFLUENCE_RADIUS);
        
        particle.x += directionX * strength;
        particle.y += directionY * strength;
      }

      // Slowly return to original position
      particle.x += (particle.originalX - particle.x) * 0.05;
      particle.y += (particle.originalY - particle.y) * 0.05;

      // Update DOM
      particle.el.style.left = `${particle.x}px`;
      particle.el.style.top = `${particle.y}px`;

      // Enhance glow when near mouse
      if (distance < MOUSE_INFLUENCE_RADIUS / 2 && particle.hasGlow) {
        particle.el.style.transform = `scale(1.2)`;
      } else if (particle.hasGlow) {
        particle.el.style.transform = 'scale(1)';
      }
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    // Add glow animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 15px currentColor, 0 0 20px currentColor; }
      }
    `;
    document.head.appendChild(style);

    // Create particles
    particlesRef.current = Array.from({ length: INSIDE_PARTICLE_COUNT }, () => {
      const span = document.createElement("span");
      const x = Math.random() * terminal.offsetWidth;
      const y = Math.random() * terminal.offsetHeight;
      const hasGlow = Math.random() < 0.3;

      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300";
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;

      if (hasGlow) {
        span.style.color = `hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.textShadow = `0 0 6px hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.animation = `glowPulse ${4 + Math.random() * 5}s infinite alternate`;
      } else {
        span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      }

      terminal.appendChild(span);

      return {
        el: span,
        originalX: x,
        originalY: y,
        x,
        y,
        hasGlow
      };
    });

    // Start animation
    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      particlesRef.current.forEach(p => p.el.remove());
      document.head.removeChild(style);
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
        onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
      >
        {/* Terminal content remains the same */}
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