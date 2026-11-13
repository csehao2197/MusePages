# Sam Rivera — Developer & Systems Thinker

- Original: `data\prompts\188-developer-portfolio\188-developer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Responsive dark developer portfolio, pausable role animation, categorized skill icons, three dedicated case-study HTML pages with useful local demos, synthetic contribution map, sample resume download, contact draft and mobile navigation.
- Source: `out\pages\188-developer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 40 actual assertions, including 19 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\188-developer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: charcoal and lime terminal composition with clear project hierarchy and well-spaced skill labels. Synthetic contribution art and unavailable profiles remain explicitly disclosed. Three dedicated demos work and all case routes pass narrow/tablet/desktop overflow checks.
- Mocks and limits: Illustrative identity and experience template, not actual employment or credentials. Repository and personal social URLs were not supplied and are disclosed unavailable. Contribution graph is synthetic; demos run locally without APIs or production metrics. HTML export rather than a framework build.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\developer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.

## Implementation notes

Project cards and skill groups share data-driven markup. The three adjacent *-case.html files are standalone static routes with embedded local demos; export includes them and app.js. The layout switches at 850px. Original CSS UI artwork needs no remote image pipeline. Titles/descriptions are page-specific; add verified identity/social URLs before production use. React/Next.js, real employment, repository integration and a production contact backend are outside this static demo. Public deployment would use the documented collection workflow; no deployment was performed.
