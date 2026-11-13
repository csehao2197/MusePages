# Relay vs Stackwork — Less work about work

- Original: `data\prompts\160-comparison-landing-page\160-comparison-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Category-filtered feature comparison, seat-based annual cost calculation, monthly or annual billing toggle, migration plan dialog and candid comparison FAQs.
- Source: `out\pages\160-comparison-landing-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\160-comparison-landing-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed all actual PNGs. Purple comparison emphasis is clear without obscuring competitor strengths; generous centered headline and structured rows work on desktop. Mobile table wraps within the viewport, calculator and migration CTA remain readable.
- Mocks and limits: Both products, prices and comparison facts are fictional examples. No third-party ratings or real customer claims; trial and migration actions generate a local plan only, without account creation or data transfer.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\comparison-landing-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
