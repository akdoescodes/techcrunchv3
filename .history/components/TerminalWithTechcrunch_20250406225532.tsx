"use client";

import React, { useEffect, useRef } from "react";

const insideParticles = [
  "{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"
];

const outsideParticles = [
  "@", "$", "^", "_", "?", "&&", "||", "->", "++", "--", "=>", "::", ".", "..."
];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 30;

const customWidth = "";
const customHeight = "";

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const outer = outerRef.current;
    const particlesInside: HTMLSpanElement[] = [];
    const particlesOutside: HTMLSpanElement[] = [];

    // Inside terminal particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.3 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      terminal?.appendChild(span);
      particlesInside.push(span);
    }

    // Outside terminal particles (green to yellow)
    // Outside terminal particles (green to yellow)
  for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
    const span = document.createElement("span");
    span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
    span.className = "text-base md:text-lg absolute animate-floatSoft pointer-events-none z-0";
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${Math.random() * 100}%`;
    span.style.animationDuration = `${6 + Math.random() * 6}s`;
    span.style.fontWeight = "bold";
    span.style.opacity = `${0.4 + Math.random() * 0.3}`; // MORE VISIBLE
    span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
    span.style.color = `hsl(${60 + Math.random() * 60}, 100%, 60%)`; // Slightly brighter
    span.style.zIndex = "5"; // Just behind terminal text but above background
    outer?.appendChild(span);
    particlesOutside.push(span);
  }


    return () => {
      particlesInside.forEach(p => terminal?.removeChild(p));
      particlesOutside.forEach(p => outer?.removeChild(p));
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative w-full px-4 py-10 flex items-center justify-center overflow-hidden"
    >
      {/* Terminal container */}
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10"
        style={{
          width: customWidth || "100%",
          maxWidth: "720px",
          minHeight: customHeight || "auto",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
      >
        {/* Top gradient bar */}
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

        {/* Window controls */}
        <div className="flex items-center mb-6">
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

        {/* Background glowing orbs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
      </div>
    </div>
  );
}
