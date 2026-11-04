import React from 'react';
import { CornerMarks } from '../drafting/CornerMarks.jsx';
import { IconButton } from '../core/IconButton.jsx';
export const Dialog=React.forwardRef(function Dialog({open=true,onClose,eyebrow,title,children,footer,width=480,inline=false,marks=true,className},ref){
  const pr=React.useRef(null);const tid=React.useId();
  const setRef=React.useCallback(n=>{pr.current=n;if(typeof ref==='function')ref(n);else if(ref)ref.current=n;},[ref]);
  /* focus moves into the dialog and comes back to where it was when it closes */
  React.useEffect(()=>{if(!open||inline)return;const prev=document.activeElement;const p=pr.current;if(p&&!p.contains(document.activeElement))p.focus();return()=>{prev&&prev.focus&&prev.focus();};},[open,inline]);
  const key=e=>{
    if(e.key==='Escape'&&onClose){e.stopPropagation();onClose();return;}
    if(e.key!=='Tab'||inline)return;
    const f=[...pr.current.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    if(!f.length){e.preventDefault();return;}
    const a=document.activeElement;
    if(e.shiftKey&&(a===f[0]||a===pr.current)){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&a===f[f.length-1]){e.preventDefault();f[0].focus();}
  };
  if(!open) return null;
  const panel=<div ref={setRef} className={className} role="dialog" tabIndex={-1} aria-labelledby={title?tid:undefined} onKeyDown={key} data-pencil={marks?undefined:'box'} aria-modal="true" onClick={e=>e.stopPropagation()} style={{position:'relative',outline:0,display:'flex',flexDirection:'column',width:typeof width==='number'?'min('+width+'px,100%)':width,maxHeight:'100%',background:'var(--paper-0)',border:marks?'0':'var(--stroke-frame) solid var(--ink-1)',boxShadow:'var(--shadow-plate)'}}>
    {marks&&<CornerMarks overshoot="top-left"/>}
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,padding:'20px 20px 0 24px'}}>
      <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:4}}>
        {eyebrow&&<span style={{font:'var(--fw-medium) 11px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--blue-500)'}}>{eyebrow}</span>}
        {title&&<h3 id={tid} style={{margin:0,font:'var(--fw-medium) 22px/1.2 var(--font-sans)',letterSpacing:'-0.02em',color:'var(--ink-1)'}}>{title}</h3>}
      </div>
      {onClose&&<IconButton icon="x" label="Close" variant="ghost" size="sm" onClick={onClose}/>}
    </div>
    <div style={{padding:'14px 24px 24px',minHeight:0,overflowY:'auto',font:'var(--fw-regular) 15px/1.55 var(--font-sans)',color:'var(--text-body)'}}>{children}</div>
    {footer&&<div data-pencil="rule-t rule-light dashed" style={{display:'flex',justifyContent:'flex-end',gap:8,padding:'14px 24px',borderTop:'var(--stroke-frame) dashed var(--line-1)',background:'var(--paper-1)'}}>{footer}</div>}
  </div>;
  if(inline) return panel;
  return <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:'var(--z-overlay)',display:'flex',alignItems:'center',justifyContent:'center',padding:'clamp(12px,4vw,24px)',
    background:'color-mix(in srgb,var(--surface-page) 78%,transparent)',backdropFilter:'blur(2px)',backgroundImage:'var(--hatch-45)'}}>{panel}</div>;
});
