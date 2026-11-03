import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export function ScaleBar({segments=5,unit='M',ratio='1:100',segmentWidth=40,style}){
  const w=segments*segmentWidth,W=w+64;
  return <svg data-pencil="svg" viewBox={'0 0 '+W+' 34'} width={W} height={34} role="img" aria-label={'Scale bar, 0 to '+segments+' '+unit+(ratio?' at '+ratio:'')} style={{display:'block',color:'var(--ink-1)',overflow:'visible',...style}}>
    {Array.from({length:segments}).map((_,i)=><rect key={i} x={10+i*segmentWidth} y={8} width={segmentWidth} height={6} fill={i%2?'none':'currentColor'} stroke="currentColor" strokeWidth={1} pathLength={1} style={drawAnim('s',i*60)}/>)}
    <g fill="currentColor" style={{font:'400 9px var(--font-mono)'}}>{Array.from({length:segments+1}).map((_,i)=><text key={i} x={10+i*segmentWidth} y={27} textAnchor="middle">{i}{i===segments?' '+unit:''}</text>)}
    {ratio&&<text x={W-2} y={14} textAnchor="end">{ratio}</text>}</g>
  </svg>;
}
