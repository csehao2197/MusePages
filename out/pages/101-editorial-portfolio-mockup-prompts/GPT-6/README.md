# Alex Morgan — Frontend Engineer

- Main features: Editorial frontend-engineer portfolio with project filtering, expandable project studies, career timeline, readable local résumé sample and contact-form preview.

- Original: `data\prompts\101-editorial-portfolio-mockup-prompts\101-editorial-portfolio-mockup-prompts.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Asymmetric cream editorial composition, navy and sage geometric hero, serif typography, integrated timeline, expandable project studies and a readable resume.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 9 interaction assertions, 32 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\101-editorial-portfolio-mockup-prompts\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Inspected actual preview plus full desktop/mobile PNGs: balanced navy/sage hero, readable timeline and resume, clear project hierarchy. Initial 320px overflow corrected and all checks rerun.
- Registered only, disabled and not deployed. Expected publication: `pages\editorial-portfolio-mockup-prompts\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: The engineer, career history, projects and résumé are fictional samples. Project studies are local previews rather than live client repositories; the contact form does not deliver messages.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
