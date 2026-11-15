# Harbor Town Delivery Game

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], a complete single-page 3D browser game set in [TOWN_NAME], an invented [SETTING]. The player drives an original low-poly delivery van, collects [DELIVERY_ITEM] at the depot, and delivers them to six glowing doorways before a [ROUND_SECONDS]-second shift ends. The playable town is the first screen and primary visual anchor, not a marketing hero or a decorative backdrop.

- Audience: Indie hackers, front-end developers, designers, and creative coding learners who want a polished, adaptable Three.js driving game that works with keyboard and touch and ships as static files.
- Goal: Deliver a complete and replayable arcade loop: start shift, drive, follow routes, pick up cargo, deliver to six addresses, manage the countdown, pause or recover, and reach a clear success or timeout result. Keep every control and scene asset local and make the same road and mission system usable with different content values.
- Tone: Cozy, coastal, playful, legible, and gently energetic. Use specific local place names and friendly delivery language, with no combat, pedestrians in danger, fail-shaming, real brands, or references to the inspiration.

## Stack
- Framework: Vite 6 + TypeScript 5
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide (ISC), @fontsource-variable/fredoka (OFL), @fontsource-variable/dm-sans (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold Vite's vanilla TypeScript template with scripts dev=vite, build=tsc && vite build, and preview=vite preview. Do not add React, a physics engine, or a full game engine.
  - Set vite.config base to './', build.outDir to 'dist', build.emptyOutDir to true, and build.sourcemap to false. Enable strict TypeScript checking.
  - Install only three, lucide, @fontsource-variable/fredoka, and @fontsource-variable/dm-sans as runtime dependencies, plus Vite and TypeScript development dependencies. Import Fredoka 600/700, DM Sans 400/500/600/700, and only the Lucide icons actually used.
  - Organize the implementation into src/content.ts, main.ts, scene.ts, driving.ts, missions.ts, minimap.ts, ui.ts, audio.ts, and styles.css. Keep all variable values, place names, instructions, button labels, and mission copy in content.ts; scene and UI modules must read from that file.
  - Use BRAND, TOWN_NAME, SETTING, DELIVERY_ITEM, and ROUND_SECONDS throughout. When values change, rewrite proper nouns, destination names, signs, objectives, and scene dressing to suit the new setting while preserving the road graph, six-job structure, collision dimensions, and UI layout.
  - Parse ROUND_SECONDS as an integer and clamp it to 60–600 for resilient behavior. Derive a stable localStorage key and decorative random seed from BRAND and TOWN_NAME rather than hard-coding either default name.
  - Use one index.html with a WebGL canvas and semantic HTML overlays. No router is needed. Wait for document.fonts.ready before creating any CanvasTexture street signs, set their colorSpace to SRGBColorSpace, and cap texture anisotropy at 4.
  - Seed only decorative placement variations such as shrubs, roof details, and boat bob offsets from TOWN_NAME. Keep roads, mission order, collision shapes, delivery points, and scoring deterministic.

## Variables
- [BRAND] — Delivery company (default: "Copper Quay Couriers"). An invented local delivery service; used in the title, start card, depot, and saved-score key.
- [TOWN_NAME] — Town name (default: "Bellbuoy Bay"). An invented town name used in the start card, signs, and results copy.
- [SETTING] — Setting (default: "harbor town"). The world's theme; change maritime props and destination names when this changes.
- [DELIVERY_ITEM] — Delivery item (default: "parcels"). Lowercase plural cargo noun used in objectives, instructions, and results.
- [ROUND_SECONDS] — Shift duration (default: "180"). Seconds available to complete all six deliveries.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/harbor-town-delivery-game in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/harbor-town-delivery-game?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by Harbor Town Delivery Game — https://www.kimi.com/showcases/3dmake
— Prompt by VibeFather · https://vibefather.ai/t/harbor-town-delivery-game · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
