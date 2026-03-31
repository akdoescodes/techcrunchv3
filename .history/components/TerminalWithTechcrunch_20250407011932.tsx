import React, { useEffect, useRef, useState } from "react";
import "./RingParticles.css"; // Make sure this is imported or inline styles used

const TOTAL_PARTICLES = 60;
const RING_RADIUS = 220;
const DEPTH_RANGE = 300;
const MIN_VISIBLE_Z = 0;

interface Particle {
  el: HTMLSpanElement;
  original: { x: number; y: number };
}

const TerminalWithTechcrunch = () => {
  const ring1Particles = useRef<Particle[]>([]);
  const ring2Particles = useRef<Particle[]>([]);
  const ring3Particles = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isTurboMode, setIsTurboMode] = useState(true); // or false by default

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const createParticles = (ringRef: typeof ring1Particles) => {
      const particles: Particle[] = [];

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const span = document.createElement("span");
        span.className = "particle";
        containerRef.current?.appendChild(span);

        particles.push({
          el: span,
          original: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          },
        });
      }

      ringRef.current = particles;
    };

    createParticles(ring1Particles);
    createParticles(ring2Particles);
    createParticles(ring3Particles);
  }, []);

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const updateRingParticles = (
      ringRef: typeof ring1Particles,
      offsetAngle = 0
    ) => {
      const particles = ringRef.current;

      particles.forEach((p, i) => {
        const span = p.el;

        if (isTurboMode) {
          const angle = ((i / particles.length) * 2 * Math.PI) + offsetAngle;
          const ringX = RING_RADIUS * Math.cos(angle);
          const ringY = RING_RADIUS * Math.sin(angle);
          const ringZ = DEPTH_RANGE * Math.sin(angle * 2);

          span.style.left = `${centerX}px`;
          span.style.top = `${centerY}px`;
          span.style.transform = `translate3d(${ringX}px, ${ringY}px, ${ringZ}px)`;
          span.style.opacity = ringZ >= MIN_VISIBLE_Z ? "0.9" : "0";
        } else {
          span.style.left = `${p.original.x}px`;
          span.style.top = `${p.original.y}px`;
          span.style.transform = `translate3d(0, 0, 0)`;
          span.style.opacity = "0.5";
        }
      });
    };

    updateRingParticles(ring1Particles, 0);
    updateRingParticles(ring2Particles, Math.PI / 3);
    updateRingParticles(ring3Particles, Math.PI / 1.5);
  }, [isTurboMode]);

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <div
        id="ring-container"
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {/* Your actual terminal or Techcrunch 3D goes below */}
      <div className="relative z-10">
        {/* You can toggle turbo mode if you want */}
        {/* <button onClick={() => setIsTurboMode(!isTurboMode)}>Toggle Turbo</button> */}
      </div>
    </div>
  );
};

export default TerminalWithTechcrunch;
