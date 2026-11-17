# The Meridian House — Measure of Days

Generator: `gpt-6.1-sol`; public model label: **GPT-6**.

Original input: `data\prompts\545-museum-exhibition-website\545-museum-exhibition-website.md`.
Design guide: `src\workflows\AI Agent\DESIGN.md`.
Source: `out\pages\545-museum-exhibition-website\GPT-6\`.
Independent static homepage: `out\index.html` in this model directory.
Final intended URL: `/pages/museum-exhibition-website/GPT-6/index.html`.
No build or deployment was performed.

## Implementation

Warm gallery white, museum blue, locally hosted Fraunces/Inter/IBM Plex Mono, oversized two-line exhibition title, the six exact supplied museum photographs, alternating object plates, visit information, ticket planner, four sample events and original inline-SVG shop illustrations.

Every object has an in-place 1–3× CSS-transform inspector: 2.4× entry, pointer/touch pan, wheel and plus/minus zoom, reset, Escape, arrow-key panning and keyboard zoom. The responsive navigation drawer supports Escape. Reduced-motion preferences remove animation.

Tickets validate visitor counts (0–12 per category), closed Monday, Sunday opening time and the sold-out slot. Adult/reduced/free totals update immediately; 16:00 is pay-what-you-wish at admission. The selected sample slot persists under `the-meridian-house-slot`; sample event selections persist separately under `the-meridian-house-events`. Malformed saved data and blocked storage are handled safely. Saving takes no payment and holds no tickets.

## Static adaptation and limits

This authorized no-build adaptation uses native browser modules and CSS rather than the requested Vite 5/React 18/TypeScript/Tailwind 3.4/Motion stack. All exhibition copy, image paths, ticket data and links are centralized in `content.js`; Lucide icon geometry is extracted from the installed ISC-licensed package. No backend, external API, real booking, checkout or live calendar exists. This is an invented non-commercial homepage, not a real museum or production service. Fontsource Latin subsets are self-hosted; the complete English content is supported.

## Run and validation

From the repository root, serve the exported directory with the existing preview helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\545-museum-exhibition-website\GPT-6\out
```

The preview helper serves only the static folder on a random loopback port at the final public subpath, captures the homepage and closes its own server/browser.

Private browser QA: `.checks\qa.mjs`, `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
Run page-specific browser QA from the repository root:

```powershell
node out\pages\545-museum-exhibition-website\GPT-6\.checks\qa.mjs
```

Actual test results and visual-review evidence are recorded in `.checks\qa.json`; completion flags remain gated by source, static-resource, browser, screenshot and unique disabled-registration verification.

Validation completed with 24 passing assertion groups in installed Playwright Chromium: desktop 1200×900/DPR 1 and touch-enabled mobile 390×844/DPR 1, six inspectors, keyboard/pointer/touch pan and bounded zoom, ticket totals and persistence, event planning, navigation, reduced motion, malformed data and denied storage. Initial and post-interaction horizontal overflow checks passed; no HTTP, resource, request, console or page errors were observed. Both first-screen PNGs and full-page screenshots were opened for actual visual review. The review corrected an overly tall hero image and improved caption legibility; the final 4:3 geometry is asserted. The fresh `out\preview.png` was also opened and reviewed. Registration is disabled and undeployed.

## Attribution and licensing

Prompt by [VibeFather](https://vibefather.ai/t/museum-exhibition-website), obtained through [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/museum-exhibition-website/prompt.md). Original license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.

The prompt adaptation is **CC BY-NC 4.0**, attribution required; commercial use needs the source author's applicable license. See `LICENSE.txt` and `ASSETS.md`. This project does not grant additional rights. The footer retains “Template by VibeFather.” Each font's SIL Open Font License and the Lucide ISC license are included in the static export.
