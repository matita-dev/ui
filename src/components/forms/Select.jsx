import React from 'react';
import { Icon } from '../core/Icon.jsx';
const norm=o=>typeof o==='string'?{value:o,label:o}:o;
/* A listbox, not the browser's <select>: the open list is exactly as wide as the field (long options wrap inside it), flips upward at the
   bottom edge, and scrolls when it has many options. Keyboard: arrows, Home, End, Enter or Space to pick, Escape, type to jump. */
export const Select=React.forwardRef(function Select({label,options=[],value,defaultValue,onChange,name,placeholder='Select…',disabled=false,className,style},ref){
  const opts=options.map(norm);
  const [inner,setInner]=React.useState(defaultValue??(value===undefined&&opts[0]?opts[0].value:undefined));
  const cur=value??inner;const idx=opts.findIndex(o=>o.value===cur);
  const [open,setOpen]=React.useState(false);const [act,setAct]=React.useState(0);const [f,setF]=React.useState(false);const [up,setUp]=React.useState(false);
  const root=React.useRef(null),btn=React.useRef(null),list=React.useRef(null),buf=React.useRef({s:'',t:0});
  const setBtn=React.useCallback(n=>{btn.current=n;if(typeof ref==='function')ref(n);else if(ref)ref.current=n;},[ref]);
  const uid=React.useId(),lid=uid+'l',bid=uid+'b',tid=uid+'t';
  const show=()=>{if(disabled)return;setAct(Math.max(idx,0));setOpen(true);};
  const pick=i=>{const o=opts[i];if(!o)return;if(value===undefined)setInner(o.value);onChange&&onChange(o.value);setOpen(false);};
  const key=e=>{
    const k=e.key;
    if(!open){if(['ArrowDown','ArrowUp','Enter',' '].includes(k)){e.preventDefault();show();}return;}
    if(k==='Escape'){e.preventDefault();e.stopPropagation();setOpen(false);}
    else if(k==='Tab')setOpen(false);
    else if(k==='ArrowDown'){e.preventDefault();setAct(a=>Math.min(a+1,opts.length-1));}
    else if(k==='ArrowUp'){e.preventDefault();setAct(a=>Math.max(a-1,0));}
    else if(k==='Home'){e.preventDefault();setAct(0);}
    else if(k==='End'){e.preventDefault();setAct(opts.length-1);}
    else if(k==='Enter'||k===' '){e.preventDefault();pick(act);}
    else if(k.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
      const b=buf.current,now=Date.now();b.s=(now-b.t>600?'':b.s)+k.toLowerCase();b.t=now;
      const start=b.s.length===1?act+1:act;
      for(let j=0;j<opts.length;j++){const i=(start+j)%opts.length,l=typeof opts[i].label==='string'?opts[i].label:opts[i].value;if(String(l).toLowerCase().startsWith(b.s)){setAct(i);break;}}
    }
  };
  React.useEffect(()=>{if(!open)return;const h=e=>{if(root.current&&!root.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[open]);
  /* at the bottom edge the list opens upwards, if there is more room there */
  React.useLayoutEffect(()=>{if(!open){setUp(false);return;}const p=list.current&&list.current.parentNode,t=btn.current;if(!p||!t)return;const r=p.getBoundingClientRect(),b=t.getBoundingClientRect();if(!r.height)return;
    setUp(r.bottom>window.innerHeight-8&&b.top-r.height-6>=8);},[open]);
  React.useEffect(()=>{if(open&&list.current){const n=list.current.children[act];n&&n.scrollIntoView&&n.scrollIntoView({block:'nearest'});}},[open,act]);
  const sel=idx>=0?opts[idx]:null;
  return <div ref={root} className={className} style={{display:'flex',flexDirection:'column',gap:8,minWidth:0,...style}}>
    {label&&<span id={tid} style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{label}</span>}
    <div style={{position:'relative',display:'flex',minWidth:0}}>
      <button ref={setBtn} id={bid} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={open?lid:undefined} aria-activedescendant={open?lid+act:undefined}
        aria-labelledby={label?tid+' '+bid:undefined} disabled={disabled} data-pencil={f||open?'box-blue':'box-light'} onClick={()=>open?setOpen(false):show()} onKeyDown={key} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{display:'flex',alignItems:'center',textAlign:'left',width:'100%',height:40,padding:'0 36px 0 12px',background:'var(--paper-0)',border:'var(--stroke-frame) solid '+(f||open?'var(--blue-500)':'var(--line-1)'),
        borderRadius:'var(--radius-control)',boxShadow:f||open?'0 0 0 3px var(--blue-100)':'none',font:'var(--fw-regular) 14px/1 var(--font-sans)',color:'var(--text-primary)',cursor:disabled?'not-allowed':'pointer',outline:0,opacity:disabled?.5:1}}>
        <span style={{flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:sel?undefined:'var(--text-muted)'}}>{sel?sel.label:placeholder}</span>
      </button>
      <Icon name="chevron-down" size={16} color="var(--ink-3)" style={{position:'absolute',right:12,top:12,pointerEvents:'none'}}/>
      {name&&<input type="hidden" name={name} value={cur??''}/>}
      {open&&<div data-pencil="box" style={{position:'absolute',left:0,right:0,zIndex:'var(--z-overlay)',...(up?{bottom:'calc(100% + 6px)'}:{top:'calc(100% + 6px)'}),background:'var(--paper-0)',border:'var(--stroke-frame) solid var(--ink-1)',boxShadow:'var(--shadow-plate)'}}>
        <ul ref={list} id={lid} role="listbox" aria-labelledby={label?tid:bid} style={{margin:0,padding:4,listStyle:'none',maxHeight:'min(280px,45vh)',overflowY:'auto'}}>
          {opts.map((o,i)=><li key={o.value} id={lid+i} role="option" aria-selected={i===idx} onMouseDown={e=>e.preventDefault()} onClick={()=>pick(i)} onMouseEnter={()=>setAct(i)}
            style={{display:'flex',alignItems:'center',gap:10,minHeight:'var(--m-hit-row,34px)',padding:'6px 10px',borderRadius:1,background:i===act?'var(--paper-2)':'transparent',cursor:'pointer',
            font:'var(--fw-'+(i===idx?'medium':'regular')+') 14px/1.3 var(--font-sans)',color:'var(--ink-1)'}}>
            <span style={{flex:1,minWidth:0}}>{o.label}</span>{i===idx&&<Icon name="check" size={14}/>}
          </li>)}
        </ul>
      </div>}
    </div>
  </div>;
});
