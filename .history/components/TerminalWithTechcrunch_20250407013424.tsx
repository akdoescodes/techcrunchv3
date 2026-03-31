"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;

type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number, y: number };
  turbo: { x: number, y: number };
};

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);

  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringParticles = useRef<ParticleData[]>([]);

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup first
    insideParticlesRef.current.forEach(p => p.remove());
    ringParticles.current.forEach(p => p.el.remove());
    insideParticlesRef.current = [];
    ringParticles.current = [];

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

    const terminalRect = terminal.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Calculate diagonal distance from center to terminal corner
    const terminalHalfWidth = terminalRect.width / 2;
    const terminalHalfHeight = terminalRect.height / 2;
    const diagonalRadius = Math.sqrt(
      terminalHalfWidth * terminalHalfWidth + 
      terminalHalfHeight * terminalHalfHeight
    );

    // Create ring particles
    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      // Calculate positions for 45° tilted ring
      const angle = (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT;
      const tiltAngle = Math.PI / 4; // 45 degrees in radians
      
      // 3D coordinates (x,y) for a ring tilted 45° around x-axis
      const x = centerX + diagonalRadius * Math.cos(angle);
      const y = centerY + diagonalRadius * Math.sin(angle) * Math.cos(tiltAngle);
      
      // Random start position
      const randomX = Math.random() * container.offsetWidth;
      const randomY = Math.random() * container.offsetHeight;
      span.style.left = `${randomX}px`;
      span.style.top = `${randomY}px`;
      container.appendChild(span);

      ringParticles.current.push({ 
        el: span, 
        original: { x: randomX, y: randomY }, 
        turbo: { x, y } 
      });
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringParticles.current.forEach(p => p.el.remove());
    };
  }, []);

  // Turbo mode transition
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.style.perspective = isTurboMode ? "1000px" : "none";
    container.style.transformStyle = isTurboMode ? "preserve-3d" : "flat";

    ringParticles.current.forEach((p) => {
      const span = p.el;
      if (isTurboMode) {
        span.style.left = `${p.turbo.x}px`;
        span.style.top = `${p.turbo.y}px`;
        span.style.opacity = "0.8";
        span.style.transform = "rotateX(45deg)";
      } else {
        span.style.left = `${p.original.x}px`;
        span.style.top = `${p.original.y}px`;
        span.style.opacity = "0.5";
        span.style.transform = "";
      }
    });

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
        transformStyle: "preserve-3d"
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px)" : "none"
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

        {/* TURBO BUTTON */}
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

        {/* Glowing blobs with depth */}
        <div 
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-500"
          style={{
            transform: isTurboMode ? "translateZ(-100px)" : "none"
          }}
        />
        <div 
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-500"
          style={{
            transform: isTurboMode ? "translateZ(100px)" : "none"
          }}
        />
      </div>
    </div>
  );
}