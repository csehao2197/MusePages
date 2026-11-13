# Historic Atlas — Dependency update policy

- Original: `data\prompts\161-historical-location-directory-dependency-updates-specification\161-historical-location-directory-dependency-updates-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Local dependency-intake simulator with update types, base-branch eligibility, grouped Node update example and major labeling; manager coverage and reviewer checklist.
- Source: `out\pages\161-historical-location-directory-dependency-updates-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\161-historical-location-directory-dependency-updates-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Viewed actual desktop, mobile and preview PNGs. Quiet green maintenance-notes aesthetic keeps the event form and PR specimen distinct. Monospace file references wrap, review controls remain spacious, and local-only framing is visible.
- Mocks and limits: No hosted app is configured and no dependency registry is queried. Versions and pull requests are illustrative; no real branch deletion, signing, vulnerability detection or merging occurs.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-dependency-updates-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
