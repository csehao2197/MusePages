# Mara Ellison Tutoring

- Actual generator: `gpt-6.1-sol`; public collection label: `GPT-6`.
- Original: `data\prompts\547-private-tutor-website\547-private-tutor-website.md`.
- Source: this directory; independent static homepage: `out\index.html`.
- Public path: `/pages/private-tutor-website/GPT-6/index.html`.
- Warm Chalk/Midnight editorial design, Lora/Manrope, supplied fictional photographs, subject/level finder, process, tutor profile, illustrative progress, calculated packages, rolling tutor-local calendar, browser-only booking draft, validation, copy/edit/reset, mobile navigation and accessible FAQs.
- `content.js` is the single editable content source (static HTML template and data); `app.js` handles browser interactions, `styles.css` holds tokens and responsive/reduced-motion styles. `index.html` is the retained rendered HTML source.
- Authorized adaptation: plain HTML/CSS/JavaScript instead of requested Vite 5/React 18/TypeScript/Tailwind/Motion. No production build or installation was run. CSS replaces framework transitions. Self-hosted Latin variable font weights are used; Lucide SVGs are serialized from the installed ISC package, not imitated.
- Run the existing static preview helper: `node src\workflows\script\generate-preview.mjs out\pages\547-private-tutor-website\GPT-6\out`. No backend, API, environment variables, external runtime assets, analytics or submission. The page requires JavaScript for interactive features; all static sections are available without it.
- Only the latest draft is stored in this browser. Names, contact information, profile, progress and availability are fictional; no appointment, payment, grade promise or real student outcome is implied. Clipboard failure exposes a selectable local summary.
- Private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`; final preview: `out\preview.png`. Validation results are recorded after actual tests and image inspection.
- QA command: `node out\pages\547-private-tutor-website\GPT-6\.checks\test.mjs`. Real Chromium assertions cover 1200×900, 390×844 and 1440×900, all three package choices, keyboard subject selection, form synchronization, calendar bounds, past times in New York, validation, restored slot/draft, clipboard and fallback, edit/reset, unavailable storage, FAQ, mobile navigation, resource/error checks and overflow before/after. Both real first-screen PNGs and the fresh preview were opened; full-page images were also checked for section hierarchy and image loading. A lazy-image screenshot gap was corrected by loading all photos before full-page QA capture.
- Visual review: restrained navy/periwinkle hierarchy, aligned subject/package rows, legible contrast, spacious desktop photo/copy balance, complete 390px hero/CTAs, stacked sections and seven-column calendar without overflow. Exact framework/layout-animation internals are adapted, not claimed identical to Motion/React.
- Registration is disabled and undeployed; no collection build, publication or upload is authorized.

## Sources and rights

Prompt by [VibeFather](https://vibefather.ai/t/private-tutor-website), copied from [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/private-tutor-website/prompt.md). CC BY-NC 4.0: non-commercial adaptation only; commercial use needs a VibeFather Pro license. Original license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`; redistributed as `out\LICENSE`. Asset attribution and independent font/icon licenses are in `ASSETS.md` and `out\NOTICE`.
