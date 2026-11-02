# Harvest & Hearth — project014

An individually tailored Next.js farm-to-table restaurant demo, implemented directly beside the original `014-farm-to-table-restaurant.md`. Only this project is implemented; this is not a collection-completion report.

## Run locally

Use PowerShell and the already installed ancestor workspace dependencies. No installation, root manifest, or root lockfile change is needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\014-farm-to-table-restaurant'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm start
```

Open `http://localhost:3114`. Stop the interactive server with Ctrl+C. Development alternative: `npm run dev`.

For the automatically managed production-browser tests, stop any manual server first:

```powershell
npm run build
npm test
```

The test server binds `127.0.0.1:3114`, refuses an existing server, allows 90 seconds for startup, uses two Chromium workers, caps each test at 40 seconds and the run at 180 seconds, and is killed automatically by Playwright. Tests do not install browsers. `next build --webpack` uses two build workers. Runtime dependencies are Next 16.4.3, React/React DOM 19.3.1, and Lucide React 1.61.0; strict TypeScript and Playwright are declared in this project's package.

## Source interpretation and local mocks

- All twelve requested homepage sections, the Harvest & Hearth brand and farmhouse palette, wheat/paper motifs, eleven specified spring dishes/descriptions/prices, three named farm profiles, Elara's story, the six-scene gallery, private dining, hours, newsletter, and footer are included.
- Spring 2026 is an explicitly illustrative archived snapshot, not today's actual menu. The tomato/peach combinations follow the brief rather than a verified Oregon harvest calendar. A separate three-dish summer snapshot is an original fictional extension.
- Desktop course tabs have arrow/Home/End keyboard navigation. Mobile has a course dropdown. Dietary filters support a recoverable empty state. Full-menu view includes all courses; dish dialogs disclose illustrative farm/allergen information.
- Farm dialogs explain distinct imagined practices. Sourcing percentages/distances, “organic,” grass-fed/free-range, credentials, reviews/platform attributions, location, parking, hours, prices, and dietary labels are prominently qualified as fictional or illustrative. None assert verification, certification, safety, endorsement, or real service.
- Table previews validate native required fields/email/phone/date, Monday closure, service-specific times, and parties of 1–12. Date changes clear the time. Sunday offers public brunch; Tuesday–Saturday offers the brief's 5:00–9:30 PM half-hour sittings. The deliberately full 7:00 PM sitting demonstrates recovery to another time.
- April 18, 2026 is preserved as an **archived farm-dinner replay**, not a forthcoming event. Eight illustrative seats are available per preview; a party of nine fails with a recovery message. Totals are display-only at $125 per guest; no payment is requested.
- Private inquiries accommodate 1–24 guests Tuesday–Sunday evenings, separate from Sunday's public brunch. Date, evening slot, contact details, and occasion are validated. All flows show clearly local confirmations and reset to a fresh form.
- Six original illustrations have a native-dialog lightbox with wrapping arrows and keyboard controls; mobile gallery is horizontally swipeable. Dialogs trap Tab, close with Escape, restore focus, and lock background scrolling.
- Guest stories rotate every six seconds, pause on hover/focus, have manual dots and an explicit pause control, and do not auto-advance under reduced motion. Newsletter validates complete email addresses, confirms locally, and supports retry. Social/contact controls explain their disconnected status rather than linking to fabricated profiles.
- Mobile navigation supports Escape and closes on selection. A fixed mobile reservation CTA, responsive stacked sections/forms, visible focus styles, skip link, reduced-motion styling, and narrow-screen overflow checks are included.
- Data is typed in `components/data.ts`. All state is in-memory React state, cleared on reload/reset. No API, provider, email, account, order, live map, reservation, payment, analytics, or credential integration exists. Use invented contact details. Confirmation does not hold seats or imply allergen accommodation.

## Artwork and font provenance

No photography or external assets were downloaded. The requested photos are intentionally replaced by original SVG illustrations: a plated dish on timber, farm rows, grazing cows, pasture, chef at the pass, dining room, patio, produce basket, and wine table. Wheat/brand artwork, linen/paper treatment, and the non-navigational valley map are original SVG/CSS. The illustrations are not photographs of a real chef, venue, meal, or farm.

Original artwork terms are retained in `public/ARTWORK-LICENSE.txt` (MIT, limited to original art). Utility icons use installed Lucide React; its ISC and Feather-derived MIT notices are retained verbatim in `public/THIRD-PARTY-NOTICES.txt`. No font files are redistributed. Georgia/Times New Roman and Trebuchet MS/Arial replace Playfair Display/Lato using licensed local OS fonts; there is no external-font request or build dependency.

## Validation

Observed on October 31, 2026, using Node 26.13 / npm 11.20 and installed Chromium:

- `npm run typecheck`: passed, strict TypeScript, no diagnostics.
- `npm run build`: passed, Next 16.4.3 webpack production build; `/` statically generated with two workers.
- `npm test -- --reporter=json`: **24/24 passed**, 12 focused scenarios in each of desktop and mobile Chromium; 41.5 seconds, two workers, no retries or skipped tests. Standard `npm test` runs the same suite with the list reporter.
- Covered source courses/full menu/summer/filter-empty recovery, specific farm and dish dialogs, required/past-date/phone/guest validation, Monday closure, Sunday brunch/time tampering, full-sitting recovery, table reset, farm-dinner bounds/capacity/total/reset, private capacity/day/time/occasion/reset, keyboard lightbox wrapping/focus restoration, newsletter error/retry, disconnected contact/social controls, responsive navigation, gallery scrolling, 320px document overflow, six-second review rotation/pause, and reduced motion.
- Final desktop (1440×1000 CSS pixels) and mobile (390×844 CSS pixels) hero and full-page screenshots were opened and visually inspected. Their screenshot test observed no browser JavaScript errors or external network requests. Desktop has the farmhouse split hero, three farm cards, split chef/events, and masonry artwork; mobile stacks sections with a swipe gallery and fixed reservation CTA.
- After Playwright completed, port **3114 had no listener**. The original source hash below was verified unchanged.

Screenshot artifacts remain inside `test-results` (git-ignored); they are not source photos. Earlier test-selector and dialog focus-wrap failures were corrected and the entire final suite was rerun successfully. Manual screen-reader testing and Firefox/WebKit coverage were not performed. All service behavior remains intentionally mocked; no real booking, dietary safety, sourcing claim, or third-party integration has been validated.

## Original source integrity

The original Markdown was read in full and has not been edited. Original and final SHA-256:

```text
F587802FE3DC525008C88A84D8E14C7C31DA03C0D4E10CDFB68CA39C48187062
```

No shared template package, other sample, root dependency manifest/lockfile, collection report, deployment, or commit is part of this work.
