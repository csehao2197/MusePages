# Keystone home valuation — project 020

A bespoke Next.js local demo, directly beside its unchanged source brief. The fictional Keystone brand uses confident blue, growth green, geometric home artwork, a property report, illustrated team, market chart and imagined homeowner stories. This is **not an appraisal, accurate AVM, real market estimate, verified comparable sale, actual brokerage or investment advice**.

## Run and validate

Use the already installed ancestor `node_modules`; no installation, root manifest edit or lockfile change is needed. Node 26.13 / npm 11.20 were supplied. From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\020-home-valuation-landing-page'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack` with two build workers. `test` runs Playwright against the **production build**, starting `next start` at `http://127.0.0.1:3120`, refusing existing server reuse. It has two test workers, a 60-second server-start bound, 30-second per-test bound and zero retries; Playwright cleans up its owned server. Leave port 3120 free.

For manual use, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
# Open http://127.0.0.1:3120; Ctrl+C stops this manual server.
```

`npm run dev` is also available on port 3120. There are no required environment secrets, providers, accounts or background services.

## Observed validation

On October 31, 2026:

- Strict TypeScript passed.
- Next.js 16.4.3 webpack production build passed; `/` was statically prerendered using two workers.
- **22/22 Playwright cases passed** (11 focused cases in each of the desktop Chromium and mobile-emulated Chromium projects; final run 29.0 seconds).
- Tested: required/unknown address and empty suggestion recovery; keyboard address submission; property/details intake; unsupported land/commercial selection; missing, out-of-bounds and fractional numeric inputs; loading; deliberate failure/retry and cancellation; coherent formula changes, minimum/maximum boundaries; report/methodology; reset; native dialog Tab containment, Escape and focus restoration; synthetic inquiry prefill, required fields, confirmation/reset; no inquiry requests or browser storage; single-open FAQs; internal link destinations; mobile menu and floating CTA; reduced motion, document/modal overflow, artwork and browser exceptions. A separate JavaScript-disabled context also verified that unhydrated native form submission cannot include the typed address in a request.
- Desktop (1440×1000) and mobile (390×664, device scale 3) page and report screenshots were generated in ignored `test-results` and visually inspected. Reports intentionally scroll vertically inside the native modal; compact cards reflow without page-wide horizontal scrolling.
- After the suite, `Get-NetTCPConnection -LocalPort 3120 -State Listen` verified **no remaining listener**.

Chromium desktop/mobile emulation is tested, not physical-device Safari/Firefox or a professional accessibility audit. No real valuation accuracy or market coverage has been tested or claimed.

## Journey and mock boundaries

1. In either address bar, type `742 Evergreen`, `801 Oak`, or `655 Maple`. Native, keyboard-operable suggestion buttons offer exactly three fictional properties; a complete supplied address can also be submitted with Enter. There is no Google Places, geocoding, location access or arbitrary address lookup.
2. Adjust the fictional property type, condition, bedrooms, bathrooms, living area, lot, year and garage. Required fields and limits use native number controls plus typed formula validation. Land/commercial is explicitly unsupported.
3. Calculate to see a one-second local loading state and a toy USD range. The visible failure checkbox deliberately exercises an error, retry and edit journey. Loading can be cancelled. The report shows property factors, fictional comparables/trend, transparent formula and reset controls.
4. The report's local CMA inquiry pre-fills the selected synthetic property. Choose Alex Example or Sam Sample, a synthetic timeline and an optional canned message. The reserved `.invalid` emails and fictional phones are read-only. Submission displays a local confirmation; no agent, visit, email, callback or report delivery is arranged. Reset clears the request.

Inputs live only in React page memory. There is no local/session storage, analytics, property endpoint, AI, lead transmission or third-party fetch. Reload clears page state. Ordinary local page/asset requests still reach the Next server. **Never enter real property or contact information.**

## Toy formula

See `components\valuation.ts` and the result's expandable methodology:

```text
base = sqft × 228 × typeFactor
     + (bedrooms − 3) × 6,000
     + (bathrooms − 2) × 8,000
     + garage × 4,000
     + lotAcres × 10,000
     − (2026 − yearBuilt) × 150
midpoint = clamp(round(base × conditionFactor / 1,000) × 1,000,
                 80,000, 1,300,000)
low  = floor(midpoint × 0.93 / 1,000) × 1,000
high = ceil(midpoint × 1.07 / 1,000) × 1,000
```

Type factors: house 1, townhome 0.94, condo 0.86. Condition: standard 1, updated 1.04, needs-work 0.92. Inputs: 1–6 whole bedrooms; 1–5 bathrooms in 0.5 increments; 500–5,000 whole square feet; 0–2 lot acres in 0.01 increments; year 1900–2026; 0–3 whole garage spaces. Thus age is bounded to 0–126 years. Midpoint bounds apply before outward range rounding.

The initial 2,100-sq-ft house gives **$495,000**, with **$460,000–$530,000** displayed. Increasing its area to 2,500 gives $587,000 / $545,000–$629,000. The ±7% band is an arbitrary illustrative UI band, **not a confidence interval or accuracy guarantee**. Coefficients are invented, not trained, calibrated or geographically meaningful. Comparable prices and the +6.2% trend do not feed the formula. Do not use any output for real decisions.

## Honest adaptations and assets

- Preserved the source's address-led hero, three-step journey, report, factors, comparable examples, market snapshot, trust/about section, story cards, CMA form, five FAQs, repeated CTA, footer and mobile fixed estimate button. The report range follows the formula rather than copying an inconsistent static number.
- Replaced real-market, MLS, accuracy, confidence, customer-count, review, sales-volume, company-history and certification assertions with plainly identified demo content. All market figures, addresses, locations and sale dates are fictional, not evidence of actual sales or locality.
- Removed telephone/social/business links that would imply a real service. Footer and support destinations are working local sections, not dead links. No Oregon license, NMLS number, Fair Housing certification, real brokerage status or provider endorsement is claimed.
- Contact fields use selectable synthetic personas/read-only contacts and canned message options instead of collecting arbitrary real details. No payment/card, account or email features exist.
- `public\keystone-house.svg` and `public\keystone-team.svg`, chart SVGs, logo composition and CSS geometric art are original work for this demo. They replace the requested property/team photography; no photography or map assets were downloaded. Original illustrations are licensed under the MIT notice in `THIRD-PARTY-NOTICES.txt`.
- The requested DM Sans is **not bundled or downloaded**. CSS uses the installed DM Sans if present, otherwise platform Arial/Helvetica/sans-serif. No font files are redistributed and no external-font build/runtime dependency exists. Screenshots use the platform fallback.
- Icons come from the declared `lucide-react` 1.61.0 dependency. Its ISC notice and inherited Feather MIT notice are retained in `THIRD-PARTY-NOTICES.txt`; installed package notices remain intact. No unlicensed external artwork is used.

## Source preservation and scope

The original `020-home-valuation-landing-page.md` was fully read and never edited. SHA-256 before and after implementation:

```text
B93546CB2672AF50F23AB3FDC80BEDB7E0F1ADAA0DB8A7F4BAD8C8DD60D059C5
```

Only project 020 was implemented. All application/configuration/test/documentation/generated output is inside this folder; no nested generated application, shared-template dependency, root manifest/lock/progress changes, other project work, commits, pushes, deployment or provisioning.
