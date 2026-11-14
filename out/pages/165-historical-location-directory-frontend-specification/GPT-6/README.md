# Historic Atlas — Explore places through time

- Original: `data\prompts\165-historical-location-directory-frontend-specification\165-historical-location-directory-frontend-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Stone-and-amber map/list homepage with search, period filters, marker details, local role controls, create/edit location form and keyboard-accessible mobile navigation.
- Source: `out\pages\165-historical-location-directory-frontend-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\165-historical-location-directory-frontend-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and 1200x900 preview PNGs: balanced serif heading and large original schematic landscape; list and detail align cleanly, mobile stacks with readable controls and no clipping. Warm neutral and amber styling matches source direction.
- Mocks and limits: Static frontend adaptation of a server-rendered Next.js specification. Original schematic map, not Leaflet or geographic tiles; fictional records. Role switch is not authentication. Edits live only in memory; no API, CSRF, translations service or server observability is claimed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-frontend-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
