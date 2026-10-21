import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { MatitaProvider, Button, IconButton, Input, Checkbox, Textarea, Select, Radio, Switch, Card, Divider, Badge } from '@matita/ui';

function App() {
  const [rough, setRough] = useState(1);
  return (
    <MatitaProvider rough={rough}>
      <main>
        <h1>@matita/ui · milestone 1</h1>
        <section>
          <h2>Card, Divider and Badge</h2>
          <Card as="article">
            <div className="row"><strong>Drafting grid</strong><Badge>draft</Badge><Badge tone="accent">new</Badge></div>
            <Divider />
            <p style={{ margin: 0 }}>A card is a drawn frame and a paper fill behind ordinary content.</p>
          </Card>
        </section>
        <section>
          <h2>Roughness</h2>
          <Checkbox checked={rough > 0} onChange={e => setRough(e.target.checked ? 1 : 0)}>Sketchy (off = clean lines)</Checkbox>
        </section>
        <section>
          <h2>Button</h2>
          <div className="row">
            <Button>Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button pill>Pill</Button>
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
