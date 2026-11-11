# 032 — Frameshift / How we work

Standalone Next.js process-led demo implemented directly beside the unchanged source brief. Package: `sample-032`. No installation, root changes, shared application template, external services, or live accounts are needed.

## Run and validate

From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\032-agency-process-page'
npm run typecheck
npm run build
npm run test
```

For manual production review, after building:

```powershell
npm run start
# Open http://127.0.0.1:3132
# Ctrl+C when finished.
```

`npm run dev` also uses port 3132. Scripts resolve supplied ancestor `node_modules`; do not install dependencies or regenerate ancestor locks. The local Next runner disables telemetry for dev/build/start. Build uses webpack and two static-generation workers.

Playwright starts its own production server on **127.0.0.1:3132**, refuses an existing server, uses one test worker, zero retries, a 60-second startup bound and 35-second per-test bound, and shuts the process tree down automatically. Stop any manually started server before running tests.

## Implemented source journeys

- Sticky navigation and native modal mobile menu; mobile call bar, skip link, semantic landmarks, keyboard navigation, focus trapping/return, and reduced-motion behavior.
- Four-phase 12-week roadmap with phase anchors/active selection. Alternating phase sections retain deliverables, collaboration checkpoints, role examples and explicit approval gates.
- Original CSS process-block illustration, project brief/persona, annotated dashboard, sprint board/code preview, launch checklist and clearly identified performance targets. Artifact buttons open accessible local previews.
- Typed engagement planner: full product **12 weeks / $60,000**, discovery + design **6 / $30,000**, discovery only **2 / $10,000**. Optional core flow **+1 / $7,500**, integration **+2 / $15,000**, multi-role workspace **+2 / $12,500**. Additive, sequential USD estimates; engagement changes clear extras; reset restores baseline. Taxes/ongoing costs excluded. No commercial quote.
- Future-weekday consultation date picker, UTC radio times, weekend/empty states, native required/email/date/name/length validation, optional simulated submission failure with retained inputs, retry, scope-aware local confirmation, and clear/new-request flows.
- Six native FAQ disclosures, fictional engagement scenarios, toolkit explanations, local newsletter validation/confirmation/reset, meaningful informational footer dialogs, and an actual downloadable original PDF.

## Evidence, services and adaptations

Frameshift, staff/roles, clients, quotes, research, availability, metrics and scenarios are **fictional/illustrative**. No actual product delivery, research sessions, NPS improvement, coverage measurement, Lighthouse result, awards, reviews, response deadline or service guarantee is claimed. Proposed support is 30 days **after** the roadmap. The concept metrics are visibly marked fictional, not evidence.

The source's client-trust bar is adapted to contextual product-name wordmarks with an explicit no-affiliation/no-endorsement notice. Clutch/DesignRush badges are replaced with a no-awards notice. Testimonial language and result headlines are adapted to avoid fabricated evidence. Source count-up animation is replaced with stable, readable concept figures; reduced-motion users lose no information.

Calendar, inquiry, newsletter, artifact previews, tool explanations and footer destinations are local simulations. No email, scheduling provider, backend, payment, account, storage, analytics, credentials or external API exists. Form state remains in browser memory and is lost on refresh; confirmation unmounts and clears contact fields. Do not enter sensitive information. Footer/social items explain their concept status rather than linking to real accounts. Blog links to the newsletter; Team links to the role disclosure.

## Assets and font provenance

- All process diagrams, document/dashboard/board/checklist mockups, persona initials, geometric brand mark and PDF content were authored specifically for this demo. No downloaded photos or copied portfolio assets.
- Lucide React icons: installed `lucide-react`, ISC license. Icons are package-provided; no external asset fetching.
- System Arial/Helvetica/sans-serif substitutes for the requested Plus Jakarta Sans/Inter. No font files are copied, redistributed, or downloaded; builds have no external-font dependency. The PDF references standard built-in Helvetica.
- Third-party product names are descriptive references only; no trademark ownership or endorsement is implied. Tool tiles use original typographic initials rather than downloaded logos.

## Observed validation

- Strict TypeScript: **passed** (`npm run typecheck`).
- Optimized production build: **passed** (`npm run build`; Next 16.4.3, webpack, two workers).
- Production Playwright: **18 passed**, nine focused scenarios each on desktop Chromium **1440×1000** and mobile Chromium/iPhone 13 **390×664**, both with reduced motion. Covers phase/gate/artifact navigation, keyboard modal trapping/focus return, exact scope arithmetic, date/weekend/native validation, simulated failure recovery, confirmation/reset, FAQ keyboard interaction, fictional case/tool/privacy previews, newsletter recovery, mobile menu/CTA focus, overflow, and real PDF response.
- Desktop/mobile hero, full-page and consultation screenshots are generated in ignored `test-results` and manually inspected. No horizontal page overflow or runtime errors observed in render checks; no external network requests observed after reload.
- Port 3132 checked after the suite: **no listening server remains**.
- Scope limitations: Chromium only, simulated calendar availability, no real research, commercial evidence or provider integrations. This is not an accessibility certification or measured performance guarantee.

## Original source integrity

`032-agency-process-page.md` was read in full and not edited.

SHA-256 before and after:

```text
78862279C54E25548E4799F0FDC5CF10BB053FCD15F2F621210BDF4BB8C4D706
```

Only project 032 was implemented. No collection-completion claim.
