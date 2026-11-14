# AVARC — Legacy Import Fieldbook

- Original: `data\prompts\181-historical-location-directory-legacy-data-model\181-historical-location-directory-legacy-data-model.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Grouped legacy relationship map, import-scope selector, documented findings, language-code mapping and local decimal coordinate inspection.
- Source: `out\pages\181-historical-location-directory-legacy-data-model\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\181-historical-location-directory-legacy-data-model\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and official preview: restrained archival typography, tan relationship chips and amber import caveat make source confidence explicit. Group navigation wraps neatly on mobile and local syntax exercises remain readable.
- Mocks and limits: Stage counts and relationship confidence are quoted from the requirement, not queried or rescanned. No Access export, personal data or credentials are loaded. Coordinate tool checks syntax/ranges only and performs no import.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-legacy-data-model\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
