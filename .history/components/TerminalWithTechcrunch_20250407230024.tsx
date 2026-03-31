"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 200;

type Position = { x: number; y: number; z: number };

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const particlesRef = useRef<HTMLSpanElement[]>([]);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const animationRef = useRef<number | null>(null);
  const nucleusCenterRef = useRef<Position>({ x: 0, y: 0, z: 0 });

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    // Clear existing particles
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];

    // Create new particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-300";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      span.style.willChange = "transform, opacity";
      terminal.appendChild(span);
      particlesRef.current.push(span);
    }

    return () => {
      particlesRef.current.forEach(p => p.remove());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Handle turbo mode changes
  useEffect(() => {
    if (!terminalRef.current) return;

    // Calculate center position
    const terminalRect = terminalRef.current.getBoundingClientRect();
    nucleusCenterRef.current = {
      x: terminalRect.width / 2,
      y: terminalRect.height / 2,
      z: 0
    };

    if (isTurboMode) {
      startNucleusFormation();
    } else {
      resetToDefault();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isTurboMode]);

  const startNucleusFormation = () => {
    // First collapse the text
    collapseText(() => {
      // Then form the nucleus
      formNucleus();
    });
  };

  const collapseText = (onComplete: () => void) => {
    const letters = letterRefs.current.filter(Boolean);
    if (letters.length === 0) {
      onComplete();
      return;
    }

    let completed = 0;
    const center = nucleusCenterRef.current;

    letters.forEach((letter, i) => {
      const startX = letter.offsetLeft + letter.offsetWidth / 2;
      const startY = letter.offsetTop + letter.offsetHeight / 2;
      
      const animate = (progress: number) => {
        const ease = Math.sin(progress * Math.PI / 2); // Ease-out
        const x = startX + (center.x - startX) * ease;
        const y = startY + (center.y - startY) * ease;
        
        letter.style.transform = `translate(${x - startX}px, ${y - startY}px) scale(${1 - ease * 0.9})`;
        letter.style.opacity = `${1 - ease}`;
        
        if (progress < 1) {
          requestAnimationFrame(() => animate(progress + 0.02));
        } else {
          completed++;
          if (completed === letters.length) onComplete();
        }
      };
      
      animate(0);
    });
  };

  const formNucleus = () => {
    const particles = particlesRef.current;
    const center = nucleusCenterRef.current;
    const radius = Math.min(terminalRef.current?.offsetWidth || 300, terminalRef.current?.offsetHeight || 300) * 0.2;

    // Create spherical positions
    const sphericalPositions: Position[] = [];
    for (let i = 0; i < particles.length; i++) {
      const phi = Math.acos(-1 + (2 * i) / particles.length);
      const theta = Math.sqrt(particles.length * Math.PI) * phi;
      
      sphericalPositions.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      });
    }

    // Animate particles to their positions
    particles.forEach((particle, i) => {
      const target = sphericalPositions[i];
      const startX = parseFloat(particle.style.left);
      const startY = parseFloat(particle.style.top);
      
      const animate = (progress: number) => {
        const ease = Math.sin(progress * Math.PI / 2); // Ease-out
        
        const x = startX + (center.x + target.x - startX) * ease;
        const y = startY + (center.y + target.y - startY) * ease;
        const z = target.z * ease;
        
        // Apply perspective
        const scale = 1 + z / 500;
        particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
        particle.style.opacity = `${0.3 + (0.7 * (z + radius) / (2 * radius))}`;
        
        if (progress < 1) {
          requestAnimationFrame(() => animate(progress + 0.01));
        }
      };
      
      animate(0);
    });
  };

  const resetToDefault = () => {
    // Reset letters
    letterRefs.current.forEach(letter => {
      if (letter) {
        letter.style.transform = "";
        letter.style.opacity = "1";
      }
    });

    // Reset particles
    particlesRef.current.forEach(particle => {
      particle.style.transform = "";
      particle.style.opacity = `${0.4 + Math.random() * 0.5}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
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
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
          }}
        >
          {"TECHCRUNCH".split("").map((letter, index) => (
            <span
              key={index}
              ref={el => el && (letterRefs.current[index] = el)}
              style={{ display: "inline-block", transition: "transform 0.3s ease, opacity 0.3s ease" }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <div className="text-left w-full space-y-1 z-10">
          <p>
            <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300"> $ find events --category="tech" --sort="date"</span>
          </p>
          <p className="text-pink-500 animate-pulse">Crunching data...</p>
          <p className="text-green-600 font-semibold">Found 6 mind-blowing tech events!</p>
        </div>

        <button
          onClick={() => setIsTurboMode(!isTurboMode)}
          className={`absolute right-4 bottom-4 text-xs py-1 px-2 rounded border ${
            isTurboMode
              ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_6px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-300 z-20`}
        >
          {isTurboMode ? "NUCLEUS MODE" : "NORMAL MODE"}
        </button>
      </div>
    </div>
  );
}