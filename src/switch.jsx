import { Sketch } from './sketch.jsx';

/** A native checkbox with role="switch": a drawn pill track and a drawn knob that slides across. */
export function Switch({ children, className = '', ...rest }) {
  return (
    <label className={'m-check m-switch ' + className}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="m-switch-track">
        <Sketch shape="pill" fill />
        <span className="m-knob"><Sketch shape="ellipse" fill /></span>
      </span>
      {children && <span className="m-check-label">{children}</span>}
    </label>
  );
}
