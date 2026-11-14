# Common Ground — About the Studio

- Main features: Agency story, studio timeline, values, original office illustration and illustrated team profiles with member details and a local enquiry preview.

- Original: `data\prompts\102-agency-about-page\102-agency-about-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Warm terracotta and oat editorial studio story; wide original office illustration, personable illustrated team, narrative timeline and open typographic values.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\102-agency-about-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Actual preview and desktop/mobile full-page screenshots reviewed: warm editorial hierarchy, crisp original studio/team illustrations, coherent dark values band, readable two-column mobile team, clean contact form.
- Registered only, disabled and not deployed. Expected publication: `pages\agency-about-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Studio history, team biographies and workplace imagery are fictional/original illustrations rather than a real agency's credentials or staff photography. The enquiry preview sends no message.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
