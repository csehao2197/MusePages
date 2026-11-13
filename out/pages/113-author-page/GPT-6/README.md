# Marginalia — Eleanor Hayes

- Main features: Illustrated literary author profile, searchable topic-filtered chronological archive, load-more entries, sample-essay readers and local newsletter/sample-letter preview.

- Original: `data\prompts\113-author-page\113-author-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Literary cream and oxblood author profile, generous serif type, original portrait, quiet featured essays and a searchable chronological reading list.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\113-author-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots: warm literary hierarchy, substantial illustrated portrait, clear three-essay selection and readable chronological list; topic navigation and letter form stack cleanly on mobile.
- Registered only, disabled and not deployed. Expected publication: `pages\author-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: The author, biography and writing are fictional sample content with an original illustrated portrait. Archive search covers the bundled entries only; newsletter actions do not subscribe an address or deliver email.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
