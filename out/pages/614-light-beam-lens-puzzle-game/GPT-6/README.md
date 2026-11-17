# Lumenwild

A playable isometric light-routing puzzle in the Glassroot Caverns.

## Identity and source

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\614-light-beam-lens-puzzle-game\614-light-beam-lens-puzzle-game.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Prompt by **VibeFather**, [original template](https://vibefather.ai/t/light-beam-lens-puzzle-game).
- Retrieved specification: [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/light-beam-lens-puzzle-game/prompt.md).
- Specification license: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Non-commercial use; commercial use requires the original author's permission/license. See `LICENSE.txt` and `ASSETS.md`. No reference demo assets were used.

## Implementation

The source is this model directory; the independent static export is `out\`.
`index.html`, `style.css`, `content.js`, `levels.js`, `trace.js`, `state.js`, `scene.js`, `audio.js`, `app.js`, and `icons.js` are browser source.

- Twelve fixed, hand-authored levels, with the original coordinates and solution targets.
- Pure queue-based cardinal beam tracing, both mirror mappings, axis-gated lenses, splitter branches, direction-sensitive receivers, blockers, visit deduplication and a 2048-visit safety cap.
- Live Three.js procedural orthographic chamber, instanced crystals, actual traced beam segments, selection outlines and animated quarter turns.
- Quarter-turn manipulation, move/receiver counters, undo, restart, unrestricted level selection, completion/replay/next, optional synthesized audio and device-only progress.
- Direct pointer/touch manipulation, equivalent labeled optic buttons, keyboard controls, native modal focus containment, focus restoration, reduced motion and WebGL-unavailable messaging.

## Static adaptation and limits

This authorized no-build adaptation uses native JavaScript modules and DOM UI instead of the requested Vite/React/TypeScript toolchain. It has no production build step, backend, API, account, online score, mocks, or remote runtime assets. Independent logic modules use a pure reducer, not a React reducer. Native app modules are not minified; the public export is `out\`, not Vite's `dist\`. Fontsource fonts and Lucide-generated SVG icons are bundled locally. Code-generated cave geometry is original. Copy is centralized in `content.js`, including the HTML shell.

The lenses implement the specification's exact cardinal axis transmission rule, not continuous-angle Snell-law refraction. Target counts describe the authored route, not a proven optimal solution. The interface uses a compact responsive rail; decorative details and timing are visual-only and never drive the puzzle result. Audio is off on load and requires explicit activation, even when a prior visit stored an enabled preference. Storage restrictions gracefully reduce persistence to the current visit. The WebGL fallback retains full DOM optic controls and live HUD but not a 3D rendering.

## Run and inspect

From the repository root, no install or build is required for the exported page:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\614-light-beam-lens-puzzle-game\GPT-6\out
```

For interactive testing, use the existing `startPreviewServer` helper from that module with only this `out\` directory. Its URL mounts the page at `/pages/light-beam-lens-puzzle-game/GPT-6/index.html`. Any ordinary static HTTP server can serve the same directory; ES modules require HTTP rather than `file://`.

Private evidence lives in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png` and `.checks\verify.mjs`. The published preview is `out\preview.png`; input and static/preview fingerprints are maintained beside the source. Verification outcomes are recorded in the QA file after execution, not inferred from source.

Executed QA: **22 passing assertion groups**, including all 12 initial-state/solution checks and all 12 actual browser-played solutions; mirror directions, lens gating, splitters, blockers, loops, visit cap, undo/restart/bests, persistence, dialogs, actual 3D raycast clicks/taps, keyboard and DOM play, explicit audio, reduced motion and unavailable-WebGL/corrupt-storage fallback. Tested 1200×900, 1440×900 and touch 390×844; no horizontal overflow or HTTP/resource/request/console/page errors. Owned browsers and static servers closed in `finally`.

The actual desktop and mobile PNGs were opened and visually reviewed. The review refined crystal scale/color and rail spacing; the final board remains dominant, typography and status contrast are legible, mobile controls stay fixed without covering the receiver status, and grids are uncropped. `.checks\constellation.png` additionally shows the genuinely solved final three-receiver layout. Preview verification and disabled registration are recorded separately after their gates pass.

The page is registered disabled and undeployed only after successful static, browser and screenshot verification. No collection build, publication, upload or deployment is part of this delivery.
