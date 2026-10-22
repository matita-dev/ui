import { Sketch } from './sketch.jsx';
import { Icon } from './icon.jsx';

const TONES = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert' };

/** A short message in a drawn box with a status icon. It is the message only: you place and time it. `onClose` adds a dismiss
    button and `action` is any element (usually a Button). Announced politely (role="status"); tone "danger" is an alert. */
export function Toast({ tone = 'info', title, action, onClose, className = '', children, ...rest }) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`m-toast m-toast--${tone} ${className}`} {...rest}>
      <Sketch fill />
      <Icon name={TONES[tone] || TONES.info} size={16} className="m-toast-icon" />
      <div className="m-toast-body">
        {title && <div className="m-toast-title">{title}</div>}
        {children && <div className="m-toast-note">{children}</div>}
        {action && <div className="m-toast-action">{action}</div>}
      </div>
      {onClose && <button type="button" className="m-toast-close" aria-label="Dismiss" onClick={onClose}><Icon name="x" size={14} /></button>}
    </div>
  );
}
