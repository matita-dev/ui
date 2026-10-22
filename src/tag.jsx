import { Sketch } from './sketch.jsx';
import { Icon } from './icon.jsx';

/** A small label. Idle it is a dashed box; hovering (when clickable) makes it solid; `selected` fills it with ink.
    Give `onClick` to make it a toggle button and `onRemove` for a remove cross. */
export function Tag({ selected = false, onClick, onRemove, className = '', children, ...rest }) {
  const Root = onClick ? 'button' : 'span';
  return (
    <Root type={onClick ? 'button' : undefined} onClick={onClick} aria-pressed={onClick ? selected : undefined}
      className={`m-tag ${selected ? 'm-tag--on ' : ''}${onClick ? 'm-tag--click ' : ''}${className}`} {...rest}>
      <Sketch fill className="m-tag-box" />
      <span className="m-tag-label">{children}</span>
      {onRemove && (
        <span role="button" tabIndex={0} aria-label="Remove" className="m-tag-x"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onRemove(); } }}>
          <Icon name="x" size={12} />
        </span>
      )}
    </Root>
  );
}
