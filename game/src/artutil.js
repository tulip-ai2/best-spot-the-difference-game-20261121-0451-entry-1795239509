// Drawing primitives shared by every scene painter: gradients, rounded shapes,
// stars, glow, silhouettes and the small set of reusable props (crates, jars,
// lanterns, plant pots, gulls) that give the scenes one coherent hand.

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

/** Vertical gradient filling the given rect. */
export function skyGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
}

export function roundRectPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function fillRoundRect(ctx, x, y, w, h, r, color) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Soft radial glow (lamp halos, moonlight, bokeh). */
export function glow(ctx, x, y, r, color, alpha = 0.5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, withAlpha(color, alpha));
  g.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** "#rrggbb" plus alpha 0..1 to an rgba() string. */
export function withAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** N-pointed star polygon, inner radius a share of outer. */
export function starPath(ctx, x, y, r, points = 5, inner = 0.45) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * inner;
    const ang = (Math.PI * i) / points - Math.PI / 2;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** Tiny twinkling background star. */
export function sparkStar(ctx, x, y, r, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, r * 0.5);
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.lineTo(x + r, y);
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.stroke();
  ctx.restore();
}

/** Cloud built from overlapping lobes. */
export function cloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 46 * scale, 16 * scale);
  ctx.fill();
  ellipse(ctx, x - 26 * scale, y + 2 * scale, 24 * scale, 12 * scale);
  ctx.fill();
  ellipse(ctx, x + 24 * scale, y + 1 * scale, 28 * scale, 13 * scale);
  ctx.fill();
  ellipse(ctx, x + 2 * scale, y - 8 * scale, 26 * scale, 14 * scale);
  ctx.fill();
}

/** Gull: an asymmetric wing pose so a mirror actually looks different. */
export function gull(ctx, x, y, s, color, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-11 * s, -1 * s);
  ctx.quadraticCurveTo(-5 * s, -9 * s, 0, -2 * s);
  ctx.quadraticCurveTo(5 * s, -6 * s, 11 * s, 1 * s);
  ctx.stroke();
  ctx.restore();
}

/** Wooden crate with optional open lid. */
export function crate(ctx, x, y, w, h, wood, dark, lidOpen = false) {
  ctx.fillStyle = wood;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
  ctx.beginPath();
  ctx.moveTo(x + 4, y + h / 3);
  ctx.lineTo(x + w - 4, y + h / 3);
  ctx.moveTo(x + 4, y + (2 * h) / 3);
  ctx.lineTo(x + w - 4, y + (2 * h) / 3);
  ctx.stroke();
  if (lidOpen) {
    ctx.fillStyle = dark;
    ctx.fillRect(x - 2, y - 9, w + 4, 5);
    ctx.fillStyle = withAlpha('#000000', 0.25);
    ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  }
}

