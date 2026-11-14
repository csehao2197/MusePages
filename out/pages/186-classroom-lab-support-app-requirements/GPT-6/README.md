# LabRescue — Classroom Continuity & Repair

- Original: `data\prompts\186-classroom-lab-support-app-requirements\186-classroom-lab-support-app-requirements.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Independent browser-persisted cases for three issues, authored low-risk checks with stop/escalation, deterministic editable lesson activity, saved case history, printable handoff and teacher-confirmed resolution with save-failure protection.
- Source: `out\pages\186-classroom-lab-support-app-requirements\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 35 actual assertions, including 14 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\186-classroom-lab-support-app-requirements\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: warm sage dashboard, original book illustration, legible reassurance and clear reporting actions. Single-column mobile dashboard retains readable storage and safety boundaries. Real lifecycle checks cover independent cases, escalation, saved activity, handoff, resolution, reload and storage rejection.
- Mocks and limits: Static local-browser proof of concept. No Gemini, AI service, account, technician updates or physical diagnosis. Authored checks are observation-only and defer to school safety rules. Records are device-local and not backed up; no public repository, demo video or deployment is created.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\classroom-lab-support-app-requirements\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
