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
      span.className = "absolute pointer-events-none z-0 transition-all duration-500 ease-out";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.opacity = "0";
      span.style.willChange = "transform, opacity";

      // Larger size variation
      const size = 1.5 + Math.random() * 2.5;
      span.style.fontSize = `${size}rem`;

      // Enhanced glow effects
      const hasGlow = Math.random() < 0.7; // Increased probability for glow
      const hue = 60 + Math.random() * 40;
      const saturation = 90 + Math.random() * 10; // Increased saturation

      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, 85%)`; // Brighter color
        span.style.textShadow = `
          0 0 ${15 + Math.random() * 15}px hsl(${hue}, ${saturation}%, 85%),
          0 0 ${5 + Math.random() * 10}px hsl(${hue}, ${saturation}%, 95%)
        `; // Double glow effect
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${70 + Math.random() * 20}%)`; // Brighter base color
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
        speed: 1.2 + Math.random() * 0.8, // Increased speed
        delay: Math.random() * 0.2, // Reduced delay for quicker appearance
        currentOrbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 15 + Math.random() * 25, // Increased orbit radius
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

        // Faster initial animation
        const progress = Math.max(0, Math.min(1, (elapsed / 500 - p.delay) / 0.5)); // Reduced duration to 500ms

        if (progress <= 0) return;

        // Enhanced easing
        const easedProgress = 1 - Math.pow(1 - progress, 2); // Smoother easing

        // Update orbit angle with faster speed
        p.currentOrbitAngle += 0.004 * p.spinDirection;

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

        // Enhanced scale effect
        const scale = 0.9 + easedProgress * 0.6;

        // Combine all transformations
        p.el.style.transform = `translate(${orbitX}px, ${orbitY}px) scale(${scale})`;
        p.el.style.left = `${currentX}px`;
        p.el.style.top = `${currentY}px`;
        p.el.style.opacity = `${easedProgress}`; // Full opacity
      });

      // Update global rotation with increased speed
      this.globalAngle += this.globalSpinSpeed * 0.02;

      if (elapsed < 500) { // Reduced animation duration
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.startContinuousAnimation();
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  startContinuousAnimation() {
    let lastTimestamp = performance.now();

    const animateContinuous = (timestamp: number) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Faster continuous rotation
      this.globalAngle += this.globalSpinSpeed * delta / 500; // Increased speed

      this.particles.forEach(p => {
        if (!p.el) return;

        // Faster orbital motion
        p.currentOrbitAngle += 0.003 * p.spinDirection;

        // Calculate rotated position
        const rotatedAngle = p.angle + this.globalAngle;
        const rotatedX = this.origin.x + this.radius * Math.cos(rotatedAngle);
        const rotatedY = this.origin.y + this.radius * Math.sin(rotatedAngle);

        // Enhanced orbital motion
        const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius;
        const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius;

        p.el.style.transform = `translate(${orbitX}px, ${orbitY}px) scale(1.2)`;
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

      p.el.style.transition = `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`; // Faster transition
      p.el.style.left = `${p.original.x}px`;
      p.el.style.top = `${p.original.y}px`;
      p.el.style.opacity = "0";
      p.el.style.transform = "none";
    });
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
    { radius: 460, count: 50, speed: 1.5, spinSpeed: 0.08 }, // Increased count and speed
    { radius: 300, count: 40, speed: 1.3, spinSpeed: -0.1 }, // Increased count and speed
    { radius: 550, count: 35, speed: 1.2, spinSpeed: 0.06 }, // Increased count and speed
    { radius: 380, count: 45, speed: 1.4, spinSpeed: -0.09 }, // Increased count and speed
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.8; text-shadow: 0 0 10px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 20px currentColor; }
      }
      @keyframes floatSoft {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      @keyframes subtlePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
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
      
      const size = 0.5 + Math.random() * 1.5;
      span.style.fontSize = `${size * 0.75}rem`;
      
      const hasGlow = Math.random() < 0.2;
      const hue = 260 + Math.random() * 60;
      
      if (hasGlow) {
        span.style.color = `hsl(${hue}, 80%, 75%)`;
        span.style.textShadow = `0 0 ${4 + Math.random() * 4}px hsl(${hue}, 80%, 75%)`;
        span.style.animation = `glowPulse ${4 + Math.random() * 3}s infinite alternate`;
        span.style.opacity = '0.7';
      } else {
        span.style.color = `hsl(${hue}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.3}`;
      }

      if (Math.random() > 0.3) {
        span.style.animation = `floatSoft ${8 + Math.random() * 8}s infinite ease-in-out`;
        span.style.animationDelay = `${Math.random() * 5}s`;
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
      ring.animateToPositions(); // Start animation immediately
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
      if (terminalRef.current) {
        terminalRef.current.style.transform = "translateZ(20px) scale(1.02)";
        terminalRef.current.style.transition = "transform 0.3s ease-out";
        terminalRef.current.style.animation = "subtlePulse 4s infinite ease-in-out";
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
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-all duration-300 hover:shadow-[0_0_15px_#a855f7]"
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
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-all duration-300"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isHovered ? "translateZ(30px) scale(1.02)" : "none",
            textShadow: isHovered ? "0 0 15px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          TECHCRUNCH
        </h1>

        <div className="text-left w-full space-y-1 z-10">
          <p>
            <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300"> $ find events --category="tech" --sort="date"</span>
          </p>
          <p className="text-pink-500 animate-pulse">Crunching data...</p>
          <p className="text-green-600 font-semibold">Found 6 mind-blowing tech events!</p>
        </div>

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl pointer-events-none z-0 transition-all duration-300"
          style={{ 
            transform: isHovered ? "translateZ(-50px) scale(1.1)" : "none",
            opacity: isHovered ? 0.35 : 0.25
          }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl pointer-events-none z-0 transition-all duration-300"
          style={{ 
            transform: isHovered ? "translateZ(30px) scale(1.2)" : "none",
            opacity: isHovered ? 0.25 : 0.15
          }}
        />
      </div>
    </div>
  );
}