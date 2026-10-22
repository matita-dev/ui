import { useState } from 'react';
import { Sketch } from './sketch.jsx';
import { Icon } from './icon.jsx';

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

/** A square button for one glyph. `icon` is an @matita/icons name; `children` still works for a custom mark. */
export function IconButton({ label, icon, className = '', children, ...rest }) {
  return <Button title={label} {...rest} aria-label={label} className={'m-btn--icon ' + className}>{icon ? <Icon name={icon} size={16} /> : children}</Button>;
}
