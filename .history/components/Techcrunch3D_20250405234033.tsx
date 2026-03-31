import React, { useEffect, useRef } from "react";

const codeParticles = ['{', '}', '<', '>', ';', '/', '=', '(', ')', '*'];

export default function TechcrunchParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 40;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-xs md:text-sm absolute animate-floatSoft pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${8 + Math.random() * 8}s`;
      span.style.fontWeight = "500";
      span.style.opacity = `${0.1 + Math.random() * 0.2}`;
      span.style.fontFamily = `'Courier New', monospace`;
      span.style.color = `hsl(${280 + Math.random() * 40}, 60%, 70%)`;
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
      <h1
        className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>
    </div>
  );
}
