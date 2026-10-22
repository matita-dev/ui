import { withScope } from './provider.jsx';
import * as C from './controls.js';

export { MatitaProvider, Scope, useMatita, withScope, MODES, GRIDS, DEFAULTS } from './provider.jsx';
export { Sketch } from './sketch.jsx';
export { Tweaks } from './tweaks.jsx';

/* Every component below takes the shared look attributes: mode, stroke, rough (and grid where it has a surface). */
export const Button = withScope(C.Button);
export const IconButton = withScope(C.IconButton);
export const Input = withScope(C.Input);
export const Checkbox = withScope(C.Checkbox);
export const Textarea = withScope(C.Textarea);
export const Select = withScope(C.Select);
export const Radio = withScope(C.Radio);
export const Switch = withScope(C.Switch);
export const Card = withScope(C.Card);
export const Divider = withScope(C.Divider);
export const Badge = withScope(C.Badge);
export const Tabs = withScope(C.Tabs);
export const TabList = withScope(C.TabList);
export const Tab = withScope(C.Tab);
export const TabPanel = withScope(C.TabPanel);
export const Tooltip = withScope(C.Tooltip);
export const Dialog = withScope(C.Dialog);
export const Frame = withScope(C.Frame);
export const CornerMarks = withScope(C.CornerMarks);
export const Hatch = withScope(C.Hatch);
export const SectionLabel = withScope(C.SectionLabel);
export const Dimension = withScope(C.Dimension);
export const Callout = withScope(C.Callout);
export const Icon = withScope(C.Icon);
export const Tag = withScope(C.Tag);
export const Breadcrumb = withScope(C.Breadcrumb);
export const Pagination = withScope(C.Pagination);
export const Stepper = withScope(C.Stepper);
export const Menu = withScope(C.Menu);
export const Table = withScope(C.Table);
export const Toast = withScope(C.Toast);
