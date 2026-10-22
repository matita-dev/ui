import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export function Dimension({label,tone='ink',orientation='horizontal',length,style}){
  const c=tone==='blue'?'var(--blue-500)':tone==='red'?'var(--red-500)':'var(--ink-3)';
  const V=orientation==='vertical';
  const tick={flex:'none',background:c,width:V?9:1,height:V?1:9};
  const line={flex:1,background:c,[V?'width':'height']:1,...drawAnim(V?'v':'h',420)};
  const arrow=(dir)=>({width:0,height:0,flex:'none',border:'3.5px solid transparent',
    ...(V?(dir<0?{borderBottom:'7px solid '+c,borderTopWidth:0}:{borderTop:'7px solid '+c,borderBottomWidth:0}):(dir<0?{borderRight:'7px solid '+c,borderLeftWidth:0}:{borderLeft:'7px solid '+c,borderRightWidth:0}))});
  return <div style={{display:'flex',flexDirection:V?'column':'row',alignItems:'center',[V?'height':'width']:length??'100%',color:c,...style}}>
    <span data-pencil={V?'h-flow':'v-flow'} style={tick}/><span data-pencil={V?'arrow-u':'arrow-l'} style={arrow(-1)}/><span data-pencil={V?'v-flow':'h-flow'} style={line}/>
    {label&&<span style={{padding:V?'6px 0':'0 8px',font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'0.04em',whiteSpace:'nowrap',writingMode:V?'vertical-rl':undefined}}>{label}</span>}
    <span data-pencil={V?'v-flow':'h-flow'} style={line}/><span data-pencil={V?'arrow-d':'arrow-r'} style={arrow(1)}/><span data-pencil={V?'h-flow':'v-flow'} style={tick}/>
  </div>;
}
