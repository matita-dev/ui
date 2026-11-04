import React from 'react';
import { Icon } from './Icon.jsx';
export const Tag=React.forwardRef(function Tag({children,selected=false,onClick,onRemove,className,style},ref){
  const [hov,setHov]=React.useState(false);
  return <span ref={ref} className={className} data-pencil={selected?'shade box':hov&&onClick?'box':'box-light dashed'} onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{display:'inline-flex',alignItems:'center',gap:6,height:28,padding:onRemove?'0 6px 0 10px':'0 10px',
    background:selected?'var(--ink-1)':'var(--paper-0)',color:selected?'var(--paper-0)':'var(--ink-2)',
    border:'1px '+(selected?'solid var(--ink-1)':(hov&&onClick?'solid var(--ink-1)':'dashed var(--line-1)')),borderRadius:'var(--radius-1)',
    font:'var(--fw-regular) 13px/1 var(--font-sans)',cursor:onClick?'pointer':'default',userSelect:'none',whiteSpace:'nowrap',...style}}>
    {children}
    {onRemove&&<span role="button" aria-label="Remove" onClick={e=>{e.stopPropagation();onRemove()}} style={{display:'inline-flex',cursor:'pointer',opacity:.7}}><Icon name="x" size={12}/></span>}
  </span>;
});
