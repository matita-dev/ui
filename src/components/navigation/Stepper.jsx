import React from 'react';
export const Stepper=React.forwardRef(function Stepper({steps=[],current=0,className,style},ref){
  return <ol ref={ref} className={className} style={{display:'flex',margin:0,padding:0,listStyle:'none',...style}}>
    {steps.map((s,i)=>{const done=i<current,on=i===current;const c=on?'var(--blue-500)':done?'var(--ink-1)':'var(--ink-4)';
      return <li key={i} aria-current={on?'step':undefined} style={{flex:1,display:'flex',flexDirection:'column',gap:10,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span data-pencil={done||on?'shade box':'box-light'} style={{width:26,height:26,flex:'none',display:'grid',placeItems:'center',border:'var(--stroke-frame) solid '+c,background:done?'var(--ink-1)':on?'var(--blue-500)':'transparent',color:done?'var(--paper-0)':on?'var(--text-on-accent)':'var(--ink-3)',font:'var(--fw-medium) 10.5px/1 var(--font-mono)',borderRadius:'var(--radius-1)'}}>{String(i+1).padStart(2,'0')}</span>
          {i<steps.length-1&&<span data-pencil="h-flow" style={{flex:1,height:1,margin:'0 8px',background:done?'var(--ink-1)':'var(--guide-h)'}}/>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4,paddingRight:12}}>
          <span style={{font:'var(--fw-medium) 14px/1.2 var(--font-sans)',color:done||on?'var(--ink-1)':'var(--ink-3)'}}>{s.label}</span>
          {s.meta&&<span style={{font:'var(--fw-regular) 11px/1.2 var(--font-mono)',color:'var(--ink-3)'}}>{s.meta}</span>}
        </div>
      </li>;})}
  </ol>;
});
