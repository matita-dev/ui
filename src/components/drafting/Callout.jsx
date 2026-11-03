import React from 'react';
export const Callout=React.forwardRef(function Callout({n,title,children,tone='ink',leader=false,className,style},ref){
  const c=tone==='blue'?'var(--blue-500)':tone==='red'?'var(--red-500)':'var(--ink-1)';
  return <div ref={ref} className={className} style={{display:'flex',alignItems:'flex-start',gap:12,...style}}>
    <span style={{display:'flex',alignItems:'center',flex:'none',paddingTop:1}}>
      <span data-pencil={'ring'+(tone==='blue'?' blue':tone==='red'?' red':'')} style={{width:22,height:22,borderRadius:'50%',border:'var(--stroke-frame) solid '+c,color:c,display:'inline-flex',alignItems:'center',justifyContent:'center',font:'var(--fw-medium) 11px/1 var(--font-mono)',background:'var(--surface-card)'}}>{n}</span>
      {leader&&<span data-pencil="h-flow" style={{width:28,height:1,background:c}}/>}
    </span>
    <div style={{display:'flex',flexDirection:'column',gap:4,minWidth:0}}>
      {title&&<div style={{font:'var(--fw-medium) 15px/1.3 var(--font-sans)',color:'var(--text-primary)'}}>{title}</div>}
      {children&&<div style={{font:'var(--fw-regular) 14px/1.55 var(--font-sans)',color:'var(--text-muted)'}}>{children}</div>}
    </div>
  </div>;
});
