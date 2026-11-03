import React from 'react';
import { CornerMarks } from './CornerMarks.jsx';
export const Frame=React.forwardRef(function Frame({label,meta,children,marks=true,dashed=false,hatch=false,padding=40,tone='ink',className,style},ref){
  const c=tone==='blue'?'var(--blue-500)':'var(--ink-1)';
  const bd=tone==='blue'?'var(--line-blue)':'var(--line-1)';
  const tab={position:'absolute',top:-7,zIndex:2,background:'var(--surface-page)',padding:'0 8px',font:'var(--fw-medium) 11px/14px var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase'};
  return <section ref={ref} className={className} data-pencil={marks?undefined:dashed?'box-light dashed':'box-light'} style={{position:'relative',border:marks?'0':'1px '+(dashed?'dashed':'solid')+' '+bd,padding,
    backgroundImage:hatch?'var(--hatch-45)':'none',...style}}>
    {marks&&<CornerMarks color={c} dashed={dashed}/>}
    {label&&<span style={{...tab,left:16,color:c}}>{label}</span>}
    {meta&&<span style={{...tab,right:16,color:'var(--text-muted)'}}>{meta}</span>}
    {children}
  </section>;
});
