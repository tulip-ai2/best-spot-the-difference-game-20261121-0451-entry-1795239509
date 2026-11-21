// The game itself: state machine (title -> intro -> play -> level clear ->
// finale, with a time-up game over), scoring, streaks, hints, the clock and
// click adjudication. Rendering and input live in their own modules and only
// talk to this class.

import { buildLevel, LEVELS } from './levels.js';
import {
  HIT_RADIUS, WRONG_PENALTY_SEC, FIND_TIME_BONUS_SEC, HINTS_PER_LEVEL, HINT_SCORE_COST,
  HINT_VISIBLE_SEC, FIND_BASE_SCORE, STREAK_BONUS_SCORE, CLEAR_BONUS_PER_SEC,
  CLEAR_FLAT_BONUS, INTRO_CARD_SEC, CLEAR_CARD_SEC, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y,
  HUD,
} from './config.js';

export const STATE = {
  TITLE: 'title',
  INTRO: 'intro',
  PLAY: 'play',
  CLEAR: 'clear',
  TIMEUP: 'timeup',
  FINALE: 'finale',
};

export class Game {
  constructor(audio, effects, demo = null) {
    this.audio = audio;
    this.effects = effects;
    this.demo = demo;
    this.baseSeed = demo?.seed ?? ((Math.random() * 0xffffffff) >>> 0);
    this.state = STATE.TITLE;
    this.levelIndex = 0;
    this.level = null;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.wrongClicks = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintsUsed = 0;
    this.timeLeft = 0;
    this.freeze = false;
    this.introT = 0;
    this.clearT = 0;
    this.hint = null;
    this.shake = 0;
    this.wrongMarks = [];
    this.lastTickSec = -1;
    this.clearStats = null;
    this.best = this.loadBest();
    this.finalRank = '';

    if (demo && demo.shot === 'play') this.setupDemoPlay(demo);
    else if (demo && demo.shot === 'clear') this.setupDemoClear();
    else if (demo && demo.shot === 'finale') this.setupDemoFinale();
  }

  loadBest() {
    try {
      return Number(localStorage.getItem('doubletake.best') ?? 0) || 0;
    } catch {
      return 0;
    }
  }

  saveBest() {
    if (this.score > this.best) {
      this.best = this.score;
      try {
        localStorage.setItem('doubletake.best', String(this.best));
      } catch {
        /* storage unavailable: the best score just stays in memory */
      }
    }
  }

  // --- flow ---------------------------------------------------------------

  startRun() {
    this.levelIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.wrongClicks = 0;
    this.finalRank = '';
    this.audio.advance();
    this.startLevel();
  }

  startLevel() {
    const seed = (this.baseSeed + this.levelIndex * 7919) >>> 0;
    this.level = buildLevel(this.levelIndex, seed);
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintsUsed = 0;
    this.hint = null;
    this.streak = 0;
    this.timeLeft = this.level.time;
    this.lastTickSec = -1;
    this.effects.clear();
    this.state = STATE.INTRO;
    this.introT = INTRO_CARD_SEC;
  }

  beginPlay() {
    this.state = STATE.PLAY;
  }

  foundCount() {
    return this.level.slots.filter((s) => s.found).length;
  }

  remainingCount() {
    return this.level.slots.length - this.foundCount();
  }

  // --- update -------------------------------------------------------------

  update(dt, now) {
    this.shake = Math.max(0, this.shake - dt * 2.4);
    this.wrongMarks = this.wrongMarks.filter((m) => now - m.at < 0.45);
    this.effects.update(dt);

    if (this.state === STATE.INTRO) {
      this.introT -= dt;
      if (this.introT <= 0) this.beginPlay();
    } else if (this.state === STATE.CLEAR) {
      this.clearT -= dt;
      if (this.clearT <= 0) this.afterClearCard();
    } else if (this.state === STATE.PLAY && !this.freeze) {
      this.timeLeft -= dt;
      const sec = Math.ceil(this.timeLeft);
      if (sec <= 10 && sec !== this.lastTickSec && sec > 0) {
        this.lastTickSec = sec;
        this.audio.tick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.endRun();
      }
      if (this.hint && now >= this.hint.until) this.hint = null;
    }
  }

  afterClearCard() {
    if (this.levelIndex + 1 >= LEVELS.length) this.showFinale();
    else {
      this.levelIndex += 1;
      this.startLevel();
    }
  }

  levelCleared() {
    const timeBonus = Math.ceil(this.timeLeft) * CLEAR_BONUS_PER_SEC;
    this.score += CLEAR_FLAT_BONUS + timeBonus;
    this.saveBest();
    this.clearStats = {
      finds: this.level.slots.length,
      timeBonus,
      hintsUsed: this.hintsUsed,
      wrongClicks: this.wrongClicks,
      score: this.score,
      last: this.levelIndex + 1 >= LEVELS.length,
    };
    this.clearT = CLEAR_CARD_SEC;
    this.state = STATE.CLEAR;
    this.effects.confetti(1280);
    this.audio.clear();
  }

  showFinale() {
    this.finalRank = this.rankFor(this.score);
    this.saveBest();
    this.state = STATE.FINALE;
    this.effects.confetti(1280);
    this.audio.clear();
  }

  rankFor(score) {
    if (score >= 16000) return 'Eagle-Eyed Chief Inspector';
    if (score >= 11000) return 'Senior Field Inspector';
    if (score >= 7000) return 'Licensed Spotter';
    return 'Junior Detective';
  }

