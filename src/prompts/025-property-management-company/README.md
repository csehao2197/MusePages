# 025 — Keystone Property Group

A standalone, source-specific Next.js property management demo. Application files live directly beside `025-property-management-company.md`; there is no nested generated project or shared app template.

## Run locally

Use the already installed ancestor workspace dependencies. No installation, ancestor manifest change, or lockfile change is needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\025-property-management-company'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

For manual production review, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
```

Open `http://127.0.0.1:3125`. Stop a manually started server with Ctrl+C. `npm run dev` also uses port 3125; do not run it alongside the production tests.

`npm run build` invokes `next build --webpack` with two build workers. `npm test` invokes Playwright against an isolated production `webServer`: port 3125, existing-server reuse **disabled**, one worker, zero retries, 60-second startup limit, 30-second per-test limit, and 180-second global limit. Playwright starts and stops its own server. Tests require the supplied Chromium installation.

## Implemented source journeys

- Sticky Keystone navigation, mobile menu and visible tenant-portal icon, owner-blue/resident-green audience paths, and an audience/scroll-sensitive mobile action bar.
- Illustrated neighborhood hero and trust strip; owner/resident cards; six expandable management services with pricing notes.
- Six typed fictional portfolio records retaining the source areas, rents, property categories, and occupancy statuses. Carousel controls, neighborhood/type/budget/availability filters, count feedback, empty-state reset, and accessible detail dialogs. The eight-unit building is **$12,400 total**, not per-unit rent. Occupied samples do not offer inquiries.
- Available-home inquiry preview with native name/email/date/acknowledgment validation, clear, confirmation, and restart. No real tour or application.
- Three management plans, interactive comparison, selected-plan propagation to the calculator and consultation preview, and an honest custom-quote state for Enterprise.
- Live annual-income calculation with unit/rent/vacancy bounds, invalid-input recovery, reset, fee deductions, explicit assumptions, and negative as well as positive differences.
- Owner statement and resident ledger previews, audience switching, and a local maintenance form with required issue details, future contact date, contact window, acknowledgment, clear, confirmation, and restart.
- Qualified differentiators and fictional testimonials; six native FAQ accordions; owner resource checklist; rental-analysis consultation form with native address/email/formatted-phone validation and reset/confirmation.
- Useful footer navigation and informational dialogs for insurance, team/careers/referrals, guarantees, directions, privacy, terms, fair housing, and accessibility. No fake live contact links.
- Semantic controls, visible keyboard focus, skip link, focus-looping native dialogs, Escape close and trigger-focus restoration, mobile layouts, horizontal carousel containment, and reduced-motion behavior.

## Calculator assumptions and corrected math

The source's suggested results do not reconcile with its stated fee and vacancy inputs. This implementation uses:

1. Full-occupancy annual rent = units × rent per unit × 12.
2. Current collected rent = annual rent × (1 − current vacancy).
3. Managed scenario = annual rent × (1 − min(current vacancy, 5%)).
4. Management fee = scenario collected rent × selected rate (10% Single Property or 8% Portfolio).
5. After-fee income = scenario collected rent − fee.
6. Annual difference = after-fee income − current collected rent.

At the default one unit, $1,800/month, 10% vacancy, and Portfolio plan: gross $21,600; current collection $19,440; managed scenario $20,520; fee $1,641.60; after-fee income $18,878.40; difference **−$561.60/year** (−$46.80/month). Displayed dollar totals round individually; calculations retain precision. No unsupported positive return is substituted.

The scenario never worsens an already-lower vacancy assumption. Property category does not change the fee schedule. Leasing fees are shown separately in pricing: at $1,800, Single Property is $180/month management plus $900 per new lease; Portfolio is $144/month plus $720 per new lease. Calculator results exclude leasing, repairs, taxes, insurance, and other expenses, and are not forecasts or investment advice.

## Local-only scope and deliberate adaptations

Keystone is fictional. All records, availability, ratings, tenure, testimonials, office details, fees, and service areas are samples. Original unverified occupancy/ROI/portfolio-size claims are replaced with transparent demo facts; licensing, BBB/NARPM affiliation, Google reviews, guarantees, legal retainers, coverage, returns, response times, and fill times are not asserted as genuine.

No backend, storage persistence, authentication, payment collection, application, credit/background screening, maintenance dispatch, email, appointment booking, accounts, provider, live API, or map is connected. Forms only change browser-memory UI and discard submitted values; use fictional details. No identity numbers, bank/card credentials, sensitive documents, or housing eligibility criteria are requested. There are no protected-characteristic filters, discriminatory recommendations, or legal/investment/eligibility advice.

Listing details are focus-restoring dialogs instead of separate listing routes. Source blog/team/referral/insurance/directions links provide honest relevant local content instead of fabricated live services. A static trust strip replaces automatic scrolling, and the portfolio uses controlled native horizontal scrolling. These choices keep content usable with reduced motion.

## Artwork, fonts, and licenses

- All neighborhood/home/duplex/townhome/apartment/condo artwork is original inline SVG authored in `components\Architecture.tsx`; grid textures, logo framing, and layout decoration are CSS. These explicitly replace requested photography, not actual property photos. No images were downloaded and no third-party photo license is needed.
- Maps are replaced with a plain-language fictional-office notice. No map tiles, directions provider, or trademark trust logos are used.
- System Arial/Helvetica/sans-serif replaces DM Sans/Inter. Fonts come from the user's operating system, are not bundled or redistributed, and require no external-font build dependency or network request.
- Icons come from the declared `lucide-react` dependency. Its ISC and applicable Feather MIT notices are retained in `public\licenses\lucide.txt`, from the installed package's `LICENSE`.

## Observed validation

Final validation on the supplied Node 26.13 / npm 11.20 environment:

- `npm run typecheck`: passed, strict TypeScript.
- `npm run build`: passed; Next.js 16.4.3 production webpack build, two workers; static `/` and framework not-found page.
- `npm test`: **16 passed** (8 journey tests × desktop/mobile), final run 23.0 seconds; no retries.
- Tests cover audience journeys; services/FAQ expansion; fee calculations and bounds up to 50 units; zero vacancy; invalid/empty calculator recovery; plan propagation/custom quotes; filter empty-state recovery; whole-building rent; occupied and available detail behavior; inquiry validation/date/reset; owner/resident ledger math; maintenance confirmation/reset; consultation phone/required validation; modal keyboard looping/Escape/focus return; mobile navigation, reduced motion, and overflow (including 320px width).
- Render tests reported no browser console errors, page errors, or external service requests. This is focused Chromium validation, not a full accessibility audit or cross-browser certification.
- Desktop 1440×1000 and mobile 390×664 CSS-pixel renders were inspected, including full-page, hero, and calculator screenshots. Screenshots remain in ignored `test-results` beneath the render-test directories; mobile device-scale-factor images have higher physical-pixel dimensions.
- The test-owned port 3125 listener was checked after cleanup and no listener remained.

## Original source integrity

The original Markdown was read fully and preserved unchanged.

SHA-256:

```text
73150822D417E1818C026A1C0C5FCAADC28C09F8B9A4D35EFAD163A2BEB08DB0
```

Verify from this directory:

```powershell
Get-FileHash '.\025-property-management-company.md' -Algorithm SHA256
Get-NetTCPConnection -LocalPort 3125 -State Listen -ErrorAction SilentlyContinue
```

Only project 025 was implemented. No collection-wide completion is claimed.
