import React from 'react';
import { drawIcon } from '@matita/icons/engine';

/* The design system's Icon, drawn from @matita/icons instead of an outside icon set. Same props: `name`, `size`, `color`.
   The glyphs are hand-drawn in every mode; pencil mode adds its graphite grain through data-pencil="svg". */
export function Icon({ name, size = 16, color = 'currentColor', seed = 0, style, ...rest }) {
  const g = React.useMemo(() => { try { return drawIcon(name, { seed }); } catch { return null; } }, [name, seed]);
  if (!g) return null;
  return (
    <svg data-sketch="" data-pencil="svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', flex: 'none', ...style }} {...rest}>
      {g.ink.map(([d, w], i) => <path key={i} d={d} strokeWidth={w * 1.6} />)}
      {g.dot && <path d={g.dot} strokeWidth={1.6 * 1.55} />}
    </svg>
  );
}
