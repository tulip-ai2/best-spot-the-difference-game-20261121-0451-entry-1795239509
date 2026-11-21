// "Night Market" scene painter: lantern-lit stalls under strings of bulbs,
// shoppers in silhouette and a cat on the prowl. One rng stream, slot swaps.

import {
  skyGradient, glow, circle, ellipse, withAlpha, starPath, sparkStar, stringBulb, personSilhouette,
} from '../artutil.js';

export const SLOTS = [
  'moonPhase', 'starExtra', 'stringBulbGone', 'lanternColor', 'awningStripe', 'signWord',
  'lanternExtra', 'orangeCrateColor', 'scaleWeight', 'appleCount', 'personHat',
  'umbrellaMissing', 'catPresent',
];

export function paint(ctx, R, api) {
  const v = api.variant;

  skyGradient(ctx, 0, 0, 600, 430, [[0, '#101538'], [0.7, '#1c2a5e'], [1, '#2c3a72']]);
  for (let i = 0; i < 24; i++) {
    sparkStar(ctx, R.range(10, 590), R.range(8, 230), R.range(0.7, 1.7), '#dfe6ff', R.range(0.3, 0.85));
  }
  if (v('starExtra')) {
    ctx.fillStyle = '#ffffff';
    starPath(ctx, 250, 70, 7, 4, 0.35);
    ctx.fill();
    glow(ctx, 250, 70, 16, '#ffffff', 0.6);
  }

  // Moon: full and warm, or a dimmer crescent (moonPhase).
  glow(ctx, 500, 90, 44, v('moonPhase') ? '#ffd9a8' : '#dfe6ff', 0.5);
  circle(ctx, 500, 90, 26);
  ctx.fillStyle = v('moonPhase') ? '#ffd9a8' : '#dfe6ff';
  ctx.fill();
  if (v('moonPhase')) {
    ctx.fillStyle = '#1c2a5e';
    circle(ctx, 512, 84, 22);
    ctx.fill();
  } else {
    ctx.fillStyle = withAlpha('#aebbdd', 0.5);
    circle(ctx, 492, 84, 5);
    ctx.fill();
    circle(ctx, 506, 96, 3.4);
    ctx.fill();
  }

  // Distant rooftops behind the stalls.
  ctx.fillStyle = '#141a3a';
  for (const [bx, bw, bh] of [[0, 70, 90], [80, 50, 120], [140, 90, 70], [250, 60, 110], [330, 80, 60], [420, 60, 100], [500, 100, 80]]) {
    ctx.fillRect(bx, 330 - bh, bw, bh + 30);
    ctx.fillStyle = withAlpha('#ffd977', 0.5);
    for (let i = 0; i < Math.floor(bh / 40); i++) ctx.fillRect(bx + 10 + i * 18, 330 - bh + 14, 6, 8);
    ctx.fillStyle = '#141a3a';
  }

  // Cobbles.
  ctx.fillStyle = '#262a3e';
  ctx.fillRect(0, 420, 600, 180);
  for (let i = 0; i < 34; i++) {
    ellipse(ctx, R.range(8, 592), R.range(432, 594), R.range(9, 17), R.range(5, 8));
    ctx.fillStyle = withAlpha('#3c425e', R.range(0.4, 0.8));
    ctx.fill();
  }

  // String lights across the sky (stringBulbGone drops one bulb).
  ctx.strokeStyle = '#3a4060';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.quadraticCurveTo(300, 185, 600, 112);
  ctx.stroke();
  for (let i = 1; i <= 11; i++) {
    const t = i / 12;
    const x = 600 * t;
    const y = 110 + (185 - 110) * (4 * t * (1 - t)) * 0.72 + 8;
    if (v('stringBulbGone') && i === 3) continue;
    stringBulb(ctx, x, y, '#3a4060', i % 2 ? '#ffd977' : '#7ad0d8', 5.4);
  }

  const stall = (x0, x1, awnTop, stripeA, stripeB) => {
    ctx.fillStyle = '#4a3a2e';
    ctx.fillRect(x0 + 6, awnTop + 30, 7, 420 - awnTop - 30);
    ctx.fillRect(x1 - 13, awnTop + 30, 7, 420 - awnTop - 30);
    const stripes = Math.floor((x1 - x0) / 22);
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 ? stripeB : stripeA;
      ctx.fillRect(x0 + i * 22, awnTop, 22, 30);
      ctx.beginPath();
      ctx.moveTo(x0 + i * 22, awnTop + 30);
      ctx.quadraticCurveTo(x0 + i * 22 + 11, awnTop + 42, x0 + i * 22 + 22, awnTop + 30);
      ctx.fill();
    }
  };

  // Left stall: teal awning, apple crate, paper lantern (lanternColor).
  stall(25, 205, 210, '#4a9a9a', '#efe6d2');
  ctx.fillStyle = '#5d4633';
  ctx.fillRect(30, 340, 170, 22);
  ctx.fillStyle = '#4a3826';
  ctx.fillRect(38, 362, 10, 58);
  ctx.fillRect(180, 362, 10, 58);
  ctx.fillStyle = '#6e4a2e';
  ctx.fillRect(60, 302, 72, 38);
  ctx.strokeStyle = '#4a2f22';
  ctx.lineWidth = 2;
  ctx.strokeRect(61, 303, 70, 36);
  const apples = v('appleCount') ? 5 : 6;
  for (let i = 0; i < apples; i++) {
    const ax = 72 + (i % 3) * 22 + (i > 2 ? 11 : 0);
    const ay = i > 2 ? 310 : 326;
    circle(ctx, ax, ay, 9);
    ctx.fillStyle = '#c94f4f';
    ctx.fill();
    ctx.strokeStyle = '#4a6a2e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ax + 2, ay - 8);
    ctx.lineTo(ax + 6, ay - 12);
    ctx.stroke();
  }
  const lanColor = v('lanternColor') ? '#e87ab0' : '#7ad0d8';
  ctx.strokeStyle = '#3a4060';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(60, 240);
  ctx.lineTo(60, 252);
  ctx.stroke();
  ellipse(ctx, 60, 264, 14, 16);
  ctx.fillStyle = lanColor;
  ctx.fill();
  glow(ctx, 60, 264, 30, lanColor, 0.5);
  ctx.fillRect(56, 248, 8, 4);

  // Middle stall: red awning (awningStripe turns it purple), oranges,
  // and a two-pan scale whose balance shifts (scaleWeight).
  stall(225, 405, 235, v('awningStripe') ? '#7a4a9a' : '#c94f4f', '#efe6d2');
  ctx.fillStyle = '#5d4633';
  ctx.fillRect(230, 350, 170, 22);
  ctx.fillStyle = '#4a3826';
  ctx.fillRect(238, 372, 10, 48);
  ctx.fillRect(380, 372, 10, 48);
  ctx.fillStyle = '#6e4a2e';
  ctx.fillRect(255, 310, 64, 40);
  ctx.strokeStyle = '#4a2f22';
  ctx.strokeRect(256, 311, 62, 38);
  for (let i = 0; i < 6; i++) {
    circle(ctx, 268 + (i % 3) * 20, i > 2 ? 320 : 336, 8);
    ctx.fillStyle = '#e8963f';
    ctx.fill();
  }
  ctx.fillStyle = v('orangeCrateColor') ? '#3f6fae' : '#6e4a2e';
  ctx.fillRect(255, 346, 64, 5);
  // The scale.
  ctx.strokeStyle = '#c9c2b0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(345, 350);
  ctx.lineTo(345, 302);
  ctx.moveTo(317, 302);
  ctx.lineTo(373, 302);
  ctx.stroke();
  const tilt = v('scaleWeight');
  const yl = tilt ? 322 : 312;
  const yr = tilt ? 302 : 294;
  ctx.strokeStyle = '#c9c2b0';
  ctx.beginPath();
  ctx.moveTo(317, 302);
  ctx.lineTo(322, yl);
  ctx.moveTo(373, 302);
  ctx.lineTo(368, yr);
  ctx.stroke();
  ellipse(ctx, 322, yl + 4, 13, 5);
  ctx.fillStyle = '#c9c2b0';
  ctx.fill();
  ellipse(ctx, 368, yr + 4, 13, 5);
  ctx.fill();
  circle(ctx, 345, 298, 4);
  ctx.fillStyle = '#e8e2d2';
  ctx.fill();

  // Right stall: green awning, hanging sign (signWord), an extra paper
  // lantern (lanternExtra) and a cat below (catPresent).
  stall(415, 595, 210, '#4a7a3f', '#efe6d2');
  ctx.fillStyle = '#5d4633';
  ctx.fillRect(420, 340, 170, 22);
  ctx.fillStyle = '#4a3826';
  ctx.fillRect(428, 362, 10, 58);
  ctx.fillRect(570, 362, 10, 58);
  ctx.strokeStyle = '#3a4060';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(510, 240);
  ctx.lineTo(510, 250);
  ctx.stroke();
  ctx.fillStyle = '#4a3826';
  ctx.fillRect(478, 250, 64, 32);
  ctx.strokeStyle = '#2e2018';
  ctx.strokeRect(478, 250, 64, 32);
  ctx.fillStyle = '#ffd977';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(v('signWord') ? 'SPICE' : 'TEA', 510, 267);
  if (v('lanternExtra')) {
    ctx.beginPath();
    ctx.moveTo(440, 240);
    ctx.lineTo(440, 252);
    ctx.stroke();
    ellipse(ctx, 440, 264, 13, 15);
    ctx.fillStyle = '#e8963f';
    ctx.fill();
    glow(ctx, 440, 264, 28, '#e8963f', 0.5);
  }
  if (v('catPresent')) {
    ctx.fillStyle = '#1c1c26';
    ellipse(ctx, 470, 528, 20, 11);
    ctx.fill();
    circle(ctx, 452, 516, 9);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(446, 510);
    ctx.lineTo(444, 502);
    ctx.lineTo(450, 507);
    ctx.closePath();
    ctx.moveTo(456, 509);
    ctx.lineTo(460, 502);
    ctx.lineTo(460, 510);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(488, 528);
    ctx.quadraticCurveTo(504, 522, 500, 534);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1c1c26';
    ctx.stroke();
    glow(ctx, 449, 514, 2.6, '#9fe86a', 1);
  }

  // Closed umbrella leaning on the middle stall (umbrellaMissing drops it).
  if (!v('umbrellaMissing')) {
    ctx.save();
    ctx.translate(216, 430);
    ctx.rotate(0.12);
    ctx.fillStyle = '#b04a4a';
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-6, -88);
    ctx.lineTo(6, -88);
    ctx.lineTo(8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#8a3a3a';
    for (let i = 0; i < 3; i++) ctx.fillRect(-7, -20 - i * 26, 14, 4);
    ctx.strokeStyle = '#33241c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -88);
    ctx.quadraticCurveTo(-3, -96, 0, -100);
    ctx.stroke();
    ctx.restore();
  }

  // Shoppers (personHat caps the first one).
  personSilhouette(ctx, 92, 470, 88, '#1a1a26');
  if (v('personHat')) {
    ctx.fillStyle = '#1a1a26';
    ctx.fillRect(78, 388, 28, 4);
    ellipse(ctx, 92, 384, 9, 7);
    ctx.fill();
  }
  personSilhouette(ctx, 350, 478, 78, '#20202e');

  api.mark('moonPhase', 500, 90, 30);
  api.mark('starExtra', 250, 70, 26);
  api.mark('stringBulbGone', 150, 158, 26);
  api.mark('lanternColor', 60, 264, 28);
  api.mark('awningStripe', 315, 230, 34);
  api.mark('signWord', 510, 266, 32);
  api.mark('lanternExtra', 440, 264, 26);
  api.mark('orangeCrateColor', 287, 348, 30);
  api.mark('scaleWeight', 345, 315, 30);
  api.mark('appleCount', 96, 322, 30);
  api.mark('personHat', 92, 400, 28);
  api.mark('umbrellaMissing', 216, 400, 30);
  api.mark('catPresent', 468, 522, 28);
}
