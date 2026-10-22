import { useId } from 'react';
import { GRIDS, MODES, useMatita } from './provider.jsx';
import { Sketch } from './sketch.jsx';

const LABELS = { ink: 'Ink', pencil: 'Pencil', blueprint: 'Blueprint', none: 'None', lines: 'Lines', dots: 'Dots', sketchy: 'Sketchy', clean: 'Clean', auto: 'Auto' };

function Segmented({ label, value, options, onChange }) {
  const id = useId();
  return (
    <div className="m-tw-group" role="group" aria-labelledby={id}>
      <span className="m-tw-label" id={id}>{label}</span>
      <div className="m-seg">
        <Sketch />
        {options.map(o => (
          <button key={o} type="button" className="m-seg-opt" aria-pressed={value === o} onClick={() => onChange(o)}>{LABELS[o] || o}</button>
        ))}
      </div>
    </div>
  );
}

function Range({ label, value, min, max, step, format, onChange }) {
  const id = useId();
  return (
    <label className="m-tw-group" htmlFor={id}>
      <span className="m-tw-label">{label}</span>
      <span className="m-tw-range">
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
        <output className="m-tw-value">{format(value)}</output>
      </span>
    </label>
  );
}

/** A header bar that edits the provider's look live: mode, grid, line thickness, and roughness.
    `controls` picks which ones to show. It changes the nearest MatitaProvider, so the whole system follows. */
export function Tweaks({ controls = ['mode', 'grid', 'stroke', 'rough'], title = 'Tweaks', sticky = true, className = '', ...rest }) {
  const { mode, grid, stroke, rough, roughSetting, set } = useMatita();
  const has = c => controls.includes(c);
  return (
    <header className={`m-tweaks ${sticky ? 'm-tweaks--sticky' : ''} ${className}`} {...rest}>
      <span className="m-tweaks-rule" aria-hidden="true"><Sketch shape="line" /></span>
      <span className="m-tw-title">{title}</span>
      {has('mode') && <Segmented label="Mode" value={mode} options={MODES} onChange={v => set({ mode: v, stroke: null })} />}
      {has('grid') && <Segmented label="Grid" value={grid} options={GRIDS} onChange={v => set({ grid: v })} />}
      {has('stroke') && <Range label="Line" value={stroke} min={0.6} max={3} step={0.1} format={v => v.toFixed(1)} onChange={v => set({ stroke: v })} />}
      {has('rough') && <Segmented label="Hand" value={roughSetting === null ? 'auto' : roughSetting ? 'sketchy' : 'clean'} options={['auto', 'sketchy', 'clean']} onChange={v => set({ rough: v === 'auto' ? null : v === 'sketchy' ? 1 : 0 })} />}
    </header>
  );
}
