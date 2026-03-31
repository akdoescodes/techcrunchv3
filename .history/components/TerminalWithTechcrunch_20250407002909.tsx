"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;
const RING_RADIUS = 300;

class ParticleRing {
  constructor(radius, particleCount) {
    this.radius = radius;
    this.particleCount = particleCount;
    this.particles = [];
    this.rotation = { x: 0, y: 0 };
  }

  initialize(container, avoidRect, characters) {
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    const padding = 40;

    for (let i = 0; i < this.particleCount; i++) {
      const angle = (i * 2 * Math.PI) / this.particleCount;
      
      // Create particle element
      const span = document.createElement("span");
      span.textContent = characters[Math.floor(Math.random() * characters.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      // Set random initial position
      let x, y;
      do {
        x = Math.random() * container.offsetWidth;
        y = Math.random() * container.offsetHeight;
      } while (
        avoidRect &&
        x > avoidRect.left - padding &&
        x < avoidRect.left + avoidRect.width + padding &&
        y > avoidRect.top - padding &&
        y < avoidRect.top + avoidRect.height + padding
      );

      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      container.appendChild(span);

      this.particles.push({
        element: span,
        originalPos: { x, y },
        angle
      });
    }
  }

  updatePositions() {
    const container = this.particles[0]?.element.parentElement;
    if (!container) return;

    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    this.particles.forEach(particle => {
      const x = this.radius * Math.cos(particle.angle + this.rotation.y);
      const y = this.radius * Math.sin(particle.angle) * Math.cos(this.rotation.x);
      
      particle.element.style.left = `${centerX + x}px`;
      particle.element.style.top = `${centerY + y}px`;
      particle.element.style.opacity = `${0.5 + 0.5 * Math.cos(this.rotation.x)}`;
    });
  }

  rotateX(angle) {
    this.rotation.x = angle;
    this.updatePositions();
  }

  rotateY(angle) {
    this.rotation.y = angle;
    this.updatePositions();
  }

  toggle(enabled) {
    this.particles.forEach(particle => {
      if (enabled) {
        this.updatePositions();
      } else {
        particle.element.style.left = `${particle.originalPos.x}px`;
        particle.element.style.top = `${particle.originalPos.y}px`;
        particle.element.style.opacity = "0.5";
      }
    });
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const ringRef = useRef<ParticleRing | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Initialize ring
    ringRef.current = new ParticleRing(RING_RADIUS, OUTSIDE_PARTICLE_COUNT);
    ringRef.current.initialize(container, terminal.getBoundingClientRect(), outsideParticles);

    // Initialize inside particles
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
    }

    return () => {
      if (ringRef.current) {
        ringRef.current.particles.forEach(p => p.element.remove());
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;

    ringRef.current.toggle(isTurboMode);

    if (isTurboMode) {
      let angle = 0;
      const animate = () => {
        angle += 0.01;
        ringRef.current?.rotateX(Math.sin(angle) * 0.3);
        ringRef.current?.rotateY(angle * 0.5);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isTurboMode]);

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