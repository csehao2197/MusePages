# Folio — Room for your next chapter

- Original: `data\prompts\171-pricing-landing-page\171-pricing-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Warm lilac and orange three-tier pricing page with monthly/annual billing math, adjustable seat calculator, categorized responsive comparison matrix, clear sample refund/trial terms, plan-selection and sales dialogs, local confirmation and FAQ.
- Source: `out\pages\171-pricing-landing-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\171-pricing-landing-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview PNGs. Restrained lilac Studio emphasis and orange recommendation badge clearly distinguish the middle tier without fake popularity. Calculator and billing disclosures align well; mobile feature rows repeat plan labels instead of forcing horizontal scrolling. All controls remain legible.
- Mocks and limits: Fictional client-work product; no subscriptions, charges, accounts, messages or actual trials. Guarantee, enterprise features and illustrative customer voice are sample offer terms, not verified claims or certification. All local form details reset when closed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\pricing-landing-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
