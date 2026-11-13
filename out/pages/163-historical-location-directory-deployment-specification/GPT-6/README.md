# Historic Atlas — Deployment field guide

- Original: `data\prompts\163-historical-location-directory-deployment-specification\163-historical-location-directory-deployment-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Interactive dev/stage/prod topology, port and optional database-tool routing, production install guards, service inspector and start/backup/restore/secrets runbook.
- Source: `out\pages\163-historical-location-directory-deployment-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\163-historical-location-directory-deployment-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. The warm grid topology and service inspector are readable and clearly documentary. Environment switches and production guards remain distinct; mobile wraps service nodes cleanly and runbook text stays inside its column.
- Mocks and limits: Documentation and deterministic local planning only. No shell command, Docker service, secret, deployment, backup, restore, health check or remote environment is accessed or executed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-deployment-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
