# ZenFlow Studio Schedule

- Original: `data\prompts\142-class-booking-page\142-class-booking-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Weekly grid/list/day schedule with location/instructor/type/time filters, week and date navigation, class details, member and validated guest reservation simulation, waitlist position, cancellation, instructor profile, print and calendar export.
- Source: `out\pages\142-class-booking-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 31 actual assertions, including 10 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\142-class-booking-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: sage and sand weekly blocks convey availability distinctly, bookings sidebar reads clearly, and mobile defaults to a comfortable single-day schedule with large class targets. Filters wrap into accessible rows. Print and local-calendar controls are visible; initial-only instructor portraits are honest placeholders.
- Mocks and limits: Sample recurring schedule and availability; reservations stay in session memory, no account verification, payment collection, email, automatic waitlist notification or real booking service. Calendar file is a local download.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\class-booking-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
