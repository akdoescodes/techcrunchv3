import React, { useEffect, useRef } from "react";

const codeParticles = [
  '{', '}', '<', '>', ';', '/', '=', '(', ')', '*', '[', ']', '+', '-', '&', '|', '!', '~', '%', '"', ':', '#'
];

export default function TechcrunchParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 70;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-sm md:text-base absolute animate-floatSoft pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 8}s`;
      span.style.fontWeight = "bold";
      span.style.opacity = `${0.4 + Math.random() * 0.4}`;
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.color = `hsl(${260 + Math.random() * 60}, 70%, 65%)`;
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
        className="text-4xl md:text-7xl lg:text-8xl font-extrabold bg-clip-text text-transparent typing-animation tech-font z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #CCFF00, #E8FF8A)",
        }}
      >
        TECHCRUNCH
      </h1>
    </div>
  );
}
