/* Ported unchanged from the Drafting Grid Design System (components/drafting/DrawingMode.jsx), except: ink also sets data-mode="ink"
   (so a nested scope can reset a pencil or blueprint parent) and extra props go to the root element. */
import React from 'react';
const OUT=420;
const reduced=()=>typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Shared by linework primitives: axis "h" | "v" (CSS lines, scale) or "s" (SVG strokes with pathLength=1). delay in ms. */
export function drawAnim(axis,delay=0){
  const s={animationName:'var(--dg-'+axis+',none)',animationDuration:'var(--dg-dur,0ms)',animationTimingFunction:'var(--dg-ease,linear)',animationFillMode:'both',animationDelay:'calc(var(--dg-k,0) * '+delay+'ms)'};
  if(axis==='h') s.transformOrigin='var(--dg-oh,left center)';
  if(axis==='v') s.transformOrigin='var(--dg-ov,center top)';
  if(axis==='s') s.strokeDasharray=1;
  return s;
}

/* Pencil engine. Inside <DrawingMode mode="pencil"> every [data-pencil] part is redrawn as hand-drawn graphite:
   its own seeded strokes (pressure landing + lift-off taper, slight tilt and wobble, crossed corners, occasional re-trace),
   shaded or hatched fills, and paper-tooth grain. The CSS original is hidden through data-pencil-on (tokens/pencil.css). */
const NS='http://www.w3.org/2000/svg',PAD=14,TILE=512,VOIDS=/^(INPUT|SELECT|TEXTAREA|IMG)$/;
const COLOR=/(var\(--[\w-]+(?:,[^()]*)?\)|#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|currentcolor)/i;
const q=n=>Math.round(n*100)/100;
const prng=s=>{let a=s>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};};
function wave(r,len,step){const n=Math.max(2,Math.ceil(len/step)+2),v=[];for(let i=0;i<n;i++)v.push(r()*2-1);
  return s=>{const x=Math.max(0,s)/step,i=Math.min(n-2,Math.floor(x)),f=Math.min(1,x-i),u=(1-Math.cos(f*Math.PI))/2;return v[i]+(v[i+1]-v[i])*u;};}
/* one ruled pencil stroke as a filled outline */
let ROUGH=1;
/* the hand: ends drift a little, the stroke bows once (sometimes a faint S) and wanders gently between — all scaled by roughness */
function wander(r,L,k,tl=.45){if(!(k>0))return()=>0;
  const amp=Math.min(1.6,.35+L*.0045)*k,b1=(r()*2-1)*amp,b2=(r()*2-1)*amp*.3,t0=(r()*2-1)*tl*k,t1=(r()*2-1)*tl*k,wa=Math.min(.5,.1+L/1000)*k,wb=wave(r,L,40+r()*70);
  return s=>{const t=s/L;return t0+(t1-t0)*t+b1*Math.sin(Math.PI*t)+b2*Math.sin(2*Math.PI*t)+wb(s)*wa;};}
