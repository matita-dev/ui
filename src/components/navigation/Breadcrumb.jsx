import React from 'react';
export const Breadcrumb=React.forwardRef(function Breadcrumb({items=[],className,style},ref){
  return <nav ref={ref} className={className} aria-label="Breadcrumb" style={style}><ol style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:8,margin:0,padding:0,listStyle:'none',font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase'}}>
    {items.map((it,i)=>{const last=i===items.length-1;const link=!last&&(it.href||it.onClick);
      return <li key={i} style={{display:'flex',alignItems:'center',gap:8}}>
        {link?<a href={it.href} onClick={it.onClick} style={{color:'var(--ink-3)',textDecoration:'none',cursor:'pointer'}}>{it.label}</a>:<span aria-current={last?'page':undefined} style={{color:last?'var(--ink-1)':'var(--ink-3)'}}>{it.label}</span>}
        {!last&&<span aria-hidden="true" style={{color:'var(--ink-5)'}}>/</span>}</li>;})}
  </ol></nav>;
});
