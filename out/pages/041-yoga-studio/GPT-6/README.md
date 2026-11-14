# Inhale Studio

- Input: `data\prompts\041-yoga-studio\041-yoga-studio.md` and `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; output label: `GPT-6`. Type: static HTML/CSS/JavaScript; source: this directory.
- Features: warm serif homepage, seven swipeable class styles, location/style/week schedule filters, mobile schedule accordions, instructor profiles, waitlist/booking/membership/workshop previews, searchable four-item library, silent local visual player, studio guides, information dialogs and free-class form.
- Export: `node out\pages\041-yoga-studio\GPT-6\prepare.mjs`. Copies only homepage files/assets into `out\`.
- Run/check from root: `node --check out\pages\041-yoga-studio\GPT-6\app.js` and `node out\pages\041-yoga-studio\GPT-6\verify.mjs`. Existing Playwright uses temporary loopback servers, closed in `finally`.
- Actual validation: 75 assertions; functional flows, local fonts/images, nested mount, source/export equality, touch heights, viewport equality and overflow at 1440/1024/768/390/320, real 1200×900 screenshot. Desktop/mobile/full-page/preview images visually reviewed.
- Registered static directory: `out`; future public path: `pages/yoga-studio/GPT-6/index.html`. Disabled/undeployed registration only; collection assembly and publishing were not run.
- All studio identities, addresses, instructors, credentials, health descriptions, schedules, offers, availability, ratings and testimonials are illustrative. Schedule is a sample November 12–18, 2026 week; workshop dates use 2027. Hero/portraits are stock practice imagery, not verified premises or instructor identities.
- Four 12-second silent still-image previews demonstrate player behavior; the full 500+ library and instructional videos are not supplied. Forms preview only in memory; no upload, email, persistence, real reservation, payment, membership or certificate. Maps are original local schematics, not navigation. Social/contact links open explicit concept information.
- Environment variables: none. Local runtime assets only. Sources/licenses: `assets\credits.txt`; original prompt rights remain with their authors.
