import React, { useEffect, useRef } from "react";

const codeParticles = ['{', '}', '<', '>', ';', '/', '=', '(', ')', '*'];

export default function TechcrunchParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 60;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement('span');
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className =
        "text-sm md:text-base absolute animate-float3d pointer-events-none neon-particle";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${3 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.2 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Courier New', monospace`;
      span.style.zIndex = "1";
      particles.push(span);
      container?.appendChild(span);
    }

    return () => {
      particles.forEach(p => container?.removeChild(p));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex items-center justify-center relative overflow-hidden bg-transparent"
    >
      {/* TECHCRUNCH Title */}
      <h1
        className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          textShadow: "0 0 12px rgba(236,72,153,0.7)",
        }}
      >
        TECHCRUNCH
      </h1>
    </div>
  );
}
