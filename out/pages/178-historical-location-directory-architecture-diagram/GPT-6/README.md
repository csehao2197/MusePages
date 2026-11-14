# AVARC — System Atlas

- Original: `data\prompts\178-historical-location-directory-architecture-diagram\178-historical-location-directory-architecture-diagram.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Interactive component inspector, pages/API/login/monitoring flow selection, post-MVP visibility, and complete connection directory reflecting the specified topology.
- Source: `out\pages\178-historical-location-directory-architecture-diagram\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\178-historical-location-directory-architecture-diagram\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: navy technical canvas has legible labeled nodes, quiet dotted future layer, and a contrasting inspector. Mobile replaces the small diagram with readable component controls; SVG layer visibility was corrected and all checks rerun.
- Mocks and limits: Documentation-only static architecture explorer. No services are deployed, no monitoring data is live, and authentication paths are descriptions rather than implemented login.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-architecture-diagram\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
