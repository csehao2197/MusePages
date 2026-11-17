# Lampwright — Sodium Court

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original: `data\prompts\601-sci-fi-arena-wave-survival-game\601-sci-fi-arena-wave-survival-game.md`.
- Design input: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\601-sci-fi-arena-wave-survival-game\GPT-6\`; browser modules in `game\`.
- Independent static export: `out\` within this model directory.
- Public mount: `pages\sci-fi-arena-wave-survival-game\GPT-6\index.html`.

## Play

Enter the yard starts wave 1. WASD moves, mouse looks, click fires in pointer-lock mode, R reloads, F also fires, and Esc pauses/resumes. When pointer lock is refused, drag the yard or use arrow keys to look; use F or the visible Fire button. Mobile has independent move/look sticks, hold-to-fire and Reload. The Pause button also supports touch. Retry starts a fresh round immediately.

This is a real, local first-person game: axis-separated solid collisions, raycast carbine/occlusion, three-hit drones with orbit/avoidance behavior, segment-tested non-homing projectiles, shield overflow and invulnerability, numbered uncapped waves with queued live caps, health/shield pickups with respawn, pause/game-over/retry, reduced motion and synthesized sound. All geometry is generated in code. The scene uses the original specified yard dimensions and object placement. A shared light multiplier of 4.8 keeps warm faces readable without additional world lights.

## Static adaptation and limits

The requested Vite 5 / TypeScript / Tailwind 3.4 build is intentionally adapted to native browser ES modules, plain JavaScript and equivalent local CSS: this job authorizes no builds. There is no `dist` build, framework runtime, Tailwind CDN or dependency on the repository's Tailwind 4. Actual Three.js modules and the three requested Fontsource families are self-hosted with licenses. English copy is centralized in `game\content.js`; gameplay constants in `game\rules.js`.

No backend, mock API, accounts, remote assets, persistence, analytics or environment variables exist. Scores and sound settings are memory-only. WebGL is required; failure leaves a readable error/title card with Start hidden. Opaque-origin `sandbox="allow-scripts"` embeds require their static host to permit cross-origin module/font requests (CORS); once loaded, embedded play never requests pointer lock and uses drag/arrow fallback. This deployment-header requirement is not under page control.

## Run and verify without a build

From the repository root, use the existing `startPreviewServer` export in `src\workflows\script\generate-preview.mjs` with this model's actual `out` directory. It serves only static resources at the final public subpath. No dev server or production build is required.

Private browser assertions and real screenshots are recorded in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png` and gameplay screenshots. The model's root metadata records actual source/static/preview/registration readiness; pending checks stay false until verified. The private final job report is `src\workflows\script\.ai-gpt6-report-601.json`. Source/static validation, both viewport gameplay tests and image review must pass before completion is claimed.

Completed verification: 29 assertion groups passed in installed Playwright Chromium at 1200×900, 390×844 touch, and 1440×900 reduced motion, including actual simultaneous move/look/fire touches, native and denied pointer lock, keyboard combat, reload, pause, projectile damage, game over and retry. Controlled in-memory fixtures also exercised occlusion, pickups, shield overflow, collision/sliding, live caps, queue retention, timers and visibility freeze. An actual opaque-origin `allow-scripts` iframe was tested with CORS-permitting asset response headers supplied by the QA host. There were zero HTTP, resource, request, JavaScript or console errors. Four headless GL `ReadPixels` performance warnings were recorded separately; they are not application errors.

Both real desktop/mobile title PNGs and gameplay images were opened for visual review. The title hierarchy, spacing, contrast and mobile controls were checked; the shared lighting was increased and floor self-shadow striping removed before final capture. The actual generated 1200×900 homepage preview was also opened and checked against the live-yard title state. Earlier test-harness polling/cadence assertion failures are retained in the private QA history rather than hidden.

The homepage preview is `out\preview.png`, produced by `StaticHomepage.ensurePreview`; `.generation-input.sha256` and `.generation-preview.sha256` record input and output/image integrity. New registration is disabled and undeployed. No collection build, dist, publish or upload is part of this delivery.

## Source and license

Prompt by **VibeFather**, [original](https://vibefather.ai/t/sci-fi-arena-wave-survival-game), [snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/sci-fi-arena-wave-survival-game/prompt.md), **CC BY-NC 4.0**. Applicable license snapshot: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`, retained here as `LICENSE`; attribution also ships as `NOTICE`. Commercial use requires the original author's separate authorization. See `ASSETS.md` for Three.js MIT and font OFL attributions.
