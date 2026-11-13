# Historic Atlas — The anatomy of a place

- Original: `data\prompts\169-historical-location-directory-locations-specification\169-historical-location-directory-locations-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Archival specimen homepage with an original contour illustration, independent location/text confidence controls, language fallback inspector, actual sample JSON export, strict tag-key normalizer and legacy coordinate normalization/swapping lab with SRID and range checks.
- Source: `out\pages\169-historical-location-directory-locations-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\169-historical-location-directory-locations-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Archival olive/ivory palette, original contour study and specimen/inspector split make the data model tangible. Two independent confidence scales and fallback controls stay legible on narrow layouts; no clipping or resource errors observed.
- Mocks and limits: Fictional specimen data and local rule demonstrations, not backend storage or a real legacy import. Locale-keyed sample content remains English for this collection. No real audit subjects, identity service, API calls or database transaction. Full importer behavior is explained rather than executed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-locations-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
