# Historic Atlas — Your corner of the atlas

- Original: `data\prompts\174-historical-location-directory-users-specification\174-historical-location-directory-users-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Personal-settings concept with read-only fictional identity, strict merge-only appearance preferences and CSRF-policy simulator, real local PNG/JPEG signature/size/dimension checks and centered 256px PNG avatar processing/download/removal, plus explicit Gravatar-policy preview without network.
- Source: `out\pages\174-historical-location-directory-users-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\174-historical-location-directory-users-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Warm personal-settings composition uses a gold monogram and berry accents, with clear read-only identity provenance. Appearance cards, upload controls and status messages are legible in the stacked mobile view. Actual PNG processing/download and theme behavior passed focused tests after correcting an asynchronous test wait.
- Mocks and limits: No real login, identity record, authorization or persistence. Profile is fictional, avatar processing runs locally in the browser rather than a secure backend. Never contacts Gravatar; policy dialog explains one-time backend copy. Account-deletion cleanup and full identity lifecycle are documented, not implemented.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-users-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
