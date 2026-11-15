# 3D Colosseum History Explorer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an original explorable exhibit titled [EDITION] for [AUDIENCE]. Use an entirely code-built Three.js Colosseum model, orbit/zoom, a construction-to-weathering state scrubber, four explanatory hotspots, a meaningful cutaway and a guided camera tour.

- Audience: [AUDIENCE], museum visitors and anyone who learns spatial ideas by exploring.
- Goal: Make the relationship between facade, seating, arena and service spaces understandable through direct manipulation.
- Tone: Precise, curious, readable US English; distinguish observation from interpretation and label figures approximate.

## Stack
- Framework: Vite + TypeScript
- Styling: Vanilla CSS
- Libraries: three (MIT), @fontsource/newsreader (OFL-1.1), @fontsource/dm-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Install dependencies locally. Configure Vite base ./, build.sourcemap false and an npm run build script.
  - Create src/content.ts for variables, state explanations, hotspot copy, UI and source links. Rewrite edition/audience tone when variables change without changing the architectural subject.
  - Use Three.js OrbitControls from the installed package and original procedural meshes, CanvasTextures and shaders; no ready-made architectural assets. Render a settled high-quality model immediately.

## Variables
- [BRAND] — Learning studio (default: "Stonefield Atlas")
- [EDITION] — Exhibit title (default: "An amphitheater, unbuilt")
- [AUDIENCE] — Visitors (default: "Curious minds and architecture students")
- [ACCENT] — Interface accent (default: "#B58A50")
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/3d-colosseum-history-explorer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/3d-colosseum-history-explorer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by Code-built amphitheater in a reasoning-effort study by @Paras Tiwari — https://spectrumailab.com/blog/gpt-6-1-sol-reasoning-effort-test-2026
— Prompt by VibeFather · https://vibefather.ai/t/3d-colosseum-history-explorer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
