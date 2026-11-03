import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({icon,label,variant='secondary',size='md',disabled=false,onClick,style,...rest}){
  const [hov,setHov]=React.useState(false);
  const d=size==='sm'?32:40;
  const V={primary:{bg:'var(--ink-1)',fg:'var(--paper-0)',bd:'var(--ink-1)'},secondary:{bg:'var(--paper-0)',fg:'var(--ink-1)',bd:'var(--line-1)'},ghost:{bg:hov?'var(--paper-2)':'transparent',fg:'var(--ink-1)',bd:'transparent'}}[variant];
  return <button data-pencil={variant==='primary'?'shade box':variant==='secondary'?(hov?'box':'box-light'):undefined} aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{width:d,height:d,display:'inline-flex',alignItems:'center',justifyContent:'center',padding:0,background:V.bg,color:V.fg,
    border:'1px solid '+(variant==='secondary'&&hov?'var(--ink-1)':V.bd),borderRadius:'var(--radius-control)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,
    transition:'border-color var(--dur-fast),background var(--dur-fast)',...style}} {...rest}>
    <Icon name={icon} size={size==='sm'?14:16}/>
  </button>;
}
