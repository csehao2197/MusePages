# Hearthline — Tallow Crater

- Original: `data\prompts\603-mars-colony-builder-game\603-mars-colony-builder-game.md`.
- Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.
- Source: this directory. Independent static export: `out\`.
- Public mapping: `pages\mars-colony-builder-game\GPT-6\index.html`.
- Prompt by **VibeFather**, [original](https://vibefather.ai/t/mars-colony-builder-game), retrieved through [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/mars-colony-builder-game/prompt.md). Prompt/adaptation: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires the original author's separate permission/license. See `LICENSE` and `ASSETS.md`.

## Play

Open the basin, choose a tool, and click/tap a floor diamond. One placement or removal is allowed per sol; undo is free before advancing. Habitat adjacency, solar shade, equipment demand, water consumption, storms, housing and morale all matter. Preview and Advance call the same pure tick. Reach 50 colonists without exhausting a stock. A failed tick is never committed; retry restores the start of the sol.

The field guide contains exact yields, deterministic weather, the roster, and controls. Keyboard: 1–4, X, arrows, Enter, U/Backspace, Escape, N, H, M. Shortcuts intentionally pause on focused buttons and in dialogs. Completed sols and a separate sound preference persist in browser localStorage. There are no accounts, APIs, backend mocks, remote assets, money costs, or random events.

## Static adaptation and running

The original requested Vite 5 / React 18 / TypeScript / Tailwind 3.4 and a production `dist` build. This authorized build-free adaptation instead uses native JavaScript modules, HTML, and CSS with the same canvas rules. No build was run. The public export is `out`, as required by MusePages, not `dist`. Fontsource WOFF2 fonts are self-hosted; the five Lucide SVGs were serialized from the installed package. Browser JS is deliberately readable rather than build-minified.

From the repository root, serve only the export using the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\603-mars-colony-builder-game\GPT-6\out
```

For private interaction QA, run:

```powershell
node --test out\pages\603-mars-colony-builder-game\GPT-6\.checks\sim.test.mjs
node out\pages\603-mars-colony-builder-game\GPT-6\.checks\qa.mjs
```

The QA script uses `startPreviewServer` at the final public subpath and closes its own browser/server in `finally`. Results: `.checks\qa.json`; desktop/mobile images: `.checks\desktop.png`, `.checks\mobile.png`. The private outcome report records actual executed checks and visual review. These private files, package dependencies, metadata, source documentation, and input fingerprints are excluded from `out`. No deployment, collection assembly, or publishing is part of this delivery.

## Implementation

`content.js` holds player-facing copy. `sim.js` is the pure deterministic terrain/economy; `draw.js` owns fit, hit testing, seeded dust, and canvas art; `save.js` validates snapshots; `audio.js` synthesizes optional quiet cues; `app.js` owns actions, focus and dialogs; `styles.css` handles desktop columns/mobile sheet and reduced motion.

Storage may be denied by browser policy; the UI reports that persistence is unavailable while play remains possible. Sound is optional and starts off. No external image, video, audio file, environment variable, or secret is needed.

## Verified delivery

Eight pure simulation/save-schema tests and 34 real Chromium assertion groups passed. Actual static HTTP play was tested at 1200×900 and 390×844 (DPR 1), with an additional 1440×900 layout check and reduced-motion/DPR-3 context verifying the rendering cap of 2. Both desktop pointer and mobile touch completed a legal, fresh 22-sol route through two storms to 50 colonists; no state injection was used for those runs. Preview values were checked against every committed snapshot. Tests also cover keyboard placement/advance/undo, blocked cells and occupied-bed removal, successful removal, one-change limits, save/resume, corrupt saves, natural failure/retry/leave, win dismissal/reset confirmation, optional audio, missing canvas and denied storage.

There were no final console, page, HTTP, resource or request errors, and no horizontal overflow or clipped main controls before/after interactions. The initial 1200×900 footer clipping was fixed. Desktop duplicate tool labels and repeated HUD fades were refined after opening actual screenshots. The final desktop/mobile PNGs and victory dialogs were opened and visually reviewed for hierarchy, spacing, contrast, readable controls and a fully visible center habitat. The mobile title leaves at least 240px of live crater canvas.

The MusePages static checker and `ensurePreview` maintain the actual 1200×900 `out\preview.png` and input/static/image fingerprints. Registration is disabled and undeployed; no production build, gallery assembly, or deployment was performed. The private report records final registration and preview verification.
