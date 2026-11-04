import * as React from 'react';
import { Button, Input, Select, Checkbox, Table, Menu, Dialog, Tabs, Icon, MatitaProvider, useMatita, Tweaks, Card } from '../../src/index';

const btn = React.createRef<HTMLButtonElement>();
const inp = React.createRef<HTMLInputElement>();

export const ok = (
  <MatitaProvider mode="pencil" hand="sketchy" lineWeight={1.5}>
    <Tweaks floating />
    <Button ref={btn as any} variant="accent" size="lg" icon="check" className="x" onClick={() => {}} aria-label="save">Save</Button>
    <Button href="/a" mode="blueprint">Link</Button>
    <Button variant="danger" loading disabled>Delete</Button>
    <Input ref={inp} label="Name" error="Required" size="sm" onChange={e => e.target.value} />
    <Select options={['a', { value: 'b', label: 'B' }]} onChange={v => v.toUpperCase()} />
    <Checkbox label="x" onChange={on => on === true} />
    <Tabs items={['a', { id: 'b', label: 'B', count: 2 }]} variant="segmented" onChange={id => id.toUpperCase()} />
    <Table columns={[{ key: 'n', label: 'N', render: (r: { n: number }) => r.n }]} rows={[{ id: 1, n: 1 }]} />
    <Menu items={[{ label: 'A', danger: true }, { divider: true }]} trigger={<Button>m</Button>} />
    <Dialog title="T" onClose={() => {}} footer={<Button>ok</Button>} />
    <Card title="c" interactive padding={16} />
    <Icon name="check" size={20} />
  </MatitaProvider>
);
export const cfg = () => useMatita().set({ mode: 'blueprint' });

// @ts-expect-error unknown variant
export const bad1 = <Button variant="nope" />;
// @ts-expect-error unknown mode
export const bad2 = <Card mode="neon" />;
// @ts-expect-error icon needs a name
export const bad3 = <Icon />;
