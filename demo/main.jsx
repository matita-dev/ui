import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { MatitaProvider, Button, IconButton, Input, Checkbox } from '@matita/ui';

function App() {
  const [rough, setRough] = useState(1);
  return (
    <MatitaProvider rough={rough}>
      <main>
        <h1>@matita/ui · milestone 1</h1>
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
