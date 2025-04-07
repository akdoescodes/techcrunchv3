"use client";

import React, { useEffect, useRef } from "react";

const codeParticles = [
  "{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"
];

const outsideParticles = [
  "$", "^", "@", "`", "?", ":", "_", "!", ">", "<", "#", "+", "-", "="
];

const TECHCRUNCH_TEXT_SIZE = "6rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 50;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Inside particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      terminal?.appendChild(span);
      particles.push(span);
    }

    return () => {
      particles.forEach(p => terminal?.removeChild(p));
    };
  }, []);

  // Outside particles
  useEffect(() => {
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
      span.className = "text-sm md:text-base fixed animate-floatSoft pointer-events-none z-0";
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.6 + Math.random() * 0.3}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 60}, 100%, 60%)`;

      const sidePadding = 100; // prevent overlap with terminal
      const topPadding = 100;

      const x = Math.random() * (window.innerWidth - 2 * sidePadding);
      const y = Math.random() * (window.innerHeight - 2 * topPadding);

      span.style.left = `${x < window.innerWidth / 2 ? x : x + sidePadding}px`;
      span.style.top = `${y < window.innerHeight / 2 ? y : y + topPadding}px`;

      span.style.animationDuration = `${5 + Math.random() * 5}s`;
      document.body.appendChild(span);
      particles.push(span);
    }

    return () => {
      particles.forEach(p => document.body.removeChild(p));
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black overflow-hidden relative px-4 py-10">
      <div
        ref={terminalRef}
        className="relative z-10 flex flex-col justify-start items-center rounded-xl border border-purple-700 shadow-[0_0_10px_#a855f7aa] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10"
        style={{
          width: "100%",
          maxWidth: "720px",
          backgroundColor: "#ffffff0a",
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

        {/* TECHCRUNCH heading */}
        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight"
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

        {/* Glow backgrounds */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
      </div>
    </div>
  );
}
