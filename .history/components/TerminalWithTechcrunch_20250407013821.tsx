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
  turbo: { x: number, y: number, z: number };
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

    // Inside particles
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
    const centerX = terminalRect.left + terminalRect.width / 2;
    const centerY = terminalRect.top + terminalRect.height / 2;

    // Calculate diagonal distance
    const diagonalLength = Math.sqrt(
      Math.pow(terminalRect.width, 2) + 
      Math.pow(terminalRect.height, 2)
    );

    // Create Saturn-like ring particles
    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-700";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      // Calculate positions for 45° tilted ring (Saturn-style)
      const angle = (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT;
      const tiltAngle = Math.PI / 4; // 45 degrees
      
      // 3D coordinates for a ring tilted 45° on both x and y axes
      const x = centerX + (diagonalLength/2) * Math.cos(angle) * Math.cos(tiltAngle);
      const y = centerY + (diagonalLength/2) * Math.sin(angle) * Math.cos(tiltAngle);
      const z = (diagonalLength/2) * Math.sin(tiltAngle);

      // Random start position
      const randomX = Math.random() * container.offsetWidth;
      const randomY = Math.random() * container.offsetHeight;
      span.style.left = `${randomX}px`;
      span.style.top = `${randomY}px`;
      container.appendChild(span);

      ringParticles.current.push({ 
        el: span, 
        original: { x: randomX, y: randomY }, 
        turbo: { x, y, z } 
      });
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringParticles.current.forEach(p => p.el.remove());
    };
  }, []);

  // Turbo mode transition
  useEffect(() => {
    if (!containerRef.current || !terminalRef.current) return;

    const container = containerRef.current;
    const terminal = terminalRef.current;
    const terminalRect = terminal.getBoundingClientRect();
    const centerX = terminalRect.left + terminalRect.width / 2;
    const centerY = terminalRect.top + terminalRect.height / 2;

    container.style.perspective = isTurboMode ? "1200px" : "none";
    container.style.transformStyle = isTurboMode ? "preserve-3d" : "flat";

    ringParticles.current.forEach((p) => {
      const span = p.el;
      if (isTurboMode) {
        // Apply 3D transform with perspective
        const scale = 1 + p.turbo.z / 1000;
        span.style.transform = `
          translate3d(${p.turbo.x}px, ${p.turbo.y}px, ${p.turbo.z}px)
          rotateX(45deg)
          rotateY(45deg)
          scale(${scale})
        `;
        span.style.opacity = `${0.8 - Math.abs(p.turbo.z) / 1000}`;
        span.style.filter = `blur(${Math.abs(p.turbo.z) / 100}px)`;
      } else {
        span.style.transform = "";
        span.style.left = `${p.original.x}px`;
        span.style.top = `${p.original.y}px`;
        span.style.opacity = "0.5";
        span.style.filter = "";
      }
    });

    // Add depth to terminal
    terminal.style.transform = isTurboMode ? "translateZ(50px)" : "none";
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d"
      }}
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-all duration-700"
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-700"
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
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-700"
          style={{
            transform: isTurboMode ? "translateZ(-200px)" : "none"
          }}
        />
        <div 
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-700"
          style={{
            transform: isTurboMode ? "translateZ(200px)" : "none"
          }}
        />
      </div>
    </div>
  );
}