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
      className="terminal p-4 md:p-6 rounded-2xl border border-purple-500 bg-gradient-to-br from-[#1f1f2f] to-[#15151f] shadow-xl w-full relative overflow-hidden"
      ref={containerRef}
    >
      {/* 🧠 Terminal UI with everything inside */}
      <div className="relative mt-2 max-w-2xl mx-auto bg-[#ffffff0a] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_2px_#a855f766] backdrop-blur-sm z-10">

        {/* Gradient bar */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Background blobs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow" />

        {/* Top bar */}
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* 🎯 TECHCRUNCH Heading inside terminal */}
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent text-center mb-4 tech-font"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>

        {/* Optional subterminal greeting */}
        <div className="mb-2 text-purple-300 font-mono text-sm md:text-base z-10 relative text-left">
          <p>&gt; Welcome to the Techcrunch Terminal</p>
          <p>&gt; Launching Event Dashboard...</p>
        </div>

        {/* 🔮 Tech 3D animation */}
        <Techcrunch3D />

        {/* 💬 Terminal output */}
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
    </div>
  );
}
