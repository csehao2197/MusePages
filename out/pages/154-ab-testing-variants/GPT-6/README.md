# Focuslane Experiment Studio

- Original: `data\prompts\154-ab-testing-variants\154-ab-testing-variants.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Five same-URL query variants with browser-local random assignment, isolated headline/CTA/layout tests and provisional combined version; single-factor sandbox across twelve test dimensions; responsive product preview, validated local trial form, first-party local event metrics, click map and JSON export with eligibility guidance.
- Source: `out\pages\154-ab-testing-variants\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 31 actual assertions, including 10 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\154-ab-testing-variants\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and 1200x900 preview: dark experiment chrome frames a warm product canvas with original workspace illustration, orange CTA and distinct variant controls. Combined candidate is honestly labeled. Mobile stacks the landing content, keeps all five switches accessible and contains the wide metrics table; fixed metric-card min-content overflow at 320px.
- Mocks and limits: No remote analytics, real trial, historical winner or proven benchmark. Local browser samples are not statistically representative; combined version is hypothetical, not a confirmed winner. No form values are persisted. Urgency and proof examples are labeled illustrative. Query variants remain distinct from custom sandbox metrics.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\ab-testing-variants\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
