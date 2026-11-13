# Remy Park — Independent Creative

- Original: `data\prompts\189-freelance-creative-portfolio\189-freelance-creative-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Bold original brand-poster carousel, four-category work filtering, project case-study dialogs with process and next-project navigation, service-to-enquiry prefilling, sample testimonial switcher, FAQ and local booking-request draft.
- Source: `out\pages\189-freelance-creative-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\189-freelance-creative-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: playful citrus, pink and blue original poster studies, tilted hero and bold personal typography. Narrow screens retain complete work art, readable services and two-column labeled enquiry fields. Refined the citrus stem clearance; final preview and interactions rechecked.
- Mocks and limits: Fictional identity, clients, artwork briefs and sample quotes. Original SVG portrait replaces an unavailable professional photo. Section-based homepage and dialogs, not a full client portal. Illustrative prices/timelines; no real messages, calendar booking, client results or external embeds.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\freelance-creative-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
