# 031 — Forge & Co.

An individually designed, local Next.js agency portfolio. The application lives directly beside `031-agency-portfolio.md`; there is no nested application or shared demo template.

## Run and validate

The collection already supplies installed dependencies in its ancestor `node_modules`. No installation or ancestor manifest/lock changes are needed. Commands below are PowerShell, from this directory:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\031-agency-portfolio'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

Manual production preview, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
# Open http://127.0.0.1:3131, then Ctrl+C to stop.
```

Development: `npm run dev`. Do not run a manual server during `npm test`. Playwright starts its own production server on loopback port **3131**, refuses reuse of any existing server, waits at most 60 seconds, uses one test worker with 35-second test deadlines, and tears its server down automatically. The webpack production build uses two Next.js workers. Tests do not build implicitly.

## Observed validation

Final validation on 2026-10-31:

- Strict `tsc --noEmit`: passed.
- `next build --webpack`: passed; homepage, icon, three service pages and not-found output generated.
- Playwright: **24/24 passed**, 41.4 seconds, Chromium desktop and emulated mobile; no retries.
- Actual desktop 1440px and mobile 390px renders, full-page portfolio captures, and the results section were visually inspected. Tests also cover 800px tablet and 320px small-phone layouts and capture the small-phone confirmation.
- Port 3131 had **zero listeners** after the final test run.
- No dependencies were installed and no real services were contacted.

Coverage includes all six discipline filters, truthful counts, combined search, grid/list switching, empty recovery, all twelve case studies, previous/next navigation, featured placement after six projects, all three service scopes and direct URLs, service-to-brief selection, process, all three fictional team profiles, careers, all three insights, local social/contact previews, keyboard modal trapping, Escape/focus return, mobile navigation/focus recovery, reduced motion, counters, horizontal-overflow checks, and native brief constraints. Brief tests exercise missing service, invalid email, missing budget, past/out-of-range dates, short/whitespace descriptions, consent, reset, deterministic error/retry with retained input, focused confirmation, and disposal on close. A submission-journey request check observes no external requests.

Screenshots and optional failure traces are generated under ignored `test-results`; no claim of cross-browser, assistive-technology, real-device or formal accessibility certification is made.

## Source-specific implementation

- Charcoal/white agency shell, anvil mark, oversized “Work That Works” hero, restrained italic editorial accent, generous whitespace, sticky discipline filters, varied-height three/two/one-column portfolio, hover/focus overlays, and mobile fixed project CTA.
- Twelve source-named concepts: Solaris, Bloom, Nexus, Wander, Crest, Pulse, Arborist, Kindred, Volt, Nourish, StudioX and Clarity. Each has typed data, distinct original artwork, a specific challenge, approach, design decision and qualified outcome.
- Original artifacts include a yellow solar identity, pink skincare packaging, dark finance dashboard, map phone, earthy beer packaging, kinetic fitness campaign, consulting stationery, community identity, electric-vehicle silhouette, illustrated meal, architectural workspace and wellbeing phone.
- Solaris breakout follows project six in the unfiltered portfolio. Its complete case explains the source's +340%, +127% and 2.8s → 0.9s scenario without presenting it as measured evidence.
- Three service dialogs also have working direct pages at `/services/branding`, `/services/web`, and `/services/marketing`. Homepage case, process, studio, team, insight, careers and contact views are native modal dialogs, not external links. Direct service-page brief links open the homepage brief.
- Brief selections, optional organization, constrained budget ranges, future preferred date through 2030, native input validation, consent, readable summary, reset, and explicitly selectable one-shot local error simulation. Reset clears custom validity as well as input values. A selected service is retained as the starting scope when resetting a service-led brief.
- Navigation and footer controls lead to working sections, dialogs or local previews. No provider, payment, account, email, recruitment or social integration is implied.

## Deliberate adaptations and evidence boundaries

- The source says “24 projects” but specifies only twelve. This implementation supplies those twelve substantive concepts and reports the real filtered count, rather than duplicating cards.
- Every project/client relationship is fictional. Supplementary logo-strip names Common, Form / Field, Otherland and Alto are invented additions to reach the source's sixteen-logo strip. None are endorsements.
- Source agency statistics, tenure, award and review language are reframed as illustrative ambitions/narrative. There is no actual Clutch review or award: the footer badge explicitly disclaims one. No testimonials were supplied by the source, and none have been fabricated as customer evidence.
- Team profiles, availability narrative, case research proposals, targets and commercial results are clearly identified as invented/unvalidated. Outcomes explain what would require real evidence. No live product UI, financial account, health data, travel route or bookable inventory exists inside the artwork.
- The source email/social destinations are replaced by local, explanatory contact previews. The brief sends **nothing**, saves **nothing**, uses no cookies or browser storage, and creates no booking, quote or contract. All state is in React memory and is discarded on dialog close or refresh. Use fictional details only.
- The portfolio uses a deterministic CSS grid with staggered, varied-height tiles rather than an experimental masonry engine. It preserves source reading order and featured placement across devices. The logo marquee is one strip; reduced-motion mode stops it and wraps the unique logos for readable access.
- Source Space Grotesk/Inter typography is adapted to system Arial/Helvetica with Georgia for the editorial accent. There are no external fonts or network-dependent build assets. The source's performance-oriented promotional wording is moderated to avoid unsupported real-client claims.

## Asset and license provenance

All twelve project artworks, article graphics, monograms and the `app/icon.svg` favicon were authored for this implementation using CSS and inline SVG. No photographs, third-party portfolio screenshots, downloaded logos, external image URLs or stock assets are used. Product/vehicle/packaging/map artwork is an intentional original illustration substitute, not photography or a rendering of an actual product.

UI line icons are from the declared `lucide-react` dependency (ISC license). Installed Next.js and React packages are MIT licensed; TypeScript and Playwright tooling use Apache-2.0. Their upstream licenses remain with the installed packages. System fonts are provided by the operating system/browser; no font files are distributed.

## Original source integrity

`031-agency-portfolio.md` was read in full and not edited. Its original and final SHA-256 are identical:

```text
9F086921940487D2E524390162A263A3DC7D5E75EDA9C92C6FD3F5B544CF2A6B
```

Check locally with:

```powershell
Get-FileHash .\031-agency-portfolio.md -Algorithm SHA256
```

Scope is **project031 only**. No other demo, collection manifest, lockfile, progress document, commit, deployment or infrastructure was changed.
