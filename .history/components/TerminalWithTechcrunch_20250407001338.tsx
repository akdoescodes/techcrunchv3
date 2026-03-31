"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 300;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const outsideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const originalPositions = useRef<{x: number, y: number}[]>([]);
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Clear existing particles
    outsideParticlesRef.current.forEach(p => p.remove());
    insideParticlesRef.current.forEach(p => p.remove());
    outsideParticlesRef.current = [];
    insideParticlesRef.current = [];
    originalPositions.current = [];

    // Create inside particles
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

    // Create outside particles
    const terminalRect = terminal.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const padding = 40;

    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      // Random position outside terminal
      let x, y;
      do {
        x = Math.random() * container.offsetWidth;
        y = Math.random() * container.offsetHeight;
      } while (
        x > terminalRect.left - padding &&
        x < terminalRect.left + terminal.offsetWidth + padding &&
        y > terminalRect.top - padding &&
        y < terminalRect.top + terminal.offsetHeight + padding
      );

      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      container.appendChild(span);
      
      outsideParticlesRef.current.push(span);
      originalPositions.current.push({x, y});
    }

    return () => {
      outsideParticlesRef.current.forEach(p => p.remove());
      insideParticlesRef.current.forEach(p => p.remove());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!isTurboMode) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      setOrientation(prev => ({
        x: prev.x + 0.003,
        y: prev.y + 0.005,
        z: prev.z + 0.001
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isTurboMode]);

  // Update particle positions with 3D orientation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || outsideParticlesRef.current.length === 0) return;

    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    outsideParticlesRef.current.forEach((particle, i) => {
      if (isTurboMode) {
        // Base ring position
        const angle = (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT;
        let x = RING_RADIUS * Math.cos(angle);
        let y = RING_RADIUS * Math.sin(angle);
        let z = 0;

        // Apply 3D rotations
        const { x: rotX, y: rotY, z: rotZ } = orientation;
        
        // Y-axis rotation
        const yRotX = x * Math.cos(rotY) + z * Math.sin(rotY);
        const yRotZ = z * Math.cos(rotY) - x * Math.sin(rotY);
        x = yRotX;
        z = yRotZ;

        // X-axis rotation
        const xRotY = y * Math.cos(rotX) - z * Math.sin(rotX);
        const xRotZ = z * Math.cos(rotX) + y * Math.sin(rotX);
        y = xRotY;
        z = xRotZ;

        // Z-axis rotation
        const zRotX = x * Math.cos(rotZ) - y * Math.sin(rotZ);
        const zRotY = y * Math.cos(rotZ) + x * Math.sin(rotZ);
        x = zRotX;
        y = zRotY;

        // Perspective effects
        const scale = 1 + z / 1000;
        const opacity = 0.3 + 0.7 * (1 - Math.abs(z) / RING_RADIUS);

        particle.style.left = `${centerX + x}px`;
        particle.style.top = `${centerY + y}px`;
        particle.style.transform = `translate(-50%, -50%) scale(${scale})`;
        particle.style.opacity = opacity;
        particle.style.zIndex = Math.floor(z + RING_RADIUS);
      } else {
        // Return to original positions
        const pos = originalPositions.current[i];
        particle.style.left = `${pos.x}px`;
        particle.style.top = `${pos.y}px`;
        particle.style.transform = '';
        particle.style.opacity = "0.5";
        particle.style.zIndex = "0";
      }
    });
  }, [isTurboMode, orientation]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
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