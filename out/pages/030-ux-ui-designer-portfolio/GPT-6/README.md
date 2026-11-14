# Ava Chen — Product Designer

Static HTML/CSS/JavaScript by **gpt-6.1-sol**, using `data\prompts\030-ux-ui-designer-portfolio\030-ux-ui-designer-portfolio.md` and `src\workflows\AI Agent\DESIGN.md`.

Four original interface concepts have detailed, deep-linkable case dialogs and working local calendar, reporting, plugin-search/install, and appointment-review sketches. Includes keyboard tabs, mobile modal navigation, local resume download, profile-reference dialogs, and a validated local message preview.

Source is this directory; static homepage and licensed assets are in `out\`. Future public path: `pages/ux-ui-designer-portfolio/GPT-6/`. Registration is separate from collection assembly and deployment.

Run `node --test out\pages\030-ux-ui-designer-portfolio\GPT-6\page.test.mjs` from the repository root. Tests use the existing temporary localhost preview server and Playwright; no build, dependencies, environment variables, backend, or external runtime requests are needed.

## Status and limitations

`node --check app.js` and browser tests passed: **5 tests, 0 failures**, at 1440/1024/768/390/320 px. Checked four case dialogs and sketches, keyboard/history navigation, resume, profile disclosure, mobile targets, invalid/unsafe form input, async-edit cancellation, clearing, and local-only requests/storage. Fixed an asynchronous dialog-close race that could replace a newly opened case URL.

Actually reviewed desktop/mobile homepages, work, portrait/about, mobile contact and case screenshots, plus the real 1200×900 export preview. All assets decoded; no HTTP/network/JavaScript errors. Static references and subpath checks passed. No build, collection assembly, publication or upload.

Ava, employment, personal story, testimonials, metrics, and contact address are fictional/unverified. Product names are references, not affiliations. Accessibility is a design goal, not certification. The portrait is stock photography, not Ava. Case-study research describes proposed studies, not actual participant work.

Messages, calendar events, plugin states, and visit reviews exist only in page memory. Nothing is sent, saved, installed, booked, or paid. Profile buttons explain the absence of authenticated profiles. The resume is a clearly marked, downloadable concept text document. External services and physical devices are untested.

Asset attribution and font/Lucide licenses are in `assets\`. Interface artwork is original SVG; fonts and photography are local.
