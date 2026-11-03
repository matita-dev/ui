import React from 'react';
import { Icon } from '../core/Icon.jsx';
export const Input=React.forwardRef(function Input({label,hint,error,icon,suffix,size='md',value,defaultValue,placeholder,type='text',disabled=false,onChange,className,style,...rest},ref){
  const [f,setF]=React.useState(false);const mid=React.useId();
  const h=size==='sm'?32:size==='lg'?48:40;
  const bc=error?'var(--red-500)':f?'var(--blue-500)':'var(--line-1)';
  return <label className={className} style={{display:'flex',flexDirection:'column',gap:8,minWidth:0,...style}}>
    {label&&<span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{label}</span>}
    <span data-pencil={error?'box-red':f?'box-blue':'box-light'} style={{display:'flex',alignItems:'center',gap:8,height:h,padding:'0 12px',background:disabled?'var(--paper-2)':'var(--paper-0)',
      border:'var(--stroke-frame) solid '+bc,borderRadius:'var(--radius-control)',boxShadow:f?'0 0 0 3px var(--blue-100)':'none',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)',opacity:disabled?.6:1}}>
      {icon&&<Icon name={icon} size={16} color="var(--ink-3)"/>}
      <input ref={ref} aria-invalid={error?true:undefined} aria-describedby={error||hint?mid:undefined} type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} onChange={onChange}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)} {...rest}
        style={{flex:1,minWidth:0,height:'100%',border:0,outline:0,background:'transparent',font:'var(--fw-regular) 14px/1 var(--font-sans)',color:'var(--text-primary)',boxShadow:'none'}}/>
      {suffix&&<span style={{font:'var(--fw-regular) 12px/1 var(--font-mono)',color:'var(--text-faint)'}}>{suffix}</span>}
    </span>
    {(error||hint)&&<span id={mid} role={error?'alert':undefined} style={{font:'var(--fw-regular) 12px/1.4 var(--font-sans)',color:error?'var(--red-600)':'var(--text-muted)'}}>{error||hint}</span>}
  </label>;
});
