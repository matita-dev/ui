import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Pagination({page,defaultPage=1,count=1,onChange,style}){
  const [inner,setInner]=React.useState(defaultPage);const cur=page??inner;
  const go=p=>{if(p<1||p>count||p===cur)return;setInner(p);onChange&&onChange(p)};
  const pages=[];for(let p=1;p<=count;p++){if(p===1||p===count||Math.abs(p-cur)<=1)pages.push(p);else if(pages[pages.length-1]!=='…')pages.push('…');}
  const b=(on,dis)=>({width:32,height:32,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'var(--stroke-frame) solid '+(on?'var(--ink-1)':'var(--line-1)'),background:on?'var(--ink-1)':'var(--paper-0)',color:on?'var(--paper-0)':'var(--ink-1)',
    borderRadius:'var(--radius-1)',font:'var(--fw-regular) 12px/1 var(--font-mono)',cursor:dis?'not-allowed':'pointer',opacity:dis?.35:1,padding:0});
  return <nav aria-label="Pagination" style={{display:'flex',alignItems:'center',gap:4,...style}}>
    <button data-pencil="box-light" aria-label="Previous page" onClick={()=>go(cur-1)} disabled={cur<=1} style={b(false,cur<=1)}><Icon name="chevron-left" size={14}/></button>
    {pages.map((p,i)=>p==='…'?<span key={'e'+i} style={{width:24,textAlign:'center',font:'var(--fw-regular) 12px/1 var(--font-mono)',color:'var(--ink-4)'}}>…</span>
      :<button key={p} data-pencil={p===cur?'shade box':'box-light'} aria-current={p===cur?'page':undefined} onClick={()=>go(p)} style={b(p===cur)}>{String(p).padStart(2,'0')}</button>)}
    <button data-pencil="box-light" aria-label="Next page" onClick={()=>go(cur+1)} disabled={cur>=count} style={b(false,cur>=count)}><Icon name="chevron-right" size={14}/></button>
  </nav>;
}
