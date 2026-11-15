# Solar System 3D Explainer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A one-page interactive 3D scale model of [SYSTEM], published by [BRAND], an invented small science publisher. A fixed full-viewport WebGL canvas is the hero from the first frame, with thin instrument-style UI layered on top. It has two modes: Explore (drag to orbit, click a body to fly to it and read its numbers, a scale switch, a time slider) and Tour (a nine-stop scroll journey from [CENTER_BODY] outward with scripted camera moves, ending in a true-scale reveal and a table for pacing the model out on a real street). The signature moment is the scale switch: when distances and sizes animate to their true proportions, the planets all but vanish, and a live readout says how many pixels wide [HOME_BODY] now is.

- Audience: [AUDIENCE]. Default audience: teachers projecting it in class, and curious adults on a laptop or phone.
- Goal: Make one idea unforgettable: space is overwhelmingly empty and every poster misdraws it. Visitors should flip the switch within seconds, then take the tour.
- Tone: Calm, exact and a little wry, like a good science teacher. Short sentences, real numbers in US units first, no exclamation marks, no cosmic hype words such as vast, awe-inspiring or journey through the cosmos.

## Stack
- Framework: Vite 5 + vanilla TypeScript + three.js
- Styling: Tailwind CSS 3.4
- Libraries: three 0.169 (renderer, OrbitControls from three/addons) (MIT), gsap 3.12 with ScrollTrigger (GSAP Standard License (free, including commercial use)), lucide (icons) (ISC), @fontsource/instrument-serif (OFL-1.1), @fontsource/ibm-plex-sans (OFL-1.1), @fontsource/ibm-plex-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - No React or other UI framework: the scene is one imperative canvas and the UI is a small DOM overlay. The stack is fixed unless the user asks to change it.
  - vite.config.ts: base './', build.sourcemap false, build.chunkSizeWarningLimit 1200. The npm build script is: tsc --noEmit && vite build.
  - tailwind.config: extend colors with void, panel, hairline, ink, muted, solar from the Design section, and fontFamily with display (Instrument Serif), sans (IBM Plex Sans), mono (IBM Plex Mono). Custom CSS and the prefers-reduced-motion rules live in src/styles.css.
  - File layout: src/content.ts (all copy and all body data), src/main.ts (boot and mode switching), src/scene/system.ts (bodies, orbits, scale), src/scene/bake.ts (surface baking), src/scene/shaders.ts, src/scene/camera.ts (flights and tour path), src/ui/instruments.ts, src/ui/panel.ts, src/ui/labels.ts, src/ui/tour.ts.
  - Each body in src/content.ts has: id, name, kind, kicker, note, facts (array of label and value strings), diameterKm, distanceKm, orbitDays, rotationHours (negative means backward), tiltDeg, startAngleDeg, tourAngleDeg, surface (recipe name plus palette hexes), atmosphere (color and strength, or null), rings (or null), stop (azimuth, elevation, distance in radii, caption, chips, side). Scene code reads only this data, so a different system needs no scene changes.
  - If [SYSTEM], [CENTER_BODY] or [BODIES] differ from the defaults: use the real published figures for those bodies, restated in your own words, in the same fields. The tour gets one stop for [CENTER_BODY] plus one per body, numbered accordingly. Choose surface recipes and palettes from the same recipe set. Set belt and rings to null where they do not exist. Recompute the readable-scale table with the formulas given in the 3D scene section, and the street table with the method given in the Walk it yourself section. Rewrite any fact that does not apply (for example, Moons: none known; Day: likely always the same face to the star).
  - WebGL setup: THREE.WebGLRenderer with antialias true, logarithmicDepthBuffer true, powerPreference high-performance, ACESFilmicToneMapping, exposure 1.05, clear color #05070D. Pixel ratio min(devicePixelRatio, 2) on desktop and min(devicePixelRatio, 1.5) when pointer is coarse. Every custom ShaderMaterial must include the three.js logdepthbuf chunks in vertex and fragment, or depth sorting breaks.
  - Before creating the renderer, test canvas.getContext('webgl2'). If it returns null, do not create the renderer; show the fallback described in the 3D scene section, so the console stays clean.

## Variables
- [BRAND] — Publisher or project name (default: "Fernhill Almanac"). Invented science publisher, school project or museum microsite.
- [SYSTEM] — The system being explained (default: "the Solar System"). Any star with orbiting worlds.
- [CENTER_BODY] — The body at the center (default: "the Sun")
- [BODIES] — Orbiting bodies, inner to outer (default: "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"). Between 5 and 8 bodies keeps the tour a good length.
- [HOME_BODY] — The body used for the live pixel readout (default: "Earth"). The one readers will care about most.
- [AUDIENCE] — Who it is for (default: "middle school classrooms and curious adults")
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/solar-system-3d-explainer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/solar-system-3d-explainer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/solar-system-3d-explainer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
