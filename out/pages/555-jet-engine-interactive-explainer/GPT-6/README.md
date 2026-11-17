# Aerofield Lab — High-Bypass Turbofan

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\555-jet-engine-interactive-explainer\555-jet-engine-interactive-explainer.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Original prompt: [VibeFather](https://vibefather.ai/t/jet-engine-interactive-explainer), collected through [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/jet-engine-interactive-explainer/prompt.md). CC BY-NC 4.0; attribution and non-commercial restriction retained in `LICENSE` and footer.
- Source: this directory's `index.html`, `styles.css`, `content.js`, `app.js`. Public static delivery: `out\`. No backend, API calls, environment variables, remote fonts or third-party assets.

## Implementation and limits

An original, responsive engineering exhibit: procedural SVG cutaway with 22 fan blades, three LP and six HP compressor rows with interleaved stationary vanes, an annular combustor with 12 nozzle markers, one HP and three LP turbine rows, two coaxial shafts, bypass duct and exhaust cone. A shared throttle controls projected rotor motion and deterministic airflow particles. The 4.8 / 12.5 radians-per-second endpoints and approximately 2.6:1 ratio are teaching values, never real operating RPM. Pause, separate flow visibility, five scroll-driven stage highlights, manual stage selection, reset, and a corrective-feedback quiz work locally. Only visible scenes animate; hidden documents and reduced-motion preferences stop continuous movement.

Explicit authorized static adaptation: native HTML/CSS/JavaScript with an always-available original SVG schematic replaces the requested Vite/React/TypeScript/Three.js stack. No WebGL, OrbitControls, RoomEnvironment, CAD, metallic physical rendering, 3D camera, font packages or Lucide package is used. It is not a fluid, thermodynamic, combustion or engine-performance simulator. All speed readouts are illustrative setpoints, including while motion is paused. The public prompt omits its Pro-only design sections; no paid demo assets or layout are copied. This is a complete static educational homepage, not exact parity with those undisclosed sections.

## Run and verify

From the repository root, `node src\workflows\script\generate-preview.mjs out\pages\555-jet-engine-interactive-explainer\GPT-6\out` serves the isolated static page for its 1200×900 preview, without a build. Serve `out\` with any static HTTP server for interactive browsing. Final route: `/pages/jet-engine-interactive-explainer/GPT-6/index.html`.

Private validation and screenshots: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. These are never included in the public export. Run `node out\pages\555-jet-engine-interactive-explainer\GPT-6\.checks\qa.mjs` from the repository root to reproduce browser checks using installed Playwright Chromium.

Actual Chromium checks passed at 1200×900/DPR 1 and 390×844: successful final-subpath HTTP responses; all local resources; no console, page, network or HTTP errors; no horizontal overflow before/after interaction; blade counts and responsive particle counts; moving/paused/stopped geometry; keyboard slider endpoints and synchronization; core/bypass isolation; five manual and five scroll-selected states; reset; quiz incorrect/correct feedback and keyboard retry; mobile touch interactions; reduced motion; and offscreen rendering suspension. Desktop and mobile PNGs were both opened and visually reviewed: balanced typography, clear warm-paper/dark-cutaway contrast, intact engine geometry, reachable controls, and no clipped page content. Small diagram labels on mobile are supplemented by readable chapter text.

The first QA pass found reset being superseded by an outstanding scroll update. Reset now returns to the overview scroll position, and the complete QA suite subsequently passed. No build, collection assembly, publication or deployment is performed. Registration remains disabled and undeployed.
