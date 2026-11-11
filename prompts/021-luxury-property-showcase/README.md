# 021 — The Meridian Penthouse

A bespoke editorial luxury-property demo built **directly beside the original Markdown**. Warm white, restrained gold, sharp architectural imagery, generous space and serif-led storytelling. This project alone is implemented; no collection-wide completion is claimed.

## Run and validate

From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\021-luxury-property-showcase'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

Dependencies resolve from the supplied ancestor `node_modules`. No installation, root manifest change or root lockfile change is needed. The manifest declares only used packages. `npm run build` uses `next build --webpack`; `next.config.ts` limits build workers to two.

For manual production browsing after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start -- --hostname 127.0.0.1 --port 3121
```

Stop that foreground server with Ctrl+C before testing. Playwright starts its own isolated production server at `http://127.0.0.1:3121`, refuses an existing listener, uses one test worker, a 90-second startup limit, 45-second test limits, no retries and automatic server teardown. Chromium must already be installed.

## Implemented journeys

- Cinematic full-height residence, sticky desktop facts/mobile expandable facts, responsive navigation and fixed mobile viewing action.
- Sixteen architectural gallery scenes with horizontal mobile scrolling, native modal lightbox, wraparound buttons, arrow keys, Escape, focus containment and restoration.
- Interactive labeled floor-plan schematic, bounded zoom, horizontal panning and a real locally generated one-page PDF download.
- Six feature accordions, eight horizontally scrollable building amenities, five interactive neighborhood hotspots and illustrative mobility gauges.
- Local room-switching walkthrough with an expanded accessible dialog.
- Principal-and-interest calculator: USD, 0–100% down, 0–25% interest, 1–40 years, zero-rate and full-down-payment handling. The original approximate payment is calculated as **$21,793/month** at $4.2M, 20% down, 6.75%, 30 years. Taxes, insurance, HOA and fees are excluded.
- Four typed fictional listings: the Meridian and the brief’s three comparable residences; combined name/address search, neighborhood, bedrooms, price ceiling, ordering, detail dialogs, saves, empty-state reset.
- Viewing and inquiry previews with native required/email/phone/date/time validation, additional whitespace/phone-digit checks, deliberately unavailable 6 PM demo slot, correction/retry, confirmation and clean reset. A comparable’s viewing action retains that residence in the confirmation. Dates use the browser’s local calendar; time slots are illustrative local times.
- Agent, pre-approval, social, privacy and terms controls are working local journeys, not dead links.

## Scope, safety and adaptations

Every home, location, price, advisor, brokerage, availability and market-like claim is fictional and qualified in the interface. The identifier is a **concept listing ID**, not a real MLS record. Elena Vasquez is an invented design-story character; no real award is asserted. Product names are illustrative specifications with no endorsements. No New York license, real Michelin rating, real Walk Score certification, valuation, financing approval or investment guarantee is claimed.

Forms do not book, email, persist personal details, create accounts or contact providers. Use invented contact details. Successful preview clears form values; only property identifiers are stored in browser `localStorage` (`meridian-saved`). Unsave to remove them. Storage failure falls back to session-only saves. There are no payments, maps APIs, credentials, real social accounts, live data or externally loaded fonts/assets.

Photography is adapted to **original SVG architectural concept illustrations** in `components/scene.tsx`: living spaces, kitchen, bedrooms, bath, office, wine racks, terraces/pool, lobby, gym and lounge. These are explicitly labeled illustrations, not depictions of real listings. The floor plan is deliberately schematic—not surveyed, proportionate or suitable for construction. Its PDF is generated locally at `/floor-plan`. The embedded map is an original CSS diagram, not a real navigation map. Matterport/video/full-screen embedding is adapted to an expanded, room-switching illustrated dialog. The agent photo is replaced by an original typographic monogram. The equal-housing symbol is generic typography, not a certification mark.

## Assets and notices

- Architectural SVG, CSS diagram, plan/PDF layout and monogram are original project-authored artwork; no stock photographs or third-party image downloads.
- Typography deliberately uses installed **Georgia / Times New Roman** and **Segoe UI / Arial** instead of downloading Playfair Display / Source Sans 3. Fonts are not bundled or redistributed; system-font use remains subject to platform licenses.
- Icons: `lucide-react` 1.61.0, ISC; some inherited Feather icons are MIT. The applicable upstream copyright and permission notices are retained in `THIRD_PARTY_NOTICES.txt` and in the installed dependency.
- Next.js, React and React DOM are installed dependencies with their upstream MIT licenses retained in their packages; no vendor source has been copied into this project.

## Observed validation

On 2026-10-31, in the supplied Windows / Node 26.13 / npm 11.20 environment:

- `npm run typecheck`: passed strict TypeScript.
- `npm run build`: passed Next.js 16.4.3 production webpack build with two workers; `/` statically generated, `/floor-plan` is the local PDF endpoint.
- `npm test`: **20 passed**, ten journeys each on 1440×1000 desktop Chromium and iPhone 13-sized mobile Chromium. Production-server tests cover combined discovery, ordering, saves/persistence/removal, details, gallery/keyboard/focus, plan/PDF, map, amenities, tour, correct USD calculation and native bounds, required/email/past-date/digit validation, unavailable-slot retry, confirmation/reset, inquiry/comparable context, local policies/social controls, no external requests, reduced motion, mobile navigation/accordion/stats and document overflow.
- Desktop/mobile hero and full-page screenshots were generated under ignored `tests/artifacts/` and visually inspected. No browser runtime errors were observed in render coverage.
- After automatic teardown, no owned listener remained on port 3121.

Intentional gaps: no real photos, measured floor plan, map, 3D/video tour, real-world appointment availability, licensed brokerage, lender or mail delivery. This is a local demonstration, not a production transaction service.

## Original preserved

`021-luxury-property-showcase.md` was read in full and not edited. SHA-256 before and after:

```text
50C394500C777CDE286204F7B27E7F301D7C1E8B357338B20E07DB87EC45BE6B
```
