# Margin Notes — The discovery fieldbook

- Original: `data\prompts\162-content-upgrade-page\162-content-upgrade-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Original six-section discovery workbook with a question bank and synthesis template; interactive chapter preview, validated email gate and actual locally generated text download.
- Source: `out\pages\162-content-upgrade-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\162-content-upgrade-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Viewed actual desktop, mobile and preview PNGs. Burgundy book artwork is prominent; chapter index and paper-like excerpt create a clear content hierarchy. Mobile retains readable preview and full-width email CTA. Download contents also checked for final chapter and synthesis grid.
- Mocks and limits: Editorial concept, not a credentialed research consultancy. No invented download counts or testimonials. Email stays local; downloadable TXT is a concise workbook rather than a claimed long PDF.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\content-upgrade-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
