# 022 · HomeScope Realty neighborhood field guide

A standalone, tailored Next.js App Router demo beside the original brief. Deep-blue navigation, teal controls, warm-gray field notes, original aerial-style neighborhood art, circular scores, and a map/directory-led layout follow the HomeScope direction. Application code is in this folder's `app`, `components`, and `public`; there is no nested project or shared application template.

## Run and validate

From PowerShell, using the already-installed ancestor workspace dependencies (no install or root lockfile changes):

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\022-neighborhood-guide'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm run test
```

Manual production preview, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
# Open http://127.0.0.1:3122; stop the foreground server with Ctrl+C.
```

Development, if desired: `npm run dev` (port 3122).

`build` runs `next build --webpack`, with two build workers in `next.config.ts`. Playwright starts an isolated **production** server on `127.0.0.1:3122`, refuses server reuse, uses one worker, has a 60-second startup bound and 30-second per-test bound, and automatically shuts down its server. Keep port 3122 free before running. Telemetry is disabled by the commands and the test server environment.

## Working journeys

- Six typed fictional neighborhoods, with name/city/demo-ZIP autocomplete, unknown-search recovery, horizontal featured cards, and area-specific overview, statistics, directory, housing, and commute data.
- Five amenity categories; live place search filters **both** schematic pins and the directory. Map, directory, and school entries open local detail dialogs. Empty filters have a reset action.
- Save/remove stops, including across neighborhoods. Only stop identifiers are persisted in browser localStorage; denied or corrupt storage falls back to an in-memory visit. The guide lists saved stops and downloads an illustrative plain-text report, not an itinerary route.
- Three selectable comparison columns show illustrative costs, school/walking demo scores, and commute units. Wide tables have their own horizontal scroll, not page overflow.
- Local housing discovery with type and maximum USD-price filters, negative-price feedback, no-match recovery, and property-specific inquiry.
- Tour/inquiry forms enforce required fields, email syntax, nonblank names, future-or-today dates, character bounds, and a simulation acknowledgment. An explicit simulated failure preserves entries for retry; success gives a local confirmation. Reset and another-request actions clear entries.
- Market-alert email validation and a local confirmation; no subscription or email delivery.
- Semantic headings, labels, native dialogs, Escape/backdrop dismissal, keyboard focus wrapping and trigger restoration, mobile navigation, collapsible tablet/mobile directory, and reduced-motion treatment.

## Scope, substitutions, and safeguards

**Everything is fictional and unverified**: Brookhaven/OR context, neighborhood locations, ZIPs, prices, incomes, populations, school details and scores, crime/safety scores, walk/transit/bike scores, distances, commute times, business existence/hours, reviews, healthcare entries, accessibility, market trends, and housing availability. USD, USD/month, miles, minutes, square feet, and sample counts are labeled.

The brief's “top-rated schools,” demographic-fit language, “Very Safe”/“Excellent Transit” descriptors, real-source attribution, and resident endorsements are deliberately not presented as verified claims. The school panel explicitly states that ratings are **not** sourced from or affiliated with GreatSchools.org. The walking numbers are not third-party Walk Score ratings. No demographic steering, real assessment, legal guarantee, brokerage/certification claim, provider endorsement, or investment advice is offered. Reviews retain the brief's example voices only as conspicuously fictional testimonials.

There are no live maps, geolocation, directions, APIs, booking, payments, accounts, calls, email, credential entry, or real listings. The local specialist is invented; `.example` email and a display-only fictional phone are not actionable. Forms should use invented information; submissions never leave the page and are not persisted. Alerts last only for the current visit.

Photography is replaced by original SVG/CSS illustrations: `public/neighborhood.svg`, CSS aerial card crops, a CSS street/river/park schematic, abstract home artwork, and a CSS specialist avatar. There are no downloaded photographs or remote assets. The map is an interactive **not-to-scale schematic**, without provider imagery, panning, zooming, routing, or location accuracy. Its repeated street labels are decorative, not geographic evidence.

DM Sans/Inter are adapted to local Arial/Helvetica/system sans-serif; small editorial accents use system Georgia. No font files are embedded, no font license is redistributed, and no remote-font build dependency exists. These are system-font substitutions, not an assertion that DM Sans or Inter is bundled.

## Asset provenance and notices

- Neighborhood SVG, CSS illustrations, layout, and chart artwork were created for this demo; no external artwork or photography was copied.
- Icons are from installed `lucide-react` 1.61.0, ISC with Feather-derived icons under MIT. Both notices are retained in `THIRD-PARTY-NOTICES.txt`; the dependency's original license also remains in the ancestor installation.
- No licensed font or map-provider assets were imported.

## Observed verification · 2026-10-31

- `npm run typecheck`: passed with strict TypeScript.
- `npm run build`: passed; Next.js 16.4.3, webpack, two workers; `/` statically prerendered.
- `npm run test`: **18 passed** (9 focused cases × desktop Chromium 1440×1000 and mobile Chromium/iPhone 13 viewport), 21.2 seconds on the final run.
- Coverage: neighborhood search/selection, category-map-directory synchronization, empty reset, detail/save/reload/remove/download, comparison selectors and units, housing filters/numeric constraints/inquiry opening, tour email/name/date/native constraints/error retry/confirmation/reset, alert validation, modal keyboard wrap/focus return, storage failure fallback, no external requests on the storage/detail/guide path, mobile nav/directory collapse, reduced motion, and page/modal overflow.
- An initial run found a keyboard boundary-wrap defect (16/18 passing); the dialog now explicitly wraps focus. The complete rebuilt suite then passed.
- Final full-page desktop/mobile captures were generated and visually inspected at `test-results\desktop-full.png` and `test-results\mobile-full.png`. The navy/teal aerial hero, swipeable cards, score rings, directory map, stacked mobile layout, market chart, comparisons, and contact section render coherently.
- After tests, `Get-NetTCPConnection -LocalPort 3122 -State Listen -ErrorAction SilentlyContinue` returned no listener.

Limits: Chromium only; this is not a screen-reader audit or cross-browser certification. The automated housing case checks inquiry context; successful submission and retry are covered through the shared tour form. Network assertions cover the storage/detail/guide path, not every interaction. No actual school, safety, accessibility, market, business, or transit information has been researched or verified.

## Original preserved

`022-neighborhood-guide.md` was read in full and never edited. Its SHA-256 before and after implementation is:

```text
3A5D4FFBC5D0CC0EFBE198750ADA836272F8F8B727C164E9CFA1107EF536BC8D
```

Verify:

```powershell
Get-FileHash .\022-neighborhood-guide.md -Algorithm SHA256
Get-NetTCPConnection -LocalPort 3122 -State Listen -ErrorAction SilentlyContinue
```

Only project 022 was implemented. No collection completion is asserted.
