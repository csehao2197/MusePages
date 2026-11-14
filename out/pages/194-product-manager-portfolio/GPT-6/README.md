# Avery Quinn — Product Decisions, Made Clear

- Original: `data\prompts\194-product-manager-portfolio\194-product-manager-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Editorial product decision journal with two detailed concept cases, progressive disclosure, opportunity-sizing arithmetic, editable sorted RICE worksheet, reversible local launch-decision exercise, synthetic cohort metric definitions and unsent enquiry.
- Source: `out\pages\194-product-manager-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\194-product-manager-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: restrained cream decision journal, rust italic headline, ruled project summaries and clearly separated margin notes. Fixed narrow-grid intrinsic overflow and reran all widths. Assumption sizing, RICE recalculation and invalid effort, reset, reversible launch exercise, disclosure and unsent contact were checked; synthetic evidence is labeled throughout.
- Mocks and limits: Illustrative identity and fictional briefs, not actual employment or launches. Sizing, priorities and cohort figures are labeled synthetic scenarios, not observed business outcomes or causal results. No client names, real research, credentials, roadmap commitments or external messages claimed.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\product-manager-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
