# Good Things Shopping Cart

- Original: `data\prompts\132-shopping-cart-page\132-shopping-cart-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Editable cart quantities and options, saved-for-later and wishlist actions, coupon calculations, transparent shipping/tax, cross-sell add, empty state and local checkout summary.
- Source: `out\pages\132-shopping-cart-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\132-shopping-cart-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: generous ruled cart rows, consistent product illustrations, olive summary with prominent checkout and clear itemized costs. Mobile stacks content with a visible fixed total/CTA; product and recommendation cards fit without clipping.
- Mocks and limits: Fictional homewares; cart state is in-memory, taxes are a flat sample estimate, SAMPLE10 is a demo coupon, payment wallets and checkout do not transact.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\shopping-cart-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
