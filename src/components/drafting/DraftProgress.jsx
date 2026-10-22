import React from 'react';
export function DraftProgress({value=0,label='Drafting',stage,style}){
  const p=Math.max(0,Math.min(1,value));const done=p>=1;
  const t={font:'var(--fw-regular) 10px/1 var(--font-mono)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',whiteSpace:'nowrap'};
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p*100)} aria-label={label} style={{display:'flex',alignItems:'center',gap:10,...style}}>
    <span style={t}>{label}{stage&&!done?' · '+stage:''}{done?' · complete':''}</span>
    <span style={{position:'relative',flex:1,height:1}}><span data-pencil="h" style={{position:'absolute',left:0,right:0,top:0,height:1,background:'var(--line-2)'}}/><span data-pencil="h" style={{position:'absolute',left:0,top:0,height:1,width:p*100+'%',background:'var(--ink-1)',transition:'width var(--dur-base) linear'}}/></span>
    <span style={{...t,color:'var(--ink-1)',minWidth:30,textAlign:'right'}}>{Math.round(p*100)}%</span>
  </div>;
}
