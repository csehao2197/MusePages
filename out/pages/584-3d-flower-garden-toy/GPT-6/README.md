# Meadowmint

Real generator: `gpt-6.1-sol`. Public model label: `GPT-6`.

## Input and attribution

Original: `data\prompts\584-3d-flower-garden-toy\584-3d-flower-garden-toy.md`.
Design: `src\workflows\AI Agent\DESIGN.md`.
Prompt by [VibeFather](https://vibefather.ai/t/3d-flower-garden-toy), CC BY-NC 4.0.
[Input snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/3d-flower-garden-toy/prompt.md).
Inspired by https://www.kimi.com/showcases/3dmake; no reference code or media copied.
Source license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.
See LICENSE, NOTICE and ASSETS.md. Non-commercial only; no additional rights granted.

## Implementation

Native HTML / CSS / browser JavaScript static adaptation of the requested Vite/TypeScript application; no build was authorized or executed. Source modules retain the requested garden/UI separation, using `.js` rather than TypeScript. `fonts.js` and local CSS replace bundler font imports. `out\` is the directly prepared static export, not a Vite `dist\` build. The provided Vite/TypeScript setup is optional developer tooling, not a verified build.

Actual WebGL Three.js diorama: asymmetric undulating island, cut-earth bands, contact shadows, instanced grass and four distinct procedural flowers. Eighteen deterministic seeded six-flower clumps; 120-clump capacity. Ground raycast planting, collision checks, shared GPU wind, staggered two-phase growth, orbit, wheel/pinch zoom, keyboard planting ring, local clean PNG export, focus-trapped native dialogs and deterministic reset. All runtime resources are local.

Camera framing preserves the requested viewing angle and target, with an increased initial distance to keep the island clear of overlays. Portrait distance and its orbit bounds increase further to fit the complete island; the literal maximum distance of 25 is adapted. Snapshot uses current CSS viewport dimensions at DPR 1, capped at 2048. Shadow maps cache the static plant silhouettes and refresh on planting/reset; they do not track the subtle shader sway. No floating pollen is added. The direct static export is readable native modules, not a minified production build. No backend, network API, persistence, tracking, mock service or secret is used; garden data remains in memory.

## Run and verify

From repository root, call the existing `startPreviewServer` in `src\workflows\script\generate-preview.mjs` with this model's `out\` directory. It serves only this static export at `/pages/3d-flower-garden-toy/GPT-6/index.html`. Do not use `file://`: native ES modules require HTTP.

Private test and visual evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Public preview: `out\preview.png`; input and static/preview fingerprints stay outside export.

Run the private browser checks from the repository root:

```powershell
node out\pages\584-3d-flower-garden-toy\GPT-6\.checks\qa.mjs
```

Actual Chromium checks passed in 13 groups at 1200×900, 390×844 touch, and 1440×900: initial WebGL render and instanced geometry, all four flower choices, six-bloom planting and occupied-ground rejection, keyboard ring and shortcuts, focused-slider behavior, wind labels, modal focus/Escape/scrim/cancel, mouse orbit/wheel, touch orbit/pinch without accidental planting, deterministic reset, real PNG download and failure handling, 720-bloom capacity, and live reduced-motion changes. HTTP/resource/request/console/page errors were zero; no horizontal overflow before or after interactions; the full island fits each tested viewport. Capacity is a batched core-state/pool test, not a hardware frame-rate benchmark.

Both actual desktop and mobile PNGs were opened and visually reviewed. The review refined the island framing and mobile edge clearance, connected soil strata, distinct open-cup/star silhouettes and eucalyptus background. Final typography, control contrast, spacing and mobile two-row dock were checked. The downloaded postcard was also opened: it contains the scene without UI.

Native JavaScript syntax checks, source/static checks, the 1200×900 preview and digest checks are recorded in the private job report. Registration is disabled and undeployed; no collection build, publication, upload or live deployment is part of this task.
