"use client";

import React, { useEffect, useRef, useState } from "react";

// Particle characters
const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

// Constants
const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const OUTSIDE_PARTICLE_COUNT = 100;

// Ring Class Definition
class ParticleRing {
  constructor(radius, particleCount, centerOffset = { x: 0, y: 0 }) {
    this.radius = radius;
    this.particleCount = particleCount;
    this.centerOffset = centerOffset;
    this.rotation = { x: 0, y: 0, z: 0 };
    this.particles = [];
    this.autoRotate = true;
    this.rotationSpeed = { x: 0.003, y: 0.005, z: 0.001 };
  }

  initializeParticles(container, avoidRect, characters) {
    const centerX = (container.clientWidth / 2) + this.centerOffset.x;
    const centerY = (container.clientHeight / 2) + this.centerOffset.y;
    const padding = 40;

    for (let i = 0; i < this.particleCount; i++) {
      const angle = (i * 2 * Math.PI) / this.particleCount;
      const ringX = centerX + this.radius * Math.cos(angle);
      const ringY = centerY + this.radius * Math.sin(angle);

      // Find random position outside avoidance area
      let randX, randY;
      do {
        randX = Math.random() * container.offsetWidth;
        randY = Math.random() * container.offsetHeight;
      } while (
        avoidRect &&
        randX > avoidRect.left - padding &&
        randX < avoidRect.left + avoidRect.width + padding &&
        randY > avoidRect.top - padding &&
        randY < avoidRect.top + avoidRect.height + padding
      );

      const span = document.createElement("span");
      span.textContent = characters[Math.floor(Math.random() * characters.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;
      span.style.left = `${randX}px`;
      span.style.top = `${randY}px`;
      container.appendChild(span);

      this.particles.push({
        element: span,
        originalPos: { x: randX, y: randY },
        angle,
        ringPos: { x: ringX, y: ringY }
      });
    }
  }

  updateParticles() {
    const centerX = (this.container.clientWidth / 2) + this.centerOffset.x;
    const centerY = (this.container.clientHeight / 2) + this.centerOffset.y;

    this.particles.forEach(particle => {
      // Apply 3D rotations
      const cosX = Math.cos(this.rotation.x);
      const sinX = Math.sin(this.rotation.x);
      const cosY = Math.cos(this.rotation.y);
      const sinY = Math.sin(this.rotation.y);
      
      let x = this.radius * Math.cos(particle.angle);
      let y = this.radius * Math.sin(particle.angle);
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

      // Perspective effects
      const depth = z / 1000;
      const scale = 1 + depth * 0.5;
      const opacity = 0.3 + 0.7 * (1 - Math.abs(depth));

      particle.element.style.left = `${centerX + x}px`;
      particle.element.style.top = `${centerY + y}px`;
      particle.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
      particle.element.style.opacity = opacity;
      particle.element.style.zIndex = Math.floor(z + this.radius);
    });
  }

  toggleRingMode(enable) {
    this.particles.forEach(particle => {
      if (enable) {
        this.updateParticles();
      } else {
        particle.element.style.left = `${particle.originalPos.x}px`;
        particle.element.style.top = `${particle.originalPos.y}px`;
        particle.element.style.transform = '';
        particle.element.style.opacity = '0.5';
      }
    });
  }

  animate() {
    if (!this.autoRotate) return;
    
    this.rotation.x += this.rotationSpeed.x;
    this.rotation.y += this.rotationSpeed.y;
    this.rotation.z += this.rotationSpeed.z;
    this.updateParticles();
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
    ringRef.current = new ParticleRing(300, OUTSIDE_PARTICLE_COUNT);
    ringRef.current.initializeParticles(
      container,
      terminal.getBoundingClientRect(),
      outsideParticles
    );

    // Initialize inside particles (unchanged)
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
        ringRef.current.particles.forEach(p => container.removeChild(p.element));
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;

    ringRef.current.toggleRingMode(isTurboMode);

    if (isTurboMode) {
      const animate = () => {
        ringRef.current?.animate();
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

  // ... (rest of your terminal UI remains exactly the same)
  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
      {/* Your complete terminal UI JSX */}
    </div>
  );
}