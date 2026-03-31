"use client";

import React, { useEffect, useRef, useState } from "react";
import { EatEffectController } from "./EatEffectController";

export default function TerminalWithTechcrunch() {
  const containerRef = useRef(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const eatEffectRef = useRef(null);
  const textSpanRefs = useRef([]);
  const splitText = "TECHCRUNCH".split("");

  useEffect(() => {
    if (!containerRef.current) return;
    eatEffectRef.current = new EatEffectController(containerRef.current);
    return () => {
      eatEffectRef.current?.clear();
    };
  }, []);

  useEffect(() => {
    if (isTurboMode && containerRef.current) {
      eatEffectRef.current?.init(textSpanRefs.current);
    } else {
      eatEffectRef.current?.clear();
      textSpanRefs.current.forEach((span) => {
        if (span) span.style.opacity = "1";
      });
    }
  }, [isTurboMode]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative z-10 bg-white/5 border border-purple-700 rounded-lg px-6 pt-10 pb-10 backdrop-blur-sm shadow-lg max-w-2xl w-full">
        <h1 className="text-7xl font-extrabold text-center mb-6 leading-tight bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-mono">
          {splitText.map((char, i) => (
            <span
              key={i}
              ref={(el) => (textSpanRefs.current[i] = el)}
              style={{ display: "inline-block", transition: "opacity 0.3s" }}
            >
              {char}
            </span>
          ))}
        </h1>

        <div className="text-left font-mono text-sm text-gray-300 space-y-1">
          <p>
            <span className="text-green-500">user@techcrunch</span>:~$ find
            events --tech
          </p>
          <p className="text-pink-400 animate-pulse">Crunching data...</p>
        </div>

        <button
          onClick={() => setIsTurboMode((prev) => !prev)}
          className="absolute bottom-5 right-6 z-20 px-3 py-1 text-xs rounded border border-purple-500 bg-purple-900 text-white shadow hover:shadow-purple-400 transition"
        >
          {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
        </button>
      </div>
    </div>
  );
}
