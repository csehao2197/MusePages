# Project004 · TrekTribe Adventures

A tailored Next.js group-travel demo implemented directly beside the original `004-group-travel-booking.md`. No nested application folder, shared-family scaffold, or changes to other numbered projects.

## Run locally

Dependencies resolve from the already-installed ancestor workspace. No dependency installation or root manifest/lockfile update is needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\004-group-travel-booking'
npm.cmd run dev
```

Development URL: `http://localhost:3104`.

Exact validation commands:

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
```

`build` uses `next build --webpack`; `next.config.ts` limits build workers to two.

To view the production build manually:

```powershell
npm.cmd run start
```

Stop a manually started server with Ctrl+C. Do not leave it running before browser tests.

## Implemented experience

- Sticky mountain-and-people navigation, illustrated hiking hero, dual trip CTAs, explicitly fictional social proof, and four-step animated timeline.
- Live 6–50-person calculator with range keyboard support and bounded steppers; all eight brief destinations; 5/7/10/custom-day selections; three accommodation tiers.
- Six individually illustrated packages with the original names, durations, routes, starting prices, group limits, tags, and fictional ratings/review counts. Filterable categories, a helpful corporate empty state, detailed sample itineraries, inclusions/exclusions, and package-specific inquiry flows.
- Collaborative planning laptop presentation with three days, reversible activity votes, local pretend chat with empty-message errors, confirmed/pending traveler simulation, reminder previews, and an optional clipboard page-link action.
- Eight-member $12,000 split-payment preview; individual selection; three $500 installments or full payment; remaining balances when switching plans; payment progress; simulated cancellations and the 30-day refund boundary.
- Corporate retreat benefits and custom 10–50-traveler quote flow; fictional company wordmarks; three-visible desktop/one-visible mobile story carousel with buttons, arrow keys, and touch swipe.
- Keyboard-operable FAQ, destination/date/group/email inquiry form, local quote confirmation, explanatory legal/support/social dialogs, full footer, and mobile sticky quote bar.
- Sora/Inter typography, burnt-orange/navy/green palette, alternating warm sections, rounded travel cards, responsive horizontal mobile packages, vertical mobile timeline, visible focus, native modal semantics with explicit focus wrapping/restoration, field-associated errors, success focus, and reduced-motion styles.

## Estimate model

All amounts are fictional USD estimates, not availability or financial commitments.

Individual cost = destination daily rate × trip days × accommodation factor, rounded to the nearest dollar. Daily rates: Bali $200, Costa Rica $240, Iceland $350, Japan $390, Morocco $215, Portugal $210, Thailand $175, Peru $230. Accommodation factors: Budget 0.75, Mid-Range 1, Premium 1.45.

Group discount: 12% for 6–11 travelers, 20% for 12–19, 22% for 20–29, and 25% for 30–50. Discounted per-person prices are rounded before multiplying by group size; savings compare against the undiscounted group total. The initial Bali/12-person/7-day/Mid-Range selection is $1,120 per person, $13,440 total, $3,360 savings.

Custom duration accepts whole numbers from 3–30 days. Invalid values hide the estimate and disable its quote action. Departure must be tomorrow or later; dates use local calendar days. Quote summaries calculate the inclusive final day. Package inquiries use their own curated starting rates rather than the calculator's different estimate model, and constrain the group to that package's limits. Unlisted destinations can form a custom inquiry but never receive a fabricated automatic price.

Payment installments are placed today and at one-third/two-thirds of the selected time to departure, always before departure. Refund eligibility includes exactly 30 days; below 30 days the preview explains the fictional policy without changing the balance.

## Mock boundaries and deliberate adaptations

**Everything is fictional and client-local.** No booking, availability, collaboration backend, payment provider, email, account, insurance, notification, analytics, provisioning, or deployment integration exists. No payment card, passport, account, or other sensitive details are requested. Use example emails/messages only.

State exists only in page memory and resets on reload. Quote email input is not sent or persisted. Sharing copies only the public page URL: it does not share votes, chats, group details, or quote information. Planner votes are shared between the inline preview and its open dialog in this browser only; other preview state is local to each planner instance.

Prices exclude flights, insurance, and optional extras. Testimonials, ratings, customer counts, corporate logos, certification badges, Stripe/encryption badges, refund policies, and the phone number are visibly fictional examples, not real endorsements, audited claims, security assurances, or working contact channels.

The original photography requests are represented by original destination-specific SVG travel artwork and illustrated/initial avatars, avoiding unlicensed photos. The fictional 40+ package/80+ destination catalog is acknowledged but not fabricated: this demo implements the six source packages and eight calculator destinations. Social controls open local explanatory dialogs rather than nonexistent real profiles.

## Assets and licenses

- Seven original SVG scenes in `public\art`: CC0 1.0 Universal, with dedication in `public\art\LICENSE.txt`. No stock-photo downloads.
- Locally bundled variable fonts downloaded from the Google Fonts open-source repository:
  - Sora: `https://github.com/google/fonts/tree/main/ofl/sora`
  - Inter: `https://github.com/google/fonts/tree/main/ofl/inter`
- Both fonts use SIL Open Font License 1.1. Original copyright/license notices are preserved verbatim in `public\fonts\Sora-OFL.txt` and `public\fonts\Inter-OFL.txt`.
- Fonts are served through `next/font/local`; neither build nor browser requires a network font service.
- Lucide React icons use the ISC license retained in the installed dependency.

## Actual validation · 2026-10-31

- `npm.cmd run typecheck`: **passed**, strict TypeScript.
- `npm.cmd run build`: **passed**, production webpack build; static home route; two workers.
- `npm.cmd test`: **22 passed**, 11 focused cases each on desktop Chromium (1440×1000) and mobile Chromium (iPhone 13 emulation, 390×664), final run 21.7 seconds.
- Coverage includes price/savings boundaries, keyboard range changes, tier/destination/custom-duration calculation, package filters and limits, real itinerary selection, corporate empty state, missing/past-date/email validation, unknown destinations, local quote confirmation, focus restoration/wrapping, votes, chat, members, sharing/reminders, installment/full-payment switching, partial balances, refund boundary, reload reset, FAQ, carousel keys/swipe, reduced motion, asset loading, client errors, overflow, and absence of external requests/storage.
- Rendered desktop/mobile hero, calculator, planning presentation, and Iceland trip-dialog screenshots were generated in `test-results` and visually inspected. Test artifacts are ignored by git.
- Initial checks caught a desktop focus-wrap issue and three test-selector/event-construction issues; all were corrected before the successful final run.
- Playwright starts the production server on `http://localhost:3104`, refuses server reuse, uses two test workers, bounded startup/action/test timeouts, and automatically tears down the server.
- Post-test verification found **zero port 3104 listeners** and **no remaining task-owned server/test processes**.

## Original source preservation

The source was read in full and never edited. Its before/after SHA-256 checksums match:

```text
004-group-travel-booking.md
27A8D5F7263798423F8058C2BA91DAB3EA2558982BFB19DD989B8BCABB476F19
```

Verify with:

```powershell
Get-FileHash '.\004-group-travel-booking.md' -Algorithm SHA256
```

This completes project004 only, not the overall 100-project collection.
