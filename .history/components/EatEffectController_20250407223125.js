import { HungryInsideParticle } from "./HungryInsideParticle";

export class EatEffectController {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.interval = null;
    this.textTargets = [];
    this.insideCharList = ["{", "}", "<", ">", ";", "/", "=", "(", ")", "*", "[", "]", "+", "-", "&", "|", "!", "~", "%", '"', ":", "#"];
  }

  init(targetSpans) {
    this.textTargets = targetSpans;
    this.clear();

    for (let i = 0; i < 40; i++) {
      const char = this.insideCharList[Math.floor(Math.random() * this.insideCharList.length)];
      const p = new HungryInsideParticle(char);
      this.container.appendChild(p.el);
      this.particles.push(p);
    }

    this.assignTargets();
    this.animate();
  }

  assignTargets() {
    this.particles.forEach((p, i) => {
      const target = this.textTargets[i % this.textTargets.length];
      p.setTarget(target);
    });
  }

  animate() {
    this.interval = setInterval(() => {
      this.particles.forEach(p => p.moveTowardTarget());
    }, 30);
  }

  clear() {
    this.particles.forEach(p => p.el.remove());
    if (this.interval) clearInterval(this.interval);
    this.particles = [];
  }
}
