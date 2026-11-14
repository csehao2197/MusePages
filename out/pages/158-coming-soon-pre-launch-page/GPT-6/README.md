# Fieldwork — Good ideas need somewhere to grow

- Original: `data\prompts\158-coming-soon-pre-launch-page\158-coming-soon-pre-launch-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Live concept-launch countdown, layered workspace teaser reveal, local email waitlist with success and reset, launch timeline and accessible FAQ disclosures.
- Source: `out\pages\158-coming-soon-pre-launch-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 26 actual assertions, including 5 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\158-coming-soon-pre-launch-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Viewed actual desktop, mobile and preview PNGs. Warm editorial typography, rust CTA and intentionally blurred teaser establish anticipation. Countdown and form remain legible; stacked mobile preserves spacing and the reveal button.
- Mocks and limits: Fictional launch date and illustrative development milestones. Waitlist is a session-only demo: no email delivery, subscriber database, endorsements or actual early-access entitlements.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\coming-soon-pre-launch-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
