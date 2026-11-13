# Form & Function — Services

- Main features: Service directory with typographic service chapters, package comparison and an interactive scoped project-enquiry dialog.

- Original: `data\prompts\108-agency-services-page\108-agency-services-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Swiss-inspired cobalt and white service directory with oversized typography, numbered service chapters, transparent packages and scoped inquiry dialog.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\108-agency-services-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Actual preview and full desktop/mobile screenshots reviewed: crisp cobalt Swiss hierarchy, scannable service index and detailed chapters, consistent aligned packages, readable mobile content and clear inquiry actions.
- Registered only, disabled and not deployed. Expected publication: `pages\agency-services-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: The agency, service packages and commercial information are sample content, not binding offers or availability. Project enquiries remain frontend demonstrations without delivery, contracting or payment.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
