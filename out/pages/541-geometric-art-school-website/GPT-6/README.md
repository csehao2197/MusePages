# Formhouse School

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Original: `data\prompts\541-geometric-art-school-website\541-geometric-art-school-website.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory's `index.html`, `styles.css`, `content.js`, `app.js`. Static export: `out\`. Private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
- Public target: `pages/geometric-art-school-website/GPT-6/index.html`. Registration is disabled and undeployed.

## Implementation

Original primary-color studio pinboard, eight detailed SVG student artworks, four fictional cut-paper faculty portraits, six combined-filter courses with substantial outlines, filtered/cycling work dialogs, device-local favorites, teaching approaches, Saturday itinerary previews, validated application previews, local text download, explicit save/clear drafts, keyboard dialogs, native FAQ and mobile navigation.

This is an authorized build-free HTML/CSS/browser-JavaScript adaptation of the requested Vite/React/TypeScript stack. Editable copy and sample data are centralized in `content.js`, replacing `src/content.ts`. No Vite build, minification or production deployment is claimed. Fonts are locally bundled from the specified Fontsource packages; no external runtime assets. Defaults Formhouse School / East Marlow / 26 Assembly Lane / graphic design, illustration, and objects are used; the optional Common Shape Institute alternate content set is not selected.

All school facts, people and student work are fictional. Forms never send requests. Portfolio URLs are validated but never fetched. Personal form data is stored only after explicit Save draft; Clear draft removes it. Favorites contain project indices only. No accreditation, admissions, enrollment or employment guarantees.

## Run and verify

From the repository root, `node src\workflows\script\generate-preview.mjs out\pages\541-geometric-art-school-website\GPT-6\out` uses the existing local-only static preview helper. Private QA runner: `node src\workflows\script\.ai-gpt6-541.mjs qa`; no build is needed. The runner serves only the static export at its final public subpath, uses installed Playwright Chromium, tests desktop/mobile interactions and closes owned resources.

Executed validation: source/static checks and full Playwright interaction assertions at 1200×900, 1440×900 and 390×844, DPR 1; zero browser/resource errors and horizontal overflow before/after interactions. Tested combined filters, all six outlines, keyboard dialog focus/closing, all eight 60-word projects and filtered cycling, favorites, all faculty approaches, itinerary validation/edit/reset, application validation/escaping/download, explicit draft save/restore/clear, FAQ and reduced motion. Actual desktop/mobile PNGs and lower-section screenshots were opened for visual review; category triangle corners and portrait ground consistency were refined.

Final evidence: `.checks\qa.json` and `src\workflows\script\.ai-gpt6-report-541.json`. `out\preview.png` is the real 1200×900 first-screen screenshot, also opened and checked; fingerprints are private. Source/static, browser, preview and registration are separately verified. Registration does not publish this page. See `ASSETS.md` and `LICENSE` for attribution and noncommercial restrictions.

## Provenance

Prompt by VibeFather: https://vibefather.ai/t/geometric-art-school-website.
Imported from https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/geometric-art-school-website/prompt.md.
Original license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.
CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/. Adapted noncommercial concept; original author retains rights. Footer credit retained. Commercial use requires separate permission; the original source's VibeFather Pro terms apply. No live-demo screenshots, code or artwork were copied.
