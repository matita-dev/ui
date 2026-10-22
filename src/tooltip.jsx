import { cloneElement, isValidElement, useEffect, useId, useState } from 'react';
import { Sketch } from './sketch.jsx';

/** A tooltip above its trigger. Shows on hover and on keyboard focus, closes on Escape, and is tied to the trigger with
    aria-describedby. It does not move to avoid the screen edge, so keep the text short. */
export function Tooltip({ content, children, className = '' }) {
  const id = useId(), [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);
  const trigger = isValidElement(children) ? cloneElement(children, { 'aria-describedby': open ? id : children.props['aria-describedby'] }) : children;
  return (
    <span className={'m-tooltip-wrap ' + className}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {trigger}
      {open && <span role="tooltip" id={id} className="m-tooltip"><Sketch fill /><span className="m-tooltip-label">{content}</span></span>}
    </span>
  );
}
