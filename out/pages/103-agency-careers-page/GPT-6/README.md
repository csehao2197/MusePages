# Otherkind — Make Your Next Move

- Main features: Agency careers overview with culture artwork, filterable open-role rows, job-detail dialogs and an application-form preview.

- Original: `data\prompts\103-agency-careers-page\103-agency-careers-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Bold acid-yellow and ink recruitment broadsheet with open job rows, filter controls, original culture art and focused application dialog.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 5 interaction assertions, 28 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\103-agency-careers-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed real preview and full desktop/mobile screenshots: strong acid-yellow recruitment masthead, legible open job rows and mobile filter stack, coherent dark culture section, application form fits cleanly.
- Registered only, disabled and not deployed. Expected publication: `pages\agency-careers-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Roles and employment information are fictional examples, not current vacancies. Application validation is frontend-only; no application, attachment or personal information is delivered to a recruiter or hiring system.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
