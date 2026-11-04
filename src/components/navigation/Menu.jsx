import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Menu({items=[],onSelect,trigger,align='left',open:openProp,style}){
  const [open,setOpen]=React.useState(false);const [hov,setHov]=React.useState(null);const ref=React.useRef(null);
  const isOpen=trigger?(openProp??open):true;
  React.useEffect(()=>{if(!trigger||!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[open,trigger]);
  const panel=<div role="menu" data-pencil="box" style={{minWidth:208,padding:4,background:'var(--paper-0)',border:'var(--stroke-frame) solid var(--ink-1)',boxShadow:'var(--shadow-plate)',
    ...(trigger?{position:'absolute',top:'calc(100% + 6px)',[align]:0,zIndex:'var(--z-overlay)'}:{}),...style}}>
    {items.map((it,i)=>it.divider?<div key={i} role="separator" data-pencil="h-flow" style={{height:1,margin:'4px 0',background:'var(--guide-h)'}}/>
      :it.heading?<div key={i} style={{padding:'8px 10px 4px',font:'var(--fw-medium) 10px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--ink-4)'}}>{it.heading}</div>
      :<button key={it.id??i} role="menuitem" disabled={it.disabled} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} onClick={()=>{onSelect&&onSelect(it.id??it.label);setOpen(false)}}
        style={{display:'flex',alignItems:'center',gap:10,width:'100%',height:34,padding:'0 10px',border:0,borderRadius:1,background:hov===i&&!it.disabled?'var(--paper-2)':'transparent',
        color:it.danger?'var(--red-500)':'var(--ink-1)',opacity:it.disabled?.4:1,cursor:it.disabled?'not-allowed':'pointer',font:'var(--fw-regular) 14px/1 var(--font-sans)',textAlign:'left'}}>
        {it.icon&&<Icon name={it.icon} size={15}/>}<span style={{flex:1}}>{it.label}</span>
        {it.shortcut&&<span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)',color:'var(--ink-4)'}}>{it.shortcut}</span>}
      </button>)}
  </div>;
  if(!trigger) return panel;
  return <div ref={ref} style={{position:'relative',display:'inline-block'}}>
    <span onClick={()=>setOpen(o=>!o)} aria-haspopup="menu" aria-expanded={isOpen}>{trigger}</span>
    {isOpen&&panel}
  </div>;
}
