import { createContext, useContext, useId, useRef, useState } from 'react';
import { Sketch } from './sketch.jsx';

const Ctx = createContext(null);

/** Tabs with automatic activation. Arrow keys, Home and End move focus and selection; only the selected tab is in the
    tab order. Works controlled (`value`, `onValueChange`) or not (`defaultValue`). */
export function Tabs({ value, defaultValue, onValueChange, className = '', children, ...rest }) {
  const base = useId(), [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const select = v => { if (value === undefined) setInner(v); onValueChange?.(v); };
  return (
    <Ctx.Provider value={{ current, select, base }}>
      <div className={'m-tabs ' + className} {...rest}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabList({ className = '', children, ...rest }) {
  const ref = useRef(null);
  const onKeyDown = e => {
    const tabs = [...ref.current.querySelectorAll('[role="tab"]:not(:disabled)')];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); tabs[next].focus(); tabs[next].click();
  };
  return (
    <div ref={ref} role="tablist" className={'m-tablist ' + className} onKeyDown={onKeyDown} {...rest}>
      <span className="m-tablist-rule"><Sketch shape="line" /></span>
      {children}
    </div>
  );
}

export function Tab({ value, className = '', children, ...rest }) {
  const { current, select, base } = useContext(Ctx), on = current === value;
  return (
    <button type="button" role="tab" id={`${base}-tab-${value}`} aria-selected={on} aria-controls={`${base}-panel-${value}`}
      tabIndex={on ? 0 : -1} className={'m-tab ' + className} onClick={() => select(value)} {...rest}>
      <span className="m-tab-label">{children}</span>
      {on && <span className="m-tab-mark"><Sketch shape="line" /></span>}
    </button>
  );
}

export function TabPanel({ value, className = '', children, ...rest }) {
  const { current, base } = useContext(Ctx);
  return (
    <div role="tabpanel" id={`${base}-panel-${value}`} aria-labelledby={`${base}-tab-${value}`} hidden={current !== value}
      tabIndex={0} className={'m-tabpanel ' + className} {...rest}>{children}</div>
  );
}
