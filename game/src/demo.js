// Deterministic demo mode: URL parameters stage a game position so a
// screenshot tool can capture real renders of mid-play states.
//
//   ?shot=title                     the title screen (default)
//   ?shot=play&level=2&found=4&t=.6 a playing scene with 4 found, 60% clock
//   ?shot=clear                     a scene-cleared card
//   ?shot=finale                    the case-closed finale
//
// Optional &seed=<u32> pins the scene layout. Demo play freezes the clock so
// the staged position holds still while animations keep breathing.

export function parseDemo(search) {
  const params = new URLSearchParams(search);
  const shot = params.get('shot');
  if (!shot) return null;
  const num = (name, fallback) => {
    const raw = Number(params.get(name));
    return Number.isFinite(raw) && params.get(name) !== null ? raw : fallback;
  };
  return {
    shot,
    level: Math.max(0, Math.floor(num('level', 2))),
    found: Math.max(0, Math.floor(num('found', 0))),
    t: Math.min(1, Math.max(0.05, num('t', 0.62))),
    hint: params.get('hint') === '1',
    seed: (num('seed', 20261121) >>> 0),
  };
}
