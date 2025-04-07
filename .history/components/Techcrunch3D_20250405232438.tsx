import React, { useEffect, useRef } from "react";

const codeParticles = ['{', '}', '<', '>', ';', '/', '=', '(', ')', '*'];

export default function TechcrunchParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 40;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement('span');
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-xs md:text-sm text-purple-500 absolute animate-float pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${4 + Math.random() * 6}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.3 + Math.random() * 0.5}`;
      span.style.fontFamily = `'Courier New', monospace`;
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
      {/* TECHCRUNCH Text */}
      <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>
    </div>
  );
}
