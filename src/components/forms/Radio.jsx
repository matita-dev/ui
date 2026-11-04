import React from 'react';
export const Radio=React.forwardRef(function Radio({options=[],value,defaultValue,onChange,name,direction='column',className,style},ref){
  const [inner,setInner]=React.useState(defaultValue);const cur=value??inner;const vals=options.map(o=>typeof o==='string'?o:o.value);const pick=v=>{setInner(v);onChange&&onChange(v)};
  const tab=vals.includes(cur)?cur:vals[0];
  const move=(e,d)=>{const i=vals.indexOf(e.currentTarget.dataset.value);const n=(i+d+vals.length)%vals.length;pick(vals[n]);e.currentTarget.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]')[n].focus();};
  return <div ref={ref} className={className} role="radiogroup" style={{display:'flex',flexDirection:direction,gap:direction==='row'?20:12,...style}}>
    {options.map(o=>{const v=typeof o==='string'?o:o.value;const l=typeof o==='string'?o:o.label;const on=cur===v;
      return <label key={v} onClick={()=>pick(v)} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:'pointer',font:'var(--fw-regular) 14px/1.3 var(--font-sans)',color:'var(--text-primary)'}}>
        <span role="radio" aria-checked={on} data-value={v} tabIndex={v===tab?0:-1} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();move(e,1);}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();move(e,-1);}else if(e.key===' '){e.preventDefault();pick(v);}}} data-pencil={on?'ring':'ring-light'} style={{width:16,height:16,flex:'none',borderRadius:'50%',border:'var(--stroke-frame) solid '+(on?'var(--ink-1)':'var(--ink-4)'),background:'var(--paper-0)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
          {on&&<span data-pencil="shade" style={{width:8,height:8,borderRadius:'50%',background:'var(--ink-1)'}}/>}
        </span>{l}
      </label>;})}
  </div>;
});
