// Pointer and keyboard wiring: screen-to-canvas coordinate mapping, click
// routing into the game, hover cursor and the H/M/Enter shortcut keys.

import { VIEW_W, VIEW_H, HUD } from './config.js';

export class Input {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;

    canvas.addEventListener('pointerdown', (e) => {
      const [x, y] = this.toCanvas(e);
      this.game.handleClick(x, y, this.now());
      e.preventDefault();
    });

    canvas.addEventListener('pointermove', (e) => {
      const [x, y] = this.toCanvas(e);
      this.canvas.style.cursor = this.hoverPointer(x, y) ? 'pointer' : 'default';
    });

    window.addEventListener('keydown', (e) => {
      const g = this.game;
      if (e.key === 'h' || e.key === 'H') g.useHint(this.now());
      else if (e.key === 'm' || e.key === 'M') {
        g.audio.setMuted(!g.audio.muted);
      } else if (e.key === 'Enter' || e.key === ' ') {
        g.handleClick(VIEW_W / 2, VIEW_H / 2, this.now());
        e.preventDefault();
      }
    });
  }

  now() {
    return performance.now() / 1000;
  }

  toCanvas(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      ((e.clientX - rect.left) / rect.width) * VIEW_W,
      ((e.clientY - rect.top) / rect.height) * VIEW_H,
    ];
  }

  hoverPointer(x, y) {
    const g = this.game;
    if (g.state === 'play' && g.level) {
      if (x >= HUD.hintButton.x && x <= HUD.hintButton.x + HUD.hintButton.w
        && y >= HUD.hintButton.y && y <= HUD.hintButton.y + HUD.hintButton.h) return true;
      if (x >= HUD.soundButton.x && x <= HUD.soundButton.x + HUD.soundButton.w
        && y >= HUD.soundButton.y && y <= HUD.soundButton.y + HUD.soundButton.h) return true;
      if (y >= 74 && y < 674 && (x >= 10 && x < 610 || x >= 670 && x < 1270)) return true;
    }
    return g.state !== 'play';
  }
}
