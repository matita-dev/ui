import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMatita } from './provider.jsx';
import { drawFrame, quantize } from './rough.js';
import { pencilStrokes } from './pencil-engine.js';

const PAD = 14; // the svg is this much larger than its box on every side

/* The one drawing primitive. An absolutely positioned SVG that fills its (relative) parent and draws a frame around it:
   exact 1px lines when `rough` is 0, the pencil (hand-drawn outlines with pressure, drift and crossed corners) when it is
   above 0. It never takes part in layout, never takes pointer events and is hidden from assistive tech.
   `shade` adds graphite hatching over a dark fill. */
export function Sketch({ shape = 'rect', radius = 0, seed = 0, fill = false, shade = false, rough, dashed = false, reach = 8, className = '' }) {
  const ctx = useMatita(), r = rough ?? ctx.rough, key = useId();
  const ref = useRef(null), [size, setSize] = useState({ w: 120, h: 40 });

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const read = () => {
      const w = el.clientWidth || el.getBoundingClientRect().width, h = el.clientHeight || el.getBoundingClientRect().height;
      if (w && h) setSize({ w: quantize(w - 2 * PAD, 4), h: quantize(h - 2 * PAD, 2) });
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hand = useMemo(() => (r ? pencilStrokes({ ...size, shape: shape === 'pill' ? 'rect' : shape, dashed, reach, shade: shade && fill, key, seed, rough: r, weight: ctx.stroke }) : null),
    [r, size, shape, dashed, reach, shade, fill, key, seed, ctx.stroke]);
  const exact = useMemo(() => (r ? [] : drawFrame({ ...size, radius, shape, reach, key, seed, rough: 0 })), [r, size, radius, shape, reach, key, seed]);
  const rx = shape === 'pill' ? size.h / 2 : radius;

  return (
    <svg ref={ref} className={'m-sketch ' + (dashed ? 'm-sketch--dashed ' : '') + className} aria-hidden="true" focusable="false"
      viewBox={`${-PAD} ${-PAD} ${size.w + 2 * PAD} ${size.h + 2 * PAD}`} preserveAspectRatio="none">
      {fill && (shape === 'ellipse'
        ? <ellipse className={'m-sketch-fill' + (hand?.shade.length ? ' is-shaded' : '')} cx={size.w / 2} cy={size.h / 2} rx={size.w / 2} ry={size.h / 2} />
        : <rect className={'m-sketch-fill' + (hand?.shade.length ? ' is-shaded' : '')} width={size.w} height={size.h} rx={rx} />)}
      {hand?.shade.length > 0 && <g className="m-pencil-shade">{hand.shade.map((p, i) => <path key={i} d={p.d} fillOpacity={p.o} />)}</g>}
      {hand && <g className="m-pencil">{hand.lines.map((p, i) => <path key={i} d={p.d} fillOpacity={p.o} />)}</g>}
      {exact.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w * ctx.stroke} />)}
    </svg>
  );
}
