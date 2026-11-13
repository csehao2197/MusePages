# Sunday Table — Good Food, Every Day

- Main features: Course/cuisine/time filtering, quick/seasonal/popular recipes, recipe dialogs with serving scaling and metric/US units, ingredient checks, substitutions/nutrition, bookmarks, printable cards and local photo-review preview.

- Original: `data\prompts\121-recipe-blog\121-recipe-blog.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Appetising olive and butter-yellow recipe journal, detailed original overhead food illustrations, seasonal browsing and a practical interactive recipe drawer with serving scaling and checked ingredients.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 11 interaction assertions, 34 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\121-recipe-blog\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed actual preview and full desktop/mobile screenshots. Corrected a tomato SVG XML escape and verified every image decodes; fixed printable dialog isolation with actual print-media assertions, then recaptured. Final olive food journal, overhead dish illustrations, practical filters, seasonal feature and mobile two-column recipes are readable. Original illustrations substitute for food photography; recipes are untested samples and nutrition is estimated.
- Registered only, disabled and not deployed. Expected publication: `pages\recipe-blog\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: Recipes are original sample drafts, not kitchen-tested; nutrition and unit conversions are illustrative estimates. Four local SVG dish illustrations replace food photography. Reviews/photos remain local previews rather than published submissions or uploaded media.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
