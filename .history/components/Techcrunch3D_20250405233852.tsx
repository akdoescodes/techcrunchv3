import React from "react";

const codeSnippets = [
  'console.log("Hello World");',
  'const a = 42;',
  'function glow() {}',
  '<div class="code" />',
  'let x = Math.PI;',
  'import React from "react";',
  'return <Awesome />;',
  'setTimeout(() => {}, 1000);',
  'if (cool) animate();',
  '// 💻 Floating code...',
];

export default function FloatingParticles() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* TECHCRUNCH Title */}
      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-5xl tech-font text-white z-10 typing-animation">
        TECHCRUNCH
      </h1>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-xs neon-particle animate-float3d"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
        </div>
      ))}
    </div>
  );
}
