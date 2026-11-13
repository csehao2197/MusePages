# Alex Rivera Personal Training

- Original: `data\prompts\151-personal-trainer-portfolio\151-personal-trainer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Charcoal/coral coaching portfolio with original trainer illustration, philosophy and concept credentials, service/program detail dialogs, client-story carousel, local seven-day plan download and validated consultation-slot selection.
- Source: `out\pages\151-personal-trainer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\151-personal-trainer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: personal charcoal/coral identity, large original coach illustration, readable service/program hierarchy and strong consultation CTA. Narrow-width heading and philosophy-card sizing were corrected after overflow detection. Mobile sticky contact remains accessible; illustrative credentials and client stories are disclosed.
- Mocks and limits: Alex is a fictional coach; certifications, experience, client stories and prices are sample portfolio content. Illustrations replace unlicensed trainer/client photos and videos. No real health outcomes, calendar/email integration, social accounts, booking or medical/nutrition advice.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\personal-trainer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
