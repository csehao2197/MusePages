# Good Brief — The clear-brief kit

- Original: `data\prompts\167-lead-magnet-landing-page\167-lead-magnet-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Focused cobalt-and-tangerine resource landing page with original workbook artwork, interactive sample checklist and chapter preview, local email capture and actual printable HTML kit download, FAQs and privacy dialog.
- Source: `out\pages\167-lead-magnet-landing-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\167-lead-magnet-landing-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and 1200x900 preview: oversized cobalt workbook and orange seal support a single email CTA; sample worksheet, original avatar and chapter list have a consistent editorial hierarchy. Mobile retains readable forms and printable-resource disclosure, with no overflow.
- Mocks and limits: Fictional editorial brand; author illustration and example reader quote are clearly labeled demonstration content. No verified adoption figures, email delivery, storage, marketing subscription or backend. Original downloadable workbook is generated in the browser.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\lead-magnet-landing-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
