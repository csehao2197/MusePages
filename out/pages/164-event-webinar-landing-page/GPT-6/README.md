# Offscript Live — Less, but better

- Original: `data\prompts\164-event-webinar-landing-page\164-event-webinar-landing-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Timezone-aware workshop schedule, expandable minute-by-minute agenda, original speaker illustrations, validated local registration confirmation and actual downloadable ICS calendar reminder.
- Source: `out\pages\164-event-webinar-landing-page\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\164-event-webinar-landing-page\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview PNGs. High-contrast yellow typographic poster complements the oversized title; dates and CTA are immediate. Illustrated hosts, agenda and registration retain clear spacing on mobile; no clipped form controls.
- Mocks and limits: Fictional free workshop and speakers. No live event, seat reservation, email reminders, recording, credentials or attendee-count claims. Calendar file is explicitly labeled a demo with no meeting URL.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\event-webinar-landing-page\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
