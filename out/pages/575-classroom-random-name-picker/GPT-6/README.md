# Classroom Shuffle

Private classroom random name picker. Actual generator: `gpt-6.1-sol`; public model label: **GPT-6**.

## Input and provenance

- Original: `data\prompts\575-classroom-random-name-picker\575-classroom-random-name-picker.md`
- Design: `src\workflows\AI Agent\DESIGN.md`
- Prompt: [Classroom random name picker, Tencent EdgeOne](https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills/blob/e3f25bd20d371d9a64613306a6a48da15671a35b/prompts/zhi-hui-ban-ji-chou-jiang-xi-tong.md).
- Prompt license: MIT, Copyright (c) 2026 Tencent EdgeOne; complete notice in `LICENSE`.
- Original layout, CSS artwork, native HTML/CSS/JavaScript. Inline icons use Lucide/Feather geometry under ISC/MIT; see `NOTICE`.
- Source: this directory. Independent public static files: `out\`. No builds required.

## Features

Equal-probability Web Crypto selection with rejection sampling, sampling without replacement, 1–10 picks per draw, three rolling speeds, decelerated reveal, optional synthesized sound, confetti and reduced-motion support. Editable activity name; Space starts/stops, F toggles supported browser fullscreen. Responsive desktop and phone interface, time-sensitive stage color.

Roster supports 500 names, single addition, multiline addition, TXT import/export, duplicate handling, individual pause and removal. Default roster is fictional and editable. Paused students are excluded. Each picked student is excluded for the rest of the round, even if their winner card is hidden. Reset restores picked students and ordinal numbering, preserving manual pauses, roster and history. Requested counts above the available pool pick the remaining pool without duplication.

Roster, current round, activity and latest 200 draw records persist in localStorage. History filters by activity and can be cleared independently. Names are rendered as text, never HTML. No analytics, CDN, requests with names or external assets; CSP blocks network connections. Storage failure leaves a session-only mode with a visible notice. Browser storage is not encrypted or cross-device; clearing site data removes it.

## Static adaptation and limits

The original requested EdgeOne Functions, `LOTTERY_KV`, GET/POST/DELETE `/api/records`, an EdgeOne deployment template and public deployment. This authorized homepage-only implementation intentionally does **not** create or call a backend, claim a KV connection, include a deployment template or deploy anything. The clearly labeled offline/local fallback implements history in the browser. No environment variables or credentials. Generic rounded system fonts replace the preferred font; no unlicensed remote font is redistributed. Fullscreen depends on browser support and user activation.

## Running and verification

From the repository root, use the existing `startPreviewServer` helper in `src\workflows\script\generate-preview.mjs` with this directory’s `out\`; it serves only static files at `/pages/classroom-random-name-picker/GPT-6/`. Do not serve the source directory.

Private QA script: `.checks\qa.mjs`. Run from root:

```powershell
node out\pages\575-classroom-random-name-picker\GPT-6\.checks\qa.mjs
```

Actual results and viewport assertions are saved in `.checks\qa.json`; real desktop/mobile captures in `.checks\desktop.png` and `.checks\mobile.png`. Final preview is `out\preview.png`, generated with the existing `StaticHomepage.ensurePreview` helper. Completion and screenshot-review facts are recorded only after execution in the private job report; metadata flags are authoritative. No production build, gallery assembly, or deployment is part of this delivery.

Executed verification: 21 browser/static assertion groups passed at 1200×900, 390×844, and the 320px narrow edge. Tested real draws, no-repeat/exclusion/reset semantics, 500-name capacity, TXT download contents and import, history filter/deletion, mobile touch interactions, fullscreen, sound, safe name rendering, persistent state, storage denial and reduced motion. No console, page, request, or HTTP errors were observed; all requests were local static GETs. Both actual desktop and mobile PNGs were opened and visually reviewed. The review refined secondary typography/contrast and desktop density, and added an accessible mobile history control; the complete QA suite then passed again. Hierarchy, spacing, alignment and phone reflow were checked; mobile full-page capture is intentionally taller than its 844px viewport.
