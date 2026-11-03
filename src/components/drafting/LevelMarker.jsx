import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export const LevelMarker=React.forwardRef(function LevelMarker({value,label,length=72,tone='ink',className,style},ref){
  const c=tone==='blue'?'var(--blue-500)':'var(--ink-1)';
  return <div ref={ref} className={className} style={{display:'inline-flex',alignItems:'flex-end',gap:8,color:c,...style}}>
    <div style={{position:'relative',width:length,height:12}}>
      <span data-pencil="h" style={{position:'absolute',left:0,right:0,bottom:0,height:1,background:'currentColor',...drawAnim('h',300)}}/>
      <svg data-pencil="svg" width="12" height="10" viewBox="0 0 12 10" style={{position:'absolute',left:length*.35,bottom:1}}><path d="M0 0H12L6 10Z" fill="currentColor"/></svg>
    </div>
    <span style={{display:'flex',flexDirection:'column',gap:3,paddingBottom:0}}>
      {label&&<span style={{font:'var(--fw-medium) 9.5px/1 var(--font-sans)',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-3)'}}>{label}</span>}
      <span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)'}}>{value}</span>
    </span>
  </div>;
});
