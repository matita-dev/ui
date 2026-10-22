import { Sketch } from './sketch.jsx';

/** A small mono label in a drawn box (Drafting Grid: no pills). `tone`: default (outlined) or accent (filled). */
export function Badge({ tone = 'default', className = '', children, ...rest }) {
  return (
    <span className={`m-badge m-badge--${tone} ${className}`} {...rest}>
      <Sketch fill={tone !== 'default'} />
      <span className="m-badge-label">{children}</span>
    </span>
  );
}
