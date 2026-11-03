import React from 'react';
export const Stepper=React.forwardRef(function Stepper({steps=[],current=0,orientation='horizontal',className,style},ref){
  const V=orientation==='vertical';
  if(V) return <div ref={ref} className={'m-stepper'+(className?' '+className:'')} style={style}><ol style={{display:'flex',flexDirection:'column',margin:0,padding:0,listStyle:'none'}}>
    {steps.map((s,i)=>{const done=i<current,on=i===current,last=i===steps.length-1;const c=on?'var(--blue-500)':done?'var(--ink-1)':'var(--ink-4)';
      return <li key={i} aria-current={on?'step':undefined} style={{display:'flex',gap:12,minWidth:0}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span data-pencil={done||on?'shade box':'box-light'} style={{width:'var(--m-step-d,26px)',height:'var(--m-step-d,26px)',flex:'none',display:'grid',placeItems:'center',border:'var(--stroke-frame) solid '+c,background:done?'var(--ink-1)':on?'var(--blue-500)':'transparent',color:done?'var(--paper-0)':on?'var(--text-on-accent)':'var(--ink-3)',font:'var(--fw-medium) var(--m-step-nfs,10.5px)/1 var(--font-mono)',borderRadius:'var(--radius-1)'}}>{String(i+1).padStart(2,'0')}</span>
          {!last&&<span data-pencil="v-flow" style={{flex:1,width:1,minHeight:16,margin:'6px 0',background:done?'var(--ink-1)':'var(--guide-h)'}}/>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4,paddingTop:4,paddingBottom:last?0:20,minWidth:0}}>
          <span style={{font:'var(--fw-medium) var(--m-step-fs,14px)/1.2 var(--font-sans)',color:done||on?'var(--ink-1)':'var(--ink-3)'}}>{s.label}</span>
          {s.meta&&<span style={{font:'var(--fw-regular) var(--m-step-mfs,11px)/1.2 var(--font-mono)',color:'var(--ink-3)'}}>{s.meta}</span>}
        </div>
      </li>;})}
  </ol></div>;
  return <div ref={ref} className={'m-stepper'+(className?' '+className:'')} style={style}><ol style={{display:'flex',flexDirection:'var(--m-step-ol,row)',gap:'var(--m-step-gap,0)',margin:0,padding:0,listStyle:'none'}}>
    {steps.map((s,i)=>{const done=i<current,on=i===current;const c=on?'var(--blue-500)':done?'var(--ink-1)':'var(--ink-4)';
      return <li key={i} aria-current={on?'step':undefined} style={{flex:'var(--m-step-flex,1)',display:'flex',flexDirection:'var(--m-step-li,column)',gap:'var(--m-step-lgap,10px)',minWidth:0}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span data-pencil={done||on?'shade box':'box-light'} style={{width:'var(--m-step-d,26px)',height:'var(--m-step-d,26px)',flex:'none',display:'grid',placeItems:'center',border:'var(--stroke-frame) solid '+c,background:done?'var(--ink-1)':on?'var(--blue-500)':'transparent',color:done?'var(--paper-0)':on?'var(--text-on-accent)':'var(--ink-3)',font:'var(--fw-medium) var(--m-step-nfs,10.5px)/1 var(--font-mono)',borderRadius:'var(--radius-1)'}}>{String(i+1).padStart(2,'0')}</span>
          {i<steps.length-1&&<span data-pencil="h-flow" style={{display:'var(--m-step-line,block)',flex:1,height:1,margin:'0 var(--m-step-m,8px)',background:done?'var(--ink-1)':'var(--guide-h)'}}/>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4,paddingRight:'var(--m-step-pr,12px)',minWidth:0}}>
          <span style={{font:'var(--fw-medium) var(--m-step-fs,14px)/1.2 var(--font-sans)',color:done||on?'var(--ink-1)':'var(--ink-3)'}}>{s.label}</span>
          {s.meta&&<span style={{font:'var(--fw-regular) var(--m-step-mfs,11px)/1.2 var(--font-mono)',color:'var(--ink-3)'}}>{s.meta}</span>}
        </div>
      </li>;})}
  </ol></div>;
});
