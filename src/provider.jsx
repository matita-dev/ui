import React from 'react';
import { DrawingMode } from './drawing.jsx';

/* The look settings every component follows. There is one switch, `mode`: ink and blueprint are always clean, pencil is
   the hand-drawn one (as in the Drafting Grid Design System). `grid` adds the construction grid behind the page. */
export const MODES = ['ink', 'pencil', 'blueprint'];
export const GRIDS = ['none', 'lines', 'dots'];
const pick = (v, list, fallback) => (list.includes(v) ? v : fallback);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(Number(v)) ? Number(v) : 1));
const Ctx = React.createContext({ mode: 'ink', grid: 'none', roughness: 1, lineWeight: 1, set: () => {}, redraw: () => {} });

/** Theme provider and page surface. Props set the starting values; `useMatita().set({ mode: 'pencil' })` (or the Tweaks bar)
    changes them later, and `redraw()` re-drafts the pencil linework. `roughness` (0 to 1) is how loose the pencil hand is and `lineWeight` (0.5 to 3) how heavy its lines are; both can also be set later
    and apply to pencil only (ink and blueprint stay clean hairlines). */
export function MatitaProvider({ mode = 'ink', grid = 'none', roughness = 1, lineWeight = 1, animate = true, drawOnMount = false, lettering = 'hand', className = '', children, ...rest }) {
  const start = () => ({ mode: pick(mode, MODES, 'ink'), grid: pick(grid, GRIDS, 'none'), roughness: clamp(roughness, 0, 1), lineWeight: clamp(lineWeight, 0.5, 3) });
  const [cfg, setCfg] = React.useState(start);
  const [key, setKey] = React.useState(0);
  React.useEffect(() => { setCfg(start()); }, [mode, grid, roughness, lineWeight]);
  const set = React.useCallback(patch => setCfg(c => ({ mode: pick(patch.mode ?? c.mode, MODES, c.mode), grid: pick(patch.grid ?? c.grid, GRIDS, c.grid), roughness: clamp(patch.roughness ?? c.roughness, 0, 1), lineWeight: clamp(patch.lineWeight ?? c.lineWeight, 0.5, 3) })), []);
  const redraw = React.useCallback(() => setKey(k => k + 1), []);
  const value = React.useMemo(() => ({ ...cfg, set, redraw }), [cfg, set, redraw]);
  return (
    <Ctx.Provider value={value}>
      <DrawingMode mode={cfg.mode} drawKey={key} roughness={cfg.roughness} lineWeight={cfg.lineWeight} animate={animate} drawOnMount={drawOnMount} lettering={lettering}
        className={'m-root ' + className} data-grid={cfg.grid} {...rest}>{children}</DrawingMode>
    </Ctx.Provider>
  );
}

/** Give the children their own mode (ink, pencil or blueprint) inside the current page. It adds no box of its own. */
export function Scope({ mode = 'ink', children }) {
  return <DrawingMode mode={mode} animate={false} className="m-scope" style={{ minHeight: 0 }}>{children}</DrawingMode>;
}

/** Give a component a `mode` attribute: it renders in its own scope. Without it the component renders as is. */
export function withScope(Component) {
  const Scoped = ({ mode, ...props }) => (mode === undefined ? <Component {...props} /> : <Scope mode={mode}><Component {...props} /></Scope>);
  Scoped.displayName = Component.displayName || Component.name;
  return Scoped;
}

export const useMatita = () => React.useContext(Ctx);
