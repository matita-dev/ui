import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMatita } from './provider.jsx';
import { drawFrame, quantize } from './rough.js';

/* The one drawing primitive. An absolutely positioned SVG that fills its (relative) parent and draws a rough frame
   around it. It never takes part in layout, never takes pointer events and is hidden from assistive tech. */
export function Sketch({ shape = 'rect', radius = 0, seed = 0, fill = false, rough, dashed = false, reach = 8, className = '' }) {
  const ctx = useMatita(), r = rough ?? ctx.rough, key = useId();
  const ref = useRef(null), [size, setSize] = useState({ w: 120, h: 40 });

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const read = () => {
      const w = el.clientWidth || el.getBoundingClientRect().width, h = el.clientHeight || el.getBoundingClientRect().height;
      if (w && h) setSize({ w: quantize(w), h: quantize(h, 4) });
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const strokes = useMemo(() => drawFrame({ ...size, radius, shape, reach, key, seed, rough: r }), [size, radius, shape, reach, key, seed, r]);
  /* Pencil mode shows a lighter second pass over the first, like a line gone over twice. It only exists when drawn by hand. */
  const second = useMemo(() => (r ? drawFrame({ ...size, radius, shape, reach, key, seed: seed + 101, rough: r }) : []), [size, radius, shape, reach, key, seed, r]);
  const rx = shape === 'pill' ? size.h / 2 : radius;

  return (
    <svg ref={ref} className={'m-sketch ' + (dashed ? 'm-sketch--dashed ' : '') + className} aria-hidden="true" focusable="false"
      viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
      {fill && (shape === 'ellipse'
        ? <ellipse className="m-sketch-fill" cx={size.w / 2} cy={size.h / 2} rx={size.w / 2} ry={size.h / 2} />
        : <rect className="m-sketch-fill" width={size.w} height={size.h} rx={rx} />)}
      {second.length > 0 && <g className="m-pass2">{second.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w * ctx.stroke * 0.6} />)}</g>}
      {strokes.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w * ctx.stroke} />)}
    </svg>
  );
}
