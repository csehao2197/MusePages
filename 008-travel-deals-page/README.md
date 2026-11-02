# FareFinder — project008

A source-specific, responsive local travel-deals demo. Application files live directly beside the supplied Markdown. Only project008 was implemented.

## Run

The existing ancestor workspace supplies the declared dependencies; no install or root manifest/lock change is required. Run these PowerShell commands:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\008-travel-deals-page'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack`, with two build workers configured in `next.config.ts`. `test` starts an isolated production server at `http://127.0.0.1:3108`, runs the desktop/mobile Playwright suite, and stops its owned server automatically. It **refuses an existing listener** rather than reusing it. Startup is limited to 45 seconds, tests to 210 seconds (Playwright global timeout: 180 seconds), with two test workers and no retries.

To explore manually, after building:

```powershell
npm start
```

Open `http://localhost:3108`; press Ctrl+C to stop this manually started server. `npm run dev` uses the same port for development. Do not run either while the test harness is using the port.

## Implemented journeys

- Navy/orange hero, illustrated world overlay, quick origin/destination/date/traveler search, simulated new-deal counter and trust information dialogs.
- Four source flash offers in a horizontal carousel, locally ticking demo countdowns, desktop auto-scroll (paused on hover/focus and disabled for reduced motion), and functional Book Now previews.
- All eight main source destinations, all three Portugal deals, and all three source recommendations. Two fictional car/tour offers make the remaining browse categories functional: 20 typed offers total, paginated six at a time.
- Combined type, region, per-person budget, date, origin and destination search; four sorts, dynamic results, reset and empty recovery. The unfiltered Best Deals view is an editorial ordering beginning with the brief's eight destination cards; filtered Best Deals prioritizes flash offers then percentage savings.
- Save/unsave with browser-local persistence and storage-error disclosure; four most recently viewed offers, deduplicated and persisted. Greece/Bali browsing changes recommendation picks using local rules.
- Native accessible deal dialog, focus wrapping/return and Escape dismissal; 1–8 travelers, per-person totals/savings, validated email and local claim confirmation. Price-alert handoff prefills the destination and focuses its input.
- Price-alert and newsletter native validation. Alert pending, success, and retryable mock error states; use an address ending in `@example.invalid` to simulate failure. No entered emails are stored.
- Six browse categories, Portugal discovery, functional footer filters and informational company/support previews, responsive navigation, mobile filter accordion and sticky deal/filter bar.

## Mocking and deliberate adaptations

There are **no payments, reservations, emails, accounts, provider integrations, external APIs, tracking, live prices or commercial guarantees**. Claims, support, cancellation, scarcity, counters, reviews, payment labels and promotional statistics are explicitly illustrative. Claim/alert/newsletter confirmations are local visit state, not transactions. Only saved/recent deal IDs persist in localStorage.

Prices are fictional USD **per person for the whole listed trip**; nights are already included, never multiplied again. Traveler totals equal `price × travelers`; total savings equal `(original − price) × travelers`. Hotels and the car-rental example use the same per-person package convention, explicitly disclosed rather than represented as live room/vehicle quotes. No taxes or real-world fees are modeled. Savings percentages are calculated and rounded from the supplied prices; this corrects inconsistent rounded percentages in the brief (for example London–Tokyo is 54% from $412/$890).

The stable fictional calendar uses November/December 2026 for “This Month”/“Next Month”; it does not follow the machine clock. Flexible means either fixture month. Budget boundaries are disjoint: `<300`, `300–<700`, `700–<1500`, `≥1500`. Origin limits flight/package offers only; nonflight offers do not require a departure airport. The 47/124/89/etc. marketing counts are labeled simulated and intentionally separate from the actual 20-offer result count.

Recently viewed is initially empty instead of inventing browsing history. Initial recommendation captions from the brief are labeled demo; actual Greece/Bali interaction replaces captions with locally derived ones. Company/support links provide honest demo information rather than fictitious operational services.

Original SVG illustrated postcards replace requested photography; they are stylized, not exact geographical depictions. System Arial/Helvetica and Trebuchet MS stacks replace remote Jakarta/Outfit/Inter fonts, keeping production builds network-independent. Payment names are plain text, not real acceptance claims or downloaded logos.

## Assets and licenses

`components/landscape.tsx`, `public/favicon.svg` and CSS artwork are original work created for this demo; no images or fonts were downloaded. `ASSET-LICENSE.txt` grants permission for the original artwork only. UI icons come from the installed `lucide-react` package; the ISC license and applicable Feather MIT notice are retained in `THIRD_PARTY_NOTICES.txt`. Runtime dependency licenses remain in the installed ancestor packages. No source Markdown ownership/license is asserted.

## Actual validation

Final validation on 2026-10-31 with the supplied Node/npm and Chromium installation:

- Strict TypeScript (`npm run typecheck`): **passed**.
- Next.js 16.4.3 production webpack build, two workers: **passed**, `/` statically prerendered.
- Production Playwright: **16/16 passed** (eight cases × desktop and mobile), final run 18.1 seconds.
- Covers source inventory/Portugal/car/tour discovery, combined search/filtering, all ranking sorts, empty recovery, coherent traveler arithmetic, invalid traveler/email/price/whitespace input, claims, modal Tab/Escape/focus return, persistent saves, four-item browsing history, recommendations, alert loading/error/retry, newsletter/trust/flash actions, reduced motion and responsive navigation.
- Overflow checked at desktop 1440px, mobile 390px and narrow mobile 320px. Render test observed no uncaught browser errors.
- Final desktop/mobile full-page and deal-viewport screenshots were generated and visually inspected: `test-results\desktop-full.png`, `mobile-full.png`, `desktop-deals.png`, `mobile-deals.png`. These are ignored local artifacts; no screenshot-baseline comparison is claimed.
- Separate occupied-port probe: **passed**, refused reuse without affecting the existing probe listener.
- Owned production server was stopped automatically; final independent check found **zero listeners on port 3108**.

Initial failures in focus wrapping and desktop carousel overflow were fixed before the final successful build/test run. No real travel-service or live-data validation is claimed.

## Preserved source

`008-travel-deals-page.md` was read in full and left byte-for-byte unchanged. Initial and final SHA-256:

```text
AA652A36B80C34A9146B8DD817A9C922C9F2747DFDB108155997A9E99C0B15EA
```

Verify:

```powershell
Get-FileHash '.\008-travel-deals-page.md' -Algorithm SHA256
```
