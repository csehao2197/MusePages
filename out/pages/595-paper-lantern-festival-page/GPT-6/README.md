# Lumaire — The Quiet Current

An original, fictional, entirely digital paper-lantern gathering on River Aster.

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\595-paper-lantern-festival-page\595-paper-lantern-festival-page.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory. Independent public static files: `out\`.
- Features: seeded Canvas 2D landscape, six-panel lanterns, wind, pause, reset, keyboard-operable write–fold–release, local gallery with relaunch and confirmed removal, 24-wish limit, validated storage, reduced-motion tableau.
- All wishes and the composer stay in this browser. No real event, public feed, account, analytics, backend, or uploaded text. Other lanterns represent twelve invented ambient wishes. This is not guidance for real fire or outdoor lantern releases.

## Static adaptation

The original requests Vite 6 / React 18 / TypeScript. This authorized build-free adaptation uses native ES modules and semantic DOM instead, with equivalent local state, lifecycle cleanup, and a procedural Canvas renderer. It has no Vite build or `dist` output. `content.js` centralizes copy and alternate variables; `storage.js` validates records; `scene.js` owns simulation; `app.js` owns the ritual and gallery. `icons.js` contains locally serialized Lucide SVGs. Fontsource packages supply only local Latin fonts. `package.json` is private dependency provenance, not public output.

## Run and verify

From the repository root, serve the public directory with the existing isolated helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\595-paper-lantern-festival-page\GPT-6\out
```

This captures the real static page, not a build. For automated interaction QA run:

```powershell
node out\pages\595-paper-lantern-festival-page\GPT-6\.checks\verify.mjs
```

QA records and desktop/mobile screenshots are private in `.checks\`; workflow preview is `out\preview.png`. Browser tests and actual screenshot review are recorded in `.checks\qa.json`; completion is determined by those results and `metadata.json`, not this document. No environment variables or runtime network dependencies are required. No build, collection assembly, publication, or deployment is included.

Verified: 16 browser-check groups passed with no HTTP, resource, console, or page errors. Real Chromium testing covered 1200×900 desktop, 390×844 touch, and 1440×900 reduced motion; keyboard folding/release/removal, reload persistence, duplicate prevention, the 24-wish cap, malformed/unavailable storage, motion pause/resume, 120-character wrapping, control clearance, and 44×44px mobile targets passed. The actual desktop and mobile PNGs were opened and visually reviewed; the fresh 1200×900 workflow preview was also opened. The public export and preview fingerprints were checked using the repository helpers.

The gallery is browser-local, not encrypted. Anyone with access to the same browser profile can see it. Private browsing, unavailable storage, or clearing site data can remove persistence; storage failure leaves the current session usable with an inline warning.

## Attribution and license

Adapted from “Paper Lantern Festival Page,” prompt by **VibeFather**, via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/paper-lantern-festival-page/prompt.md). [Original template](https://vibefather.ai/t/paper-lantern-festival-page). Prompt and adaptation: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), noncommercial; commercial use requires the applicable VibeFather Pro license. The archived license is `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.

The procedural landscape, paper geometry, alternate fictional identity, wishes, and copy are newly authored for this adaptation. No demo art or screenshots were reused. See `ASSETS.md`, `LICENSE`, and public `licenses\` for asset attribution and unmodified third-party notices.
