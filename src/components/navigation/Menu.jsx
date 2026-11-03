import React from 'react';
import { Icon } from '../core/Icon.jsx';
export const Menu=React.forwardRef(function Menu({items=[],onSelect,trigger,align='left',open:openProp,className,style},fwd){
  const [open,setOpen]=React.useState(false);const [hov,setHov]=React.useState(null);const ref=React.useRef(null);
  const setRoot=React.useCallback(n=>{ref.current=n;if(typeof fwd==='function')fwd(n);else if(fwd)fwd.current=n;},[fwd]);
  const isOpen=trigger?(openProp??open):true;
  /* a popup that would leave the screen opens towards the other side (and upwards at the bottom edge) */
  const [fit,setFit]=React.useState({});
  React.useLayoutEffect(()=>{if(!trigger||!isOpen){setFit({});return;}const m=ref.current&&ref.current.querySelector('[role="menu"]');if(!m)return;const r=m.getBoundingClientRect(),t=ref.current.getBoundingClientRect(),W=document.documentElement.clientWidth,H=window.innerHeight;if(!r.width)return;
    setFit({side:align==='left'&&r.right>W-8&&t.right-r.width>=8?'right':align==='right'&&r.left<8&&t.left+r.width<=W-8?'left':undefined,up:r.bottom>H-8&&t.top-r.height-6>=8});},[isOpen,trigger,align]);
  const items_=()=>[...ref.current.querySelectorAll('[role="menuitem"]:not([disabled])')];
  const wasOpen=React.useRef(false);
  React.useEffect(()=>{if(trigger&&isOpen&&!wasOpen.current&&ref.current){const f=items_()[0];f&&f.focus();}wasOpen.current=isOpen;},[isOpen,trigger]);
  const nav=e=>{
    const k=e.key;
    if(k==='Escape'&&trigger){e.stopPropagation();setOpen(false);const w=ref.current.querySelector('[data-menu-trigger]');const t=w&&(w.querySelector('button')||w.querySelector('a[href]')||w.querySelector('[tabindex]'));t&&t.focus();return;}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(k))return;
    const f=items_();if(!f.length)return;e.preventDefault();
    const i=f.indexOf(document.activeElement);
    f[k==='Home'?0:k==='End'?f.length-1:(i+(k==='ArrowDown'?1:-1)+f.length)%f.length].focus();
  };
  React.useEffect(()=>{if(!trigger||!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[open,trigger]);
  const panel=<div ref={trigger?undefined:setRoot} className={trigger?undefined:className} role="menu" onKeyDown={nav} data-pencil="box" style={{minWidth:'min(208px,calc(100vw - 24px))',maxWidth:'calc(100vw - 16px)',padding:4,background:'var(--paper-0)',border:'var(--stroke-frame) solid var(--ink-1)',boxShadow:'var(--shadow-plate)',
    ...(trigger?{position:'absolute',top:'calc(100% + 6px)',[fit.side||align]:0,...(fit.up?{top:'auto',bottom:'calc(100% + 6px)'}:{}),zIndex:'var(--z-overlay)'}:{}),...style}}>
    {items.map((it,i)=>it.divider?<div key={i} role="separator" data-pencil="h-flow" style={{height:1,margin:'4px 0',background:'var(--guide-h)'}}/>
      :it.heading?<div key={i} style={{padding:'8px 10px 4px',font:'var(--fw-medium) 10px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--ink-4)'}}>{it.heading}</div>
      :<button key={it.id??i} role="menuitem" disabled={it.disabled} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} onClick={()=>{onSelect&&onSelect(it.id??it.label);setOpen(false)}}
        style={{display:'flex',alignItems:'center',gap:10,width:'100%',height:'var(--m-hit-row,34px)',padding:'0 10px',border:0,borderRadius:1,background:hov===i&&!it.disabled?'var(--paper-2)':'transparent',
        color:it.danger?'var(--red-500)':'var(--ink-1)',opacity:it.disabled?.4:1,cursor:it.disabled?'not-allowed':'pointer',font:'var(--fw-regular) 14px/1 var(--font-sans)',textAlign:'left'}}>
        {it.icon&&<Icon name={it.icon} size={15}/>}<span style={{flex:1}}>{it.label}</span>
        {it.shortcut&&<span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)',color:'var(--ink-4)'}}>{it.shortcut}</span>}
      </button>)}
  </div>;
  if(!trigger) return panel;
  return <div ref={setRoot} className={className} style={{position:'relative',display:'inline-block'}}>
    <span data-menu-trigger="" onClick={()=>setOpen(o=>!o)} onKeyDown={e=>{if(e.key==='ArrowDown'&&!isOpen){e.preventDefault();setOpen(true);}}} aria-haspopup="menu" aria-expanded={isOpen}>{trigger}</span>
    {isOpen&&panel}
  </div>;
});
