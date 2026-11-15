# Open World City Driving Game

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], a complete single-page 3D browser game in the invented district of [DISTRICT]. The player walks a small low-poly city at dusk, borrows any mint-striped pool car, and either carries [ERRAND] to three doors or drives [RACE_NAME], a six-gate lap. The whole district is loaded at once and is the first thing on screen. Lighting eases from lilac dusk to night over two and a half minutes of play. Default tagline: [TAGLINE].

- Audience: Indie hackers, front-end developers, and designers who want a polished static Three.js driving toy with keyboard and on-screen gamepad controls, readable at neighborhood speed on both a desk and a phone.
- Goal: Ship one replayable evening: a title card over a living street grid, free walking, entering and leaving pool cars, arcade driving, eight ambient traffic cars, a north-up minimap, a porch-run errand, a lap time trial, dusk-to-night light, pause and help, and local bests. Two different name sets must keep the same roads, handling, and mission geometry.
- Tone: Warm, local, and playful. Short US English, concrete place names, and the manners of a neighborhood car club. The player is a welcome member borrowing club cars and dropping parcels or flowers at doors.

## Stack
- Framework: Vite 6 + TypeScript 5
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide (ISC), @fontsource-variable/fraunces (OFL), @fontsource-variable/outfit (OFL), @fontsource/ibm-plex-mono (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold Vite's vanilla TypeScript template. Scripts: dev=vite, build=tsc && vite build, preview=vite preview. Package name is the slug of BRAND, not a fixed template id. Set vite base to './', build.outDir to dist, build.emptyOutDir to true, and build.sourcemap to false. tsconfig: strict true, noEmit true.
  - Install only three, lucide, @fontsource-variable/fraunces, @fontsource-variable/outfit, and @fontsource/ibm-plex-mono as runtime dependencies, plus Vite and TypeScript as dev dependencies. Do not add React, a physics engine, a game framework, postprocessing, or a tween library.
  - Import Fraunces variable weights 600 and 700, Outfit variable weights 400, 500, and 600, and IBM Plex Mono weight 500 from those packages. Import only the Lucide icons Play, Pause, Volume2, VolumeX, CircleHelp, Car, Flag, Package, and X. Wait for document.fonts.ready before drawing canvas signs.
  - Use modules src/content.ts, main.ts, world.ts, drive.ts, traffic.ts, missions.ts, lighting.ts, minimap.ts, ui.ts, audio.ts, and styles.css. Keep every proper name, button label, help line, toast, and sign string in content.ts. Simulation code reads that module.
  - World axes: +x east, +y up, +z north. Heading yaw for a mesh is Math.atan2(forwardX, forwardZ) assigned to rotation.y. Yaw 0 faces +z. Verify the Kiln pool car points north; if it points south, flip the yaw sign rather than mirroring the map.
  - Use BRAND, DISTRICT, ERRAND, RACE_NAME, and TAGLINE everywhere player-facing copy is built. When any value differs from the defaults, rewrite signs, shop names, awning props, and board sentences in content.ts and keep every coordinate, speed, color, and gate. If DISTRICT is Orchid Blocks and ERRAND is flower crates, use the alternate name table in the world section exactly.
  - Persist only porch best points, best lap seconds, and mute in localStorage under a key slugified from BRAND plus -evening. No calendar dates. Parse nothing from the network.
  - One index.html, lang=en, viewport with viewport-fit=cover, a full-view canvas, and HTML overlays. Document title is BRAND + an em dash + DISTRICT. Body overflow hidden. No router.

## Variables
- [BRAND] — Club name (default: "Amber Row Club"). Invented club or market name on the title card, clubhouse sign, and save key.
- [DISTRICT] — District (default: "Reed Wharf"). Invented neighborhood. Used in the eyebrow, idle objective, and title.
- [ERRAND] — Cargo (default: "bakery boxes"). Lowercase plural noun for the porch-run cargo.
- [RACE_NAME] — Lap name (default: "Lantern Lap"). Short name of the six-gate time trial.
- [TAGLINE] — Title deck (default: "Walk the blocks before the lamps take over."). One sentence under the club name on the title card.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/open-world-city-driving-game in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/open-world-city-driving-game?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by One-prompt open-world city driving demo by @XFreeze — https://www.tweaktown.com/news/113703/forget-gta-6-ahem-grok-4-7-made-a-gta-style-game-from-one-prompt-as-musk-boasts-of-ai-developing-photo-realistic-games/index.html
— Prompt by VibeFather · https://vibefather.ai/t/open-world-city-driving-game · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
