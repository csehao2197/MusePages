# Flurryfield

Original interactive snow-globe homepage. Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.

- Input: `data\prompts\587-snow-globe-toy\587-snow-globe-toy.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory's HTML, CSS and browser ES modules. Static export: `out\`.
- Features: three original procedural 3D worlds, enclosed deterministic snow, drag-driven impulses, three-part shake, gravity settling, brass CanvasTexture message, keyboard controls, optional phone tilt, reduced motion, native help dialog, original SVG fallback.
- All state is in this browser tab; no backend, mocks, accounts, remote assets, persistence, or sensor transmission.

## Run and verify

From the repository root, use `node src\workflows\script\generate-preview.mjs out\pages\587-snow-globe-toy\GPT-6\out` for an actual static screenshot. The workflow's `startPreviewServer` serves only this static folder at the collection subpath. No build is needed.

The private `.checks\qa.mjs` verifies the actual static page with installed Playwright Chromium. Its 19 assertion groups passed at 1200×900, 1440×900 and mobile 390×844: HTTP/local resources, no runtime/request/console errors or horizontal overflow before/after play, actual lift/containment/settling, all three worlds, live plaque boundaries, keyboard scoping, captured pointer/touch drag and upright return, help focus trap, reduced motion and preference changes, WebGL fallback, and synthetic granted/denied sensors. `.checks\qa.json` contains exact evidence; `.checks\desktop.png`, `mobile.png`, `lighthouse.png` and `city.png` were opened and visually reviewed. The refreshed physical framing separates captions from the base on mobile. Message editing remains readable in the workbench; small plaque lettering is naturally smaller on a phone.

Read-only `window.__globe.stats()` exposes real physics diagnostics locally. The automated software-WebGL environment is not hardware performance certification: nearly all snow settled within eight **fixed-step simulation seconds**, but CPU-only rendering took longer in wall-clock time. Adaptive render resolution reduces load; smoothness and four-to-eight-second real-time settling cannot be guaranteed on slow software renderers. No physical phone/sensor testing is claimed.

## Adaptation and limits

This authorized build-free HTML/ES-module adaptation replaces the requested Vite/React/TypeScript framework and React state with DOM state and lifecycle-managed Three.js 0.170.0. No production build or `dist` is run. `content.js` centralizes copy instead of `src/content.ts`; the content-derived document title is set on module initialization. Local npm packages provide Three.js, RoomEnvironment and Latin Fontsource files; utility SVGs reproduce Lucide paths without the React runtime. Static miniature parts are merged by material. No backend is requested or simulated. Sensor behavior depends on device permissions; physical-device testing is not claimed. The SVG fallback preserves selection, message and button/keyboard flurries, not 3D physics.

## Attribution and license

Prompt by **VibeFather**, [Snow Globe Toy](https://vibefather.ai/t/snow-globe-toy), from [awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/snow-globe-toy/prompt.md). Prompt and adaptation are non-commercial under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial/client use needs separate permission. Original source license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.

All globe geometry, shaders, Canvas artwork and thumbnails were authored for this result by GPT-6 (`gpt-6.1-sol`), not copied from demo artwork. See `ASSETS.md` and static `licenses\` for third-party notices. Disabled collection registration is not deployment.
