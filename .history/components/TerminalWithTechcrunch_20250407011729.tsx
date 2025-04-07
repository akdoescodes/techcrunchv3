import React, { useEffect, useRef, useState } from "react";
import "./RingParticles.css"; // Styles below

interface Particle {
  el: HTMLSpanElement;
  original: { x: number; y: number };
}

const TOTAL_PARTICLES = 60;

export default function RingParticles() {
  const ring1Particles = useRef<Particle[]>([]);
  const ring2Particles = useRef<Particle[]>([]);
  const ring3Particles = useRef<Particle[]>([]);

  const [isTurboMode, setIsTurboMode] = useState(false);

  const createParticles = (ringRef: typeof ring1Particles) => {
    const particles: Particle[] = [];

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const span = document.createElement("span");
      span.className = "particle";
      document.getElementById("ring-container")?.appendChild(span);

      const rect = span.getBoundingClientRect();
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

  useEffect(() => {
    createParticles(ring1Particles);
    createParticles(ring2Particles);
    createParticles(ring3Particles);
  }, []);

  useEffect(() => {
    const RING_RADIUS = 220;
    const DEPTH_RANGE = 300;
    const MIN_VISIBLE_Z = 0;

    const updateRingParticles = (
      ringRef: typeof ring1Particles,
      offsetAngle = 0
    ) => {
      const particleCount = ringRef.current.length;

      ringRef.current.forEach((p, i) => {
        const span = p.el;

        if (isTurboMode) {
          const angle = ((i / particleCount) * Math.PI * 2) + offsetAngle;
          const ringX = RING_RADIUS * Math.cos(angle);
          const ringY = RING_RADIUS * Math.sin(angle);
          const ringZ = DEPTH_RANGE * Math.sin(angle * 2);

          span.style.left = "50%";
          span.style.top = "50%";
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
    <>
      <div id="ring-container" className="ring-container" />
      <button onClick={() => setIsTurboMode(!isTurboMode)}>
        Toggle Turbo Mode
      </button>
    </>
  );
}
