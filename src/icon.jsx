import { useMemo } from 'react';
import { drawIcon } from '@matita/icons/engine';
import { useMatita } from './provider.jsx';

/** A glyph from @matita/icons, drawn in the current hand. Inherits the text colour; `size` in px. Unknown names draw nothing. */
export function Icon({ name, size = 16, seed = 0, className = '', ...rest }) {
  const { stroke } = useMatita();
  const g = useMemo(() => { try { return drawIcon(name, { seed }); } catch { return null; } }, [name, seed]);
  if (!g) return null;
  return (
    <svg className={'m-icon ' + className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      {g.ink.map(([d, w], i) => <path key={i} d={d} strokeWidth={w * stroke} />)}
      {g.dot && <path d={g.dot} strokeWidth={stroke * 1.55} />}
    </svg>
  );
}
