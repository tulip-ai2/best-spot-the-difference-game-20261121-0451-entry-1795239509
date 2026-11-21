// "Clockmaker's Attic" scene painter: a cluttered workshop loft under a round
// window, full of clocks, jars and a resident cat. Same rules as every painter:
// the rng stream stays identical on both panels; only slot variants differ.

import {
  plankWall, glow, circle, ellipse, withAlpha, fillRoundRect, roundRectPath, sparkStar,
} from '../artutil.js';

export const SLOTS = [
  'windowCrack', 'bulbOn', 'wallClockSize', 'gearTeeth', 'shelfJarColor', 'jarMissing',
  'clockHands', 'pendulumBob', 'cuckooDoor', 'cobwebBig', 'bookColor', 'catTail',
  'toolboxLatch', 'mouseMissing',
];

function drawClockFace(ctx, x, y, r, hourAngle, minuteAngle) {
  circle(ctx, x, y, r);
  ctx.fillStyle = '#f2e7cf';
  ctx.fill();
  ctx.strokeStyle = '#4a2f22';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = '#4a2f22';
  ctx.lineWidth = Math.max(2.5, r * 0.09);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * r * 0.5, y + Math.sin(hourAngle) * r * 0.5);
  ctx.stroke();
  ctx.lineWidth = Math.max(1.8, r * 0.06);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minuteAngle) * r * 0.75, y + Math.sin(minuteAngle) * r * 0.75);
  ctx.stroke();
  circle(ctx, x, y, r * 0.07);
  ctx.fillStyle = '#4a2f22';
  ctx.fill();
}

