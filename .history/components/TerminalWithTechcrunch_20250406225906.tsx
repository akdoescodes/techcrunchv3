"use client";

import React, { useEffect, useRef } from "react";

const insideParticles = [
  "{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"
];

const outsideParticles = ["{", "}", "<", ">", ";", "=", "+", "-", "!", "|", "~"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 40;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
      particles.push(span);
    }

    return () => {
      particles.forEach(p => terminal?.removeChild(p));
    };
  }, []);

  // OUTSIDE particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const particlesOutside: HTMLSpanElement[] = [];

    if (!terminal) return;

    const terminalRect = terminal.getBoundingClientRect();
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
      span.className = "text-base md:text-lg absolute animate-floatSoft pointer-events-none";
      span.style.position = "fixed";
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.5 + Math.random() * 0.4}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 60}, 100%, 60%)`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.zIndex = "5";

      const zone = Math.floor(Math.random() * 4);
      let top = 0, left = 0;

      if (zone === 0) {
        top = Math.random() * (terminalRect.top - 40);
        left = Math.random() * screenW;
      } else if (zone === 1) {
        top = terminalRect.bottom + Math.random() * (screenH - terminalRect.bottom - 40);
        left = Math.random() * screenW;
      } else if (zone === 2) {
        top = Math.random() * screenH;
        left = Math.random() * (terminalRect.left - 40);
      } else {
        top = Math.random() * screenH;
        left = terminalRect.right + Math.random() * (screenW - terminalRect.right - 40);
      }

      span.style.top = `${top}px`;
      span.style.left = `${left}px`;

      document.body.appendChild(span);
      particlesOutside.push(span);
    }

    return () => {
      particlesOutside.forEach(p => document.body.removeChild(p));
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Terminal Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={terminalRef}
          className="relative flex flex-col justify-start rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10"
          style={{
            width: "100%",
            maxWidth: "720px",
            minHeight: "auto",
            backgroundColor: "#ffffff0a",
            overflow: "hidden",
          }}
        >
          {/* Gradient Bar */}
          <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
  
          {/* Window Controls */}
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
            <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
          </div>
  
          {/* Title */}
          <h1
            className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
              fontSize: TECHCRUNCH_TEXT_SIZE,
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* Terminal Output */}
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
  
          {/* Glows */}
          <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0" />
          <div className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0" />
        </div>
      </div>
    </div>
  );
  
