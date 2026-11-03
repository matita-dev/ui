import React from 'react';
import { GRIDS, MODES, useMatita } from './provider.jsx';

const LABELS = { ink: 'Ink', pencil: 'Pencil', blueprint: 'Blueprint', none: 'None', lines: 'Lines', dots: 'Dots' };
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

/** A header bar that edits the provider's look live: mode and grid, plus a Redraw for the pencil. `controls` picks which to show. */
export function Tweaks({ controls = ['mode', 'grid', 'redraw'], title = 'Tweaks', sticky = true, style, ...rest }) {
  const { mode, grid, set, redraw } = useMatita();
  const has = c => controls.includes(c);
  return (
    <header data-pencil="rule-b" style={{ position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 'var(--z-nav)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px', padding: '12px 20px',
      background: 'var(--surface-page)', borderBottom: '1px solid var(--line-strong)', ...style }} {...rest}>
      <span style={{ ...label, color: 'var(--text-accent)' }}>{title}</span>
      {has('mode') && <Segmented name="Mode" value={mode} options={MODES} onChange={v => set({ mode: v })} />}
      {has('grid') && <Segmented name="Grid" value={grid} options={GRIDS} onChange={v => set({ grid: v })} />}
      {has('redraw') && mode === 'pencil' && (
        <button type="button" onClick={redraw} data-pencil="box-light" style={{ height: 28, padding: '0 12px', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-control)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--ink-1)', font: 'var(--fw-medium) 12px/1 var(--font-sans)' }}>Redraw</button>
      )}
    </header>
  );
}
