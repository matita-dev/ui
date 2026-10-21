import { useId, useMemo } from 'react';
import { drawIcon } from '@matita/icons/engine';
import { Sketch } from './sketch.jsx';
import { useMatita } from './provider.jsx';

/** A native <select> (the browser's own list, keyboard and mobile picker) in a drawn frame with a drawn chevron. */
export function Select({ label, hint, className = '', id, children, ...rest }) {
  const auto = useId(), fid = id || auto, { stroke } = useMatita();
  const chevron = useMemo(() => drawIcon('chevron-down').ink, []);
  return (
    <div className={'m-field ' + className}>
      {label && <label className="m-label" htmlFor={fid}>{label}</label>}
      <div className="m-input m-select">
        <Sketch />
        <select id={fid} aria-describedby={hint ? fid + '-hint' : undefined} {...rest}>{children}</select>
        <svg className="m-chevron" viewBox="0 0 24 24" aria-hidden="true">
          {chevron.map(([d, w], i) => <path key={i} d={d} strokeWidth={w * stroke} />)}
        </svg>
      </div>
      {hint && <div className="m-hint" id={fid + '-hint'}>{hint}</div>}
    </div>
  );
}
