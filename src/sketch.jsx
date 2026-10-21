import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMatita } from './provider.jsx';
import { drawFrame, quantize } from './rough.js';

/* The one drawing primitive. An absolutely positioned SVG that fills its (relative) parent and draws a rough frame
   around it. It never takes part in layout, never takes pointer events and is hidden from assistive tech. */
export function Sketch({ shape = 'rect', radius = 0, seed = 0, fill = false, rough, className = '' }) {
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

  const strokes = useMemo(() => drawFrame({ ...size, radius, shape, key, seed, rough: r }), [size, radius, shape, key, seed, r]);
  const rx = shape === 'pill' ? size.h / 2 : radius;

  return (
    <svg ref={ref} className={'m-sketch ' + className} aria-hidden="true" focusable="false"
      viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
      {fill && <rect className="m-sketch-fill" width={size.w} height={size.h} rx={rx} />}
      {strokes.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w * ctx.stroke} />)}
    </svg>
  );
}
