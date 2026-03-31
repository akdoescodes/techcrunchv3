"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 150;
const NUCLEUS_RADIUS = 120;

type Position = { x: number; y: number; z: number };

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const particlesRef = useRef<HTMLSpanElement[]>([]);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
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
    glow.style.background = "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(236,73,153,0.4) 70%, rgba(236,73,153,0) 100%)";
    glow.style.boxShadow = "0 0 60px 20px rgba(168,85,247,0.6)";
    glow.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    glow.style.transform = "translate(-50%, -50%)";
    terminal.appendChild(glow);
    nucleusGlowRef.current = glow;

    // Create floating particles
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];
    
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-500";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.5 + Math.random() * 0.3}`;
      span.style.fontFamily = `'Fira Code', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 80%, 70%)`;
      span.style.textShadow = "0 0 8px currentColor";
      span.style.willChange = "transform, opacity";
      span.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
      terminal.appendChild(span);
      particlesRef.current.push(span);
    }

    return () => {
      particlesRef.current.forEach(p => p.remove());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (nucleusGlowRef.current) nucleusGlowRef.current.remove();
    };
  }, []);

  // Handle turbo mode changes
  useEffect(() => {
    if (!terminalRef.current || !nucleusGlowRef.current) return;

    const terminalRect = terminalRef.current.getBoundingClientRect();
    nucleusCenterRef.current = {
      x: terminalRect.width / 2,
      y: terminalRect.height / 3,
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

    // Collapse text with staggered delay
    letterRefs.current.forEach((letter, i) => {
      if (!letter) return;
      
      setTimeout(() => {
        letter.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        letter.style.transform = "translate(-50%, -50%) scale(0.1)";
        letter.style.opacity = "0";
        letter.style.filter = "blur(2px)";
      }, i * 60);
    });

    // Form nucleus after text collapses
    setTimeout(() => {
      if (!isTurboMode) return;
      
      const particles = particlesRef.current;
      const center = nucleusCenterRef.current;
      const radius = NUCLEUS_RADIUS * 0.8;

      // Create spherical positions with golden ratio distribution
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const positions: Position[] = [];
      
      for (let i = 0; i < particles.length; i++) {
        const y = 1 - (i / (particles.length - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y) * radius;
        const theta = 2 * Math.PI * i / goldenRatio;
        
        positions.push({
          x: Math.cos(theta) * radiusAtY,
          y: y * radius,
          z: Math.sin(theta) * radiusAtY
        });
      }

      // Animate particles to their positions
      particles.forEach((particle, i) => {
        const target = positions[i];
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        
        particle.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        particle.style.left = `${center.x + target.x}px`;
        particle.style.top = `${center.y + target.y}px`;
        particle.style.opacity = "1";
        particle.style.color = `hsl(${270 + Math.random() * 40}, 85%, 70%)`;
        particle.style.textShadow = `0 0 12px hsl(${270 + Math.random() * 40}, 85%, 70%)`;
      });

      // Start orbiting animation
      startOrbitingAnimation();
    }, letterRefs.current.length * 60 + 300);
  };

  const startOrbitingAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const particles = particlesRef.current;
    const center = nucleusCenterRef.current;
    const radius = NUCLEUS_RADIUS * 0.8;
    const timeStart = Date.now();
    
    const animate = () => {
      if (!isTurboMode) return;
      
      const time = (Date.now() - timeStart) / 1000;
      
      particles.forEach((particle, i) => {
        const angle = time * (0.5 + i * 0.002);
        const y = Math.sin(time * 0.3 + i * 0.1) * radius * 0.3;
        const radiusAtY = Math.sqrt(1 - Math.pow(y / radius, 2)) * radius;
        
        const x = Math.cos(angle) * radiusAtY;
        const z = Math.sin(angle) * radiusAtY;
        
        // Apply perspective
        const scale = 0.8 + (z + radius) / (radius * 2) * 0.4;
        const opacity = 0.6 + (z + radius) / (radius * 2) * 0.4;
        
        particle.style.transform = `translate3d(0, 0, ${z}px) scale(${scale})`;
        particle.style.opacity = `${opacity}`;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const resetToDefault = () => {
    if (nucleusGlowRef.current) {
      nucleusGlowRef.current.style.width = "0px";
      nucleusGlowRef.current.style.height = "0px";
      nucleusGlowRef.current.style.opacity = "0";
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
    particlesRef.current.forEach(particle => {
      particle.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
      particle.style.transform = "";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${0.5 + Math.random() * 0.3}`;
      particle.style.color = `hsl(${260 + Math.random() * 60}, 80%, 70%)`;
      particle.style.textShadow = "0 0 8px currentColor";
    });

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-xl border-2 border-purple-700/50 shadow-[0_0_15px_#a855f744] backdrop-blur-lg text-gray-200 font-mono text-sm px-8 pt-12 pb-12 z-10 transition-all duration-500"
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "rgba(10, 8, 24, 0.7)",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.3)",
        }}
      >
        {/* Terminal header */}
        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-6 shadow-[0_0_8px_#ec489966]" />
        <div className="flex items-center mb-8 self-start">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 mr-3 shadow-[0_0_6px_#ef4444]" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 mr-3 shadow-[0_0_6px_#facc15]" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-400 mr-3 shadow-[0_0_6px_#4ade80]" />
          <span className="text-xs text-purple-300/80 ml-3 font-medium">terminal://techcrunch-mode</span>
        </div>

        {/* TECHCRUNCH text */}
        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-8 leading-tight z-10 relative"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            textShadow: "0 0 15px rgba(168, 85, 247, 0.5)",
          }}
        >
          {"TECHCRUNCH".split("").map((letter, index) => (
            <span
              key={index}
              ref={el => el && (letterRefs.current[index] = el)}
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
          <p className="text-green-400/90">
            <span className="text-green-300 font-medium">user@techcrunch</span>:
            <span className="text-gray-300/90"> ~/ $ activate --nucleus-mode</span>
          </p>
          <p className="text-pink-400/90 animate-pulse flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2 shadow-[0_0_4px_#ec4899]"></span>
            Initializing quantum code digestion...
          </p>
          <p className="text-green-300 font-medium flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-2 shadow-[0_0_4px_#4ade80]"></span>
            System ready for nucleus transformation
          </p>
        </div>

        {/* Turbo mode toggle */}
        <button
          onClick={() => setIsTurboMode(!isTurboMode)}
          className={`absolute right-6 bottom-6 text-xs py-2 px-4 rounded-lg border-2 ${
            isTurboMode
              ? "bg-purple-900/80 border-purple-400 text-white shadow-[0_0_15px_#a855f7] hover:shadow-[0_0_20px_#a855f7]"
              : "bg-transparent border-purple-700/50 text-purple-300/80 hover:border-purple-400 hover:text-purple-200"
          } transition-all duration-300 z-20 font-medium flex items-center`}
        >
          {isTurboMode ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2 shadow-[0_0_4px_#a855f7] animate-pulse"></span>
              NUCLEUS ACTIVE
            </>
          ) : (
            "ACTIVATE NUCLEUS"
          )}
        </button>

        {/* Background effects */}
        <div
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-1000"
          style={{ 
            transform: isTurboMode ? "translateZ(-100px) scale(1.2)" : "none",
            opacity: isTurboMode ? 0.4 : 0.2
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl pointer-events-none z-0 transition-all duration-1000 animate-spin-slow"
          style={{ 
            transform: isTurboMode ? "translateZ(50px) scale(1.1)" : "none",
            opacity: isTurboMode ? 0.3 : 0.15
          }}
        />
      </div>
    </div>
  );
}