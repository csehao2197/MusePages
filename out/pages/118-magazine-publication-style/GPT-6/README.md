# Current — A Magazine for the Here and Next

- Main features: Broadsheet technology grid, culture list and opinion profiles with original city artwork, story/section/author dialogs, search/topics and topic-selectable newsletter invitations.

- Original: `data\prompts\118-magazine-publication-style\118-magazine-publication-style.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Dense yet ordered broadsheet in vermilion and warm white, monumental serif masthead, original urban cover illustration and varied technology, culture and opinion layouts.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\118-magazine-publication-style\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots. Refined the mobile masthead to keep CURRENT fully visible and made cover art fill its frame, then recaptured. Final varied technology grid, culture list, writer-led opinions and vermilion subscription panel are coherent and legible. Article, section and author views are local homepage dialogs; membership is a no-payment preview.
- Registered only, disabled and not deployed. Expected publication: `pages\magazine-publication-style\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Stories, contributors and publication details are fictional samples rather than a live news feed. Search is limited to bundled content; newsletter, sponsor and membership controls are local explanations without email delivery, ad integration, payment or subscription creation.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
