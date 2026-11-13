# Historical Atlas API Workbench

- Original: `data\prompts\155-historical-location-directory-backend-specification\155-historical-location-directory-backend-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Developer documentation workbench with in-memory location CRUD request simulator, role/CSRF gates, request ID validation, coordinate validation and generated-point preview; environment docs exposure examples, content-free local audit lines, module-boundary explorer and database/operations references.
- Source: `out\pages\155-historical-location-directory-backend-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 33 actual assertions, including 12 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\155-historical-location-directory-backend-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and 1200x900 preview: charcoal developer workspace with fixed desktop navigation, mint request action, readable JSON panes and clearly separated modules, persistence and operational policies. Mobile uses scrollable section navigation and stacked console/database panels without document overflow. Simulation and non-authoritative schema disclosures remain prominent.
- Mocks and limits: Static frontend presentation of a Java/Spring Boot specification, not a Java backend implementation. Example endpoint payloads are illustrative because the linked location contract was not supplied. No database, Keycloak, OpenAPI generation, container, Maven build, secrets or network calls. Data and audit examples are memory-only; real server validation is not claimed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-backend-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
