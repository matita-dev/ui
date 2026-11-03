import React from 'react';
import { drawAnim } from './DrawingMode.jsx';
export function Sheet({children,zones=[4,3],inset=6,padding=0,style}){
  const [nx,ny]=zones;const L='ABCDEFGHJK';
  const zm={position:'absolute',font:'var(--fw-regular) 10px/1 var(--font-mono)',color:'var(--ink-3)',pointerEvents:'none'};
  const edge={position:'absolute',background:'var(--line-strong)',pointerEvents:'none'};
  const tick={position:'absolute',background:'var(--line-1)',pointerEvents:'none'};
  const out=[];
  for(let i=0;i<nx;i++){const x=((i+.5)/nx*100)+'%';out.push(<span key={'t'+i} style={{...zm,top:-16,left:x,transform:'translateX(-50%)'}}>{i+1}</span>,<span key={'b'+i} style={{...zm,bottom:-16,left:x,transform:'translateX(-50%)'}}>{i+1}</span>);
    if(i) {const b=(i/nx*100)+'%';out.push(<span key={'tt'+i} data-pencil="v" style={{...tick,top:0,left:b,width:1,height:inset}}/>,<span key={'bt'+i} data-pencil="v" style={{...tick,bottom:0,left:b,width:1,height:inset}}/>);}}
  for(let j=0;j<ny;j++){const y=((j+.5)/ny*100)+'%';out.push(<span key={'l'+j} style={{...zm,left:-13,top:y,transform:'translateY(-50%)'}}>{L[j]}</span>,<span key={'r'+j} style={{...zm,right:-13,top:y,transform:'translateY(-50%)'}}>{L[j]}</span>);
    if(j) {const b=(j/ny*100)+'%';out.push(<span key={'lt'+j} data-pencil="h" style={{...tick,left:0,top:b,height:1,width:inset}}/>,<span key={'rt'+j} data-pencil="h" style={{...tick,right:0,top:b,height:1,width:inset}}/>);}}
  return <div style={{position:'relative',padding:inset+2+padding,...style}}>
    <span aria-hidden="true" data-pencil="h-heavy" style={{...edge,top:0,left:0,right:0,height:2,...drawAnim('h',0)}}/>
    <span aria-hidden="true" data-pencil="v-heavy" style={{...edge,top:0,bottom:0,right:0,width:2,...drawAnim('v',120)}}/>
    <span aria-hidden="true" data-pencil="h-heavy" style={{...edge,bottom:0,left:0,right:0,height:2,...drawAnim('h',240)}}/>
    <span aria-hidden="true" data-pencil="v-heavy" style={{...edge,top:0,bottom:0,left:0,width:2,...drawAnim('v',360)}}/>
    <span aria-hidden="true" data-pencil="box-light" style={{position:'absolute',inset,border:'1px solid var(--line-1)',pointerEvents:'none'}}/>
    <span aria-hidden="true">{out}</span>
    <div style={{position:'relative'}}>{children}</div>
  </div>;
}
