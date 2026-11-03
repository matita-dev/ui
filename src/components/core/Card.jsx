import React from 'react';
import { CornerMarks } from '../drafting/CornerMarks.jsx';
export function Card({eyebrow,title,children,media,footer,marks=false,interactive=false,href,padding=24,style}){
  const [hov,setHov]=React.useState(false);
  const Tag=href?'a':'div';const on=interactive&&hov;
  return <Tag data-pencil={marks?undefined:on?'box':'box-light'} href={href} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{position:'relative',display:'flex',flexDirection:'column',background:'var(--surface-card)',color:'inherit',textDecoration:'none',
    border:marks?'0':'var(--stroke-frame) solid '+(on?'var(--ink-1)':'var(--line-1)'),borderRadius:marks?0:'var(--radius-card)',
    transform:on?'translate(-2px,-2px)':'none',boxShadow:on?'var(--shadow-plate)':'none',cursor:interactive?'pointer':'default',
    transition:'transform var(--dur-base) var(--ease-draft),box-shadow var(--dur-base) var(--ease-draft),border-color var(--dur-fast)',...style}}>
    {marks&&<CornerMarks color={on?'var(--ink-1)':'var(--ink-2)'} overshoot={on?'top-left':'all'}/>}
    {media&&<div data-pencil="rule-b rule-light" style={{borderBottom:'var(--stroke-frame) solid var(--line-1)'}}>{media}</div>}
    <div style={{padding,display:'flex',flexDirection:'column',gap:10,flex:1}}>
      {eyebrow&&<div style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{eyebrow}</div>}
      {title&&<h3 style={{margin:0,font:'var(--fw-medium) 20px/1.25 var(--font-sans)',letterSpacing:'-0.015em',color:'var(--text-primary)'}}>{title}</h3>}
      {children&&<div style={{font:'var(--fw-regular) 15px/1.55 var(--font-sans)',color:'var(--text-body)'}}>{children}</div>}
    </div>
    {footer&&<div data-pencil="rule-t rule-light dashed" style={{padding:'12px '+padding+'px',borderTop:'var(--stroke-frame) dashed var(--line-1)',display:'flex',alignItems:'center',gap:12,font:'var(--fw-regular) 12px/1 var(--font-mono)',color:'var(--text-muted)'}}>{footer}</div>}
  </Tag>;
}
