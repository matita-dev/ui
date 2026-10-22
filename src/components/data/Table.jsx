import React from 'react';
export function Table({columns=[],rows=[],rowKey='id',variant='default',activeKey,onRowHover,onRowClick,footer,caption,style}){
  const [hov,setHov]=React.useState(null);const act=activeKey!==undefined?activeKey:hov;
  const S=variant==='schedule';
  const hl='color-mix(in srgb,var(--blue-500) 16%,transparent)';
  const th={textAlign:'left',padding:S?'0 0 6px':'0 12px 10px',font:'var(--fw-medium) 10.5px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-muted)',borderBottom:'1px solid var(--line-strong)',whiteSpace:'nowrap'};
  const td=(c,i)=>({padding:S?'4px 8px 4px 0':'11px 12px',textAlign:c.align||'left',borderBottom:S?'1px dotted var(--line-1)':'1px solid var(--line-2)',
    font:c.mono||(S&&i===0)?'var(--fw-regular) '+(S&&i===0?'10px':'12.5px')+'/1.3 var(--font-mono)':S?'var(--fw-regular) 12.5px/1.3 var(--font-sans)':'var(--fw-regular) 14px/1.35 var(--font-sans)',
    letterSpacing:S&&!c.mono&&i!==0?'.08em':undefined,textTransform:S&&!c.mono&&i!==0?'uppercase':undefined,
    color:S&&i===0?'var(--ink-3)':'var(--text-primary)',width:c.width,whiteSpace:c.nowrap?'nowrap':undefined});
  const set=k=>{setHov(k);onRowHover&&onRowHover(k)};
  return <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,...style}}>
    {caption&&<caption style={{captionSide:'top',textAlign:'left',paddingBottom:10,font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ink-1)'}}>{caption}</caption>}
    <thead><tr>{columns.map(c=><th key={c.key} data-pencil="rule-b" style={{...th,textAlign:c.align||'left',width:c.width}}>{c.label}</th>)}</tr></thead>
    <tbody>{rows.map((r,ri)=>{const k=r[rowKey]??ri;const on=act===k;
      return <tr key={k} onMouseEnter={()=>set(k)} onMouseLeave={()=>set(null)} onClick={onRowClick?()=>onRowClick(r):undefined}
        style={{background:on?hl:'transparent',cursor:onRowClick?'pointer':'default',transition:'background var(--dur-fast)'}}>
        {columns.map((c,i)=><td key={c.key} data-pencil={S?'rule-b rule-light dotted':'rule-b rule-light'} style={td(c,i)}>{c.render?c.render(r):r[c.key]}</td>)}</tr>;})}</tbody>
    {footer&&<tfoot>{footer.map((f,fi)=><tr key={fi}>{f.map((v,i)=><td key={i} style={{...td(columns[i]||{},i),borderBottom:0,paddingTop:fi===0?8:2,fontWeight:600,color:'var(--ink-1)'}}>{v}</td>)}</tr>)}</tfoot>}
  </table>;
}