/** Barrel with metal bands; extraBand adds a third hoop. */
export function barrel(ctx, x, y, w, h, body, band, extraBand = false) {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - w * 0.16, y + h / 2, x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.quadraticCurveTo(x + w + w * 0.16, y + h / 2, x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = band;
  ctx.fillRect(x - w * 0.07, y + h * 0.18, w * 1.14, 3.5);
  ctx.fillRect(x - w * 0.07, y + h * 0.74, w * 1.14, 3.5);
  if (extraBand) ctx.fillRect(x - w * 0.1, y + h * 0.46, w * 1.2, 3.5);
}

/** Lantern on a post; lit adds a warm halo. */
export function lanternPost(ctx, x, y, h, metal, glass, lit, litColor) {
  ctx.fillStyle = metal;
  ctx.fillRect(x - 2.5, y - h, 5, h);
  ctx.fillRect(x - 8, y - 3, 16, 4);
  ctx.fillRect(x - 9, y - h - 20, 18, 20);
  ctx.fillStyle = lit ? litColor : glass;
  ctx.fillRect(x - 5, y - h - 15, 10, 10);
  if (lit) glow(ctx, x, y - h - 10, 26, litColor, 0.55);
}

/** Potted plant: pot plus one of several plant bodies. */
export function pottedPlant(ctx, x, y, s, potColor, plantColor, kind, accent) {
  ctx.fillStyle = potColor;
  ctx.beginPath();
  ctx.moveTo(x - 13 * s, y - 14 * s);
  ctx.lineTo(x + 13 * s, y - 14 * s);
  ctx.lineTo(x + 9 * s, y);
  ctx.lineTo(x - 9 * s, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = plantColor;
  if (kind === 'cactus') {
    fillRoundRect(ctx, x - 4 * s, y - 44 * s, 8 * s, 32 * s, 4 * s, plantColor);
    fillRoundRect(ctx, x - 14 * s, y - 34 * s, 10 * s, 6 * s, 3 * s, plantColor);
    fillRoundRect(ctx, x + 4 * s, y - 30 * s, 10 * s, 6 * s, 3 * s, plantColor);
  } else if (kind === 'flower') {
    ctx.strokeStyle = plantColor;
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(x, y - 14 * s);
    ctx.quadraticCurveTo(x + 3 * s, y - 28 * s, x, y - 42 * s);
    ctx.stroke();
    for (const [dx, dy] of [[-6, -44], [6, -44], [0, -50], [-5, -38], [5, -38]]) {
      circle(ctx, x + dx * s, y + dy * s, 5.5 * s);
      ctx.fillStyle = accent;
      ctx.fill();
    }
    circle(ctx, x, y - 44 * s, 4 * s);
    ctx.fillStyle = '#8a5c2e';
    ctx.fill();
  } else if (kind === 'fern') {
    for (const ang of [-0.9, -0.45, 0, 0.45, 0.9]) {
      ctx.save();
      ctx.translate(x, y - 14 * s);
      ctx.rotate(ang);
      ctx.strokeStyle = plantColor;
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -14 * s, 4 * s, -26 * s);
      ctx.stroke();
      ctx.restore();
    }
  } else if (kind === 'mushroom') {
    // One mushroom
    ctx.fillStyle = '#e8dcc8';
    ctx.fillRect(x - 3 * s, y - 24 * s, 6 * s, 12 * s);
    ellipse(ctx, x, y - 24 * s, 10 * s, 6 * s);
    ctx.fillStyle = accent;
    ctx.fill();
  } else {
    // Mushroom cluster
    for (const [dx, sc] of [[-6, 0.7], [2, 1], [9, 0.6]]) {
      ctx.fillStyle = '#e8dcc8';
      ctx.fillRect(x + dx * s - 2.5 * s * sc, y - 24 * s * sc, 5 * s * sc, 10 * s * sc);
      ellipse(ctx, x + dx * s, y - 24 * s * sc, 8 * s * sc, 5 * s * sc);
      ctx.fillStyle = accent;
      ctx.fill();
    }
  }
}

/** Window frame with optional lit panes; lit array indexes panes. */
export function windowFrame(ctx, x, y, w, h, frame, panes, lit, litColor, darkColor) {
  ctx.fillStyle = darkColor;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = frame;
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();
  if (lit) {
    ctx.fillStyle = withAlpha(litColor, 0.85);
    ctx.fillRect(x + 5, y + 5, w / 2 - 7, h / 2 - 7);
    ctx.fillRect(x + w / 2 + 3, y + 5, w / 2 - 8, h / 2 - 7);
  }
  void panes;
}

/** Person silhouette for market / street scenes. */
export function personSilhouette(ctx, x, y, h, color) {
  const head = h * 0.16;
  circle(ctx, x, y - h + head, head);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - h * 0.16, y);
  ctx.quadraticCurveTo(x - h * 0.2, y - h * 0.5, x - h * 0.1, y - h + head * 1.6);
  ctx.lineTo(x + h * 0.1, y - h + head * 1.6);
  ctx.quadraticCurveTo(x + h * 0.2, y - h * 0.5, x + h * 0.16, y);
  ctx.closePath();
  ctx.fill();
}

/** Hanging string-light bulb. */
export function stringBulb(ctx, x, y, wire, bulbColor, r = 6) {
  ctx.fillStyle = wire;
  ctx.fillRect(x - 2, y - 4, 4, 5);
  circle(ctx, x, y + r * 0.6, r);
  ctx.fillStyle = bulbColor;
  ctx.fill();
  glow(ctx, x, y + r * 0.6, r * 3.2, bulbColor, 0.35);
}

/** Plank wall background with subtle grain lines. */
export function plankWall(ctx, w, h, base, dark, light, plankH = 46) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let y = plankH; y < h; y += plankH) {
    ctx.fillStyle = withAlpha(dark, 0.5);
    ctx.fillRect(0, y - 2, w, 2);
    ctx.fillStyle = withAlpha(light, 0.14);
    ctx.fillRect(0, y, w, 1.5);
  }
  ctx.strokeStyle = withAlpha(dark, 0.25);
  ctx.lineWidth = 1;
  for (let i = 0; i < 26; i++) {
    const gx = (i * 137) % w;
    const gy = ((i * 211) % h);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 22, gy + 2);
    ctx.stroke();
  }
}

/** Framed picture/sign hanging on a wall. */
export function wallSign(ctx, x, y, w, h, frame, inside, label, labelColor) {
  fillRoundRect(ctx, x - 3, y - 3, w + 6, h + 6, 4, frame);
  ctx.fillStyle = inside;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = labelColor;
  ctx.font = `bold ${Math.floor(h * 0.42)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}
