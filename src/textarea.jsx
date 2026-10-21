import { useId } from 'react';
import { Sketch } from './sketch.jsx';

/** Same drawn frame as Input around a real <textarea>. The frame follows the box when it is resized. */
export function Textarea({ label, hint, className = '', id, rows = 4, ...rest }) {
  const auto = useId(), fid = id || auto;
  return (
    <div className={'m-field ' + className}>
      {label && <label className="m-label" htmlFor={fid}>{label}</label>}
      <div className="m-input m-textarea">
        <Sketch />
        <textarea id={fid} rows={rows} aria-describedby={hint ? fid + '-hint' : undefined} {...rest} />
      </div>
      {hint && <div className="m-hint" id={fid + '-hint'}>{hint}</div>}
    </div>
  );
}
