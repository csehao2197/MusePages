# Copper Quay Couriers

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\589-harbor-town-delivery-game\589-harbor-town-delivery-game.md`, with the complete shared `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory; independent static export: `out\`.
- Public path: `pages/harbor-town-delivery-game/GPT-6/index.html`.

## Play

Start a 180-second shift in Bellbuoy Bay. Press E at the depot to load six parcels. Drive with arrows or WASD, brake with Space, and stop at each golden numbered beacon to deliver with E. Six deliveries score 600 points plus two points per second remaining. P pauses; R recovers to the nearest junction. Touch steering, pedals, brake and delivery buttons provide mobile controls. Reset asks for confirmation; result cards start a fresh round. Sound is opt-in. Personal best is stored locally when storage is available.

The original low-poly WebGL town, van, shops, lighthouse, boats, vegetation, procedural street signs and minimap are local, real-time artwork. There are no remote assets, accounts, API calls or backend mocks. Missions and collision geometry are deterministic. Identity-seeded decorative variations do not change gameplay.

## Static adaptation and limits

This is a build-free HTML, CSS and JavaScript ES-module adaptation, not the requested Vite/TypeScript scaffold. The eight requested responsibilities are separated under `src\`; all configurable values and visible game copy are in `src\content.js`. Three.js, selected Lucide icons, Fredoka and DM Sans are vendored locally with their licenses. No framework build, deployment or installation outside this isolated project was performed.

The available original is the public brief, not the paywalled design or live-demo source. This original visual interpretation makes no claim to reproduce unavailable private assets. Arcade steering allows turning at rest. Collision uses simple boxes; there is no realistic suspension, AI traffic or production persistence. WebGL2/hardware acceleration is required. Best scores are device-local. Browser navigation away ends the unsaved current shift.

## Run and verify

Use the repository's `startPreviewServer` from `src\workflows\script\generate-preview.mjs`, passing this project's actual `out\` folder. It serves only that folder at the final public subpath. No build is needed.

Private repeatable verification: `node out\pages\589-harbor-town-delivery-game\GPT-6\.checks\verify.mjs qa`. The `.checks\qa.json` file records actual source/static checks, desktop/mobile browser assertions, real keyboard driving and delivery completion, timeout, pause/recovery/reset, resource errors and screenshots. `.checks\desktop.png` and `.checks\mobile.png` are private QA images. The final report records actual visual-review and preview results, not assumed completion.

Verified on 2026-11-16: all 26 browser assertion groups passed at desktop 1200×900/DPR1 and mobile 390×844/DPR1. The desktop test drove all six real delivery routes using keyboard input and won; the mobile test used genuine touch events to load, drive, brake, steer and deliver at the first doorway. Timeout, pause/resume, help, recovery, confirmed reset, replay, exact scoring and persisted best score passed. Both viewports had no horizontal overflow before/after play and no HTTP/resource/request/console/page errors. Both actual PNGs and the in-game mobile PNG were opened and visually reviewed for hierarchy, spacing, typography, contrast and controls. The start card intentionally overlays the map until a shift begins.

The canonical `out\preview.png` was captured by `StaticHomepage.ensurePreview` at 1200×900 and opened for a separate visual review. Input, static-output and preview-image SHA-256 fingerprints were verified. Registration is disabled and undeployed; no production build or publication was run.

## Attribution and use

Original prompt by **VibeFather**, collected via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/harbor-town-delivery-game/prompt.md). [Template credit](https://vibefather.ai/t/harbor-town-delivery-game). Prompt/adaptation: **CC BY-NC 4.0**, non-commercial use with attribution; commercial use requires the rights holder's permission or applicable Pro license. See `LICENSE` and `NOTICE`. Third-party libraries/fonts retain their own MIT/ISC/OFL licenses. No third-party demo screenshot or scene asset is redistributed.
