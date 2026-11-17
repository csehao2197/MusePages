# Rainveil

- Actual generator: `gpt-6.1-sol`; public model directory: `GPT-6`.
- Original: `data\prompts\604-ink-wash-mountain-adventure\604-ink-wash-mountain-adventure.md`.
- Source: this directory; static export: `out\`; private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
- Public destination when separately selected and published: `pages\ink-wash-mountain-adventure\GPT-6\index.html`. Registration is disabled; no build or deployment is performed.

## Play

A real local third-person 3D practice: traverse a rising mountain trail, read three deterministic guardian sweep patterns, dodge with invulnerability, spend and regenerate Breath, chain three strikes, open each gate, and reach the summit circle. Checkpoint retries preserve completed guardians. A full replay resets the run. Only sound preference and best active completion time use localStorage; there is no backend, account, score service, or mock combat.

Keyboard: WASD/arrows, J strike, Space dodge. Mouse: click trail to walk; click guardian or Strike to strike; click Dodge to evade. Mobile: held directional pad and Strike/Dodge. Help and pause are keyboard-accessible dialogs. Hidden tabs pause simulation/audio; input clears on blur. The fixed simulation step is 1/60 second, with capped deltas. Decorative seeded geometry and original procedural ink-lighting shaders create the mountain, pines, training figures, rain, and retreat gates; no third-party demo images are used.

## Static adaptation

The authorized build-free HTML/ES-module implementation replaces the requested Vite 6/TypeScript pipeline with plain browser JavaScript and locally copied Three.js, Lucide, Newsreader, and Inter. No compilation or production build is required. Modules separate simulation/combat, geometry, controls, weather, audio, and overlays. Initial semantic HTML copy and dynamic `content.js`/`ui.js` copy are not a single TypeScript content module. Renderer teardown disposes shared GPU resources and listeners. Synthesized rain and distant thunder are opt-in. No external API or runtime asset requests.

The provided original is the public brief, not the paywalled Pro sections. Exact unpublished coordinates, timings, or demo artwork are not claimed. This implementation supplies original route geometry, timings, layout, and art matching the public game loop. All text is English, including the seal; no Chinese calligraphy is used.

## Running and checks

From repository root, use the existing `startPreviewServer` from `src\workflows\script\generate-preview.mjs`, passing this directory’s `out` path; it serves only static output at its final public subpath. No dev server is needed. The private `.checks\verify.mjs` uses installed Playwright Chromium and this helper. Run with `node out\pages\604-ink-wash-mountain-adventure\GPT-6\.checks\verify.mjs`.

Validation results and visual review are recorded after execution in `.checks\qa.json`. `out\preview.png` is a fresh 1200×900 browser screenshot maintained by `StaticHomepage.ensurePreview`; fingerprint files remain private. See the private report for actual final flags and test evidence.

Actual acceptance: 14 Playwright groups passed at 1200×900/DPR1 and 390×844/DPR1, including a complete keyboard three-guardian/summit/restart run, timed dodges, combos, Breath/range rules, pause and mouse navigation, real touch-held traversal and first-guardian calibration, and real failure followed by a checkpoint retry retaining the first learned form. No browser console/page/request/resource errors or horizontal overflow occurred in the final run. Four focused simulation tests passed (`node --test` with `.checks\simulation.test.mjs`). Both real first-screen PNGs and the completion PNG were opened for visual review. Contrast, mobile objective placement, progress indicators, and instanced terrain rendering were refined before the final pass.

Known limits: desktop/mobile Chromium is tested, not every GPU/browser or mobile landscape size. WebGL is required. This is a short original local practice, not the unpublished Pro demo or a production action-game engine. Lucide uses its local UMD distribution rather than icon-by-icon TypeScript imports. No build, deployment, online record, or backend service is claimed.

## Source and license

Prompt by **VibeFather**, [original prompt](https://vibefather.ai/t/ink-wash-mountain-adventure), [source snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/ink-wash-mountain-adventure/prompt.md). Prompt/adaptation: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); non-commercial only. Commercial use needs a VibeFather Pro license. Original local art and implementation created for this adaptation; no rights to referenced demo assets are claimed. Third-party library and font notices are in `LICENSE` and `vendor\`.
