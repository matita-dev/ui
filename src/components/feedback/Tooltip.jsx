import React from 'react';
export const Tooltip=React.forwardRef(function Tooltip({content,side='top',open,children,className},ref){
  const [h,setH]=React.useState(false);const show=open??h;
  const top=side==='top';
  return <span ref={ref} className={className} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{position:'relative',display:'inline-flex'}}>
    {children}
    {show&&<span role="tooltip" data-pencil="shade" style={{position:'absolute',left:'50%',transform:'translateX(-50%)',[top?'bottom':'top']:'calc(100% + 8px)',zIndex:'var(--z-overlay)',
      background:'var(--ink-1)',color:'var(--paper-0)',padding:'6px 8px',borderRadius:'var(--radius-1)',whiteSpace:'nowrap',pointerEvents:'none',
      font:'var(--fw-regular) 11px/1.2 var(--font-mono)',letterSpacing:'0.02em'}}>
      {content}
      <span data-pencil="v" style={{position:'absolute',left:'50%',[top?'top':'bottom']:'100%',width:1,height:8,background:'var(--ink-1)'}}/>
    </span>}
  </span>;
});
