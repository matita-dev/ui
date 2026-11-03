import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

execFileSync('node', ['scripts/build.mjs'], { stdio: 'ignore' });

/* A DOM for React, set up before react-dom is loaded. */
const dom = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual: true });
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'KeyboardEvent', 'MouseEvent', 'FocusEvent', 'Event'])
  Object.defineProperty(globalThis, k, { value: k === 'window' ? dom.window : k === 'document' ? dom.window.document : dom.window[k] ?? globalThis[k], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.ResizeObserver = class { observe() {} disconnect() {} };

const React = (await import('react')).default;
const { act } = await import('react');
const { createRoot } = await import('react-dom/client');
const ui = await import('../dist/index.js');
const h = React.createElement;

async function mount(el) {
  const box = document.createElement('div'); document.body.appendChild(box);
  const root = createRoot(box);
  await act(async () => { root.render(el); });
  return { box, root };
}
const key = (el, k, extra = {}) => act(async () => { el.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...extra })); });
const click = el => act(async () => { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); });
const $ = (box, sel) => box.querySelector(sel);

test('Button: click calls onClick, disabled does not, ref reaches the button', async () => {
  let n = 0; const ref = React.createRef();
  const { box } = await mount(h('div', null, h(ui.Button, { ref, onClick: () => n++ }, 'go'), h(ui.Button, { disabled: true, onClick: () => { n += 10; } }, 'no')));
  const [a, b] = box.querySelectorAll('button');
  await click(a); await click(b);
  assert.equal(n, 1);
  assert.equal(ref.current, a);
  assert.ok(b.disabled);
});

test('Checkbox: focusable, Space and Enter toggle, disabled does nothing', async () => {
  const seen = [];
  const { box } = await mount(h('div', null, h(ui.Checkbox, { label: 'a', onChange: v => seen.push(v) }), h(ui.Checkbox, { label: 'b', disabled: true, onChange: () => seen.push('bad') })));
  const [a, b] = box.querySelectorAll('[role=checkbox]');
  assert.equal(a.tabIndex, 0); assert.equal(b.tabIndex, -1);
  assert.equal(b.getAttribute('aria-disabled'), 'true');
  await key(a, ' '); assert.equal(a.getAttribute('aria-checked'), 'true');
  await key(a, 'Enter'); assert.equal(a.getAttribute('aria-checked'), 'false');
  await key(b, ' ');
  assert.deepEqual(seen, [true, false]);
});

test('Switch: Space toggles', async () => {
  const { box } = await mount(h(ui.Switch, { label: 'x' }));
  const s = $(box, '[role=switch]');
  assert.equal(s.tabIndex, 0);
  await key(s, ' '); assert.equal(s.getAttribute('aria-checked'), 'true');
});

test('Radio: one tab stop, arrows select and move focus', async () => {
  const got = [];
  const { box } = await mount(h(ui.Radio, { options: ['a', 'b', 'c'], defaultValue: 'a', onChange: v => got.push(v) }));
  const r = [...box.querySelectorAll('[role=radio]')];
  assert.deepEqual(r.map(x => x.tabIndex), [0, -1, -1]);
  r[0].focus();
  await key(r[0], 'ArrowDown');
  assert.equal(document.activeElement, r[1]);
  assert.deepEqual(got, ['b']);
  assert.equal(r[1].getAttribute('aria-checked'), 'true');
  await key(r[1], 'ArrowUp'); await key(r[0], 'ArrowUp');
  assert.deepEqual(got, ['b', 'a', 'c']); // wraps round
});

test('Tabs: roving tabindex, arrows, Home and End', async () => {
  const got = [];
  const { box } = await mount(h(ui.Tabs, { items: ['one', 'two', 'three'], onChange: v => got.push(v) }));
  const t = [...box.querySelectorAll('[role=tab]')];
  assert.deepEqual(t.map(x => x.tabIndex), [0, -1, -1]);
  t[0].focus();
  await key(t[0], 'ArrowRight'); assert.equal(document.activeElement, t[1]);
  await key(t[1], 'End'); assert.equal(document.activeElement, t[2]);
  await key(t[2], 'Home'); assert.equal(document.activeElement, t[0]);
  assert.deepEqual(got, ['two', 'three', 'one']);
});

test('Input: error sets aria-invalid and describedby, ref is the input', async () => {
  const ref = React.createRef();
  const { box } = await mount(h('div', null,
    h(ui.Input, { ref, label: 'Email', error: 'Required' }),
    h(ui.Input, { label: 'Name', hint: 'As on your ID' }),
    h(ui.Input, { label: 'Plain' })));
  const [a, b, c] = box.querySelectorAll('input');
  assert.equal(ref.current, a);
  assert.equal(a.getAttribute('aria-invalid'), 'true');
  assert.equal(document.getElementById(a.getAttribute('aria-describedby')).textContent, 'Required');
  assert.equal(b.getAttribute('aria-invalid'), null);
  assert.equal(document.getElementById(b.getAttribute('aria-describedby')).textContent, 'As on your ID');
  assert.equal(c.getAttribute('aria-describedby'), null);
});

