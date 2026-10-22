/* The pencil: hand-drawn linework for frames, rules, rings and shaded fills. Ported from the Drafting Grid Design System's
   pencil engine. Every stroke is a filled outline (not a stroked path) so it can have a landing pressure, a lifted tail,
   a slight bow and drift, and so corners cross. Same key + seed always draw the same sheet. */
import { hash } from '@matita/icons/engine';

const q = n => Math.round(n * 100) / 100;
const prng = s => { let a = s >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

/** Smooth random curve in [-1, 1], one new value every `step` units. */
function wave(r, len, step) {
  const n = Math.max(2, Math.ceil(len / step) + 2), v = [];
  for (let i = 0; i < n; i++) v.push(r() * 2 - 1);
  return s => { const x = Math.max(0, s) / step, i = Math.min(n - 2, Math.floor(x)), f = Math.min(1, x - i), u = (1 - Math.cos(f * Math.PI)) / 2; return v[i] + (v[i + 1] - v[i]) * u; };
}

/** A pen bound to one random stream and one roughness (0 = ruler-straight, 1 = the full hand). */
function makePen(r, ROUGH) {
  /* the hand: ends drift a little, the stroke bows once (sometimes a faint S) and wanders gently between */
  function wander(L, k, tl = .45) {
    if (!(k > 0)) return () => 0;
    const amp = Math.min(1.6, .35 + L * .0045) * k, b1 = (r() * 2 - 1) * amp, b2 = (r() * 2 - 1) * amp * .3,
      t0 = (r() * 2 - 1) * tl * k, t1 = (r() * 2 - 1) * tl * k, wa = Math.min(.5, .1 + L / 1000) * k, wb = wave(r, L, 40 + r() * 70);
    return s => { const t = s / L; return t0 + (t1 - t0) * t + b1 * Math.sin(Math.PI * t) + b2 * Math.sin(2 * Math.PI * t) + wb(s) * wa; };
  }
  /** One ruled stroke as a filled outline: pressure lands, varies along the line, and lifts off at the tail. */
  function stroke(x0, y0, x1, y1, w, o = {}) {
    if (r() < (o.flip ?? .2)) { let t = x0; x0 = x1; x1 = t; t = y0; y0 = y1; y1 = t; }
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < .6) return '';
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, path = o.path || wander(L, (o.wobble ?? 1) * ROUGH, o.tilt ?? .45);
    const wv = wave(r, L, 12 + r() * 20), vr = o.vary ?? .16;
    const land = Math.min(o.land ?? 2.5, L * .2), lift = Math.min(o.lift ?? 12, L * .3), st = Math.max(1.2, Math.min(3.5, L / 10)), A = [], B = [];
    for (let s = 0; ; s += st) {
      const ss = Math.min(s, L); let p = 1 + wv(ss) * vr;
      if (ss < land) p *= .5 + .55 * ss / land; else if (ss < land * 3) p *= 1.06;
      if (L - ss < lift) p *= .28 + .72 * (L - ss) / lift;
      const off = path(ss), hw = Math.max(.12, w * p / 2 + (r() - .5) * .1), cx = x0 + ux * ss + nx * off, cy = y0 + uy * ss + ny * off;
      A.push(q(cx + nx * hw) + ' ' + q(cy + ny * hw)); B.push(q(cx - nx * hw) + ' ' + q(cy - ny * hw));
      if (ss >= L) break;
    }
    return 'M' + A.join('L') + 'L' + B.reverse().join('L') + 'Z';
  }
  /** A dashed or dotted line: short strokes with uneven gaps. */
  function dashes(x0, y0, x1, y1, w, dl, gl) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) return '';
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, off = wander(L, ROUGH), P = s => { const k = off(s) + (r() - .5) * .14; return [x0 + ux * s + nx * k, y0 + uy * s + ny * k]; };
    let s = r() * gl * .8, d = '';
    while (s < L) {
      const l = Math.min(L - s, dl * (.75 + r() * .5));
      if (l > .7) { const a = P(s), b = P(s + l); d += stroke(a[0], a[1], b[0], b[1], w, { flip: 0, land: .6, lift: l * .35, wobble: 0, vary: .2 }); }
      s += l + gl * (.75 + r() * .5);
    }
    return d;
  }
  /** A freehand circle or ellipse: the ends overlap and drift outward, like a pencil ring. */
  function ring(cx, cy, rx, ry, w) {
    const a0 = r() * 6.283, sw = 6.283 * (1.05 + r() * .07), n = Math.max(28, Math.ceil((rx + ry) * 1.5)), wb = wave(r, sw, 1.1), dr = .35 + r() * .5, A = [], B = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = a0 + sw * t, k = (wb(sw * t) * .35 + dr * t) * ROUGH, p = t < .1 ? .35 + 6.5 * t : t > .88 ? .3 + .7 * (1 - t) / .12 : 1,
        c = Math.cos(a), s = Math.sin(a), hw = w * p / 2, px = cx + c * (rx + k), py = cy + s * (ry + k);
      A.push(q(px + c * hw) + ' ' + q(py + s * hw)); B.push(q(px - c * hw) + ' ' + q(py - s * hw));
    }
    return 'M' + A.join('L') + 'L' + B.reverse().join('L') + 'Z';
  }
  /** A hatch stroke that swells in the middle and tapers at both ends. */
  function sliver(x0, y0, x1, y1, w) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < .5) return '';
    const nx = -dy / L * w / 2, ny = dx / L * w / 2, m1 = Math.min(.3, (1.5 + r() * 3) / L), m2 = 1 - Math.min(.3, (2 + r() * 4) / L),
      ax = x0 + dx * m1, ay = y0 + dy * m1, bx = x0 + dx * m2, by = y0 + dy * m2, k = .8 + r() * .3;
    return 'M' + q(x0) + ' ' + q(y0) + 'L' + q(ax + nx) + ' ' + q(ay + ny) + 'L' + q(bx + nx * k) + ' ' + q(by + ny * k) + 'L' + q(x1) + ' ' + q(y1) +
      'L' + q(bx - nx * k) + ' ' + q(by - ny * k) + 'L' + q(ax - nx) + ' ' + q(ay - ny) + 'Z';
  }
  /** Parallel strokes clipped to the box; returns three paths so pressure can vary stroke to stroke. */
  function hatch(W, H, o) {
    const a = o.ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, cx = W / 2, cy = H / 2, R = Math.hypot(W, H) / 2 + 2, i = o.inset || 0, e = o.ext || 0, out = ['', '', ''];
    for (let k = -R + r() * o.sp; k < R; k += o.sp * (.82 + r() * .36)) {
      const px = cx + nx * k, py = cy + ny * k; let lo = -1e9, hi = 1e9, ok = true;
      for (const [p, u, mn, mx] of [[px, ux, i, W - i], [py, uy, i, H - i]]) {
        if (Math.abs(u) < 1e-6) { if (p < mn || p > mx) ok = false; continue; }
        let ta = (mn - p) / u, tb = (mx - p) / u; if (ta > tb) { const t = ta; ta = tb; tb = t; }
        if (ta > lo) lo = ta; if (tb < hi) hi = tb;
      }
      if (!ok || hi - lo < .5) continue;
      const t0 = lo - (r() * e * 1.3 - e * .35), t1 = hi + (r() * e * 1.3 - e * .35), w = o.w * (.75 + r() * .5), b = (r() * 3) | 0;
      out[b] += sliver(px + ux * t0, py + uy * t0, px + ux * t1, py + uy * t1, w);
    }
    return out;
  }
  return { stroke, dashes, ring, hatch };
}

