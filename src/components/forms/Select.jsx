import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({label,options=[],value,defaultValue,onChange,disabled=false,style}){
  const [f,setF]=React.useState(false);
  return <label style={{display:'flex',flexDirection:'column',gap:8,minWidth:0,...style}}>
    {label&&<span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{label}</span>}
    <span style={{position:'relative',display:'flex'}}>
      <select data-pencil={f?'box-blue':'box-light'} value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{appearance:'none',WebkitAppearance:'none',width:'100%',height:40,padding:'0 36px 0 12px',background:'var(--paper-0)',border:'var(--stroke-frame) solid '+(f?'var(--blue-500)':'var(--line-1)'),
        borderRadius:'var(--radius-control)',boxShadow:f?'0 0 0 3px var(--blue-100)':'none',font:'var(--fw-regular) 14px/1 var(--font-sans)',color:'var(--text-primary)',cursor:'pointer',outline:0,opacity:disabled?.5:1}}>
        {options.map(o=>{const v=typeof o==='string'?o:o.value;const l=typeof o==='string'?o:o.label;return <option key={v} value={v}>{l}</option>})}
      </select>
      <Icon name="chevron-down" size={16} color="var(--ink-3)" style={{position:'absolute',right:12,top:12,pointerEvents:'none'}}/>
    </span>
  </label>;
}
