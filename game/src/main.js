// Entry point: sets up the canvas, the audio kit, the game, the input layer
// and the render loop, then starts the title screen.

import { VIEW_W, VIEW_H } from './config.js';
import { AudioKit } from './audio.js';
import { Effects } from './effects.js';
import { Game } from './game.js';
import { Renderer } from './render.js';
import { Input } from './input.js';
import { parseDemo } from './demo.js';

function fitCanvas(canvas) {
  const scale = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  canvas.style.width = `${Math.floor(VIEW_W * scale)}px`;
  canvas.style.height = `${Math.floor(VIEW_H * scale)}px`;
}

function boot() {
  const canvas = document.getElementById('game');
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  fitCanvas(canvas);
  window.addEventListener('resize', () => fitCanvas(canvas));

  const audio = new AudioKit();
  const effects = new Effects();
  const demo = parseDemo(window.location.search);
  const game = new Game(audio, effects, demo);
  new Input(canvas, game);
  const renderer = new Renderer(canvas);

  const wakeAudio = () => {
    if (!demo) audio.startMusic();
    window.removeEventListener('pointerdown', wakeAudio);
    window.removeEventListener('keydown', wakeAudio);
  };
  window.addEventListener('pointerdown', wakeAudio);
  window.addEventListener('keydown', wakeAudio);

  let last = performance.now();
  const frame = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    game.update(dt, t / 1000);
    renderer.draw(game, t / 1000);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  if (demo && new URLSearchParams(window.location.search).get('debug') === '1') {
    window.addEventListener('error', (e) => {
      document.getElementById('status').textContent = `JSERROR ${e.message} @${e.filename}:${e.lineno}`;
    });
    setTimeout(() => runSelfTest(game), 1200);
  }
}

/** Pixel-diff self test: every slot must produce a visible panel difference. */
function runSelfTest(game) {
  const out = [];
  try {
    const left = game.level.left.getContext('2d').getImageData(0, 0, 600, 600).data;
    const right = game.level.right.getContext('2d').getImageData(0, 0, 600, 600).data;
    const map = new Uint8Array(600 * 600);
    let diff = 0;
    for (let i = 0, p = 0; i < left.length; i += 4, p++) {
      if (Math.abs(left[i] - right[i]) > 14
        || Math.abs(left[i + 1] - right[i + 1]) > 14
        || Math.abs(left[i + 2] - right[i + 2]) > 14) {
        diff += 1;
        map[p] = 1;
      }
    }
    out.push(`diffPixels=${diff}`);
    for (const slot of game.level.slots) {
      let near = 0;
      const x0 = Math.max(0, slot.x - 44);
      const x1 = Math.min(600, slot.x + 44);
      const y0 = Math.max(0, slot.y - 44);
      const y1 = Math.min(600, slot.y + 44);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) if (map[y * 600 + x]) near += 1;
      }
      out.push(`${slot.id}:${near}`);
    }
    out.push(`state=${game.state} found=${game.foundCount()} remain=${game.remainingCount()}`);
  } catch (err) {
    out.push(`ERR ${err.message}`);
  }
  const status = document.getElementById('status');
  status.textContent = `SELFTEST ${out.join(' ')}`;
  document.title = 'SELFTEST-DONE';
}

boot();
