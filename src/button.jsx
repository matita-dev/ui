import { useState } from 'react';
import { Sketch } from './sketch.jsx';

/** Buttons keep the native element: focus, keyboard and hit area are ordinary. The pen only draws the border and fill.
    Pressing redraws it once, with a new seed. */
export function Button({ variant = 'default', pill = false, className = '', children, onPointerDown, ...rest }) {
  const [seed, setSeed] = useState(0);
  return (
    <button type="button" className={`m-btn m-btn--${variant} ${className}`}
      onPointerDown={e => { setSeed(s => s + 1); onPointerDown?.(e); }} {...rest}>
      <Sketch shape={pill ? 'pill' : 'rect'} radius={0} seed={seed} fill={variant !== 'ghost'} />
      <span className="m-btn-label">{children}</span>
    </button>
  );
}

export function IconButton({ label, className = '', children, ...rest }) {
  return <Button {...rest} aria-label={label} className={'m-btn--icon ' + className}>{children}</Button>;
}
