import React from 'react';
const P={diagonal:'var(--hatch-45)',dense:'var(--hatch-45-dense)',cross:'var(--hatch-cross)',blue:'var(--hatch-blue)',grid:'var(--pattern-grid)',dots:'var(--pattern-dots)',earth:'var(--hatch-earth)',gravel:'var(--pattern-gravel)',poche:'none'};
export const Hatch=React.forwardRef(function Hatch({pattern='diagonal',ratio,height,label,bordered=true,children,className,style},ref){
  const sized=pattern==='grid'||pattern==='dots';const poche=pattern==='poche';
  return <div ref={ref} className={className} data-pencil={[bordered&&'box-light',poche&&'clear'].filter(Boolean).join(' ')||undefined} style={{position:'relative',isolation:'isolate',display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:ratio,height,
    backgroundColor:poche?'var(--fill-poche)':'var(--surface-card)',border:bordered?'var(--stroke-frame) solid var(--line-1)':'none',...style}}>
    <span aria-hidden="true" data-pencil="hatch" data-hatch={P[pattern]?pattern:'diagonal'} style={{position:'absolute',inset:0,zIndex:-1,pointerEvents:'none',backgroundImage:P[pattern]||P.diagonal,
      backgroundSize:sized?'var(--pattern-grid-size)':pattern==='gravel'?'var(--pattern-gravel-size)':undefined}}/>
    {label&&<span data-pencil="box-light" style={{background:'var(--surface-card)',padding:'4px 8px',border:'var(--stroke-frame) solid var(--line-1)',font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:pattern==='blue'?'var(--blue-600)':'var(--text-muted)'}}>{label}</span>}
    {children}
  </div>;
});
