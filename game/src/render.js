// All drawing: the chrome around the panels, the two scene blits, found
// markers, hint rings, the HUD bars and every overlay screen. The renderer
// reads the game state and paints it; it holds no game logic.

import {
  VIEW_W, VIEW_H, PANEL_W, PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y, HUD,
} from './config.js';
import { STATE } from './game.js';
import { glow, fillRoundRect, starPath } from './artutil.js';

const FONT = 'Georgia, "Times New Roman", serif';
const GOLD = '#ffd977';
const PAPER = '#f2e7cf';
const INK = '#1b1f2e';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  draw(game, now) {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);
    drawBackdrop(ctx, now);
    if (game.state === STATE.TITLE) {
      drawTitle(ctx, now, game);
      ctx.restore();
      return;
    }
    drawTopBar(ctx, game);
    const shakeX = game.shake > 0 ? (Math.random() - 0.5) * game.shake * 9 : 0;
    const shakeY = game.shake > 0 ? (Math.random() - 0.5) * game.shake * 9 : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    drawPanel(ctx, game, game.level.left, PANEL_LEFT_X, now);
    drawPanel(ctx, game, game.level.right, PANEL_RIGHT_X, now);
    drawDividers(ctx);
    for (const slot of game.level.slots) if (slot.found) drawFoundMarker(ctx, slot, now);
    if (game.hint) drawHintRing(ctx, game.hint.slot, now, game.hint.until);
    drawWrongMarks(ctx, game, now);
    ctx.restore();
    drawBottomBar(ctx, game);
    if (game.state === STATE.INTRO) drawIntroCard(ctx, game, now);
    if (game.state === STATE.CLEAR) drawClearCard(ctx, game);
    if (game.state === STATE.TIMEUP) drawTimeUpCard(ctx, game);
    if (game.state === STATE.FINALE) drawFinaleCard(ctx, game);
    game.effects.draw(ctx);
    ctx.restore();
  }
}

