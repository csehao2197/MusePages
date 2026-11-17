# Cadence House Music

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Input: `data\prompts\540-music-lessons-school-website\540-music-lessons-school-website.md`.
- Guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory; independent static output: `out\`.
- Original prompt by [VibeFather](https://vibefather.ai/t/music-lessons-school-website), collected via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/music-lessons-school-website/prompt.md).
- Prompt license: CC BY-NC 4.0; retain `LICENSE` and `NOTICE`. Commercial use requires separate permission. Photos and fonts are credited in `ASSETS.md`.

## Implementation

A warm plum, brass and cream single-page music school with six instruments, all four specified fictional teachers, complete multi-filter matching, weekly-opening handoff, published sample prices, a seven-day practice cycle and saved-week streak, community events, teacher portraits, sample reviews, inline-validated trial booking, mobile navigation and sticky call/trial links.

`content.js` centralizes copy, sample data, photo paths and links. Keys and telephone URLs derive from brand and phone. Finder, practice history and booking use validated, browser-local storage and silently recover malformed data. “Start a fresh week” archives the previous seven cells; consecutive nonempty archived weeks plus the current week determine the streak. Empty weeks break it. `45+` contributes a conservative 45 minutes. No dates, analytics, accounts, APIs, real reservations or text messages.

## Static adaptation and limits

The authorized no-build adaptation uses HTML, CSS and browser JavaScript instead of requested Vite 6 / React 18 / TypeScript / Tailwind 3.4 / Motion. Self-hosted Fontsource Petrona and Mulish weights are retained, alongside the six exact supplied generated photographs. CSS reduced-motion-aware reveals, finder entry fades, photo settling, cell feedback and goal fills replace Motion; numerical totals and streak updates are immediate rather than animated count-ups. No production build or deployment is performed. This is an invented school demo, not a production booking service.

## Run and verification

From the repository root, `node src\workflows\script\generate-preview.mjs out\pages\540-music-lessons-school-website\GPT-6\out` serves only this static export temporarily and captures its 1200×900 first screen at `/pages/music-lessons-school-website/GPT-6/index.html`; no build is needed.

Private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. The QA record is the source of truth for executed browser assertions and screenshot review. Final preview: `out\preview.png`. Input and static/preview SHA-256 records remain private in this model directory. Registration defaults to disabled and not deployed.

Executed Chromium QA at 1200×900 and 390×844, DPR 1: 26 passing assertions covering final-subpath HTTP, local fonts and photos, full teacher filtering and empty-state recovery, reload persistence, opening/form handoff, required/age/phone validation, local success/reset, practice cycles/goal/streak history, malformed storage, keyboard/mobile navigation, reduced motion, sticky-submit clearance and pre/post-interaction overflow. No console, page, request or HTTP errors. Desktop/mobile PNGs and finder/tracker detail images were actually opened; photo ratios and mobile tracker spacing were refined after visual inspection.

Re-run private browser QA from the repository root: `node out\pages\540-music-lessons-school-website\GPT-6\.checks\qa.mjs`. It uses existing Chromium and workflow static helpers without building, serving only this model’s `out\`. Running QA refreshes private screenshots; visual review and final preview metadata require the separate completion gate.
