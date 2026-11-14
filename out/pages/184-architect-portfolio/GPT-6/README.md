# Stillform — Architecture Studio

- Original: `data\prompts\184-architect-portfolio\184-architect-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Wide original architectural illustration, typology filter, project case-study drawer with plan/elevation modes, studio/services/journal sections and local inquiry validation.
- Source: `out\pages\184-architect-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 26 actual assertions, including 5 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\184-architect-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and official preview. Architectural precision is carried by a large pavilion illustration, offset project rhythm and fine typographic rules. Added a translucent hero label for reliable contrast and mixed concept plans with exterior studies, then reran checks and inspected the final preview.
- Mocks and limits: Fictional practice; all projects are concept studies, not completed buildings or real client commissions. Imagery consists of original architectural SVG illustrations rather than photographs. No inquiries are transmitted, no map or social service is connected.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\architect-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
