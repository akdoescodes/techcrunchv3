import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "", "\\", "?", ":", "_", ">", "<", "~", "!", "*"];

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
      span.style.fontFamily = '"Fira Code", "Courier New", monospace';
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
  const techcrunchLettersRef = useRef<HTMLSpanElement[]>([]);
  const [isEating, setIsEating] = useState(false);

  const ringConfigs = [
    { radius: 460, rotation: { x: 84, y: 0, z: 30 }, count: 100 },
    { radius: 300, rotation: { x: 20, y: 90, z: 10 }, count: 80 },
    { radius: 150, rotation: { x: 60, y: 45, z: 70 }, count: 60 },
  ];

  useEffect(() => {
    const terminal = terminalRef.current;
    const container = containerRef.current;
    if (!terminal || !container) return;

    insideParticlesRef.current.forEach(p => p.remove());
    ringsRef.current.forEach(r => r.destroy());
    ringsRef.current = [];
    techcrunchLettersRef.current.forEach(l => l.remove());
    techcrunchLettersRef.current = [];

    // Create individual letters for TECHCRUNCH
    const techcrunchText = "TECHCRUNCH";
    const lettersContainer = document.createElement("div");
    lettersContainer.className = "flex justify-center w-full mb-6 leading-tight z-10 transition-transform duration-500";
    lettersContainer.style.transform = isTurboMode ? "translateZ(100px)" : "none";
    
    for (let i = 0; i < techcrunchText.length; i++) {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = techcrunchText[i];
      letterSpan.className = "font-extrabold bg-clip-text text-transparent inline-block";
      letterSpan.style.backgroundImage = "linear-gradient(90deg, #a855f7, #ec4899)";
      letterSpan.style.fontSize = TECHCRUNCH_TEXT_SIZE;
      letterSpan.style.transition = "all 0.3s ease-out";
      letterSpan.style.transformOrigin = "center center";
      lettersContainer.appendChild(letterSpan);
      techcrunchLettersRef.current.push(letterSpan);
    }
    
    const h1 = terminal.querySelector("h1");
    if (h1) {
      h1.replaceWith(lettersContainer);
    }

    for (let i = 0; i < INSIDE_PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      span.textContent = insideParticles[Math.floor(Math.random() * insideParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none z-0";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.5}`;
      span.style.fontFamily = '"Fira Code", "Courier New", monospace';
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
      techcrunchLettersRef.current.forEach(l => l.remove());
    };
  }, []);

  useEffect(() => {
    if (isTurboMode && !isEating) {
      setIsEating(true);
      eatTechcrunchLetters();
    } else if (!isTurboMode && isEating) {
      setIsEating(false);
      restoreTechcrunchLetters();
    }

    ringsRef.current.forEach(ring => {
      ring.particles.forEach(p => {
        const el = p.el;
        el.style.left = `${isTurboMode ? p.turbo.x : p.original.x}px`;
        el.style.top = `${isTurboMode ? p.turbo.y : p.original.y}px`;
        el.style.opacity = isTurboMode ? "0.8" : "0.5";
        el.style.transform = isTurboMode ? "rotateX(45deg)" : "";
      });
    });

    if (terminalRef.current) {
      terminalRef.current.style.transform = isTurboMode ? "translateZ(50px)" : "none";
    }
  }, [isTurboMode, isEating]);

  const eatTechcrunchLetters = () => {
    techcrunchLettersRef.current.forEach((letter, index) => {
      const delay = 100 + Math.random() * 400;
      
      setTimeout(() => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenter = {
          x: letterRect.left + letterRect.width / 2,
          y: letterRect.top + letterRect.height / 2
        };
        
        let closestParticle = null;
        let minDistance = Infinity;
        
        insideParticlesRef.current.forEach(particle => {
          const particleRect = particle.getBoundingClientRect();
          const particleCenter = {
            x: particleRect.left + particleRect.width / 2,
            y: particleRect.top + particleRect.height / 2
          };
          
          const distance = Math.sqrt(
            Math.pow(particleCenter.x - letterCenter.x, 2) + 
            Math.pow(particleCenter.y - letterCenter.y, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closestParticle = particle;
          }
        });
        
        if (closestParticle) {
          closestParticle.style.transition = "all 0.3s ease-out";
          closestParticle.style.left = `${letterCenter.x}px`;
          closestParticle.style.top = `${letterCenter.y}px`;
          
          setTimeout(() => {
            letter.style.opacity = "0";
            letter.style.transform = "scale(0.5) rotate(45deg)";
            
            setTimeout(() => {
              closestParticle.textContent = letter.textContent;
              closestParticle.style.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
              
              setTimeout(() => {
                closestParticle.style.transition = "none";
                closestParticle.style.left = `${Math.random() * 100}%`;
                closestParticle.style.top = `${Math.random() * 100}%`;
                closestParticle.style.animation = `floatSoft ${6 + Math.random() * 6}s infinite alternate`;
              }, 300);
            }, 200);
          }, 300);
        }
      }, delay * index);
    });
  };

  const restoreTechcrunchLetters = () => {
    techcrunchLettersRef.current.forEach((letter, index) => {
      setTimeout(() => {
        letter.style.opacity = "1";
        letter.style.transform = "scale(1) rotate(0deg)";
      }, 50 * index);
    });
  };

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
        }}
      >
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        <h1 className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500">
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