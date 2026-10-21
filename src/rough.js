/* Frame geometry for the sketch layer: a rect or pill written as engine primitives, then drawn by the icon engine.
   @matita/icons 0.3.0 has no wobble setting yet, so `rough` is on/off here: 0 draws clean lines (exact()), anything
   above 0 draws the full hand. Graded roughness arrives with icons 0.4.0. */
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

/** The same shapes as true geometry, no hand. */
function exactFrame(w, h, radius, shape) {
  if (shape === 'line') return [{ d: `M0 0L${f(w)} 0`, w: 1 }];
  const r = Math.min(shape === 'pill' ? h / 2 : radius, w / 2, h / 2);
  if (r < 1) return [{ d: `M0 0L${f(w)} 0L${f(w)} ${f(h)}L0 ${f(h)}Z`, w: 1 }];
  const W = f(w), H = f(h), R = f(r), a = `A${R} ${R} 0 0 1`;
  return [{ d: `M${R} 0H${f(w - r)}${a} ${W} ${R}V${f(h - r)}${a} ${f(w - r)} ${H}H${R}${a} 0 ${f(h - r)}V${R}${a} ${R} 0Z`, w: 1 }];
}

/** Strokes for a frame. `key` + `seed` fix the drawing; `rough` 0 = exact shape, above 0 = the hand. */
export function drawFrame({ w, h, radius = 0, shape = 'rect', key, seed = 0, rough = 1 }) {
  if (!rough) return exactFrame(w, h, radius, shape);
  const src = shape === 'line' ? lineSource(w) : frameSource(w, h, shape === 'pill' ? h / 2 : radius);
  return drawSource(src, key, seed).p;
}
