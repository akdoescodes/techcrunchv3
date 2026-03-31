import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

const TECHCRUNCH_TEXT = "TECHCRUNCH";
const INSIDE_PARTICLE_COUNT = 50;
const NUCLEUS_RADIUS = 120;

type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  turbo: { x: number; y: number };
};

type TextParticleData = {
  el: HTMLSpanElement;
  char: string;
  original: { x: number; y: number };
  nucleus: { x: number; y: number; z: number; radius: number; angle: number };
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
      span.className = "text-sm md:text-base absolute pointer-events-none z-0 transition-all duration-500";
      span.style.fontWeight = "bold";
      span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
      span.style.color = `hsl(${60 + Math.random() * 40}, 90%, 55%)`;

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
  const ringsRef = useRef<Ring[]>([]);
  const textParticlesRef = useRef<TextParticleData[]>([]);
  const nucleusRef = useRef<HTMLDivElement>(null);

  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 100 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 80 },
    { radius: 150, rotation: { x: 60, y: 45, z: 70 }, count: 60 },
  ];

  // Initialize the text particles
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    // Clean up previous particles
    textParticlesRef.current.forEach(p => p.el.remove());
    textParticlesRef.current = [];

    // Create a temporary header to measure letter positions
    const tempHeader = document.createElement("h1");
    tempHeader.className = "font-extrabold text-center w-full mb-6 leading-tight z-10";
    tempHeader.style.fontSize = "7rem";
    tempHeader.style.visibility = "hidden";
    tempHeader.style.position = "absolute";
    terminal.appendChild(tempHeader);

    // Create a span for each letter to measure position
    const letterSpans: HTMLSpanElement[] = [];
    for (let i = 0; i < TECHCRUNCH_TEXT.length; i++) {
      const span = document.createElement("span");
      span.textContent = TECHCRUNCH_TEXT[i];
      span.style.display = "inline-block";
      tempHeader.appendChild(span);
      letterSpans.push(span);
    }

    // Calculate terminal center for nucleus positioning
    const terminalRect = terminal.getBoundingClientRect();
    const center = {
      x: terminalRect.width / 2,
      y: terminalRect.height / 2 - 50,
      z: 0
    };

    // Create actual text particles
    for (let i = 0; i < TECHCRUNCH_TEXT.length; i++) {
      const char = TECHCRUNCH_TEXT[i];
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "absolute text-center transition-all duration-700 z-20";
      span.style.fontWeight = "extrabold";
      span.style.fontSize = "7rem";
      span.style.fontFamily = "sans-serif";
      span.style.backgroundImage = "linear-gradient(90deg, #a855f7, #ec4899)";
      span.style.webkitBackgroundClip = "text";
      span.style.backgroundClip = "text";
      span.style.color = "transparent";
      span.style.willChange = "transform, opacity";

      const rect = letterSpans[i].getBoundingClientRect();
      const terminalRect = terminal.getBoundingClientRect();
      
      // Original position (relative to terminal)
      const x = rect.left - terminalRect.left;
      const y = rect.top - terminalRect.top;
      
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      
      // Calculate nucleus position (sphere coordinates)
      const theta = Math.random() * Math.PI * 2; // Random angle around the sphere
      const phi = Math.random() * Math.PI; // Random angle from top to bottom
      const r = NUCLEUS_RADIUS * 0.7 + Math.random() * (NUCLEUS_RADIUS * 0.3); // Random radius
      
      const nx = center.x + r * Math.sin(phi) * Math.cos(theta);
      const ny = center.y + r * Math.sin(phi) * Math.sin(theta);
      const nz = r * Math.cos(phi);
      
      terminal.appendChild(span);
      
      textParticlesRef.current.push({
        el: span,
        char: char,
        original: { x, y },
        nucleus: { 
          x: nx, 
          y: ny, 
          z: nz, 
          radius: r,
          angle: theta 
        }
      });
    }

    // Remove temporary header
    tempHeader.remove();

    return () => {
      textParticlesRef.current.forEach(p => p.el.remove());
    };
  }, []);

  // Initialize floating particles and rings
  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = "'Fira Code', 'Courier New', monospace";
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
      terminal.appendChild(span);
      insideParticlesRef.current.push(span);
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

    return () => {
      insideParticlesRef.current.forEach(p => p.remove());
      ringsRef.current.forEach(r => r.destroy());
    };
  }, []);

  // Create the nucleus
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    
    // Create nucleus container if it doesn't exist
    if (!nucleusRef.current) {
      const nucleus = document.createElement("div");
      nucleus.className = "absolute rounded-full pointer-events-none z-20 transition-all duration-700";
      nucleus.style.width = `${NUCLEUS_RADIUS * 2}px`;
      nucleus.style.height = `${NUCLEUS_RADIUS * 2}px`;
      nucleus.style.opacity = "0";
      nucleus.style.background = "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,73,153,0.2) 70%, rgba(236,73,153,0) 100%)";
      nucleus.style.boxShadow = "0 0 40px 10px rgba(168,85,247,0.3)";
      nucleus.style.left = `50%`;
      nucleus.style.top = `50%`;
      nucleus.style.transform = "translate(-50%, -70%)";
      terminal.appendChild(nucleus);
      nucleusRef.current = nucleus;
    }
    
    return () => {
      if (nucleusRef.current) {
        nucleusRef.current.remove();
      }
    };
  }, []);

  // Handle turbo mode transitions
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    // Animate nucleus
    if (nucleusRef.current) {
      nucleusRef.current.style.opacity = isTurboMode ? "1" : "0";
    }

    // Animate outside particles
    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        el.style.left = `${isTurboMode ? p.turbo.x : p.original.x}px`;
        el.style.top = `${isTurboMode ? p.turbo.y : p.original.y}px`;
        el.style.opacity = isTurboMode ? "0.8" : "0.5";
        el.style.transform = isTurboMode ? "rotateX(45deg)" : "";
      });
    });

    // Animate inside floating particles
    insideParticlesRef.current.forEach(p => {
      if (isTurboMode) {
        // Move floating particles toward the nucleus
        p.style.transition = "all 1s ease-in";
        setTimeout(() => {
          const terminalRect = terminal.getBoundingClientRect();
          const nucleusX = terminalRect.width / 2;
          const nucleusY = terminalRect.height / 2 - 50;
          
          const dx = nucleusX - parseFloat(p.style.left);
          const dy = nucleusY - parseFloat(p.style.top);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate position near the nucleus
          const ratio = (NUCLEUS_RADIUS * 0.8) / dist;
          const targetX = nucleusX - dx * ratio;
          const targetY = nucleusY - dy * ratio;
          
          p.style.left = `${targetX}px`;
          p.style.top = `${targetY}px`;
          p.style.opacity = "1";
        }, Math.random() * 300);
      } else {
        // Restore original animation
        p.style.transition = "all 0.7s ease-out";
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.opacity = `${0.4 + Math.random() * 0.5}`;
      }
    });

    // Animate text particles
    textParticlesRef.current.forEach((p, index) => {
      const el = p.el;
      
      if (isTurboMode) {
        // "Eating" animation
        setTimeout(() => {
          const delay = Math.random() * 0.5;
          el.style.transition = `all 0.7s ease-in ${delay}s`;
          
          // Animate to nucleus position
          el.style.left = `${p.nucleus.x}px`;
          el.style.top = `${p.nucleus.y}px`;
          el.style.opacity = "0.7";
          el.style.transform = `translateZ(${p.nucleus.z}px) scale(0.2)`;
          el.style.color = "rgba(168, 85, 247, 0.8)";
          el.style.backgroundImage = "none";
          el.style.textShadow = "0 0 8px rgba(236, 73, 153, 0.8)";
          
          // Start orbiting animation
          setTimeout(() => {
            el.style.transition = "all 5s linear 0s, opacity 0.5s ease-in-out";
            
            // Random orbit speed
            const orbitInterval = setInterval(() => {
              if (!isTurboMode) {
                clearInterval(orbitInterval);
                return;
              }
              
              p.nucleus.angle += 0.01 + Math.random() * 0.02;
              const nx = p.nucleus.x + Math.cos(p.nucleus.angle) * (p.nucleus.radius * 0.1);
              const ny = p.nucleus.y + Math.sin(p.nucleus.angle) * (p.nucleus.radius * 0.1);
              
              el.style.left = `${nx}px`;
              el.style.top = `${ny}px`;
            }, 50);
            
            return () => clearInterval(orbitInterval);
          }, 700 + delay * 1000);
        }, index * 50);
      } else {
        // Restore original position
        el.style.transition = "all 0.7s ease-out";
        el.style.left = `${p.original.x}px`;
        el.style.top = `${p.original.y}px`;
        el.style.opacity = "1";
        el.style.transform = "translateZ(0) scale(1)";
        el.style.backgroundImage = "linear-gradient(90deg, #a855f7, #ec4899)";
        el.style.webkitBackgroundClip = "text";
        el.style.backgroundClip = "text";
        el.style.color = "transparent";
        el.style.textShadow = "none";
      }
    });

    // Animate terminal
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
    >
      <div
        ref={terminalRef}
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm text-gray-200 font-mono text-sm px-6 pt-10 pb-10 z-10 transition-transform duration-500"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* The TECHCRUNCH text is now created dynamically in useEffect */}
        <div className="h-32 w-full relative">
          {/* Individual letters will be positioned here by the useEffect */}
        </div>

        <div className="text-left w-full space-y-1 z-10 mt-8">
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