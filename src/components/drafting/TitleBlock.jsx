import React from 'react';
export function TitleBlock({project,subtitle,fields=[],revisions,style}){
  const k={display:'block',font:'var(--fw-medium) 8.5px/1.2 var(--font-mono)',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:3};
  const cell=(full,left)=>({padding:'6px 10px 7px',borderBottom:'var(--stroke-frame) solid var(--line-1)',borderRight:!full&&left?'var(--stroke-frame) solid var(--line-1)':0,gridColumn:full?'1 / 3':undefined,minWidth:0});
  const val={big:{font:'var(--fw-medium) 20px/1 var(--font-mono)',color:'var(--ink-1)'},text:{font:'var(--fw-regular) 12px/1.25 var(--font-sans)',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--ink-1)'}};
  const pr=(full,left)=>'rule-b rule-light'+(!full&&left?' rule-r':'');
  let col=0;
  const cells=fields.map((f,i)=>{const full=!!f.full;const left=col===0;col=full?0:(col+1)%2;
    return <div key={i} data-pencil={pr(full,left)} style={cell(full,left)}><span style={k}>{f.label}</span><span style={val[f.size==='big'?'big':'text']}>{f.value}</span></div>;});
  return <section aria-label="Title block" data-pencil="rule-t" style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:'var(--stroke-bold) solid var(--line-strong)',color:'var(--ink-1)',...style}}>
    {project&&<div data-pencil={pr(true)} style={cell(true)}><span style={k}>Project</span><span style={{display:'block',font:'var(--fw-semibold,600) 24px/1 var(--font-sans)',letterSpacing:'.14em',textTransform:'uppercase'}}>{project}</span>{subtitle&&<span style={{...val.text,display:'block',marginTop:6,fontSize:11,color:'var(--ink-2)'}}>{subtitle}</span>}</div>}
    {cells}
    {revisions&&<div style={{...cell(true),borderBottom:0}}><span style={k}>Revisions</span>
      <div style={{display:'grid',gridTemplateColumns:'auto auto 1fr',gap:'2px 10px',font:'var(--fw-regular) 10px/1.35 var(--font-mono)',color:'var(--ink-2)'}}>{revisions.map((r,i)=>r.map((c,j)=><span key={i+'-'+j} style={{color:j===0?'var(--ink-1)':undefined}}>{c}</span>))}</div></div>}
  </section>;
}
