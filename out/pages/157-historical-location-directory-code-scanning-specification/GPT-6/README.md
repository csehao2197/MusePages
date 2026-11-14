# Historic Atlas — Code analysis guide

- Original: `data\prompts\157-historical-location-directory-code-scanning-specification\157-historical-location-directory-code-scanning-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Interactive event and file routing simulator for four source languages, branch allow-list, Markdown skip and scheduled analysis; separate ShellCheck, actionlint and Java-format reference.
- Source: `out\pages\157-historical-location-directory-code-scanning-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\157-historical-location-directory-code-scanning-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Navy/lime technical hierarchy, legible routing matrix and explicit local-only notice are consistent; narrow layout stacks inputs above results without clipping.
- Mocks and limits: Local specification explorer only. No repository is scanned; illustrative file presets, no real findings, security verdicts or GitHub Actions execution.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-code-scanning-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
