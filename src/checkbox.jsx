import { useMemo } from 'react';
import { drawIcon } from '@matita/icons/engine';
import { Sketch } from './sketch.jsx';
import { useMatita } from './provider.jsx';

/** Native checkbox (stays focusable, clickable and announced) with a drawn box. The tick is the icon set's own `check`,
    drawn on when the box is checked. */
export function Checkbox({ children, className = '', ...rest }) {
  const { stroke } = useMatita();
  const tick = useMemo(() => drawIcon('check').ink, []);
  return (
    <label className={'m-check ' + className}>
      <input type="checkbox" {...rest} />
      <span className="m-check-box">
        <Sketch />
        <svg className="m-tick" viewBox="0 0 24 24" aria-hidden="true">
          {tick.map(([d, w], i) => <path key={i} d={d} pathLength="1" strokeWidth={w * stroke * 1.35} />)}
        </svg>
      </span>
      {children && <span className="m-check-label">{children}</span>}
    </label>
  );
}
