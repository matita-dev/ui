import React from 'react';
import { Icon } from '../core/Icon.jsx';
export const Checkbox=React.forwardRef(function Checkbox({label,checked,defaultChecked=false,onChange,disabled=false,className,style},ref){
  const [inner,setInner]=React.useState(defaultChecked);const on=checked??inner;
  const t=()=>{if(disabled)return;const n=!on;setInner(n);onChange&&onChange(n)};
  return <label ref={ref} className={className} onClick={e=>{e.preventDefault();t()}} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,font:'var(--fw-regular) 14px/1.3 var(--font-sans)',color:'var(--text-primary)',...style}}>
    <span role="checkbox" aria-checked={on} data-pencil={on?'shade box':'box-light'} style={{width:16,height:16,flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',
      background:on?'var(--ink-1)':'var(--paper-0)',border:'var(--stroke-frame) solid '+(on?'var(--ink-1)':'var(--ink-4)'),borderRadius:'var(--radius-1)',transition:'background var(--dur-fast)'}}>
      {on&&<Icon name="check" size={12} color="var(--paper-0)"/>}
    </span>{label}
  </label>;
});