/** Linework for a W x H box. `shape`: rect (four ruled sides that cross at the corners), marks (four sides that run `reach`
    past each corner), line, vline or ellipse. `dashed` draws the sides as dashes. `shade` adds graphite hatching for dark fills.
    `weight` scales the line width. Returns { lines: [{ d, o }], shade: [{ d, o }] } as filled outlines. */
export function pencilStrokes({ w: W, h: H, shape = 'rect', dashed = false, reach = 8, shade = false, light = false, seed = 0, key = '', rough = 1, weight = 1 }) {
  const r = prng(hash(key + ':' + seed)), pen = makePen(r, rough), lines = [], fills = [];
  const lw = Math.max(1.1, (light ? 1.1 : 1.35) * weight), o = light ? .55 : .88;
  const add = (d, op) => { if (d) lines.push({ d, o: op }); };
  const side = (x0, y0, x1, y1, retrace) => {
    add(dashed ? pen.dashes(x0, y0, x1, y1, lw, 4.6, 3.4) : pen.stroke(x0, y0, x1, y1, lw), o);
    const hz = y0 === y1, len = hz ? W : H;
    if (retrace && !dashed && len > 70 && r() < .3) { // now and then the pen goes over part of a side again
      const a = .08 + r() * .4, z = Math.min(1, a + .25 + r() * .4), f = (r() - .5) * .8, X = t => x0 + (x1 - x0) * t + (hz ? 0 : f), Y = t => y0 + (y1 - y0) * t + (hz ? f : 0);
      add(pen.stroke(X(a), Y(a), X(z), Y(z), lw * .7, { vary: .3 }), o * .45);
    }
  };
  if (shape === 'ellipse') add(pen.ring(W / 2, H / 2, W / 2 - .5, H / 2 - .5, lw), o);
  else if (shape === 'line') side(0, .5, W, .5);
  else if (shape === 'vline') side(.5, 0, .5, H);
  else if (shape === 'marks') {
    const j = () => reach * (.85 + r() * .3);
    side(-j(), .5, W + j(), .5, true); side(-j(), H - .5, W + j(), H - .5, true); side(.5, -j(), .5, H + j(), true); side(W - .5, -j(), W - .5, H + j(), true);
  } else {
    const ob = Math.max(2, Math.min(7, Math.min(W, H) * .16)), ov = () => (r() < .12 ? -r() * .7 : ob * (.2 + r() * .8));
    side(-ov(), .5, W + ov(), .5, true); side(W - .5, -ov(), W - .5, H + ov(), true); side(-ov(), H - .5, W + ov(), H - .5, true); side(.5, -ov(), .5, H + ov(), true);
  }
  if (shade && W > 2 && H > 2) pen.hatch(W, H, { ang: -64 + r() * 10, sp: 1.55, w: 1.3, ext: 1, inset: .4 }).forEach((d, i) => d && fills.push({ d, o: .7 + i * .1 }));
  return { lines, shade: fills };
}
