# 023 · Ridgeline at Cedar Creek

Standalone, individually tailored Next.js community demo for **Crestwood Homes**. App code, original art, fixtures, tests and configuration live directly beside the original Markdown; there is no nested generated app or shared application template.

## Run

In PowerShell, from this directory (ancestor workspace dependencies are already installed; **do not reinstall or change the root lockfile**):

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm run test
```

Production build uses `next build --webpack`, with **two build workers**. Tests start the production build at `http://127.0.0.1:3123`, refuse an existing server (`reuseExistingServer: false`), use two Chromium workers, bounded 40-second startup, 35-second per-test and 180-second overall timeouts, zero retries, and automatic server shutdown.

To explore manually:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
# Open http://127.0.0.1:3123; Ctrl+C when finished.
```

For development only: `npm run dev`. Build before running production tests. No deployment, provisioning, accounts or credentials.

## Source-specific implementation

- Crestwood roof-mark identity, cobalt actions, slate, muted landscape greens and gold accents; editorial serif headings, elevated golden-hour community art, amenity collage and four original exterior concepts.
- Oakmont, Ashford, Belmont and Crestview typed fixtures with the brief's exact bedroom, bath, area, story and starting-price values. Intersecting bedroom/area/price/story filters, live results and empty/reset recovery.
- Level-switching schematic floor drawings, room dimensions and correctly multiplied room areas; included/customization details and contextual pricing inquiry.
- All **86 fictional lots**, with **14 available / 23 under contract / 46 sold / 3 model homes**. Interactive SVG with keyboard access, status labels/tooltips, zoom, scroll, status/phase/compatible-plan filters, and available-first mobile list with progressive loading. Sold/contract lots are not selectable. Models open a guided concept tour.
- Lot details include acres, square-foot conversion (`acres × 43,560`, rounded), orientation, compatible plans and premiums. Total is base price + lot premium + $25,000 premium interiors + optional $18,000 porch. Options are fictional and exclude taxes/fees/financing.
- Two model tours with four navigable original scene illustrations, six-image lightbox gallery, specifications preview, standard/premium mobile tabs, neighborhood context and four selectable timeline chapters.
- Historical/expired source incentives are explicitly **not active offers**. Educational pre-qualification preview replaces the lender CTA. Native-validated calculator illustrates amortized principal and interest (including zero interest and 100% down); no financial advice or qualification.
- Local brochure preview/download, tour/pricing/advisor request form, selected plans and lot context, required names/email/phone, native date bounds, Thu–Mon validation, time choice, review/edit, simulated error/retry, confirmation/reset. No actual appointment, inquiry delivery, reservations or payments.
- Native modal dialog with initial focus, Tab/Shift+Tab containment, Escape/backdrop dismissal, body scroll lock and focus return. Semantic forms and fieldsets, skip link, live results/errors, mobile navigation Escape, footer accordions, 44px native controls, reduced motion and contained overflow.

## Mocks, adaptations and limits

All fixture availability, pricing, phase/progress/completion dates, incentives, permits, certifications, energy/sustainability performance, builder credentials, reviews, school zoning, travel times, location and market claims are fictional or unverified. The original source's contractor #12345 is retained **as an unverified placeholder**, not a license claim; Equal Housing Opportunity and rendering/pricing notices are retained. No sales, deposits, guarantees, provider endorsements, financial advice, real appointments, email, live maps, embedded providers, APIs, accounts or card/credential collection.

Phase 1 contains 38 sold lots; Phase 2 contains the remaining 48 (8 sold, 14 available, 23 contract, 3 models). Phase 3 is an unverified future concept **outside** the 86-lot drawing; its filter deliberately has no released inventory. The source's summer 2026 pool opening and Q4 2026 future phase are qualified, never treated as verified delivery dates. Exact 1,842–3,218 plan areas replace the source's rounded 1,800–3,200 summary.

Floor and site plans are **schematic, not to scale, and not construction/survey documents**. Room rectangles are symbolic; listed room areas are a subset of gross home area, excluding circulation, walls, baths and storage. Compatibility is an illustrative fixture rule, not a buildability decision.

Tour/video and photography are replaced with disclosed original SVG scenes; directions are an original schematic, not navigation. The requested PDF is adapted to accessible, downloadable **HTML** (`public\community-brochure.html`) with browser print/save-as-PDF. Newsletter, social, careers, warranty and other corporate links open honest local information previews rather than dead links or real integrations. No external services are connected.

Inquiry information exists only in React memory and is cleared by reset/refresh. No local/session storage or transmission. Use invented information when testing. Confirmation is an on-page acknowledgment, not a booking.

## Assets and licenses

All community, exterior, amenity, interior, floor/site/location diagrams and CSS are original code created for this demo; no downloaded or third-party photography, renderings or maps. SVG artwork is in `components\art.tsx`, floor/site/location diagrams in `components\community.tsx`. No photography licenses are required.

Georgia/Times New Roman and Arial/Helvetica are OS font-stack substitutions for the brief's Playfair Display and Inter; no font files are bundled or downloaded and no external-font build dependency exists. Lucide icons (`lucide-react`) use the ISC license; installed package copyright/license notices remain in the ancestor dependencies. React is MIT, Next.js is MIT, TypeScript is Apache-2.0, and Playwright is Apache-2.0; no package notices were altered. Source product names are preserved only as unverified concept references, without endorsement.

## Observed validation

- Strict TypeScript (`npm run typecheck`): passed.
- Production webpack build (`npm run build`): passed; static `/` generated, two workers.
- Focused Playwright (`npm run test`): **24 passed, 0 failed, 0 skipped, 0 retries** — 12 journeys each at 1440px desktop and 390px mobile Chromium; an additional 320px overflow assertion.
- Coverage includes filtering/empty recovery, floor levels/room arithmetic, keyboard/modal focus return, all sites and status counts, lot/price/acre arithmetic, plan compatibility handoff, gallery/tours, brochure download, specifications/timeline, amortization/zero-rate/input bounds, native name/email/phone/date validation, closed-day recovery, inquiry editing/error/confirmation/reset, reload privacy, navigation/tabs/accordions, reduced motion, no external requests/runtime page errors and overflow.
- Desktop/mobile hero, plans and homesite renders were inspected; generated evidence lives in ignored `test-results\`. Final verification found no listener on port 3123.

Initial validation identified overly broad native label names, native modal Tab boundary behavior and a test's collision with Next's route-announcer alert; these were corrected. A subsequent run observed one missed first interaction; ten isolated repetitions passed, and tests now explicitly wait for the page's React-ready marker before interactions. The complete suite was then rerun successfully with zero retries. Testing covers Chromium only, not other engines, assistive-technology certification or real services. There is deliberately no actual PDF generation, 360° tour, geospatial map or live inventory.

## Original preservation

`023-new-construction-development.md` was read in full and left byte-for-byte unchanged.

SHA-256 (before and after):

```text
747B7816E6FFA9F2F6AF63451D9DF65303D40CCF1D4F8286C76BE4BA91C734E5
```

Only project023 was implemented. No collection-level completion claim.
