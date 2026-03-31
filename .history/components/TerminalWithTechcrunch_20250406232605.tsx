"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 50;
const RING_RADIUS_FACTOR = 0.4;
const ROTATION_SPEED = 0.005;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideParticleRefs = useRef<HTMLSpanElement[]>([]);
  const animationRef = useRef<number>();
  const [isTurboMode, setIsTurboMode] = useState(false);

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    
    if (!terminal || !container) return;

    const createParticle = (isOutside: boolean) => {
      const span = document.createElement("span");
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-1000";
      span.style.fontWeight = "bold";
      span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
      
      if (isOutside) {
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;
        span.style.opacity = "0.5";
      } else {
        span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
        span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
        span.style.left = `${Math.random() * 100}%`;
        span.style.top = `${Math.random() * 100}%`;
        span.style.animation = `floatSoft ${6 + Math.random() * 6}s infinite`;
        terminal.appendChild(span);
      }
      return span;
    };

    // Create inside particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      createParticle(false);
    }

    // Create outside particles
    const terminalRect = terminal.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const padding = 40;

    for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
      const span = createParticle(true);
      let x, y;
      
      do {
        x = Math.random() * containerRect.width;
        y = Math.random() * containerRect.height;
      } while (
        x > terminalRect.left - padding && 
        x < terminalRect.right + padding &&
        y > terminalRect.top - padding && 
        y < terminalRect.bottom + padding
      );

      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      container.appendChild(span);
      outsideParticleRefs.current.push(span);
    }

    return () => {
      outsideParticleRefs.current.forEach(p => p.remove());
      outsideParticleRefs.current = [];
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Handle turbo mode effect
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const radius = Math.min(containerRect.width, containerRect.height) * RING_RADIUS_FACTOR;
    let angle = 0;

    const updateParticlePositions = () => {
      angle += ROTATION_SPEED;
      
      outsideParticleRefs.current.forEach((particle, i) => {
        const particleAngle = angle + (i * (2 * Math.PI / OUTSIDE_PARTICLE_COUNT));
        const x = centerX + radius * Math.cos(particleAngle);
        const y = centerY + radius * Math.sin(particleAngle);
        const zDepth = 0.5 + 0.5 * Math.sin(particleAngle * 2);
        
        particle.style.transform = `translate(-50%, -50%) scale(${zDepth})`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = `${0.3 + 0.7 * zDepth}`;
      });

      animationRef.current = requestAnimationFrame(updateParticlePositions);
    };

    if (isTurboMode) {
      // Snap to ring formation
      outsideParticleRefs.current.forEach((particle, i) => {
        const particleAngle = i * (2 * Math.PI / OUTSIDE_PARTICLE_COUNT);
        const x = centerX + radius * Math.cos(particleAngle);
        const y = centerY + radius * Math.sin(particleAngle);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
      });
      
      animationRef.current = requestAnimationFrame(updateParticlePositions);
    } else {
      // Return to random positions
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      
      const terminalRect = terminalRef.current?.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const padding = 40;

      outsideParticleRefs.current.forEach(particle => {
        let x, y;
        do {
          x = Math.random() * containerRect.width;
          y = Math.random() * containerRect.height;
        } while (
          terminalRect &&
          x > terminalRect.left - padding && 
          x < terminalRect.right + padding &&
          y > terminalRect.top - padding && 
          y < terminalRect.bottom + padding
        );

        particle.style.transform = '';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = '0.5';
      });
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
        {/* Your terminal content here */}
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
      </div>
    </div>
  );
}