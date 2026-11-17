# Lumen Dock

Actual generator: `gpt-6.1-sol`; public model label: **GPT-6**.

## Input and attribution

Original: `data\prompts\607-3d-neon-breakout-arcade\607-3d-neon-breakout-arcade.md`, with the complete shared `src\workflows\AI Agent\DESIGN.md`.

Prompt by **VibeFather**, [original template](https://vibefather.ai/t/3d-neon-breakout-arcade), [source snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/3d-neon-breakout-arcade/prompt.md). Licensed **CC BY-NC 4.0**, [license](https://creativecommons.org/licenses/by-nc/4.0/). Non-commercial use only; commercial use requires the rights holder's permission/license. No demo source, screenshots, models, or third-party artwork copied.

## Implementation

This is a genuine Three.js arcade court: five authored maps and speeds, swept paddle crossing and substepped ball/brick collision resolution, lime chipping, points, sparks, local best, round clear, final clear, failure, reset, pause, controls, touch dragging, arrow keys, mouse aiming, and synthesized sound. Scatter adds balls, Needle fires at the nearest intersecting brick, and Girder extends the bar. Timers freeze on overlays and while hidden. Geometry, attendant, particles, sky and favicon are original code-drawn assets. All runtime copy is centralized in `content.js`.

Source is in this model directory; standalone static export is `out\`. Public path: `pages/3d-neon-breakout-arcade/GPT-6/index.html`. `vendor\` and `fonts\` contain locally hosted dependencies and their licenses. No network resources, backend, accounts, API, analytics or mock gameplay. Only the best integer and mute flag are persisted under `lumen-dock-cabinet`; storage failure does not stop play.

### Authorized adaptation

The original requests Vite 6 + strict TypeScript and a built `dist`. This delivery deliberately uses equivalent native browser ES modules (`content.js`, `main.js`, `arena.js`, `levels.js`, `sim.js`, `hud.js`, `audio.js`) and vanilla CSS to honor the no-build authorization. No Vite build, TypeScript compilation, `dist`, gallery assembly or deployment was run. Three.js 0.181.2 and addon modules are reused from an installed package, with desktop bloom. Fonts use only the specified local Fontsource weights. Camera distance/elevation, the sky gradient's transition range and mobile opening view offset are adapted after actual screenshot review: the literal requested desktop camera cropped the paddle entirely. Mobile uses a steeper perspective so the full playable width remains visible, and the opening sheet leaves the bar and ball unobscured. Game-space maps, speeds, colors and geometry coordinates remain unchanged.

## Run and verify

From the repository root, use the existing `startPreviewServer` export in `src\workflows\script\generate-preview.mjs` with this model's `out` directory. It serves only the public static directory at its final subpath. No build or runtime server-side dependency is needed. The installed root `@playwright/test` Chromium is used for QA.

Private verification: `.checks\qa.mjs`, `.checks\simulation.test.mjs`, `.checks\qa.json`; actual screenshots: `.checks\desktop.png`, `.checks\mobile.png`. Final results and visual review are recorded in `.checks\qa.json` and the coordinator's private report. Run `node --test` with the simulation test path and `node` with the QA script path from the repository root.

Verified: 8 simulation tests and 16 browser assertion groups passed. Chromium exercised 1200×900/DPR1, 390×844/DPR1, and a 1440×900 smoke check. Normal keyboard/mouse/touch launches actually destroyed bricks and changed points/block counts. Controlled collision fixtures exercised all five clears, win, failure, replay, and pickup catches. No console/page/request/HTTP errors or horizontal overflow occurred in the desktop/mobile suites. All four actual opening/play PNGs were opened and visually reviewed: clear type hierarchy, readable contrasting HUD, unobscured play area, visible ball/bar and responsive bottom sheet. Camera framing was refined from the first rendered result.

Preview is produced by `StaticHomepage.ensurePreview`; `.generation-input.sha256` and `.generation-preview.sha256` bind the input and static/PNG content. Registration is disabled and undeployed. Do not equate registration with publication.

## Limits

Local best is per browser, not a shared leaderboard. Web Audio needs a user gesture and WebGL must be enabled. Automated state-based endgame tests complement, rather than claim, five complete manual rounds. The two-name content fixture verifies that reskinning copy leaves maps and rules unchanged; only the default name set is shipped. There are no environment variables or credentials.
