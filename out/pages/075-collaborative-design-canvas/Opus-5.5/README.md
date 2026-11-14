# CollabCanvas — multiplayer design canvas with an AI co-designer

- **Original prompt**: `data/prompts/075-collaborative-design-canvas/075-collaborative-design-canvas.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/collaborative-design-canvas/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD's stack (Next.js, Yjs + y-websocket, OpenAI, Supabase Auth/Postgres, Render, Vercel) can't run in a static collection, and installing or building isn't authorized. Each piece has a browser equivalent:

| PRD piece | Browser equivalent |
|---|---|
| Yjs + y-websocket | Patch-based shared document over **BroadcastChannel**: edits, cursors, presence and selection locks sync between tabs of the same browser |
| OpenAI function calling | Local rule-based interpreter that emits the PRD's function calls (createShape, createText, moveShape, resizeShape, rotateShape, arrangeShapes, groupShapes); calls are shown in the AI log |
| Supabase Auth | Random per-tab identity (name and color) in `sessionStorage` |
| Postgres / Prisma | `localStorage` document (`cc-doc`) and version snapshots (`cc-history`, last 50) |

## Features

- SVG canvas: rectangles, ellipses, lines and text; pan (Space, hand tool, scroll), Ctrl+scroll zoom, zoom buttons and fit
- Select, Shift multi-select and marquee; move, rotation-aware resize handles, rotate handle (Shift snaps 15°)
- Properties panel: position, size, rotation, radius, font size, text, fill, border, z-order, lock, duplicate, delete; align and distribute for multi-selection
- Layers panel: lock and reorder per layer; groups
- Undo/redo, keyboard shortcuts (V/H/R/O/L/T, Ctrl+Z/Y/A/D/G/L, `[` `]`, arrows)
- **Multiplayer:** "Collaborate in new tab" opens a second session with live cursors, name tags, presence avatars and selection locks; a simulated teammate ("Sam (simulated)") can be toggled off
- **AI co-designer:** grids ("create a 3x3 grid of buttons"), login form, navbar, colored shapes at positions, text, plus move, resize, rotate, arrange and group of the selection
- Version history with auto snapshots and restore; 500-shape performance test button

## Mocks and limitations

- **Simulated real-time:** sync reaches other tabs in the same browser only, not other devices. No conflict resolution beyond last-write-wins per shape.
- **Simulated AI:** the interpreter handles the listed command patterns only and replies with help text otherwise; no LLM is called.
- **No authentication or rate limiting:** identities are random demo names.
- **Single document:** no document list or sharing links.

## Run and verify

From the repo root, `node out/pages/075-collaborative-design-canvas/Opus-5.5/page.test.mjs` runs 12 Playwright checks:

- seed canvas, presence and simulated teammate
- drawing with the rectangle tool, undo and redo
- drag move, arrow nudge and handle resize
- property edits (rotation, fill)
- duplicate, delete, select all, group and ungroup
- layers lock
- AI grid, login form, rotate and help fallback
- **two-tab sync** of edits and cursors
- history snapshot and restore
- zoom, fit and the 500-shape test
- persistence after reload
- mobile layout and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
