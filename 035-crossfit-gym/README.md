# 035 — Iron Tide gym concept

A source-specific Next.js demo implemented directly beside `035-crossfit-gym.md`. Original red/slate gym illustration, condensed athletic typography, a whiteboard, a real fixture-driven weekly schedule and Pacific Beach community bulletin aesthetic. No shared template or other sample application is imported.

## Run and validate

Requires the supplied ancestor `node_modules` (Node 26.13 / npm 11.20). Do not reinstall or generate a root lockfile.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\035-crossfit-gym'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack` with two workers. `test` starts the **production** application at `http://127.0.0.1:3135`, refuses reuse of an existing server, and automatically shuts its server down. Two Chromium projects, two workers, 30-second per-test timeout, 60-second startup bound, zero retries. Build before running tests.

For manual development: `npm run dev`. For a manual production preview: `npm run build` then `npm run start`. Stop manual previews with Ctrl+C. Keep telemetry disabled as above.

## Observed validation

Validated October 31, 2026:

- Strict TypeScript: passed (`npm run typecheck`).
- Production webpack build: passed, static `/` generated, two page-data workers.
- Playwright: **18/18 passed** (nine focused cases × desktop/mobile); final run 20.5 seconds.
- Inspected actual desktop (1440×1000) and mobile (390×664 CSS pixels) hero and full-page screenshots. Schedule is a mobile card list, coaches horizontally scroll, Unlimited leads mobile pricing, mobile navigation and the sticky intro control work.
- No page errors in the landing/WOD test; inquiry test observed no external requests, POSTs or browser storage.
- Port 3135 checked after the suite: no listening server remained.

Screenshots are generated inside `test-results` by the final render test. Tests cover:

1. Required source sections, fictional notices and reversible WOD scaling disclosure.
2. Day/type fixtures, weekend differences, empty schedule and filter recovery.
3. Keyboard class details, date/coach/capacity/price, dialog focus cycling and focus return.
4. Intro native required/name/email/date validation, unavailable dates, recovery, confirmation and reset.
5. Capacity errors and corrected requests; full-class waitlist confirmation.
6. Monthly/annual math, annual upfront total/savings, drop-in quantity and native numeric bounds.
7. Program-to-intro, coach details, journal notes, native FAQs, directions and member-portal disclosure.
8. Inquiry validation/reset/confirmation/restart, no sends or storage.
9. Mobile navigation/Escape/sticky CTA, reduced motion, section overflow and desktop/mobile renders.

Initial validation exposed two changing-label test locators, a native-dialog Tab boundary, and floating-point currency formatting. These were corrected; the entire suite was rebuilt and rerun successfully.

## Scope, fixtures and behavior

Application lives in `app/`, `components/`, and `public/` in this folder. `components/data.ts` supplies typed fictional programs, coaches, memberships and per-day class fixtures. Schedule week is explicitly **November 2–8, 2026**, Pacific time; Thursday has the eight source rows, Saturday has three different sessions and Sunday has two Open Gym sessions. Capacity is static and labeled fictional, not artificially reduced after a preview.

All dialogs use native `<dialog>` with Escape, a close control, focus cycling and trigger focus restoration. Forms use native required/email/date/number validation plus a capacity check. Intro and membership inquiries start with a Foundations session; drop-ins exclude Open Gym. Annual membership costs are rounded to cents: Unlimited $1,887/year ($157.25 monthly equivalent, $333 savings); Competitor $2,295/year ($191.25 equivalent, $405 savings). Drop-ins remain $25/class; up to four visitors are supported. Membership prices are per member, while visitor quantity applies to the intro visit.

Previews are only component state. Closing/resetting booking dialogs clears entries. Inquiry confirmation unmounts its form; “Write another inquiry” starts empty. Refresh clears everything. There are no accounts, APIs, payments, card fields, emails, enrollment, real seat holds, mapping services, social feeds, tracking or persistent browser storage. Footer resources without real providers open honest informational disclosures rather than dead links.

## Safety and source adaptations

- Iron Tide is **fictional**, with no actual CrossFit LLC affiliation or endorsement. Source credentials, business history, contact/address, hours, offers, reviews, member stories and availability are fictional/unverified. The source affiliate logo and “#1 rated” claim are deliberately omitted.
- The dated March 12, 2026 WOD is labeled an archived fictional editorial concept. Source rounds, timed race results, specified weights, high-intensity movements and time cap are replaced by non-prescriptive skill topics and optional coach-discussed concepts. No exercise prescription, nutrition advice, medical claim, all-out effort or health outcome is provided.
- Weight-loss, transformation and competitive-result claims/before-and-after imagery are replaced by clearly fictional belonging-focused stories. No guaranteed results or collected health/body/medical details.
- Photography, hero video, portraits and social images are replaced with original SVG/CSS illustration and graphic community tiles. No real people or events are implied. The contact map is a labeled non-navigational illustration; do not travel based on it.
- Barlow Condensed and Inter are replaced by system Impact/Arial Narrow/Franklin Gothic/Arial/Helvetica fallbacks. No external font fetch or build-time font dependency.
- No actual text-message button, affiliate/provider signup, legal waiver or live social link is represented as functional. Buttons disclose mocks or lead to real local preview journeys.

## Artwork and licenses

- `public/iron-tide.svg`, `components/art.tsx` and CSS map/community artwork: original artwork created for this demo; no external photographs or downloaded assets. These locally authored assets may be used with this demo; any applicable repository license controls distribution.
- UI icons: `lucide-react` 1.61.0, ISC license; library icons are not copied photography or CrossFit affiliate branding.
- Fonts: installed system fonts only, subject to the user's operating-system/font licenses; no font files are distributed.
- Next.js 16.4.3 and React/React DOM 19.3.1: MIT. Playwright test 1.64.1: Apache-2.0. Only used dependencies are declared locally and resolved from the supplied ancestor modules.
- “CrossFit” is a third-party trademark used only to reflect the fictional source concept; no logo, qualification verification or endorsement is claimed.

## Original source integrity

`035-crossfit-gym.md` was read in full and not edited. Its unchanged SHA-256:

```text
E881394520A2102BF83EBC9C509A99B3F6732FEBC0D080EC678F511DE1266D9D
```

Only project035 was implemented and validated. No other project, root manifest/lock, progress report, source manifest, commit, deployment or provisioning was changed. This is not a collection-completion claim.
