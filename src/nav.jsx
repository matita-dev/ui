import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { Sketch } from './sketch.jsx';
import { Icon } from './icon.jsx';

/** Where you are, as mono labels. The last item is the current page; others with `href` or `onClick` are links. */
export function Breadcrumb({ items = [], className = '', ...rest }) {
  return (
    <nav aria-label="Breadcrumb" className={'m-crumbs ' + className} {...rest}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1, link = !last && (it.href || it.onClick);
          return (
            <li key={i}>
              {link ? <a href={it.href} onClick={it.onClick}>{it.label}</a> : <span aria-current={last ? 'page' : undefined} className={last ? 'm-crumb-now' : ''}>{it.label}</span>}
              {!last && <span aria-hidden="true" className="m-crumb-sep">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PageBox({ on, label, disabled, onClick, current, children }) {
  return (
    <button type="button" className={'m-pg' + (on ? ' m-pg--on' : '')} aria-label={label} aria-current={current} disabled={disabled} onClick={onClick}>
      <Sketch fill shade={on} />
      <span className="m-pg-label">{children}</span>
    </button>
  );
}

/** Page numbers in drawn boxes, with previous and next. Controlled (`page`, `onChange`) or not (`defaultPage`). */
export function Pagination({ page, defaultPage = 1, count = 1, onChange, className = '', ...rest }) {
  const [inner, setInner] = useState(defaultPage), cur = page ?? inner;
  const go = p => { if (p < 1 || p > count || p === cur) return; if (page === undefined) setInner(p); onChange?.(p); };
  const pages = [];
  for (let p = 1; p <= count; p++) {
    if (p === 1 || p === count || Math.abs(p - cur) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return (
    <nav aria-label="Pagination" className={'m-pagination ' + className} {...rest}>
      <PageBox label="Previous page" disabled={cur <= 1} onClick={() => go(cur - 1)}><Icon name="chevron-left" size={14} /></PageBox>
      {pages.map((p, i) => p === '…'
        ? <span key={'e' + i} className="m-pg-gap" aria-hidden="true">…</span>
        : <PageBox key={p} on={p === cur} current={p === cur ? 'page' : undefined} onClick={() => go(p)}>{String(p).padStart(2, '0')}</PageBox>)}
      <PageBox label="Next page" disabled={cur >= count} onClick={() => go(cur + 1)}><Icon name="chevron-right" size={14} /></PageBox>
    </nav>
  );
}

/** Numbered stages, left to right. Steps before `current` are done (ink), `current` is blue, later ones are dashed. */
export function Stepper({ steps = [], current = 0, className = '', ...rest }) {
  return (
    <ol className={'m-stepper ' + className} {...rest}>
      {steps.map((s, i) => {
        const done = i < current, on = i === current;
        return (
          <li key={i} aria-current={on ? 'step' : undefined} className={'m-step' + (done ? ' m-step--done' : on ? ' m-step--on' : '')}>
            <div className="m-step-head">
              <span className="m-step-n"><Sketch fill shade={done || on} /><span>{String(i + 1).padStart(2, '0')}</span></span>
              {i < steps.length - 1 && <span className="m-step-rule" aria-hidden="true"><Sketch shape="line" dashed={!done} /></span>}
            </div>
            <div className="m-step-text">
              <span className="m-step-label">{s.label}</span>
              {s.meta && <span className="m-step-meta">{s.meta}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** A menu of actions. Give it a `trigger` element to make it a dropdown, or none to show the panel inline.
    Items: { id, label, icon, shortcut, danger, disabled } plus { divider: true } and { heading: 'Text' }.
    Arrow keys, Home, End and Escape work; focus returns to the trigger on close. */
export function Menu({ items = [], onSelect, trigger, align = 'left', className = '', ...rest }) {
  const [open, setOpen] = useState(false), id = useId(), wrap = useRef(null), panel = useRef(null);
  const close = () => { setOpen(false); wrap.current?.querySelector('[aria-haspopup]')?.focus(); };
  useEffect(() => {
    if (!trigger || !open) return;
    const down = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', down);
    panel.current?.querySelector('[role="menuitem"]:not(:disabled)')?.focus();
    return () => document.removeEventListener('pointerdown', down);
  }, [open, trigger]);
  const onKeyDown = e => {
    const all = [...panel.current.querySelectorAll('[role="menuitem"]:not(:disabled)')], i = all.indexOf(document.activeElement);
    if (e.key === 'Escape' && trigger) { e.preventDefault(); close(); return; }
    const next = { ArrowDown: (i + 1) % all.length, ArrowUp: (i - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
    if (next !== undefined) { e.preventDefault(); all[next]?.focus(); }
  };
  const list = (
    <div ref={panel} role="menu" id={id} className={`m-menu ${trigger ? 'm-menu--float m-menu--' + align : ''} ${className}`} onKeyDown={onKeyDown} {...rest}>
      <Sketch fill />
      <div className="m-menu-body">
        {items.map((it, i) => it.divider ? <div key={i} role="separator" className="m-menu-sep"><Sketch shape="line" dashed /></div>
          : it.heading ? <div key={i} className="m-menu-heading">{it.heading}</div>
          : (
            <button key={it.id ?? i} type="button" role="menuitem" disabled={it.disabled} className={'m-menu-item' + (it.danger ? ' m-menu-item--danger' : '')}
              onClick={() => { onSelect?.(it.id ?? it.label); if (trigger) close(); }}>
              {it.icon && <Icon name={it.icon} size={15} />}
              <span className="m-menu-text">{it.label}</span>
              {it.shortcut && <span className="m-menu-key">{it.shortcut}</span>}
            </button>
          ))}
      </div>
    </div>
  );
  if (!trigger) return list;
  return (
    <div ref={wrap} className="m-menu-wrap">
      {isValidElement(trigger) ? cloneElement(trigger, { 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? id : undefined, onClick: e => { trigger.props.onClick?.(e); setOpen(o => !o); } }) : trigger}
      {open && list}
    </div>
  );
}