function stroke(r,x0,y0,x1,y1,w,o={}){
  if(r()<(o.flip??.2)){let t=x0;x0=x1;x1=t;t=y0;y0=y1;y1=t;}
  const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<.6)return'';
  const ux=dx/L,uy=dy/L,nx=-uy,ny=ux,path=o.path||wander(r,L,(o.wobble??1)*ROUGH,o.tilt??.45);
  const wv=wave(r,L,12+r()*20),vr=o.vary??.16;
  const land=Math.min(o.land??2.5,L*.2),lift=Math.min(o.lift??12,L*.3),st=Math.max(1.2,Math.min(3.5,L/10)),A=[],B=[];
  for(let s=0;;s+=st){const ss=Math.min(s,L);let p=1+wv(ss)*vr;
    if(ss<land)p*=.5+.55*ss/land;else if(ss<land*3)p*=1.06;
    if(L-ss<lift)p*=.28+.72*(L-ss)/lift;
    const off=path(ss),hw=Math.max(.12,w*p/2+(r()-.5)*.1),cx=x0+ux*ss+nx*off,cy=y0+uy*ss+ny*off;
    A.push(q(cx+nx*hw)+' '+q(cy+ny*hw));B.push(q(cx-nx*hw)+' '+q(cy-ny*hw));
    if(ss>=L)break;}
  return 'M'+A.join('L')+'L'+B.reverse().join('L')+'Z';
}
function dashes(r,x0,y0,x1,y1,w,dl,gl){const L=Math.hypot(x1-x0,y1-y0);if(L<1)return'';const ux=(x1-x0)/L,uy=(y1-y0)/L,nx=-uy,ny=ux,off=wander(r,L,ROUGH),P=s=>{const k=off(s)+(r()-.5)*.14;return[x0+ux*s+nx*k,y0+uy*s+ny*k];};let s=r()*gl*.8,d='';
  while(s<L){const l=Math.min(L-s,dl*(.75+r()*.5));if(l>.7){const a=P(s),b=P(s+l);d+=stroke(r,a[0],a[1],b[0],b[1],w,{flip:0,land:.6,lift:l*.35,wobble:0,vary:.2});}s+=l+gl*(.75+r()*.5);}
  return d;}
/* freehand circle: ends overlap and drift outward, like a pencil ring */
function ring(r,cx,cy,rx,ry,w){const a0=r()*6.283,sw=6.283*(1.05+r()*.07),n=Math.max(28,Math.ceil((rx+ry)*1.5)),wb=wave(r,sw,1.1),dr=.35+r()*.5,A=[],B=[];
  for(let i=0;i<=n;i++){const t=i/n,a=a0+sw*t,k=(wb(sw*t)*.35+dr*t)*ROUGH,p=t<.1?.35+6.5*t:t>.88?.3+.7*(1-t)/.12:1,c=Math.cos(a),s=Math.sin(a),hw=w*p/2,px=cx+c*(rx+k),py=cy+s*(ry+k);
    A.push(q(px+c*hw)+' '+q(py+s*hw));B.push(q(px-c*hw)+' '+q(py-s*hw));}
  return 'M'+A.join('L')+'L'+B.reverse().join('L')+'Z';}
function sliver(r,x0,y0,x1,y1,w){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<.5)return'';
  const nx=-dy/L*w/2,ny=dx/L*w/2,m1=Math.min(.3,(1.5+r()*3)/L),m2=1-Math.min(.3,(2+r()*4)/L),ax=x0+dx*m1,ay=y0+dy*m1,bx=x0+dx*m2,by=y0+dy*m2,k=.8+r()*.3;
  return 'M'+q(x0)+' '+q(y0)+'L'+q(ax+nx)+' '+q(ay+ny)+'L'+q(bx+nx*k)+' '+q(by+ny*k)+'L'+q(x1)+' '+q(y1)+'L'+q(bx-nx*k)+' '+q(by-ny*k)+'L'+q(ax-nx)+' '+q(ay-ny)+'Z';}
