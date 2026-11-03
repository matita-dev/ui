import React from 'react';
import { GRIDS, HANDS, MODES, useMatita } from './provider.jsx';

const LABELS = { ink: 'Ink', pencil: 'Pencil', blueprint: 'Blueprint', sketchy: 'Sketchy', clean: 'Clean', none: 'None', lines: 'Lines', dots: 'Dots' };
const label = { font: 'var(--fw-medium) 11px/1 var(--font-mono)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' };

function Segmented({ name, value, options, onChange }) {
  return (
    <div role="group" aria-label={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span aria-hidden="true" style={label}>{name}</span>
      <span data-pencil="box-light" style={{ display: 'inline-flex', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-control)', background: 'var(--surface-card)' }}>
        {options.map(o => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)} data-pencil={value === o ? 'shade' : undefined}
            style={{ height: 28, padding: '0 12px', border: 0, borderRadius: 'var(--radius-control)', cursor: 'pointer', font: 'var(--fw-medium) 12px/1 var(--font-sans)',
              background: value === o ? 'var(--ink-1)' : 'transparent', color: value === o ? 'var(--paper-0)' : 'var(--ink-1)' }}>{LABELS[o]}</button>
        ))}
      </span>
    </div>
  );
}

function Range({ name, value, min, max, step, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={label}>{name}</span>
      <input type="range" aria-label={name} min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: 110, accentColor: 'var(--blue-500)' }} />
      <output style={{ ...label, minWidth: '2.5ch', color: 'var(--ink-2)' }}>{value.toFixed(1)}</output>
    </label>
  );
}

/** A control panel that edits the provider's look live: mode and grid, plus Hand (sketchy or clean) and Line thickness in every mode,
    and a Redraw wherever the hand is drawing. `controls` picks which to show. By default it is a sticky bar across the top;
    `floating` makes it a small panel fixed to the bottom-right corner that can be folded away. Children are added at its end. */
export function Tweaks({ controls = ['mode', 'grid', 'hand', 'line', 'redraw'], title = 'Tweaks', sticky = true, floating = false, style, children, ...rest }) {
  const { mode, grid, hand, lineWeight, set, redraw } = useMatita();
  const [open, setOpen] = React.useState(true);
  const has = c => controls.includes(c);
  const body = (
    <>
      {has('mode') && <Segmented name="Mode" value={mode} options={MODES} onChange={v => set({ mode: v })} />}
      {has('grid') && <Segmented name="Grid" value={grid} options={GRIDS} onChange={v => set({ grid: v })} />}
      {has('hand') && <Segmented name="Hand" value={hand} options={HANDS} onChange={v => set({ hand: v })} />}
      {has('line') && <Range name="Line" value={lineWeight} min={0.5} max={3} step={0.1} onChange={v => set({ lineWeight: v })} />}
      {has('redraw') && (mode === 'pencil' || hand === 'sketchy') && (
        <button type="button" onClick={redraw} data-pencil="box-light" style={{ height: 28, padding: '0 12px', border: 'var(--stroke-frame) solid var(--line-1)', borderRadius: 'var(--radius-control)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--ink-1)', font: 'var(--fw-medium) 12px/1 var(--font-sans)', justifySelf: floating ? 'start' : undefined }}>Redraw</button>
      )}
      {children}
    </>
  );
  if (floating) {
    return (
      <aside aria-label={title} data-pencil="box-light" style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 'var(--z-nav)', width: 'max-content', maxWidth: 'calc(100vw - 24px)', display: 'grid', gap: 12, padding: '10px 14px',
        background: 'var(--surface-card)', border: 'var(--stroke-frame) solid var(--line-1)', borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-overlay)', ...style }} {...rest}>
        <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}
          style={{ ...label, display: 'flex', justifyContent: 'space-between', gap: 24, padding: 0, border: 0, background: 'none', cursor: 'pointer', color: 'var(--text-accent)' }}>
          <span>{title}</span><span aria-hidden="true">{open ? '–' : '+'}</span>
        </button>
        {open && body}
      </aside>
    );
  }
  return (
    <header data-pencil="rule-b" style={{ position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 'var(--z-nav)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px', padding: '12px 20px',
      background: 'var(--surface-page)', borderBottom: 'var(--stroke-frame) solid var(--line-strong)', ...style }} {...rest}>
      <span style={{ ...label, color: 'var(--text-accent)' }}>{title}</span>
      {body}
    </header>
  );
}
