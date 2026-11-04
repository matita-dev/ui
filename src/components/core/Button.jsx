import React from 'react';
import { Icon } from './Icon.jsx';
const SIZES={sm:{h:32,px:12,fs:13,ic:14},md:{h:40,px:16,fs:14,ic:16},lg:{h:48,px:22,fs:15,ic:16}};
const V={
  primary:{bg:'var(--ink-1)',fg:'var(--paper-0)',bd:'var(--ink-1)',plate:'var(--shadow-plate-blue)',pencil:'shade box'},
  accent:{bg:'var(--blue-500)',fg:'var(--text-on-accent)',bd:'var(--blue-500)',plate:'var(--shadow-plate)',pencil:'shade box'},
  secondary:{bg:'var(--paper-0)',fg:'var(--ink-1)',bd:'var(--ink-1)',plate:'var(--shadow-plate)',pencil:'box'},
  ghost:{bg:'transparent',fg:'var(--ink-1)',bd:'transparent',hbg:'var(--paper-2)'},
  link:{bg:'transparent',fg:'var(--blue-500)',bd:'transparent'}
};
export const Button=React.forwardRef(function Button({variant='primary',size='md',icon,iconRight,disabled=false,fullWidth=false,href,onClick,children,className,style,...rest},ref){
  const [hov,setHov]=React.useState(false);const [down,setDown]=React.useState(false);
  const s=SIZES[size]||SIZES.md;const v=V[variant]||V.primary;
  const lift=hov&&!down&&!disabled&&v.plate;
  const isLink=variant==='link';
  const st={display:fullWidth?'flex':'inline-flex',width:fullWidth?'100%':undefined,alignItems:'center',justifyContent:'center',gap:8,height:isLink?'auto':s.h,padding:isLink?0:'0 '+s.px+'px',
    font:'var(--fw-medium) '+s.fs+'px/1 var(--font-sans)',letterSpacing:'-0.005em',textDecoration:isLink&&hov?'underline':'none',textUnderlineOffset:3,
    background:hov&&v.hbg&&!disabled?v.hbg:v.bg,color:v.fg,border:'var(--stroke-frame) solid '+v.bd,borderRadius:'var(--radius-control)',cursor:disabled?'not-allowed':'pointer',
    opacity:disabled?.4:1,transform:lift?'translate(-2px,-2px)':'none',boxShadow:lift?v.plate:'none',
    transition:'transform var(--dur-fast) var(--ease-draft),box-shadow var(--dur-fast) var(--ease-draft),background var(--dur-fast)',whiteSpace:'nowrap',...style};
  const Tag=href?'a':'button';
  return <Tag ref={ref} className={className} data-pencil={v.pencil} href={href} onClick={disabled?undefined:onClick} disabled={Tag==='button'?disabled:undefined} style={st}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setDown(false)}} onMouseDown={()=>setDown(true)} onMouseUp={()=>setDown(false)} {...rest}>
    {icon&&<Icon name={icon} size={s.ic}/>}{children}{iconRight&&<Icon name={iconRight} size={s.ic}/>}
  </Tag>;
});
