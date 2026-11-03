import React from 'react';
const T={neutral:['var(--paper-2)','var(--ink-2)','transparent'],accent:['var(--blue-100)','var(--blue-600)','transparent'],success:['var(--green-100)','var(--green-500)','transparent'],warning:['var(--amber-100)','var(--amber-500)','transparent'],danger:['var(--red-100)','var(--red-600)','transparent'],outline:['transparent','var(--ink-1)','var(--ink-1)'],inverse:['var(--ink-1)','var(--paper-0)','transparent']};
export const Badge=React.forwardRef(function Badge({tone='neutral',dot=false,children,className,style},ref){
  const [bg,fg,bd]=T[tone]||T.neutral;
  return <span ref={ref} className={className} data-pencil={tone==='outline'?'box':tone==='inverse'?'shade':'tint'} style={{display:'inline-flex',alignItems:'center',gap:6,minHeight:20,maxWidth:'100%',padding:'3px 6px',background:bg,color:fg,border:'var(--stroke-frame) solid '+bd,borderRadius:'var(--radius-1)',
    font:'var(--fw-medium) 10.5px/1.2 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',...style}}>
    {dot&&<span data-pencil="shade" style={{width:6,height:6,background:'currentColor',flex:'none'}}/>}{children}
  </span>;
});
