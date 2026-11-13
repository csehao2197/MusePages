# The Good Edit — A Better Tuesday

- Main features: Newsletter introduction with folded-paper issue preview, three complete sample letters in archive readers, two signup previews, illustrated reader portraits, privacy dialog and FAQs.

- Original: `data\prompts\119-newsletter-landing-page\119-newsletter-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Single-focus apricot and midnight newsletter landing page with an oversized headline, folded-paper issue preview and friendly illustrated reader portraits.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\119-newsletter-landing-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots: strong single-focus signup hierarchy, apricot folded-paper sample letter and warm illustrated portraits. Archive rows, compact privacy text, FAQs and repeated signup are readable and well-spaced at mobile size. All forms clearly remain local previews.
- Registered only, disabled and not deployed. Expected publication: `pages\newsletter-landing-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Publication, readership and sample letters are fictional. Signup validates a local preview only; it does not create a subscription, record consent with a provider or send a confirmation/welcome email.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
