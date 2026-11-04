import React from 'react';
export const Tabs=React.forwardRef(function Tabs({items=[],value,defaultValue,onChange,variant='underline',numbered=false,className,style},ref){
  const [inner,setInner]=React.useState(defaultValue??(items[0]&&(items[0].id??items[0])));const cur=value??inner;
  const seg=variant==='segmented';
  return <div ref={ref} className={className} role="tablist" data-pencil={seg?'box-light':'rule-b rule-light'} style={{display:'flex',gap:seg?0:28,borderBottom:seg?'none':'var(--stroke-frame) solid var(--line-1)',border:seg?'var(--stroke-frame) solid var(--line-1)':undefined,width:seg?'fit-content':undefined,borderRadius:seg?'var(--radius-1)':0,padding:seg?2:0,background:seg?'var(--paper-0)':'transparent',...style}}>
    {items.map((it,i)=>{const id=it.id??it;const lab=it.label??it;const on=id===cur;
      return <button key={id} role="tab" aria-selected={on} data-pencil={on?(seg?'shade':'rule-b'):undefined} onClick={()=>{setInner(id);onChange&&onChange(id)}}
        style={{display:'inline-flex',alignItems:'center',gap:8,background:seg&&on?'var(--ink-1)':'transparent',color:seg?(on?'var(--paper-0)':'var(--ink-3)'):(on?'var(--ink-1)':'var(--ink-3)'),
        border:0,borderBottom:seg?0:'calc(var(--stroke-frame) * 2) solid '+(on?'var(--ink-1)':'transparent'),marginBottom:seg?0:-1,padding:seg?'0 14px':'0 0 12px',height:seg?30:'auto',borderRadius:seg?1:0,
        font:'var(--fw-medium) 14px/1 var(--font-sans)',cursor:'pointer',transition:'color var(--dur-fast)'}}>
        {numbered&&<span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',color:on?'var(--blue-500)':'var(--ink-4)'}}>{String(i+1).padStart(2,'0')}</span>}
        {lab}
        {it.count!=null&&<span style={{font:'var(--fw-regular) 11px/1 var(--font-mono)',color:'var(--ink-4)'}}>{it.count}</span>}
      </button>;})}
  </div>;
});
