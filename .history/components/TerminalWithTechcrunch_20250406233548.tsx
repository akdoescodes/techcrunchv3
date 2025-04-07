"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 350; // Adjust this value to change ring size
const RING_CENTER_OFFSET = { x: 0, y: 0 }; // Adjust to offset ring center

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const outsideParticlesRef = useRef<{element: HTMLSpanElement, originalPos: {x: number, y: number}}[]>([]);

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    const insideSpans: HTMLSpanElement[] = [];

    // Inside terminal particles (unchanged)
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
      terminal?.appendChild(span);
      insideSpans.push(span);
    }

    // Outside particles with position tracking
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const terminalRect = terminal?.getBoundingClientRect();
      const centerX = containerRect.width / 2 + RING_CENTER_OFFSET.x;
      const centerY = containerRect.height / 2 + RING_CENTER_OFFSET.y;
      const padding = 40;

      for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
        const span = document.createElement("span");
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
        span.style.fontWeight = "bold";
        span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

        // Calculate original random position outside terminal
        let x, y;
        do {
          x = Math.random() * container.offsetWidth;
          y = Math.random() * container.offsetHeight;
        } while (
          terminalRect &&
          x > terminal.offsetLeft - padding &&
          x < terminal.offsetLeft + terminal.offsetWidth + padding &&
          y > terminal.offsetTop - padding &&
          y < terminal.offsetTop + terminal.offsetHeight + padding
        );

        // Calculate ring position
        const angle = (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT;
        const ringX = centerX + RING_RADIUS * Math.cos(angle);
        const ringY = centerY + RING_RADIUS * Math.sin(angle);

        // Store both positions
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        container.appendChild(span);
        
        outsideParticlesRef.current.push({
          element: span,
          originalPos: { x, y },
          ringPos: { x: ringX, y: ringY }
        });
      }
    }

    return () => {
      insideSpans.forEach(p => terminal?.removeChild(p));
      outsideParticlesRef.current.forEach(p => containerRef.current?.removeChild(p.element));
      outsideParticlesRef.current = [];
    };
  }, []);

  // Toggle between ring and random positions
  useEffect(() => {
    outsideParticlesRef.current.forEach(particle => {
      if (isTurboMode) {
        // Move to ring position
        particle.element.style.left = `${particle.ringPos.x}px`;
        particle.element.style.top = `${particle.ringPos.y}px`;
        particle.element.style.opacity = "0.8";
      } else {
        // Return to original position
        particle.element.style.left = `${particle.originalPos.x}px`;
        particle.element.style.top = `${particle.originalPos.y}px`;
        particle.element.style.opacity = "0.5";
      }
    });
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
      {/* Rest of your terminal JSX remains exactly the same */}
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10"
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

        {/* TURBOMODE Button */}
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

        {/* Background glowing orbs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
      </div>
    </div>
  );
}