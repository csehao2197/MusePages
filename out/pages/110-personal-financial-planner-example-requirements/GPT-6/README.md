# Nest — Your Money, in Perspective

- Main features: Personal-finance overview with local budget editing, transaction filters and a transparent savings-projection calculator.

- Original: `data\prompts\110-personal-financial-planner-example-requirements\110-personal-financial-planner-example-requirements.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; stable directory alias: `GPT-6`. Type: standalone HTML/CSS/JavaScript.
- Direction: Source is an unfilled generic PRD scaffold. Filename-based scope assumption: a calm sage personal-finance overview with local budget editing, transaction filters and a transparent savings projection.
- Source: `index.html` and any adjacent public assets. Static export: `out\`.
- Generation-run validation: 6 interaction assertions, 29 total assertions passed. Responsive widths: 1440, 1024, 768, 390, 320px. Browser/resource errors: none. This generation run executed the exported `verify` function from `verify.mjs` through a temporary orchestration harness; the file itself is not a standalone test runner.
- Preview from repository root: `node src\workflows\generate-preview.mjs out\pages\110-personal-financial-planner-example-requirements\GPT-6\out`. It renders/checks the preview; it does not update metadata or replay interaction assertions. Browse `out\` with a static HTTP server; no build or environment variables are required.
- Actual PNG preview: 1200 by 900. Desktop/mobile screenshots and results: `.checks\`. Visual review: Reviewed real preview and full desktop/mobile screenshots: calm sage dashboard, clearly labelled sample chart and financial values, legible mobile transactions and goal controls. Generic scaffold input assumption is disclosed on-page and in design intent.
- Registered only, disabled and not deployed. Expected publication: `pages\personal-financial-planner-example-requirements\GPT-6\index.html`.
- Assets: original HTML/CSS/SVG illustrations; Lucide-style SVG icons use Lucide (ISC) path geometry. No external images, fonts or runtime requests. System serif/sans-serif fonts replace remote font families for offline portability.
- Significant limitations: The original is an unfilled generic PRD; the finance direction is an explicit filename-based assumption. Balances, budgets and transactions are mock data without bank connections. Projections are illustrative calculations, not financial advice or guaranteed returns.
- Not performed: builds, dependency installation, dist, publication, remote upload and backend testing.
