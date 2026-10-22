import React from 'react';
export function Switch({label,checked,defaultChecked=false,onChange,disabled=false,style}){
  const [inner,setInner]=React.useState(defaultChecked);const on=checked??inner;
  const t=()=>{if(disabled)return;setInner(!on);onChange&&onChange(!on)};
  return <label onClick={t} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,font:'var(--fw-regular) 14px/1.3 var(--font-sans)',color:'var(--text-primary)',...style}}>
    <span role="switch" aria-checked={on} data-pencil={on?'shade box':'tint box-light'} style={{position:'relative',width:34,height:18,flex:'none',background:on?'var(--blue-500)':'var(--paper-3)',border:'1px solid '+(on?'var(--blue-500)':'var(--line-1)'),borderRadius:'var(--radius-1)',transition:'background var(--dur-base) var(--ease-draft)'}}>
      <span data-pencil={on?'tint':'shade'} style={{position:'absolute',top:2,left:on?18:2,width:12,height:12,background:on?'var(--text-on-accent)':'var(--ink-1)',borderRadius:1,transition:'left var(--dur-base) var(--ease-draft)'}}/>
    </span>{label}
  </label>;
}
