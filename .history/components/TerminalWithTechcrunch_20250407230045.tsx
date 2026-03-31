"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 200; // Increased for better nucleus effect

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  target: { x: number; y: number; z: number };
  current: { x: number; y: number; z: number };
};

class NucleusFormer {
  particles: ParticleData[] = [];
  center: { x: number; y: number };
  radius: number;
  animationId: number | null = null;

  constructor(particles: HTMLSpanElement[], center: { x: number; y: number }, radius: number) {
    this.center = center;
    this.radius = radius;
    
    // Convert particles to 3D sphere positions
    this.particles = particles.map((el, i) => {
      // Spherical coordinates
      const phi = Math.acos(-1 + (2 * i) / particles.length);
      const theta = Math.sqrt(particles.length * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return {
        el,
        original: { x: parseFloat(el.style.left), y: parseFloat(el.style.top) },
        target: { x: center.x + x, y: center.y + y, z },
        current: { x: parseFloat(el.style.left), y: parseFloat(el.style.top), z: 0 }
      };
    });
  }

  start() {
    const animate = () => {
      let allReached = true;
      
      this.particles.forEach(p => {
        // Move toward target in 3D space
        const dx = p.target.x - p.current.x;
        const dy = p.target.y - p.current.y;
        const dz = p.target.z - p.current.z;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance > 2) {
          allReached = false;
          p.current.x += dx * 0.1;
          p.current.y += dy * 0.1;
          p.current.z += dz * 0.1;
          
          // Apply perspective transform
          const scale = 1 + p.current.z / 500;
          p.el.style.transform = `translate3d(${p.current.x}px, ${p.current.y}px, ${p.current.z}px) scale(${scale})`;
          p.el.style.opacity = `${0.3 + (0.7 * (p.current.z + this.radius) / (2 * this.radius))}`;
        }
      });
      
      if (!allReached) {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

class TextCollapser {
  letters: HTMLSpanElement[];
  animationId: number | null = null;

  constructor(letters: HTMLSpanElement[]) {
    this.letters = letters;
  }

  start(targetPosition: { x: number; y: number }, onComplete: () => void) {
    const centerX = targetPosition.x;
    const centerY = targetPosition.y;
    
    const animate = () => {
      let allCollapsed = true;
      
      this.letters.forEach((letter, i) => {
        const rect = letter.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2;
        const currentY = rect.top + rect.height / 2;
        
        const dx = centerX - currentX;
        const dy = centerY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          allCollapsed = false;
          const speed = 0.2 + (i * 0.01);
          letter.style.transform = `translate(${dx * speed}px, ${dy * speed}px) scale(${1 - speed * 0.1})`;
          letter.style.opacity = `${parseFloat(letter.style.opacity || "1") - 0.02}`;
        } else {
          letter.style.opacity = "0";
        }
      });
      
      if (!allCollapsed) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const nucleusRef = useRef<NucleusFormer | null>(null);
  const collapserRef = useRef<TextCollapser | null>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Create floating particles
    insideParticlesRef.current.forEach(p => p.remove());
    insideParticlesRef.current = [];
    
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      span.style.willChange = "transform, opacity";
      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      nucleusRef.current?.stop();
      collapserRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!terminalRef.current) return;

    if (isTurboMode) {
      // Get center position for nucleus
      const terminalRect = terminalRef.current.getBoundingClientRect();
      const center = {
        x: terminalRect.left + terminalRect.width / 2,
        y: terminalRect.top + terminalRect.height / 2
      };

      // First collapse the text
      collapserRef.current = new TextCollapser(letterRefs.current.filter(Boolean));
      collapserRef.current.start(center, () => {
        // Then form the nucleus
        nucleusRef.current = new NucleusFormer(
          insideParticlesRef.current,
          center,
          Math.min(terminalRect.width, terminalRect.height) * 0.2
        );
        nucleusRef.current.start();
      });
    } else {
      // Reset everything
      nucleusRef.current?.stop();
      collapserRef.current?.stop();

      // Reset particles
      insideParticlesRef.current.forEach(particle => {
        particle.style.transform = "";
        particle.style.opacity = `${0.4 + Math.random() * 0.5}`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
      });

      // Reset letters
      letterRefs.current.forEach(letter => {
        if (letter) {
          letter.style.transform = "";
          letter.style.opacity = "1";
        }
      });
    }
  }, [isTurboMode]);

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