/* Frame geometry for the sketch layer: a rect or pill written as engine primitives, then drawn by the icon engine. */
import { drawSource } from '@matita/icons/engine';

const f = n => Math.round(n * 100) / 100;

/** Primitive source for a box of w x h. radius 0 = four ruled lines that cross at the corners; above 0 = lines joined by arcs. */
export function frameSource(w, h, radius = 0) {
  const r = Math.min(radius, w / 2, h / 2);
  if (r < 1) return `R 0 0 ${f(w)} ${f(h)}`;
  const W = f(w), H = f(h), R = f(r), x2 = f(w - r), y2 = f(h - r);
  return [
    `L ${R} 0 ${x2} 0`, `A ${x2} ${R} ${R} -90 0`,
    `L ${W} ${R} ${W} ${y2}`, `A ${x2} ${y2} ${R} 0 90`,
    `L ${x2} ${H} ${R} ${H}`, `A ${R} ${y2} ${R} 90 180`,
    `L 0 ${y2} 0 ${R}`, `A ${R} ${R} ${R} 180 270`,
  ].join(';');
}

/** A single ruled line, for underlines and dividers. */
export const lineSource = w => `L 0 0 ${f(w)} 0`;

/** Snap a measured size to a step so a resize does not redraw on every pixel. */
export const quantize = (n, step = 8) => Math.max(step, Math.round(n / step) * step);

/** Strokes for a frame. `key` + `seed` fix the drawing; `rough` is the wobble amount (0 = exact). */
export function drawFrame({ w, h, radius, shape = 'rect', key, seed = 0, rough = 1 }) {
  const src = shape === 'line' ? lineSource(w) : frameSource(w, h, shape === 'pill' ? h / 2 : radius);
  return drawSource(src, key, seed, rough).p;
}
