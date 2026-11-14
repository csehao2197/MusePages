# Mara Vale — Considered Interiors

- Original: `data\prompts\190-interior-designer-portfolio\190-interior-designer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Original perspective room drawings, three detailed residential concept stories, interactive aligned floor-plan before/after comparison, material palette swatches, responsive navigation and local consultation brief.
- Source: `out\pages\190-interior-designer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\190-interior-designer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: quiet warm material palette, precise perspective illustrations and restrained serif typography. Mobile stacks project stories and keeps both plan comparison controls accessible. Original room art is clearly distinguished from completed photography; no real supplier or access certification is implied.
- Mocks and limits: Illustrative identity and self-initiated room concepts, not completed commissions. Original SVG drawings replace unsupplied photographs; no photographers, supplier approvals or accessibility certification claimed. Location/timelines await real input. Contact form is an unsent local draft.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\interior-designer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
