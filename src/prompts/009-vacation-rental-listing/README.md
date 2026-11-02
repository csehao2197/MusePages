# Casa Azul · StayDirect — project009

A source-tailored, local-only Next.js property listing. Application files live directly beside `009-vacation-rental-listing.md`; there is no nested generated app or shared demo template.

## Run locally

The existing parent workspace supplies the declared dependencies and installed Chromium. No dependency installation or root manifest/lockfile changes are needed.

PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\009-vacation-rental-listing'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck && npm run build && npm test
```

For an interactive production preview, after building:

```powershell
npm start
```

Open `http://127.0.0.1:3109`. Stop your manual server with Ctrl+C before running tests. Development alternative: `npm run dev`.

`npm run build` uses `next build --webpack` and two build workers. Playwright starts its own production server on loopback port 3109, refuses existing-server reuse, and automatically terminates its server/process tree. Limits: two test workers, 45-second test timeout, 10-second action timeout, 60-second startup timeout, 240-second global timeout, no retries. It does not leave a preview service running.

Verify cleanup and source integrity:

```powershell
$listeners = @(Get-NetTCPConnection -LocalPort 3109 -State Listen -ErrorAction SilentlyContinue)
if ($listeners.Count -gt 0) { throw 'Port 3109 still has a listener' }
Get-FileHash '.\009-vacation-rental-listing.md' -Algorithm SHA256
```

## Implemented source scope

- StayDirect cyan/slate/amber identity, sticky navigation, breadcrumbs, help/owner/account explanations, synchronized USD/EUR/GBP controls, session-only saves, and share-link copy with a manual-copy error state.
- Casa Azul’s beachfront mosaic and full-screen lightbox: arrow buttons, keyboard arrows, thumbnails, Escape, trapped focus, and trigger-focus restoration. Mobile uses a native swipe carousel, view indicators, and counts.
- Private-villa stats, beachfront/self-check-in/Superhost highlights, expandable description, the three named bedrooms, ten prominent amenities, and a categorized searchable complete amenity modal.
- Illustrated availability with disabled occupied/past nights, range highlighting, bounded month navigation, mobile month swipes, selected-date labels, and clear/reset states.
- Sticky desktop reservation card; fixed mobile price/reserve bar and expandable keyboard-accessible planner. Validated native dates, guest steppers, capacity limits, nightly pet fees, complete price breakdown, and local reservation preview with required policy/safety consent.
- Original non-geographic neighborhood schematic, location explanation, illustrative nearby distances, six searchable source-provided review stories, rating bars, Gabriela’s fictional profile, and locally validated message previews.
- House rules, explicit cancellation boundaries, unfenced-pool/camera disclosures, local concern-report preview, four fictional alternative-stay cards with independent saves and explanatory previews, and the source’s footer categories.
- Responsive layouts, scrollable mobile alternatives, reduced-motion support, native input constraints, descriptive artwork text, focus handling, and no document overflow at tested desktop/mobile/narrow-mobile sizes.

## Mocking and honest adaptations

Everything is fictional or illustrative: property, host identity, ratings/reviews, location, availability, discounts, demand, policies, payment protection, response times, and amenities. There are **no real bookings, payments, messages, accounts, maps, live APIs, analytics, or external requests**. Forms use browser memory only. Confirmations display validated details but create no reservation or message; they disappear when dismissed. Saved homes disappear on reload.

