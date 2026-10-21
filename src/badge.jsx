import { Sketch } from './sketch.jsx';

/** A small label in a drawn pill. `tone`: default (outlined) or accent (filled). */
export function Badge({ tone = 'default', className = '', children, ...rest }) {
  return (
    <span className={`m-badge m-badge--${tone} ${className}`} {...rest}>
      <Sketch shape="pill" fill={tone !== 'default'} />
      <span className="m-badge-label">{children}</span>
    </span>
  );
}