/* parallel strokes clipped to the box (or ellipse); returns 3 paths so pressure can vary stroke to stroke */
function hatch(r,W,H,o){
  const a=o.ang*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,cx=W/2,cy=H/2,R=Math.hypot(W,H)/2+2,i=o.inset||0,e=o.ext||0,out=['','',''];
  for(let k=-R+(o.phase??r()*o.sp);k<R;k+=o.sp*(o.even?1:.82+r()*.36)){
    const px=cx+nx*k,py=cy+ny*k;let t0,t1;
    if(o.round){const rx=W/2-i,ry=H/2-i;if(rx<=0||ry<=0)break;const X=(px-cx)/rx,Y=(py-cy)/ry,U=ux/rx,V=uy/ry,A=U*U+V*V,B=2*(X*U+Y*V),D=B*B-4*A*(X*X+Y*Y-1);if(D<=0)continue;const s=Math.sqrt(D);t0=(-B-s)/(2*A);t1=(-B+s)/(2*A);}
    else{let lo=-1e9,hi=1e9,ok=true;for(const [p,u,mn,mx] of [[px,ux,i,W-i],[py,uy,i,H-i]]){if(Math.abs(u)<1e-6){if(p<mn||p>mx)ok=false;continue;}let ta=(mn-p)/u,tb=(mx-p)/u;if(ta>tb){const t=ta;ta=tb;tb=t;}if(ta>lo)lo=ta;if(tb<hi)hi=tb;}if(!ok||hi-lo<.5)continue;t0=lo;t1=hi;}
    t0-=r()*e*1.3-e*.35;t1+=r()*e*1.3-e*.35;
    const w=o.w*(.75+r()*.5),b=(r()*3)|0;
    if(o.dash){let t=t0+r()*o.dash[1];while(t<t1){const l=o.dash[0]*(.7+r()*.6);if(t+l>t1)break;out[b]+=sliver(r,px+ux*t,py+uy*t,px+ux*(t+l),py+uy*(t+l),w);t+=l+o.dash[1]*(.6+r()*.8);}}
    else out[b]+=sliver(r,px+ux*t0,py+uy*t0,px+ux*t1,py+uy*t1,w);}
  return out;}
function dots(r,W,H,sp,r0,r1,skip,jit){let d='';for(let y=sp/2;y<H;y+=sp)for(let x=sp/2;x<W;x+=sp){if(r()<skip)continue;
  const cx=x+(r()-.5)*sp*jit,cy=y+(r()-.5)*sp*jit,rr=r0+r()*(r1-r0);d+='M'+q(cx-rr)+' '+q(cy)+'a'+q(rr)+' '+q(rr)+' 0 1 0 '+q(2*rr)+' 0a'+q(rr)+' '+q(rr)+' 0 1 0 '+q(-2*rr)+' 0Z';}return d;}
