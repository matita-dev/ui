import { Sketch } from './sketch.jsx';

/** A small mono label. `tone`: neutral (default), accent, success, warning, danger (tinted), outline (drawn border) or
    inverse (ink fill). Tinted tones have no border: a flat tint, hatched in pencil mode. */
export function Badge({ tone = 'neutral', className = '', children, ...rest }) {
  return (
    <span className={`m-badge m-badge--${tone} ${className}`} {...rest}>
      <Sketch fill />
      <span className="m-badge-label">{children}</span>
    </span>
  );
}
