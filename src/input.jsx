import { useId } from 'react';
import { Sketch } from './sketch.jsx';

/** A real <input> inside a drawn frame. The focus ring is a plain outline on the wrapper, never sketched. */
export function Input({ label, hint, className = '', id, ...rest }) {
  const auto = useId(), fid = id || auto;
  return (
    <div className={'m-field ' + className}>
      {label && <label className="m-label" htmlFor={fid}>{label}</label>}
      <div className="m-input">
        <Sketch />
        <input id={fid} aria-describedby={hint ? fid + '-hint' : undefined} {...rest} />
      </div>
      {hint && <div className="m-hint" id={fid + '-hint'}>{hint}</div>}
    </div>
  );
}
