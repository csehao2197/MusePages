# Rhythm & Flow — project 036

Individually tailored Next.js local demo, implemented directly beside `036-dance-studio.md`. No shared application template, nested project, live provider or backend.

## Run and validate

Use the supplied ancestor `node_modules`; do not install dependencies or change the workspace lockfile. Run in PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\036-dance-studio'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

For manual production browsing, after the build:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
```

Open `http://127.0.0.1:3136`. Stop the foreground server with Ctrl+C. Development: `npm run dev` (same port; do not run concurrently).

Build uses `next build --webpack` with two workers. Playwright starts an isolated production server on port 3136, refuses existing server reuse, uses one test worker and no retries, and automatically stops its server. Startup timeout: 60 seconds; per-test timeout: 30 seconds.

## Observed validation

- Strict TypeScript: passed (`npm run typecheck`).
- Production webpack build: passed; `/` is statically prerendered.
- Final browser run: **24 passed in 27.6 seconds** (12 cases each on desktop Chromium 1440×1000 and mobile Chromium with iPhone 13 dimensions).
- Tested five-style navigation, full-week/day and style/level/age filters, empty recovery, teacher/class details, full sessions/events, trial style changes and experience choices, local class/trial/ticket/pack confirmations, reset, required inputs, invalid email and fictional-email error recovery, exact date/time, capacity bounds and computed prices.
- Tested keyboard activation, modal boundary focus cycling and return (including details-to-booking), mobile navigation/sticky booking, synthetic touch swipe events, 320px overflow, reduced motion, gallery/video previews and local privacy/social journeys.
- Captured and visually inspected final desktop/mobile full-page renders (`test-results/desktop-final.png`, `test-results/mobile-final.png`). Corrected mobile headline overflow and gallery play-icon sizing during validation. No browser page errors or external application requests were observed in the render test.
- Port 3136 had no listening server after validation.
- Chromium only: no claims of Safari/Firefox coverage, real-device gesture testing, screen-reader certification or a comprehensive accessibility audit.

## Source coverage and adaptations

Rose `#E11D48`, dark slate `#1E1E2E`, rose-50/cool-slate alternating sections, bold condensed logotype, wave accents, sunlit dance-room hero, five distinct illustrated style cards, responsive snap carousel, weekly schedule, four instructor spotlights, split trial section, eight studio moments, illustrative stories, three pricing plans, fictional community events and four-column footer. Navigation changes from transparent to white on scroll. Mobile uses two-by-two stats, single-column teachers, two-column gallery, unlimited pricing first and sticky free-trial booking.

Typed fixtures define Hip-Hop, Contemporary, Ballet, Salsa & Latin and Breaking, their levels, instructors, studios, duration, prices and capacity. Schedule uses the explicitly labeled fixed demo week **November 2–8, 2026**, five sessions per day and the visitor’s weekday for initial highlighting. All broad adult age categories share the adult schedule; under-18 filtering explains the adult-only scope. Friday includes an advanced Hip-Hop fixture; Wednesday’s Breaking fixture is full. Event fixtures add showcase/social/jam details and ticket selection to the source’s community journey.

Drop-in is $22, unlimited is an illustrative $149/month with a $0 trial entry, and a ten-class pack is $180 with source three-month validity. Monthly CTA reserves only a demo trial, not a membership. Ticket/class totals reflect selected quantities; at most four adult places or tickets per selection and never more than fixture capacity. Trial choices list only non-full sessions. The source discount/private-lesson terms are disclosed but not processed.

Photography, instructor portraits, filmed video and “week 1/week 12” footage are intentionally replaced with original SVG/CSS art and an optional gently animated illustration, clearly described in the UI. Practice diary is not a progress guarantee. No real people’s photographs, branded affiliations or external fonts are downloaded.

The source’s student counts, fourteen-instructor claim, Google rating, address/hours, awards, training and performance affiliations are explicitly fictional or unverified; only four fictional instructor profiles are implemented. Source testimonials are adapted into fictional non-medical stories, removing recovery and guaranteed-result implications. Social/contact/careers/press/blog/partnership/legal CTAs open informative local previews rather than dead links or live destinations.

## Local mocks and safety

Forms use invented aliases, `@example.test` emails and broad adult age categories only. No child/guardian enrollment is needed for the source’s adult audience. Do not enter real personal information. No body, health, medical or children’s details, credentials, card fields, accounts, providers, payments, maps, real booking/enrollment, email or external API calls exist.

Confirmations are held only in React page memory. Reset/reload clears them; no data is saved or sent. Capacity is not decremented because this is a selection preview, not inventory management. UI does not provide dance exercise instructions, medical suitability advice, guaranteed transformation, real urgency or endorsements. Source claims are not independently verified.

## Assets, fonts and notices

- `components/DanceArt.tsx` and CSS compositions are original project-created SVG/CSS illustrations: no third-party photography/video assets or downloads.
- Headings/body use system Arial/Helvetica, logotype uses available Impact/Arial Narrow with fallbacks, and expressive accents use system Georgia. Montserrat/Inter from the source are intentionally substituted; no font files are redistributed and no external-font build dependency exists.
- Lucide React 1.61.0 supplies utility icons (the camera icon is a generic social-preview glyph, not an Instagram logo). ISC and applicable Feather MIT attribution/permission notices are retained in `public/icons-LICENSE.txt`, from the installed package license.

## Preserved source

The original Markdown was read in full and not edited. Before/after SHA-256:

```text
F9FAF783AD01BDA1759A3A37F8D03D47758764223EA6C537F9CBF608A6B00825
```

Verify:

```powershell
Get-FileHash .\036-dance-studio.md -Algorithm SHA256
Get-NetTCPConnection -LocalPort 3136 -State Listen -ErrorAction SilentlyContinue
```

All implementation writes were confined to project 036. No root manifests/locks, other demos, source Markdown, commits or deployments were changed.
