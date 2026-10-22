import { Sketch } from './sketch.jsx';

/** A native checkbox with role="switch": a drawn track and a square knob that slides across. */
export function Switch({ children, className = '', ...rest }) {
  return (
    <label className={'m-check m-switch ' + className}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="m-switch-track">
        <Sketch fill />
        <span className="m-knob"><Sketch fill /></span>
      </span>
      {children && <span className="m-check-label">{children}</span>}
    </label>
  );
}
