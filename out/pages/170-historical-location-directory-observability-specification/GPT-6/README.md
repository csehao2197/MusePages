# Historic Atlas — Observe without depending

- Original: `data\prompts\170-historical-location-directory-observability-specification\170-historical-location-directory-observability-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Light editorial monitoring field guide with independent application/monitoring lanes, local monitoring and database failure toggles, synthetic history-gap visualization, per-service signal explorer and request-correlated JSON/audit specimens.
- Source: `out\pages\170-historical-location-directory-observability-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\170-historical-location-directory-observability-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Airy ink/green layout separates application and observer lanes; magenta serif accent emphasizes dependency boundaries. Synthetic chart and failure toggles are readable, with stacked signal specimens and wrapped JSON on mobile. No clipping in responsive checks.
- Mocks and limits: All scenarios, logs, health outputs and chart samples are synthetic browser-only examples. No actual metrics, production health, scans, traces, browser telemetry, alerting or monitoring deployment. Retention and storage remain open decisions as specified.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-observability-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
