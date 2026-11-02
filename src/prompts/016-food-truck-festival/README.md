# StreetBite Fest — project 016

A specifically tailored Next.js local food-truck festival demo. Application files are directly beside the untouched `016-food-truck-festival.md`, not inside a nested application. Only project 016 was implemented.

## Run and validate (PowerShell)

Use the existing ancestor workspace's installed dependencies. No installation, root manifest edits, root lock changes, external services or credentials are needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\016-food-truck-festival'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack`; `next.config.ts` limits build workers to two. `test` runs Playwright against the **production** build with Chromium desktop (1440 × 1000) and mobile iPhone 13 emulation (390 × 664), plus a 360px narrow-layout check. Chromium must already be installed, as it was during validation.

The test configuration starts its own `http://127.0.0.1:3116` production server, **refuses reuse of an existing server**, limits workers to two, startup to 60 seconds, tests to 35 seconds, disables retries and shuts its server down automatically. Do not run a separate server while executing tests.

For an intentionally foreground preview:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
# Open http://127.0.0.1:3116 and stop this foreground process with Ctrl+C.
```

For development, use `npm run dev` on the same port instead. To regenerate the included original PDF asset: `node scripts\create-map-pdf.mjs` from this folder.

## Observed verification

Validated October 31, 2026 using the installed Node 26.13 / npm 11.20 toolchain:

- Strict TypeScript (`npm run typecheck`): passed.
- Production webpack build: passed; static `/` and Next.js not-found route generated using two workers.
- Playwright: **18 passed**, nine source-specific scenarios on each desktop/mobile project, final complete run 20.4 seconds.
- Initial testing found a too-specific FAQ test locator and a modal reverse-Tab focus-wrap issue. The selector and keyboard behavior were corrected; the complete rerun passed without retries.
- Desktop and mobile hero, lineup, full-page and narrow-mobile PNGs were generated under the responsive test's `test-results` subdirectories and visually inspected. No overlapping page content or document-wide overflow was observed; map and music intentionally have their own horizontal scrollers.
- The runtime-render test observed no browser console errors, uncaught page errors or external requests. It verified reduced-motion behavior and document overflow across the main sections.
- Port 3116 had **no listening process after test teardown**. No preview server was left running.
- No separate lint tool/config was introduced; no lint result is claimed. Browser checks use Chromium, not a claim of exhaustive Safari/Firefox or assistive-technology certification.

Tests exercise actual cuisine/food/recipe/zone combinations, truck menus and illustrative allergen notes, empty-filter recovery, favorite trucks, map zone filtering/list/zoom/PDF download, day-tab arrow-key navigation, stage filters, empty saved schedules, plan clearing, ticket tier/date/quantity/age/discount/add-on totals, native invalid input, invalid-code/date/21+ recovery, confirmation/reset, vendor and sponsor inquiries, simulated form failures with draft retention, newsletter retries/reset, native FAQ keyboard controls, generated audio play/stop, modal focus trapping/restoration and the mobile yellow navigation.

## Implemented source scope

- StreetBite identity with taco-integrated wordmark, rose/orange/yellow palette, bold playful type, food collage, waterfront truck art, string lights, floating stars and wavy edge.
- Sticky desktop navigation, fullscreen yellow mobile menu, native modal dialogs, skip link, visible focus, Escape/backdrop dismissal, Tab wrapping/return, reduced motion and mobile ticket/plan bar.
- All eight named source trucks and all eight cuisines; typed fictional menu/price/dietary/allergen fixtures. Combined food search, cuisine/recipe/zone filtering, truck details and favorite planning. The full-lineup CTA shows the actual eight fixtures instead of pretending there are 50 live vendors.
- Original interactive waterfront schematic with three clickable food zones, stage/garden buttons, list view, zoom, restrooms, first aid, ATMs, gates, legend and a downloadable, locally generated vector PDF.
- All three days' source activities, stage/day filters, keyboard-operable day tabs and saved-event planning. Favorite plans are in-memory only, clearable and lost on refresh.
- $15 Day / $35 Weekend / $89 VIP demo calculators; date selection, 1–12 paid ages-10+ passes, 0–6 free under-10s with adult supervision, purchaser age 18–120, optional single $15 July 26 class seat for age 21+, `CREW20` at eight or more paid passes, itemized totals and local confirmation/new-order/full reset. Discount applies only to paid passes, not the class. No fees/taxes are simulated; food is separate. VIP welcome drink has a nonalcoholic option.
- Three fictional artist previews with original posters and playable original synthesized melody, six source-named sponsor placeholders, all eight FAQ topics, local newsletter and inquiry forms. Vendor/sponsor/volunteer/accessibility/press/contact links open relevant local forms; other footer/social links open useful clearly labeled information, not dead anchors.

## Intentional adaptations and safeguards

**Dates:** the source calls July 25–27, 2026 Friday–Sunday, but those dates are **Saturday–Monday**. The demo preserves the numerical dates and program order, corrects weekday labels everywhere, and explains this visibly. Its source “last weekend of July” wording is not a live recurrence promise. These dates are historical at validation time; no upcoming-event claim is made.

**Fictional claims:** trucks, musicians, recipes, menus, prices, festival scale, “third annual,” awards, stock/capacity, sponsors and organizer are illustrative. Dietary/allergen notes are not verified ingredients or cross-contact guarantees. The source's “200 VIP only,” sellout, 12,000 attendees and Google rating are explicitly not verified scarcity, attendance or reviews. No true sponsorship or endorsement by the six source-named businesses is claimed; only text placeholders are used, not brand logos.

**Location/policies:** Tom McCall Waterfront Park is a real place used in the source concept. No actual festival, booking, map provider, transit routing, accessibility survey, parking, weather/shelter or vendor-payment guarantee is offered. FAQs qualify the imaginary policies rather than representing real park/operator rules.

**Mocks:** checkout, newsletter and inquiries execute only in browser memory. Nothing is emailed, paid, reserved, uploaded or stored on a server. Use fictional form details. Failure toggles deterministically demonstrate local error/retry behavior. No account, persistence, API, analytics, payment/card input, credential, real food order, eating-contest registration, voting service or provider integration is present. Production serving itself is real; festival services are not.

## Asset and font provenance

- `components\art.tsx`: original inline SVG taco, bao, BBQ, slider, lobster-roll, ice-cream, wrap and burger illustrations and taco wordmark mark, created for this project.
- `public\street-scene.svg`: original food-truck/string-light illustration; `public\festival-map.svg`: original top-down park schematic. No third-party geographic data.
- `public\festival-map.pdf`: original vector schematic generated by the included `scripts\create-map-pdf.mjs`, with explicit fictional/non-geographic notices.
- Artist posters, confetti, waves and lights are original CSS/SVG/typographic artwork. `components\music.tsx` creates a short original triangle-wave melody locally with Web Audio; no recordings are downloaded or redistributed.
- These illustrations deliberately replace the brief's food/truck/artist **photography**. They are not portrayed as actual vendor food photos. No unlicensed photos or external assets were downloaded.
- System `Arial Black` / `Trebuchet MS` / Arial / Helvetica with an Impact-style condensed logo replace Bricolage Grotesque / Inter; no font files are distributed or remote font requests/build dependencies used. Local availability determines fallback rendering; system-font licensing stays with the installed OS/fonts.
- UI icons use declared `lucide-react` 1.61.0. Its full installed ISC notice and Feather-derived MIT notice are retained verbatim at `public\lucide-LICENSE.txt`; retain them with distributed copies. Other package licenses remain in the preinstalled dependency packages.

## Original source integrity

Read fully before implementation. Original bytes were not edited. Initial and final SHA-256 match:

```text
44E6F36AF132E0BE0F22BE52A3BBE9BCC146D35A77197B67FF46F6521D38EC55
```

To independently check:

```powershell
Get-FileHash '.\016-food-truck-festival.md' -Algorithm SHA256
```

No other demo, root manifest, lock, collection report or source manifest was written. No commit, push, deploy, provisioning or agent delegation was performed.
