# 030 — Ava Chen, UX/UI designer portfolio

Standalone Next.js App Router application directly beside `030-ux-ui-designer-portfolio.md`. Package: `sample-030`. No nested application, shared demo template, or remote service.

## Run and validate

Use the collection's **already installed ancestor `node_modules`**. No install or lockfile changes are needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\030-ux-ui-designer-portfolio'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm run test
```

For manual production preview after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
# Open http://127.0.0.1:3130 ; Ctrl+C when finished.
```

Development: `npm run dev`. Production build uses webpack and two Next.js build workers. Browser tests use one worker, no retries, 35-second test timeouts, a 60-second server startup limit, and a production `webServer` on **127.0.0.1:3130**. Existing server reuse is explicitly disabled; a busy port must fail rather than target another app. Playwright owns startup and automatic teardown. Tests require the preinstalled Chromium browser.

## Implemented source journeys

- Sticky blurred navigation, mobile right-side drawer, skip link, anchor navigation, indigo/grid hero, original overlapping phone/tablet interfaces, local downloadable résumé.
- Four alternating project cards: Notion Calendar, Stripe analytics, Figma plugin manager, and fictional HealthTrack. Typed, individually authored challenges, research hypotheses, constraints, decisions, iterations, outcome qualifications, and future evaluation plans.
- Combined category/search filtering, result count, empty state and reset.
- Native modal case studies with Overview / Research / Design / Prototype sections, before/after flow diagrams, and previous/next case navigation.
- Calendar prototype: named workspaces, required event title/date/time, past-date restriction, conflict at 11:00, preserved draft, confirmation, and reset.
- Analytics prototype: shared period selection, coherent fictional revenue composition, no-data recovery, simulated refresh failure and dismissal. No money is processed.
- Plugin prototype: category filtering, local reversible install state, empty category recovery and toolkit reset. No actual plugins are installed.
- Patient portal prototype: required future date/time, local booking confirmation and restart. No medical advice or health data.
- Interactive four-stage process, skills, illustrated about section, four explicitly fictional collaborator quotes, contact/service inquiry, social concept disclosures, and dark footer.
- Inquiry: required name/email/service/message/acknowledgment, numeric USD budget ($500–$1,000,000 in $100 increments), start-date validation, whitespace checks, review/edit/discard, optional simulated send failure, preserved draft/retry, local confirmation and clean reset.

All data stays in React memory. There is no API, database, local storage, email delivery, payment, account, analytics beacon, or provider integration. Prototype state resets on leaving the prototype/case; inquiry state clears on reset or reload. No credentials or real personal/health information are needed.

## Concept and source adaptations

**Ava Chen is fictional.** Experience, location, interests, availability, skill profile, collaborators and quotes are authored concept content. No employment at, client relationship with, endorsement by, or actual affiliation with Notion, Stripe or Figma is asserted. HealthTrack is fictional. The brief's real-employer biography and named real-brand endorsements are replaced with clear independent-concept disclosures.

**No participant research was conducted.** Case studies use authored scenarios and speculative hypotheses. Percentages, ratings, user counts and scale assumptions are clearly marked fictional targets, not measured improvements, actual adoption, App Store reviews, or processed volume. Healthcare AA is a goal, not a certification or comprehensive WCAG-conformance claim. No awards are asserted.

The source's availability/24-hour-response promise is replaced with a fictional availability notice and local-only inquiry. Social/email links open honest concept-profile notices with a working inquiry route instead of sending visitors to invented accounts or a possibly real inbox. The résumé is an actual downloadable plain-text concept profile, not a real employment record or fabricated PDF.

Original interface compositions replace copyrighted screenshots; an original SVG illustration replaces the requested photographic headshot. System Arial/Helvetica sans-serif replaces DM Sans/Inter so the build and runtime have **no font-download dependency**. Hero entrance and drawer animations respect reduced motion; the mockups use a static layered composition rather than scroll-linked parallax.

## Accessibility and responsive scope

Semantic landmarks/headings, visible labels, native form validation, visible focus rings, named dialogs, initial close-button focus, Tab/Shift+Tab containment, Escape close, focus return, scroll locking, live status/error notices, and keyboard-operable controls. Main interactive targets are at least 44px tall. Layouts stack and skill chips wrap on mobile; reduced motion disables animations and smooth scrolling.

Tested with Chromium desktop (1440×1000) and Chromium iPhone 13 emulation (390×664 CSS viewport), plus page-overflow checks at 320/768/1024 widths. Mobile emulation is not a real iPhone/WebKit test. This is not a full accessibility audit or a cross-browser certification.

## Observed validation

- Strict TypeScript: **passed** (`npm run typecheck`).
- Optimized production build: **passed** (`npm run build`, webpack; two workers; static `/`).
- Focused browser suite: **24 passed** (12 journeys × desktop/mobile, zero retries).
- Coverage: responsive portfolio and original screens; category/search/empty recovery; all case narratives/research disclosures/navigation; before/after; four prototypes; conflicts, date validation, confirmation/reset; analytics errors; plugin install/undo; process controls; local résumé download; native required/email/budget/date validity; contact review/edit/simulated failure/retry/reset; keyboard modal containment/focus return; mobile navigation; reduced motion; no external inquiry requests.
- Desktop/mobile full-page and case-dialog captures were visually inspected. The tests save fresh captures beneath ignored `test-results` directories.
- Production server automatically stopped after the run; no listener on port 3130 remained at final verification.

The first validation run exposed a Next.js production transform collision with a state variable named `process`, fixed by renaming it; subsequent runs also corrected explicit select labels and keyboard focus wrapping. These fixes are included in the passing production build.

## Assets and notices

- All device frames, application interface layouts, charts, process/flow diagrams, portrait SVG, labels and fictional copy were authored for this demo. No portfolio, real-client work, headshot, stock photography, or externally downloaded image was copied.
- Lucide React icons: installed `lucide-react` package, **ISC license**, Copyright Lucide Contributors; its distributed license remains in the ancestor dependency installation. No brand-logo asset is used.
- System fonts are rendered from the viewer's operating system under their system licenses; no font files are copied, bundled or redistributed. DM Sans and Inter are not bundled.
- Product and tool names are used only to describe independent concepts and fictional skills. Rights to third-party names/trademarks remain with their respective owners; no endorsement is implied.
- The résumé text in `public` is locally authored and explicitly fictional.

## Original source integrity

The original Markdown was read in full and was not edited.

```text
030-ux-ui-designer-portfolio.md
SHA-256: 5A37152CEB9DF84CD349CD5E0FC1DC15624E5F71E33C731D4BFF2686C23A639F
```

Verify:

```powershell
Get-FileHash '.\030-ux-ui-designer-portfolio.md' -Algorithm SHA256
```

Only project030 application/configuration/documentation/test files were created. No collection manifest, ancestor lockfile, other project, deployment, or commit is part of this implementation.