function drawBackdrop(ctx, now) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, '#141828');
  g.addColorStop(1, '#0d101c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = 'rgba(255,217,119,0.05)';
  for (let i = 0; i < 40; i++) {
    const x = (i * 197 + ((now * 4) | 0)) % VIEW_W;
    const y = (i * 131) % VIEW_H;
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawTopBar(ctx, game) {
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  ctx.fillRect(0, 0, VIEW_W, 62);
  ctx.fillStyle = GOLD;
  ctx.font = `bold 26px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('DOUBLE TAKE', 24, 32);
  ctx.fillStyle = 'rgba(242,231,207,0.9)';
  ctx.font = `italic 17px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`Scene ${game.level.index + 1} of 6 — ${game.level.sceneName}`, VIEW_W / 2, 32);
  ctx.textAlign = 'right';
  ctx.fillStyle = PAPER;
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillText(`${game.score.toLocaleString()} pts`, VIEW_W - 150, 32);
  if (game.streak >= 2) {
    ctx.fillStyle = '#e8963f';
    ctx.font = `bold 18px ${FONT}`;
    ctx.fillText(`streak ×${game.streak}`, VIEW_W - 24, 32);
  }
}

function drawPanel(ctx, game, canvas, x, now) {
  void game;
  void now;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.drawImage(canvas, x, PANEL_Y);
  ctx.restore();
  ctx.strokeStyle = 'rgba(242,231,207,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, PANEL_Y + 1.5, PANEL_W - 3, PANEL_H - 3);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2.5, PANEL_Y - 2.5, PANEL_W + 5, PANEL_H + 5);
}

function drawDividers(ctx) {
  ctx.fillStyle = 'rgba(255,217,119,0.75)';
  starPath(ctx, VIEW_W / 2, PANEL_Y + PANEL_H / 2, 13, 4, 0.4);
  ctx.fill();
  glow(ctx, VIEW_W / 2, PANEL_Y + PANEL_H / 2, 34, GOLD, 0.28);
}

function drawFoundMarker(ctx, slot, now) {
  const age = now - slot.foundAt;
  const pop = age < 0.28 ? 1.7 - (age / 0.28) * 0.7 : 1;
  const pulse = 1 + Math.sin(now * 3.4 + slot.x) * 0.05;
  const badge = 15 * pop * pulse;
  for (const px of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    const mx = px + slot.x;
    const my = PANEL_Y + slot.y;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,217,119,0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mx, my, slot.r * 0.72 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,217,119,0.14)';
    ctx.fill();
    circleFill(ctx, mx, my, badge, GOLD);
    circleFill(ctx, mx, my, badge - 4.5, '#1e5a52');
    ctx.fillStyle = INK;
    ctx.font = `bold ${Math.round(badge * 1.05)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(slot.order), mx, my + 1);
    ctx.restore();
  }
}

function drawHintRing(ctx, slot, now, until) {
  const life = Math.max(0, until - now);
  const blink = 0.45 + 0.55 * Math.abs(Math.sin(now * 7));
  const radius = slot.r * 0.72 + Math.sin(now * 6) * 5;
  for (const px of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, life * 2) * blink;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 5;
    ctx.setLineDash([12, 9]);
    ctx.beginPath();
    ctx.arc(px + slot.x, PANEL_Y + slot.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawWrongMarks(ctx, game, now) {
  for (const m of game.wrongMarks) {
    const t = (now - m.at) / 0.45;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = '#e05a5a';
    ctx.lineWidth = 5;
    const s = 14 * (0.7 + t * 0.5);
    ctx.beginPath();
    ctx.moveTo(m.x - s, m.y - s);
    ctx.lineTo(m.x + s, m.y + s);
    ctx.moveTo(m.x + s, m.y - s);
    ctx.lineTo(m.x - s, m.y + s);
    ctx.stroke();
    ctx.restore();
  }
}

function drawBottomBar(ctx, game) {
  const y = HUD.barY;
  const h = HUD.barH;
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  ctx.fillRect(0, y - 6, VIEW_W, h + 14);

  // Found / remaining counters.
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = `bold 20px ${FONT}`;
  ctx.fillStyle = '#8fd48a';
  const found = game.foundCount();
  const total = game.level.slots.length;
  ctx.fillText(`FOUND ${found}/${total}`, 24, y + h / 2);
  const remaining = total - found;
  ctx.fillStyle = remaining > 0 ? GOLD : '#8fd48a';
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillText(remaining > 0 ? `${remaining} TO FIND` : 'SCENE CLEARED', 190, y + h / 2);

  // Time bar.
  const bx = HUD.timeBarX;
  const bw = HUD.timeBarW;
  const frac = Math.max(0, Math.min(1, game.timeLeft / game.level.time));
  fillRoundRect(ctx, bx, y + 6, bw, h - 12, (h - 12) / 2, 'rgba(255,255,255,0.12)');
  const danger = game.timeLeft <= 12;
  if (frac > 0) {
    fillRoundRect(
      ctx, bx, y + 6, Math.max(h - 12, bw * frac), h - 12, (h - 12) / 2,
      danger ? '#e05a5a' : frac < 0.4 ? '#e8963f' : '#7ad0d8',
    );
  }
  ctx.fillStyle = PAPER;
  ctx.font = `bold 18px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(game.timeLeft)}s`, bx + bw + 44, y + h / 2);
  ctx.font = `italic 13px ${FONT}`;
  ctx.fillStyle = 'rgba(242,231,207,0.55)';
  ctx.fillText('time', bx + bw + 44, y + h / 2 + 20);

  drawButton(ctx, HUD.hintButton, `HINT (${game.hintsLeft})`, game.hintsLeft > 0);
  drawButton(ctx, HUD.soundButton, game.audio.muted ? 'MUTED' : 'SOUND', true);
}

function drawButton(ctx, rect, label, enabled) {
  fillRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10, enabled ? 'rgba(255,217,119,0.16)' : 'rgba(255,255,255,0.05)');
  ctx.strokeStyle = enabled ? 'rgba(255,217,119,0.7)' : 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2);
  ctx.fillStyle = enabled ? GOLD : 'rgba(242,231,207,0.4)';
  ctx.font = `bold 15px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function card(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(13,16,28,0.88)';
  fillRoundRect(ctx, x, y, w, h, 16, 'rgba(13,16,28,0.88)');
  ctx.strokeStyle = 'rgba(255,217,119,0.8)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
}

function drawIntroCard(ctx, game, now) {
  const slide = Math.min(1, (INTRO_CARD_SEC - game.introT) * 4);
  const yOff = (1 - slide) * 30;
  card(ctx, 290, 300 + yOff, 700, 190);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GOLD;
  ctx.font = `bold 34px ${FONT}`;
  ctx.fillText(game.level.sceneName, 640, 352 + yOff);
  ctx.fillStyle = PAPER;
  ctx.font = `20px ${FONT}`;
  ctx.fillText(`${game.level.slots.length} differences hide between the two scenes`, 640, 396 + yOff);
  ctx.fillStyle = 'rgba(242,231,207,0.75)';
  ctx.font = `italic 17px ${FONT}`;
  ctx.fillText(`${game.level.time} seconds on the clock — wrong clicks cost 5 — click to begin`, 640, 438 + yOff);
  void now;
}

function drawClearCard(ctx, game) {
  const s = game.clearStats;
  card(ctx, 340, 250, 600, 300);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GOLD;
  ctx.font = `bold 36px ${FONT}`;
  ctx.fillText('Scene Cleared!', 640, 300);
  ctx.font = `20px ${FONT}`;
  ctx.fillStyle = PAPER;
  const rows = [
    `All ${s.finds} differences spotted`,
    `Time bonus  +${s.timeBonus}`,
    `Hints used  ${s.hintsUsed}   ·   Wrong clicks  ${s.wrongClicks}`,
    `Score  ${s.score.toLocaleString()}`,
  ];
  rows.forEach((row, i) => ctx.fillText(row, 640, 348 + i * 34));
  ctx.fillStyle = 'rgba(242,231,207,0.75)';
  ctx.font = `italic 16px ${FONT}`;
  ctx.fillText(s.last ? 'One scene left to close the case…' : 'Click for the next scene', 640, 512);
}

function drawTimeUpCard(ctx, game) {
  card(ctx, 360, 280, 560, 220);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#e05a5a';
  ctx.font = `bold 40px ${FONT}`;
  ctx.fillText("Time's Up!", 640, 336);
  ctx.fillStyle = PAPER;
  ctx.font = `21px ${FONT}`;
  ctx.fillText(`You spotted ${game.foundCount()} of ${game.level.slots.length} differences`, 640, 384);
  ctx.fillText(`Final score  ${game.score.toLocaleString()}`, 640, 418);
  ctx.fillStyle = 'rgba(242,231,207,0.75)';
  ctx.font = `italic 16px ${FONT}`;
  ctx.fillText('Click to take the case again', 640, 462);
}

function drawFinaleCard(ctx, game) {
  card(ctx, 320, 240, 640, 300);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GOLD;
  ctx.font = `bold 40px ${FONT}`;
  ctx.fillText('Case Closed!', 640, 296);
  ctx.fillStyle = PAPER;
  ctx.font = `23px ${FONT}`;
  ctx.fillText(`Rank earned: ${game.finalRank}`, 640, 348);
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillStyle = '#8fd48a';
  ctx.fillText(`${game.score.toLocaleString()} points`, 640, 392);
  ctx.font = `18px ${FONT}`;
  ctx.fillStyle = 'rgba(242,231,207,0.75)';
  ctx.fillText(`Best score: ${game.best.toLocaleString()}`, 640, 430);
  ctx.font = `italic 16px ${FONT}`;
  ctx.fillText('Click to open a fresh case', 640, 478);
}

function drawTitle(ctx, now, game) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const bob = Math.sin(now * 1.6) * 6;
  ctx.fillStyle = GOLD;
  ctx.font = `bold 74px ${FONT}`;
  ctx.fillText('DOUBLE TAKE', VIEW_W / 2, 168 + bob);
  ctx.fillStyle = PAPER;
  ctx.font = `italic 24px ${FONT}`;
  ctx.fillText('A spot-the-difference detective case', VIEW_W / 2, 228 + bob);

  // A magnifying glass emblem.
  const mx = VIEW_W / 2;
  const my = 330;
  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(-0.5 + Math.sin(now * 1.2) * 0.06);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(0, -16, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(122,208,216,0.25)';
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(30, 14);
  ctx.lineTo(58, 48);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(242,231,207,0.9)';
  ctx.font = `19px ${FONT}`;
  ctx.fillText('Two scenes. A handful of secrets. Spot what changed,', VIEW_W / 2, 438);
  ctx.fillText('click it on either panel, and clear all six before the clock does.', VIEW_W / 2, 466);
  ctx.fillStyle = GOLD;
  ctx.font = `bold 24px ${FONT}`;
  if (Math.sin(now * 3) > -0.3) ctx.fillText('Click anywhere to open the case', VIEW_W / 2, 540);
  ctx.fillStyle = 'rgba(242,231,207,0.6)';
  ctx.font = `15px ${FONT}`;
  ctx.fillText('H — hint   ·   M — sound   ·   6 scenes, 45 differences', VIEW_W / 2, 590);
  ctx.fillStyle = 'rgba(242,231,207,0.4)';
  ctx.font = `italic 14px ${FONT}`;
  ctx.fillText(`Best score: ${game.best.toLocaleString()}   ·   original art, music and code`, VIEW_W / 2, 626);
}

function circleFill(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
