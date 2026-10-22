import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import {
  MatitaProvider, Tweaks, Button, IconButton, Badge, Tag, Card, Icon, Input, Select, Checkbox, Radio, Switch, Tabs, Breadcrumb,
  Pagination, Menu, Stepper, Table, Dialog, Toast, Tooltip, Frame, Hatch, SectionLabel, Dimension, Callout, Divider,
} from '@matita/ui';

/* Local-only inspection aid (not part of the library): enlarges the page content to check line detail.
   It renders only on localhost or with ?dev, so a hosted demo never shows it. */
const DEV = typeof location !== 'undefined' && (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.search.includes('dev'));
function DevZoom() {
  const [z, setZ] = useState(1);
  return (
    <label style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 50, display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: 'var(--paper-0)', boxShadow: '0 0 0 1px var(--line-1)', font: '500 11px/1 var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
      Dev zoom
      <input type="range" min="1" max="4" step="0.25" value={z} onChange={e => { const v = Number(e.target.value); setZ(v); document.querySelector('main').style.zoom = v; }} />
      {Math.round(z * 100)}%
    </label>
  );
}

const Row = ({ children, style }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', ...style }}>{children}</div>;
const Section = ({ n, title, children }) => (
  <section style={{ display: 'grid', gap: 20 }}>
    <SectionLabel index={n} rule>{title}</SectionLabel>
    {children}
  </section>
);

function App() {
  const [dlg, setDlg] = useState(false), [tag, setTag] = useState(true), [picked, setPicked] = useState(null), [tab, setTab] = useState('plan');
  return (
    <MatitaProvider mode="ink" grid="lines">
      <Tweaks />
      {DEV && <DevZoom />}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 96px', display: 'grid', gap: 48 }}>
        <h1 style={{ font: 'var(--type-display)', fontSize: 40, letterSpacing: 'var(--tracking-display)' }}>@matita/ui</h1>

        <Section n="01" title="Sheet">
          <Frame label="Fig. 01 — Ink" meta="0.25 mm">
            <div style={{ display: 'grid', gap: 18 }}>
              <SectionLabel index="A-101" tone="accent">Ground floor</SectionLabel>
              <h2 style={{ font: 'var(--type-heading)' }}>Issue for construction</h2>
              <Row><Badge tone="accent">Rev. C</Badge><Badge tone="danger">Redline</Badge><Badge tone="outline">1:100</Badge></Row>
              <Row><Button>Issue set</Button><Button variant="secondary">Preview</Button></Row>
            </div>
          </Frame>
          <Input label="Drawn by" defaultValue="I. Marlowe" />
          <Row style={{ gap: 28 }}>
            <Checkbox label="Grid" defaultChecked />
            <Radio defaultValue="hb" direction="row" options={[{ value: 'hb', label: 'HB' }, { value: '2h', label: '2H' }]} />
            <Switch label="Snap" defaultChecked />
            <Tabs variant="segmented" defaultValue="plan" items={[{ id: 'plan', label: 'Plan' }, { id: 'section', label: 'Section' }]} />
          </Row>
          <Row><Hatch ratio="3/1" style={{ flex: 1 }} /><Hatch pattern="cross" ratio="3/1" style={{ flex: 1 }} /><Hatch pattern="poche" ratio="3/1" style={{ flex: 1 }} /></Row>
          <Dimension label="18.00 M" tone="blue" />
        </Section>

        <Section n="02" title="Buttons, tags, badges">
          <Row>
            <Button>Primary</Button><Button variant="accent">Accent</Button><Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button><Button variant="link">Link</Button><Button disabled>Disabled</Button>
            <Button icon="arrow-right" variant="secondary">With icon</Button>
          </Row>
          <Row><IconButton icon="search" label="Search" /><IconButton icon="settings" label="Settings" variant="primary" /><IconButton icon="x" label="Close" variant="ghost" /><Icon name="ruler" size={24} /></Row>
          <Row>
            <Badge>Neutral</Badge><Badge tone="accent">Accent</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge><Badge tone="outline">Outline</Badge><Badge tone="inverse">Inverse</Badge>
          </Row>
          <Row><Tag>Plain</Tag><Tag selected={tag} onClick={() => setTag(t => !t)}>Toggle</Tag><Tag onRemove={() => {}}>Removable</Tag></Row>
        </Section>

        <Section n="03" title="Forms">
          <Row style={{ alignItems: 'flex-start' }}>
            <Input label="Name" placeholder="Ada Lovelace" hint="Your name as it should appear." style={{ flex: 1, minWidth: 220 }} />
            <Input label="Email" icon="mail" placeholder="ada@example.com" error="Not a valid address." style={{ flex: 1, minWidth: 220 }} />
          </Row>
          <Row><Select label="Pen" defaultValue="hb" options={['HB', '2B', '4B'].map(v => ({ value: v.toLowerCase(), label: v }))} style={{ width: 200 }} /></Row>
        </Section>

        <Section n="04" title="Navigation">
          <Tabs value={tab} onChange={setTab} numbered items={[{ id: 'plan', label: 'Plan' }, { id: 'review', label: 'Review' }, { id: 'issue', label: 'Issue' }]} />
          <Breadcrumb items={[{ label: 'Sheets', href: '#' }, { label: 'A-201', href: '#' }, { label: 'Rev. C' }]} />
          <Pagination count={12} defaultPage={5} />
          <Stepper current={1} steps={[{ label: 'Upload', meta: 'PDF, DWG' }, { label: 'Review', meta: '2 of 4' }, { label: 'Issue' }]} />
          <Row style={{ alignItems: 'flex-start' }}>
            <Menu trigger={<Button variant="secondary">Actions</Button>} onSelect={setPicked} items={[
              { heading: 'Sheet' }, { id: 'open', label: 'Open', icon: 'folder-open', shortcut: '↵' }, { id: 'copy', label: 'Copy link', icon: 'link' },
              { divider: true }, { id: 'del', label: 'Delete', icon: 'trash', danger: true }]} />
            <span>Picked: {picked ?? 'nothing yet'}</span>
          </Row>
        </Section>

        <Section n="05" title="Data and feedback">
          <Table caption="Sheet index" columns={[{ key: 'id', label: 'No.', mono: true }, { key: 'title', label: 'Title' }, { key: 'rev', label: 'Rev.', align: 'right', mono: true }]}
            rows={[{ id: 'A-101', title: 'Ground floor plan', rev: 'C' }, { id: 'A-201', title: 'Sections', rev: 'B' }, { id: 'A-301', title: 'Elevations', rev: 'A' }]} />
          <Toast tone="success" title="Sheet exported" onClose={() => {}}>A-201.pdf · 2.4 MB</Toast>
          <Toast tone="danger" title="Export failed">The file is locked by another reviewer.</Toast>
          <Row>
            <Tooltip content="Saves the drawing"><Button variant="secondary">Hover me</Button></Tooltip>
            <Button onClick={() => setDlg(true)}>Open dialog</Button>
          </Row>
          <Dialog open={dlg} eyebrow="Confirm" title="Discard drawing?" onClose={() => setDlg(false)}
            footer={<><Button variant="ghost" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={() => setDlg(false)}>Discard</Button></>}>
            This removes the sketch. It cannot be undone.
          </Dialog>
        </Section>

        <Section n="06" title="Cards, callouts, dividers">
          <Row style={{ alignItems: 'stretch' }}>
            <Card eyebrow="Review" title="Pin a comment" style={{ flex: 1, minWidth: 220 }}>Pin a comment to grid line C/4.</Card>
            <Card eyebrow="Interactive" title="Hover lifts" interactive style={{ flex: 1, minWidth: 220 }}>The card lifts onto a plate.</Card>
          </Row>
          <Callout n="1" title="Pin a comment" leader>Pin a comment to grid line C/4.</Callout>
          <Callout n="2" title="Redline" tone="red">Review marks and errors only.</Callout>
          <Divider variant="dashed" />
          <Divider label="Section" />
        </Section>
      </main>
    </MatitaProvider>
  );
}
createRoot(document.getElementById('root')).render(<App />);
