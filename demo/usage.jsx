import { createRoot } from 'react-dom/client';
import {
  MatitaProvider, Scope, useMatita, MODES, HANDS, Tweaks, Button, Badge, Card, Frame, Input, SectionLabel,
} from '@matita/ui';

/* How the library is used, one step at a time: the code on top, the same code running underneath.
   Each snippet is the real code of its example, kept next to it so the two stay in step. */

const Code = ({ children }) => (
  <pre style={{ margin: 0, padding: 16, overflowX: 'auto', background: 'var(--surface-card)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-control)',
    font: 'var(--fw-regular) 13px/1.6 var(--font-mono)', color: 'var(--text-primary)' }}><code>{children}</code></pre>
);
const Row = ({ children }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>{children}</div>;
const Step = ({ n, title, text, code, children }) => (
  <section style={{ display: 'grid', gap: 16 }}>
    <SectionLabel index={n} rule>{title}</SectionLabel>
    <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: '62ch' }}>{text}</p>
    <Code>{code}</Code>
    <Frame label="Result">{children}</Frame>
  </section>
);

const SHEET = (
  <div style={{ display: 'grid', gap: 16 }}>
    <Input label="Drawn by" defaultValue="I. Marlowe" />
    <Row><Badge tone="accent">Issued</Badge><Button>Issue set</Button><Button variant="secondary" icon="arrow-right">Preview</Button></Row>
  </div>
);

/* step 3: the look, changed from your own code */
function Controls() {
  const { mode, hand, lineWeight, set, redraw } = useMatita();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Row>
        {MODES.map(m => <Button key={m} variant={m === mode ? 'primary' : 'secondary'} onClick={() => set({ mode: m })}>{m}</Button>)}
      </Row>
      <Row>
        {HANDS.map(h => <Button key={h} variant={h === hand ? 'primary' : 'secondary'} onClick={() => set({ hand: h })}>{h}</Button>)}
        <Button variant="secondary" onClick={() => set({ lineWeight: lineWeight === 1 ? 2 : 1 })}>Line {lineWeight === 1 ? 'thin' : 'thick'}</Button>
        <Button variant="ghost" onClick={redraw}>Redraw</Button>
      </Row>
    </div>
  );
}

/* Steps 1 and 2 follow the Tweaks panel: the props shown are the ones the page is using right now. */
const num = n => String(Math.round(n * 10) / 10);
function props(cfg, all) {
  const dflt = cfg.mode === 'pencil' ? 'sketchy' : 'clean';
  const p = [`mode="${cfg.mode}"`, `grid="${cfg.grid}"`];
  if (all || cfg.hand !== dflt) p.push(`hand="${cfg.hand}"`);
  if (all || cfg.lineWeight !== 1) p.push(`lineWeight={${num(cfg.lineWeight)}}`);
  if (all) p.push(`roughness={${num(cfg.roughness)}}`);
  return p.join(' ');
}
const step1 = cfg => `import { MatitaProvider, Tweaks, Frame, Input, Badge, Button } from '@matita/ui';
import '@matita/ui/ui.css';

export default function App() {
  return (
    <MatitaProvider ${props(cfg)}>
      <Tweaks floating />   {/* optional: a live panel for mode, grid, hand, line and redraw */}
      <Frame label="Fig. 01">
        <Input label="Drawn by" defaultValue="I. Marlowe" />
        <Badge tone="accent">Issued</Badge>
        <Button>Issue set</Button>
        <Button variant="secondary" icon="arrow-right">Preview</Button>
      </Frame>
    </MatitaProvider>
  );
}`;
const step2 = cfg => `<MatitaProvider ${props(cfg, true)}>
  …
</MatitaProvider>`;

const STEP3 = `import { useMatita, MODES, HANDS } from '@matita/ui';

function Controls() {
  const { mode, hand, lineWeight, set, redraw } = useMatita();
  return (
    <>
      {MODES.map(m => (
        <Button key={m} variant={m === mode ? 'primary' : 'secondary'} onClick={() => set({ mode: m })}>{m}</Button>
      ))}
      {HANDS.map(h => (
        <Button key={h} variant={h === hand ? 'primary' : 'secondary'} onClick={() => set({ hand: h })}>{h}</Button>
      ))}
      <Button onClick={() => set({ lineWeight: lineWeight === 1 ? 2 : 1 })}>Line</Button>
      <Button variant="ghost" onClick={redraw}>Redraw</Button>
    </>
  );
}`;

const STEP4 = `<Button>Page mode</Button>
<Button mode="pencil">Pencil</Button>
<Button mode="blueprint">Blueprint</Button>`;

const STEP5 = `<Scope mode="blueprint">
  <Card>
    <Input label="Sheet" defaultValue="A-101" />
  </Card>
</Scope>`;

function Page() {
  const cfg = useMatita();
  return (
    <>
      <Tweaks floating />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 96px', display: 'grid', gap: 48 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <h1 style={{ margin: 0, font: 'var(--type-display)', fontSize: 40, letterSpacing: 'var(--tracking-display)' }}>Using @matita/ui</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: '62ch' }}>
            Wrap the app once. The mode, the grid and the hand then apply to every component, and the provider is the page itself:
            its background changes with the mode. Use the Tweaks panel in the bottom-right corner to change the look of this page: the code below follows it.
          </p>
          <a href="index.html" style={{ font: 'var(--fw-medium) 11px/1 var(--font-mono)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>All components →</a>
        </div>

        <Step n="01" title="Wrap the app" code={step1(cfg)}
          text="MatitaProvider renders the page surface. mode is ink, pencil or blueprint; grid is none, lines or dots. Both are starting values.">
          {SHEET}
        </Step>

        <Step n="02" title="Set the hand" code={step2(cfg)}
          text="Every setting, as the page uses it now. hand is sketchy or clean in any mode; left out, it follows the mode (sketchy in pencil, clean in ink and blueprint). lineWeight (0.5 to 3) sets the line thickness in every mode, and roughness (0 to 1) how loose the hand is.">
          {SHEET}
        </Step>

        <Step n="03" title="Change the look from code" code={STEP3}
          text="useMatita() gives you the current settings and set(). redraw() draws the sketchy lines again with new strokes. This changes the whole page, so try it.">
          <Controls />
        </Step>

        <Step n="04" title="One component in its own mode" code={STEP4}
          text="Every component takes a mode. It renders in that mode and leaves the page as it is.">
          <Row><Button>Page mode</Button><Button mode="pencil">Pencil</Button><Button mode="blueprint">Blueprint</Button></Row>
        </Step>

        <Step n="05" title="A block in its own mode" code={STEP5}
          text="Scope gives its children a mode. It adds no box of its own, so the block keeps this page's background; put a Frame or Card around it to see the mode's paper.">
          <Scope mode="blueprint"><Card><Input label="Sheet" defaultValue="A-101" /></Card></Scope>
        </Step>
      </main>
    </>
  );
}

const App = () => <MatitaProvider mode="ink" grid="lines"><Page /></MatitaProvider>;

createRoot(document.getElementById('root')).render(<App />);
