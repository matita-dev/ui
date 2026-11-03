import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export function CornerMarks({variant='cross',size=10,color='var(--ink-1)',offset,dashed=false,overshoot='all'}){
  if(variant==='cross'){
    const o=offset??6;
    const bg=h=>dashed?'repeating-linear-gradient('+(h?'90deg':'180deg')+','+color+' 0 4px,transparent 4px 8px)':color;
    const all=overshoot==='all';const a=all?o:0;
    const sides=[
      {top:0,left:-o,right:-a,height:1,h:1},
      {bottom:0,left:-a,right:-a,height:1,h:1},
      {top:-o,bottom:-a,left:0,width:1},
      {top:-a,bottom:-a,right:0,width:1}
    ];
    /* construction lines: faint long extensions, only visible where a mode sets --construction-length (pencil) */
    const L='var(--construction-length,0px)',ext='calc('+(-o)+'px - '+L+')',lc='var(--line-construction,transparent)';
    const fade=h=>'linear-gradient('+(h?'90deg':'180deg')+',transparent,'+lc+' '+L+','+lc+' calc(100% - '+L+'),transparent)';
    const cons=all?[{top:0,left:ext,right:ext,height:1,h:1},{bottom:0,left:ext,right:ext,height:1,h:1},{top:ext,bottom:ext,left:0,width:1},{top:ext,bottom:ext,right:0,width:1}]
      :[{top:0,left:ext,right:0,height:1,h:1},{top:ext,bottom:0,left:0,width:1}];
    return <>
      {cons.map(({h,...s},i)=><span key={'c'+i} aria-hidden="true" data-pencil={h?'h-cons':'v-cons'} style={{position:'absolute',...s,background:fade(h),pointerEvents:'none',...drawAnim(h?'h':'v',i*60)}}/>)}
      {sides.map(({h,...s},i)=><span key={i} aria-hidden="true" data-pencil={h?'h':'v'} style={{position:'absolute',...s,background:bg(h),pointerEvents:'none',zIndex:1,...drawAnim(h?'h':'v',200+i*90)}}/>)}
    </>;
  }
  const o=offset??0;
  const pos=[{top:o,left:o},{top:o,right:o},{bottom:o,left:o},{bottom:o,right:o}];
  return <>{pos.map((p,i)=>{
    const t=i<2,l=i%2===0;
    return <span key={i} aria-hidden="true" data-pencil={(t?'rule-t':'rule-b')+' '+(l?'rule-l':'rule-r')+(/blue/.test(color)?' blue':/red/.test(color)?' red':'')} style={{position:'absolute',...p,width:size,height:size,pointerEvents:'none',
      borderTop:t?'var(--stroke-frame) solid '+color:'none',borderBottom:!t?'var(--stroke-frame) solid '+color:'none',borderLeft:l?'var(--stroke-frame) solid '+color:'none',borderRight:!l?'var(--stroke-frame) solid '+color:'none'}}/>;
  })}</>;
}
