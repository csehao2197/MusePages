# Parcel Order Tracking

- Original: `data\prompts\126-order-tracking-page\126-order-tracking-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Order and email lookup, two shipment selector, detailed tracking history, delivery preferences, notification toggles and support FAQ.
- Source: `out\pages\126-order-tracking-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\126-order-tracking-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed all three screenshots: blue current-state banner and vertical tracking markers form a clear hierarchy, delivery details align on desktop, and mobile panels stack with readable dates and unclipped actions.
- Mocks and limits: Public sample order PAR-2048 with guest@example.com. Tracking and preferences are local illustrations, no real-time carrier, notifications or support transmission.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\order-tracking-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
