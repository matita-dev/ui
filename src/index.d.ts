import * as React from 'react';

export type Mode = 'ink' | 'pencil' | 'blueprint';
export type Grid = 'none' | 'lines' | 'dots';
export type Hand = 'sketchy' | 'clean';
export type Tone = 'ink' | 'blue' | 'red';

export const MODES: readonly Mode[];
export const GRIDS: readonly Grid[];
export const HANDS: readonly Hand[];

/* ---- Provider, scope, hooks ---- */

export interface MatitaProviderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Starting mode. Default 'ink'. */
  mode?: Mode;
  /** Construction grid behind the page. Default 'none'. */
  grid?: Grid;
  /** 'sketchy' draws the lines by hand in any mode; left out it follows the mode (sketchy in pencil, clean otherwise). */
  hand?: Hand;
  /** How loose the hand is, 0 to 1. Default 1. */
  roughness?: number;
  /** How heavy the lines are, 0.5 to 3. Default 1. */
  lineWeight?: number;
  /** Animate mode changes. Default true. */
  animate?: boolean;
  /** Draw the lines in when the page first mounts. Default false. */
  drawOnMount?: boolean;
  lettering?: string;
  children?: React.ReactNode;
}
export function MatitaProvider(props: MatitaProviderProps): React.JSX.Element;

export interface MatitaSettings {
  mode: Mode;
  grid: Grid;
  hand: Hand;
  roughness: number;
  lineWeight: number;
  /** Change any of the settings later. */
  set(patch: Partial<Pick<MatitaSettings, 'mode' | 'grid' | 'hand' | 'roughness' | 'lineWeight'>>): void;
  /** Re-draft the pencil linework. */
  redraw(): void;
}
export function useMatita(): MatitaSettings;

export function Scope(props: { mode?: Mode; children?: React.ReactNode }): React.JSX.Element;

export type WithMode<P> = P & {
  /** Render this component in its own mode (ink, pencil or blueprint). */
  mode?: Mode;
};
export function withScope<P>(Component: React.ComponentType<P>): React.ForwardRefExoticComponent<WithMode<P>>;

export interface TweaksProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  controls?: Array<'mode' | 'grid' | 'hand' | 'line' | 'redraw'>;
  title?: React.ReactNode;
  /** Stick to the top of the page. Default true. */
  sticky?: boolean;
  /** A foldable panel in the bottom-right corner instead of a bar. */
  floating?: boolean;
}
export function Tweaks(props: TweaksProps): React.JSX.Element;

export const DrawingMode: React.ComponentType<any>;
export const drawingModeContext: React.Context<Mode>;
export function drawAnim(axis: 'h' | 'v' | 's' | 'p', delay?: number): React.CSSProperties;

/* ---- Shared shapes. Every component takes `className`, `style` and `mode`, and passes a `ref` to its root element
   (Input and Select give it to the inner <input> / <select>). ---- */

type Size = 'sm' | 'md' | 'lg';
type Base<El extends HTMLElement> = { className?: string; style?: React.CSSProperties; ref?: React.Ref<El>; children?: React.ReactNode };
type Native<El extends HTMLElement, Own> = Omit<React.HTMLAttributes<El>, keyof Own | 'children'> & Own;

/* ---- Core ---- */

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'link';
export interface ButtonOwn extends Base<HTMLElement> {
  variant?: ButtonVariant;
  size?: Size;
  /** Icon name from @matita/icons, shown before the label. */
  icon?: string;
  /** Icon name from @matita/icons, shown after the label. */
  iconRight?: string;
  /** Native disabled: not focusable, not clickable. On a link (`href`) it removes the href and sets aria-disabled. */
  disabled?: boolean;
  /** Shows a spinner and blocks clicks but stays focusable (aria-busy, aria-disabled). */
  loading?: boolean;
  fullWidth?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
}
export const Button: React.ForwardRefExoticComponent<WithMode<Native<HTMLElement, ButtonOwn>>>;

export interface IconButtonOwn extends Base<HTMLButtonElement> {
  icon: string;
  /** Accessible name; also the tooltip. */
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export const IconButton: React.ForwardRefExoticComponent<WithMode<Native<HTMLButtonElement, IconButtonOwn>>>;

export interface BadgeOwn extends Base<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'inverse';
  dot?: boolean;
}
export const Badge: React.ForwardRefExoticComponent<WithMode<BadgeOwn>>;

export interface TagOwn extends Base<HTMLSpanElement> {
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  /** Shows a remove button. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Default 'Remove'. */
  removeLabel?: string;
}
export const Tag: React.ForwardRefExoticComponent<WithMode<TagOwn>>;

export interface CardOwn extends Base<HTMLElement> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  /** Drafting corner marks instead of a border. */
  marks?: boolean;
  interactive?: boolean;
  /** Renders an <a> instead of a <div>. */
  href?: string;
  padding?: number | string;
}
export const Card: React.ForwardRefExoticComponent<WithMode<CardOwn>>;

