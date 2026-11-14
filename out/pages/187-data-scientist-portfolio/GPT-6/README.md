# Alex Chen — Synthetic Data Lab

- Original: `data\prompts\187-data-scientist-portfolio\187-data-scientist-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Portfolio demonstration with two detailed synthetic cases, switchable chart and matching accessible table, calculated holdout MAE, downloadable synthetic CSV and reproducible Python notebook, responsive navigation and local contact draft.
- Source: `out\pages\187-data-scientist-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 31 actual assertions, including 10 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\187-data-scientist-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: restrained blue notebook aesthetic, original charts, honest identity disclosure and aligned evidence hierarchy. Mobile retains complete scrollable table and stacked analytical notes. Calculated MAE and exported evidence are tested, without claiming production research.
- Mocks and limits: Illustrative identity and projects, no supplied credentials or clients. Small deterministic synthetic dataset, not operational evidence. Holdout metrics calculated locally, notebook supplied but not executed here. Contact draft is not sent.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\data-scientist-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
