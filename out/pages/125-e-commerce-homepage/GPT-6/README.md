# Sunday Supply Store

- Original: `data\prompts\125-e-commerce-homepage\125-e-commerce-homepage.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Dismissible announcement, category menu and filtering, search, product wishlist and cart preview, new arrivals, reviews and local newsletter confirmation.
- Source: `out\pages\125-e-commerce-homepage\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\125-e-commerce-homepage\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: large illustrated merchandising scene, consistent earthy product tiles and two-column mobile catalog. Corrected bowl/vessel artwork and promotional button contrast; final rendered hierarchy and spacing are clean.
- Mocks and limits: Illustrated fictional catalog, local cart and email confirmation only; no checkout, account service, live reviews or subscription delivery.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\e-commerce-homepage\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
