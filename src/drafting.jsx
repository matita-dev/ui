import { useId, useMemo } from 'react';
import { useMatita } from './provider.jsx';
import { Sketch } from './sketch.jsx';
import { drawLines } from './rough.js';

/* The Drafting Grid motifs as primitives: framed sections, registration marks, hatch fills, section labels,
   dimension lines and callout balloons. Linework is drawn by the same pen as the controls; printed patterns
   (hatches, grids) stay crisp, as in the design system. `tone`: ink (default), blue or red (review marks only). */

/** A small fixed-size drawing (arrowheads, ticks, crosses) made of line primitives. */
function Pen({ src, size, seed = 0, exact = false, className = '' }) {
  const ctx = useMatita(), key = useId(), rough = exact ? 0 : ctx.rough;
  const strokes = useMemo(() => drawLines(src, key, seed, rough), [src, key, seed, rough]);
  const [w, h] = size;
  return (
    <svg className={'m-pen ' + className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {strokes.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w * ctx.stroke * (rough ? 0.75 : 1)} />)}
    </svg>
  );
}

/** Registration marks at the four corners of the (relatively positioned) parent. `variant="cross"`: a cross on each corner
    (lines overshoot it). `variant="ticks"`: detached ticks sitting outside the corner, `gap` away from it, for a box
    that already has its own border. In clean modes the ticks and the border are exact and sit on the same lines at the same thickness; in sketchy modes both are drawn by hand. */
export function CornerMarks({ variant = 'cross', size = 10, gap = 8, tone = 'ink', className = '' }) {
  const ticks = variant === 'ticks', c = size, R = size + gap, s = ticks ? R : size * 2;
  const cross = `L 0 ${c} ${s} ${c}; L ${c} 0 ${c} ${s}`;
  const tick = [ // [corner is bottom-right, bottom-left, top-right, top-left] of each tile: a vertical and a horizontal tick
    `L ${R} 0 ${R} ${size}; L 0 ${R} ${size} ${R}`, `L 0 0 0 ${size}; L ${R - size} ${R} ${R} ${R}`,
    `L ${R} ${R - size} ${R} ${R}; L 0 0 ${size} 0`, `L 0 ${R - size} 0 ${R}; L ${R - size} 0 ${R} 0`,
  ];
  const at = (x, y, i) => {
    const o = ticks ? R : c;
    return <span key={i} className="m-mark" style={{ left: x ? 'auto' : -o, right: x ? -o : 'auto', top: y ? 'auto' : -o, bottom: y ? -o : 'auto', width: s, height: s }}>
      <Pen src={ticks ? tick[y * 2 + x] : cross} size={[s, s]} seed={i} />
    </span>;
  };
  return <span className={`m-marks m-tone--${tone} ${className}`} aria-hidden="true">{[at(0, 0, 0), at(1, 0, 1), at(0, 1, 2), at(1, 1, 3)]}</span>;
}

/** A framed section: a drawn border with paper behind, and optional mono title-block tabs sitting on the top edge.
    `label` goes left, `meta` right. `marks` (true or "cross") draws the four border lines running past the corners, no extra lines; `marks="ticks"` keeps a plain border and adds detached ticks outside each corner. `hatch` fills the panel with a 45° hatch, `dashed` draws the border as a guide. */
export function Frame({ as: Tag = 'section', label, meta, marks = false, dashed = false, hatch = false, tone = 'ink', className = '', children, ...rest }) {
  return (
    <Tag className={`m-frame m-tone--${tone} ${hatch ? 'm-frame--hatch ' : ''}${className}`} {...rest}>
      <Sketch fill dashed={dashed} shape={marks === true || marks === 'cross' ? (dashed ? 'rect' : 'marks') : 'rect'} />
      {label && <span className="m-frame-tab m-frame-tab--label">{label}</span>}
      {meta && <span className="m-frame-tab m-frame-tab--meta">{meta}</span>}
      {marks === 'ticks' && <CornerMarks variant="ticks" tone={tone} />}
      <div className="m-frame-body">{children}</div>
    </Tag>
  );
}

const HATCHES = ['diagonal', 'dense', 'cross', 'blue', 'grid', 'dots', 'earth', 'gravel', 'poche'];

/** A patterned panel for voids, placeholders and call-outs. `pattern`: diagonal, dense, cross, blue, grid, dots,
    earth, gravel (architectural fills) or poche (a solid cut). `label` is a mono chip, e.g. "IMG 16:9". */
export function Hatch({ pattern = 'diagonal', label, bordered = true, className = '', style, children, ...rest }) {
  const p = HATCHES.includes(pattern) ? pattern : 'diagonal';
  return (
    <div className={`m-hatch m-hatch--${p} ${className}`} style={style} {...rest}>
      {bordered && <Sketch />}
      {label && <span className="m-hatch-label">{label}</span>}
      {children}
    </div>
  );
}

/** Mono eyebrow: `index` in blue, a short rule, the label, and optionally a dashed rule running to the edge. */
export function SectionLabel({ index, rule = false, tone = 'muted', className = '', children, ...rest }) {
  return (
    <div className={`m-sl m-sl--${tone} ${className}`} {...rest}>
      {index != null && <span className="m-sl-index">{index}</span>}
      {index != null && <span className="m-sl-dash" aria-hidden="true"><Sketch shape="line" /></span>}
      <span>{children}</span>
      {rule && <span className="m-sl-rule" aria-hidden="true"><Sketch shape="line" dashed /></span>}
    </div>
  );
}

/** A dimension line: end ticks, arrowheads and a mono label in the middle. Aligns to a real edge; use one or two a view. */
export function Dimension({ label, orientation = 'horizontal', tone = 'muted', length, className = '', style, ...rest }) {
  const V = orientation === 'vertical';
  const tick = V ? <Pen src="L 0 0.5 9 0.5" size={[9, 1]} /> : <Pen src="L 0.5 0 0.5 9" size={[1, 9]} />;
  const head = (back) => V
    ? <Pen src={back ? 'P 0 7 3.5 0 7 7' : 'P 0 0 3.5 7 7 0'} size={[7, 7]} />
    : <Pen src={back ? 'P 7 0 0 3.5 7 7' : 'P 0 0 7 3.5 0 7'} size={[7, 7]} />;
  const line = <span className="m-dim-line"><Sketch shape={V ? 'vline' : 'line'} /></span>;
  return (
    <div role="img" aria-label={label ? `Dimension ${label}` : 'Dimension'} className={`m-dim m-dim--${V ? 'v' : 'h'} m-tone--${tone} ${className}`}
      style={{ [V ? 'height' : 'width']: length ?? '100%', ...style }} {...rest}>
      {tick}{head(true)}{line}{label && <span className="m-dim-label">{label}</span>}{label && line}{head(false)}{tick}
    </div>
  );
}

/** A numbered balloon with optional leader line, title and note. `tone="red"` is for review marks. */
export function Callout({ n, title, tone = 'ink', leader = false, className = '', children, ...rest }) {
  return (
    <div className={`m-callout m-tone--${tone} ${className}`} {...rest}>
      <span className="m-callout-pin">
        <span className="m-callout-ring"><Sketch shape="ellipse" fill /><span className="m-callout-n">{n}</span></span>
        {leader && <span className="m-callout-leader" aria-hidden="true"><Sketch shape="line" /></span>}
      </span>
      <div className="m-callout-text">
        {title && <div className="m-callout-title">{title}</div>}
        {children && <div className="m-callout-note">{children}</div>}
      </div>
    </div>
  );
}
