# TechFlow — A Clearer Path to Checkout

- Original: `data\prompts\185-case-study-template\185-case-study-template.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Story-driven ecommerce redesign case study, before/after checkout comparison, desktop/mobile prototype view, five-phase process inspector, illustrative results chart and local project inquiry.
- Source: `out\pages\185-case-study-template\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\185-case-study-template\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed real desktop, mobile and official preview: mint checkout mockup, bold narrative headline and numbered editorial chapters make the process clear. Illustrative outcomes are explicitly labeled. Expanded mobile enquiry field wrapping and reran verification.
- Mocks and limits: TechFlow, research, client quote and metrics are fictional teaching examples, not measured outcomes or real client work. Prototype contains sample order UI; no transaction, user study, launch or contact transmission occurs.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\case-study-template\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
