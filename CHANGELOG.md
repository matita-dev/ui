# Changelog

Changes to `@matita/ui`. While the package is on 0.x, a minor version adds components or changes an API and a patch fixes things.

## 0.1.0 — 2026-11-04

First public release: 35 components in three modes (ink, pencil, blueprint).

- **Core:** Button, IconButton, Badge, Tag, Card, Icon, Divider
- **Forms:** Input, Select, Checkbox, Radio, Switch
- **Navigation:** Tabs, Breadcrumb, Pagination, Menu, Stepper
- **Data and feedback:** Table, Dialog, Toast, Tooltip
- **Drafting:** Frame, GridRails, CornerMarks, Hatch, SectionLabel, Dimension, Callout, Sheet, TitleBlock, ViewTitle, ScaleBar, NorthArrow, LevelMarker, DraftProgress

Also in this release:

- `MatitaProvider`, `useMatita`, `Scope` and `Tweaks` for mode, grid, hand, roughness and line weight.
- TypeScript types, `className` and `ref` on every component.
- Focus ring in every mode, keyboard support and ARIA for forms, tabs, dialog and menu.
- Responsive from 320px: containers never overflow, tables and tabs scroll, pagination and stepper adapt, menus and select lists stay on screen, 44px hit areas on touch screens.
- `Select` is a custom listbox, and its `onChange` receives the value.
