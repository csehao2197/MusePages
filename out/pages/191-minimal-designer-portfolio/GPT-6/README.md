# Nico Ellis — Digital Product Design

- Original: `data\prompts\191-minimal-designer-portfolio\191-minimal-designer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Near-black full-viewport typographic introduction, two original interface concepts, dedicated project routes with galleries and keyboard lightbox, subtle reduced-motion-aware reveals, categorized skills and sample resume download.
- Source: `out\pages\191-minimal-designer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 33 actual assertions, including 12 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\191-minimal-designer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: near-black full-height typographic introduction, intentionally generous whitespace and muted original interface artwork. Small screens preserve the scroll cue, project labels and clean single-column rhythm. Dedicated case pages, keyboard lightbox, resume download and disclosure dialogs were exercised.
- Mocks and limits: Illustrative designer identity and sample availability. No actual clients, measured results, photo, location, time zone or professional social URLs supplied. Original graphic avatar and SVG interface studies are clearly labeled. Email is an example mailto address; no enquiry backend.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\minimal-designer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
