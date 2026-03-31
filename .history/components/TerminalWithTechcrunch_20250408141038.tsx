"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 200;
const NUCLEUS_RADIUS = 80;

type Position = { x: number; y: number; z: number };

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const particlesRef = useRef<HTMLSpanElement[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);
  const nucleusCenterRef = useRef<Position>({ x: 0, y: 0, z: 0 });
  const nucleusGlowRef = useRef<HTMLDivElement>(null);

  // Initialize particles and effects
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    // Create nucleus glow element
    const glow = document.createElement("div");
    glow.className = "absolute rounded-full z-10 pointer-events-none";
    glow.style.width = "0px";
    glow.style.height = "0px";
    glow.style.opacity = "0";
    glow.style.background = "radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(236,73,153,0.5) 70%, rgba(236,73,153,0) 100%)";
    glow.style.boxShadow = "0 0 40px 15px rgba(168,85,247,0.7)";
    glow.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    glow.style.transform = "translate(-50%, -50%)";
    terminal.appendChild(glow);
    nucleusGlowRef.current = glow;

    // Create floating particles
    particlesRef.current.forEach(p => p?.remove());
    particlesRef.current = [];
    
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-500";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.6 + Math.random() * 0.3}`;
      span.style.fontFamily = `'Fira Code', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 80%, 60%)`;
      span.style.textShadow = "0 0 6px currentColor";
      span.style.willChange = "transform, opacity";
      span.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
      terminal.appendChild(span);
      particlesRef.current.push(span);
    }

    return () => {
      particlesRef.current.forEach(p => p?.remove());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      nucleusGlowRef.current?.remove();
    };
  }, []);

  // Handle turbo mode changes
  useEffect(() => {
    if (!terminalRef.current || !nucleusGlowRef.current) return;

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
    if (!nucleusGlowRef.current) return;

    // Position and activate glow
    const glow = nucleusGlowRef.current;
    glow.style.left = `${nucleusCenterRef.current.x}px`;
    glow.style.top = `${nucleusCenterRef.current.y}px`;
    glow.style.width = `${NUCLEUS_RADIUS * 2}px`;
    glow.style.height = `${NUCLEUS_RADIUS * 2}px`;
    glow.style.opacity = "1";

    // Collapse text to center with staggered delay
    letterRefs.current.forEach((letter, i) => {
      if (!letter || !terminalRef.current) return;
      
      const rect = letter.getBoundingClientRect();
      const startX = rect.left + rect.width/2 - terminalRef.current.offsetLeft;
      const startY = rect.top + rect.height/2 - terminalRef.current.offsetTop;
      
      setTimeout(() => {
        letter.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        letter.style.transform = `
          translate(${nucleusCenterRef.current.x - startX}px, ${nucleusCenterRef.current.y - startY}px)
          scale(0.1)
        `;
        letter.style.opacity = "0";
        letter.style.filter = "blur(2px)";
      }, i * 60);
    });

    // Form nucleus after text collapses
    setTimeout(() => {
      if (!isTurboMode) return;
      
      const particles = particlesRef.current;
      const center = nucleusCenterRef.current;
      const radius = NUCLEUS_RADIUS * 0.7;

      // Create spherical positions with Fibonacci sphere algorithm
      const positions: Position[] = [];
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < particles.length; i++) {
        const y = 1 - (i / (particles.length - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y) * radius;
        const theta = goldenAngle * i;
        
        positions.push({
          x: Math.cos(theta) * radiusAtY,
          y: y * radius,
          z: Math.sin(theta) * radiusAtY
        });
      }

      // Animate particles to their positions with procedural delays
      particles.forEach((particle, i) => {
        const target = positions[i];
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        
        setTimeout(() => {
          particle.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
          particle.style.left = `${center.x + target.x}px`;
          particle.style.top = `${center.y + target.y}px`;
          particle.style.opacity = "1";
          particle.style.color = `hsl(${270 + Math.random() * 40}, 90%, 65%)`;
          particle.style.textShadow = `0 0 10px hsl(${270 + Math.random() * 40}, 90%, 65%)`;
        }, i * 10);
      });

      startNuclearAnimation();
    }, letterRefs.current.length * 60 + 300);
  };

  const startNuclearAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const particles = particlesRef.current;
    const center = nucleusCenterRef.current;
    const radius = NUCLEUS_RADIUS * 0.7;
    const timeStart = Date.now();
    
    const animate = () => {
      if (!isTurboMode) return;
      
      const time = (Date.now() - timeStart) / 1000;
      
      particles.forEach((particle, i) => {
        const pulse = Math.sin(time * 2 + i * 0.1) * 0.1 + 1;
        const orbitSpeed = 0.3 + (i % 3) * 0.1;
        const angle = time * orbitSpeed + i * 0.05;
        const y = Math.sin(time * 0.5 + i * 0.02) * radius * 0.3;
        const radiusAtY = Math.sqrt(1 - Math.pow(y / radius, 2)) * radius;
        
        const x = Math.cos(angle) * radiusAtY * pulse;
        const z = Math.sin(angle) * radiusAtY * pulse;
        
        const scale = 0.7 + (z + radius) / (radius * 2) * 0.6;
        const opacity = 0.7 + (z + radius) / (radius * 2) * 0.3;
        
        particle.style.transform = `translate3d(0, 0, ${z}px) scale(${scale})`;
        particle.style.opacity = `${opacity}`;
        
        const hue = (270 + Math.sin(time * 0.5 + i * 0.01) * 20) % 360;
        particle.style.color = `hsl(${hue}, 90%, 65%)`;
        particle.style.textShadow = `0 0 8px hsl(${hue}, 90%, 65%)`;
      });
      
      if (nucleusGlowRef.current) {
        const pulse = Math.sin(time * 1.5) * 0.1 + 0.9;
        nucleusGlowRef.current.style.transform = `translate(-50%, -50%) scale(${pulse})`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const resetToDefault = () => {
    if (nucleusGlowRef.current) {
      nucleusGlowRef.current.style.width = "0px";
      nucleusGlowRef.current.style.height = "0px";
      nucleusGlowRef.current.style.opacity = "0";
      nucleusGlowRef.current.style.transform = "translate(-50%, -50%) scale(1)";
    }

    // Reset letters
    letterRefs.current.forEach((letter, i) => {
      if (!letter) return;
      
      setTimeout(() => {
        letter.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        letter.style.transform = "";
        letter.style.opacity = "1";
        letter.style.filter = "none";
      }, i * 40);
    });

    // Reset particles
    particlesRef.current.forEach((particle, i) => {
      setTimeout(() => {
        particle.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        particle.style.transform = "";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = `${0.6 + Math.random() * 0.3}`;
        particle.style.color = `hsl(${260 + Math.random() * 60}, 80%, 60%)`;
        particle.style.textShadow = "0 0 6px currentColor";
      }, i * 5);
    });

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10 bg-transparent"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-xl border border-gray-200 shadow-lg text-gray-800 font-mono text-sm px-8 pt-12 pb-12 z-10 transition-all duration-500 bg-white/80 backdrop-blur-sm"
        style={{
          width: "100%",
          maxWidth: "800px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Terminal header */}
        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-6" />
        <div className="flex items-center mb-8 self-start">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 mr-3" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 mr-3" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-400 mr-3" />
          <span className="text-xs text-gray-500 ml-3 font-medium">terminal://nucleus-mode</span>
        </div>

        {/* TECHCRUNCH text */}
        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-8 leading-tight z-10 relative"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            WebkitBackgroundClip: "text",
          }}
        >
          {"TECHCRUNCH".split("").map((letter, index) => (
            <span
              key={index}
              ref={el => { if (el) letterRefs.current[index] = el; }}
              className="inline-block relative"
              style={{ 
                transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                transformOrigin: "center center"
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Terminal content */}
        <div className="text-left w-full space-y-2 z-10">
          <p>
            <span className="text-purple-600 font-medium">user@techcrunch</span>:
            <span className="text-gray-600"> ~/ $ activate --nuclear-mode</span>
          </p>
          <p className="text-pink-500 animate-pulse flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-pink-500 mr-2 animate-pulse"></span>
            Initializing nuclear transformation...
          </p>
          <p className="text-purple-600 font-medium flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
            Ready for quantum code compression
          </p>
        </div>

        {/* Turbo mode toggle */}
        <button
          onClick={() => setIsTurboMode(!isTurboMode)}
          className={`absolute right-6 bottom-6 text-xs py-2 px-4 rounded-lg border ${
            isTurboMode
              ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_#a855f7]"
              : "bg-white/80 border-gray-300 text-gray-600 hover:border-purple-400"
          } transition-all duration-300 z-20 font-medium flex items-center backdrop-blur-sm`}
        >
          {isTurboMode ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
              NUCLEAR ACTIVE
            </>
          ) : (
            "ACTIVATE NUCLEUS"
          )}
        </button>
      </div>
    </div>
  );
}s