export function paint(ctx, R, api) {
  const v = api.variant;

  plankWall(ctx, 600, 600, '#8a6a4e', '#4a2f22', '#c49a6c', 52);
  // Floorboards.
  ctx.fillStyle = '#6e4f38';
  ctx.fillRect(0, 520, 600, 80);
  ctx.strokeStyle = withAlpha('#4a2f22', 0.6);
  ctx.lineWidth = 2;
  for (let x = 0; x < 600; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + ((x / 64) % 2) * 32, 520);
    ctx.lineTo(x + ((x / 64) % 2) * 32, 600);
    ctx.stroke();
  }

  // Round window with night sky, moon and stars (windowCrack breaks the glass).
  circle(ctx, 140, 170, 66);
  ctx.fillStyle = '#4a2f22';
  ctx.fill();
  circle(ctx, 140, 170, 58);
  ctx.fillStyle = '#1c2447';
  ctx.fill();
  for (let i = 0; i < 9; i++) {
    sparkStar(ctx, R.range(100, 185), R.range(128, 212), R.range(0.7, 1.6), '#ffe9c9', R.range(0.4, 0.9));
  }
  circle(ctx, 118, 148, 16);
  ctx.fillStyle = '#ffe9c0';
  ctx.fill();
  glow(ctx, 118, 148, 30, '#ffe9c0', 0.5);
  if (v('windowCrack')) {
    ctx.strokeStyle = withAlpha('#dfe9ff', 0.85);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(158, 148);
    ctx.lineTo(170, 166);
    ctx.lineTo(162, 182);
    ctx.moveTo(170, 166);
    ctx.lineTo(186, 172);
    ctx.moveTo(162, 182);
    ctx.lineTo(172, 198);
    ctx.stroke();
  }

  // Hanging bulb on a cord (bulbOn lights it).
  ctx.strokeStyle = '#33241c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(255, 0);
  ctx.lineTo(255, 118);
  ctx.stroke();
  ctx.fillStyle = '#33241c';
  ctx.fillRect(249, 118, 12, 8);
  if (v('bulbOn')) {
    glow(ctx, 255, 138, 46, '#ffd977', 0.65);
    circle(ctx, 255, 136, 12);
    ctx.fillStyle = '#ffe9a8';
    ctx.fill();
  } else {
    circle(ctx, 255, 136, 12);
    ctx.fillStyle = '#8f8674';
    ctx.fill();
  }

  // Round wall clock (wallClockSize makes it bigger).
  const wr = v('wallClockSize') ? 40 : 30;
  drawClockFace(ctx, 330, 110, wr, Math.PI * 0.35, Math.PI * 1.2);

  // Wall gear with a toothier variant.
  const teeth = v('gearTeeth') ? 12 : 8;
  ctx.fillStyle = '#b08d3f';
  for (let i = 0; i < teeth; i++) {
    const ang = (Math.PI * 2 * i) / teeth;
    ctx.save();
    ctx.translate(255, 250);
    ctx.rotate(ang);
    ctx.fillRect(-4, -32, 8, 10);
    ctx.restore();
  }
  circle(ctx, 255, 250, 26);
  ctx.fillStyle = '#b08d3f';
  ctx.fill();
  circle(ctx, 255, 250, 9);
  ctx.fillStyle = '#8a6a4e';
  ctx.fill();

  // Shelf one with jars (jarMissing empties the tall jar, shelfJarColor
  // recolors the first lid).
  ctx.fillStyle = '#59392a';
  ctx.fillRect(60, 302, 155, 10);
  ctx.fillRect(68, 312, 8, 26);
  ctx.fillRect(198, 312, 8, 26);
  const jar = (x, top, w, h, glass, lid) => {
    fillRoundRect(ctx, x, top, w, h, 6, glass);
    ctx.fillStyle = lid;
    ctx.fillRect(x - 3, top - 7, w + 6, 8);
    ctx.fillStyle = withAlpha('#ffffff', 0.25);
    ctx.fillRect(x + 4, top + 5, 4, h - 10);
  };
  jar(76, 268, 22, 34, '#9db3a4', v('shelfJarColor') ? '#c94f4f' : '#4a6a8a');
  jar(112, 274, 20, 28, '#b3a48c', '#6a5a3f');
  if (!v('jarMissing')) jar(152, 262, 22, 40, '#a4b3c2', '#4a6a8a');

  // Grandfather clock: face time differs (clockHands), pendulum bob recolored.
  ctx.fillStyle = '#5d3c26';
  ctx.fillRect(398, 180, 64, 360);
  fillRoundRect(ctx, 392, 168, 76, 18, 6, '#4a2f22');
  ctx.fillStyle = '#4a2f22';
  ctx.fillRect(398, 180, 8, 360);
  ctx.fillRect(454, 180, 8, 360);
  drawClockFace(ctx, 430, 244, 30, v('clockHands') ? Math.PI * 0.55 : -Math.PI * 0.3, v('clockHands') ? Math.PI * 1.75 : Math.PI * 0.9);
  fillRoundRect(ctx, 412, 320, 36, 112, 4, '#33241c');
  ctx.strokeStyle = '#c9a96a';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(430, 330);
  ctx.lineTo(430, 392);
  ctx.stroke();
  circle(ctx, 430, 400, 11);
  ctx.fillStyle = v('pendulumBob') ? '#4a8a9a' : '#c9a96a';
  ctx.fill();

  // Cuckoo clock (cuckooDoor opens it and pops the bird out).
  ctx.fillStyle = '#6e4a2e';
  ctx.beginPath();
  ctx.moveTo(505, 150);
  ctx.lineTo(525, 128);
  ctx.lineTo(545, 150);
  ctx.lineTo(545, 202);
  ctx.lineTo(505, 202);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#59392a';
  ctx.beginPath();
  ctx.moveTo(500, 152);
  ctx.lineTo(525, 126);
  ctx.lineTo(550, 152);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 525, 170, 12);
  ctx.fillStyle = '#f2e7cf';
  ctx.fill();
  const doorOpen = v('cuckooDoor');
  ctx.fillStyle = doorOpen ? '#33241c' : '#4a2f22';
  ctx.fillRect(513, 188, 24, 12);
  if (doorOpen) {
    ellipse(ctx, 525, 191, 6, 4.4);
    ctx.fillStyle = '#d9b04b';
    ctx.fill();
    circle(ctx, 521, 187, 2);
    ctx.fillStyle = '#33241c';
    ctx.fill();
  }

  // Cobweb in the top-right corner (cobwebBig spins a wider web).
  const webR = v('cobwebBig') ? 86 : 52;
  ctx.strokeStyle = withAlpha('#e8dcc8', 0.55);
  ctx.lineWidth = 1.4;
  for (let i = 0; i <= 4; i++) {
    const ang = (Math.PI / 2) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(600, 0);
    ctx.lineTo(600 - Math.cos(ang) * webR, Math.sin(ang) * webR);
    ctx.stroke();
  }
  for (const rr of [webR * 0.33, webR * 0.66, webR]) {
    ctx.beginPath();
    ctx.arc(600, 0, rr, 0, Math.PI / 2);
    ctx.stroke();
  }

  // Shelf two with stacked books (bookColor recolors the middle one).
  ctx.fillStyle = '#59392a';
  ctx.fillRect(330, 388, 140, 10);
  ctx.fillRect(338, 398, 8, 26);
  ctx.fillRect(462, 398, 8, 26);
  ctx.fillStyle = '#8a3a3a';
  ctx.fillRect(340, 378, 64, 10);
  ctx.fillStyle = v('bookColor') ? '#3f7a4a' : '#c98a3f';
  ctx.fillRect(344, 368, 58, 10);
  ctx.fillStyle = '#4a5a8a';
  ctx.fillRect(348, 358, 52, 10);

  // Cat silhouette on the floor, tail curling either way (catTail).
  ctx.fillStyle = '#2b2330';
  ellipse(ctx, 492, 508, 30, 22);
  ctx.fill();
  circle(ctx, 470, 486, 15);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(458, 478);
  ctx.lineTo(454, 462);
  ctx.lineTo(466, 472);
  ctx.closePath();
  ctx.moveTo(478, 476);
  ctx.lineTo(484, 462);
  ctx.lineTo(488, 476);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#2b2330';
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (v('catTail')) {
    ctx.moveTo(518, 512);
    ctx.quadraticCurveTo(548, 508, 544, 480);
  } else {
    ctx.moveTo(518, 512);
    ctx.quadraticCurveTo(546, 522, 548, 494);
  }
  ctx.stroke();
  glow(ctx, 466, 484, 3.4, '#ffd977', 0.9);
  glow(ctx, 474, 484, 3.4, '#ffd977', 0.9);

  // Toolbox with a latch that changes metal (toolboxLatch).
  fillRoundRect(ctx, 172, 474, 56, 32, 5, '#8a3a3a');
  ctx.fillStyle = '#6e2c2c';
  ctx.fillRect(172, 486, 56, 5);
  ctx.strokeStyle = '#4a2f22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(200, 474, 12, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = v('toolboxLatch') ? '#c9a96a' : '#8f96a3';
  ctx.fillRect(194, 486, 12, 9);

  // Mousehole in the left wall (mouseMissing evicts the mouse).
  ctx.fillStyle = '#2b1c14';
  ctx.beginPath();
  ctx.moveTo(18, 556);
  ctx.lineTo(18, 536);
  ctx.arc(32, 536, 14, Math.PI, 0);
  ctx.lineTo(46, 556);
  ctx.closePath();
  ctx.fill();
  if (!v('mouseMissing')) {
    ellipse(ctx, 60, 552, 9, 5.5);
    ctx.fillStyle = '#8f8674';
    ctx.fill();
    circle(ctx, 68, 548, 4);
    ctx.fill();
    circle(ctx, 66, 544, 2);
    ctx.fillStyle = '#d9a0a0';
    ctx.fill();
  }

  // A clutter pile for depth: boxes under shelf one.
  ctx.fillStyle = '#7c5a3a';
  ctx.fillRect(64, 462, 58, 56);
  ctx.strokeStyle = '#59392a';
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 462, 58, 56);
  ctx.beginPath();
  ctx.moveTo(64, 482);
  ctx.lineTo(122, 482);
  ctx.stroke();

  api.mark('windowCrack', 140, 170, 38);
  api.mark('bulbOn', 255, 138, 30);
  api.mark('wallClockSize', 330, 110, 38);
  api.mark('gearTeeth', 255, 250, 32);
  api.mark('shelfJarColor', 87, 270, 26);
  api.mark('jarMissing', 163, 282, 26);
  api.mark('clockHands', 430, 244, 32);
  api.mark('pendulumBob', 430, 400, 26);
  api.mark('cuckooDoor', 525, 166, 28);
  api.mark('cobwebBig', 566, 44, 30);
  api.mark('bookColor', 373, 366, 28);
  api.mark('catTail', 500, 498, 32);
  api.mark('toolboxLatch', 200, 488, 26);
  api.mark('mouseMissing', 40, 544, 26);
}