const under=(W,H,i,round)=>round?'M'+q(i)+' '+q(H/2)+'a'+q(W/2-i)+' '+q(H/2-i)+' 0 1 0 '+q(W-2*i)+' 0a'+q(W/2-i)+' '+q(H/2-i)+' 0 1 0 '+q(2*i-W)+' 0Z':'M'+i+' '+i+'H'+q(W-i)+'V'+q(H-i)+'H'+i+'Z';
function lineInfo(b){if(/guide/.test(b))return{c:'var(--line-1)',dash:true};const m=COLOR.exec(b);return{c:m?m[1]:'var(--ink-1)',dash:/repeating/.test(b)};}
function pattern(r,k,W,H,el,P){
  const ink='var(--ink-2)',add=(ds,c,o)=>ds.forEach((d,i)=>P.push({d,c,o:o*(.78+i*.2)})),hh=o=>hatch(r,W,H,{inset:0,ext:.4,w:.95,...o});
  if(k==='poche'){const c='var(--fill-poche)';P.push({d:under(W,H,.5,false),c,o:.6});add(hh({ang:-62+r()*8,sp:1.5,w:1.3,ext:.6}),c,.85);}
  else if(k==='cross'){add(hh({ang:-45,sp:7.5,w:.85}),ink,.36);add(hh({ang:45,sp:7.5,w:.85}),ink,.36);}
  else if(k==='earth'){const ph=r()*10;add(hh({ang:-45,sp:10,phase:ph,even:true}),ink,.46);add(hh({ang:-45,sp:10,phase:ph+5,even:true,dash:[2.6,6.5],w:.8}),ink,.34);}
  else if(k==='gravel')P.push({d:dots(r,W,H,4.6,.45,.95,.15,.8),c:ink,o:.55});
  else if(k==='grid'||k==='dots'){const g=parseFloat(getComputedStyle(el).getPropertyValue('--pattern-grid-size'))||24;
    if(k==='dots')P.push({d:dots(r,W,H,g,.6,.85,0,.06),c:ink,o:.5});
    else{let d='';for(let x=g;x<W;x+=g)d+=stroke(r,x,0,x,H,.7,{tilt:.3,land:1,lift:4});for(let y=g;y<H;y+=g)d+=stroke(r,0,y,W,y,.7,{tilt:.3,land:1,lift:4});P.push({d,c:ink,o:.24});}}
  else add(hh({ang:-45+(r()-.5)*2,sp:k==='dense'?4.2:k==='blue'?6:7}),k==='blue'?'var(--blue-500)':ink,.5);
}
function pencilEngine(root,rough=1){
  const hosts=new Map();let alive=true;
  const mine=el=>el.closest('[data-drawing-root]')===root;
  const ro=new ResizeObserver(es=>{for(const e of es){const h=hosts.get(e.target);if(h)draw(e.target,h);}});
  const attach=el=>{const h={seed:(Math.random()*4294967296)>>>0,dl:Math.round(Math.random()*260),fx:Math.random(),fy:Math.random()};hosts.set(el,h);ro.observe(el);draw(el,h);};
  const drop=el=>{const h=hosts.get(el);if(!h)return;ro.unobserve(el);h.svg&&h.svg.remove();if(h.pos)h.pos.style.position='';el.removeAttribute('data-pencil-on');hosts.delete(el);};
  const scan=()=>{root.querySelectorAll('[data-pencil]').forEach(el=>{const h=hosts.get(el);if(!h){if(mine(el))attach(el);}else if(h.svg&&!h.svg.isConnected){h.sig='';draw(el,h);}});
    hosts.forEach((h,el)=>{if(!el.isConnected){ro.unobserve(el);hosts.delete(el);}});};
  const ours=n=>n.nodeType===1&&n.hasAttribute('data-pencil-overlay');
  const mo=new MutationObserver(ms=>{let again=false;for(const m of ms){const t=m.target;if(t.nodeType!==1||t.closest('[data-pencil-overlay]'))continue;
      if(m.type==='childList'){if(![...m.addedNodes,...m.removedNodes].every(ours))again=true;continue;}
      const h=hosts.get(t);if(m.attributeName==='data-pencil'&&!t.getAttribute('data-pencil'))drop(t);else if(h)draw(t,h);else if(m.attributeName==='data-pencil'&&mine(t))attach(t);}
    if(again)scan();});
  function draw(el,h){
    if(!alive||!el.isConnected)return;ROUGH=rough;
    const tk=(el.getAttribute('data-pencil')||'').split(/\s+/).filter(Boolean),has=t=>tk.includes(t);
    if(has('svg')||has('grain')){if(el.getAttribute('data-pencil-on')!=='grain')el.setAttribute('data-pencil-on','grain');return;}
    const line=tk.find(t=>/^[hv](-flow|-heavy|-cons)?$/.test(t)),box=tk.find(t=>/^box/.test(t)),rules=['t','r','b','l'].filter(s=>has('rule-'+s)),rg=has('ring')||has('ring-light'),arw=tk.find(t=>/^arrow-[lrud]$/.test(t)),shv=el.style.boxShadow||'',sh=/shadow-plate/.test(shv)?(/plate-blue/.test(shv)?'var(--blue-500)':'var(--ink-1)'):'',
      fill=has('shade')?'shade':has('tint')?'tint':'',hk=has('hatch')?el.getAttribute('data-hatch')||'diagonal':'';
    const on=[line&&'line',(box||rules.length||rg)&&'stroke',fill==='shade'&&'fill',fill==='tint'&&'tint',hk&&'hatch',has('clear')&&'clear',arw&&'arrow',sh&&'shadow'].filter(Boolean).join(' ');
    if(el.getAttribute('data-pencil-on')!==on)el.setAttribute('data-pencil-on',on);
    const W=el.offsetWidth||0,H=el.offsetHeight||0,cs=getComputedStyle(el),bw=[cs.borderTopWidth,cs.borderRightWidth,cs.borderBottomWidth,cs.borderLeftWidth].map(v=>parseFloat(v)||0);
    const tone=b=>has('blue')?'var(--blue-500)':has('red')?'var(--red-500)':b,bg=el.style.background||el.style.backgroundColor||'',tc=fill==='tint'?tone(cs.color):'';
    const rad=cs.borderTopLeftRadius||'0',round=W>0&&(rad.endsWith('%')?parseFloat(rad)>=50:parseFloat(rad)>=Math.min(W,H)/2-.5);
    const sig=[W,H,tk.join(' '),bg,tc,bw.join(),hk,round,sh,arw?cs.color:''].join('|');
    if(h.sig===sig&&h.svg&&h.svg.isConnected)return;
    h.sig=sig;
    const r=prng(h.seed),P=[];
    if(W&&H){
      if(fill==='shade'){const m=COLOR.exec(bg),c=m?m[1]:'var(--ink-1)';P.push({d:under(W,H,.8,round),c,o:.58});hatch(r,W,H,{ang:-64+r()*10,sp:1.55,w:1.3,ext:1,inset:.4,round}).forEach((d,i)=>P.push({d,c,o:.7+i*.1}));}
      if(fill==='tint'){const big=W*H>20000;hatch(r,W,H,{ang:-62+r()*10,sp:big?3:2.3,w:1.05,ext:.7,inset:.6,round}).forEach((d,i)=>P.push({d,c:tc,o:(big?.16:.22)+i*.06}));}
      if(hk)pattern(r,hk,W,H,el,P);
      if(line){const v=line[0]==='v',hv=line.endsWith('heavy'),cn=line.endsWith('cons'),li=lineInfo(bg),len=v?H:W,th=v?W:H;
        const w=cn?.75:hv?2.4:Math.max(1.25,th*1.15),x0=v?W/2:0,y0=v?0:H/2,x1=v?W/2:W,y1=v?H:H/2;
        const opt=cn?{tilt:.3,wobble:.6,land:Math.min(24,len*.3),lift:Math.min(24,len*.3),vary:.25}:{lift:Math.min(10,len*.2)};
        const pth=hv&&!li.dash?wander(r,len,ROUGH):null;if(pth){opt.path=pth;opt.flip=0;}
        P.push({d:li.dash?dashes(r,x0,y0,x1,y1,w*.95,4.6,3.4):stroke(r,x0,y0,x1,y1,w,opt),c:li.c,o:cn?1:hv?.9:.88});
        if(hv&&!li.dash)P.push({d:v?stroke(r,x0+.5,y0,x1+.5,y1,w*.5,{vary:.35,path:pth,flip:0}):stroke(r,x0,y0+.5,x1,y1+.5,w*.5,{vary:.35,path:pth,flip:0}),c:li.c,o:.35});}
      if(box||rules.length){const lt=box==='box-light'||has('rule-light'),c=tone(box==='box-blue'?'var(--blue-500)':box==='box-red'?'var(--red-500)':lt?'var(--ink-2)':'var(--ink-1)'),o=lt?.55:.88;
        const dash=has('dashed'),dot=has('dotted'),ob=Math.max(2,Math.min(7,Math.min(W,H)*.16));
        const ov=()=>box?(r()<.12?-r()*.7:ob*(.2+r()*.8)):.3+r()*1.3;
        (box?['t','r','b','l']:rules).forEach(sd=>{const b=bw['trbl'.indexOf(sd)]||1,w=Math.max(lt?1.1:1.35,b*1.15),hz=sd==='t'||sd==='b',k=sd==='t'||sd==='l'?b/2:(hz?H:W)-b/2;
          const [x0,y0,x1,y1]=hz?[-ov(),k,W+ov(),k]:[k,-ov(),k,H+ov()],oo=b>=2?.94:o;
          P.push({d:dot?dashes(r,x0,y0,x1,y1,w*.95,1.2,2.6):dash?dashes(r,x0,y0,x1,y1,w,4.6,3.4):stroke(r,x0,y0,x1,y1,w,box?{}:{land:1,lift:2.5,tilt:.25}),c,o:oo});
          if(box&&!dash&&!dot&&(hz?W:H)>70&&r()<.3){const a=.08+r()*.4,z=Math.min(1,a+.25+r()*.4),f=(r()-.5)*.8,X=t=>x0+(x1-x0)*t+(hz?0:f),Y=t=>y0+(y1-y0)*t+(hz?f:0);
            P.push({d:stroke(r,X(a),Y(a),X(z),Y(z),w*.7,{vary:.3}),c,o:oo*.45});}});}
      if(arw){const dr=arw[6],c=tone(cs.color),hz=dr==='l'||dr==='r',sg=dr==='l'||dr==='u'?-1:1,T=hz?[sg<0?0:W,H/2]:[W/2,sg<0?0:H],ux=hz?sg:0,uy=hz?0:sg,nx=-uy,ny=ux,
        al=8.5+r()*2,aw=2.4+r()*.8,bx=T[0]-ux*al,by=T[1]-uy*al,A=[bx+nx*aw,by+ny*aw],B=[bx-nx*aw,by-ny*aw],tx=T[0]+ux*.6,ty=T[1]+uy*.6,so={flip:0,land:1,lift:2.2,wobble:.5,vary:.2};
        P.push({d:'M'+q(T[0])+' '+q(T[1])+'L'+q(A[0]+ux*1.1)+' '+q(A[1]+uy*1.1)+'L'+q(bx+ux*2)+' '+q(by+uy*2)+'L'+q(B[0]+ux*1.1)+' '+q(B[1]+uy*1.1)+'Z',c,o:.5});
        P.push({d:stroke(r,A[0]-ux*.4,A[1]-uy*.4,tx,ty,1.15,so),c,o:.9},{d:stroke(r,B[0]-ux*.4,B[1]-uy*.4,tx,ty,1.15,so),c,o:.9});}
      if(sh){const so={flip:0,land:1.5,lift:3,vary:.3};for(const k of [-.55,.55]){P.push({d:stroke(r,W+1.5+k,3,W+1.5+k,H+3,2.1,so),c:sh,o:.5},{d:stroke(r,3,H+1.5+k,W+3,H+1.5+k,2.1,so),c:sh,o:.5});}}
      if(rg){const lt=has('ring-light'),b=bw[0]||1;P.push({d:ring(r,W/2,H/2,W/2-b/2,H/2-b/2,lt?1.1:1.3),c:tone(lt?'var(--ink-2)':'var(--ink-1)'),o:lt?.55:.88});}
    }
    paint(el,h,P,W,H,bw,!!(fill||hk));
  }
  function paint(el,h,P,W,H,bw,low){
    let s=h.svg;if(!s){s=h.svg=document.createElementNS(NS,'svg');s.setAttribute('data-pencil-overlay','');s.setAttribute('aria-hidden','true');}
    const host=VOIDS.test(el.tagName)?el.parentElement:el;if(!host)return;
    if(!h.pos&&getComputedStyle(host).position==='static'){host.style.position='relative';h.pos=host;}
    const x=(host===el?-bw[3]:el.offsetLeft)-PAD,y=(host===el?-bw[0]:el.offsetTop)-PAD,w=W+PAD*2,hh=H+PAD*2,mx=-Math.round(h.fx*Math.max(0,TILE-w)),my=-Math.round(h.fy*Math.max(0,TILE-hh));
    s.setAttribute('width',w);s.setAttribute('height',hh);s.setAttribute('viewBox','0 0 '+w+' '+hh);
    s.setAttribute('data-pencil-overlay',low?'fill':'');s.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+hh+'px;overflow:visible;pointer-events:none;z-index:'+(low?'-1':'auto')+';-webkit-mask-position:'+mx+'px '+my+'px;mask-position:'+mx+'px '+my+'px;animation-delay:calc(var(--dg-k,0) * '+h.dl+'ms)';
    s.innerHTML=P.length?'<g transform="translate('+PAD+' '+PAD+')">'+P.filter(p=>p.d).map(p=>'<path d="'+p.d+'" fill-opacity="'+q(Math.min(1,p.o))+'" style="fill:'+p.c+'"></path>').join('')+'</g>':'';
    if(s.parentNode!==host)host.appendChild(s);
  }
  scan();
  mo.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['data-pencil','data-hatch','style']});
  return()=>{alive=false;mo.disconnect();ro.disconnect();hosts.forEach((h,el)=>{h.svg&&h.svg.remove();if(h.pos)h.pos.style.position='';el.removeAttribute('data-pencil-on');});hosts.clear();};
}

