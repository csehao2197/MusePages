# Goodword — Customer Stories

- Original: `data\prompts\177-testimonial-social-proof-page\177-testimonial-social-proof-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Industry, size and use-case filters; interview transcript dialogs; case studies; review form with local photo preview and rating; trial-interest acknowledgement.
- Source: `out\pages\177-testimonial-social-proof-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\177-testimonial-social-proof-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: lavender statement hero, balanced quote panel, scannable reviews and clean stacked mobile sections. Removed the empty photo element from initial rendering and reran all checks.
- Mocks and limits: All reviews, companies, ratings, stats and social posts are fictional examples. Interviews are text transcripts without video recordings. Submissions and trial interest remain local; no review platforms are connected.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\testimonial-social-proof-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
