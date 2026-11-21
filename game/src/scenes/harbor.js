// "Harbor at Dusk" scene painter: a fishing quay at sundown, drawn entirely
// with canvas primitives. Every prop's placement rolls from the shared rng so
// both panels match; a difference slot then swaps one prop's look on one side.

import {
  skyGradient, glow, circle, ellipse, withAlpha, gull, crate, barrel, lanternPost, cloud, sparkStar,
} from '../artutil.js';

export const SLOTS = [
  'sunHalo', 'gullFlip', 'gullGone', 'cloudBig', 'flagFlip', 'lighthouseStripe',
  'hutWindow', 'sailColor', 'oarExtra', 'buoyExtra', 'lanternLit', 'barrelBand', 'crateLid',
];

export function paint(ctx, R, api) {
  const v = api.variant;

  // Sky and early stars.
  skyGradient(ctx, 0, 0, 600, 385, [
    [0, '#241640'], [0.45, '#5b2d5e'], [0.78, '#a34a5c'], [1, '#e2704e'],
  ]);
  for (let i = 0; i < 16; i++) {
    sparkStar(ctx, R.range(12, 588), R.range(10, 130), R.range(0.8, 2), '#ffe9c9', R.range(0.25, 0.8));
  }

  // Clouds (the far-right one is the cloudBig slot).
  const clouds = [[95, 95, 0.8], [300, 60, 1.0], [450, 140, 1.15]];
  for (const [cx, cy, cs] of clouds) {
    const big = cx === 450 && v('cloudBig');
    cloud(ctx, cx, cy, big ? cs * 1.5 : cs, '#472552');
  }

  // Low sun (sunHalo grows it and deepens its glow).
  const sunBig = v('sunHalo');
  const sunR = sunBig ? 58 : 44;
  glow(ctx, 160, 300, sunBig ? 130 : 92, '#ffca7a', sunBig ? 0.6 : 0.4);
  circle(ctx, 160, 300, sunR);
  ctx.fillStyle = '#ffd9a0';
  ctx.fill();
  circle(ctx, 160, 300, sunR - 12);
  ctx.fillStyle = '#fff2d4';
  ctx.fill();

  // Distant hills on the horizon.
  ctx.fillStyle = '#3a1e46';
  ctx.beginPath();
  ctx.moveTo(0, 385);
  ctx.quadraticCurveTo(80, 330, 170, 375);
  ctx.quadraticCurveTo(230, 400, 320, 383);
  ctx.lineTo(320, 385);
  ctx.closePath();
  ctx.fill();

  // Sea.
  const sea = ctx.createLinearGradient(0, 380, 0, 600);
  sea.addColorStop(0, '#41284f');
  sea.addColorStop(0.35, '#232048');
  sea.addColorStop(1, '#0e1128');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 380, 600, 220);
  // Sun reflection path and random wave glints.
  ctx.fillStyle = withAlpha('#ffca7a', 0.45);
  for (let y = 392; y < 470; y += 13) {
    const w = 40 - (y - 392) * 0.4;
    ctx.fillRect(160 - w / 2 + Math.sin(y) * 6, y, w, 3.2);
  }
  ctx.strokeStyle = withAlpha('#c9a0e8', 0.35);
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 26; i++) {
    const x = R.range(10, 590);
    const y = R.range(395, 592);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + R.range(8, 26), y);
    ctx.stroke();
  }

  // Lighthouse rock and tower.
  ctx.fillStyle = '#2b1a3a';
  ctx.beginPath();
  ctx.moveTo(462, 472);
  ctx.lineTo(492, 438);
  ctx.lineTo(600, 432);
  ctx.lineTo(600, 476);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2e7d8';
  ctx.beginPath();
  ctx.moveTo(505, 442);
  ctx.lineTo(528, 252);
  ctx.lineTo(552, 252);
  ctx.lineTo(575, 442);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = v('lighthouseStripe') ? '#c94f4f' : '#3f6fae';
  ctx.fillRect(514, 285, 52, 24);
  ctx.fillStyle = '#c94f4f';
  ctx.fillRect(509, 350, 62, 24);
  ctx.fillStyle = withAlpha('#2b1a3a', 0.25);
  ctx.fillRect(538, 252, 14, 190);
  // Lamp room, gallery and beacon glow.
  ctx.fillStyle = '#2b1a3a';
  ctx.fillRect(520, 226, 40, 26);
  ctx.fillStyle = '#ffd977';
  ctx.fillRect(526, 232, 28, 15);
  glow(ctx, 540, 239, 64, '#ffd977', 0.5);
  ctx.strokeStyle = '#2b1a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(514, 252);
  ctx.lineTo(566, 252);
  ctx.stroke();
  // Flag pennant on the lamp roof (flagFlip turns it around).
  ctx.strokeStyle = '#2b1a3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(540, 226);
  ctx.lineTo(540, 196);
  ctx.stroke();
  ctx.fillStyle = '#e8b64b';
  ctx.beginPath();
  if (v('flagFlip')) {
    ctx.moveTo(540, 198);
    ctx.lineTo(512, 205);
    ctx.lineTo(540, 212);
  } else {
    ctx.moveTo(540, 198);
    ctx.lineTo(568, 205);
    ctx.lineTo(540, 212);
  }
  ctx.closePath();
  ctx.fill();

  // Keeper's hut with two windows (hutWindow lights the right one).
  ctx.fillStyle = '#5a3a54';
  ctx.fillRect(398, 428, 82, 36);
  ctx.fillStyle = '#3f2547';
  ctx.beginPath();
  ctx.moveTo(392, 430);
  ctx.lineTo(439, 404);
  ctx.lineTo(486, 430);
  ctx.closePath();
  ctx.fill();
  for (const [wx, lit] of [[412, false], [448, v('hutWindow')]]) {
    ctx.fillStyle = lit ? '#ffd977' : '#1d1430';
    ctx.fillRect(wx, 436, 16, 15);
    if (lit) glow(ctx, wx + 8, 443, 18, '#ffd977', 0.45);
  }

  // Pier deck and posts.
  ctx.fillStyle = '#6e4a34';
  ctx.fillRect(0, 478, 252, 26);
  ctx.fillStyle = '#59392a';
  for (let x = 0; x < 252; x += 26) ctx.fillRect(x, 478, 3, 26);
  ctx.fillStyle = '#4a2f22';
  for (const px of [25, 90, 155, 215]) {
    ctx.fillRect(px, 502, 11, 52);
    ctx.fillStyle = withAlpha('#4a2f22', 0.4);
    ctx.fillRect(px, 556, 11, 14);
    ctx.fillStyle = '#4a2f22';
  }

  // Lantern post at the pier's end (lanternLit lights it).
  lanternPost(ctx, 200, 478, 56, '#3a2735', '#28304e', v('lanternLit'), '#ffca7a');

  // Cargo: stacked crates (crateLid opens the small one) and a banded barrel.
  crate(ctx, 18, 430, 54, 48, '#8a5c3c', '#5d3c26');
  crate(ctx, 26, 392, 38, 38, '#96683f', '#5d3c26', v('crateLid'));
  barrel(ctx, 118, 438, 32, 44, '#7c4a2e', '#d9d0c0', v('barrelBand'));

  // Gulls: three, one gone (gullGone) and one mirrored (gullFlip).
  if (!v('gullGone')) gull(ctx, 120, 185, 1, '#2b1a3a');
  gull(ctx, 210, 140, 0.85, '#2b1a3a', v('gullFlip'));
  gull(ctx, 390, 112, 1.1, '#2b1a3a');

  // Sailboat with the tintable mainsail.
  ctx.fillStyle = '#33202e';
  ctx.beginPath();
  ctx.moveTo(322, 502);
  ctx.quadraticCurveTo(350, 516, 396, 502);
  ctx.lineTo(386, 486);
  ctx.lineTo(332, 486);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#33202e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(358, 486);
  ctx.lineTo(358, 392);
  ctx.stroke();
  ctx.fillStyle = v('sailColor') ? '#e8b84b' : '#f5ead8';
  ctx.beginPath();
  ctx.moveTo(362, 398);
  ctx.quadraticCurveTo(398, 440, 392, 480);
  ctx.lineTo(362, 480);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = withAlpha('#0e1128', 0.5);
  ellipse(ctx, 358, 514, 44, 6);
  ctx.fill();

  // Rowboat (oarExtra adds an oar) and the red-and-white buoy.
  ctx.fillStyle = '#5d3c26';
  ctx.beginPath();
  ctx.moveTo(312, 536);
  ctx.quadraticCurveTo(330, 552, 362, 536);
  ctx.quadraticCurveTo(337, 544, 312, 536);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a2f22';
  ctx.beginPath();
  ctx.moveTo(314, 536);
  ctx.lineTo(360, 536);
  ctx.lineTo(352, 544);
  ctx.lineTo(322, 544);
  ctx.closePath();
  ctx.fill();
  if (v('oarExtra')) {
    ctx.strokeStyle = '#8a5c3c';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(346, 536);
    ctx.lineTo(368, 512);
    ctx.stroke();
    ellipse(ctx, 371, 508, 6, 9, 0.6);
    ctx.fillStyle = '#8a5c3c';
    ctx.fill();
  }
  if (v('buoyExtra')) {
    ctx.fillStyle = '#c94f4f';
    ctx.beginPath();
    ctx.moveTo(248, 560);
    ctx.quadraticCurveTo(255, 542, 262, 560);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f2e7d8';
    ctx.fillRect(250, 551, 10, 4);
  }

  api.mark('sunHalo', 160, 300, 52);
  api.mark('gullFlip', 210, 140, 30);
  api.mark('gullGone', 120, 185, 30);
  api.mark('cloudBig', 450, 140, 40);
  api.mark('flagFlip', 540, 205, 30);
  api.mark('lighthouseStripe', 540, 297, 34);
  api.mark('hutWindow', 456, 443, 26);
  api.mark('sailColor', 372, 435, 36);
  api.mark('oarExtra', 352, 522, 30);
  api.mark('buoyExtra', 255, 553, 28);
  api.mark('lanternLit', 200, 418, 30);
  api.mark('barrelBand', 134, 458, 30);
  api.mark('crateLid', 45, 405, 30);
}
