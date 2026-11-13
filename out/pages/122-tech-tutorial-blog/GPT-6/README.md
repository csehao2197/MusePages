# Build Notes — Learn by Making

- Main features: Search/technology/difficulty/type filters, three local-progress learning paths and six tutorial readers with prerequisites, steps, syntax/line numbers, source/diff/expand/copy tools, starter download, native date playground, quiz and reading-aware contents.

- Original: `data\prompts\122-tech-tutorial-blog\122-tech-tutorial-blog.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Precise developer learning journal with lime highlights, monospaced navigation, a dark live-code hero and a practical searchable tutorial library.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 13 interaction assertions, 36 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\122-tech-tutorial-blog\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots: lime emphasis and monospaced details balance the prominent dark code panel; learning paths, filters and tutorial rows stay clear on mobile. Browser checks exercised the real date playground, quiz, local completion, clipboard contents and served starter file. External repositories, Discord, remote sandboxes and issue submission are transparently unconnected.
- Registered only, disabled and not deployed. Expected publication: `pages\tech-tutorial-blog\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Learning progress is device-local and tutorials are bundled samples. The playground is a native date-formatting exercise, not a general remote code runner; repositories, community links and issue submission are explicit disconnected previews. Clipboard copy and starter download are real browser operations.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