- **Photography:** five original SVG architectural scenes replace the requested photography. Eight gallery entries include three explicitly disclosed reused detail studies, not 42 real photographs. Alternative cards reuse these illustrations and say so; they do not depict separate real properties.
- **Reviews:** the illustrative `4.92 / 127` summary is retained, but the browser offers only the six supplied fictional stories. It never pretends to load 127 actual reviews.
- **Amenities:** the modal shows its actual count, **34**, covering the named facilities and detailed categories, including the policy’s carbon-monoxide detector. This corrects the brief’s inconsistent “28” count.
- **Clock/availability:** anchored at **October 31, 2026**, with an explicit fictional clock label; availability ends April 30, 2027. The “2 hours ago” line is marked as a sample update, not a live timestamp.
- **Guests:** 1+ adult; maximum six people **including infants**; maximum one pet. Stays require 3–28 nights; longer-stay requests use the host-message preview.
- **Pricing:** USD is authoritative. `389 × nights + 150 cleaning + 50 × nights × pets`, plus IVA of 16% on those three taxable charges, rounded once to cents. Service fee is zero. Seven nights without a pet: `$2,723 + $150 + $459.68 = $3,332.68`; with one pet: `$2,723 + $150 + $350 + $515.68 = $3,738.68`. The brief’s integer tax/total is corrected, not silently repeated. “15% off” is a rounded illustrative discount versus $459.
- **Currency:** static illustrative rates: USD 1, EUR 0.92, GBP 0.79. Converted components/totals can differ by rounding; the UI explains that USD is authoritative.
- **Cancellation:** exactly seven full days before check-in receives 100%; exactly three receives 50%; fewer than three receives 0%. These are hypothetical boundaries, not enforceable refunds.
- **Platform links:** informational dialogs explain unavailable owner/account/platform features; this is one complete listing experience, not a working platform.
- **Fonts:** system Arial/Helvetica/sans-serif and a system serif for monogram accents replace DM Sans/Inter. No font downloads, embedded font binaries, or external-font build dependency.
- **Narrow screens:** calendars use one month at a time; at 320px, the day grid scrolls internally to preserve touch-target width. Desktop shows two months where space permits.

## Assets and licenses

- `public\villa.svg`, `living.svg`, `bedroom.svg`, `terrace.svg`, `beach.svg`: original artwork created for this demo; MIT terms retained in `public\LICENSE.txt`.
- Lucide React icons: installed dependency, ISC; Feather-derived icons carry MIT terms. Full upstream license text is retained in `public\LUCIDE-LICENSE.txt` (only line endings differ).
- System fonts are supplied by the viewer’s operating system. No font files are redistributed. No stock images, unlicensed downloads, or external assets are used.

## Observed validation — October 31, 2026

- Strict TypeScript: **passed**, including application and test code.
- Production webpack build: **passed**, with two workers; `/` prerendered successfully.
- Final production Playwright run: **29 passed, 0 failed, 0 skipped**, two workers, 18.6 seconds: seven pricing cases, eleven desktop Chromium journeys, eleven mobile Chromium journeys.
- Coverage includes actual gallery touch swiping; gallery arrows/focus/Escape; amenities/review filtering and empty states; calendar selection, disabled dates, mobile touch handlers and navigation bounds; native missing/past dates; reversed/minimum/blocked ranges; infant/capacity/pet limits; IVA/pet/currency math; reservation consent/email validation and confirmation; whitespace-invalid contact/concern forms; location/policy/safety controls; saves; clipboard success/failure; mobile planner focus; reduced motion; and 1440px/390px/320px overflow checks.
- All UI journeys assert no browser runtime errors and no requests to external origins.
- Final desktop full-page, mobile viewport, and mobile reservation-planner captures were visually inspected. Captures are under ignored `test-results\`; render tests also retain full-page/narrow-mobile and confirmation captures.
- Early tests exposed modal focus wrapping and Escape being consumed by search fields; these were fixed. A malformed synthetic touch event in the test harness was corrected before the final clean run.
- Verified **no listener remains on port 3109** after tests.

Validation is Chromium desktop/mobile emulation, not a cross-browser, real-device, or comprehensive accessibility audit. Services remain intentionally mocked, and illustrations are not photography.

## Preserved source

`009-vacation-rental-listing.md` was read in full and never edited. Initial and final SHA-256 match:

```text
1D1EC3429A97AD54C81989974B1A8EA1C4F2C35A502329EB8887144308429F6A
```

Only project009 was implemented. No collection-completion claim, commits, deployment, provisioning, or work on other samples.
