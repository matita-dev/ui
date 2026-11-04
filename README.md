# Matita UI

Pencil-style React components. Text and behavior stay crisp and accessible; borders, fills and checks are drawn by code, so the same component looks the same every time. 35 components, three modes (ink, pencil, blueprint), responsive from 320px up.

Part of [Matita](https://matita.dev), next to [`@matita/icons`](https://github.com/matita-dev/icons).

## Install

```sh
npm i @matita/ui @matita/icons react
```

React 18 or newer. The package ships its own TypeScript types.

## Use

Import the stylesheet once, and wrap the app in `MatitaProvider`:

```jsx
import '@matita/ui/ui.css';
import { MatitaProvider, Button, Card, Input, Tabs } from '@matita/ui';

export default function App() {
  return (
    <MatitaProvider mode="pencil">
      <Card>
        <Input label="Email" placeholder="you@example.com" />
        <Button>Save</Button>
      </Card>
    </MatitaProvider>
  );
}
```

### Modes

`ink` (clean lines), `pencil` (loose pencil linework) and `blueprint`. Set the mode on the provider, change it later with `useMatita().set({ mode })`, or give a single component its own `mode` prop. `grid`, `hand`, `roughness` and `lineWeight` tune the drawing the same way. `<Tweaks />` is a ready-made control bar for them.

```jsx
const { mode, set } = useMatita();
<Button onClick={() => set({ mode: 'blueprint' })}>Blueprint</Button>
<Card mode="pencil">Always pencil</Card>
```

## Components

- **Core:** Button, IconButton, Badge, Tag, Card, Icon, Divider
- **Forms:** Input, Select, Checkbox, Radio, Switch
- **Navigation:** Tabs, Breadcrumb, Pagination, Menu, Stepper
- **Data and feedback:** Table, Dialog, Toast, Tooltip
- **Drafting:** Frame, GridRails, CornerMarks, Hatch, SectionLabel, Dimension, Callout, Sheet, TitleBlock, ViewTitle, ScaleBar, NorthArrow, LevelMarker, DraftProgress

Every component takes `className`, `style` and `mode`, and forwards its `ref` to the root element.

## Responsive

Components shrink to fit their container and never overflow it. Tables scroll sideways inside their own wrapper, tabs scroll with a fade at the cut edge, pagination drops page numbers to keep one row, a stepper turns vertical when it runs out of room, and menus and select lists open toward the side that has space. On touch screens, hit areas grow to 44px.

## Notes

- `Select` is a custom listbox: `onChange` receives the value, not an event.
- Icons come from `@matita/icons` (peer dependency, 0.3 or newer).

## Licence

MIT
