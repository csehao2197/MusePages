# Aurelian — project 015

A standalone Next.js local fine-dining demo, implemented directly beside the unchanged source brief. No shared demo template, services, external assets or generated child project.

## Run and validate

From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\015-fine-dining-restaurant'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

Uses the already-installed ancestor `node_modules`; no install or root lockfile changes needed. Build uses webpack and two Next workers. `npm run dev` starts port 3115; `npm run start` serves the built production app at `http://127.0.0.1:3115`. Stop manual servers with Ctrl+C before testing.

Playwright starts its own production server, refuses reuse of an existing server, uses two workers, 30-second test timeouts, a 60-second startup deadline and a four-minute overall deadline, then automatically stops the server. Tests require the provided installed Chromium. Screenshots are written only to this project's ignored `test-results` directory.

## Implemented experience

- Editorial black/cream/gold art direction, generous whitespace, sharp-edged controls, cinematic full-height hero with optional slow motion, scroll-aware navigation, mobile dialog menu and sticky reservation link.
- Seven-course October 2026 seasonal menu preserving the brief's course identities and ingredients; vegetarian substitutions, course/allergen detail dialogs, no pairing / adult-only wine / alcohol-free botanical pairing. Per-person and party subtotals update coherently.
- Chef/philosophy story, six-scene original gallery with previous/next lightbox, cellar features, four bottle detail previews and a wine-list dialog.
- Local reservation journey: date, 1–8 guests, seating, occasion, closed-day and unavailable Sunday-late fixtures, adult self-attestation, confirmation and reset. Selection changes invalidate previous previews. Dates cannot be past; no inventory is held.
- Private dining inquiry: required name/email/date, 8–24 whole-number guests, event type, optional notes, $150-per-person starting estimate, local confirmation and clean retry.
- Fictional recognition section, location schematic/hours, directions explanation, social previews, privacy/terms dialogs and newsletter validation/reset.
- Native forms and dialogs, visible focus, tab wrapping, Escape dismissal and original-trigger focus restoration (including gallery navigation), reduced-motion handling and mobile stacking.

## Safety, mocks and adaptations

All people, business details, menus, sourcing, dietary notes, availability, prices, reviews and distinctions are illustrative. No network-backed bookings, emails, accounts, payments, card fields, geolocation, maps, analytics or external providers. State lives only in memory and is cleared by reload; form values are not transmitted. Use synthetic contact data.

Alcohol selections are adults 21+ only; self-attestation is a demonstration control, **not legal age verification**. The pre-dessert's Champagne granita is explicitly identified as alcoholic with an alcohol-free substitution. Vegetarian is not vegan; allergen notes cannot guarantee safety or cross-contact prevention.

The brief's real producers and publication/award names were replaced with invented producers and prominently fictional press labels to avoid false endorsements. Chef credentials are not asserted as real. The 8+ referral ambiguity is resolved by allowing 8 guests in either journey and directing 9+ to private dining. Sunday 8:30 PM is unavailable in the fixture to respect the stated 9:30 PM close. The menu is an October 2026 design fixture, not a live seasonal promise. Private event dates are requests, not checked dining service availability; drinks/customization/tax/gratuity are excluded from starting estimates.

## Assets and typography

All visual art is original SVG/CSS made for this demo: plated dish, candlelit room/table, fictional chef, wine pour, gathered ingredients, bottle drawings, location schematic and favicon. `components/Artwork.tsx` supplies the original scene compositions; no third-party photography or logos were downloaded. Visible notices honestly identify illustrations as photography substitutions. No real person or venue is depicted. Original project-owned artwork; no third-party asset licensing required.

Georgia / Times New Roman and Arial / Helvetica are system-font substitutions for the brief's Cormorant Garamond and Montserrat. No font files are bundled or downloaded, and no external-font build dependency exists; fonts are used under the host platform's installed licenses.

## Observed validation

- Strict TypeScript: passed (`npm run typecheck`).
- Production: passed (`npm run build`, Next 16.4.3, webpack, two workers; `/` statically generated).
- Focused Playwright: **14 passed**, seven journeys on desktop Chromium and mobile Chromium. Covers tasting/pairing/details, adult-only selection and totals, required/past/closed/unavailable dates and recovery, inquiry capacity/contact validation/reset, gallery and wine details, newsletter and informational controls, focus return/tab wrapping, mobile navigation, reduced motion, narrow viewport overflow and local-only requests.
- Desktop and mobile hero/full-page screenshots visually inspected. No external photography/font fetches. Production test server cleanup and unchanged source hash checked.

No live restaurant integration or real photography is included; accessibility checks are focused functional tests, not a full assistive-technology audit.

Original `015-fine-dining-restaurant.md` SHA-256 (unchanged):

```text
F7B4D9EE7F236C579A9202C37875290B3DCF48BDD032166AC28CF3E750CB7CEE
```
