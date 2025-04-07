"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT_SIZE = "7rem";
const INSIDE_PARTICLE_COUNT = 50;
const MOUSE_INFLUENCE_RADIUS = 150; // How far the mouse affects particles
const MOUSE_REPEL_STRENGTH = 30; // How strongly particles are repelled
const MOUSE_ATTRACT_STRENGTH = 15; // How strongly particles are attracted when holding mouse

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  turbo: { x: number; y: number };
  hasGlow: boolean;
  currentPos: { x: number; y: number }; // Track current position for animation
  velocity: { x: number; y: number }; // Track velocity for smooth movement
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

      const { x: rx, y: ry, z: rz } = this.rotation;
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      const finalX = this.origin.x + x3;
      const finalY = this.origin.y + y3;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      const hasGlow = Math.random() < 0.2;
      if (hasGlow) {
        span.style.color = `hsl(${60 + Math.random() * 40}, 100%, 70%)`;
        span.style.textShadow = `0 0 8px hsl(${60 + Math.random() * 40}, 100%, 70%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        turbo: { x: finalX, y: finalY },
        hasGlow,
        currentPos: { x: startX, y: startY },
        velocity: { x: 0, y: 0 }
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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const insideParticlesRef = useRef<{ 
    el: HTMLSpanElement; 
    original: { x: number; y: number }; 
    currentPos: { x: number; y: number };
    velocity: { x: number; y: number };
    hasGlow: boolean;
  }[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const animationRef = useRef<number>();

  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 100 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 80 },
    { radius: 550, rotation: { x: 90, y: 180, z: 0 }, count: 60 },
    { radius: 460, rotation: { x: 84, y: 0, z: -30 }, count: 60 },
  ];

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Animation loop for particle movement
  const animateParticles = () => {
    insideParticlesRef.current.forEach(particle => {
      const dx = particle.currentPos.x - mousePos.x;
      const dy = particle.currentPos.y - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only affect particles within influence radius
      if (distance < MOUSE_INFLUENCE_RADIUS) {
        const force = isMouseDown ? MOUSE_ATTRACT_STRENGTH : MOUSE_REPEL_STRENGTH;
        const direction = isMouseDown ? 1 : -1;
        
        // Calculate force vector
        const angle = Math.atan2(dy, dx);
        const strength = (1 - distance / MOUSE_INFLUENCE_RADIUS) * force;
        
        particle.velocity.x += Math.cos(angle) * strength * direction;
        particle.velocity.y += Math.sin(angle) * strength * direction;
      }

      // Apply velocity
      particle.currentPos.x += particle.velocity.x;
      particle.currentPos.y += particle.velocity.y;

      // Apply friction
      particle.velocity.x *= 0.85;
      particle.velocity.y *= 0.85;

      // Return to original position with spring-like motion
      const returnSpeed = 0.1;
      particle.velocity.x += (particle.original.x - particle.currentPos.x) * returnSpeed;
      particle.velocity.y += (particle.original.y - particle.currentPos.y) * returnSpeed;

      // Update DOM
      particle.el.style.left = `${particle.currentPos.x}px`;
      particle.el.style.top = `${particle.currentPos.y}px`;

      // Enhance glow when near mouse
      if (distance < MOUSE_INFLUENCE_RADIUS && particle.hasGlow) {
        const intensity = 1 + (1 - distance / MOUSE_INFLUENCE_RADIUS) * 2;
        particle.el.style.transform = `scale(${intensity})`;
        particle.el.style.filter = `brightness(${intensity})`;
      } else if (particle.hasGlow) {
        particle.el.style.transform = 'scale(1)';
        particle.el.style.filter = 'brightness(1)';
      }
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    // Add glow animation to global styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { opacity: 0.7; text-shadow: 0 0 5px currentColor; }
        100% { opacity: 1; text-shadow: 0 0 15px currentColor, 0 0 20px currentColor; }
      }
      @keyframes glowPulseInside {
        0% { opacity: 0.6; text-shadow: 0 0 3px currentColor; }
        100% { opacity: 0.9; text-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
      }
    `;
    document.head.appendChild(style);

    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.el.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];
    insideParticlesRef.current = [];

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-300";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      
      const hasGlow = Math.random() < 0.25;
      if (hasGlow) {
        span.style.color = `hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.textShadow = `0 0 6px hsl(${260 + Math.random() * 60}, 100%, 75%)`;
        span.style.animation = `glowPulseInside ${4 + Math.random() * 5}s infinite alternate`;
        span.style.opacity = '0.7';
      } else {
        span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
        span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }

      terminal.appendChild(span);

      insideParticlesRef.current.push({
        el: span,
        original: { 
          x: Math.random() * terminal.offsetWidth, 
          y: Math.random() * terminal.offsetHeight 
        },
        currentPos: { 
          x: parseFloat(span.style.left), 
          y: parseFloat(span.style.top) 
        },
        velocity: { x: 0, y: 0 },
        hasGlow
      });
    }

    const center = {
      x: (terminal.offsetLeft + terminal.offsetWidth / 2) - 5,
      y: (terminal.offsetTop + terminal.offsetHeight / 2) - 13.5,
      z: 0,
    };

    ringConfigs.forEach(cfg => {
      const ring = new Ring(center, cfg.radius, cfg.rotation, cfg.count, container);
      ring.generateParticles(outsideParticles);
      ringsRef.current.push(ring);
    });

    // Start animation loop
    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      insideParticlesRef.current.forEach(p => p.el.remove());
      ringsRef.current.forEach(r => r.destroy());
      document.head.removeChild(style);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        el.style.left = `${isTurboMode ? p.turbo.x : p.original.x}px`;
        el.style.top = `${isTurboMode ? p.turbo.y : p.original.y}px`;
        el.style.opacity = isTurboMode ? "0.8" : "0.5";
        el.style.transform = isTurboMode ? "rotateX(45deg)" : "";
        
        if (p.hasGlow) {
          if (isTurboMode) {
            el.style.animation = `glowPulse ${1 + Math.random() * 2}s infinite alternate`;
            el.style.textShadow = `0 0 15px currentColor, 0 0 25px currentColor`;
          } else {
            el.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
            el.style.textShadow = `0 0 8px currentColor`;
          }
        }
      });
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
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
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
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px)" : "none",
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

        <div
          className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none z-0 transition-transform duration-500"
          style={{ transform: isTurboMode ? "translateZ(-100px)" : "none" }}
        />
        <div
          className="absolute bottom-[-3rem] right-[-2rem] w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow pointer-events-none z-0 transition-transform duration-500"
          style={{ transform: isTurboMode ? "translateZ(100px)" : "none" }}
        />
      </div>
    </div>
  );
}