  endRun() {
    this.saveBest();
    this.state = STATE.TIMEUP;
    this.audio.wrong();
  }

  // --- input --------------------------------------------------------------

  /** A click at view coordinates; routes by state and returns true if eaten. */
  handleClick(x, y, now) {
    if (this.state === STATE.TITLE) {
      this.startRun();
      return true;
    }
    if (this.state === STATE.INTRO) {
      this.beginPlay();
      return true;
    }
    if (this.state === STATE.CLEAR || this.state === STATE.FINALE) {
      this.effects.clear();
      this.afterClearCard();
      return true;
    }
    if (this.state === STATE.TIMEUP) {
      this.startRun();
      return true;
    }
    if (this.state !== STATE.PLAY) return false;

    if (inRect(x, y, HUD.hintButton)) {
      this.useHint(now);
      return true;
    }
    const panel = panelAt(x, y);
    if (!panel) return false;
    this.adjudicate(panel, x - panel.x, y - PANEL_Y, now);
    return true;
  }

  useHint(now) {
    if (this.state !== STATE.PLAY || this.hintsLeft <= 0) return;
    const unfound = this.level.slots.filter((s) => !s.found);
    if (unfound.length === 0) return;
    const slot = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintsLeft -= 1;
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - HINT_SCORE_COST);
    this.hint = { slot, until: now + HINT_VISIBLE_SEC };
    this.audio.hint();
  }

  adjudicate(panel, sx, sy, now) {
    let best = null;
    let bestDist = Infinity;
    for (const slot of this.level.slots) {
      if (slot.found) continue;
      const d = Math.hypot(slot.x - sx, slot.y - sy);
      if (d <= HIT_RADIUS && d < bestDist) {
        best = slot;
        bestDist = d;
      }
    }
    if (best) this.registerFind(best, now);
    else this.registerWrong(panel, sx, sy, now);
  }

  registerFind(slot, now) {
    slot.found = true;
    slot.foundAt = now;
    slot.order = this.level.slots.filter((s) => s.found).length;
    this.streak += 1;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    const gain = FIND_BASE_SCORE + (this.streak - 1) * STREAK_BONUS_SCORE;
    this.score += gain;
    if (!this.freeze) this.timeLeft += FIND_TIME_BONUS_SEC;
    this.hint = null;
    this.audio.find(this.streak);
    for (const px of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      this.effects.sparkBurst(px + slot.x, PANEL_Y + slot.y, '#ffd977');
    }
    this.effects.scoreText(PANEL_RIGHT_X + slot.x, PANEL_Y + slot.y - 34, `+${gain}`, '#ffd977');
    if (this.remainingCount() === 0) this.levelCleared();
  }

  registerWrong(panel, sx, sy, now) {
    this.streak = 0;
    this.wrongClicks += 1;
    this.shake = 1;
    if (!this.freeze) this.timeLeft = Math.max(0.5, this.timeLeft - WRONG_PENALTY_SEC);
    this.wrongMarks.push({ panel: panel.key, x: panel.x + sx, y: PANEL_Y + sy, at: now });
    this.audio.wrong();
  }

  // --- demo setups (deterministic stills for screenshots) -------------------

  setupDemoPlay({ level, found, t, hint }) {
    const idx = Math.min(level ?? 2, LEVELS.length - 1);
    this.levelIndex = idx;
    const seed = (this.baseSeed + idx * 7919) >>> 0;
    this.level = buildLevel(idx, seed);
    this.timeLeft = Math.round(this.level.time * (t ?? 0.62));
    this.hintsLeft = HINTS_PER_LEVEL - 1;
    this.streak = Math.min(found ?? 0, 4);
    for (let i = 0; i < (found ?? 0) && i < this.level.slots.length; i++) {
      const slot = this.level.slots[i];
      slot.found = true;
      slot.foundAt = i * 0.37;
      slot.order = i + 1;
    }
    if (hint) {
      const unfound = this.level.slots.filter((s) => !s.found);
      if (unfound.length > 0) this.hint = { slot: unfound[unfound.length - 1], until: Infinity };
    }
    this.score = (found ?? 0) * FIND_BASE_SCORE + 350;
    this.freeze = true;
    this.state = STATE.PLAY;
  }

  setupDemoClear() {
    this.levelIndex = 0;
    this.level = buildLevel(0, this.baseSeed);
    this.level.slots.forEach((slot, i) => {
      slot.found = true;
      slot.foundAt = i * 0.3;
      slot.order = i + 1;
    });
    this.score = 4820;
    this.timeLeft = 41;
    this.clearStats = { finds: this.level.slots.length, timeBonus: 410, hintsUsed: 1, wrongClicks: 2, score: this.score, last: false };
    this.clearT = CLEAR_CARD_SEC;
    this.state = STATE.CLEAR;
    this.freeze = true;
  }

  setupDemoFinale() {
    this.score = 18650;
    this.level = buildLevel(LEVELS.length - 1, this.baseSeed);
    this.finalRank = this.rankFor(this.score);
    this.state = STATE.FINALE;
    this.freeze = true;
  }
}

function panelAt(x, y) {
  if (y < PANEL_Y || y >= PANEL_Y + 600) return null;
  if (x >= PANEL_LEFT_X && x < PANEL_LEFT_X + 600) return { key: 'left', x: PANEL_LEFT_X };
  if (x >= PANEL_RIGHT_X && x < PANEL_RIGHT_X + 600) return { key: 'right', x: PANEL_RIGHT_X };
  return null;
}

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}
