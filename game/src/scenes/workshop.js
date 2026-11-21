// "Toy Workshop" scene painter: Santa's-notch-but-nobody-in-particular toymaker's
// bench, pegboard tools, a toy train and floor toys. One rng stream, slot swaps.

import {
  plankWall, glow, circle, ellipse, withAlpha, starPath, fillRoundRect, sparkStar,
} from '../artutil.js';

export const SLOTS = [
  'sawShift', 'snowmanExtra', 'blueprintMark', 'trainSmoke', 'soldierMissing', 'blockLetter',
  'paintbrushExtra', 'potMissing', 'paintSpill', 'robotAntenna', 'duckColor', 'jackBox',
  'ballStripe', 'drumStar', 'windmillCount',
];

export function paint(ctx, R, api) {
  const v = api.variant;

  plankWall(ctx, 600, 600, '#5d6b74', '#39444c', '#8fa0a8', 48);

  // Pegboard with tools; the saw hangs lower when sawShift runs.
  fillRoundRect(ctx, 38, 58, 224, 174, 6, '#c2a878');
  ctx.fillStyle = withAlpha('#8a6a48', 0.8);
  for (let x = 50; x < 254; x += 18) {
    for (let y = 70; y < 226; y += 18) {
      circle(ctx, x, y, 2);
      ctx.fill();
    }
  }
  // Hammer.
  ctx.fillStyle = '#8a6a48';
  ctx.fillRect(66, 96, 6, 44);
  ctx.fillStyle = '#5d6b74';
  fillRoundRect(ctx, 56, 88, 26, 10, 3, '#5d6b74');
  // Wrench.
  ctx.fillStyle = '#8f96a3';
  ctx.fillRect(112, 96, 6, 42);
  circle(ctx, 115, 92, 8);
  ctx.strokeStyle = '#c2a878';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Screwdriver.
  ctx.fillStyle = '#c94f4f';
  ctx.fillRect(150, 92, 7, 22);
  ctx.fillStyle = '#8f96a3';
  ctx.fillRect(152, 114, 3, 26);
  // Scissors.
  ctx.strokeStyle = '#8f96a3';
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(200, 110);
  ctx.lineTo(184, 150);
  ctx.moveTo(214, 110);
  ctx.lineTo(230, 150);
  ctx.stroke();
  circle(ctx, 184, 156, 6);
  ctx.stroke();
  circle(ctx, 230, 156, 6);
  ctx.stroke();
  // Saw on its hook.
  const sawY = v('sawShift') ? 16 : 0;
  ctx.fillStyle = '#8f96a3';
  ctx.beginPath();
  ctx.moveTo(206, 160 + sawY);
  ctx.lineTo(246, 160 + sawY);
  ctx.lineTo(246, 182 + sawY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8f96a3';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let x = 208; x < 246; x += 6) {
    ctx.moveTo(x, 182 + sawY);
    ctx.lineTo(x + 3, 187 + sawY);
  }
  ctx.stroke();
  ctx.fillStyle = '#5d3c26';
  ctx.fillRect(190, 158 + sawY, 16, 14);

  // Winter window with a snowman outside when snowmanExtra builds one.
  fillRoundRect(ctx, 428, 58, 144, 116, 8, '#e8e4da');
  ctx.fillStyle = '#b8d4e2';
  ctx.fillRect(436, 66, 128, 100);
  ctx.fillStyle = '#f2f4f8';
  ctx.fillRect(436, 138, 128, 28);
  for (let i = 0; i < 10; i++) {
    circle(ctx, R.range(440, 560), R.range(70, 134), R.range(1.2, 2.6));
    ctx.fillStyle = withAlpha('#ffffff', R.range(0.5, 0.95));
    ctx.fill();
  }
  if (v('snowmanExtra')) {
    circle(ctx, 500, 128, 12);
    ctx.fillStyle = '#f2f4f8';
    ctx.fill();
    circle(ctx, 500, 110, 9);
    ctx.fill();
    circle(ctx, 500, 96, 7);
    ctx.fill();
    ctx.fillStyle = '#e8963f';
    ctx.beginPath();
    ctx.moveTo(500, 96);
    ctx.lineTo(509, 99);
    ctx.lineTo(500, 100);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#33241c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(494, 108);
    ctx.lineTo(506, 108);
    ctx.stroke();
  }
  ctx.strokeStyle = '#e8e4da';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(500, 60);
  ctx.lineTo(500, 172);
  ctx.moveTo(430, 116);
  ctx.lineTo(570, 116);
  ctx.stroke();

  // Blueprint pinned mid-wall; blueprintMark adds a pencil revision.
  fillRoundRect(ctx, 288, 88, 84, 94, 3, '#3a5a8a');
  ctx.strokeStyle = withAlpha('#dfe6ff', 0.85);
  ctx.lineWidth = 1.6;
  ctx.strokeRect(298, 100, 64, 44);
  ctx.beginPath();
  ctx.moveTo(298, 144);
  ctx.lineTo(330, 122);
  ctx.lineTo(362, 144);
  ctx.moveTo(310, 144);
  ctx.lineTo(310, 122);
  ctx.moveTo(350, 144);
  ctx.lineTo(350, 122);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(304, 162);
  ctx.lineTo(356, 162);
  ctx.stroke();
  if (v('blueprintMark')) {
    ctx.strokeStyle = withAlpha('#ffd977', 0.95);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(316, 168);
    ctx.quadraticCurveTo(330, 156, 344, 168);
    ctx.moveTo(344, 168);
    ctx.quadraticCurveTo(352, 174, 340, 174);
    ctx.stroke();
  }

  // Bench and floor.
  ctx.fillStyle = '#8a5c3c';
  ctx.fillRect(0, 400, 600, 32);
  ctx.fillStyle = '#6e4630';
  ctx.fillRect(0, 432, 600, 168);
  ctx.strokeStyle = withAlpha('#4a2f22', 0.5);
  ctx.lineWidth = 2;
  for (let y = 456; y < 600; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#59392a';
  ctx.fillRect(36, 432, 18, 160);
  ctx.fillRect(546, 432, 18, 160);
  ctx.fillStyle = withAlpha('#33241c', 0.35);
  ctx.fillRect(0, 400, 600, 6);

  // Toy train: engine with puffs (trainSmoke) and a block wagon whose letter
  // changes paint (blockLetter).
  ctx.fillStyle = '#3f7a4a';
  fillRoundRect(ctx, 100, 352, 74, 48, 5, '#3f7a4a');
  fillRoundRect(ctx, 148, 322, 34, 34, 4, '#2e5a3a');
  ctx.fillStyle = '#33241c';
  fillRoundRect(ctx, 106, 336, 14, 18, 3, '#33241c');
  ctx.fillStyle = '#c94f4f';
  circle(ctx, 113, 330, 7);
  ctx.fill();
  for (const wx of [122, 158]) {
    circle(ctx, wx, 402, 10);
    ctx.fillStyle = '#33241c';
    ctx.fill();
    circle(ctx, wx, 402, 4);
    ctx.fillStyle = '#c9a96a';
    ctx.fill();
  }
  if (v('trainSmoke')) {
    ctx.fillStyle = withAlpha('#e8e4da', 0.85);
    circle(ctx, 113, 312, 8);
    ctx.fill();
    circle(ctx, 124, 296, 6);
    ctx.fill();
    circle(ctx, 137, 282, 4.4);
    ctx.fill();
  }
  ctx.fillStyle = '#8a5c3c';
  ctx.fillRect(218, 368, 64, 34);
  ctx.fillStyle = '#5d3c26';
  ctx.fillRect(218, 368, 64, 6);
  circle(ctx, 232, 404, 8);
  ctx.fillStyle = '#33241c';
  ctx.fill();
  circle(ctx, 268, 404, 8);
  ctx.fill();
  fillRoundRect(ctx, 238, 340, 26, 26, 3, v('blockLetter') ? '#3f7a8a' : '#c94f4f');
  ctx.fillStyle = '#f2e7cf';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', 251, 354);
  // Second wagon with plain blocks for ballast.
  ctx.fillStyle = '#8a5c3c';
  ctx.fillRect(296, 368, 56, 34);
  ctx.fillStyle = '#5d3c26';
  ctx.fillRect(296, 368, 56, 6);
  fillRoundRect(ctx, 306, 346, 16, 16, 2, '#e8c23f');
  fillRoundRect(ctx, 324, 350, 14, 14, 2, '#4a9a5e');
  circle(ctx, 310, 404, 8);
  ctx.fillStyle = '#33241c';
  ctx.fill();
  circle(ctx, 338, 404, 8);
  ctx.fill();

  // Toy soldier at the bench's left end, absent when soldierMissing.
  if (!v('soldierMissing')) {
    ctx.fillStyle = '#4a7a3f';
    fillRoundRect(ctx, 52, 344, 22, 32, 4, '#4a7a3f');
    ctx.fillStyle = '#3f6a35';
    ctx.fillRect(52, 376, 22, 8);
    ctx.fillRect(56, 384, 6, 16);
    ctx.fillRect(66, 384, 6, 16);
    circle(ctx, 63, 334, 11);
    ctx.fillStyle = '#f2d9b8';
    ctx.fill();
    fillRoundRect(ctx, 52, 318, 22, 10, 3, '#3f6a35');
    ctx.fillStyle = '#3f6a35';
    ctx.fillRect(74, 348, 16, 5);
  }

  // Paint pots; potMissing empties the middle one, paintSpill tops up the mess.
  const pot = (px, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(px, 376, 26, 24);
    ctx.fillStyle = withAlpha('#ffffff', 0.35);
    ctx.fillRect(px, 376, 26, 5);
  };
  pot(436, '#c94f4f');
  if (!v('potMissing')) pot(468, '#3f6fae');
  pot(500, '#e8c23f');
  if (v('paintSpill')) {
    ctx.fillStyle = withAlpha('#c94f4f', 0.9);
    ellipse(ctx, 535, 402, 30, 7);
    ctx.fill();
    circle(ctx, 560, 398, 5);
    ctx.fill();
  }

  // Paintbrush lying on the bench when paintbrushExtra drops it.
  if (v('paintbrushExtra')) {
    ctx.save();
    ctx.translate(350, 396);
    ctx.rotate(-0.08);
    ctx.fillStyle = '#c9a96a';
    ctx.fillRect(-26, -3, 34, 6);
    ctx.fillStyle = '#8f96a3';
    ctx.fillRect(8, -3, 8, 6);
    ctx.fillStyle = '#c94f4f';
    ctx.beginPath();
    ctx.moveTo(16, -4);
    ctx.quadraticCurveTo(30, 0, 16, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Shelf of toys: robot (robotAntenna adds the aerial) and duck (duckColor
  // paints it blue).
  ctx.fillStyle = '#5d4633';
  ctx.fillRect(458, 250, 132, 10);
  ctx.fillRect(464, 260, 8, 24);
  ctx.fillRect(576, 260, 8, 24);
  fillRoundRect(ctx, 478, 218, 30, 26, 3, '#8f96a3');
  fillRoundRect(ctx, 482, 204, 22, 16, 3, '#a8b0bc');
  if (v('robotAntenna')) {
    ctx.strokeStyle = '#8f96a3';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(493, 204);
    ctx.lineTo(493, 194);
    ctx.stroke();
    circle(ctx, 493, 192, 3.4);
    ctx.fillStyle = '#c94f4f';
    ctx.fill();
  }
  circle(ctx, 488, 212, 2.4);
  ctx.fillStyle = '#33241c';
  ctx.fill();
  circle(ctx, 498, 212, 2.4);
  ctx.fill();
  ctx.fillStyle = '#5d6b74';
  ctx.fillRect(480, 228, 26, 5);
  circle(ctx, 486, 240, 3);
  ctx.fill();
  circle(ctx, 500, 240, 3);
  ctx.fill();
  const duckBody = v('duckColor') ? '#3f7a8a' : '#e8c23f';
  ellipse(ctx, 554, 240, 16, 12);
  ctx.fillStyle = duckBody;
  ctx.fill();
  circle(ctx, 566, 226, 8);
  ctx.fill();
  ctx.fillStyle = '#e8963f';
  ctx.beginPath();
  ctx.moveTo(573, 226);
  ctx.lineTo(582, 229);
  ctx.lineTo(573, 232);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 568, 223, 1.8);
  ctx.fillStyle = '#33241c';
  ctx.fill();

  // Floor toys: jack-in-the-box (jackBox), striped ball (ballStripe),
  // drum with a star (drumStar), pinwheel (windmillCount).
  if (v('jackBox')) {
    fillRoundRect(ctx, 104, 478, 34, 34, 3, '#8a3a3a');
    ctx.strokeStyle = '#5d2035';
    ctx.lineWidth = 2;
    ctx.strokeRect(104, 478, 34, 34);
    ctx.fillStyle = '#f2e7cf';
    circle(ctx, 121, 466, 11);
    ctx.fill();
    ctx.fillStyle = '#33241c';
    circle(ctx, 117, 464, 1.8);
    ctx.fill();
    circle(ctx, 125, 464, 1.8);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(121, 470, 5, 0.2, Math.PI - 0.2);
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.fillStyle = '#e8c23f';
    ctx.beginPath();
    ctx.moveTo(112, 458);
    ctx.quadraticCurveTo(121, 446, 130, 458);
    ctx.closePath();
    ctx.fill();
    circle(ctx, 121, 512, 4);
    ctx.fillStyle = '#8f96a3';
    ctx.fill();
    ctx.strokeStyle = '#8f96a3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(121, 508);
    ctx.lineTo(121, 500);
    ctx.stroke();
  }

  circle(ctx, 185, 543, 26);
  ctx.fillStyle = '#e8e4da';
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(185, 543, 26, 0, Math.PI * 2);
  ctx.clip();
  const bands = v('ballStripe') ? 3 : 2;
  ctx.fillStyle = '#c94f4f';
  for (let i = 0; i < bands; i++) ctx.fillRect(159, 527 + i * 14, 52, 7);
  ctx.restore();

  fillRoundRect(ctx, 254, 500, 36, 30, 4, '#3f6fae');
  ctx.fillStyle = '#dfe6ff';
  ctx.fillRect(250, 508, 44, 5);
  starPath(ctx, 272, 522, 9, 5, 0.45);
  ctx.fillStyle = v('drumStar') ? '#e8c23f' : '#c94f4f';
  ctx.fill();
  ctx.strokeStyle = '#dfe6ff';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(290, 530);
  ctx.lineTo(300, 542);
  ctx.stroke();

  const blades = v('windmillCount') ? 6 : 4;
  ctx.strokeStyle = '#8a6a48';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(380, 522);
  ctx.lineTo(380, 582);
  ctx.stroke();
  for (let i = 0; i < blades; i++) {
    ctx.save();
    ctx.translate(380, 522);
    ctx.rotate((Math.PI * 2 * i) / blades);
    ctx.fillStyle = i % 2 ? '#c94f4f' : '#4a9a9a';
    ellipse(ctx, 0, -14, 6, 13);
    ctx.fill();
    ctx.restore();
  }
  circle(ctx, 380, 522, 3.4);
  ctx.fillStyle = '#33241c';
  ctx.fill();

  api.mark('sawShift', 216, 176, 30);
  api.mark('snowmanExtra', 500, 120, 30);
  api.mark('blueprintMark', 330, 132, 30);
  api.mark('trainSmoke', 122, 298, 30);
  api.mark('soldierMissing', 64, 352, 32);
  api.mark('blockLetter', 251, 353, 28);
  api.mark('paintbrushExtra', 352, 396, 28);
  api.mark('potMissing', 481, 386, 28);
  api.mark('paintSpill', 537, 400, 30);
  api.mark('robotAntenna', 493, 208, 28);
  api.mark('duckColor', 554, 232, 28);
  api.mark('jackBox', 121, 484, 30);
  api.mark('ballStripe', 185, 543, 32);
  api.mark('drumStar', 272, 520, 28);
  api.mark('windmillCount', 380, 528, 30);
}
