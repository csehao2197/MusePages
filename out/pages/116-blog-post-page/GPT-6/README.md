# Fieldwork — Designing a Calmer Web

- Main features: Longform article with reading-aware sticky contents, code/table/gallery/callout formatting, opt-in motion study, like/bookmark/copy tools, related/author readers, local threaded comments/replies and newsletter preview.

- Original: `data\prompts\116-blog-post-page\116-blog-post-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Typography-first independent journal with amber highlights, large original window illustration, restrained sticky contents rail and interactive reading tools.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 7 interaction assertions, 30 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\116-blog-post-page\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots: centered serif headline and original studio illustration establish a calm reading experience; narrow article measure, code, table, pull quote and local conversation are readable. Mobile contents links, gallery and related reading stack correctly.
- Registered only, disabled and not deployed. Expected publication: `pages\blog-post-page\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Article/author content and related previews are fictional editorial samples. Comments, replies and reading controls are local frontend demonstrations, not shared publishing or account services; newsletter and share explanations do not deliver email or post to social accounts.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
