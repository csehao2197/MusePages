# TaskFlow Connect

Original: `data\prompts\219-saas-integrations-marketplace\219-saas-integrations-marketplace.md`; follows `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`, display `GPT-6`. Standalone HTML source is here; export `out`; public path `pages/saas-integrations-marketplace/GPT-6/index.html`.

Deep-teal marketplace, original CSS connection artwork, sixteen curated apps including all eight requested samples, three featured connections, combined category/price/maintainer/search filters, live counts, sorting, detailed setup/requirements/review dialogs, local install/disconnect states and integration requests.

Run `node out\pages\219-saas-integrations-marketplace\GPT-6\verify.mjs` at repository root using existing Playwright Chromium. QA screenshots/results live in `.checks`; current browser preview in `out\preview.png`. Serve `out` using any static HTTP server.

App identities are text marks, not downloaded brand artwork. Catalog counts reflect sixteen implemented previews rather than the inconsistent sample category totals. Ratings, installs, reviews, provider features, API and plans are illustrative. “Installed” persists a demo flag in localStorage only; no OAuth, real account access or sent requests. No environment variables/backend. Builds, installs, dist and publication were not performed.
