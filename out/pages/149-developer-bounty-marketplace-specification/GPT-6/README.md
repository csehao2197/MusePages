# Stellar Forge Bounty Marketplace

- Original: `data\prompts\149-developer-bounty-marketplace-specification\149-developer-bounty-marketplace-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Marketplace frontend with searchable XLM/USDC bounties, filters, detailed acceptance criteria and lifecycle, demo wallet identity, claim/PR-submission/review simulation, draft creation and scoped advisory template.
- Source: `out\pages\149-developer-bounty-marketplace-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\149-developer-bounty-marketplace-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: structured navy developer workspace, clear reward typography and lifecycle guide. Refined mobile search/facets into full-width rows so labels remain readable. Demo and financial-source-of-truth disclosures are prominent; no fake wallet address or transaction proof is displayed.
- Mocks and limits: Static frontend instead of Next.js/API/Soroban backend. Every balance, escrow status and transaction is fictional; no wallet extension/signature/keys/network calls, no GitHub verification or real AI. Release is only a local state demonstration, never a financial action.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\developer-bounty-marketplace-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
