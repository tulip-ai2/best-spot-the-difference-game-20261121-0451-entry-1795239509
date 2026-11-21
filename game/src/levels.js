// Level builder: turns a level row and a seed into a ready-to-play pair of
// painted panels plus the difference slots the player must find. The slot
// subset and each slot's side are rolled from the seed, then each panel is
// painted into its own offscreen canvas so frames are a cheap blit.

import { makeRng } from './rng.js';
import { SCENES } from './scenes.js';
import { PANEL_W, PANEL_H } from './config.js';

export const LEVELS = [
  { scene: 'harbor', diffs: 5, time: 80 },
  { scene: 'attic', diffs: 6, time: 95 },
  { scene: 'market', diffs: 7, time: 105 },
  { scene: 'greenhouse', diffs: 8, time: 115 },
  { scene: 'observatory', diffs: 9, time: 125 },
  { scene: 'workshop', diffs: 10, time: 140 },
];

/**
 * Build a level: pick the difference slots, choose their sides, paint both
 * panels and return everything the game and renderer need.
 */
export function buildLevel(levelIndex, seed) {
  const row = LEVELS[levelIndex % LEVELS.length];
  const scene = SCENES[row.scene];
  const R = makeRng(seed);

  const slotIds = R.shuffle(scene.slots).slice(0, row.diffs);
  const slots = slotIds.map((id) => ({
    id,
    side: R.next() < 0.5 ? 'left' : 'right',
    x: 0,
    y: 0,
    r: 30,
  }));
  const slotById = new Map(slots.map((s) => [s.id, s]));

  const left = paintSide(scene, seed, 'left', slotById);
  const right = paintSide(scene, seed, 'right', slotById);

  return {
    index: levelIndex,
    sceneId: row.scene,
    sceneName: scene.name,
    time: row.time,
    slots,
    left,
    right,
  };
}

function paintSide(scene, seed, side, slotById) {
  const canvas = document.createElement('canvas');
  canvas.width = PANEL_W;
  canvas.height = PANEL_H;
  const ctx = canvas.getContext('2d');
  const api = {
    side,
    variant(id) {
      const slot = slotById.get(id);
      return slot !== undefined && slot.side === side;
    },
    mark(id, x, y, r) {
      if (side !== 'left') return;
      const slot = slotById.get(id);
      if (slot) {
        slot.x = x;
        slot.y = y;
        slot.r = r;
      }
    },
  };
  scene.paint(ctx, makeRng(seed), api);
  return canvas;
}
