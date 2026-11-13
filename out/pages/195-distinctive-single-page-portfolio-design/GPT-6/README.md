# Morgan Byte — An Unusually Useful Engineer

- Original: `data\prompts\195-distinctive-single-page-portfolio-design\195-distinctive-single-page-portfolio-design.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Hard-bordered monochrome corporate-weirdcore digital dossier with original geometric portrait and six local project plates, inventory blocks, project-only image viewer with keyboard navigation, experience disclosure, EN/ID availability notice, local downloadable contact brief and randomized original footer quotes.
- Source: `out\pages\195-distinctive-single-page-portfolio-design\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 43 actual assertions, including 22 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\195-distinctive-single-page-portfolio-design\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile, official preview and two extra modal screenshots. Thick black window borders, hard offset shadows, massive serif hierarchy, raw monospace controls and original angular avatar follow the weirdcore brief without gradients or soft effects. Refined footer-button contrast and reran all checks. All six concept plates decode at full width; local viewer arrows/Escape, language availability notice, disclosures, randomized notes and text-download content were verified.
- Mocks and limits: Illustrative persona, original concept project plates, and education/experience placeholders; no clients, credentials or shipped commercial work supplied. English remains active because no Indonesian translation was supplied. Contact prepares a local text download only and sends no email. No real metrics, biography or remote backend.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\distinctive-single-page-portfolio-design\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
