import React from 'react';
const fade=e=>'linear-gradient(to right,'+(e.l?'transparent 0,#000 32px':'#000 0')+','+(e.r?'#000 calc(100% - 32px),transparent 100%':'#000 100%')+')';
export const Tabs=React.forwardRef(function Tabs({items=[],value,defaultValue,onChange,variant='underline',numbered=false,className,style},ref){
  const [inner,setInner]=React.useState(defaultValue??(items[0]&&(items[0].id??items[0])));const cur=value??inner;
  /* A row wider than its space scrolls inside itself: the edges fade where more tabs are hidden, and the selected tab is kept in view. */
  const root=React.useRef(null);const [edge,setEdge]=React.useState({l:false,r:false});
  const setRoot=React.useCallback(n=>{root.current=n;if(typeof ref==='function')ref(n);else if(ref)ref.current=n;},[ref]);
  const measure=React.useCallback(()=>{const n=root.current;if(!n)return;const l=n.scrollLeft>2,r=n.scrollLeft+n.clientWidth<n.scrollWidth-2;setEdge(e=>e.l===l&&e.r===r?e:{l,r});},[]);
  React.useLayoutEffect(()=>{const n=root.current;if(!n)return;measure();if(typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(measure);ro.observe(n);return()=>ro.disconnect();},[measure,items.length]);
  React.useEffect(()=>{const n=root.current,t=n&&n.querySelector('[role="tab"][aria-selected="true"]');if(!t||!n.clientWidth)return;const pad=36,a=t.offsetLeft-pad,b=t.offsetLeft+t.offsetWidth+pad-n.clientWidth;
    if(a<n.scrollLeft)n.scrollLeft=Math.max(0,a);else if(b>n.scrollLeft)n.scrollLeft=b;},[cur]);
  const seg=variant==='segmented';const ids=items.map(it=>it.id??it);const pick=id=>{setInner(id);onChange&&onChange(id)};
  const nav=e=>{const k=e.key;if(!['ArrowRight','ArrowLeft','Home','End'].includes(k))return;e.preventDefault();const i=ids.indexOf(cur);const n=k==='Home'?0:k==='End'?ids.length-1:(i+(k==='ArrowRight'?1:-1)+ids.length)%ids.length;pick(ids[n]);e.currentTarget.querySelectorAll('[role="tab"]')[n].focus();};
  return <div ref={setRoot} className={className} role="tablist" onKeyDown={nav} onScroll={measure} data-more={edge.l&&edge.r?'both':edge.l?'start':edge.r?'end':undefined} data-pencil={seg?'box-light':'rule-b rule-light'} style={{display:'flex',gap:seg?0:28,borderBottom:seg?'none':'var(--stroke-frame) solid var(--line-1)',border:seg?'var(--stroke-frame) solid var(--line-1)':undefined,width:seg?'fit-content':undefined,borderRadius:seg?'var(--radius-1)':0,padding:seg?2:0,background:seg?'var(--paper-0)':'transparent',maxWidth:'100%',overflowX:'auto',overflowY:'hidden',scrollbarWidth:'none',...(edge.l||edge.r?{WebkitMaskImage:fade(edge),maskImage:fade(edge)}:{}),...style}}>
    {items.map((it,i)=>{const id=it.id??it;const lab=it.label??it;const on=id===cur;
      return <button key={id} role="tab" aria-selected={on} tabIndex={on?0:-1} data-pencil={on?(seg?'shade':'rule-b'):undefined} onClick={()=>pick(id)}
        style={{display:'inline-flex',alignItems:'center',gap:8,background:seg&&on?'var(--ink-1)':'transparent',color:seg?(on?'var(--paper-0)':'var(--ink-3)'):(on?'var(--ink-1)':'var(--ink-3)'),
        border:0,borderBottom:seg?0:'calc(var(--stroke-frame) * 2) solid '+(on?'var(--ink-1)':'transparent'),marginBottom:seg?0:-1,padding:seg?'0 14px':'0 0 12px',height:seg?30:'auto',borderRadius:seg?1:0,
        flex:'none',whiteSpace:'nowrap',font:'var(--fw-medium) 14px/1 var(--font-sans)',cursor:'pointer',transition:'color var(--dur-fast)'}}>
        {numbered&&<span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',color:on?'var(--blue-500)':'var(--ink-4)'}}>{String(i+1).padStart(2,'0')}</span>}
        {lab}
        {it.count!=null&&<span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)',color:'var(--ink-4)'}}>{it.count}</span>}
      </button>;})}
  </div>;
});
