import React, { useEffect, useRef } from "react";

const codeParticles = [
  '{', '}', '<', '>', ';', '/', '=', '(', ')', '*', '[', ']', '+', '-', '&', '|', '!', '~', '%', '"', ':', '#'
];

export default function TechcrunchParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 50; // optional: reduce number of particles too
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement("span");
      span.textContent = codeParticles[Math.floor(Math.random() * codeParticles.length)];
      span.className = "text-xs md:text-sm absolute animate-floatSoft pointer-events-none";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.animationDuration = `${8 + Math.random() * 6}s`;
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
      className="w-full h-[300px] md:h-[400px] flex items-center justify-center relative overflow-hidden bg-transparent"
    >
      <h1
        className="text-2xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent typing-animation tech-font z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>
    </div>
  );
}
