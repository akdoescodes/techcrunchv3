"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const RING_COUNT = 3; // Number of concentric rings

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  turbo: { x: number; y: number };
};

class Ring {
  origin: Vector3;
  radius: number;
  rotation: Vector3;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];

  constructor(origin: Vector3, radius: number, rotation: Vector3, count: number, container: HTMLDivElement) {
    this.origin = origin;
    this.radius = radius;
    this.rotation = {
      x: (rotation.x * Math.PI) / 180,
      y: (rotation.y * Math.PI) / 180,
      z: (rotation.z * Math.PI) / 180,
    };
    this.count = count;
    this.container = container;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      let x = this.radius * Math.cos(angle);
      let y = this.radius * Math.sin(angle);
      let z = 0;

      // Apply 3D rotations
      const { x: rx, y: ry, z: rz } = this.rotation;
      
      // Rotate around X axis
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);
      
      // Rotate around Y axis
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      
      // Rotate around Z axis
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      const finalX = this.origin.x + x3;
      const finalY = this.origin.y + y3;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

      // Random start position within container
      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: finalX, y: finalY },
      });
    }
  }

  updatePosition(offset: Vector3) {
    this.origin.x += offset.x;
    this.origin.y += offset.y;
    this.origin.z += offset.z;
    
    // Update all particle positions
    this.particles.forEach((p, i) => {
      const angle = (i * 2 * Math.PI) / this.count;
      let x = this.radius * Math.cos(angle);
      let y = this.radius * Math.sin(angle);
      let z = 0;

      // Apply 3D rotations
      const { x: rx, y: ry, z: rz } = this.rotation;
      
      // Rotate around X axis
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);
      
      // Rotate around Y axis
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      
      // Rotate around Z axis
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      p.turbo.x = this.origin.x + x3;
      p.turbo.y = this.origin.y + y3;
    });
  }

  destroy() {
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const [ringOffset, setRingOffset] = useState<Vector3>({ x: 0, y: 0, z: 0 });

  // Function to offset all rings
  const offsetRings = (offset: Vector3) => {
    setRingOffset(offset);
    ringsRef.current.forEach(ring => {
      ring.updatePosition(offset);
    });
  };

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup
    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(ring => ring.destroy());
    insideParticlesRef.current = [];
    ringsRef.current = [];

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

    // Calculate terminal center
    const terminalRect = terminal.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const center = {
      x: terminalRect.left - containerRect.left + terminalRect.width / 2,
      y: terminalRect.top - containerRect.top + terminalRect.height / 2,
      z: 0,
    };

    // Create multiple concentric rings with different rotations
    for (let i = 0; i < RING_COUNT; i++) {
      const radius = 300 + (i * 100); // Increasing radius for each ring
      const rotation = { 
        x: 45 + (i * 15), 
        y: 45 + (i * 15), 
        z: i * 10 
      };
      
      const ring = new Ring(
        { ...center }, // Clone center position
        radius,
        rotation,
        100, // Particles per ring
        container
      );
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    }

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(ring => ring.destroy());
    };
  }, []);

  useEffect(() => {
    if (!ringsRef.current.length || !containerRef.current) return;

    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        if (isTurboMode) {
          el.style.left = `${p.turbo.x}px`;
          el.style.top = `${p.turbo.y}px`;
          el.style.opacity = "0.8";
          el.style.transform = `rotateX(${ring.rotation.x}deg) rotateY(${ring.rotation.y}deg)`;
        } else {
          el.style.left = `${p.original.x}px`;
          el.style.top = `${p.original.y}px`;
          el.style.opacity = "0.5";
          el.style.transform = "";
        }
      });
    });

    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
    }
  }, [isTurboMode, ringOffset]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Offset Controls (for demo purposes) */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button 
          onClick={() => offsetRings({ x: 20, y: 0, z: 0 })}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Right
        </button>
        <button 
          onClick={() => offsetRings({ x: -20, y: 0, z: 0 })}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Left
        </button>
        <button 
          onClick={() => offsetRings({ x: 0, y: 20, z: 0 })}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Down
        </button>
        <button 
          onClick={() => offsetRings({ x: 0, y: -20, z: 0 })}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Up
        </button>
        <button 
          onClick={() => offsetRings({ x: 0, y: 0, z: 0 })}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Reset
        </button>
      </div>

      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-transform duration-500"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
      >
        {/* ... rest of your terminal JSX remains the same ... */}
      </div>
    </div>
  );
}