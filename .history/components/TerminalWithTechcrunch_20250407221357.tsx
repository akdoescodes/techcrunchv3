"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHAR_LIST = ["0", "1", "<", ">", "/", "{", "}", "|", "*", "-", "="];
const TECHCRUNCH_TEXT = "TECHCRUNCH";
const TECHCRUNCH_TEXT_SIZE = "4rem";

class HungryParticle {
  el: HTMLSpanElement;
  container: HTMLDivElement;
  target: HTMLElement | null;
  speed: number;

  constructor(container: HTMLDivElement, target: HTMLElement | null, charList: string[]) {
    this.container = container;
    this.target = target;
    this.speed = 1 + Math.random() * 1.5;

    const span = document.createElement("span");
    span.textContent = charList[Math.floor(Math.random() * charList.length)];
    span.className = "text-sm absolute pointer-events-none z-20";
    span.style.fontWeight = "bold";
    span.style.fontFamily = `'Fira Code', monospace`;
    span.style.color = `hsl(${260 + Math.random() * 60}, 80%, 65%)`;
    span.style.left = `${Math.random() * container.offsetWidth}px`;
    span.style.top = `${Math.random() * container.offsetHeight}px`;

    this.el = span;
    this.container.appendChild(this.el);
  }

  moveTowardTarget() {
    if (!this.target) return;

    const targetRect = this.target.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
    const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;

    const currentX = parseFloat(this.el.style.left);
    const currentY = parseFloat(this.el.style.top);

    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      this.el.style.opacity = "0";
      if (this.target) this.target.style.opacity = "0.3";
    } else {
      const moveX = dx / dist * this.speed;
      const moveY = dy / dist * this.speed;
      this.el.style.left = `${currentX + moveX}px`;
      this.el.style.top = `${currentY + moveY}px`;
    }
  }

  destroy() {
    this.el.remove();
  }
}

const TerminalWithTechcrunch: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const techLetterRefs = useRef<HTMLSpanElement[]>([]);
  const hungryParticlesRef = useRef<HungryParticle[]>([]);
  const [isTurboMode, setIsTurboMode] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isTurboMode) return;

    const letters = techLetterRefs.current.filter(Boolean);

    for (let i = 0; i < 40; i++) {
      const target = letters[Math.floor(Math.random() * letters.length)];
      const particle = new HungryParticle(container, target, CHAR_LIST);
      hungryParticlesRef.current.push(particle);
    }

    const interval = setInterval(() => {
      hungryParticlesRef.current.forEach(p => p.moveTowardTarget());
    }, 30);

    return () => {
      clearInterval(interval);
      hungryParticlesRef.current.forEach(p => p.destroy());
      hungryParticlesRef.current = [];
      techLetterRefs.current.forEach(el => {
        if (el) el.style.opacity = "1"; // reset opacity
      });
    };
  }, [isTurboMode]);

  return (
    <div className="w-full relative flex items-center justify-center">
      <div
        ref={containerRef}
        className={cn(
          "w-[90vw] max-w-4xl min-h-[200px] rounded-2xl p-4 transition-all duration-300",
          "bg-black/30 border border-purple-500/20 shadow-lg backdrop-blur-md",
          isTurboMode && "shadow-purple-500/40"
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <button
            onClick={() => setIsTurboMode(!isTurboMode)}
            className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
          >
            {isTurboMode ? "Stop Turbo" : "Turbo Mode"}
          </button>
        </div>

        <h1
          className="font-extrabold bg-clip-text text-transparent text-center w-full mb-6 leading-tight z-10 transition-transform duration-500"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            fontSize: TECHCRUNCH_TEXT_SIZE,
            transform: isTurboMode ? "translateZ(100px)" : "none",
          }}
        >
          {TECHCRUNCH_TEXT.split("").map((char, index) => (
            <span
              key={index}
              ref={el => techLetterRefs.current[index] = el}
              style={{ display: "inline-block", transition: "opacity 0.3s ease" }}
            >
              {char}
            </span>
          ))}
        </h1>

        <motion.div
          className="text-green-400 font-mono text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          > Initiating Tech Sequence...
        </motion.div>
      </div>
    </div>
  );
};

export default TerminalWithTechcrunch;
