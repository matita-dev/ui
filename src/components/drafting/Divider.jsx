import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export function Divider({variant='solid',label,style}){
  const line={flex:1,height:1,background:variant==='dashed'?'var(--guide-h)':variant==='strong'?'var(--ink-1)':'var(--line-1)',...drawAnim('h',260)};
  if(!label) return <div role="separator" data-pencil="h-flow" style={{...line,width:'100%',...style}}/>;
  return <div role="separator" style={{display:'flex',alignItems:'center',gap:12,...style}}>
    <span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{label}</span><span data-pencil="h-flow" style={line}/>
  </div>;
}
