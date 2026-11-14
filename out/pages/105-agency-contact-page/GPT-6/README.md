# Hello Studio — Start a Conversation

- Main features: Split-screen studio contact desk with a structured project enquiry, office tabs and local appointment-selection preview.

- Original: `data\prompts\105-agency-contact-page\105-agency-contact-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Welcoming lavender and aubergine split-screen contact desk, comprehensive low-friction inquiry form, office tabs and local appointment preview.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 7 interaction assertions, 30 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\105-agency-contact-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed real preview and full desktop/mobile screenshots: inviting split lavender layout, clear complete field labels, usable service checkboxes, restrained office map and readable booking/FAQ sections. Corrected an ambiguous test selector and reran successfully.
- Registered only, disabled and not deployed. Expected publication: `pages\agency-contact-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Studio offices/contact details are fictional. Enquiry feedback and appointment choices are local previews: no email, calendar event, available-slot reservation or support request is created.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
