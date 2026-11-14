# Tessera — visual frame editor

- **Original prompt**: `data/prompts/076-visual-page-design-editor/076-visual-page-design-editor.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/visual-page-design-editor/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD describes a simplified clone of an existing design tool built with Next.js, Tailwind, Recoil and react-moveable. This is an original editor under its own name and visual identity. Framework pieces have browser equivalents:

| PRD piece | Browser equivalent |
|---|---|
| Recoil `canvasStore` | One in-memory document with snapshot undo/redo, saved to `localStorage` (`tessera-doc`) |
| react-moveable | Custom handles: drag, 8 rotation-aware resize handles, rotate handle |
| Component files (alignment, colorPicker, opacity, rotation, position, layerPanel) | Sections of the Design panel and the Layers panel |

## Features

- **Canvas:** Space-drag, hand tool or middle-button pan; scroll zooms at the cursor (Shift+scroll pans); zoom buttons and fit; two-finger pinch on touch
- **Frames:**
  - frame tool (F) and the Add frame button
  - text tool (T) with in-place editing
  - drag, resize and rotate (Shift snaps to 15°)
  - smart snapping with guides (Alt skips it)
  - multi-select with Shift or marquee
  - boards move their contents with them
- **Design panel:**
  - align (6) and distribute (2)
  - X/Y/W/H, rotation and corner radius, with scrubbable labels
  - opacity slider and number field
  - color picker (saturation/brightness square, hue, swatches, hex)
  - border, and text size, weight, alignment and color
  - forward/backward, duplicate, lock and delete
- **Layer panel:** list nested by board; rename (double-click or F2); hide, lock, drag to reorder, or Alt+↑/↓
- **Also:** milestones 2–4, keyboard shortcuts with a help dialog (?), and a demo reset that can be undone

## Mocks and limitations

- Local only: one document per browser, no cloud storage or collaboration (PRD non-goals).
- No export or prototyping (PRD non-goals).
- Layer drag reordering needs a mouse; touch users reorder with Forward/Backward.

## Run and verify

From the repo root, `node out/pages/076-visual-page-design-editor/Opus-5.5/page.test.mjs` runs 12 Playwright checks:

- seed render
- select, move, resize and rotate
- undo/redo
- snapping guides
- property edits and color picker
- add, draw, duplicate, nudge and delete
- multi-select align/distribute
- layer rename, hide, lock and reorder (keyboard and drag)
- text editing and the text tool
- pan, zoom and fit
- shortcuts dialog, persistence and reset
- mobile bottom sheets and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots (including selection and picker states) were reviewed visually.
