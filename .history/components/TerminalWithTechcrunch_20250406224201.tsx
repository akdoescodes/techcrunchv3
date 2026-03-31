"use client";

import React, { useEffect, useRef } from "react";

const codeParticles = [
  "{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"
];

const TECHCRUNCH_TEXT_SIZE = "3.5rem"; // Smaller title
const PARTICLE_COUNT = 40;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-xs md:text-sm absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.3 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      terminal?.appendChild(span);
      particles.push(span);
    }

    return () => {
      particles.forEach(p => terminal?.removeChild(p));
    };
  }, []);

  return (
    <div className="relative w-full px-2 py-4 flex items-center justify-center overflow-hidden">
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start rounded-xl border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-xs px-4 pt-6 pb-6 z-10"
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
      >
        {/* Top gradient bar */}
        <div className="w-full h-[4px] rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2" />

        {/* Window controls */}
        <div className="flex items-center mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5 shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1.5 shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 mr-1.5 shadow-md" />
          <span className="text-[10px] text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* TECHCRUNCH title */}
        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-4 leading-tight z-10"
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

        {/* Glowing orbs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-2rem] right-[-1rem] w-36 h-36 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
      </div>
    </div>
  );
}
