# Side Notes — A Journal by Jamie

- Main features: Illustrated personal journal with persistent light/dark theme, category browsing, full-text archive search, article-preview readers, most-read sidebar and local contact/newsletter forms.

- Original: `data\prompts\120-personal-blog-homepage\120-personal-blog-homepage.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Airy teal personal journal with a friendly illustrated author introduction, original landscape sketch thumbnails, a quiet reading sidebar and persistent light/dark theme.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 7 interaction assertions, 30 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\120-personal-blog-homepage\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots: airy teal journal introduction, tilted original author portrait, readable illustrated post grid and compact most-read sidebar. Mobile cards and topic pills stack cleanly. Browser tests confirmed dark-theme persistence after reload and local-only search, contact and signup behaviour.
- Registered only, disabled and not deployed. Expected publication: `pages\personal-blog-homepage\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Jamie and the journal entries are fictional; landscape/notebook images are original illustrations. Search covers bundled previews rather than a CMS. Theme preference stays in the browser, and contact/newsletter forms neither deliver messages nor create subscriptions.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
