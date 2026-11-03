import React from 'react';
export function GridRails({children,grid='none',maxWidth='var(--container)',rails=true,columns=0,style,...rest}){
  const rail={position:'absolute',top:0,bottom:0,width:1,background:'var(--guide-v)',pointerEvents:'none'};
  const bg=grid==='cells'?{backgroundImage:'var(--pattern-grid)',backgroundSize:'var(--pattern-grid-size)'}:grid==='dots'?{backgroundImage:'var(--pattern-dots)',backgroundSize:'var(--pattern-grid-size)'}:{};
  return <div {...rest} style={{position:'relative',...bg,...style}}>
    <div style={{position:'relative',maxWidth,margin:'0 auto',padding:'0 var(--rail-gutter)'}}>
      {rails&&<><span aria-hidden="true" data-pencil="v" style={{...rail,left:0}}/><span aria-hidden="true" data-pencil="v" style={{...rail,right:0}}/></>}
      {columns>0&&<div aria-hidden="true" style={{position:'absolute',inset:'0 var(--rail-gutter)',display:'grid',gridTemplateColumns:'repeat('+columns+',1fr)',gap:'var(--column-gap)',pointerEvents:'none'}}>
        {Array.from({length:columns}).map((_,i)=><span key={i} data-pencil="rule-l rule-r rule-light dashed blue" style={{background:'color-mix(in srgb,var(--blue-500) 6%,transparent)',borderLeft:'1px dashed var(--line-blue)',borderRight:'1px dashed var(--line-blue)'}}/>)}
      </div>}
      <div style={{position:'relative'}}>{children}</div>
    </div>
  </div>;
}
