# Amberwick Post

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\606-island-postal-route-game\606-island-postal-route-game.md`, with the complete shared `src\workflows\AI Agent\DESIGN.md`.
- Source and static export: this directory and its `out\` subdirectory. Browser-only ES modules, original locally generated Three.js geometry, local Lucide icons, and local Fraunces/DM Sans fonts.
- Play: pick up the letter, walk with WASD/arrows or touch arrows, activate three shrines in any order, cross the opened north gate, and replay/reset. Follow trail offers real assisted walking, not teleportation. Collection score is three stamps plus final delivery; no timers or penalties.
- Persistence: only shrine IDs, completed delivery, and sound preference are saved. Position and carried letter are not saved; reload begins safely at the Post House. Storage denial is disclosed in the journal.
- Serve `out\` with the repository's `startPreviewServer` from `src\workflows\script\generate-preview.mjs`, at `/pages/island-postal-route-game/GPT-6/index.html`. No build, backend, API, credentials, or environment variables.
- Adaptation: authorized native HTML/CSS/JavaScript static implementation instead of the requested Vite 6/TypeScript 5 scaffold/build. Gameplay modules retain the requested separation; variable/world/gameplay copy is in `content.js`, while static semantic overlay copy remains in `index.html`. Export is `out\`, not `dist\`. No production build or deployment performed.
- Scope: full public prompt game loop; unavailable Pro-only layout/assets are not claimed or copied. Original low-poly landscape, forgiving deterministic collisions, decorative foliage, simple optional synthesized stamp sound, bounded pixel ratio, pause while hidden, resource disposal on teardown. Touch arrows offer movement rather than camera orbit; zoom is available.
- QA: private `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`; actual 1200×900 desktop and 390×844 mobile Chromium runs. The final validation report records concrete assertions and manual screenshot review. Public preview is `out\preview.png`; hidden input/preview digests are outside the export.
- Verified result: 51 assertions passed, no HTTP/request/console/page errors, no horizontal overflow before or after play, keyboard and actual touch movement, letter pickup, two shrine orders, stamp/sound restoration, locked/open gate, final delivery, mobile replay, desktop reset/cancellation. Both real QA PNGs and the fresh 1200×900 preview were opened and visually reviewed after refinements to paths, roof geometry, lighting, and touch targets.
- Registration: disabled, undeployed collection option only after validation. No collection assembly or remote publication.

## Attribution and license

Prompt by **VibeFather**, [Island Postal Route Game](https://vibefather.ai/t/island-postal-route-game), via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/island-postal-route-game/prompt.md). Prompt adaptation under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires a VibeFather Pro license. Original upstream license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.

No third-party demo artwork is reused. Three.js MIT, Lucide ISC, Fraunces and DM Sans SIL OFL licenses accompany local public assets in `out\licenses\`. See `LICENSE` for adaptation notice.
