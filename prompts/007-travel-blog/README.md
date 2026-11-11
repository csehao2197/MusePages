# Wanderlust Chronicles — sample-007

A tailored Next.js travel magazine implemented directly beside `007-travel-blog.md`. This project alone is complete; it makes no claim about the other demos.

## Run

Use the existing ancestor `node_modules` in `nextjs-project-samples`. Do **not** reinstall dependencies or change the root lockfile. Node 26.13 / npm 11.20 were used.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\007-travel-blog'
npm run dev
```

Open `http://127.0.0.1:3107`. Stop the development server before production testing.

```powershell
npm run build
npm start
```

The production build uses webpack and two Next.js workers. Both manual servers bind to loopback on port 3107.

## Validate

Run in this directory with no existing listener on 3107:

```powershell
if (Get-NetTCPConnection -LocalPort 3107 -State Listen -ErrorAction SilentlyContinue) {
  throw 'Port 3107 is occupied; refusing existing-server reuse.'
}
npm run typecheck && npm run build && npm test
if (Get-NetTCPConnection -LocalPort 3107 -State Listen -ErrorAction SilentlyContinue) {
  throw 'Port 3107 was not cleaned up.'
}
Get-FileHash '.\007-travel-blog.md' -Algorithm SHA256
```

Playwright starts its own production server, refuses existing-server reuse, and automatically terminates it. One worker; 30-second startup/test timeouts; 120-second global suite limit; no retries. Chromium must already be installed, as in the supplied environment.

### Observed results (October 31, 2026)

- Strict TypeScript: passed.
- `next build --webpack`: passed; static `/` route generated with two workers.
- **16/16 browser tests passed**: eight scenarios each at desktop 1440×1000 and mobile 390×664 (Chromium emulation). Additional 320px overflow checks passed.
- Covers initial nine-card editorial spread, full featured article and native dialog focus/escape, category/search/sort/empty/load-more states, saved-reading persistence/unsave, newsletter validation and acknowledgment, Portugal and writer journeys, footer guides/privacy/preferences/photo-story links, reduced motion, keyboard search, malformed-entry filtering, and narrow-layout overflow.
- Desktop/mobile `home.png`, `stories.png` and `portugal.png` renders were captured under `test-results` and visually inspected: local images load, the grid and spotlight reflow, and sticky navigation stays usable.
- No page errors in the render checks; newsletter test observed no non-GET requests or stored email address.
- The test-owned port 3107 listener was checked absent after the suite.

## Editorial scope and reader journeys

- The source's brand, teal/amber palette, Santorini feature, six categories, nine initial stories, five trending stories, Portugal deep dive, four writer profiles, newsletter, six-location visual journal and four-column footer are represented.
- Thirteen typed stories contain original, distinct three-section short-form articles. The featured story is separate from the initial nine-card grid; load more adds three Portugal stories. Search/category/saved/writer/Portugal filters search the full collection. Sorting uses supplied dates or sample reads.
- Articles open in native modal readers with related articles, save controls and return actions. These are detail **views**, not separately addressable article routes.
- Bookmark IDs persist in `wc-saved`. Clear saved reading removes the list. Newsletter validates email and requires demo acknowledgment; only a confirmation flag is saved in `wc-newsletter`, **never the address**. Reset clears it. Optional cookie-demo preference uses `wc-cookie`; no analytics or tracking cookies exist.
- The mobile menu uses a full-screen native dialog. Modal focus confinement, escape dismissal and focus restoration are browser-native. Reduced-motion styling disables animated scrolling/hover effects; navigation uses immediate scrolling. A back-to-top action restores keyboard focus to the brand.
- Footer resources explain useful planning approaches and their limitations. Social links open transparent local concept notes rather than pretending to connect accounts; location images open relevant stories.

## Honest demo boundaries

All writers, bylines, dates, read estimates, popularity, archive totals and subscriber metrics are fictional/sample editorial data. The actual collection has thirteen stories, not the larger source-concept totals. Articles explicitly distinguish imagined trips and invented businesses from general travel advice. No real-person endorsements or publisher affiliations are claimed.

No email delivery, booking, accounts, payments, affiliate links, AI provider, live fares, map service, visa database, insurance quote, RSS endpoint or social integration is provided. No data leaves the browser through those flows. Resource pages are local informational dialogs, not functioning commercial services. The Portugal feature is a fixed March 2026 demo issue, not an automatic monthly update.

Reading times and full-archive author counts reproduce the editorial concept; the actual article text is a shorter demo edition. Verify current official travel, weather, safety and entry guidance independently. Browser-storage restrictions fall back to visit-local state with a warning.

## Assets and fonts

`public` contains thirteen original SVG destination illustrations plus a compass illustration, reproducible with `node generate-assets.mjs`. They deliberately replace photographic references without scraping or implying firsthand reportage. These original assets are CC0-1.0; see `public\ASSETS-LICENSE.txt`. UI icons are `lucide-react` (ISC).

No fonts are bundled, copied or downloaded. The elegant-serif/sans-serif direction uses locally available Georgia/Times New Roman and Arial/Helvetica, with generic fallbacks, rather than externally fetched Playfair Display/Inter. OS fonts retain their existing licenses. The production build has no external font dependency.

## Original source integrity

`007-travel-blog.md` was read in full and preserved byte-for-byte. Original and final SHA-256:

```text
E56E15DE3B652E7E94BDCD653BD8A34E4C48FDA225D293D9BACF04DF827A05BF
```

No root manifests/locks/reports, other projects, commits, deployments or credentials were changed.
