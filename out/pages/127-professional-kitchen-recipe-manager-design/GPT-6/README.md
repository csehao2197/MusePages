# Mise Kitchen Recipe Manager

- Original: `data\prompts\127-professional-kitchen-recipe-manager-design\127-professional-kitchen-recipe-manager-design.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Kitchen-first high-contrast recipe dashboard, searchable library, portion scaling, station checklist kitchen view and local recipe wizard.
- Source: `out\pages\127-professional-kitchen-recipe-manager-design\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 26 actual assertions, including 5 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\127-professional-kitchen-recipe-manager-design\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: oversized black typography, generous kitchen touch targets, station filters and consistent dish artwork. Sidebar becomes horizontally scrollable mobile navigation; recipe cards stack without viewport overflow.
- Mocks and limits: Static frontend interpretation of architecture input; no Next.js server actions, Ionic runtime, database or tenant isolation. New recipes remain in memory; no production or load testing.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\professional-kitchen-recipe-manager-design\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
