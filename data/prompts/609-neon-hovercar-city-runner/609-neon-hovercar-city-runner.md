# Neon Hovercar City Runner

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], a single-page night-canyon arcade game in the invented city [CITY]. The player pilots [VEHICLE], a code-built wedge hovercar locked to one hover height, up a wet reflective lane. Pocket [CARGO], pass surge arches, dodge drones, and reach the [DESTINATION] before the frame meter hits zero. [DISPATCHER] is the dispatcher named on the start card. The first screen is the live canyon with the hovercar already in it.

- Audience: Indie hackers and developers who want a finished static Three.js game, with keyboard and touch controls, a readable corner HUD, and words that can change without redrawing the course.
- Goal: Ship one replayable run of about a minute: launch from the canyon, bend the lane, push pace, spend surge, pocket cargo, survive drones and wall scrapes, then land on a results card for a reached berth or an empty frame. The course, meshes, palette, and hit numbers stay fixed when the variables change.
- Tone: Night-shift, concrete, and dry. Short US English. The failure is a machine losing its frame, not an injury. No gore, no real brands, and no slogans taken from other games.

## Stack
- Framework: Vite 6 + TypeScript 5
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide (ISC), @fontsource/rajdhani (OFL-1.1), @fontsource-variable/outfit (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold Vite's vanilla TypeScript template. Scripts: dev=vite, build=tsc && vite build, preview=vite preview. Do not add React, a physics engine, a game engine, or a postprocessing npm package.
  - In vite.config set base to './', build.outDir to dist, build.emptyOutDir to true, and build.sourcemap to false. In tsconfig set strict true, target ES2022, and noEmit true so tsc only typechecks.
  - Install only three, lucide, @fontsource/rajdhani, and @fontsource-variable/outfit as dependencies, plus vite and typescript as devDependencies. Import WebGLRenderer, FogExp2, and PMREMGenerator from three. Import EffectComposer, RenderPass, and UnrealBloomPass from three/examples/jsm/postprocessing/EffectComposer.js, RenderPass.js, and UnrealBloomPass.js. Those example modules ship with three under the MIT license.
  - Import Rajdhani 500, 600, and 700 from @fontsource/rajdhani, and Outfit Variable from @fontsource-variable/outfit/wght.css. Use the family names Rajdhani and Outfit Variable. Do not load any font from a CDN.
  - Copy only the SVG path data for pause, play, rotate-ccw, volume-2, volume-x, chevron-left, chevron-right, circle-help, and x from the installed lucide package into src/icons.ts. Render them as inline SVG at stroke 1.75. Do not add lucide-react.
  - Use one index.html with a full-viewport canvas and semantic HTML overlays. No router and no second page. Set the document title from content.ts to BRAND followed by an em dash and CITY.
  - Split the code into src/content.ts, src/track.ts, src/canyon.ts, src/skiff.ts, src/sim.ts, src/hud.ts, src/minimap.ts, src/audio.ts, src/icons.ts, src/main.ts, and src/styles.css. Every visible string lives in content.ts. Every course number lives in track.ts. Other modules import those files and do not hard-code names or placements.
  - When BRAND, CITY, VEHICLE, CARGO, DESTINATION, or DISPATCHER change, rewrite the start card, pilot notes, signs, results sentences, and flank decal so none of the default names remain. Keep the sentence count, the control mapping, the mesh, the palette, and the course.
  - Derive the localStorage key from a slug of BRAND: lowercase, spaces become hyphens, drop other punctuation, then prefix lane-best-haul:. Store only the best haul integer. Do not hard-code Lumenlane into the key.
  - Cap device pixel ratio at 1.75 on the desktop tier and 1.25 on the phone tier. Pause the simulation when the document is hidden and show the pause card. Do not auto-resume when it becomes visible again.
  - Before finishing, play the default run at 1440 by 900 and at 390 by 844: launch, bend, push pace, spend surge, pocket a crystal, pass an arch, scrape a wall, take a drone hit, reach the berth, empty the frame on a second run, pause, and toggle reduced motion. The console must stay empty.

## Variables
- [BRAND] — Game name (default: "Lumenlane"). One invented word shown as the large start-card title. Never a real company or an existing game.
- [CITY] — Canyon city (default: "Amberwharf"). One invented place name used on the eyebrow, the first sign, and the title.
- [VEHICLE] — Hovercar name (default: "Kite Skiff"). Two or three invented words, under 18 characters, painted on the flank and used in sentences. The mesh does not change.
- [CARGO] — Pickup name (default: "relay crystals"). A lowercase plural noun phrase of two words, used in the headline and the start-card body.
- [DESTINATION] — Finish name (default: "Roof Berth"). Two invented words for the pad at the end of the lane.
- [DISPATCHER] — Dispatcher (default: "Mara Quill"). An invented first and last name. Not a real person or a public figure.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/neon-hovercar-city-runner in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/neon-hovercar-city-runner?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by neoncity one-shot hovercar game by @JulianGoldieSEO — https://agentos.guide/grok-4-7-agent-os
— Prompt by VibeFather · https://vibefather.ai/t/neon-hovercar-city-runner · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
