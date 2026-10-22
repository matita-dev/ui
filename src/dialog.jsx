import { useEffect, useId, useRef } from 'react';
import { Sketch } from './sketch.jsx';

/** A modal dialog on the native <dialog> element, so focus trapping, Escape, the backdrop and returning focus to the
    opener are the browser's. `open` is controlled: close it from `onClose` (Escape, backdrop click or a `close` call). */
export function Dialog({ open, onClose, title, className = '', children, ...rest }) {
  const ref = useRef(null), titleId = useId();
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={title ? titleId : undefined} className={'m-dialog ' + className}
      onClose={() => onClose?.()}
      onClick={e => { if (e.target === ref.current) ref.current.close(); }} {...rest}>
      <div className="m-dialog-body">
        <Sketch fill />
        <div className="m-dialog-content">
          {title && <h2 id={titleId} className="m-dialog-title">{title}</h2>}
          {children}
        </div>
      </div>
    </dialog>
  );
}
