# StayFinder — project005

A self-contained Next.js local hotel-search and booking demo. All application files are directly beside the original brief; there is no nested project directory.

## Run and validate

From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\005-hotel-search-and-booking'
npm run dev
```

Open `http://127.0.0.1:3105`. Stop development with Ctrl+C before running production tests.

```powershell
npm run typecheck
npm run build
npm run test
```

For a manual production session, run `npm run start` after building, then stop it with Ctrl+C when finished. Do not run a manual server concurrently with tests.

The existing ancestor `node_modules` provides the declared dependencies. No dependency installation or ancestor manifest/lock change is necessary. The build explicitly uses webpack and two Next.js workers. Playwright starts its own isolated production server on port **3105**, refuses an existing server, uses a 60-second startup timeout, a 45-second per-test timeout, two browser workers and automatic server teardown. It runs desktop Chromium (1440×1000) and mobile Chromium (Pixel 7, 393×851).

## Implemented flows

- Tokyo destination autocomplete with keyboard selection, native date pickers and guest/room steppers. Search is explicitly applied; changing a draft does not silently change the current results.
- Dates calculate UTC calendar nights. Check-out must follow check-in; the demo permits historical dates to retain the brief's April 14–21, 2026 example, and caps a stay at 30 nights. At least one adult is required in each room.
- Eight typed fictional hotels, distinctive hotel/ryokan/capsule/apartment/hostel room types, capacity rules, amenities, neighborhoods, distance, discounts, sample availability and policies. The initial two-adult/one-room search returns **seven** properties: a single-occupancy capsule requires two rooms for two adults. Changing to two rooms includes the $38 capsule.
- Combinable price, exact star, guest score, property, neighborhood and amenity filters; counts respect the other groups. Selections are OR within a group and AND between groups. Price thresholds are base-room USD amounts, converted for display. The range starts at $0 so the $38 capsule is not artificially excluded.
- Five sorts, removable chips, clear/reset, empty results, desktop list/grid, four-result pagination and load-all. Sold-out fixtures remain visible but cannot be booked.
- Four-position card illustration carousel (buttons, dots and mobile swipes), on-device favorites, comparison of up to three hotels, and genuine recently viewed history with a clear action.
- Detail dialog with five illustration studies, overview, rating breakdown, room selection and comparison, amenities, schematic location, sample attraction times, house rules, flexible/non-refundable policies, six expandable fictional reviews with sample hotel replies, and sticky reservation totals.
- Original interactive schematic map with clustered Shinjuku markers, available/sold-out colors, previews, zoom, simulated satellite styling and neighborhood-area search combined with existing filters. Mobile map is a full-screen dialog.
- Booking room selector, capacity/stock checks, nightly × nights × rooms totals, taxes included, no extra child fee, required guest name, email-format validation and explicit consent. Confirmation is an in-memory preview with a `SF-DEMO-` reference.
- Responsive mobile search collapse, filter bottom sheet, stacked cards, scrollable galleries/comparisons, and a lowest-sample-price “View deal” bar.
- USD/EUR/JPY display conversion using fixed **illustrative** factors (1 / 0.92 / 150). English is the only implemented language.
- Skip link, labeled controls, native modal focus containment/Escape dismissal and focus restoration, live feedback, disabled states, form validation and reduced-motion overrides.

## Honest demo boundaries / brief adaptations

Nothing contacts a hotel, map provider, account system, payment processor, email service or live travel API. Browser network traffic is limited to this local app. No credentials are needed.

All hotel names, addresses, rates, stock, star ratings, reviews and travel times are fictional. The brief's real brands and movie endorsement were replaced by original fictional properties with analogous skyline, minimalist, ryokan and budget styles. The illustrated ad placement is unpaid. Sample “rooms left” counts do not represent live scarcity; a confirmation does **not** decrement or hold inventory.

The brief's 245 results/13 pages, 32 photographs, 1,284 actual reviews, two-million-booking claim, verified-review badge, price-match guarantee and live 24/7 support are deliberately not claimed. Pagination and expandable reviews operate on the actual small fixture collection. “Satellite” is a CSS style, not satellite imagery, and the map is not to scale or suitable for navigation. Other navigation/footer destinations display honest informational dialogs, not unfinished external integrations.

Saved/recent hotel IDs use namespaced localStorage keys on this browser only; storage failures fall back to session state with an announced message. Guest name/email remain transient form values and are not persisted or sent. Closing a confirmation discards it. Payment names in the footer are illustrative text, not accepted methods or endorsements. Real reservation cancellation, payment, accounts, email, other destination inventory and translation are not implemented.

## Assets and licenses

Four original SVG hotel interiors are in `public`; gallery studies apply honest crop/light variations to these drawings. CSS maps are original and download no tiles. `public\LICENSE.txt` grants use/modification/distribution permission for the original artwork. Lucide icons come from `lucide-react` under its retained ISC license. There are no downloaded photos or bundled fonts. Typography prefers locally installed Inter, then Segoe UI/Arial; there is no network-font build dependency.

## Observed validation — October 31, 2026

- `npm run typecheck`: **passed**, strict TypeScript.
- `npm run build`: **passed**, Next.js 16.4.3 webpack production build; static `/` and framework not-found route, two workers.
- `npm run test`: **14 passed**, 7 scenarios × desktop/mobile, **17.1 seconds** in the final full run.
- Tests exercise filters/sorts/chips/empty reset, keyboard autocomplete, date/night/guest/room arithmetic, capacity and adult-per-room errors, historical/stay-length policies, gallery/details/room totals/reviews, favorites persistence, comparison, list/grid, map markers/clusters/zoom/style/area search, pagination, unavailable stock, currency, native form validation, explicit consent and local-only confirmation.
- Desktop/mobile results and detail screenshots were captured under ignored `test-results` and visually inspected. Automated checks found no page/dialog horizontal overflow at the tested sizes, no failed local illustration loads, no client console/page errors in the render scenario, correct keyboard modal containment/Escape focus restoration and reduced-motion handling. These are focused checks, not a comprehensive WCAG audit.
- The booking scenario observed **zero external requests**.
- The test-owned server exited after the suite; port 3105 was checked afterward for absence of a listener. No persistent helpers are intentionally left running.

Initial test failures were incorrect expected fixture counts and overly broad alert selectors matching Next.js's route announcer. Those test mistakes were corrected; the final full run passed without retries.

## Original brief integrity

`005-hotel-search-and-booking.md` is preserved byte-for-byte, **7,428 bytes**.

SHA-256:

```text
7EF807650065B91E74F720909EB72BD56F0FF40AE6531404BAA9DB3488D3C697
```

This delivery covers **project005 only**. No collection-level completion is implied.
