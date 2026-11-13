# AVARC Work Ledger

- Original: `data\prompts\176-historical-location-directory-work-tracking-specification\176-historical-location-directory-work-tracking-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Filter repository work items, inspect YAML front matter, resolve dependencies, and simulate status transitions with finished-directory mapping.
- Source: `out\pages\176-historical-location-directory-work-tracking-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 26 actual assertions, including 5 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\176-historical-location-directory-work-tracking-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and 1200x900 preview: clear sage ledger hierarchy, legible YAML inspector and stacked mobile controls. Refined overlapping mobile footer into separate lines and reran checks.
- Mocks and limits: All tasks are illustrative local fixtures. Changes reset on reload; no repository files, commits, CI checks or real index are changed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-work-tracking-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
