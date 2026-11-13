# Odd Assembly — Good Different

- Main features: Experimental creative-agency homepage with original brand posters, a manually controlled project carousel, project-detail previews and local enquiry.

- Original: `data\prompts\109-creative-agency-homepage\109-creative-agency-homepage.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Electric orange and charcoal art-direction studio, oversized condensed type, asymmetric original brand posters and a manually controlled project reel.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\109-creative-agency-homepage\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed current preview and desktop/mobile full-page PNGs. Refined poster rings to avoid competing with titles, recaptured and rechecked. Bold orange typography, asymmetric project rhythm and mobile service sections are legible.
- Registered only, disabled and not deployed. Expected publication: `pages\creative-agency-homepage\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Agency clients, projects and claims are fictional concepts; the reel presents local artwork rather than real campaign films. Enquiries do not reach an agency or production backend.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
