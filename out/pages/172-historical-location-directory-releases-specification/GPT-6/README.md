# Historic Atlas — A release you can name

- Original: `data\prompts\172-historical-location-directory-releases-specification\172-historical-location-directory-releases-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: High-contrast release field guide with annotated-tag lifecycle, numeric semantic-version preflight and clean/main/sync/work-item gates, signing/push command preview, module/event image-publishing simulator and protected-image cleanup decision lab.
- Source: `out\pages\172-historical-location-directory-releases-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\172-historical-location-directory-releases-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Dark olive hero and oversized annotated-tag specimen provide a distinct release identity; pale policy panels balance the long guide. Preflight checkboxes, wrapped command previews and retention controls remain readable on mobile and across all five tested widths.
- Mocks and limits: Local policy/command specimens only. No git tag, push, build, registry access, deletion, webhook or deployment occurs. Sample latest version/commit/image age are illustrative; notification and automatic stage deployment remain external or undecided as specified.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-releases-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
