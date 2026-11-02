# 018 · Terroir & Vine

A standalone Next.js wine-bar design demo, implemented directly beside the original brief. Dark navy, burgundy, antique gold, arched cellar art, serif editorial headings, illustrated bottles, and an intimate warehouse-room atmosphere. For adults 21+; no alcohol is sold.

## Run and validate

Use the already-installed ancestor `node_modules`; **do not install dependencies or edit the collection lockfile**. From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\018-wine-bar'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

Manual production preview (only when port 3118 is free):

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
# http://127.0.0.1:3118 — stop with Ctrl+C when finished.
```

`npm run build` uses `next build --webpack`, with two build workers. Playwright starts the **production** server at `127.0.0.1:3118`, refuses an existing server (`reuseExistingServer: false`), has a 120-second startup bound, 30-second individual test bounds, two workers, no retries, and automatic server cleanup. It does not use a development server.

## Observed validation

Validated on 2026-10-31 with Node 26.13 / npm 11.20 and ancestor-provided Chromium:

- Strict `tsc --noEmit`: passed.
- Next.js 16.4.3 production webpack build: passed; `/` statically prerendered with client interactions.
- Playwright: **34/34 passed**, 17 scenarios each on desktop Chromium (1440 × 1000) and mobile Chromium (iPhone 13 profile, 390 × 664). Final run: 41.7 seconds.
- Inspected final full-page desktop and mobile screenshots, including gallery composition and stacked sections. No document horizontal overflow; intentional event-card scrolling stays inside its mobile container.
- Tests exercised filters/empty recovery, all named event capacities and prices, tasting/private/reservation forms, quantities and fractional flight totals, date bounds/Monday closure/Sunday boundaries/half-hour arrivals, required email/name/21+ inputs, confirmations/resets, modal keyboard containment/Escape/focus return, mobile drawer, footer actions, carousel autoplay/pause/manual navigation/reduced motion, and absence of page errors/external requests.
- Initial testing found label matching, time-step anchoring, and modal focus issues; corrected before the final successful run.
- Port 3118 had **no listening process** after Playwright exited.

## Implemented journeys

- Transparent-to-solid navigation, hero with reduced-motion-aware subtle parallax, source tagline and working collection/tasting CTAs.
- Story introduction, three featured wine cards, full seven-wine fictional cellar with search, region/style intersection, tasting notes, producer-story disclaimers, pairing details, vegetarian/allergen notes, and quantities 1–6.
- Five unique 50 ml pours in a custom flight: each sample costs half its illustrative glass price; decimal prices are retained. Five-selection limit, save confirmation, remove and reset. No order is placed.
- Pairing plans price one food board per glass when selected; no happy-hour discount is silently applied.
- Guided five-wine tasting with cheese at $75/person, 1–8 guests; private/corporate tasting inquiry, 8–24 guests, at the same illustrative rate.
- Table visit plan, 1–8 adults, no table fee. Dates from today through 90 days ahead; no Mondays; half-hour arrival windows reserve the final venue hour. Same-day past arrivals rejected.
- All three original event titles, original $65/$85/$45 rates, 8/12/20 illustrative capacities, fixed event dates/times in each form, local confirmations and reset. Event dates advance 7/14/21 days from the viewer's current local date; special events override ordinary venue-day scheduling.
- Six-scene gallery/lightbox with previous/next wrapping, native dialog semantics and explicit keyboard boundary containment/focus restoration.
- Three source-inspired **fictional** guest vignettes, not actual Google/Yelp reviews or endorsements. Five-second autoplay with pause/manual controls, inactive-tab pause, and no autoplay under reduced motion.
- Fictional visit diagram, source address/hours/placeholder phone, qualified happy-hour and parking concepts. No map provider or navigational claim.
- Native email/21+ newsletter form with local confirmation/reset. Footer wine/private-event journeys, gift-card/careers/press/social information dialogs — not dead external links.

## Mocks, adaptations, limitations

All wines, food, team, cellar stock, pricing, availability, venue, location, parking, guest stories, club and events are illustrative. There are no awards/certification claims, real producer affiliations, real alcohol sales, bookings, seat holds, payments, card inputs, email delivery, accounts, persistent storage, analytics, maps, social accounts, live APIs, or provider connections. The adult checkbox is a demo declaration, **not legally sufficient age verification**. Allergy copy is informational and cannot guarantee food safety.

The brief's real commercial labels are deliberately fictionalized: Château Margaux → Château Clairmont; Penfolds Bin 389 → Ember Ridge · Blend 389; Cloudy Bay Sauvignon Blanc → Tideline Sauvignon Blanc. Their vintage, region, flavor direction and glass-price inspiration remain. Four additional invented wines broaden the region/style/flight experience. The source's historical April event dates were replaced with rolling future demo dates, preserving titles, prices, times and seat counts. Original copy implying direct sourcing, 200+ real bottles, real sommeliers or published reviews is explicitly qualified.

Flight state exists only while its collection view is open; opening a detail view or closing the dialog clears that flight. Pairing/booking data exists only within the open view. Club confirmation lives in page memory until reset/reload; entered email is cleared immediately after confirmation. Names and emails are never sent or saved.

## Assets and typography

- **Photography substitutions:** no photographs were downloaded. `components\scene.tsx` contains original procedural SVG warehouse, tasting-room, counter, cheese-board, patio, pour and alcove scenes. `Bottle` in `components\wine-bar.tsx` draws original fictional label art. `public\vine-mark.svg` and the CSS neighborhood diagram are original project artwork. No third-party photo rights or real-venue representation are implied.
- Georgia/Times New Roman and Arial/Helvetica/system sans-serif replace requested Cormorant Garamond/Inter to avoid font downloads and external build dependencies. No font files are bundled or redistributed; rendering uses the user's installed fonts.
- Icons use installed `lucide-react` 1.61.0 (ISC, with some Feather-derived icons under MIT). The **complete supplied license is retained in `public\lucide-LICENSE.txt`**. No other third-party image/font assets are used.
- Generated screenshot artifacts are ignored; the browser tests recreate `render-desktop.png` and `render-mobile.png` inside this folder.

## Original source integrity

`018-wine-bar.md` was read in full and never modified. SHA-256 before and after implementation:

```text
56313A85FF00B75EE8BCF108F0C3A3B79C38AEE9CDF532F5776AA4B8C446B9C9
```

Verify with:

```powershell
Get-FileHash '.\018-wine-bar.md' -Algorithm SHA256
```

Only project 018 was implemented and validated here. No collection-completion claim, other-project writes, root manifest/lock changes, commits, deployment or provisioning.
