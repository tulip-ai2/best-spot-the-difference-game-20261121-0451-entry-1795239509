// Particle and floating-text effects: find sparkles, wrong-click bursts,
// level-clear confetti and rising score numbers.

const SPARK = 'spark';
const BURST = 'burst';
const CONFETTI = 'confetti';
const TEXT = 'text';

export class Effects {
  constructor() {
    this.parts = [];
  }

  sparkBurst(x, y, color) {
    for (let i = 0; i < 18; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 190;
      this.parts.push({
        kind: SPARK,
        x,
        y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 40,
        life: 0.55 + Math.random() * 0.4,
        age: 0,
        r: 1.6 + Math.random() * 2.6,
        color,
      });
    }
  }

  wrongBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.parts.push({
        kind: BURST,
        x,
        y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 0.45,
        age: 0,
        r: 2 + Math.random() * 2.4,
        color: '#e05a5a',
      });
    }
  }

  confetti(w) {
    const colors = ['#ffd977', '#7ad0d8', '#e87ab0', '#8fd48a', '#e8963f'];
    for (let i = 0; i < 90; i++) {
      this.parts.push({
        kind: CONFETTI,
        x: Math.random() * w,
        y: -20 - Math.random() * 160,
        vx: (Math.random() - 0.5) * 60,
        vy: 120 + Math.random() * 180,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 8,
        life: 2.6 + Math.random() * 1.4,
        age: 0,
        r: 4 + Math.random() * 4,
        color: colors[i % colors.length],
      });
    }
  }

  scoreText(x, y, str, color) {
    this.parts.push({ kind: TEXT, x, y, vy: -46, life: 1.1, age: 0, str, color });
  }

  update(dt) {
    for (const p of this.parts) {
      p.age += dt;
      p.x += (p.vx ?? 0) * dt;
      p.y += (p.vy ?? 0) * dt;
      if (p.kind === SPARK || p.kind === BURST) p.vy += 340 * dt;
      if (p.kind === CONFETTI) p.rot += p.vr * dt;
    }
    this.parts = this.parts.filter((p) => p.age < p.life);
  }

  draw(ctx) {
    for (const p of this.parts) {
      const t = p.age / p.life;
      ctx.save();
      if (p.kind === TEXT) {
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = p.color;
        ctx.font = 'bold 22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.str, p.x, p.y);
      } else if (p.kind === CONFETTI) {
        ctx.globalAlpha = Math.min(1, (1 - t) * 2);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      } else {
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = p.color;
        circlePath(ctx, p.x, p.y, p.r * (1 - t * 0.4));
        ctx.fill();
      }
      ctx.restore();
    }
  }

  clear() {
    this.parts.length = 0;
  }
}

function circlePath(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
