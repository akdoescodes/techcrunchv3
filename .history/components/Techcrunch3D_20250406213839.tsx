import React, { useEffect, useRef } from "react";

const codeParticles = [
  '{', '}', '<', '>', ';', '/', '=', '(', ')', '*', '[', ']', '+', '-', '&', '|', '!', '~', '%', '"', ':', '#'
];

export default function TerminalWithTechcrunch() {
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
    <div className="terminal p-4 md:p-6 rounded-2xl border border-purple-500 bg-gradient-to-br from-[#1f1f2f] to-[#15151f] shadow-xl w-full relative overflow-hidden" ref={containerRef}>
      {/* Techcrunch Title */}
      <h1
        className="text-3xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent typing-animation tech-font text-center z-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>

      {/* Optional terminal body below */}
      <div className="mt-4 text-purple-300 font-mono text-sm md:text-base z-10 relative">
        <p>&gt; Welcome to the Techcrunch Terminal</p>
        <p>&gt; Launching Event Dashboard...</p>
      </div>
    </div>
  );
}
