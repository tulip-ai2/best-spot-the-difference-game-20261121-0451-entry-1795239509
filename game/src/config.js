// Central tunables for Double Take: canvas geometry, panel layout, timing and
// scoring rules. Everything else reads its numbers from here so the layout can
// be retuned in one place.

export const VIEW_W = 1280;
export const VIEW_H = 800;

// The two scene panels. Scene art is painted in a 600x600 coordinate space.
export const PANEL_W = 600;
export const PANEL_H = 600;
export const PANEL_LEFT_X = 10;
export const PANEL_RIGHT_X = 670;
export const PANEL_Y = 74;

// Click tolerance around a difference centre, in scene pixels.
export const HIT_RADIUS = 38;

// Play rules.
export const WRONG_PENALTY_SEC = 5;
export const FIND_TIME_BONUS_SEC = 3;
export const HINTS_PER_LEVEL = 3;
export const HINT_SCORE_COST = 400;
export const HINT_VISIBLE_SEC = 2.6;
export const FIND_BASE_SCORE = 1000;
export const STREAK_BONUS_SCORE = 150;
export const CLEAR_BONUS_PER_SEC = 10;
export const CLEAR_FLAT_BONUS = 250;

// Marker + effect feel.
export const MARKER_PULSE_SEC = 1.1;
export const INTRO_CARD_SEC = 2.2;
export const CLEAR_CARD_SEC = 3.4;

// Bottom bar layout: the time bar and the two on-screen buttons.
export const HUD = {
  barY: PANEL_Y + PANEL_H + 14,
  barH: 34,
  timeBarX: 130,
  timeBarW: 640,
  hintButton: { x: 1100, y: 688, w: 84, h: 44 },
  soundButton: { x: 1192, y: 688, w: 78, h: 44 },
};
