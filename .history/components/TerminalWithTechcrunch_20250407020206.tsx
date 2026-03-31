"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;

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

  destroy() {
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringRef = useRef<Ring | null>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Cleanup
    insideParticlesRef.current.forEach(p => p.remove());
    ringRef.current?.destroy();
    insideParticlesRef.current = [];

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

    // Calculate terminal center relative to container
    const terminalRect = terminal.getBoundingClientRect();
    const center = {
      x: terminal.offsetLeft + terminal.offsetWidth / 2,
      y: terminal.offsetTop + terminal.offsetHeight / 2,
      z: 0,
    };


    // Calculate diagonal radius
    const diagonalRadius = Math.sqrt(
      Math.pow(terminalRect.width / 2, 2) + 
      Math.pow(terminalRect.height / 2, 2)
    ) * 1.2; // Slightly larger than terminal

    // Create ring centered on terminal
    const ring = new Ring(
      { x: centerX, y: centerY, z: 0 },
      diagonalRadius,
      { x: 45, y: 45, z: 0 }, // 45° tilt on X and Y
      150, // More particles for better ring appearance
      container
    );
    ring.generateParticles(outsideParticles);
    ringRef.current = ring;

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!ringRef.current || !containerRef.current) return;
    const ring = ringRef.current;

    ring.particles.forEach(p => {
      const el = p.el;
      if (isTurboMode) {
        el.style.left = `${p.turbo.x}px`;
        el.style.top = `${p.turbo.y}px`;
        el.style.opacity = "0.8";
        el.style.transform = "rotateX(45deg) rotateY(45deg)";
      } else {
        el.style.left = `${p.original.x}px`;
        el.style.top = `${p.original.y}px`;
        el.style.opacity = "0.5";
        el.style.transform = "";
      }
    });

    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
    }
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
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
        {/* ... rest of your JSX remains the same ... */}
      </div>
    </div>
  );
}