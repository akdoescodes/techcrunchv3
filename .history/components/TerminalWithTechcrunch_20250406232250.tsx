"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 50;

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideParticleRefs = useRef<HTMLSpanElement[]>([]); // Fixed initialization
  const animationRef = useRef<number>();
  const [isTurboMode, setIsTurboMode] = useState(false);

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    
    // Initialize particles
    if (terminal && container) {
      const terminalRect = terminal.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const radius = Math.min(containerRect.width, containerRect.height) * 0.4;

      // Create outside particles
      for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
        const span = document.createElement("span");
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-1000";
        span.style.fontWeight = "bold";
        span.style.opacity = "0.5";
        span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

        // Position randomly outside terminal initially
        let x, y;
        const padding = 40;
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
    }

    return () => {
      outsideParticleRefs.current.forEach(p => p.remove());
      outsideParticleRefs.current = [];
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const radius = Math.min(containerRect.width, containerRect.height) * 0.4;
    let angle = 0;

    const updateParticlePositions = () => {
      if (!isTurboMode) return;

      angle += 0.005;
      outsideParticleRefs.current.forEach((particle, i) => {
        const particleAngle = angle + (i * (2 * Math.PI / OUTSIDE_PARTICLE_COUNT));
        const x = centerX + radius * Math.cos(particleAngle);
        const y = centerY + radius * Math.sin(particleAngle);
        
        // Add slight Z-depth variation
        const zDepth = 0.5 + 0.5 * Math.sin(particleAngle * 2);
        particle.style.transform = `translate(-50%, -50%) scale(${zDepth})`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = `${0.3 + 0.7 * zDepth}`;
      });

      animationRef.current = requestAnimationFrame(updateParticlePositions);
    };

    if (isTurboMode) {
      // Snap particles to ring first
      outsideParticleRefs.current.forEach((particle, i) => {
        const particleAngle = i * (2 * Math.PI / OUTSIDE_PARTICLE_COUNT);
        const x = centerX + radius * Math.cos(particleAngle);
        const y = centerY + radius * Math.sin(particleAngle);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
      });
      
      // Start animation
      animationRef.current = requestAnimationFrame(updateParticlePositions);
    } else {
      // Return to random positions
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const containerRect = container.getBoundingClientRect();
      const terminalRect = terminalRef.current?.getBoundingClientRect();
      
      outsideParticleRefs.current.forEach(particle => {
        let x, y;
        const padding = 40;
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
      {/* ... (rest of your terminal JSX remains the same) */}
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
  );
}