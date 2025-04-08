"use client";

import React, { useEffect, useRef, useState } from "react";

const insideParticles = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
const outsideParticles = ["@", "$", "^", "`", "\\", "?", ":", "_", ">", "<", "~", "!"];

const TECHCRUNCH_TEXT_SIZE = "7rem";

// === Vector3 and ParticleData Types ===
type Vector3 = { x: number; y: number; z: number };
type ParticleData = {
  el: HTMLSpanElement;
  original: { x: number; y: number };
  target: { x: number; y: number };
  hasGlow: boolean;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  delay: number;
  wobble: { x: number; y: number; speed: number };
  orbitSpeed: number;
  currentOrbitAngle: number;
  orbitRadius: number;
  spinDirection: number;
};

// === Ring Class ===
class Ring {
  origin: Vector3;
  radius: number;
  count: number;
  container: HTMLDivElement;
  particles: ParticleData[] = [];
  animationId: number | null = null;
  isAnimating: boolean = false;
  currentProgress: number = 0;
  lastTimestamp: number = 0;
  globalAngle: number = 0;
  globalSpinSpeed: number;

  constructor(origin: Vector3, radius: number, count: number, container: HTMLDivElement, spinSpeed: number = 0) {
    this.origin = origin;
    this.radius = radius;
    this.count = count;
    this.container = container;
    this.globalSpinSpeed = spinSpeed;
  }

  generateParticles(charList: string[]) {
    for (let i = 0; i < this.count; i++) {
      const angle = (i * 2 * Math.PI) / this.count;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);

      const finalX = this.origin.x + x;
      const finalY = this.origin.y + y;

      const span = document.createElement("span");
      span.textContent = charList[Math.floor(Math.random() * charList.length)];
      span.className = "absolute pointer-events-none z-0 transition-all duration-1000 ease-out";
      span.style.fontWeight = "bold";
      span.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
      span.style.opacity = "0";
      span.style.willChange = "transform, opacity";
      const size = 0.5 + Math.random() * 1.5;
      span.style.fontSize = `${size * 0.75}rem`;

      const hasGlow = Math.random() < 0.3;
      const hue = 60 + Math.random() * 40;
      const saturation = 80 + Math.random() * 20;

      if (hasGlow) {
        span.style.color = `hsl(${hue}, ${saturation}%, 70%)`;
        span.style.textShadow = `0 0 ${8 + Math.random() * 8}px hsl(${hue}, ${saturation}%, 70%)`;
        span.style.animation = `glowPulse ${3 + Math.random() * 4}s infinite alternate`;
      } else {
        span.style.color = `hsl(${hue}, ${saturation}%, ${50 + Math.random() * 20}%)`;
      }

      const startX = Math.random() * this.container.offsetWidth;
      const startY = Math.random() * this.container.offsetHeight;

      span.style.left = `${startX}px`;
      span.style.top = `${startY}px`;

      this.container.appendChild(span);

      this.particles.push({
        el: span,
        original: { x: startX, y: startY },
        target: { x: finalX, y: finalY },
        hasGlow,
        angle,
        radius: this.radius,
        size,
        speed: 0.8 + Math.random() * 0.4,
        delay: Math.random() * 0.5,
        wobble: {
          x: 2 + Math.random() * 8,
          y: 2 + Math.random() * 8,
          speed: 0.5 + Math.random() * 1.5,
        },
        orbitSpeed: 0.2 + Math.random() * 0.3,
        currentOrbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 5 + Math.random() * 15,
        spinDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  animateToPositions() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentProgress = 0;
    this.lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      this.currentProgress = Math.min(this.currentProgress + (delta / 1000) * 0.5, 1);
      this.globalAngle += this.globalSpinSpeed * delta / 1000;

      this.particles.forEach((p) => {
        if (!p.el) return;
        const progress = Math.max(0, Math.min(1, (this.currentProgress - p.delay) / (1 - p.delay)));
        if (progress <= 0) return;

        const easedProgress = 1 - Math.pow(1 - progress, 3);
        p.currentOrbitAngle += p.orbitSpeed * delta / 1000 * p.spinDirection;

        let currentX = p.original.x + (p.target.x - p.original.x) * easedProgress;
        let currentY = p.original.y + (p.target.y - p.original.y) * easedProgress;

        const rotatedAngle = p.angle + this.globalAngle;
        const rotatedX = this.origin.x + this.radius * Math.cos(rotatedAngle);
        const rotatedY = this.origin.y + this.radius * Math.sin(rotatedAngle);

        currentX = currentX + (rotatedX - currentX) * easedProgress;
        currentY = currentY + (rotatedY - currentY) * easedProgress;

        const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius * easedProgress;
        const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius * easedProgress;

        const wobbleX = Math.sin(timestamp * 0.001 * p.wobble.speed) * p.wobble.x * (1 - easedProgress);
        const wobbleY = Math.cos(timestamp * 0.001 * p.wobble.speed * 0.7) * p.wobble.y * (1 - easedProgress);

        p.el.style.transform = `translate(${wobbleX + orbitX}px, ${wobbleY + orbitY}px) scale(${0.8 + easedProgress * 0.4}) rotate(${easedProgress * 360}deg)`;
        p.el.style.left = `${currentX}px`;
        p.el.style.top = `${currentY}px`;
        p.el.style.opacity = `${easedProgress * 0.8}`;
      });

      if (this.currentProgress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.startContinuousAnimation();
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  startContinuousAnimation() {
    this.lastTimestamp = performance.now();

    const animateContinuous = (timestamp: number) => {
      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      this.globalAngle += this.globalSpinSpeed * delta / 1000;

      this.particles.forEach((p) => {
        if (!p.el) return;
        p.currentOrbitAngle += p.orbitSpeed * delta / 1000 * p.spinDirection;

        const rotatedAngle = p.angle + this.globalAngle;
        const rotatedX = this.origin.x + this.radius * Math.cos(rotatedAngle);
        const rotatedY = this.origin.y + this.radius * Math.sin(rotatedAngle);

        const orbitX = Math.cos(p.currentOrbitAngle) * p.orbitRadius;
        const orbitY = Math.sin(p.currentOrbitAngle) * p.orbitRadius;

        const wobbleX = Math.sin(timestamp * 0.001 * p.wobble.speed) * 2;
        const wobbleY = Math.cos(timestamp * 0.001 * p.wobble.speed * 0.7) * 2;

        p.el.style.transform = `translate(${wobbleX + orbitX}px, ${wobbleY + orbitY}px) scale(${1 + Math.sin(timestamp * 0.001) * 0.1})`;
        p.el.style.left = `${rotatedX}px`;
        p.el.style.top = `${rotatedY}px`;
      });

      this.animationId = requestAnimationFrame(animateContinuous);
    };

    this.animationId = requestAnimationFrame(animateContinuous);
  }

  resetToOriginalPositions() {
    if (this.isAnimating && this.animationId) cancelAnimationFrame(this.animationId);
    this.isAnimating = false;

    this.particles.forEach((p) => {
      if (!p.el) return;
      p.el.style.transition = `all ${0.5 + Math.random() * 1}s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out`;
      p.el.style.left = `${p.original.x}px`;
      p.el.style.top = `${p.original.y}px`;
      p.el.style.opacity = "0";
      p.el.style.transform = "none";
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.particles.forEach((p) => p.el.remove());
  }
}

export default Ring;
