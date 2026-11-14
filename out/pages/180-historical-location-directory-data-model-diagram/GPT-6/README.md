# AVARC Schema Studio

- Original: `data\prompts\180-historical-location-directory-data-model-diagram\180-historical-location-directory-data-model-diagram.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Seven-table schema dictionary through migration V4, column search, entity selection, relationship inspector, computed-column emphasis and explicit Keycloak subject caveat.
- Source: `out\pages\180-historical-location-directory-data-model-diagram\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\180-historical-location-directory-data-model-diagram\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed real desktop, mobile and official preview: crisp blue entity dictionary with clear key types, pale computed-column emphasis and dark relationship inspector. Corrected checkbox spacing after review; revalidated and checked the final preview.
- Mocks and limits: Read-only documentation based on the provided schema text. No database connection, SQL execution, migration verification or production records; relationship information is local reference data.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-data-model-diagram\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
