import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* Look settings. They flow from the provider down; any component can override them for itself and its children
   with the same names as props (see withScope).
   `mode`: ink (clean 1px drawing), pencil (hand-drawn graphite), blueprint (clean, white on blue) or auto (ink by day,
   blueprint when the system is dark). `grid`: none, lines or dots.
   `rough` (0 = clean lines, 1 = the hand) and `stroke` (line thickness) follow the mode unless you set them:
   ink and blueprint draw clean 1px lines, pencil draws by hand. Any mode can be sketchy: set rough={1}. */
export const MODES = ['ink', 'pencil', 'blueprint', 'auto'];
export const GRIDS = ['none', 'lines', 'dots'];
export const DEFAULTS = { mode: 'ink', grid: 'none', gridSize: 24, stroke: null, rough: null };

const Ctx = createContext({ ...DEFAULTS, stroke: 1, rough: 0, strokeSetting: null, roughSetting: null, set: () => {} });

const pick = (v, list, fallback) => (list.includes(v) ? v : fallback);
const num = (v, lo, hi) => (v === null || v === undefined || v === 'auto' || Number.isNaN(Number(v)) ? null : Math.min(hi, Math.max(lo, Number(v))));
const clean = c => ({
  mode: pick(c.mode, MODES, DEFAULTS.mode), grid: pick(c.grid, GRIDS, DEFAULTS.grid),
  gridSize: Math.max(8, Number(c.gridSize) || DEFAULTS.gridSize),
  strokeSetting: num(c.strokeSetting, 0.5, 4), roughSetting: num(c.roughSetting, 0, 1),
});
/** The values components draw with: your setting, or the mode's own default. */
const resolve = c => ({ ...c, stroke: c.strokeSetting ?? (1), rough: c.roughSetting ?? (c.mode === 'pencil' ? 1 : 0) });

/** Theme provider and the page surface: paper, optional construction grid, and the settings for every component below.
    Props set the starting values; `useMatita().set({ mode: 'pencil' })` (or the Tweaks bar) changes them later.
    `set({ stroke: null })` or `set({ rough: null })` hands that setting back to the mode. */
export function MatitaProvider({ mode, grid, gridSize, stroke, rough, style, className = '', children, ...rest }) {
  const [cfg, setCfg] = useState(() => clean({ mode, grid, gridSize, strokeSetting: stroke, roughSetting: rough }));
  useEffect(() => { setCfg(clean({ mode, grid, gridSize, strokeSetting: stroke, roughSetting: rough })); }, [mode, grid, gridSize, stroke, rough]);
  const set = useCallback(({ stroke: s, rough: r, ...patch }) => setCfg(c => clean({
    ...c, ...patch, ...(s !== undefined && { strokeSetting: s }), ...(r !== undefined && { roughSetting: r }),
  })), []);
  const value = useMemo(() => ({ ...resolve(cfg), set }), [cfg, set]);
  return (
    <Ctx.Provider value={value}>
      <div className={'m-root ' + className} data-mode={cfg.mode} data-grid={cfg.grid}
        style={{ '--m-stroke': value.stroke, '--m-grid-size': cfg.gridSize + 'px', ...style }} {...rest}>{children}</div>
    </Ctx.Provider>
  );
}

/** Override `mode`, `stroke` and/or `rough` for the children only. It adds no box of its own. */
export function Scope({ mode, stroke, rough, children }) {
  const parent = useContext(Ctx);
  const value = useMemo(() => {
    const next = clean({
      mode: mode !== undefined ? mode : parent.mode, grid: parent.grid, gridSize: parent.gridSize,
      strokeSetting: stroke !== undefined ? stroke : parent.strokeSetting, roughSetting: rough !== undefined ? rough : parent.roughSetting,
    });
    return { ...parent, ...resolve(next) };
  }, [parent, mode, stroke, rough]);
  return (
    <Ctx.Provider value={value}>
      <div className="m-scope" data-mode={value.mode} style={{ '--m-stroke': value.stroke }}>{children}</div>
    </Ctx.Provider>
  );
}

/** Give a component the shared look attributes: `mode`, `stroke`, `rough` (own scope) and `grid` (passed to its root
    as data-grid, drawn by components that have a surface, e.g. Frame). Without them the component renders as is. */
export function withScope(Component) {
  const Scoped = ({ mode, stroke, rough, grid, ...props }) => {
    const inner = <Component {...props} {...(grid !== undefined && { 'data-grid': grid })} />;
    return mode === undefined && stroke === undefined && rough === undefined
      ? inner : <Scope mode={mode} stroke={stroke} rough={rough}>{inner}</Scope>;
  };
  Scoped.displayName = Component.displayName || Component.name;
  return Scoped;
}

export const useMatita = () => useContext(Ctx);
