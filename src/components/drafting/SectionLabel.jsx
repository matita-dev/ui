import React from 'react';
export function SectionLabel({index,children,rule=false,tone='muted',style}){
  const c=tone==='accent'?'var(--blue-500)':tone==='ink'?'var(--ink-1)':'var(--text-muted)';
  return <div style={{display:'flex',alignItems:'center',gap:10,font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:c,...style}}>
    {index!=null&&<span style={{color:'var(--blue-500)'}}>{index}</span>}
    {index!=null&&<span data-pencil="h-flow" style={{width:16,height:1,background:'currentColor',opacity:.6}}/>}
    <span>{children}</span>
    {rule&&<span data-pencil="h-flow" style={{flex:1,height:1,background:'var(--guide-h)',minWidth:24}}/>}
  </div>;
}
