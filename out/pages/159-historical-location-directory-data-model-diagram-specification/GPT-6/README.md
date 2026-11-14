# Historic Atlas — Physical model notebook

- Original: `data\prompts\159-historical-location-directory-data-model-diagram-specification\159-historical-location-directory-data-model-diagram-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Interactive illustrative physical-table diagram, column annotations for generated and unmapped fields, table inspection, schema-scope switch and downloadable Mermaid text.
- Source: `out\pages\159-historical-location-directory-data-model-diagram-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\159-historical-location-directory-data-model-diagram-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Blueprint table geometry, keys and annotations are readable; sample-schema warning is prominent. Mobile stacks the relationship diagram and inspector; Mermaid text wraps within its panel.
- Mocks and limits: The source specifies diagram governance but supplies no migrations or physical schema. Clearly labeled sample avarc tables illustrate the format, not the actual database. No database or Mermaid runtime is used.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-data-model-diagram-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
