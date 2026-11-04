import React from 'react';
import { Icon } from '../core/Icon.jsx';
export const Pagination=React.forwardRef(function Pagination({page,defaultPage=1,count=1,onChange,className,style},ref){
  const [inner,setInner]=React.useState(defaultPage);const cur=page??inner;
  const go=p=>{if(p<1||p>count||p===cur)return;setInner(p);onChange&&onChange(p)};
  /* How many page buttons fit: measured from the width the nav has. Unmeasured (server render, no layout) or wide, it shows up to 7. */
  const nav=React.useRef(null);const [slots,setSlots]=React.useState(7);const [compact,setCompact]=React.useState(false);
  const setNav=React.useCallback(n=>{nav.current=n;if(typeof ref==='function')ref(n);else if(ref)ref.current=n;},[ref]);
  React.useLayoutEffect(()=>{const n=nav.current;if(!n)return;
    /* under 440px the squares shrink to 28px (WCAG 2.2's minimum is 24), so the same seven slots fit a phone */
    const fit=()=>{const w=n.clientWidth;if(!w)return;const small=w<440,coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches,hit=small?28:coarse?44:32;setCompact(small);setSlots(Math.max(1,Math.min(7,Math.floor((w+4)/(hit+4))-2)));};
    fit();if(typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(fit);ro.observe(n);return()=>ro.disconnect();},[]);
  const win=k=>{const a=Math.max(1,Math.min(cur-Math.floor((k-1)/2),count-k+1));return Array.from({length:Math.min(k,count)},(_,i)=>a+i);};
  let pages;
  if(count<=slots) pages=Array.from({length:count},(_,i)=>i+1);
  else if(slots>=5){/* first and last stay; a window of the rest between two gaps */
    if(cur<=slots-3) pages=[...Array.from({length:slots-2},(_,i)=>i+1),'…',count];
    else if(cur>=count-(slots-4)) pages=[1,'…',...Array.from({length:slots-2},(_,i)=>count-(slots-3)+i)];
    else pages=[1,'…',...win(slots-4),'…',count];
  } else {/* very narrow: only the pages around the current one */
    const w=win(Math.max(1,slots-2));pages=[...(w[0]>1?['…']:[]),...w,...(w[w.length-1]<count?['…']:[])];
  }
  const b=(on,dis)=>({width:compact?28:'var(--m-hit,32px)',height:compact?28:'var(--m-hit,32px)',display:'inline-flex',alignItems:'center',justifyContent:'center',border:'var(--stroke-frame) solid '+(on?'var(--ink-1)':'var(--line-1)'),background:on?'var(--ink-1)':'var(--paper-0)',color:on?'var(--paper-0)':'var(--ink-1)',
    borderRadius:'var(--radius-1)',font:'var(--fw-regular) 12px/1 var(--font-mono)',cursor:dis?'not-allowed':'pointer',opacity:dis?.35:1,padding:0});
  return <nav ref={setNav} className={className} aria-label="Pagination" style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:4,...style}}>
    <button data-pencil="box-light" aria-label="Previous page" onClick={()=>go(cur-1)} disabled={cur<=1} style={b(false,cur<=1)}><Icon name="chevron-left" size={14}/></button>
    {pages.map((p,i)=>p==='…'?<span key={'e'+i} style={{width:24,textAlign:'center',font:'var(--fw-regular) 12px/1 var(--font-mono)',color:'var(--ink-4)'}}>…</span>
      :<button key={p} data-pencil={p===cur?'shade box':'box-light'} aria-current={p===cur?'page':undefined} onClick={()=>go(p)} style={b(p===cur)}>{String(p).padStart(2,'0')}</button>)}
    <button data-pencil="box-light" aria-label="Next page" onClick={()=>go(cur+1)} disabled={cur>=count} style={b(false,cur>=count)}><Icon name="chevron-right" size={14}/></button>
  </nav>;
});
