import { useState } from 'react';

/** A data table on plain table markup, ruled with hairlines. `columns`: { key, label, align, width, mono, nowrap, render }.
    `variant="schedule"` is the dense drawing-schedule look (dotted rules, mono key column). Rows highlight on hover;
    give `onRowClick` to make them clickable, or `activeKey` to drive the highlight yourself. */
export function Table({ columns = [], rows = [], rowKey = 'id', variant = 'default', activeKey, onRowHover, onRowClick, footer, caption, className = '', ...rest }) {
  const [hov, setHov] = useState(null), act = activeKey !== undefined ? activeKey : hov;
  const set = k => { setHov(k); onRowHover?.(k); };
  return (
    <table className={`m-table m-table--${variant} ${className}`} {...rest}>
      {caption && <caption>{caption}</caption>}
      <thead><tr>{columns.map(c => <th key={c.key} scope="col" style={{ textAlign: c.align, width: c.width }}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, ri) => {
          const k = r[rowKey] ?? ri;
          return (
            <tr key={k} className={(act === k ? 'is-active ' : '') + (onRowClick ? 'is-click' : '')}
              onMouseEnter={() => set(k)} onMouseLeave={() => set(null)} onClick={onRowClick ? () => onRowClick(r) : undefined}>
              {columns.map((c, i) => <td key={c.key} className={c.mono || (variant === 'schedule' && i === 0) ? 'is-mono' : ''} style={{ textAlign: c.align, whiteSpace: c.nowrap ? 'nowrap' : undefined }}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          );
        })}
      </tbody>
      {footer && <tfoot>{footer.map((f, fi) => <tr key={fi}>{f.map((v, i) => <td key={i} className={columns[i]?.mono ? 'is-mono' : ''} style={{ textAlign: columns[i]?.align }}>{v}</td>)}</tr>)}</tfoot>}
    </table>
  );
}
