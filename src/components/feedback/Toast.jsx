import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T={info:['info','var(--blue-500)'],success:['circle-check','var(--green-500)'],warning:['triangle-alert','var(--amber-500)'],danger:['circle-alert','var(--red-500)']};
export const Toast=React.forwardRef(function Toast({tone='info',title,children,action,onClose,className,style},ref){
  const [ic,c]=T[tone]||T.info;
  return <div ref={ref} className={className} role="status" data-pencil="box" style={{display:'flex',alignItems:'flex-start',gap:12,width:'min(360px,100%)',padding:'14px 14px 14px 16px',background:'var(--paper-0)',border:'var(--stroke-frame) solid var(--ink-1)',boxShadow:'var(--shadow-overlay)',...style}}>
    <Icon name={ic} size={16} color={c} style={{marginTop:2}}/>
    <div style={{flex:1,display:'flex',flexDirection:'column',gap:4,minWidth:0}}>
      {title&&<div style={{font:'var(--fw-medium) 14px/1.35 var(--font-sans)',color:'var(--ink-1)'}}>{title}</div>}
      {children&&<div style={{font:'var(--fw-regular) 13px/1.5 var(--font-sans)',color:'var(--text-muted)'}}>{children}</div>}
      {action&&<div style={{marginTop:6}}>{action}</div>}
    </div>
    {onClose&&<button aria-label="Dismiss" onClick={onClose} style={{border:0,background:'transparent',padding:2,cursor:'pointer',color:'var(--ink-3)',display:'inline-flex'}}><Icon name="x" size={14}/></button>}
  </div>;
});
