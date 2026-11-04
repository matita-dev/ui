import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export const NorthArrow=React.forwardRef(function NorthArrow({size=48,rotation=0,label='N',className,style},ref){
  const r=size/2-6,c=size/2;
  return <svg ref={ref} className={className} data-pencil="svg" viewBox={'0 0 '+size+' '+(size+14)} width={size} height={size+14} role="img" aria-label={'North arrow'+(rotation?', rotated '+rotation+'°':'')} style={{display:'block',color:'var(--ink-1)',overflow:'visible',...style}}>
    <text x={c} y={9} textAnchor="middle" fill="currentColor" style={{font:'600 10px var(--font-sans)',letterSpacing:'.14em'}}>{label}</text>
    <g transform={'translate(0 14) rotate('+rotation+' '+c+' '+c+')'}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth={1.2} pathLength={1} style={drawAnim('s',0)}/>
      <path d={'M'+c+' '+(c-r-4)+'L'+(c+r*.42)+' '+(c+r*.55)+'L'+c+' '+(c+r*.22)+'Z'} fill="currentColor"/>
      <path d={'M'+c+' '+(c-r-4)+'L'+(c-r*.42)+' '+(c+r*.55)+'L'+c+' '+(c+r*.22)+'Z'} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round"/>
    </g>
  </svg>;
});
