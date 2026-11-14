# Sunday — A fresh home, without the weekend work

- Original: `data\prompts\168-ppc-ad-landing-page\168-ppc-ad-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Blue-and-mint home-cleaning offer page with original room illustration, single local request form, price/package disclosure, fictional sample-review carousel, fixed illustrative offer countdown, mobile sticky CTA and inspectable allowlisted UTM/A-B/event preview.
- Source: `out\pages\168-ppc-ad-landing-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\168-ppc-ad-landing-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview PNGs: calm navy/mint room illustration, legible offer and high-contrast request CTA. Mobile sticky action is visible at viewport bottom; long capture shows its fixed-position placement as expected. Package/form/FAQ stack cleanly with honest demo and tracking disclosures.
- Mocks and limits: Fictional service and offer; no appointment, payment, calls or email sent. Sample quotes have no real customer attribution. UTM values and events remain in memory; no analytics pixels, heatmaps or third-party tracking. No measured load-time guarantee.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\ppc-ad-landing-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
