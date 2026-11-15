# Ink Wash Mountain Adventure

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an original English-language third-person 3D action adventure set on [WORLD], an invented [SETTING], for [AUDIENCE]. The default tagline is 'Three guardians. One quiet summit.' The player runs along an ink-wash mountain trail, dodges telegraphed attacks, and uses three-hit combos to calibrate three guardian training dummies: Reed Sentinel, Stone Sentinel, and Cloud Sentinel. A stamina system called Breath links attacks and dodges. Rain, distant thunder, and an original painterly shader shape the atmosphere. The entire product is one playable static page at index.html, with the live mountain and first guardian as the first-screen visual anchor and no marketing landing page.

- Audience: Indie hackers, front-end developers, designers, creative-coding learners, and players who enjoy short timing-based action games. The interface must welcome first-time players with concise control hints, generous telegraphs, forgiving checkpoint retries, and no gore while keeping combat, rendering, and content modules straightforward to adapt.
- Goal: Deliver a complete and replayable action loop: run from the lower trail, read and dodge each guardian's ground telegraph, manage Breath, land combos, resolve all three dummies, open each practice gate, and walk into the summit circle for a completion summary. Make keyboard, mouse, and touch play equivalent, retain previously resolved guardians when retrying the current lesson, and keep all gameplay local and deterministic.
- Tone: Focused, atmospheric, elegant, restrained, and encouraging. Use concise original US English training copy and quiet environmental detail. Combat is non-gory practice against mechanical dummies, with 'resolve', 'calibrate', and 'form learned' language rather than killing. There is no epic fantasy exposition, long staff, resonance power, bell-foundry quest, licensed character, or reference to an existing game or AI product.

## Stack
- Framework: Vite 6 + TypeScript 5
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide (ISC), @fontsource-variable/newsreader (OFL-1.1), @fontsource-variable/inter (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold Vite's vanilla TypeScript template with scripts dev=vite, build=tsc && vite build, and preview=vite preview. Do not add React, a physics engine, a full game engine, or a separate postprocessing dependency.
  - Set vite.config base to './', build.outDir to 'dist', build.emptyOutDir to true, and build.sourcemap to false. Enable strict TypeScript checking and produce only static files in dist/.
  - Install only three, lucide, @fontsource-variable/newsreader, and @fontsource-variable/inter as runtime dependencies, plus Vite, TypeScript, and @types/three as development dependencies. Import Newsreader 500/600, Inter 400/500/600/700, and only the Lucide icons actually used.
  - Organize the implementation into src/content.ts, main.ts, scene.ts, terrain.ts, player.ts, combat.ts, guardians.ts, controls.ts, weather.ts, shader.ts, ui.ts, audio.ts, and styles.css. Keep pure simulation and combat state separate from Three.js meshes and DOM overlays.
  - Put BRAND, WORLD, SETTING, AUDIENCE, TAGLINE, guardian display names, objectives, instructions, button labels, result copy, and aria copy in src/content.ts. Rewrite setting-specific names and scene dressing when variables change while preserving coordinates, three-guardian mechanics, timings, and UI structure.
  - Derive a stable decorative random seed and localStorage key from BRAND and WORLD. Save only best active completion time and sound preference; never save dates or claim an online record. Do not restore a half-finished combat state on reload.
  - Use one index.html with a WebGL canvas and semantic HTML overlays. Bundle every font, script, icon, and generated visual locally; no remote assets or APIs. The document remains fixed to the viewport and uses no router.
  - Run gameplay with a fixed 1/60-second simulation step and a capped frame delta. Seed only decorative rocks, ridge variation, pine placement, and rain offsets. Keep player collisions, attack windows, guardian patterns, damage, progression, and timer results deterministic.
  - Cap rendering work, pause simulation and audio when hidden, clear held input on focus changes, and dispose all geometries, materials, render targets, textures, listeners, audio nodes, and the renderer on teardown.

## Variables
- [BRAND] — Game name (default: "Rainveil"). An invented one- or two-word game title; never an existing game, platform, or AI brand.
- [WORLD] — Mountain world (default: "the Rainveil Pass"). An invented mountain route used in the objective, help, and completion copy.
- [SETTING] — Landscape setting (default: "storm-washed mountain retreat"). The landscape theme; adapt vegetation accents and scene dressing without changing the route or combat.
- [AUDIENCE] — Player audience (default: "players who enjoy short, timing-based action games"). The intended players, used naturally in the help introduction rather than as metadata.
- [TAGLINE] — Game tagline (default: "Three guardians. One quiet summit."). A short original line shown beneath the game name and repeated on completion.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/ink-wash-mountain-adventure in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/ink-wash-mountain-adventure?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by 铜雨行者 3D Interactive Game — https://www.kimi.com/showcases/3dmake
— Prompt by VibeFather · https://vibefather.ai/t/ink-wash-mountain-adventure · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
