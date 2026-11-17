# The Ruby Lantern

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\619-movie-theater-showtimes-website\619-movie-theater-showtimes-website.md`, combined with `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory. Independent public HTML export: `out\`. Collection address: `pages/movie-theater-showtimes-website/GPT-6/index.html`.
- Original prompt: [Movie Theater Showtimes Website by VibeFather](https://vibefather.ai/t/movie-theater-showtimes-website), from [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/movie-theater-showtimes-website/prompt.md). Adapted under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires the relevant VibeFather license. See `LICENSE.txt`.

## Implementation

Two English pages, original geometric inline SVG posters, velvet curtains, 36 animated bulbs, a pausable ticker, all six film program notes, seven-day sample showtimes, membership information and visit details. Film links carry screening selections. The 96-seat auditorium has fixed taken seats, keyboard arrow navigation, live $11-per-seat totals and an explicitly local hold saved as `the-ruby-lantern-hold`. Day/time changes clear the current selection. Saved holds restore only for the matching film and screening.

All swappable content, colors/geometry parameters, links, program notes, prices, hours, sample screening patterns and taken seats are in `content.js`. SVG rendering and page templates are in `app.js`; tokens, curtain, grain, motion and responsive layout are in `style.css`. Icons are SVG data extracted from installed Lucide, with ISC/Feather notices retained. Fontsource fonts are self-hosted with upstream licenses.

## Static adaptation and limits

The requested Vite 5 / React 18 / TypeScript / Tailwind 3.4 / Motion implementation is adapted to HTML, browser ES modules and CSS animations under the explicit no-build authorization. No production build or minification was run. No framework runtime, APIs, environment variables, analytics, external resource requests, photographs or server dependencies are used. Headline animation fades the two display lines rather than staggering individual letters. Scroll reveals use IntersectionObserver. Fonts and Lucide paths retain the requested appearance without a React bundle.

Films and screening patterns are invented. Day chips represent a sample week, not real dates. Tuesday's $7 discount is at the door only; the local tally uses the requested standard $11 price and explains this on eligible screenings. No booking, real inventory, hold expiry, payment, checkout, membership signup or email exists; nothing is charged. The local hold is not a reservation. Membership is informational. Local storage can be cleared or unavailable; unavailable storage displays an honest warning. Unknown/missing film parameters fall back to Midnight Orchard, Friday 19:00. The family film has no weekday shows; pick a weekend to enable its seats.

## Running and verification

From the repository root, serve only the export with the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\619-movie-theater-showtimes-website\GPT-6\out
```

This captures the real static homepage; it does not build or deploy. For repeatable browser QA, run `node out\pages\619-movie-theater-showtimes-website\GPT-6\.checks\qa.mjs`. It uses installed Playwright Chromium and `startPreviewServer`, asserts the final collection subpath, and closes its own browser/server in `finally`. Evidence lives privately in `.checks\qa.json`, desktop/mobile homepage and film screenshots. Final QA results and visual review are recorded there after actual execution. Public `out\preview.png` is a real 1200×900 first-screen capture, with its fingerprint in `.generation-preview.sha256`. No QA files or dependency/source project files are public. Registration is disabled and undeployed; no collection build or publication was performed.

### Verified results

The final Chromium run passed 38 recorded assertions at 1200×900 and 390×844, with additional 320px and reduced-motion checks. It exercised weekday/weekend screening differences, all six film pages, query fallbacks, mobile navigation, keyboard seat selection, fixed taken seats, $11 pricing, persistent hold/restore/clear, screening reset, unavailable and malformed storage, membership information and local links. HTTP/resource/request/console/page error arrays were empty; horizontal overflow checks passed before and after interaction. Owned browsers and preview servers were closed.

The actual desktop/mobile homepage, program, membership and seat PNGs, plus the fresh exported preview, were opened for visual review. The cream Bungee hierarchy, velvet curtain depth, original geometric posters, panel rhythm and seat state contrast were checked. Review led to robust reveal behavior, a visually hidden skip link outside keyboard focus, and seven day chips fitting a single mobile row. The screenshots are evidence of the implemented static page, not a substitute for it.
