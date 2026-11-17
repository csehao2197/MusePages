# An amphitheater, unbuilt

Original procedural Three.js Colosseum exhibit for curious minds and architecture students. Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.

## Input and attribution

- Original: `data\prompts\537-3d-colosseum-history-explorer\537-3d-colosseum-history-explorer.md`.
- Design guide: `src\workflows\AI Agent\DESIGN.md`.
- [Prompt by VibeFather](https://vibefather.ai/t/3d-colosseum-history-explorer), [original snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/3d-colosseum-history-explorer/prompt.md), CC BY-NC 4.0. Inspired by the code-built amphitheater reasoning-effort study credited to Paras Tiwari in the original prompt.
- Applicable license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`; see local `LICENSE` and `NOTICE`.

## Implementation

Source: `out\pages\537-3d-colosseum-history-explorer\GPT-6\`; independent static export: its `out\` folder. Public subpath: `/pages/3d-colosseum-history-explorer/GPT-6/index.html`.

Original elliptical facade meshes with actual arched openings, columns and cornices; 15 concentric seating rows with arched radial supports; sand-covered arena floor; schematic hypogeum corridors and vertical connections. OrbitControls supports mouse/touch orbit and zoom. Keyboard arrows orbit, +/- zoom, Home resets. The timeline changes the visible construction and weathering geometry; four hotspots change the explanatory copy and camera; a quarter cutaway exposes the seating and half-arena floor; a four-stop camera tour can pause and resume. Content and source links are centralized in `content.js`.

The authorized build-free adaptation uses native JavaScript ES modules and vanilla CSS instead of Vite + TypeScript. Three.js and its official OrbitControls are installed locally and vendored with MIT attribution. Newsreader and DM Sans fonts are local, with OFL licenses. No builds, external assets, APIs, backend, mock services, environment variables or AI-generated images are used. WebGL 2 and JavaScript are required for the interactive exhibit.

Historical geometry, capacities and dates are approximate educational interpretations, not a precise survey, exact excavation plan or physically simulated decay. The permanent hypogeum appears only in the later completed state. The original public prompt explicitly omits paid layout/motion specifications; this is an original layout based on the available public brief, not a recreation of the Pro demo.

## Run and validation

From the repository root, serve only the model's static `out\` folder with `startPreviewServer` from `src\workflows\script\generate-preview.mjs`. No development or production build is required. The private `.checks\verify.mjs` uses existing Playwright Chromium and this server at the final public subpath; run it with `node out\pages\537-3d-colosseum-history-explorer\GPT-6\.checks\verify.mjs`.

QA evidence lives in `.checks\qa.json`, `.checks\desktop.png` and `.checks\mobile.png`, outside the public export. Verification status is recorded from actual runs rather than inferred from source generation. Preview is managed by `StaticHomepage.ensurePreview`; input and preview digests remain private. Registration is disabled and undeployed; no collection build or publication is performed.

Actual browser validation: 55 assertions passed at 1200 × 900 and 390 × 844, DPR 1. Desktop uses normal animation; mobile also tests reduced motion. Tests cover real facade/seat/floor geometry changes across four historical states, the quarter cutaway and exposed hypogeum, all four camera/copy hotspots, mouse and touch orbit, button/scroll/keyboard zoom, keyboard timeline and camera reset, tour start/pause/resume and all four desktop stops. Both viewports have no horizontal overflow before or after interactions and no HTTP, failed-resource, console or page errors. Owned browsers and static servers were closed.

The real desktop, mobile and cutaway PNGs were opened and visually reviewed. The serif heading, olive/ivory interface, warm stone model, consistent spacing and stacked mobile layout are intentional. Refinement added visible arched radial supports and removed a distracting ground-plane boundary. The managed `out\preview.png` was captured at 1200 × 900 and opened separately. Desktop's detailed exhibit extends below the first screen; the complete mobile review uses a full-page screenshot. Public text describes the study as approximate. The procedural model uses 64 bays per arcade rather than an exact 80-bay reconstruction.
