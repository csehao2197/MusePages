# Forge & Co.

- Input: `data\prompts\031-agency-portfolio\031-agency-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md` (root `DESIGN.md` is absent).
- Actual selected generation model: **gpt-6.1-sol**; directory alias: `GPT-6`. Type: independent HTML/CSS/JavaScript.
- Source: this directory. Static export: `out\`; future public URL: `pages/agency-portfolio/GPT-6/index.html`.
- Features: 24 category-filtered projects, grid/list views, full local case previews, service/process/journal/careers details, animated counters, pausable client marquee, mobile menu, validated in-memory inquiry preview.
- Assets: 25 original SVG compositions, local Lucide icons (ISC), Space Grotesk and Inter from Google Fonts (OFL). Licenses are in `assets\`. Font downloads occur during authoring only; the page makes no external runtime requests.
- Validation: `node --check out\pages\031-agency-portfolio\GPT-6\app.js` passed; `node --test out\pages\031-agency-portfolio\GPT-6\page.test.mjs` passed 7/7 (parent + 6 acceptance groups). Tested 1440/1024/768/390/320 widths, all filters and case studies, keyboard/touch, safe form states, reduced motion, counters, assets, and local-only requests.
- Visually inspected actual full-page desktop/mobile captures, their viewport captures, and the 1200×900 `out\preview.png`. Reduced desktop hero spacing to reveal the work sooner; fixed malformed SVG typography and modal reverse-tab wrapping after initial real test failures. Exact evidence is in `.checks\visual-review.txt` and `.checks\validation.json`.
- Local previews use the repository's random-port static preview server, not a framework runtime. No environment variables, build, installation, or backend.
- All agency/client identities, work, metrics, ratings, awards and editorial content are fictional. Artwork depicts products rather than functional third-party sites/apps. The form only previews text in the current tab and clears when closed; no sending, storage, downloads, real hiring or verified social profiles.
- Service route concepts are adapted to accessible local dialogs for this single static homepage. Generated/validated/registered stages remain distinct from collection assembly, publication, and upload; the new publishing option stays disabled.
