# 024 — Ridgewood Terrace open house

An individually tailored Next.js local demo, directly beside the unchanged source Markdown. Navy, gold and warm linen, architectural desert illustrations, a property-led editorial layout and fictional Pinnacle Realty branding.

## Run and validate

Use the already-installed ancestor workspace dependencies. No install or root lockfile changes are required. From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\024-open-house-landing-page'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm run test
```

`build` uses `next build --webpack` with two build workers. `test` starts the **production build** on `http://127.0.0.1:3124`, refuses existing server reuse, uses two workers, a 60-second startup bound and 30-second per-test bound, and shuts the server down automatically. Chromium must be available. For manual viewing, run `npm run start` after building; stop that server with Ctrl+C before running tests. `npm run dev` is optional and uses the same port.

Observed validation on October 31, 2026: strict TypeScript passed; Next.js 16.4.3 production webpack build passed with two workers; **22/22 Playwright tests passed** (11 focused journeys each on desktop Chromium and mobile Chromium with iPhone 13 emulation). No skipped tests or retries. Desktop/mobile hero, full-page, event, lightbox and private-viewing screenshots were inspected. Tests cover:

- Property identity, all eight amenities, twelve scenes, archive notices and fictional claims.
- Gallery wraparound, arrow keys, native dialog focus containment, Escape and opener focus return.
- RSVP required fields, email, telephone, integer party sizes 1–6, full slots, capacity mismatch, simulated failure, draft retention, local confirmation, calendar and reset.
- Private-viewing date window, native date/guest validation, unavailable time recovery and local-only request confirmation.
- Inquiry whitespace validation, simulated failure, retained draft, confirmation and empty reset.
- Arizona-time `.ics` downloads for the four-hour event and individual 30-minute tours; local PDF spec-sheet response.
- Neighborhood selection, directions preview, related-listing/inquiry flow, broker contact and educational resource panels.
- Amortization math, zero interest, term/down-payment changes, invalid/empty inputs and estimate reset.
- Mobile navigation, horizontal gallery controls, scrollable concept floor plan, floating RSVP, reduced motion, page overflow and runtime errors.

## Implemented scope and deliberate adaptations

- Typed fixtures reproduce the source address, asking price, dimensions, amenities, specifications and three related properties. They are **fictional and unverified**, not a real listing or sale/investment advice.
- The original **April 4, 2026 event is expired and visibly archival**. The UI deliberately replays it at a fixed **November 14, 2026, 11 AM–3 PM Arizona MST (UTC−7)** demo date. This is not a real upcoming event. Calendar files use explicit UTC times, tentative status and fictional-event warnings. Private requests use November 15–December 15, 2026; November 15 at 10 AM is intentionally unavailable.
- Eight 30-minute open-house slots have explicit fictional capacities; two are full. Party size is limited to six. Confirmations never imply actual booking. Failure controls simulate unavailable local services without a network request.
- RSVP, inquiry and private-viewing drafts exist only in React memory; reset/reload clears them. Nothing is emailed, persisted remotely, authenticated or booked.
- Photography, agent headshot and virtual-tour concepts are replaced with **original inline SVG architectural studies and a stylized fictional portrait**. Twelve labeled gallery scenes have a keyboard-operable native-dialog lightbox; mobile uses a horizontal carousel with slide controls. They are not property photographs or accurate representations.
- The room-labeled floor plan is original, simplified and not to scale; mobile can scroll it. The downloadable PDF is generated locally using standard PDF primitives and Helvetica; it repeats fictional/unverified notices.
- The neighborhood map is an original schematic with invented pin positions, not a provider map or route. Desktop pins and the nearby-place list select contextual descriptions; mobile presents static pointer-inactive pins and the selectable distances list. Directions are an honest local arrival-information preview, not geographic routing.
- Mortgage payments are calculated from principal, rate, term, taxes, HOA and insurance rather than copying the brief’s inaccurate total. Default output is **$14,488/month**, rounded, with a labeled component breakdown. Zero-interest loans are handled. This is educational arithmetic, not a quote; PMI, closing costs and other charges are excluded.
- Broker certifications, years of experience, sales, awards and reviews are expressly source-only/unverified. Telephone, email, socials, school ratings, pre-approval and related listings open local explanatory or inquiry panels, not calls, email clients, accounts or external services. Desert Financial CU, appliance and smart-home references do not imply partnerships or endorsements.
- There are no live APIs, maps, providers, payment inputs, credentials, external font requests or genuine financing consultations.

## Assets, fonts and notices

All architectural scenes, portrait, schematic, floor plan, favicon and CSS artwork were authored for this demo; no downloaded photographs, maps or third-party image assets were used. Source photography/map/tour requirements are disclosed as illustration adaptations in the UI. The source Markdown remains intact with its original notices.

Headings use the system Georgia/Times serif stack and body text uses Arial/Helvetica/system sans-serif instead of remotely downloaded Playfair Display and Inter. No font files are distributed; fonts remain supplied/licensed by the operating system. Lucide React icons are used under the ISC license; the installed dependency retains its license notices. The PDF uses the standard, viewer-provided Helvetica base font and does not embed a font asset.

## Source integrity

Original file: `024-open-house-landing-page.md` (9,440 bytes).

SHA-256 before and after implementation:

```text
DB62FC7CAB1589EAEAF95AEF29D071AF28AB238313B146BADA9DAC6A0EEC501D
```

Only this project folder was changed. No root manifest/lock, other sample, original brief, deployment or commit was created or altered. Port 3124 had no remaining owned listener after validation.
