# Folio Studio — Rewild Case Study

- Main features: Outdoor-brand case study with original mountain artwork, project narrative, outcome sections, an interactive before/after interface and local enquiry preview.

- Original: `data\prompts\104-agency-case-study-page\104-agency-case-study-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Immersive forest-green visual case study with oversized outdoor wordmark, original mountain illustrations, outcome-led storytelling and interactive before/after interface.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 5 interaction assertions, 28 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\104-agency-case-study-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Inspected actual preview and full desktop/mobile screenshots: impactful forest masthead and original landscape, readable outcome strip, restrained storytelling and interface comparison, clean mobile stack and inquiry form.
- Registered only, disabled and not deployed. Expected publication: `pages\agency-case-study-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Rewild, its redesign and business outcomes are illustrative, not verified client results. The comparison is a local interface demonstration rather than a deployed commerce site; enquiries are not transmitted.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
