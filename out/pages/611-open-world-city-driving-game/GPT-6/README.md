# Amber Row Club — Reed Wharf

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\611-open-world-city-driving-game\611-open-world-city-driving-game.md`.
- Design input: `src\workflows\AI Agent\DESIGN.md`.
- Source: this model directory. Static export: `out\`. Private browser evidence: `.checks\`.
- Source prompt by **VibeFather**, [original](https://vibefather.ai/t/open-world-city-driving-game), obtained via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/open-world-city-driving-game/prompt.md). Prompt adaptation: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); non-commercial only. See `LICENSE` and `out\licenses\`.

## Play

The entire original low-poly neighborhood is loaded at once. Walk, borrow four mint-striped pool cars, drive with acceleration/reverse/steering/handbrake, avoid solid buildings, trees and eight ambient traffic vehicles, read the north-up minimap, complete three on-foot porch deliveries, or drive the six-gate loop and return to the start. Dusk fades into night over 150 active seconds. Pause, help, procedural sound, reset, and local bests work offline.

Use WASD/arrows, E to borrow/leave/collect/deliver, Space to brake, P/Escape to pause and R to reset. Phones have steering buttons, GO/BRAKE and contextual action. Only porch best points, lap best seconds and mute are saved under `amber-row-club-evening`.

## Run and validate

No build is needed or authorized. Serve only this directory's `out` using the existing `startPreviewServer` from `src\workflows\script\generate-preview.mjs`; it supplies the final `/pages/open-world-city-driving-game/GPT-6/index.html` subpath. The repository preview CLI accepts the same static folder. Open that HTTP URL in a WebGL-capable browser.

Static inspection uses `StaticHomepage.checkSource` and `validateStaticOutput`. Private `.checks\qa.json` records actual browser assertions, viewport sizes, errors, and screenshot review. `.checks\desktop.png` and `.checks\mobile.png` are private QA images; public `out\preview.png` is a separately captured real 1200×900 first screen. Metadata is written only after each corresponding gate passes. No deployment or production build is performed.

## Scope and adaptations

This is a build-free HTML/CSS/ES-module adaptation, **not** the requested Vite 6 + TypeScript scaffold or a compiled Vite `dist`. Runtime assets are local Three.js, Lucide, Fraunces, Outfit and IBM Plex Mono. Modules use browser JavaScript rather than TypeScript. Text is centralized in `content.js`; the accessible HTML overlays are included there. All meshes and textures are original procedural artwork. No remote images, APIs, backend, multiplayer, dates, accounts or production service claims.

The supplied input explicitly contains only the public portion of a Pro prompt: no private layout, alternate name table, asset geometry or demo source was supplied. The default name set is implemented with original road/mission geometry, handling and visual design. No claim is made to reproduce the unavailable Pro layout or alternate name table. Physics is a deterministic arcade approximation with conservative circle/AABB collision shapes, not a physics engine; traffic uses a yielding rectangular route. Score is earned only by reaching and interacting at all three real doors. Lap time requires reaching each ordered gate and returning to the first gate while driving. Bests are local, not an online leaderboard.

New registration is disabled and undeployed. Environment variables: none. Local storage may be unavailable in private browsers; gameplay continues and explains that scores then last only this visit.

## Verified result

33 assertion groups passed: 15 static/desktop/mobile checks, 11 full gameplay groups, and 7 focused simulation tests. Viewports were 1200×900 and 390×844, DPR 1. Both real initial screenshots and both earned-mission screenshots were opened and visually reviewed: warm paper/pine/orange contrast, large editorial title, original isometric city, distinct overlays, touch target spacing and no horizontal overflow. The three delivery destinations were physically reached on foot; the complete six-gate driving loop and return to start earned a 54.19s lap and saved both bests across reload. Browser QA recorded no console/page/request/HTTP errors.

The full route harness dispatches frame-synchronized browser keyboard events through the real keyboard handlers, reading only immutable snapshots; it never changes player/mission state or skips time. Separate smoke checks use trusted Playwright keyboard input and real CDP multitouch (simultaneous steering/accelerator, brake and reverse). Simulation unit tests independently cover solid traffic/building collision, yaw direction, handbrake, reverse and the exact 150-second light endpoint. Instanced static and vehicle meshes reduce draw calls; fixed-step simulation preserves handling at lower rendering frame rates. Traffic yields to players ahead and keeps spacing without side-by-side deadlock.

Reproduce the private checks from the repository root with `node out\pages\611-open-world-city-driving-game\GPT-6\.checks\qa.mjs`, then `gameplay.mjs` and `physics-test.mjs` in the same folder. These start only a scoped static preview and close their own browser/server in `finally`. No build, deployment or AI request is involved. Evidence files, diagnostics and dependency manifests remain outside the public export.
