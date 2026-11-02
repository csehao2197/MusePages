# FlyFair — project 003

A flight-specific Next.js demo implemented **directly beside the original brief**, not in a nested project. The default search is JFK → NRT, April 15–29, 2026, two adults, Economy. These historical dates intentionally reproduce the brief; this is not a current travel offer.

## Implemented

- Sticky FlyFair navigation and search modification bar; mobile summary/expanded form, airport swap, round-trip, one-way and a two-leg multi-city itinerary, native date pickers, 1–6 adults and cabin pricing.
- Tokyo destination header with original illustration; conspicuous simulation disclosure.
- **247 deterministic fictional results**, including the brief’s airline and stop totals. No fabricated live count. Five sorting modes, with an explanation of the price/duration Best score.
- Combinable minimum/maximum price controls, illustrative histogram, stops, airlines and expanded Others, outbound departure/arrival time slots, duration, layover airports and alliance filters. Empty results and reset; mobile native-dialog bottom sheet. Default price bounds adapt to one-way and cabin multipliers instead of silently hiding lower one-way fares.
- Outbound/return (or onward) fare cards, local-time labels, day indicator, aircraft/cabin, party totals, seat inventory, Best Value/Cheapest/Fastest badges.
- Expandable itinerary timelines: mock gates/terminals, connecting segments and layovers, terminal changes, aircraft age, amenities, pitch/width, three detailed fare options and baggage weight/change conditions. The initial ANA comparison is $892 / $958 / $1,340 per adult.
- A clearly **illustrative sponsored** ANA Premium Economy bundle after the third result: initially $1,190/person, with the same discounted amount carried into booking.
- Collapsible seven-day fare guide with the brief’s initial values, selection and preserved trip length; a priced, color-coded full-month grid.
- Qualified demo-policy banner, 10 initial cards, “Show 20 more flights,” loading placeholders, opt-in intersection-observer loading, and accurate filtered totals.
- Local validated price alerts, working similar-route searches, qualified FlyFair tip. These widgets remain available below results on mobile.
- Functional information dialogs for navigation/footer destinations rather than dead links. No real Norton/IATA/BBB badges or endorsements.
- **Travelers → Seats → Review → simulated confirmation**: validated names/email, distinct included seats for every itinerary leg, unavailable seat examples, Basic’s assigned-seat policy, fare × adult arithmetic, acknowledgement before confirmation, and removable My Trips previews.
- Responsive stacked cards and vertical fare comparisons, mobile Sort/Filters bottom actions, 44px button targets, visible keyboard focus, skip link, native modal focus containment/Escape restoration, and reduced-motion styles. On narrow devices the seat map scrolls internally to retain usable seat targets.

## Run and validate

Use PowerShell in this directory:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\003-flight-search-and-booking-page'
npm run typecheck
npm run build
npm run test:e2e
```

The supplied collection ancestor already contains compatible dependencies. **No installation or root lockfile changes are required.** This package declares only the libraries it uses. `build` invokes `next build --webpack`; `next.config.ts` restricts build workers to two.

For manual production exploration:

```powershell
npm run start
```

Visit **http://127.0.0.1:3103**, then stop the manual server with Ctrl+C. `npm run dev` uses the same port.

Playwright starts its own **production** server on 127.0.0.1:3103, explicitly refuses existing-server reuse, and shuts it down after the suite. Tests have 40-second bounds, the server has a 60-second startup bound, and concurrency is two workers. A production build must exist before testing. The supplied Chromium installation is used.

## Mock boundaries and deliberate limitations

All flights, dates/prices, capacity, fare conditions, gates, aircraft age, layovers, amenities, baggage and seat maps are fictional fixtures. Airline names identify comparison examples, with original initial-based icons, **not official logos, endorsements or airline-verified data**. Generated connection times are illustrative local-time labels, not an operational, timezone-calculated schedule. Supported dates are 2026–2027.

Cabin and trip changes use deterministic price multipliers; the three comparison columns remain the brief’s illustrative fare bundles, not airline-specific business-class contracts. The date widget is a representative fare guide, not a guaranteed minimum across the entire inventory. Currency conversion uses fixed demo rates: 1 USD = 0.92 EUR = 150 JPY; price filters remain USD.

Searches, passenger details, alerts and confirmations live **only in page memory** and clear on reload. No booking, payment, email, authentication, analytics, travel API or real notification service is connected. No card details are requested. Seats/inventory are not reserved or decremented; removing a preview does not cancel a real flight. Alerts validate an email but cannot notify or monitor price changes.

Multi-city supports two legs, not an arbitrary itinerary builder. Optional price-lock functionality is not implemented. Hotels, cars, packages and corporate/support/legal pages are explanatory dialogs, not additional products. Source trust guarantees, certification badges and the claimed 15–25% savings were qualified/replaced to avoid implying enforceable policies, audited savings or actual memberships. No independent accessibility audit, exhaustive cross-browser testing or real airline integration is claimed.

## Assets and licenses

- `public\tokyo.svg`: original SVG created for this demo; no downloaded photography, stock assets or third-party illustration.
- `public\InterVariable.woff2`: locally bundled, unmodified Inter variable font from [the Inter project](https://github.com/rsms/inter), downloaded from its `docs/font-files/InterVariable.woff2` distribution. Copyright © 2016 The Inter Project Authors; **SIL Open Font License 1.1**, included in `public\Inter-LICENSE.txt`. No network font request at runtime or build time.
- UI icons: declared `lucide-react`, [ISC licensed](https://lucide.dev/license).
- Airline marks are original text-initial treatments, not downloaded airline artwork. FlyFair is a fictional brand.

## Observed validation — October 31, 2026

- **Production webpack build passed** with Next.js 16.4.3, two build workers, and prerendered `/`.
- **Strict TypeScript passed** (`tsc --noEmit`).
- **22/22 Playwright tests passed** against that production build: 11 scenarios each in desktop Chromium and mobile Chromium. Final suite duration: 21 seconds.
- Verified combined filters/empty/reset, price/duration/connection filtering, arrival slots, passenger capacity, sorting, date/party/one-way/cabin arithmetic, swap/multi-city validation, all booking stages, per-leg seats, over-selection/unavailable seats, Basic fare behavior, consent errors, focus containment/Escape return, load-more/infinite loading, alerts, route changes, currency conversion and sponsored bundle pricing.
- Initial desktop/mobile renders, flight-card renders and booking-review renders were **actually opened and visually inspected**. The suite saves screenshots under ignored `test-results\` (render, full-page, cards and booking variants). Page overflow assertions passed at 1440px desktop, 390px mobile and 320px narrow mobile; booking page overflow was also checked. Initial page smoke tests observed no browser exceptions or off-origin requests.
- Reduced-motion transition check passed. No broad audit or exhaustive visual regression suite is implied.
- **Port 3103 had no listening server after validation.** No task-owned helpers were left running.

## Original brief integrity

`003-flight-search-and-booking-page.md` was read in full and preserved byte-for-byte. SHA-256 before implementation and after validation:

```text
E42F03F7F35EABFF1CBFFD2AA670C66E3B95ECBC1EAAA10F017728668B8871CF
```

Verify with:

```powershell
Get-FileHash '.\003-flight-search-and-booking-page.md' -Algorithm SHA256
```

Only project 003 was implemented. No collection root files or other numbered projects were edited; no commits, deployment or provisioning were performed.
