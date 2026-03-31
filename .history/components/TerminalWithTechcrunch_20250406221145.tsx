"use client";

import React, { useEffect, useRef } from "react";

const codeParticles = [
  "{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"
];

const customWidth = ""; // e.g., "90%" or "700px"
const customHeight = ""; // e.g., "500px"
const TECHCRUNCH_TEXT_SIZE = "3rem";
const PARTICLE_COUNT = 50;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.3 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      particles.push(span);
      terminal?.appendChild(span);
    }

    return () => {
      particles.forEach(p => terminal?.removeChild(p));
    };
  }, []);

  return (
    <div className="relative w-full px-4 py-10 flex justify-center items-center overflow-hidden">
      <div
        ref={terminalRef}
        className="relative rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm font-mono text-sm z-10 overflow-hidden bg-[#ffffff0a] w-full"
        style={{
          width: customWidth || "100%",
          maxWidth: "720px",
          minHeight: customHeight || "20rem",
        }}
      >
        {/* Top Gradient */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Window Controls */}
        <div className="flex items-center px-6 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* Terminal Content */}
        <div className="w-full px-6 pb-6 box-border">
          <h1
            className="font-extrabold bg-clip-text text-transparent text-center mb-6 break-words"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
              fontSize: TECHCRUNCH_TEXT_SIZE,
            }}
          >
            TECHCRUNCH
          </h1>

          <div className="text-left break-words whitespace-pre-wrap leading-relaxed text-sm md:text-base text-gray-200">
            <p>
              <span className="text-green-600">user@techcrunch</span>
              <span className="text-gray-300">:$ find events --category="tech" --sort="date"</span>
            </p>
            <p className="text-pink-500 animate-pulse">Crunching data...</p>
            <p className="text-green-600 font-semibold">Found 6 mind-blowing tech events!</p>
          </div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none" />
      </div>
    </div>
  );
}
