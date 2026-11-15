# Island Postal Route Game

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an original English-language third-person 3D exploration game on [ISLAND_NAME], an invented [SETTING], for [AUDIENCE]. The default tagline is 'Three stamps. One open gate.' The player guides an original postal courier on foot, discovers wind, river, and mountain shrines in any order, collects one stamp at each, and opens a northbound temple gate for the final delivery. The entire product is one playable static page at index.html, with a live island as the first-screen visual anchor and no marketing landing page.

- Audience: Indie hackers, front-end developers, designers, creative-coding learners, and casual players who enjoy gentle exploration. The interface must welcome first-time 3D players with short instructions, forgiving collisions, clear signs, and no timers or combat while keeping the world data and game logic straightforward to adapt.
- Goal: Deliver a complete low-pressure game loop: walk from the post house, follow paths, discover and activate three shrines in any order, see each stamp enter the quest log, open the temple gate after the third stamp, cross the threshold, and reach a completion panel with replay and reset controls. Preserve collected stamps on the current device and make keyboard and touch play equivalent.
- Tone: Gentle, pastoral, curious, tactile, and quietly optimistic. Use concise original US English field-journal copy, friendly wayfinding, and small environmental details. There is no combat, health bar, countdown, fail state, punitive copy, epic fantasy lore, paper-crane mascot, or reference to an existing game or AI product.

## Stack
- Framework: Vite 6 + TypeScript 5
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide (ISC), @fontsource-variable/fraunces (OFL-1.1), @fontsource-variable/dm-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold Vite's vanilla TypeScript template with scripts dev=vite, build=tsc && vite build, and preview=vite preview. Do not add React, a physics engine, a full game engine, or another rendering framework.
  - Set vite.config base to './', build.outDir to 'dist', build.emptyOutDir to true, and build.sourcemap to false. Enable strict TypeScript checking and produce only static files in dist/.
  - Install only three, lucide, @fontsource-variable/fraunces, and @fontsource-variable/dm-sans as runtime dependencies, plus Vite and TypeScript development dependencies. Import Fraunces 600/700, DM Sans 400/500/600/700, and only the Lucide icons actually used.
  - Organize the implementation into src/content.ts, main.ts, terrain.ts, scene.ts, player.ts, quests.ts, controls.ts, ui.ts, audio.ts, and styles.css. Keep pure route and collision data separate from Three.js rendering.
  - Put BRAND, ISLAND_NAME, SETTING, AUDIENCE, TAGLINE, shrine names, sign text, objectives, instructions, dialog copy, button labels, and aria copy in src/content.ts. Rewrite setting-specific names, foliage accents, and scene dressing when variables change while preserving coordinates, three-stamp mechanics, and UI structure.
  - Derive a stable localStorage key and decorative random seed from BRAND and ISLAND_NAME. Save only collected shrine IDs, completion status, and sound preference; restore collected stamps and the open gate on reload but return the courier to the post house rather than restoring an unsafe position.
  - Use one index.html with a WebGL canvas and semantic HTML overlays. Wait for document.fonts.ready before creating any CanvasTexture signs. Bundle every font, script, icon, and generated visual locally; no remote assets or APIs.
  - Seed only decorative trees, shrubs, rocks, and leaf offsets. Keep path splines, shrine positions, temple coordinates, collision shapes, and quest results deterministic. Cap rendering work, pause when hidden, and dispose all geometries, materials, textures, listeners, audio nodes, and the renderer on teardown.

## Variables
- [BRAND] — Postal service name (default: "Amberwick Post"). An invented small postal service used in the title, journal, post house, and saved-progress key.
- [ISLAND_NAME] — Island name (default: "Amberwick Isle"). An invented island name used in the welcome copy, route journal, and completion panel.
- [SETTING] — Island setting (default: "autumn woodland island"). The world's season and landscape theme; adapt foliage accents and scene dressing without changing the route.
- [AUDIENCE] — Player audience (default: "players who enjoy quiet exploration"). The intended players, used naturally in the help introduction rather than as metadata.
- [TAGLINE] — Game tagline (default: "Three stamps. One open gate."). A short original line shown below the game name and repeated on completion.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/island-postal-route-game in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/island-postal-route-game?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by Island Postal Route Game — https://www.kimi.com/showcases/3dmake
— Prompt by VibeFather · https://vibefather.ai/t/island-postal-route-game · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