export interface IconOwn extends Omit<React.SVGAttributes<SVGSVGElement>, 'name' | 'color'> {
  /** Icon name from @matita/icons. */
  name: string;
  size?: number;
  color?: string;
  seed?: number;
}
export const Icon: React.ForwardRefExoticComponent<WithMode<IconOwn> & React.RefAttributes<SVGSVGElement>>;

/* ---- Forms ---- */

export interface InputOwn extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'className'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message; also turns the field red. */
  error?: React.ReactNode;
  icon?: string;
  suffix?: React.ReactNode;
  size?: Size;
  /** Applied to the wrapping <label>. */
  className?: string;
  style?: React.CSSProperties;
}
export const Input: React.ForwardRefExoticComponent<WithMode<InputOwn> & React.RefAttributes<HTMLInputElement>>;

export type Option = string | { value: string; label: React.ReactNode };

export interface SelectOwn {
  label?: React.ReactNode;
  options?: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export const Select: React.ForwardRefExoticComponent<WithMode<SelectOwn> & React.RefAttributes<HTMLSelectElement>>;

export interface CheckboxOwn extends Base<HTMLLabelElement> {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
export const Checkbox: React.ForwardRefExoticComponent<WithMode<CheckboxOwn>>;

export interface RadioOwn extends Base<HTMLDivElement> {
  options?: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  direction?: 'row' | 'column';
}
export const Radio: React.ForwardRefExoticComponent<WithMode<RadioOwn>>;

export interface SwitchOwn extends Base<HTMLLabelElement> {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
export const Switch: React.ForwardRefExoticComponent<WithMode<SwitchOwn>>;

/* ---- Navigation ---- */

export interface TabItem { id: string; label: React.ReactNode; count?: number }
export interface TabsOwn extends Base<HTMLDivElement> {
  items?: Array<string | TabItem>;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'segmented';
  numbered?: boolean;
}
export const Tabs: React.ForwardRefExoticComponent<WithMode<TabsOwn>>;

export interface BreadcrumbItem { label: React.ReactNode; href?: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> }
export interface BreadcrumbOwn extends Base<HTMLElement> { items?: BreadcrumbItem[] }
export const Breadcrumb: React.ForwardRefExoticComponent<WithMode<BreadcrumbOwn>>;

export interface PaginationOwn extends Base<HTMLElement> {
  page?: number;
  defaultPage?: number;
  /** Total number of pages. */
  count?: number;
  onChange?: (page: number) => void;
}
export const Pagination: React.ForwardRefExoticComponent<WithMode<PaginationOwn>>;

export type MenuItem =
  | { divider: true }
  | { heading: React.ReactNode }
  | { id?: string; label: React.ReactNode; icon?: string; shortcut?: string; disabled?: boolean; danger?: boolean };
export interface MenuOwn {
  items?: MenuItem[];
  onSelect?: (idOrLabel: any) => void;
  /** Without a trigger the menu is shown as a plain panel. */
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  open?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export const Menu: React.ForwardRefExoticComponent<WithMode<MenuOwn> & React.RefAttributes<HTMLDivElement>>;

export interface StepperOwn extends Base<HTMLOListElement> {
  steps?: Array<{ label: React.ReactNode; meta?: React.ReactNode }>;
  /** Index of the current step. */
  current?: number;
}
export const Stepper: React.ForwardRefExoticComponent<WithMode<StepperOwn>>;

/* ---- Data ---- */

export interface TableColumn<Row = any> {
  key: string;
  label?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  mono?: boolean;
  nowrap?: boolean;
  render?: (row: Row) => React.ReactNode;
}
export interface TableOwn<Row = any> extends Base<HTMLTableElement> {
  columns?: TableColumn<Row>[];
  rows?: Row[];
  /** Property that identifies a row. Default 'id'. */
  rowKey?: string;
  variant?: 'default' | 'schedule';
  activeKey?: string | number | null;
  onRowHover?: (key: string | number | null) => void;
  onRowClick?: (row: Row) => void;
  footer?: React.ReactNode[][];
  caption?: React.ReactNode;
}
export const Table: React.ForwardRefExoticComponent<WithMode<TableOwn>>;

/* ---- Feedback ---- */

export interface DialogOwn extends Base<HTMLDivElement> {
  /** Default true. */
  open?: boolean;
  onClose?: () => void;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  /** Render the panel in place, without the page overlay. */
  inline?: boolean;
  marks?: boolean;
}
export const Dialog: React.ForwardRefExoticComponent<WithMode<DialogOwn>>;

export interface ToastOwn extends Base<HTMLDivElement> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
}
export const Toast: React.ForwardRefExoticComponent<WithMode<ToastOwn>>;

export interface TooltipOwn { content?: React.ReactNode; side?: 'top' | 'bottom'; open?: boolean; className?: string; ref?: React.Ref<HTMLSpanElement>; children?: React.ReactNode }
export const Tooltip: React.ForwardRefExoticComponent<WithMode<TooltipOwn>>;

/* ---- Drafting ---- */

export interface FrameOwn extends Base<HTMLElement> {
  label?: React.ReactNode;
  meta?: React.ReactNode;
  marks?: boolean;
  dashed?: boolean;
  hatch?: boolean;
  padding?: number | string;
  tone?: 'ink' | 'blue';
}
export const Frame: React.ForwardRefExoticComponent<WithMode<FrameOwn>>;

export interface GridRailsOwn extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, Base<HTMLDivElement> {
  grid?: 'none' | 'cells' | 'dots';
  maxWidth?: number | string;
  rails?: boolean;
  /** Number of column guides to show. */
  columns?: number;
}
export const GridRails: React.ForwardRefExoticComponent<WithMode<GridRailsOwn>>;

export interface CornerMarksProps {
  variant?: 'cross' | 'corner';
  size?: number;
  color?: string;
  offset?: number;
  dashed?: boolean;
  overshoot?: 'all' | 'top-left';
}
export const CornerMarks: React.ComponentType<WithMode<CornerMarksProps>>;

export interface HatchOwn extends Base<HTMLDivElement> {
  pattern?: 'diagonal' | 'dense' | 'cross' | 'blue' | 'grid' | 'dots' | 'earth' | 'gravel' | 'poche';
  ratio?: number | string;
  height?: number | string;
  label?: React.ReactNode;
  bordered?: boolean;
}
export const Hatch: React.ForwardRefExoticComponent<WithMode<HatchOwn>>;

export interface SectionLabelOwn extends Base<HTMLDivElement> {
  index?: React.ReactNode;
  rule?: boolean;
  tone?: 'muted' | 'accent' | 'ink';
}
export const SectionLabel: React.ForwardRefExoticComponent<WithMode<SectionLabelOwn>>;

export interface DimensionOwn { label?: React.ReactNode; tone?: Tone; orientation?: 'horizontal' | 'vertical'; length?: number | string; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLDivElement> }
export const Dimension: React.ForwardRefExoticComponent<WithMode<DimensionOwn>>;

export interface CalloutOwn extends Base<HTMLDivElement> { n?: React.ReactNode; title?: React.ReactNode; tone?: Tone; leader?: boolean }
export const Callout: React.ForwardRefExoticComponent<WithMode<CalloutOwn>>;

export interface DividerOwn { variant?: 'solid' | 'dashed' | 'strong'; label?: React.ReactNode; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLDivElement> }
export const Divider: React.ForwardRefExoticComponent<WithMode<DividerOwn>>;

export interface SheetOwn extends Base<HTMLDivElement> { zones?: [number, number]; inset?: number; padding?: number }
export const Sheet: React.ForwardRefExoticComponent<WithMode<SheetOwn>>;

export interface TitleBlockField { label: React.ReactNode; value: React.ReactNode; size?: 'big'; full?: boolean }
export interface TitleBlockOwn { project?: React.ReactNode; subtitle?: React.ReactNode; fields?: TitleBlockField[]; revisions?: React.ReactNode[][]; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLElement> }
export const TitleBlock: React.ForwardRefExoticComponent<WithMode<TitleBlockOwn>>;

export interface ViewTitleOwn { number?: React.ReactNode; title?: React.ReactNode; scale?: React.ReactNode; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLDivElement> }
export const ViewTitle: React.ForwardRefExoticComponent<WithMode<ViewTitleOwn>>;

export interface ScaleBarOwn { segments?: number; unit?: string; ratio?: string; segmentWidth?: number; className?: string; style?: React.CSSProperties; ref?: React.Ref<SVGSVGElement> }
export const ScaleBar: React.ForwardRefExoticComponent<WithMode<ScaleBarOwn>>;

export interface NorthArrowOwn { size?: number; rotation?: number; label?: string; className?: string; style?: React.CSSProperties; ref?: React.Ref<SVGSVGElement> }
export const NorthArrow: React.ForwardRefExoticComponent<WithMode<NorthArrowOwn>>;

export interface LevelMarkerOwn { value?: React.ReactNode; label?: React.ReactNode; length?: number; tone?: 'ink' | 'blue'; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLDivElement> }
export const LevelMarker: React.ForwardRefExoticComponent<WithMode<LevelMarkerOwn>>;

export interface DraftProgressOwn { /** 0 to 1. */ value?: number; label?: string; stage?: string; className?: string; style?: React.CSSProperties; ref?: React.Ref<HTMLDivElement> }
export const DraftProgress: React.ForwardRefExoticComponent<WithMode<DraftProgressOwn>>;

export interface PencilModeProps { enabled?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export const PencilMode: React.ComponentType<PencilModeProps>;
