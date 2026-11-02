# 033 — Mosaic Studio

A standalone, people-and-culture-led Next.js demo implemented directly beside `033-creative-agency-team.md`. Nothing in another sample is required. Uses the supplied ancestor `node_modules`; no dependency installation, ancestor manifest change, or lockfile change was needed.

## Run (PowerShell)

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\033-creative-agency-team'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack` with two build workers. `test` starts the production build on **http://127.0.0.1:3133**, refuses to reuse an existing server, and automatically stops its server. Build before testing. Startup is bounded at 60 seconds; each test is bounded at 30 seconds; one test worker, zero retries.

For manual production browsing:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
```

Stop manual browsing with Ctrl+C. `npm run dev` optionally serves development on port 3133. Do not run a manual server while running tests.

## Implemented source journeys

- Warm cream hero, original team illustration, three floating statistics, four leadership cards, safe social-profile explanations.
- A typed fictional roster of 32: Design 10, Engineering 12, Strategy 5, Operations 5. Initially eight crew profiles; expand/collapse, department filters, case-insensitive name/role/hobby search, combined filtering, result announcements, empty state and reset. Leadership also appears in the expanded roster.
- Every person opens a biography and personality detail. Social buttons explain the fictional profile rather than linking to somebody’s real account.
- Three studio values; a four-scene culture collage with a keyboard-accessible gallery, next/previous navigation and wraparound; horizontal mobile collage.
- Six benefits, fictional team testimonial, six concept statistics, and categorized tool chips.
- Four detailed fictional roles, including the explicitly archival Summer 2026 internship, plus open application.
- Application and project inquiry flows use invented aliases, example emails, optional concept URLs and a short fictional note. Project inquiries add an imagined kickoff date. Native required/email/URL/date/minimum-note-length validation; local confirmation, fresh form, reset, simulated error and recovery.
- Footer work CTA opens three clearly labeled concept explorations, not fabricated client case studies.
- Semantic sections, skip link, visible keyboard focus, native dialogs with explicit Tab wrapping, Escape dismissal, opener focus restoration, mobile navigation, reduced-motion handling and responsive layouts.

## Boundaries and adaptations

**All staff, biographies, experience, culture, benefits, jobs, availability, tenure, projects, awards, statistics, client ratings and testimonials are fictional. There is no actual hiring or real-employer endorsement.** Notices appear throughout the UI, not just here.

The source is a concept brief, not evidence that an agency or its claims exist. Real-employer biography references, award credentials and employment-history anecdotes were replaced with invented, lower-risk personality descriptions. The source’s warm orange/purple/cream direction and people-first journeys are retained; headings use a system-sans/editorial-serif treatment instead of downloaded fonts.

Forms are entirely in-memory React interactions: no backend, email delivery, local storage, cookies, file uploads, real accounts, identity documents, health details, employment-history fields, payments or provider credentials. Use only invented content; closing or successfully confirming clears the form. The error switch deliberately simulates a local failure and preserves inputs for retry. A confirmation does **not** make an application or request contact. No real portfolio fetching occurs.

## Artwork, fonts and provenance

- All portraits, team scenes and culture scenes are original inline SVG artwork authored for this demo in `components\art.tsx`; colors, facial details, glasses, hair and clothing vary across the fictional roster. They replace **all** requested headshots/candid photography. No real-person photos, image downloads, third-party illustrations or AI image service were used.
- Original demo SVG artwork is provided under CC0-1.0. No external image attribution is required.
- Interface icons come from installed `lucide-react` (ISC license). Tool names are text, not downloaded logos; no affiliation is implied.
- Fonts use locally available Arial/Helvetica and Georgia with generic fallbacks. No webfont files, font CDN, external font dependency, or font downloads at build time.
- No shared sample template or external service is used.

## Observed validation

Final validation on 2026-10-31:

- `npm run typecheck`: passed, TypeScript strict mode enabled.
- `npm run build`: passed using Next.js 16.4.3, webpack and two workers; `/` statically prerendered.
- `npm test`: **16 passed (23.7s)** — eight focused flows each on desktop Chromium (1440×1000) and Chromium iPhone 13 emulation (390×664).
- Tests cover all department counts, expansion, combined search and empty recovery; bios/social notices; keyboard dialog loop/Escape/focus return; four-scene gallery; every role/open application; native form validation; error/retry/reset/confirmation/reopening; no POST submission; concept work; mobile navigation; reduced motion; gallery icon sizing; tablet leadership layout; page overflow at 320, 390, 768, 1024 and 1440 widths.
- Desktop/mobile hero and full-page screenshots were generated under `test-results\studio-responsive-navigati-e9d82--overflow-and-final-renders-{desktop,mobile}\` and visually inspected. Inspection caught and corrected a desktop menu visibility issue and oversized gallery arrow icons before the final passing run.
- No listener remained on port 3133 after automatic test-server cleanup.

Browser evidence is Chromium-only; mobile is emulation, not a physical device or WebKit/Safari test. This is not a full accessibility audit, a real hiring system, or evidence for any business claim. No collection-wide completion is asserted.

## Original source integrity

`033-creative-agency-team.md` was read in full and not modified.

Original and final SHA-256:

```text
5404891AB7D910D496C682A924B289E5E2296CF85BE97B080AFF5A8CBD5756ED
```

Verify:

```powershell
Get-FileHash .\033-creative-agency-team.md -Algorithm SHA256
```
