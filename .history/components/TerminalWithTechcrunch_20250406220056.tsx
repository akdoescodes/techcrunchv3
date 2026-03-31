"use client";

import React, { useEffect, useRef } from "react";


const codeParticles = [
  '{', '}', '<', '>', ';', '/', '=', '(', ')', '*', '[', ']', '+', '-', '&', '|', '!', '~', '%', '"', ':', '#'
];

export default function TerminalWithTechcrunch() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 70;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 8}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.4}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      particles.push(span);
      container?.appendChild(span);
    }

    return () => {
      particles.forEach(p => container?.removeChild(p));
    };
  }, []);

  return (
    <div
      className="relative w-full px-4 py-10 md:py-16 flex flex-col items-center justify-center text-center overflow-hidden"
      ref={containerRef}
    >
      {/* 👾 Terminal Box with TECHCRUNCH INSIDE */}
      <div className="relative max-w-3xl w-full bg-[#ffffff0a] border border-purple-700 rounded-lg p-6 font-mono text-sm text-gray-200 text-left shadow-[0_0_2px_#a855f766] backdrop-blur-sm z-10">

        {/* Decorative Top Strip */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Terminal lights and label */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* 💡 THE TECHCRUNCH TEXT — inside terminal box */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent tech-font text-center mb-6"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>

        {/* Optional intro text */}
        <div className="text-purple-300 font-mono text-sm md:text-base z-10 relative text-left mb-4">
          <p>&gt; Welcome to the Techcrunch Terminal</p>
          <p>&gt; Launching Event Dashboard...</p>
        </div>

      

        {/* Command line output */}
        <p>
          <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300">
            $ find events --category="tech" --sort="date"
          </span>
        </p>
        <p className="text-pink-500 animate-pulse">Crunching data...</p>
        <p className="text-green-600 font-semibold">
          Found 6 mind-blowing tech events!
        </p>

        {/* Background orbs for glow */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none" />
      </div>
    </div>
  );
}
