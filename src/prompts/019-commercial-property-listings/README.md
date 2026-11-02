# 019 — Vanguard Commercial

A standalone, source-tailored Next.js commercial property discovery demo. Application files sit directly beside the original `019-commercial-property-listings.md`.

## Run and validate (PowerShell)

Uses the already-installed ancestor workspace modules; no install or root manifest/lock changes are needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\019-commercial-property-listings'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`npm run build` uses Next 16.4.3 webpack and two build workers. `npm test` uses two Playwright workers, a 180-second suite limit, 30-second test/startup limits, and an isolated production server at `http://127.0.0.1:3119`. It refuses an existing responsive server (`reuseExistingServer: false`), fails on a conflicting listener, and automatically terminates its server process tree. It does not use a development server.

For manual preview, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm start
# Stop with Ctrl+C when finished.
```

Verify shutdown and original integrity:

```powershell
Get-NetTCPConnection -LocalPort 3119 -State Listen -ErrorAction SilentlyContinue
Get-FileHash '019-commercial-property-listings.md' -Algorithm SHA256
```

## Observed validation

- Strict TypeScript: passed.
- Production webpack build: passed; statically prerendered home page.
- Playwright: **35 passed** — 3 logic tests, 16 desktop tests at 1440×1000, and the same 16 mobile tests at 390×844.
- Covers source rent/sale arithmetic, combined search and filters, sliders/manual ranges, class/year/amenities/certification/timeline filtering, sort and pagination, grid/list/map views, saved persistence and corrupted-storage recovery, comparison limits, detail gallery, calculator invalid/zero/extreme inputs, native required/email/date validation, phone/whitespace error recovery, tour and requirement confirmations/reset, multi-submarket requirements, local search-alert preview/reset, map clusters/pins/controls/custom drawing/keyboard area selection, focus containment and return, Escape, mobile navigation, reduced motion, overflow, local-only assets and qualified report download.
- Desktop/mobile hero, listing, contact and map screenshots were inspected. Final screenshots are generated under ignored `test-results/`.
- Port 3119 had no remaining listener after automatic test-server cleanup.

## Implemented source scope

The navy Vanguard identity, sticky skyline navigation, geometric search header, quick chips, data-dense three-column property cards, filter sidebar/mobile drawer, discovery controls, split schematic map, campus feature, market strip, broker team, requirement form and multi-column footer are all implemented for this commercial-property brief.

Twelve typed fictional Austin listings include the original Frost Tower suite, Domain retail pad, distribution center and Austin Tech Center concepts, plus offices, retail, industrial, flex, land and mixed-use examples. Six results per page make pagination testable without invented hundreds of listings. Search combines location/name/address/ZIP, property type and transaction with all sidebar/quick filters. Multiple property types, classes and year bands use OR within each group; amenities, certification labels and quick chips use AND. Clear/reset restores the full sample.

Lease and sublease asking rates are USD/SF/year; monthly base rent is `SF × annual rate ÷ 12`. Sale prices are total USD and `asking price ÷ SF`. NNN/fees/taxes are excluded, clearly explained. Mixed-transaction price sorting uses annual lease totals and total sale asks, with an explicit non-comparability warning; choosing a transaction is recommended. Price filters require a transaction to avoid mixing incompatible units. Year bands use non-overlapping decade boundaries.

Saved property IDs are stored only in browser localStorage (`vanguard-019-saved`). Unsave all properties to clear them. Requirements/tour requests and search-alert previews remain in page memory, not localStorage; reset or reload clears them. Native validated forms never email, book, or submit to a provider. Confirmation summaries show the selected requirements or requested date/time. Real contact details should not be entered.

## Deliberate mocks and adaptations

- Source claims of 2,400 listings / 35 markets / 248 Austin results are replaced with the actual 12-property fictional sample.
- Addresses, named properties, prices, dimensions, amenities, availability, certification labels and broker profiles are fictional demo presentations, not real availability, verified certifications, endorsements, valuations or investment recommendations.
- Q1 2026 market figures retain the source-design values but are prominently labeled illustrative and unverified. The downloadable text report repeats this qualification; cap-rate figures imply no returns.
- The interactive map is original schematic SVG/CSS, not geospatial data. Type-colored pins, hover titles, a downtown two-property cluster, pin overlays, bounded zoom, pan-east/back, satellite-style palette, in-page expanded map, drag-to-select rectangles and keyboard East Austin selection work locally. Expanded mode is an in-page enlargement, not the browser Fullscreen API. Mobile reverses the split into a map above a scrollable property sheet.
- Architectural SVG illustrations replace photography; galleries use three crops/perspectives of the same authored illustration. Mobile cards support swipe/next-view controls; details support swipe and keyboard-accessible previous/next buttons. Broker monograms replace real headshots.
- Sign-in, listing publication, other-market/company/service links and source phone/email/license placeholders open truthful explanatory previews or navigate to relevant source sections. No authentication, actual brokerage licensing, live maps, external APIs, accounts, purchases, leases, payments or message delivery are implemented.

## Asset and font provenance

All building/land SVGs, geometric background, map and avatar styling were created for this demo. No unlicensed or external images were downloaded. Fonts are a local `Inter, Arial, Helvetica, sans-serif` stack (Inter only if already installed), with system Georgia for avatar initials; no font assets or build-time external font requests.

Lucide React icons use ISC licensing; Feather-derived icons retain their MIT notice. Full notices copied from the installed package are served at `public/NOTICE.txt` (`/NOTICE.txt`). Next.js and React use MIT licenses, retained in the installed dependency packages. No third-party photographs or map/font assets require additional attribution.

## Original preserved

Original Markdown was read fully and never modified. SHA-256 before and after:

```text
726B469D646E072F9BBB0284B3B89656C84EF90921742C16E8D610114E5FD48E
```

Only project019 is implemented and validated here; this makes no claim about collection completion.
