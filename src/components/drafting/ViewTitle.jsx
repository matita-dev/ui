import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export const ViewTitle=React.forwardRef(function ViewTitle({number,title,scale,className,style},ref){
  return <div ref={ref} className={className} style={{display:'flex',alignItems:'center',gap:12,color:'var(--ink-1)',...style}}>
    <span style={{position:'relative',width:26,height:26,flex:'none',display:'grid',placeItems:'center',font:'var(--fw-medium) 11px/1 var(--font-sans)'}}>
      <svg data-pencil="svg" width="26" height="26" viewBox="0 0 26 26" style={{position:'absolute',inset:0}}><circle cx="13" cy="13" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" pathLength={1} style={drawAnim('s',500)}/></svg>{number}
    </span>
    <span style={{font:'var(--fw-semibold,600) 15px/1 var(--font-sans)',letterSpacing:'.2em',textTransform:'uppercase'}}>{title}</span>
    {scale&&<span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)',letterSpacing:'.06em',color:'var(--ink-3)',textTransform:'uppercase'}}>{scale}</span>}
  </div>;
});
