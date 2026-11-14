# Rowan Hale — A Photographic Study

- Original: `data\prompts\193-photographer-portfolio\193-photographer-portfolio.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Image-led white masonry layout with responsive local WebP photographs, category filters and load-more, keyboard/touch lightbox with honest information toggles and local photo-link sharing, services and unsent shoot enquiry.
- Source: `out\pages\193-photographer-portfolio\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\193-photographer-portfolio\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and official preview: image-led white masonry layout with restrained editorial title and quiet fixed navigation. Actual local responsive photographs load crisply with preserved source notices. Portraits are explicitly stock, not the fictional owner; gallery filters, load-more, keyboard lightbox, information and share deep links were verified.
- Mocks and limits: Illustrative photographer identity. Stock photographs remain credited to Unsplash and are not represented as Rowan photographs or commissions. No real awards, gear EXIF, prices, studio location, availability, sales, booking or reply promises. Source/license notice retained; no stock photo download or sale offered.
- Assets: six locally optimized Unsplash stock photographs with 480px variants, source URLs and license terms in `IMAGE-CREDITS.txt`, retained in the export. Four originals reused from existing licensed local assets; two higher-resolution portrait files retrieved from their recorded public CDN sources. Existing `sharp` performed WebP resizing; no packages were installed. No photographer attribution or ownership is invented. System fonts; no remote runtime image loads.
- Registered disabled, undeployed. Expected publication: `pages\photographer-portfolio\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
