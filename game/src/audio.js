// Sound and music, all synthesized with WebAudio so the entry ships no audio
// files and plays offline. The AudioContext is created lazily on the first
// user gesture; every effect is a short envelope-shaped oscillator.

const NOTE_BASE = 440;

function noteFreq(stepsFromA) {
  return NOTE_BASE * Math.pow(2, stepsFromA / 12);
}

export class AudioKit {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.musicTimer = null;
    this.muted = false;
    this.musicStep = 0;
  }

  ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext ?? window.webkitAudioContext)();
    } catch {
      return false;
    }
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.6;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.16;
    this.musicGain.connect(this.master);
    return true;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.6;
  }

  blip(freq, dur, type, gainPeak, when = 0, dest = null) {
    if (!this.ensure()) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(env);
    env.connect(dest ?? this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** A find: a bright two-note pluck that climbs with the streak. */
  find(streak) {
    const step = Math.min(streak, 8);
    this.blip(noteFreq(3 + step), 0.16, 'triangle', 0.5);
    this.blip(noteFreq(10 + step), 0.3, 'sine', 0.42, 0.09);
  }

  wrong() {
    this.blip(150, 0.2, 'sawtooth', 0.25);
    this.blip(98, 0.3, 'sawtooth', 0.22, 0.08);
  }

  hint() {
    for (let i = 0; i < 4; i++) this.blip(noteFreq(19 + i * 2), 0.22, 'sine', 0.16, i * 0.07);
  }

  clear() {
    [0, 4, 7, 12, 16].forEach((n, i) => this.blip(noteFreq(n), 0.34, 'triangle', 0.4, i * 0.1));
  }

  tick() {
    this.blip(880, 0.05, 'square', 0.08);
  }

  advance() {
    this.blip(noteFreq(7), 0.14, 'sine', 0.3);
    this.blip(noteFreq(14), 0.2, 'sine', 0.3, 0.08);
  }

  /** Soft ambient loop: a slow arpeggio under a low pad. */
  startMusic() {
    if (!this.ensure() || this.musicTimer) return;
    const chords = [
      [-9, -2, 3, 7],
      [-7, 0, 5, 9],
      [-12, -5, 2, 7],
      [-10, -3, 4, 9],
    ];
    const playStep = () => {
      if (this.muted) return;
      const chord = chords[Math.floor(this.musicStep / 4) % chords.length];
      const note = chord[this.musicStep % 4];
      this.blip(noteFreq(note), 1.4, 'sine', 0.5, 0, this.musicGain);
      this.blip(noteFreq(note + 12), 1.0, 'triangle', 0.18, 0.05, this.musicGain);
      this.musicStep += 1;
    };
    playStep();
    this.musicTimer = setInterval(playStep, 900);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
