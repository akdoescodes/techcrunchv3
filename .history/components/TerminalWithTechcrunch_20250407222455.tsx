"use client";

import React, { useEffect, useRef, useState } from "react";
import { HungryInsideParticle, EatEffectController } from "./TurboEater";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];

const TECHCRUNCH_TEXT = "TECHCRUNCH";

export default function TerminalWithTechcrunch() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const eatEffectControllerRef = useRef<EatEffectController | null>(null);

  useEffect(() => {
    if (!textContainerRef.current || !terminalRef.current) return;

    const container = terminalRef.current;
    const textContainer = textContainerRef.current;

    const particles: HungryInsideParticle[] = [];
    const spanRefs: HTMLSpanElement[] = [];

    // Split TECHCRUNCH into spans
    textContainer.innerHTML = "";
    TECHCRUNCH_TEXT.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.innerText = char;
      span.className = "letter-span";
      span.style.fontSize = "6rem";
      span.style.fontWeight = "bold";
      span.style.position = "relative";
      span.style.display = "inline-block";
      span.style.transition = "opacity 0.3s ease-out";
      textContainer.appendChild(span);
      spanRefs.push(span);
    });

    // Create inside particles
    for (let i = 0; i < 80; i++) {
      const p = new HungryInsideParticle(container, insideParticles);
      particles.push(p);
    }

    // Initialize effect controller
    const controller = new EatEffectController(spanRefs, particles);
    eatEffectControllerRef.current = controller;

    return () => {
      particles.forEach(p => p.destroy());
    };
  }, []);

  useEffect(() => {
    if (isTurboMode) {
      eatEffectControllerRef.current?.start();
    } else {
      eatEffectControllerRef.current?.reset();
    }
  }, [isTurboMode]);

  return (
    <div
      ref={terminalRef}
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative px-4 py-10 bg-black text-white"
    >
      <div
        className="relative flex flex-col justify-start items-center rounded-lg border border-purple-700 shadow-[0_0_2px_#a855f766] backdrop-blur-sm font-mono text-sm px-6 pt-10 pb-10 z-10 transition-transform duration-500"
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff0a",
          overflow: "hidden",
        }}
      >
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
        <div className="flex items-center mb-6 self-start">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md" />
          <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
        </div>

        {/* TECHCRUNCH TEXT */}
        <div ref={textContainerRef} className="mb-6 flex justify-center flex-wrap gap-1" />

        {/* Terminal command */}
        <div className="text-left w-full space-y-1 z-10">
          <p>
            <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-300"> $ find events --category="tech" --sort="date"</span>
          </p>
          <p className="text-pink-500 animate-pulse">Crunching data...</p>
          <p className="text-green-600 font-semibold">Found 6 mind-blowing tech events!</p>
        </div>

        {/* TURBO BUTTON */}
        <button
          onClick={() => setIsTurboMode(prev => !prev)}
          className={`absolute right-4 bottom-4 text-xs py-1 px-2 rounded border ${
            isTurboMode
              ? "bg-purple-900 border-purple-500 text-white shadow-[0_0_6px_#a855f7]"
              : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
          } transition-all duration-300 z-20`}
        >
          {isTurboMode ? "TURBO: ON" : "TURBO: OFF"}
        </button>
      </div>
    </div>
  );
}
