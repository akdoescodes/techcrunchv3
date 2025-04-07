"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 50;
const RING_RADIUS = 200;
const RING_CENTER_OFFSET = { x: 0, y: 0 };

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const animationRef = useRef<number>();
  const outsideParticlesRef = useRef<{
    element: HTMLSpanElement;
    originalPos: { x: number; y: number };
    angle: number;
  }[]>([]);

  // Apply 3D transformations to particles
  const updateRingOrientation = () => {
    const centerX = (containerRef.current?.clientWidth || 0) / 2 + RING_CENTER_OFFSET.x;
    const centerY = (containerRef.current?.clientHeight || 0) / 2 + RING_CENTER_OFFSET.y;

    outsideParticlesRef.current.forEach((particle) => {
      // Convert spherical to cartesian coordinates with rotations
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);

      // Apply 3D rotations
      let x = RING_RADIUS * Math.cos(particle.angle);
      let y = RING_RADIUS * Math.sin(particle.angle);
      let z = 0;

      // Apply Y rotation
      const yRotX = x * cosY + z * sinY;
      const yRotZ = z * cosY - x * sinY;
      x = yRotX;
      z = yRotZ;

      // Apply X rotation
      const xRotY = y * cosX - z * sinX;
      const xRotZ = z * cosX + y * sinX;
      y = xRotY;
      z = xRotZ;

      // Apply Z rotation (optional)
      const zRotX = x * cosZ - y * sinZ;
      const zRotY = y * cosZ + x * sinZ;
      x = zRotX;
      y = zRotY;

      // Perspective projection (simple)
      const scale = 1 + z / 1000;
      const opacity = 0.3 + 0.7 * (1 - Math.abs(z) / RING_RADIUS);

      particle.element.style.left = `${centerX + x}px`;
      particle.element.style.top = `${centerY + y}px`;
      particle.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
      particle.element.style.opacity = `${opacity}`;
      particle.element.style.zIndex = `${Math.floor(z + RING_RADIUS)}`;
    });
  };

  // Animation loop for auto-rotation
  useEffect(() => {
    if (!isTurboMode) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      setRotation(prev => ({
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

  // Update particles when rotation changes
  useEffect(() => {
    if (isTurboMode) {
      updateRingOrientation();
    }
  }, [rotation, isTurboMode]);

  // Initialize particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    const insideSpans: HTMLSpanElement[] = [];

    // Inside particles (unchanged)
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
      terminal?.appendChild(span);
      insideSpans.push(span);
    }

    // Outside particles with 3D capabilities
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const terminalRect = terminal?.getBoundingClientRect();
      const padding = 40;

      for (let i = 0; i < OUTSIDE_PARTICLE_COUNT; i++) {
        const span = document.createElement("span");
        span.textContent = outsideParticles[Math.floor(Math.random() * outsideParticles.length)];
        span.className = "text-sm md:text-base absolute pointer-events-none transition-all duration-500";
        span.style.fontWeight = "bold";
        span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

        // Original random position
        let x, y;
        do {
          x = Math.random() * container.offsetWidth;
          y = Math.random() * container.offsetHeight;
        } while (
          terminalRect &&
          x > terminal.offsetLeft - padding &&
          x < terminal.offsetLeft + terminal.offsetWidth + padding &&
          y > terminal.offsetTop - padding &&
          y < terminal.offsetTop + terminal.offsetHeight + padding
        );

        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        container.appendChild(span);

        outsideParticlesRef.current.push({
          element: span,
          originalPos: { x, y },
          angle: (i * 2 * Math.PI) / OUTSIDE_PARTICLE_COUNT
        });
      }
    }

    return () => {
      insideSpans.forEach(p => terminal?.removeChild(p));
      outsideParticlesRef.current.forEach(p => containerRef.current?.removeChild(p.element));
      outsideParticlesRef.current = [];
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Toggle between ring and random positions
  useEffect(() => {
    outsideParticlesRef.current.forEach(particle => {
      if (isTurboMode) {
        updateRingOrientation();
      } else {
        particle.element.style.left = `${particle.originalPos.x}px`;
        particle.element.style.top = `${particle.originalPos.y}px`;
        particle.element.style.transform = '';
        particle.element.style.opacity = '0.5';
        particle.element.style.zIndex = '0';
      }
    });
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
      {/* Your existing terminal JSX remains exactly the same */}
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
        {/* ... (all your existing terminal content) ... */}

        {/* Enhanced Turbo Mode Button with Rotation Controls */}
        <div className="absolute right-4 bottom-4 flex flex-col space-y-2 z-20">
          <button
            onClick={() => setIsTurboMode(!isTurboMode)}
            className={`text-xs py-1 px-2 rounded border ${
              isTurboMode 
                ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_6px_#a855f7]"
                : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
            } transition-all duration-300`}
          >
            {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
          </button>
          
          {isTurboMode && (
            <div className="flex space-x-1">
              <button 
                onClick={() => setRotation(r => ({...r, x: r.x + Math.PI/8}))}
                className="text-xs p-1 bg-gray-800 rounded"
              >
                X+
              </button>
              <button 
                onClick={() => setRotation(r => ({...r, y: r.y + Math.PI/8}))}
                className="text-xs p-1 bg-gray-800 rounded"
              >
                Y+
              </button>
              <button 
                onClick={() => setRotation(r => ({...r, z: r.z + Math.PI/8}))}
                className="text-xs p-1 bg-gray-800 rounded"
              >
                Z+
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}