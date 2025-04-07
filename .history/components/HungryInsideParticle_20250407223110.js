export class HungryInsideParticle {
  constructor(char) {
    this.el = document.createElement("span");
    this.el.textContent = char;
    this.el.className = "absolute text-purple-300 font-bold text-sm md:text-base pointer-events-none z-20";
    this.el.style.fontFamily = `'Fira Code', 'Courier New', monospace`;
    this.el.style.opacity = "0.6";
    this.el.style.left = `${Math.random() * window.innerWidth}px`;
    this.el.style.top = `${Math.random() * window.innerHeight}px`;
    this.velocity = { x: 0, y: 0 };
    this.target = null;
  }

  setTarget(target) {
    this.target = target;
  }

  moveTowardTarget() {
    if (!this.target) return;

    const particleRect = this.el.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();

    const dx = targetRect.left - particleRect.left;
    const dy = targetRect.top - particleRect.top;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 1.5;

    if (dist > 1) {
      this.velocity.x = (dx / dist) * speed;
      this.velocity.y = (dy / dist) * speed;
      this.el.style.left = `${particleRect.left + this.velocity.x}px`;
      this.el.style.top = `${particleRect.top + this.velocity.y}px`;
    } else {
      this.target.style.opacity = "0";
      this.target = null;
    }
  }
}
