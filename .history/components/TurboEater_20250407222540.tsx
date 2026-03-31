export class HungryInsideParticle {
    el: HTMLSpanElement;
    container: HTMLElement;
    interval: number | null = null;
  
    constructor(container: HTMLElement, chars: string[]) {
      this.container = container;
      this.el = document.createElement("span");
      this.el.textContent = chars[Math.floor(Math.random() * chars.length)];
      this.el.style.position = "absolute";
      this.el.style.fontFamily = "'Fira Code', monospace";
      this.el.style.fontWeight = "bold";
      this.el.style.color = "hsl(270, 90%, 70%)";
      this.el.style.opacity = "0.7";
      this.el.style.transition = "left 0.3s, top 0.3s, transform 0.2s";
      this.el.style.pointerEvents = "none";
      this.container.appendChild(this.el);
      this.randomizePosition();
    }
  
    randomizePosition() {
      this.el.style.left = `${Math.random() * this.container.offsetWidth}px`;
      this.el.style.top = `${Math.random() * this.container.offsetHeight}px`;
    }
  
    moveTo(x: number, y: number) {
      this.el.style.left = `${x}px`;
      this.el.style.top = `${y}px`;
      this.el.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 360}deg)`;
    }
  
    destroy() {
      this.el.remove();
      if (this.interval) clearInterval(this.interval);
    }
  }
  
  export class EatEffectController {
    targets: HTMLSpanElement[];
    particles: HungryInsideParticle[];
    interval: number | null = null;
  
    constructor(targets: HTMLSpanElement[], particles: HungryInsideParticle[]) {
      this.targets = targets;
      this.particles = particles;
    }
  
    start() {
      this.interval = window.setInterval(() => {
        this.targets.forEach((letter, i) => {
          if (Math.random() < 0.1) return; // random chance to skip (organic feel)
  
          const rect = letter.getBoundingClientRect();
          const closest = this.particles[Math.floor(Math.random() * this.particles.length)];
          const containerRect = closest.container.getBoundingClientRect();
  
          const targetX = rect.left + rect.width / 2 - containerRect.left;
          const targetY = rect.top + rect.height / 2 - containerRect.top;
  
          closest.moveTo(targetX + (Math.random() - 0.5) * 10, targetY + (Math.random() - 0.5) * 10);
          letter.style.opacity = `${Math.max(0, Number(letter.style.opacity) - 0.05)}`;
        });
      }, 50);
    }
  
    reset() {
      this.targets.forEach(t => (t.style.opacity = "1"));
      this.particles.forEach(p => p.randomizePosition());
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  