"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 30;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  target: { x: number; y: number };
  hasGlow: boolean;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  delay: number;
  currentOrbitAngle: number;
  orbitRadius: number;
  spinDirection: number;
};

class Ring {
  origin: Vector3;
  radius: number;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  animationId: number | null = null;
  isAnimating: boolean = false;
  globalAngle: number = 0;
  globalSpinSpeed: number;

  constructor(origin: Vector3, radius: number, count: number, container: HTMLDivElement, spinSpeed: number = 0) {
    this.origin = origin;
    this.radius = radius;
    this.count = count;
    this.container = container;
    this.globalSpinSpeed = spinSpeed;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);

      const finalX = this.origin.x + x;
      const finalY = this.origin.y + y;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-1000 ease-out";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.opacity = "0";
      span.style.willChange = "transform, opacity";

      // Size variation
      const size = 0.7 + Math.random() * 1.8; // Increased base size
      span.style.fontSize = `${size * 0.8}rem`; // Slightly larger

      // More prominent glow effects
      const hasGlow = Math.random() < 0.5; // Increased probability
      const hue = 60 + Math.random() * 60; // Wider hue range
      const saturation = 70 + Math.random() * 30; // Wider saturation range

      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, 80%)`; // Brighter glow
        span.style.textShadow = `0 0 ${10 + Math.random() * 10}px hsl(${hue}, ${saturation}%, 75%)`; // More intense shadow
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${60 + Math.random() * 30}%)`; // More visible non-glow
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        target: { x: finalX, y: finalY },
        hasGlow,
        angle,
        radius: this.radius,
        size,
        speed: 0.9 + Math.random() * 0.5, // Slightly faster
        delay: Math.random() * 0.3, // Shorter delay
        currentOrbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 8 + Math.random() * 18, // Larger orbit radius
        spinDirection: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  animateToPositions() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;

      this.particles.forEach((p) => {
        if (!p.el) return;

        // Apply individual delay
        const progress = Math.max(0, Math.min(1, (elapsed / 1000 - p.delay) / 1.0)); // Faster animation

        if (progress <= 0) return;

        // Cubic easing out
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        // Update orbit angle
        p.currentOrbitAngle += 0.003 * p.spinDirection; // Slightly faster orbit

        // Calculate base position with easing
        let currentX = p.original.x + (p.target.x - p.original.x) * easedProgress;
        let currentY = p.original.y + (p.target.y - p.original.y) * easedProgress;

        // Apply global rotation
        const rotatedAngle = p.angle + this.globalAngle;
        const rotatedX = this.origin.x + this.radius * Math.cos(rotatedAngle);
        const rotatedY = this.origin.y + this.radius * Math.sin(rotatedAngle);

        // Blend between straight path and rotated path
        currentX = currentX + (rotatedX - currentX) * easedProgress;
        currentY = currentY + (rotatedY - currentY) * easedProgress;

        // Add orbital motion
        const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius * easedProgress;
        const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius * easedProgress;

        // Combine all transformations
        p.el.style.transform = `translate(${orbitX}px, ${orbitY}px) scale(${0.9 + easedProgress * 0.3})`; // Slightly larger final scale
        p.el.style.left = `${currentX}px`;
        p.el.style.top = `${currentY}px`;
        p.el.style.opacity = `${easedProgress * 0.9}`; // More visible opacity
      });

      // Update global rotation
      this.globalAngle += this.globalSpinSpeed * 0.015; // Slightly faster global spin

      if (elapsed < 10) { // Instant animation by setting a very short duration
        this.isAnimating = false;
        this.particles.forEach((p) => {
          if (!p.el) return;
          p.el.style.transition = "none"; // Disable transition for instant effect
          p.el.style.left = `${p.target.x}px`;
          p.el.style.top = `${p.target.y}px`;
          p.el.style.opacity = "0.8";
          const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius;
          const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius;
          p.el.style.transform = `translate(${orbitX}px, ${orbitY}px) scale(1.2)`;
        });
        this.startContinuousAnimation();
      } else {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  startContinuousAnimation() {
    let lastTimestamp = performance.now();

    const animateContinuous = (timestamp: number) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Update global rotation
      this.globalAngle += this.globalSpinSpeed * delta / 750; // Slightly faster continuous spin

      this.particles.forEach(p => {
        if (!p.el) return;

        // Update orbit angle
        p.currentOrbitAngle += 0.003 * p.spinDirection; // Slightly faster continuous orbit

        // Calculate rotated position
        const rotatedAngle = p.angle + this.globalAngle;
        const rotatedX = this.origin.x + this.radius * Math.cos(rotatedAngle);
        const rotatedY = this.origin.y + this.radius * Math.sin(rotatedAngle);

        // Calculate orbital motion
        const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius;
        const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius;

        p.el.style.transform = `translate(${orbitX}px, ${orbitY}px)`;
        p.el.style.left = `${rotatedX}px`;
        p.el.style.top = `${rotatedY}px`;
      });

      this.animationId = requestAnimationFrame(animateContinuous);
    };

    this.animationId = requestAnimationFrame(animateContinuous);
  }

  resetToOriginalPositions() {
    if (this.isAnimating) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.isAnimating = false;
    }

    this.particles.forEach(p => {
      if (!p.el) return;

      p.el.style.transition = `all ${0.3 + Math.random() * 0.7}s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out`; // Faster reset
      p.el.style.left = `${p.original.x}px`;
      p.el.style.top = `${p.original.y}px`;
      p.el.style.opacity = "0";
      p.el.style.transform = "none";
    });
    // Optionally stop continuous animation on reset
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles.forEach(p => p.el.remove());
  }
}

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const insideParticlesRef = useRef<HTMLSpanElement[]>([]);
  const ringsRef = useRef<Ring[]>([]);

  const ringConfigs = [
    { radius: 500, count: 50, speed: 1.4, spinSpeed: 0.06 }, // More particles, larger radius, faster
    { radius: 350, count: 40, speed: 1.2, spinSpeed: -0.09 },
    { radius: 600, count: 35, speed: 1.0, spinSpeed: 0.05 },
    { radius: 420, count: 45, speed: 1.3, spinSpeed: -0.07 },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.8; text-shadow: 0 0 8px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 20px currentColor; }
      }
      @keyframes floatSoft {
        0% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0); }
      }
      @keyframes subtlePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
      @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];

    // Create inside particles
    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "absolute pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;

      // Size variation
      const size = 0.6 + Math.random() * 1.6;
      span.style.fontSize = `${size * 0.8}rem`;

      // More prominent glow effects
      const hasGlow = Math.random() < 0.3;
      const hue = 240 + Math.random() * 80;

      if (hasGlow) {
        span.style.color = `hsl(${hue}, 85%, 80%)`;
        span.style.textShadow = `0 0 ${6 + Math.random() * 6}px hsl(${hue}, 80%, 75%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
        span.style.opacity = '0.8';
      } else {
        span.style.color = `hsl(${hue}, 75%, 70%)`;
        span.style.opacity = `${0.5 + Math.random() * 0.4}`;
      }

      if (Math.random() > 0.2) {
        span.style.animation = `floatSoft ${7 + Math.random() * 7}s infinite ease-in-out`;
        span.style.animationDelay = `${Math.random() * 4}s`;
      }

      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
    }

    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.count, container, cfg.spinSpeed);
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    });

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(r => r.destroy());
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isHovered) {
      ringsRef.current.forEach(ring => ring.animateToPositions());
      if (terminalRef.current) {
        terminalRef.current.style.transform = "translateZ(25px) scale(1.03)";
        terminalRef.current.style.transition = "transform 0.2s ease-out";
        terminalRef.current.style.animation = "subtlePulse 3s infinite ease-in-out";
      }
    } else {
      ringsRef.current.forEach(ring => ring.resetToOriginalPositions());
      if (terminalRef.current) {
        terminalRef.current.style.transform = "none";
        terminalRef.current.style.animation = "none";
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10"
    >
      <div
        ref={terminalRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text