const useIsoLayoutEffect=typeof window!=='undefined'?React.useLayoutEffect:React.useEffect;
export const drawingModeContext=React.createContext('ink');
export function DrawingMode({mode='ink',lettering='hand',animate=true,handDrawn=true,roughness=1,drawKey,drawOnMount=false,children,style,...rest}){
  const ref=React.useRef(null);
  const [shown,setShown]=React.useState(mode);
  const [phase,setPhase]=React.useState(drawOnMount&&animate&&!reduced()?'in':'idle');
  const [flip,setFlip]=React.useState(0);
  const mounted=React.useRef(false);
  const run=React.useCallback((swap)=>{
    if(!animate||reduced()){swap&&swap();return;}
    setPhase('out');
    return setTimeout(()=>{swap&&swap();setFlip(f=>f+1);setPhase('in');},OUT);
  },[animate]);
  React.useEffect(()=>{if(!mounted.current)return;if(mode===shown)return;const t=run(()=>setShown(mode));return()=>clearTimeout(t);},[mode]);
  React.useEffect(()=>{if(!mounted.current)return;const t=run();return()=>clearTimeout(t);},[drawKey]);
  React.useEffect(()=>{mounted.current=true;},[]);
  useIsoLayoutEffect(()=>{
    if(shown!=='pencil'||!handDrawn||!ref.current||typeof ResizeObserver==='undefined'||typeof MutationObserver==='undefined')return;
    return pencilEngine(ref.current,roughness);
  },[shown,handDrawn,roughness]);
  const ab=flip%2?'b':'a';
  const vars=phase==='out'?{'--dg-h':'dg-out-h','--dg-v':'dg-out-v','--dg-s':'dg-out-s','--dg-p':'dg-pout','--dg-dur':OUT-60+'ms','--dg-ease':'cubic-bezier(.6,0,.9,.6)','--dg-k':'.25','--dg-oh':'right center','--dg-ov':'center bottom'}
    :phase==='in'?{'--dg-h':'dg-in-h-'+ab,'--dg-v':'dg-in-v-'+ab,'--dg-s':'dg-in-s-'+ab,'--dg-p':'dg-pin-'+ab,'--dg-dur':'var(--dur-draw)','--dg-ease':'cubic-bezier(.55,.1,.35,1)','--dg-k':'1'}:{};
  return <div ref={ref} data-drawing-root="" data-mode={shown} data-lettering={lettering} data-drawing={phase} style={{position:'relative',minHeight:'100%',...vars,...style}} {...rest}>{shown==='pencil'&&handDrawn&&<svg aria-hidden="true" width="0" height="0" style={{position:'absolute'}}><filter id="dg-wander" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale={2.4*roughness} xChannelSelector="R" yChannelSelector="G"/></filter></svg>}<drawingModeContext.Provider value={shown}>{children}</drawingModeContext.Provider></div>;
}
