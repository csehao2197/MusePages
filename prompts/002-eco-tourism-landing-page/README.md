# 002 — Verdant Journeys

A tailored Next.js 16 / React 19 local sustainable-travel demo, implemented **beside the original brief**, not in a nested project. Only project 002 is addressed.

## Implemented experience

- Misty illustrated rainforest hero, dual anchor CTAs, horizontally scrolling mobile trust strip, scroll-linked leaf accents and animated in-view impact counters.
- All six specified trips with the original names, days, prices, tags, highlights and fictional ratings/review counts. Responsive 3-column / single-column grid, card hover/focus treatment, destination/activity/impact filters, result counts and empty-state recovery.
- “View All 24 Trips” expands to a genuinely selectable 24-item mock catalog: the six featured packages plus 18 named variations across those destinations. Each opens itinerary details and a trip-specific inquiry.
- Four-step dotted sustainability timeline, four illustrated eco-lodges with nightly prices and badges, horizontal snap scrolling, arrows, selection dots and local stay explanations.
- Carbon calculator: native city autocomplete suggestions (six supported cities), six destinations, bounded 1–8 traveler stepper, validation, route-specific calculations, invalid-city feedback, stale-result clearing and an expandable methodology.
- Three fictional traveler testimonials, six-second rotation, manual dots/arrows, touch swipe, pause/play, pause while hovered/focused and no default autoplay under reduced motion.
- Clearly qualified certification/partner references with a standards dialog; newsletter email validation and local confirmation; complete destination/company/support/legal footer with working navigation or informational dialogs and demonstration social controls.
- Trip inquiry validates name, email, future/today date, group size and required demo acknowledgment. Confirmation summarizes trip, date, travelers and illustrative package total. Native modal semantics, explicit Tab wrapping, Escape dismissal, confirmation focus and focus restoration.
- Mobile navigation, 2×2 stats, stacked calculator/timeline/footer, sticky bottom exploration CTA, keyboard skip link, visible focus styles, labeled controls, live status regions, image alternatives and reduced-motion handling. Small-text green buttons use a darker accessible green (`#13833e`); the requested `#16A34A`, forest and sage colors remain the visual palette.

## Mock boundaries

**Not a real travel operator.** All trips, prices, availability, reviews, traveler stories, impact statistics, subscriber counts, eco-lodge claims and certifications are fictional. Partner names are text references, not verified affiliations or official partner logos. Explanations are visible in the banner, trust strip, sections and standards dialog.

Inquiries and newsletter entries exist only in client memory until reload. There is no reservation, payment, email, signup service, account, API, storage database, actual offset purchase or tree planting. No live external integration runs in the browser.

Carbon estimates are **simulations, not audited facts**:

```
kg = round((one-way route km × 2 × 0.115 + 100) × travelers)
trees equivalent = ceil(kg / 22)
base offset value = kg × $0.02
simulated 200% coverage = kg × 2
```

Route distances and emission/absorption assumptions are illustrative. The 100 kg allowance is per traveler for the whole ground/stay component. Values exclude cabin class, radiative forcing and verified lifecycle accounting; annual tree absorption is not an immediate emissions offset. Example: London → Costa Rica, one traveler = **2,101 kg**, **96 trees equivalent**, **$42** displayed base value, **4,202 kg** simulated coverage. UI currency values round to whole USD.

## Imagery and fonts

- All landscape/wildlife/lodge scenes, rainforest canopy, coastline and avatar silhouettes are original SVG artwork created for this demo. They deliberately substitute labeled illustrations for the brief’s documentary photos/headshots; no photographs or unlicensed stock downloads are included.
- `public/canopy.svg`, `public/coastline.svg` and `components/Scene.tsx` are local and need no third-party requests. Reference marks and social outlines are local schematic graphics. UI icons use the declared `lucide-react` dependency.
- Fraunces and DM Sans variable TrueType fonts are locally bundled, with original SIL Open Font License files in `public/fonts/`. Sources:
  - https://github.com/google/fonts/tree/main/ofl/fraunces
  - https://github.com/google/fonts/tree/main/ofl/dmsans
- Georgia / Arial / Helvetica / generic families provide fallbacks. No external-font build or runtime dependency; italic headings use browser-synthesized italics.

## Commands

Prerequisites: the already-installed ancestor workspace dependencies and Chromium. Do **not** reinstall or modify the collection-root manifests/locks. This package is named `sample-002` and declares the requested root-compatible dependency versions.

Run from this folder in PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\002-eco-tourism-landing-page'
npm run dev
```

Production and validation:

```powershell
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1
```

Production starts on **http://127.0.0.1:3102**. Stop a manually started server with Ctrl+C before testing.

```powershell
npm test
```

`build` runs `next build --webpack`, with two Next build workers. Playwright starts its own production server at port 3102, refuses to reuse an existing server, bounds execution with two workers and timeouts, and automatically tears its server down. The tests require a completed production build; they do not build implicitly. No root-level script needs to be run.

## Actual validation — 2026-10-31

- `npm run build`: **passed**, optimized static production route `/`, two build workers.
- `npm run typecheck`: **passed**, strict `tsc --noEmit`.
- `npm test`: **18 passed** — nine focused cases each on 1440×1000 desktop Chromium and Pixel 7 mobile Chromium. Includes a 320 px narrow-layout overflow check.
- Covered: original brief checksum; all principal sections; responsive grids and zero document overflow; no runtime external asset requests/page errors on render; combined filtering/empty recovery/24-trip selection; calculator arithmetic, upper/lower bounds and invalid routes; trip details, native form validation, local confirmation total, Tab containment and focus restoration; lodge dots/details; newsletter validation/privacy/reset; navigation/claim disclosures; reduced motion; six-second normal-motion story rotation and pause.
- Desktop/mobile hero, trips, calculator and full-page screenshots are generated under ignored `test-results/` for render inspection. Desktop full-page and mobile hero/trip/calculator renders were inspected; the adjacent mobile calculator heading words were corrected before final validation.
- Production test server cleanup verified: no listener remains at port 3102. No task-owned helper is left running.

Original brief preserved byte-for-byte. SHA-256 before and after:

```
67A517BA2B61D60BDDE0A99E5C6D1F38713026AC3D6B2DAFBB30E9576F963DC2
```

## File map and intentional differences

`app/` contains the page, root layout and responsive design; `components/` contains the typed itinerary/calculation data, original scene illustrations and client interactions; `public/` contains local artwork and licensed fonts. Package/Next/PostCSS/TypeScript configs, Playwright config and `tests/experience.spec.ts` live directly here. `.next/`, browser artifacts and TypeScript caches are local ignored outputs.

Intentional mock/demo differences from the literal brief: original illustrations instead of photography, schematic partner references instead of official logos, synthetic rather than audited claims, and local inquiry rather than booking/payment/email. The four-step impact report is an explanation of the imagined travel model, not a generated or audited post-travel report. No known failing implemented interaction remains. No other numbered project, root manifest/lock, collection tracking/report file, commit, push or deployment is part of this implementation. This is not completion of the overall 100-project effort.
