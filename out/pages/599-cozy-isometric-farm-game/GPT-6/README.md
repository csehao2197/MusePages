# Clovermere

- Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.
- Original: `data\prompts\599-cozy-isometric-farm-game\599-cozy-isometric-farm-game.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Prompt by VibeFather: https://vibefather.ai/t/cozy-isometric-farm-game, CC BY-NC 4.0. Original source: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/cozy-isometric-farm-game/prompt.md.
- Source: this directory. Standalone static delivery: `out\`. Private tests and actual screenshots: `.checks\`.

## Play

Till grass, choose a stocked seed, plant, water, end the day, then harvest ripe crops for sun coins. Reinvest through the seed shop. Three deterministic crops retain the requested 2/3/4-day growth and 4/6/9 purchase, 9/14/22 sale prices. The exact 36-tile board, initial inventory and initial crop states are preserved. Keyboard activation, directional tile navigation, touch controls, mobile shop sheet, focus-managed help/reset, reduced motion and versioned local saving are included.

## Run and verify

From the repository root, use the existing `startPreviewServer` helper with this directory's `out` path; it serves only the export at `/pages/cozy-isometric-farm-game/GPT-6/index.html`. No build, install or backend is needed. The private `.checks\qa.mjs` script performs browser QA using installed Playwright Chromium and closes its own browser/server in `finally`. Results belong in `.checks\qa.json`; screenshots are `.checks\desktop.png`, `.checks\mobile.png` and public `out\preview.png`.

## Adaptations and limits

This task explicitly authorizes a no-build HTML/CSS/ES-module static adaptation instead of the original Vite 5/React 18/TypeScript build. `src\content.ts` is the canonical content configuration; its browser-compatible copy is `content.js`. Reducer and save validation are separate from rendering. Local Fontsource Fraunces 600/700 and variable Nunito Sans 400–800 are self-hosted; Lucide interface icons are serialized from the installed licensed package, not loaded remotely. No raster art, third-party game assets, backend, fake server save, cloud sync, real money, timers or random economy. SVG artwork is original. Storage is browser/origin-specific and can be unavailable in private modes; the indicator reports failure. The finite board is the progression system, not added levels.

At small widths the exact mandated 2:1, 6×6 geometry necessarily produces diamond faces less than 44 CSS pixels high; keyboard navigation remains available and every non-tile control has at least 44px height. The sticky toolbelt uses the top edge while scrolling, avoiding overlay of the initial board and lower dialog controls. The original says “30 grass tiles” but its exact five non-grass initial tiles in a 36-tile board imply 31; exact coordinates take precedence. No builds, collection assembly or deployments were performed. Registration is disabled by default.

## Validation status

18 QA groups passed using installed Playwright Chromium: exact three-crop engine lifecycles, desktop mouse/keyboard play, real mobile touch play, guarded day transitions, dry-crop non-growth, exact transactions, reload persistence, invalid-save recovery, unavailable storage, offline gameplay, focus-managed dialogs, and overflow checks before/after interaction. No browser console, page, request or HTTP errors. Tested at 1200×900, 1440×900 and touch-enabled 390×844, DPR 1.

Opened and visually reviewed both actual `.checks\desktop.png` and `.checks\mobile.png` (also the wide desktop screenshot): warm cream/forest hierarchy, original isometric scenery, consistent typography, readable selected controls, aligned desktop rails and fully contained mobile field. Mobile content continues naturally below the first screen; the whole field and four tools are visible initially. The first automated attempt encountered Playwright stability waiting on animated SVG artwork; final QA uses real pointer/touch coordinates at diamond centers and passes without forced clicks. One additional synthetic duplicate day event explicitly checks re-entry protection and causes no extra state advance.

Formal `out\preview.png` is a real 1200×900 first-screen capture, opened for visual review. Static and image SHA-256 values match `.generation-preview.sha256`; full raw input/DESIGN fingerprint matches `.generation-input.sha256`. Unique `GPT-6` registration verified at `cozy-isometric-farm-game`, `enabled=false`, `deployed=false`; all four metadata flags are true. No builds or deployments. Public export is below 20 MB.
