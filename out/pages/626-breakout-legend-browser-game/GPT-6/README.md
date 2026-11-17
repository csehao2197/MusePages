# Breakout Legend

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original: `data\prompts\626-breakout-legend-browser-game\626-breakout-legend-browser-game.md`.
- Specification attribution: [Tencent EdgeOne](https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills/blob/e3f25bd20d371d9a64613306a6a48da15671a35b/prompts/breakout-legend.md), MIT, copyright 2026 Tencent EdgeOne. License retained in source and static export.
- Source: this directory; independent static export: `out\`; original Canvas/CSS artwork, no third-party game assets.

## Play

Start a run, move using mouse, arrow keys, or a finger on the canvas. P pauses/resumes; R restarts from pause or game over; Escape returns to the menu. Ten authored levels feature one-chance survival, shrinking paddle, progressive speed, normal/indestructible/splitter bricks, eight-ball cap, fair face-based collisions, particle feedback, elapsed timer, loss/retry and victory/name submission. There is intentionally no point score or extra-life power-up: the original ranks completed runs by fastest time. Splitter bricks are the multiball power-up.

## Static adaptation and limits

This authorized collection adaptation uses dependency-free HTML/CSS/JavaScript modules and raw Canvas, not React 18/Vite/strict TypeScript/Tailwind. No framework build was run. The leaderboard is explicitly **local to this browser**, using localStorage with validation, safe text rendering, sorting, top 50 persistence/top 10 display, empty/error states. No fictional competitors, EdgeOne API, KV namespace, global persistence, cloud skill installation, deployment, backend, credentials, or environment variables are used. Cloud leaderboard/API/CORS and deployment requirements remain outside this static delivery. Locally hosted Orbitron 700 and Inter 400/600 are from Google Fonts; font authors and SIL OFL 1.1 licenses are retained in `fonts\`.

## Run and verify

From the repository root, serve only the actual `out` directory with `startPreviewServer` from `src\workflows\script\generate-preview.mjs`; it supplies the final `/pages/breakout-legend-browser-game/GPT-6/` URL. No installation or build is needed.

Private test runner and actual evidence: `.checks\verify.mjs`, `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Tests cover engine collisions/walls/paddle, all ten level transitions, splitter cap, indestructible bricks, last-ball loss, pause/reset, leaderboard validation/persistence, desktop/mobile input, 390/768/1200/1280 widths, resources and overflow. Automated progression uses controlled deterministic game fixtures; it is not a claim of manually completing all ten levels.

On 2026-11-16, all 17 validation groups passed with no browser console/page/request/HTTP errors and no horizontal overflow before or after interactions. Both actual desktop and mobile PNGs were opened and visually reviewed; the desktop stage was resized to retain the paddle in the first screen and the mobile overlay was made more compact. Detailed assertions, viewport sizes and review evidence are in `.checks\qa.json`. `out\preview.png` is a real 1200 × 900 first-screen render produced by the shared preview helper and separately opened for review. Input and preview fingerprints remain private alongside metadata. Validated static assets are registered disabled and undeployed; no collection build or publication is performed.
