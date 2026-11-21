// "The Old Observatory" scene painter: a stargazer's dome with a telescope, a
// desk of charts and a window full of planets. One rng stream, slot swaps.

import {
  glow, circle, ellipse, withAlpha, starPath, sparkStar, fillRoundRect,
} from '../artutil.js';

export const SLOTS = [
  'planetRing', 'starMissing', 'moonColor', 'shootingStar', 'owlEyes', 'chartPin',
  'constellationStar', 'candleFlame', 'mugSteam', 'bookColor', 'scopeAngle',
  'globeStand', 'rugStripe',
];

export function paint(ctx, R, api) {
  const v = api.variant;

  // Dome interior.
  const dome = ctx.createRadialGradient(300, 90, 60, 300, 300, 560);
  dome.addColorStop(0, '#232a52');
  dome.addColorStop(1, '#12173a');
  ctx.fillStyle = dome;
  ctx.fillRect(0, 0, 600, 470);
  ctx.strokeStyle = withAlpha('#3a4478', 0.5);
  ctx.lineWidth = 3;
  for (const r of [210, 300, 390, 480]) {
    ctx.beginPath();
    ctx.arc(300, -170, r, 0.25, Math.PI - 0.25);
    ctx.stroke();
  }

  // Floor.
  ctx.fillStyle = '#3a2f4a';
  ctx.fillRect(0, 470, 600, 130);
  ctx.strokeStyle = withAlpha('#241c34', 0.8);
  ctx.lineWidth = 2;
  for (let x = 0; x < 600; x += 58) {
    ctx.beginPath();
    ctx.moveTo(x + 24, 470);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }

  // Arched window onto the night sky.
  ctx.fillStyle = '#2c3358';
  ctx.beginPath();
  ctx.moveTo(264, 356);
  ctx.lineTo(264, 160);
  ctx.arc(400, 160, 136, Math.PI, 0);
  ctx.lineTo(536, 356);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0a0f2c';
  ctx.beginPath();
  ctx.moveTo(278, 350);
  ctx.lineTo(278, 162);
  ctx.arc(400, 162, 122, Math.PI, 0);
  ctx.lineTo(522, 350);
  ctx.closePath();
  ctx.fill();
  const skyTop = ctx.createLinearGradient(0, 40, 0, 350);
  skyTop.addColorStop(0, '#0a0f2c');
  skyTop.addColorStop(1, '#1c2450');
  ctx.save();
  ctx.clip();
  ctx.fillStyle = skyTop;
  ctx.fillRect(264, 30, 272, 330);
  for (let i = 0; i < 20; i++) {
    sparkStar(ctx, R.range(286, 514), R.range(60, 340), R.range(0.7, 1.8), '#dfe6ff', R.range(0.4, 0.9));
  }
  // One brighter star stands out until starMissing dims it away.
  if (!v('starMissing')) {
    starPath(ctx, 330, 130, 6, 4, 0.35);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    glow(ctx, 330, 130, 14, '#ffffff', 0.6);
  }
  // Ringed planet (planetRing adds the rings).
  circle(ctx, 380, 180, 22);
  ctx.fillStyle = '#e8963f';
  ctx.fill();
  ctx.fillStyle = withAlpha('#c96a2a', 0.8);
  ctx.fillRect(358, 176, 44, 6);
  if (v('planetRing')) {
    ctx.strokeStyle = '#e8c99a';
    ctx.lineWidth = 4;
    ctx.save();
    ctx.translate(380, 180);
    ctx.rotate(-0.4);
    ctx.scale(1, 0.36);
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  // Moon: cool silver, or warm amber (moonColor).
  glow(ctx, 470, 150, 36, v('moonColor') ? '#ffd9a8' : '#dfe6ff', 0.5);
  circle(ctx, 470, 150, 18);
  ctx.fillStyle = v('moonColor') ? '#ffd9a8' : '#dfe6ff';
  ctx.fill();
  ctx.fillStyle = withAlpha('#9aa4c8', 0.5);
  circle(ctx, 464, 146, 4);
  ctx.fill();
  circle(ctx, 476, 156, 3);
  ctx.fill();
  // Shooting star streaking past (shootingStar).
  if (v('shootingStar')) {
    ctx.strokeStyle = withAlpha('#ffffff', 0.9);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(514, 244);
    ctx.lineTo(466, 288);
    ctx.stroke();
    ctx.strokeStyle = withAlpha('#ffffff', 0.4);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(510, 248);
    ctx.lineTo(488, 268);
    ctx.stroke();
    circle(ctx, 466, 288, 3.4);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  ctx.restore();
  // Window mullions.
  ctx.strokeStyle = '#2c3358';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(400, 40);
  ctx.lineTo(400, 350);
  ctx.moveTo(278, 260);
  ctx.lineTo(522, 260);
  ctx.stroke();

  // Owl asleep (or awake) on its perch (owlEyes).
  ctx.strokeStyle = '#4a3a2e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(48, 132);
  ctx.lineTo(112, 132);
  ctx.stroke();
  ctx.fillStyle = '#6e5238';
  ellipse(ctx, 80, 108, 17, 24);
  ctx.fill();
  ctx.fillStyle = '#5a4028';
  ctx.beginPath();
  ctx.moveTo(66, 92);
  ctx.lineTo(70, 78);
  ctx.lineTo(76, 90);
  ctx.closePath();
  ctx.moveTo(94, 90);
  ctx.lineTo(90, 78);
  ctx.lineTo(84, 92);
  ctx.closePath();
  ctx.fill();
  if (v('owlEyes')) {
    circle(ctx, 73, 104, 5);
    ctx.fillStyle = '#ffd977';
    ctx.fill();
    circle(ctx, 87, 104, 5);
    ctx.fill();
    circle(ctx, 73, 104, 2.2);
    ctx.fillStyle = '#33241c';
    ctx.fill();
    circle(ctx, 87, 104, 2.2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#33241c';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(68, 104);
    ctx.lineTo(78, 104);
    ctx.moveTo(82, 104);
    ctx.lineTo(92, 104);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8a04f';
  ctx.beginPath();
  ctx.moveTo(77, 108);
  ctx.lineTo(83, 108);
  ctx.lineTo(80, 114);
  ctx.closePath();
  ctx.fill();

  // Constellation chart with a pin (chartPin) and an extra plotted star
  // (constellationStar).
  fillRoundRect(ctx, 148, 233, 94, 74, 3, '#e8dcc0');
  ctx.strokeStyle = '#b8a878';
  ctx.lineWidth = 2;
  ctx.strokeRect(148, 233, 94, 74);
  const chartStars = [[168, 252], [190, 262], [206, 250], [218, 272], [200, 288]];
  if (v('constellationStar')) chartStars.push([228, 292]);
  ctx.strokeStyle = '#7c6a4a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(168, 252);
  ctx.lineTo(190, 262);
  ctx.lineTo(206, 250);
  ctx.lineTo(218, 272);
  ctx.lineTo(200, 288);
  if (v('constellationStar')) ctx.lineTo(228, 292);
  ctx.stroke();
  ctx.fillStyle = '#4a3a2e';
  for (const [sx, sy] of chartStars) {
    circle(ctx, sx, sy, 2.4);
    ctx.fill();
  }
  circle(ctx, 165, 250, 5);
  ctx.fillStyle = v('chartPin') ? '#3f6fae' : '#c94f4f';
  ctx.fill();
  ctx.fillStyle = withAlpha('#ffffff', 0.6);
  circle(ctx, 163, 248, 1.6);
  ctx.fill();

  // Desk with candle (candleFlame), steaming mug (mugSteam) and books
  // (bookColor).
  ctx.fillStyle = '#5a4068';
  ctx.fillRect(36, 396, 208, 14);
  ctx.fillStyle = '#46305a';
  ctx.fillRect(48, 410, 14, 118);
  ctx.fillRect(218, 410, 14, 118);
  // Candle.
  ctx.fillStyle = '#f2e2c2';
  ctx.fillRect(72, 356, 14, 40);
  ctx.strokeStyle = '#b8a878';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(79, 356);
  ctx.lineTo(79, 350);
  ctx.stroke();
  if (v('candleFlame')) {
    glow(ctx, 79, 340, 26, '#ffb04f', 0.6);
    ellipse(ctx, 79, 342, 5, 9);
    ctx.fillStyle = '#ffb04f';
    ctx.fill();
    ellipse(ctx, 79, 344, 2.6, 5);
    ctx.fillStyle = '#fff2c8';
    ctx.fill();
  } else {
    ctx.strokeStyle = withAlpha('#c9c2b0', 0.7);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(79, 350);
    ctx.quadraticCurveTo(86, 342, 82, 334);
    ctx.stroke();
  }
  ctx.fillStyle = '#8a8a96';
  ctx.fillRect(66, 394, 26, 4);
  // Mug with steam.
  fillRoundRect(ctx, 138, 366, 24, 30, 4, '#c94f4f');
  ctx.strokeStyle = '#c94f4f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(164, 380, 8, -Math.PI * 0.6, Math.PI * 0.6);
  ctx.stroke();
  ctx.fillStyle = '#4a2f22';
  ellipse(ctx, 150, 368, 10, 3);
  ctx.fill();
  if (v('mugSteam')) {
    ctx.strokeStyle = withAlpha('#e8e2d2', 0.75);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(144, 362);
    ctx.quadraticCurveTo(140, 352, 146, 344);
    ctx.moveTo(154, 362);
    ctx.quadraticCurveTo(158, 350, 152, 342);
    ctx.stroke();
  }
  // Stack of books.
  ctx.fillStyle = '#4a5a8a';
  ctx.fillRect(192, 386, 56, 10);
  ctx.fillStyle = v('bookColor') ? '#3f7a4a' : '#c98a3f';
  ctx.fillRect(196, 376, 50, 10);
  ctx.fillStyle = '#8a3a3a';
  ctx.fillRect(200, 366, 44, 10);
  ctx.fillStyle = '#46305a';
  ctx.fillRect(204, 356, 36, 10);

  // Telescope on its tripod; scopeAngle swings the tube higher.
  ctx.strokeStyle = '#241c34';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 442);
  ctx.lineTo(262, 560);
  ctx.moveTo(300, 442);
  ctx.lineTo(338, 560);
  ctx.moveTo(300, 442);
  ctx.lineTo(300, 566);
  ctx.stroke();
  ctx.save();
  ctx.translate(300, 440);
  ctx.rotate(v('scopeAngle') ? -0.95 : -0.6);
  fillRoundRect(ctx, -14, -13, 128, 26, 6, '#c9a96a');
  fillRoundRect(ctx, 88, -10, 30, 20, 4, '#8a6a3f');
  fillRoundRect(ctx, -30, -9, 22, 18, 4, '#8a6a3f');
  circle(ctx, -22, 0, 6);
  ctx.fillStyle = '#33241c';
  ctx.fill();
  ctx.restore();
  glow(ctx, 300, 440, 16, '#c9a96a', 0.25);

  // Globe on a stand, tilted when globeStand tips it.
  ctx.save();
  ctx.translate(560, 428);
  ctx.strokeStyle = '#8a6a3f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 32, Math.PI * 0.65, Math.PI * 2.35);
  ctx.stroke();
  ctx.rotate(v('globeStand') ? 0.5 : 0.12);
  circle(ctx, 0, 0, 26);
  ctx.fillStyle = '#3f6fae';
  ctx.fill();
  ctx.fillStyle = '#4a9a5e';
  ellipse(ctx, -8, -6, 10, 7);
  ctx.fill();
  ellipse(ctx, 10, 8, 8, 6, 0.6);
  ctx.fill();
  ctx.strokeStyle = withAlpha('#dfe6ff', 0.5);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#8a6a3f';
  ctx.fillRect(556, 458, 8, 16);
  ellipse(ctx, 560, 478, 16, 5);
  ctx.fill();

  // Round rug with border rings; rugStripe adds two more.
  ellipse(ctx, 250, 545, 150, 30);
  ctx.fillStyle = '#7a2e3e';
  ctx.fill();
  ellipse(ctx, 250, 545, 132, 24);
  ctx.strokeStyle = '#c9a96a';
  ctx.lineWidth = 4;
  ctx.stroke();
  ellipse(ctx, 250, 545, 104, 18);
  ctx.stroke();
  if (v('rugStripe')) {
    ellipse(ctx, 250, 545, 76, 12);
    ctx.stroke();
    ellipse(ctx, 250, 545, 48, 7);
    ctx.stroke();
  }

  api.mark('planetRing', 380, 180, 32);
  api.mark('starMissing', 330, 130, 26);
  api.mark('moonColor', 470, 150, 28);
  api.mark('shootingStar', 490, 266, 28);
  api.mark('owlEyes', 80, 104, 28);
  api.mark('chartPin', 165, 250, 26);
  api.mark('constellationStar', 226, 290, 26);
  api.mark('candleFlame', 79, 340, 26);
  api.mark('mugSteam', 150, 360, 28);
  api.mark('bookColor', 221, 371, 26);
  api.mark('scopeAngle', 330, 380, 32);
  api.mark('globeStand', 560, 424, 30);
  api.mark('rugStripe', 250, 545, 34);
}
