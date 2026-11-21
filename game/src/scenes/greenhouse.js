// "Glasshouse Greens" scene painter: a sunlit greenhouse full of potted
// plants, panes of glass and small visitors. One rng stream, slot swaps.

import {
  skyGradient, glow, circle, ellipse, withAlpha, pottedPlant, fillRoundRect,
} from '../artutil.js';

export const SLOTS = [
  'flowerColor', 'vineExtra', 'paneCrack', 'planterColor', 'butterflyFlip', 'potMissing',
  'fernCount', 'ladybugSpots', 'mushroomExtra', 'packetTilt', 'thermoLevel', 'spoutFlip',
  'snailShell',
];

export function paint(ctx, R, api) {
  const v = api.variant;

  // Glass wall showing the sky outside, with the frame grid over it.
  skyGradient(ctx, 0, 0, 600, 430, [[0, '#a8d0c8'], [0.6, '#cfe8da'], [1, '#e6f2ea']]);
  glow(ctx, 470, 70, 130, '#ffe9b0', 0.5);
  circle(ctx, 470, 70, 34);
  ctx.fillStyle = '#fff2c8';
  ctx.fill();
  // Distant hedge through the glass.
  ctx.fillStyle = withAlpha('#5a8a5e', 0.5);
  ctx.fillRect(0, 330, 600, 100);
  ctx.fillStyle = '#3f6b52';
  ctx.fillRect(0, 420, 600, 10);

  // Frame beams.
  ctx.fillStyle = '#3f6b52';
  for (const x of [96, 196, 296, 396, 496]) ctx.fillRect(x - 5, 0, 10, 430);
  for (const y of [90, 180, 270, 360]) ctx.fillRect(0, y - 5, 600, 10);
  ctx.fillRect(0, 0, 600, 14);
  if (v('paneCrack')) {
    ctx.strokeStyle = withAlpha('#ffffff', 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(336, 118);
    ctx.lineTo(352, 142);
    ctx.lineTo(344, 166);
    ctx.moveTo(352, 142);
    ctx.lineTo(372, 152);
    ctx.moveTo(344, 166);
    ctx.lineTo(358, 190);
    ctx.stroke();
  }

  // Brick floor.
  ctx.fillStyle = '#9a6a48';
  ctx.fillRect(0, 430, 600, 170);
  ctx.strokeStyle = withAlpha('#6e4630', 0.7);
  ctx.lineWidth = 2;
  for (let y = 430; y < 600; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }
  for (let i = 0; i < 20; i++) {
    const x = (i * 61) % 600;
    const y = 443 + Math.floor(i / 3) * 52;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 26);
    ctx.stroke();
  }

  // Hanging planters: cords from the ceiling; planterColor recolors one bowl.
  const planter = (x, y, bowl, leaf) => {
    ctx.strokeStyle = '#3a3244';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 14, 14);
    ctx.lineTo(x, y - 16);
    ctx.lineTo(x + 14, 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 22, y - 16);
    ctx.quadraticCurveTo(x, y + 6, x + 22, y - 16);
    ctx.quadraticCurveTo(x, y - 30, x - 22, y - 16);
    ctx.fillStyle = bowl;
    ctx.fill();
    ctx.fillStyle = leaf;
    for (const [dx, dy, s] of [[-18, 10, 0.7], [18, 12, 0.8], [-6, 16, 0.9], [8, 18, 0.6]]) {
      ellipse(ctx, x + dx, y + dy - 10, 10 * s, 14 * s);
      ctx.fill();
    }
  };
  planter(150, 92, '#a86a4a', '#4a8a4e');
  planter(420, 100, v('planterColor') ? '#3f7a8a' : '#a86a4a', '#4a8a4e');

  // Upper shelf with three small pots.
  ctx.fillStyle = '#4a6b52';
  ctx.fillRect(90, 196, 380, 10);
  ctx.fillRect(100, 206, 8, 22);
  ctx.fillRect(452, 206, 8, 22);
  pottedPlant(ctx, 140, 194, 0.85, '#a86a4a', '#4a8a4e', 'cactus', '#7ad0a0');
  pottedPlant(ctx, 200, 192, 1, '#8a5c8a', v('flowerColor') ? '#e8c23f' : '#e87ab0', 'flower', '#f2d9e2');
  pottedPlant(ctx, 262, 194, 0.8, '#8a6a4e', '#5e8a5e', 'mushroom', '#c96a5a');
  if (v('vineExtra')) {
    ctx.strokeStyle = '#4a8a4e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(92, 198);
    ctx.quadraticCurveTo(66, 214, 62, 232);
    ctx.stroke();
    ctx.fillStyle = '#4a8a4e';
    for (const [lx, ly] of [[70, 212], [62, 228], [66, 244]]) {
      ellipse(ctx, lx, ly, 8, 5, 0.5);
      ctx.fill();
    }
  }

  // Main potting table with four pots and one empty slot (potMissing).
  ctx.fillStyle = '#8a5c3c';
  ctx.fillRect(60, 316, 480, 14);
  ctx.fillStyle = '#6e4630';
  ctx.fillRect(74, 330, 12, 104);
  ctx.fillRect(514, 330, 12, 104);
  ctx.fillRect(74, 360, 452, 8);
  pottedPlant(ctx, 150, 314, 1.15, '#b0743f', '#4a8a4e', 'fern', '#7ad0a0');
  if (!v('fernCount')) {
    ctx.strokeStyle = '#4a8a4e';
    ctx.lineWidth = 2.2;
    for (const ang of [-1.15, -0.4, 0.4, 1.15]) {
      ctx.save();
      ctx.translate(150, 300);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -16, 5, -30);
      ctx.stroke();
      ctx.restore();
    }
  }
  if (v('potMissing')) {
    ctx.fillStyle = withAlpha('#5d4633', 0.35);
    ellipse(ctx, 250, 314, 16, 5);
    ctx.fill();
  } else {
    pottedPlant(ctx, 250, 314, 1, '#a86a4a', '#5e9a6a', 'flower', '#f2e28a');
  }
  // Leafy plant hosting the ladybug; spots vary (ladybugSpots).
  ctx.fillStyle = '#3f7a4a';
  for (const [dx, ang] of [[-16, -0.7], [0, 0], [16, 0.7]]) {
    ellipse(ctx, 330 + dx, 288, 9, 22, ang);
    ctx.fill();
  }
  ctx.fillStyle = '#8a6a4e';
  ctx.beginPath();
  ctx.moveTo(314, 314);
  ctx.lineTo(346, 314);
  ctx.lineTo(340, 296);
  ctx.lineTo(320, 296);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c94f4f';
  ellipse(ctx, 330, 282, 7, 5.6);
  ctx.fill();
  ctx.strokeStyle = '#33241c';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(330, 277);
  ctx.lineTo(330, 287);
  ctx.stroke();
  const spots = v('ladybugSpots') ? 5 : 3;
  for (let i = 0; i < spots; i++) {
    const sx = 330 + (i % 2 ? 3.4 : -3.4);
    const sy = 278 + i * 2.8;
    circle(ctx, sx, Math.min(sy, 286), 2);
    ctx.fillStyle = '#33241c';
    ctx.fill();
  }
  // Mushroom pot: single mushroom, or a cluster (mushroomExtra).
  pottedPlant(ctx, 450, 314, 1, '#8a6a4e', '#e8dcc8', v('mushroomExtra') ? 'shrooms' : 'mushroom', '#c96a5a');

  // Seed packets leaning on the table leg; packetTilt swings one over.
  const packet = (x, top, tiltRot, tint) => {
    ctx.save();
    ctx.translate(x, top + 34);
    ctx.rotate(tiltRot);
    fillRoundRect(ctx, -14, -34, 28, 68, 3, tint);
    ctx.fillStyle = withAlpha('#33241c', 0.7);
    ctx.font = 'bold 10px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SEEDS', 0, -14);
    ctx.fillStyle = '#e8c23f';
    circle(ctx, 0, 10, 8);
    ctx.fill();
    ctx.restore();
  };
  packet(506, 316, -0.06, '#d9cba8');
  packet(528, 318, v('packetTilt') ? -0.34 : -0.1, '#c2b48a');

  // Wall thermometer: the mercury sits higher when thermoLevel runs.
  ctx.fillStyle = '#d9d2c2';
  ctx.fillRect(556, 236, 18, 66);
  circle(ctx, 565, 306, 10);
  ctx.fillStyle = '#d9d2c2';
  ctx.fill();
  ctx.fillStyle = '#c94f4f';
  circle(ctx, 565, 306, 6);
  ctx.fill();
  ctx.fillRect(562, v('thermoLevel') ? 244 : 274, 6, 58);

  // Watering can on the floor; spoutFlip swaps its spout to the far side.
  ctx.save();
  ctx.translate(100, 464);
  if (v('spoutFlip')) ctx.scale(-1, 1);
  ctx.fillStyle = '#4a8a9a';
  fillRoundRect(ctx, -22, -22, 44, 34, 6, '#4a8a9a');
  ctx.strokeStyle = '#4a8a9a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-20, -6);
  ctx.quadraticCurveTo(-38, -12, -40, -26);
  ctx.stroke();
  ctx.fillStyle = '#3a6a78';
  circle(ctx, -41, -28, 4);
  ctx.fill();
  ctx.strokeStyle = '#4a8a9a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(24, -8, 11, -Math.PI * 0.8, Math.PI * 0.4);
  ctx.stroke();
  ctx.fillStyle = '#3a6a78';
  circle(ctx, 0, -28, 8);
  ctx.fill();
  ctx.restore();

  // Snail crossing the bricks; shellShell grows it (snailShell).
  const shellR = v('snailShell') ? 17 : 12;
  ctx.fillStyle = '#d9c9a0';
  ellipse(ctx, 316, 522, 24, 9);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(338, 518);
  ctx.lineTo(342, 508);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d9c9a0';
  ctx.stroke();
  circle(ctx, 300, 516, shellR);
  ctx.fillStyle = '#a8683f';
  ctx.fill();
  ctx.strokeStyle = '#7c4a2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.3) {
    const rr = (a / (Math.PI * 4)) * shellR;
    const px = 300 + Math.cos(a) * rr;
    const py = 516 + Math.sin(a) * rr;
    if (a === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // A visiting butterfly with an asymmetric wing pose, mirrored when
  // butterflyFlip flips it.
  ctx.save();
  ctx.translate(300, 225);
  if (v('butterflyFlip')) ctx.scale(-1, 1);
  ctx.fillStyle = '#e8963f';
  ellipse(ctx, -7, -7, 10, 15, -0.6);
  ctx.fill();
  ellipse(ctx, 8, -1, 7, 11, 0.55);
  ctx.fill();
  circle(ctx, -8, -9, 2.8);
  ctx.fillStyle = '#fff2c8';
  ctx.fill();
  ctx.fillStyle = '#33241c';
  ellipse(ctx, 0, 0, 3, 9, 0.25);
  ctx.fill();
  ctx.strokeStyle = '#33241c';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-2, -8);
  ctx.lineTo(-7, -17);
  ctx.moveTo(2, -8);
  ctx.lineTo(6, -16);
  ctx.stroke();
  ctx.restore();
  // Second butterfly, decorative on both panels.
  ctx.save();
  ctx.translate(410, 372);
  ctx.scale(0.8, 0.8);
  ctx.fillStyle = '#7a9ae8';
  ellipse(ctx, -7, -3, 8, 12, -0.5);
  ctx.fill();
  ellipse(ctx, 7, -3, 8, 12, 0.5);
  ctx.fill();
  ctx.fillStyle = '#33241c';
  ellipse(ctx, 0, 0, 2.4, 7);
  ctx.fill();
  ctx.restore();

  api.mark('flowerColor', 200, 152, 32);
  api.mark('vineExtra', 64, 226, 28);
  api.mark('paneCrack', 354, 154, 32);
  api.mark('planterColor', 420, 96, 30);
  api.mark('butterflyFlip', 300, 225, 30);
  api.mark('potMissing', 250, 306, 28);
  api.mark('fernCount', 150, 296, 30);
  api.mark('ladybugSpots', 330, 284, 28);
  api.mark('mushroomExtra', 450, 300, 30);
  api.mark('packetTilt', 526, 348, 28);
  api.mark('thermoLevel', 565, 272, 26);
  api.mark('spoutFlip', 82, 448, 30);
  api.mark('snailShell', 300, 516, 30);
}
