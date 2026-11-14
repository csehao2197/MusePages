# Jules Ito — Motion with Intent

- Original: `data\prompts\192-motion-designer-portfolio\192-motion-designer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Original eight-second browser-rendered motion study with explicit play/pause, scrubbing, captions, timing modes, three aspect-ratio previews, frame SVG download and three detailed concept breakdowns with delivery notes.
- Source: `out\pages\192-motion-designer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\192-motion-designer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: electric blue motion poster, original orbital art and orange editorial accents. Refined inactive reel controls to high-contrast pale labels, then rechecked mobile. Play/pause, exact scrubbing, caption beats, ratio previews, vector frame download and scrub-only reduced-motion behavior all passed.
- Mocks and limits: Illustrative identity and self-initiated animation concepts, not commissioned client work. Reel is authored SVG animation rather than supplied video; no audio or encoded production delivery. Playback starts only by choice and reduced-motion mode remains scrub-only. No contact messages sent.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\motion-designer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
