# 027 — Mara Vale / Thoughtful by design

A standalone Next.js graphic-design portfolio beside its unmodified source Markdown. Mara Vale, the studio, location, organizations, projects, and biography are **fictional demo concepts**. There are no real client endorsements, awards, results, bookings, or availability claims.

## Run from this directory

Uses the already-installed ancestor `node_modules`; do not install dependencies or modify the collection manifest/lockfile.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\027-graphic-designer-portfolio'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`build` is `next build --webpack`, with two build workers. `test` runs the **production build**, not the dev server; build first. Playwright starts an isolated `127.0.0.1:3127` server, refuses existing-server reuse, uses two test workers, has bounded startup/test/global timeouts, and automatically shuts down its server. Chromium must already be installed.

For manual use, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm start
# Open http://127.0.0.1:3127; stop with Ctrl+C.
```

For development only: `npm run dev`. Do not run a manual server during `npm test`.

## Implemented source scope

- Original paper/persimmon editorial art direction, expressive system-serif display paired with readable sans-serif, distinct visual identities for six concepts.
- Ordered six-project grid, all five source disciplines, keyboard-operable pressed-state filters, announced counts, title search, empty selection, and reset.
- Six statically generated `/work/[slug]` pages: client/industry/year/role/collaborators, audience and constraints, challenge, direction, design system, rejected routes, production considerations, honest outcomes, contextual inquiry, and cyclic next-project links.
- Eighteen original vector artifacts: six lead designs, six application/system boards (palette, type, application copy, grid), and six reconstructed concept-process sheets with three direction sketches each. No copied portfolios.
- Native modal gallery: next/previous, arrow keys, wraparound, Escape, backdrop close, explicit Tab loop, scroll lock, and focus returned to the opening button.
- About and original CSS studio illustration, four scoped services, service-prefilled inquiry, four-stage process with approval/revision/handoff expectations, two explicit testimonial/evidence placeholders, and a real downloadable **text capabilities document**.
- Inquiry: required name/email/type/budget/date/summary/consent, optional company/URL/referral, native email/URL/date/minimum-text validation, “Not sure yet” budget, loading, local confirmation, reset and focus movement, deliberate demo failure and preserved-field retry.
- Semantic landmarks, skip link, mobile menu/Escape/focus return, visible focus, labeled artwork and controls, reserved vector dimensions, predictable reading order, reduced motion, responsive layouts.
- Unique home/case/inquiry metadata, canonical example URLs, original SVG sharing image, explicitly fictional Person JSON-LD, sitemap, robots, custom missing-project recovery and render-error boundary.

## Mocks and deliberate adaptations

All inquiries run in browser memory with a short local delay. No POST, email, persistence, accounts, provider, payment, credentials, analytics, or external API exists. “Demo testing options” exposes a one-attempt failure; retry clears it. Refreshing discards the brief. The mailto is an explicitly reserved `.example` address, not a monitored inbox.

The source is a bracketed brief with no supplied designer or assets. This implementation supplies an original fictional designer and six concepts rather than implying real client facts. Typography and vector studies replace photography and a real studio portrait; the illustration is disclosed as imagined. Gallery process sheets are reconstructed concept explorations, not real client feedback. Packaging is not manufacturing-ready; digital artwork is not a functioning archive. The capabilities download is `.txt`, not an invented résumé or PDF deck. Fixed prices are not published; budget ranges are inquiry inputs only.

SVGs are inline, resolution-independent, and have stable viewBox/aspect-ratio sizing. They make no image-network requests, so lazy-loading remote photographs or raster `next/image` optimization is unnecessary. There is no external-font build dependency. A `.example` canonical is intentional. Robots and metadata discourage indexing the demo; SVG social previews are not supported by every sharing provider.

## Validation observed

On the supplied Node 26.13 / npm 11.20 environment:

- Strict `tsc --noEmit`: passed.
- Next.js 16.4.3 production webpack build: passed; two build workers; all six case studies generated.
- Playwright: **16/16 passed**, eight focused journeys each on Chromium desktop (1440×1000) and mobile iPhone-13 emulation (390×664).
- Coverage: every category and case page, keyboard filtering, search-empty/reset, canonical metadata, next-project and 404 recovery; native gallery focus/keyboard loop/return; service and contextual prefills; required/email/URL/past-date/short-summary/budget/consent validation; loading/error/retry/confirmation/reset; no submission POST; mobile navigation; download content/name; sitemap/robots; reduced-motion behavior; no horizontal overflow on home/case/inquiry; no captured page errors in the render journey.
- Desktop/mobile homepage and case-study screenshots are captured in ignored `test-results` directories and visually inspected. This is Chromium emulation, not real iOS/Safari testing or a formal WCAG audit.
- No listener remained on port 3127 after the production tests.

## Content, structure and assets

`lib\data.ts` contains typed projects, service scopes, and testimonial placeholders. `components` holds ProjectCard/ProjectFilter, Artwork, CaseStudyHeader/ImageSequence, ServicesGrid/Testimonial, InquiryForm, Header and section components. `app` owns routes, metadata and styles. `public` holds the genuine download and original sharing SVG.

Original SVG/CSS portfolio artwork, process drawings, studio illustration, and sharing art were authored for this demo and are offered under **CC0-1.0**. No photographs, licensed stock substitutions, portfolio downloads, or third-party designer marks are used. Georgia/Times and Arial/Helvetica are installed-system font requests with generic fallbacks; font files are neither bundled nor redistributed. Lucide icons come from the declared `lucide-react` dependency under its ISC license (with inherited Feather MIT notices); retain dependency license notices. The decorative ® is explicitly not a trademark-registration claim.

## Pre-launch owner checklist

- [ ] Replace the fictional designer name, wordmark, ® device, biography, location, timezone, and availability with approved facts.
- [ ] Supply and approve each actual client name, industry, year, designer role, collaborators, deliverables, audience, constraints, and permissions for all six projects—or retain prominent concept labels.
- [ ] Replace/approve all six hero/lead designs, six system boards, six process sheets, studio illustration, captions/alt text, and sharing image. Obtain reproduction rights and a real portrait if desired. Approve art-directed crops and accessible text equivalents.
- [ ] Replace narrative concepts with actual brief, iterations, rejected directions, production specifications, touchpoints and handoff evidence. Never imply packaging is legally or technically production-ready without review.
- [ ] Supply sourced results with measurement timeframe or preserve the explicit no-results statements.
- [ ] Supply two to four verified testimonials, names, roles, companies, and publication permissions, or keep honest placeholders. Supply evidence for any future clients/awards/exhibitions/publications/talks.
- [ ] Approve the four service scopes, feedback rounds, engagement timings and launch-support terms. Confirm that budget choices match actual qualification needs; they are not fixed fees.
- [ ] Replace the capabilities text with the owner's approved deck/résumé if provided; verify the download and all work/service/next-project/navigation links.
- [ ] Supply a monitored email, response policy, privacy/legal copy, retention/consent policy, and a separately scoped secure delivery service. Remove demo-failure controls only after genuine error/retry behavior is implemented.
- [ ] Replace canonical `.example` URLs, structured identity and sitemap base; create platform-compatible social PNG/JPEG assets, configure real-domain robots/indexing intentionally, and verify metadata for every route.
- [ ] Run keyboard/screen-reader, contrast, actual Safari/iOS, additional viewport and production checks. No external publication, domain, account, deployment, or live service is included.

## Preserved source

`027-graphic-designer-portfolio.md` was read in full and not edited.

SHA-256 before and after implementation:

```text
86474A39FE959366D60BDCBC33A9C9AAD26395AEB8FB32CE39C378CA3E359E0A
```

Scope is **027 only**. This document makes no claim about collection completion.