test('Dialog: takes focus, Escape closes, Tab stays inside, focus returns', async () => {
  const opener = document.createElement('button'); document.body.appendChild(opener); opener.focus();
  let closed = 0;
  const el = open => h(ui.Dialog, { open, title: 'Delete?', onClose: () => closed++, footer: h('button', { id: 'last' }, 'ok') }, h('input', { id: 'first' }));
  const box = document.createElement('div'); document.body.appendChild(box);
  const root = createRoot(box);
  await act(async () => root.render(el(true)));
  const d = $(box, '[role=dialog]');
  assert.ok(d.contains(document.activeElement), 'focus moved into the dialog');
  assert.equal(document.getElementById(d.getAttribute('aria-labelledby')).textContent, 'Delete?');
  assert.equal(d.getAttribute('aria-modal'), 'true');
  const last = $(box, '#last'); last.focus();
  await key(last, 'Tab');
  assert.notEqual(document.activeElement, last);
  assert.ok(d.contains(document.activeElement), 'Tab wraps inside');
  const first = box.querySelectorAll('button')[0]; first.focus();
  await key(first, 'Tab', { shiftKey: true });
  assert.equal(document.activeElement, last, 'Shift+Tab wraps backwards');
  await key(d, 'Escape'); assert.equal(closed, 1);
  await act(async () => root.render(el(false)));
  assert.equal(document.activeElement, opener, 'focus returns to the opener');
});

test('Menu: opens to the first item, arrows move, Escape closes and returns focus', async () => {
  const { box } = await mount(h(ui.Menu, { trigger: h('button', { id: 'trig' }, 'Open'), items: [{ label: 'One' }, { label: 'Two', disabled: true }, { label: 'Three' }] }));
  const trig = $(box, '#trig');
  assert.equal($(box, '[role=menu]'), null);
  trig.focus(); await click(trig);
  const items = [...box.querySelectorAll('[role=menuitem]')];
  assert.equal(document.activeElement, items[0]);
  await key(items[0], 'ArrowDown'); assert.equal(document.activeElement, items[2], 'skips the disabled item');
  await key(items[2], 'ArrowDown'); assert.equal(document.activeElement, items[0], 'wraps');
  await key(items[0], 'End'); assert.equal(document.activeElement, items[2]);
  await key(items[2], 'Escape');
  assert.equal($(box, '[role=menu]'), null);
  assert.equal(document.activeElement, trig);
});

test('Tooltip: shows on focus and describes its trigger', async () => {
  const { box } = await mount(h(ui.Tooltip, { content: 'Saves the file' }, h('button', { id: 'b' }, 'Save')));
  const b = $(box, '#b');
  assert.equal($(box, '[role=tooltip]'), null);
  await act(async () => { b.dispatchEvent(new window.FocusEvent('focusin', { bubbles: true })); });
  const tip = $(box, '[role=tooltip]');
  assert.ok(tip);
  assert.equal(b.getAttribute('aria-describedby'), tip.id);
});

test('focus ring is an outline in every mode (an inline box-shadow cannot hide it)', () => {
  const css = readFileSync('dist/ui.css', 'utf8');
  assert.match(css, /\.m-root :focus-visible\{outline:2px solid var\(--blue-500\)/);
});

test('Button: loading blocks clicks but keeps focus; disabled link loses its href', async () => {
  let n = 0;
  const { box } = await mount(h('div', null,
    h(ui.Button, { loading: true, onClick: () => n++, variant: 'danger' }, 'Delete'),
    h(ui.Button, { href: '/x', disabled: true }, 'Link'),
    h(ui.Button, { href: '/y' }, 'Live')));
  const b = $(box, 'button');
  assert.equal(b.getAttribute('aria-busy'), 'true');
  assert.equal(b.getAttribute('aria-disabled'), 'true');
  assert.equal(b.disabled, false, 'stays focusable');
  assert.ok($(b, '.m-spinner'));
  await click(b); assert.equal(n, 0);
  const [dead, live] = box.querySelectorAll('a');
  assert.equal(dead.getAttribute('href'), null);
  assert.equal(dead.getAttribute('aria-disabled'), 'true');
  assert.equal(dead.tabIndex, -1);
  assert.equal(live.getAttribute('href'), '/y');
});

test('Tag: the remove control is a real button and does not trigger the tag', async () => {
  let removed = 0, clicked = 0;
  const { box } = await mount(h(ui.Tag, { onClick: () => clicked++, onRemove: () => removed++, removeLabel: 'Remove filter' }, 'draft'));
  const r = $(box, 'button');
  assert.equal(r.getAttribute('aria-label'), 'Remove filter');
  await click(r);
  assert.deepEqual([removed, clicked], [1, 0]);
});

test('Table: clickable rows are keyboard reachable, headers have scope', async () => {
  const got = [];
  const { box } = await mount(h(ui.Table, { columns: [{ key: 'n', label: 'Name' }], rows: [{ id: 1, n: 'a' }, { id: 2, n: 'b' }], onRowClick: r => got.push(r.id) }));
  assert.equal($(box, 'th').getAttribute('scope'), 'col');
  const rows = box.querySelectorAll('tbody tr');
  assert.deepEqual([...rows].map(r => r.tabIndex), [0, 0]);
  await key(rows[1], 'Enter'); await key(rows[0], ' ');
  assert.deepEqual(got, [2, 1]);
});

test('reduced motion: transitions and the spinner switch off', () => {
  const css = readFileSync('dist/ui.css', 'utf8');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('transition-duration: .01ms !important'));
  assert.ok(css.includes('.m-spinner { animation: none !important'));
});
