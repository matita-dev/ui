import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

execFileSync('node', ['scripts/build.mjs'], { stdio: 'ignore' });
const ui = await import('../dist/index.js');

/* The public surface of 0.1.0: nothing ships by accident. */
const PUBLIC = ['Badge', 'Breadcrumb', 'Button', 'Callout', 'Card', 'Checkbox', 'CornerMarks', 'Dialog', 'Dimension', 'Divider', 'DraftProgress', 'DrawingMode', 'Frame',
  'GRIDS', 'GridRails', 'HANDS', 'Hatch', 'Icon', 'IconButton', 'Input', 'LevelMarker', 'MODES', 'MatitaProvider', 'Menu', 'NorthArrow', 'Pagination', 'PencilMode', 'Radio',
  'ScaleBar', 'Scope', 'Sheet', 'Select', 'SectionLabel', 'Stepper', 'Switch', 'Table', 'Tabs', 'Tag', 'TitleBlock', 'Toast', 'Tooltip', 'Tweaks', 'ViewTitle',
  'drawAnim', 'drawingModeContext', 'useMatita', 'withScope'];

test('the package exports exactly the public list', () => {
  assert.deepEqual(Object.keys(ui).sort(), [...PUBLIC].sort());
});

test('index.d.ts ships and declares every exported name', async () => {
  const { readFileSync } = await import('node:fs');
  const d = readFileSync('dist/index.d.ts', 'utf8');
  for (const n of PUBLIC) assert.match(d, new RegExp(`export (const|function) ${n}[:(<]`), n);
});

test('every component takes className on its root', () => {
  const h = React.createElement;
  const cases = {
    Button: h(ui.Button, { className: 'cx' }, 'a'), Badge: h(ui.Badge, { className: 'cx' }, 'a'), Tag: h(ui.Tag, { className: 'cx' }, 'a'), Card: h(ui.Card, { className: 'cx', title: 't' }),
    IconButton: h(ui.IconButton, { className: 'cx', icon: 'check', label: 'l' }), Input: h(ui.Input, { className: 'cx' }), Select: h(ui.Select, { className: 'cx', options: ['a'] }),
    Checkbox: h(ui.Checkbox, { className: 'cx' }), Radio: h(ui.Radio, { className: 'cx', options: ['a'] }), Switch: h(ui.Switch, { className: 'cx' }),
    Tabs: h(ui.Tabs, { className: 'cx', items: ['a'] }), Breadcrumb: h(ui.Breadcrumb, { className: 'cx', items: [{ label: 'a' }] }), Pagination: h(ui.Pagination, { className: 'cx', count: 3 }),
    Stepper: h(ui.Stepper, { className: 'cx', steps: [{ label: 'a' }] }), Menu: h(ui.Menu, { className: 'cx', items: [{ label: 'a' }] }),
    Table: h(ui.Table, { className: 'cx', columns: [{ key: 'a' }], rows: [{ a: 1 }] }), Dialog: h(ui.Dialog, { className: 'cx', inline: true, title: 't' }), Toast: h(ui.Toast, { className: 'cx' }),
    Tooltip: h(ui.Tooltip, { className: 'cx', content: 'c' }, 'x'), Frame: h(ui.Frame, { className: 'cx' }), GridRails: h(ui.GridRails, { className: 'cx' }), Hatch: h(ui.Hatch, { className: 'cx' }),
    SectionLabel: h(ui.SectionLabel, { className: 'cx' }, 'a'), Dimension: h(ui.Dimension, { className: 'cx' }), Callout: h(ui.Callout, { className: 'cx', n: 1 }), Divider: h(ui.Divider, { className: 'cx' }),
    Sheet: h(ui.Sheet, { className: 'cx' }), TitleBlock: h(ui.TitleBlock, { className: 'cx' }), ViewTitle: h(ui.ViewTitle, { className: 'cx' }), ScaleBar: h(ui.ScaleBar, { className: 'cx' }),
    NorthArrow: h(ui.NorthArrow, { className: 'cx' }), LevelMarker: h(ui.LevelMarker, { className: 'cx' }), DraftProgress: h(ui.DraftProgress, { className: 'cx' }),
    Icon: h(ui.Icon, { className: 'cx', name: 'check' }),
  };
  for (const [name, el] of Object.entries(cases)) {
    const html = renderToStaticMarkup(el);
    assert.match(html, /class="[^"]*\bcx\b/, name);
  }
});

test('components forward refs', () => {
  const FORWARD_REF = Symbol.for('react.forward_ref');
  for (const n of ['Button', 'IconButton', 'Badge', 'Tag', 'Card', 'Icon', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Tabs', 'Breadcrumb', 'Pagination', 'Stepper', 'Menu',
    'Table', 'Dialog', 'Toast', 'Tooltip', 'Frame', 'GridRails', 'Hatch', 'SectionLabel', 'Dimension', 'Callout', 'Divider', 'Sheet', 'TitleBlock', 'ViewTitle', 'ScaleBar', 'NorthArrow', 'LevelMarker', 'DraftProgress'])
    assert.equal(ui[n].$$typeof, FORWARD_REF, n); // withScope wraps each one in a forwardRef
});
