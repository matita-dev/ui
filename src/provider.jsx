import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* Look settings. They flow from the provider down; any component can override them for itself and its children
   with the same names as props (see withScope). `mode`: ink, pencil, blueprint or auto (ink by day, blueprint when the
   system is dark). `grid`: none, lines or dots. `stroke`: line thickness multiplier. `rough`: 0 = clean lines, above 0 = the hand. */
export const MODES = ['ink', 'pencil', 'blueprint', 'auto'];
export const GRIDS = ['none', 'lines', 'dots'];
export const DEFAULTS = { mode: 'ink', grid: 'none', gridSize: 24, stroke: 1.6, rough: 1 };

const Ctx = createContext({ ...DEFAULTS, set: () => {} });

const pick = (v, list, fallback) => (list.includes(v) ? v : fallback);
const clean = c => ({
  mode: pick(c.mode, MODES, DEFAULTS.mode), grid: pick(c.grid, GRIDS, DEFAULTS.grid),
  gridSize: Math.max(8, Number(c.gridSize) || DEFAULTS.gridSize),
  stroke: Math.min(4, Math.max(0.5, Number(c.stroke) || DEFAULTS.stroke)),
  rough: Math.min(1, Math.max(0, Number(c.rough ?? DEFAULTS.rough))),
});

/** Theme provider and the page surface: paper, optional construction grid, and the settings for every component below.
    Props set the starting values; `useMatita().set({ mode: 'pencil' })` (or the Tweaks bar) changes them later. */
export function MatitaProvider({ mode, grid, gridSize, stroke, rough, style, className = '', children, ...rest }) {
  const [cfg, setCfg] = useState(() => clean({ mode, grid, gridSize, stroke, rough }));
  useEffect(() => { setCfg(clean({ mode, grid, gridSize, stroke, rough })); }, [mode, grid, gridSize, stroke, rough]);
  const set = useCallback(patch => setCfg(c => clean({ ...c, ...patch })), []);
  const value = useMemo(() => ({ ...cfg, set }), [cfg, set]);
  return (
    <Ctx.Provider value={value}>
      <div className={'m-root ' + className} data-mode={cfg.mode} data-grid={cfg.grid}
        style={{ '--m-stroke': cfg.stroke, '--m-grid-size': cfg.gridSize + 'px', ...style }} {...rest}>{children}</div>
    </Ctx.Provider>
  );
}

/** Override `mode`, `stroke` and/or `rough` for the children only. It adds no box of its own. */
export function Scope({ mode, stroke, rough, children }) {
  const parent = useContext(Ctx);
  const value = useMemo(() => {
    const c = clean({ ...parent, ...(mode !== undefined && { mode }), ...(stroke !== undefined && { stroke }), ...(rough !== undefined && { rough }) });
    return { ...parent, ...c };
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
