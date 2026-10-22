import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { MatitaProvider, Button, IconButton, Input, Checkbox, Textarea, Select, Radio, Switch, Card, Divider, Badge, Tabs, TabList, Tab, TabPanel, Tooltip, Dialog, Frame, Hatch, SectionLabel, Dimension, Callout, Tweaks } from '@matita/ui';

/* Local-only inspection aid (not part of the library): enlarges the page content to check line detail.
   It renders only on localhost or with ?dev, so a hosted demo never shows it. */
const DEV = typeof location !== 'undefined' && (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.search.includes('dev'));
function DevZoom() {
  const [z, setZ] = useState(1);
  return (
    <label style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 50, display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: 'var(--m-paper-0)', boxShadow: '0 0 0 1px var(--m-line)', font: '500 11px/1 var(--m-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
      Dev zoom
      <input type="range" min="1" max="4" step="0.25" value={z} onChange={e => { const v = Number(e.target.value); setZ(v); document.querySelector('main').style.zoom = v; }} />
      {Math.round(z * 100)}%
    </label>
  );
}

function App() {
  const [dlg, setDlg] = useState(false);
  return (
    <MatitaProvider mode="ink" grid="lines">
      <Tweaks />
      {DEV && <DevZoom />}
      <main>
        <h1>@matita/ui · milestone 1</h1>
        <section>
          <SectionLabel index="01" rule>Drafting motifs</SectionLabel>
          <div className="stack" style={{ marginTop: 20 }}>
            <Frame label="Sheet A-201" meta="Rev. C · 1:50" marks>
              <p style={{ margin: 0 }}>A framed section: a drawn border, registration crosses and a title-block tab on the top edge.</p>
            </Frame>
            <Frame label="Ticks" meta="marks=ticks" marks="ticks" tone="blue"><p style={{ margin: 0 }}>A plain border with detached ticks outside each corner.</p></Frame>
            <Frame label="Optional" dashed><p style={{ margin: 0 }}>A dashed frame marks optional or provisional areas.</p></Frame>
            <div style={{ position: 'relative', padding: '0 16px' }}>
              <Dimension label="6 400 mm" tone="blue" />
            </div>
            <div className="row" style={{ alignItems: 'stretch' }}>
              <Hatch label="IMG 16:9" style={{ flex: 1 }} />
              <Hatch pattern="cross" style={{ flex: 1 }} />
              <Hatch pattern="blue" label="CTA" style={{ flex: 1 }} />
              <Hatch pattern="earth" style={{ flex: 1 }} />
              <Hatch pattern="gravel" style={{ flex: 1 }} />
              <Hatch pattern="poche" style={{ flex: 1 }} />
            </div>
            <Callout n="1" title="Pin a comment" leader>Pin a comment to grid line C/4.</Callout>
            <Callout n="2" title="Redline" tone="red">Review marks and errors only.</Callout>
            <Divider dashed />
          </div>
        </section>
        <section>
          <h2>Card, Divider and Badge</h2>
          <Card as="article">
            <div className="row"><strong>Drafting grid</strong><Badge>draft</Badge><Badge tone="accent">new</Badge></div>
            <Divider />
            <p style={{ margin: 0 }}>A card is a drawn frame and a paper fill behind ordinary content.</p>
          </Card>
        </section>
        <section>
          <h2>Tabs</h2>
          <Tabs defaultValue="draw">
            <TabList><Tab value="draw">Draw</Tab><Tab value="ink">Ink</Tab><Tab value="erase">Erase</Tab></TabList>
            <TabPanel value="draw">Rule it first, then sketch over it.</TabPanel>
            <TabPanel value="ink">Pick a pen and go over the lines.</TabPanel>
            <TabPanel value="erase">Rub out the guide lines.</TabPanel>
          </Tabs>
        </section>
        <section>
          <h2>Tooltip and Dialog</h2>
          <div className="row">
            <Tooltip content="Saves the drawing"><Button>Hover or focus me</Button></Tooltip>
            <Button variant="primary" onClick={() => setDlg(true)}>Open dialog</Button>
          </div>
          <Dialog open={dlg} onClose={() => setDlg(false)} title="Discard drawing?">
            <p style={{ marginTop: 0 }}>This removes the sketch. Escape or a click outside closes it too.</p>
            <div className="row"><Button onClick={() => setDlg(false)}>Cancel</Button><Button variant="primary" onClick={() => setDlg(false)}>Discard</Button></div>
          </Dialog>
        </section>
        <section>
          <h2>Per-component attributes</h2>
          <div className="row">
            <Button mode="pencil">Pencil</Button>
            <Button mode="blueprint">Blueprint</Button>
            <Button stroke={3}>Stroke 3</Button>
            <Button rough={0}>Clean</Button>
            <Frame grid="dots" label="grid=dots" style={{ flex: 1, minWidth: 180 }}>Frame grid</Frame>
          </div>
        </section>
        <section>
          <h2>Button</h2>
          <div className="row">
            <Button>Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="accent">Accent</Button>
            <Button disabled>Disabled</Button>
            <IconButton label="Close">✕</IconButton>
          </div>
        </section>
        <section>
          <h2>Input</h2>
          <div className="stack">
            <Input label="Name" placeholder="Ada Lovelace" hint="Your name as it should appear." />
            <Input label="Email" type="email" placeholder="ada@example.com" />
          </div>
        </section>
        <section>
          <h2>Textarea and Select</h2>
          <div className="stack">
            <Textarea label="Message" placeholder="Write something…" />
            <Select label="Pen" defaultValue="hb"><option value="hb">HB</option><option value="2b">2B</option><option value="4b">4B</option></Select>
          </div>
        </section>
        <section>
          <h2>Radio and Switch</h2>
          <div className="stack">
            <Radio name="size" defaultChecked>Small</Radio>
            <Radio name="size">Medium</Radio>
            <Radio name="size" disabled>Large (disabled)</Radio>
            <Switch defaultChecked>Show grid</Switch>
            <Switch>Paper grain</Switch>
          </div>
        </section>
        <section>
          <h2>Checkbox</h2>
          <div className="stack">
            <Checkbox defaultChecked>Sketch the borders</Checkbox>
            <Checkbox>Keep text crisp</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
          </div>
        </section>
      </main>
    </MatitaProvider>
  );
}
createRoot(document.getElementById('root')).render(<App />);
