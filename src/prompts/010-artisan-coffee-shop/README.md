# Ember & Bloom — project 010

A standalone, coffee-specific Next.js local demo. Application files live directly beside the original `010-artisan-coffee-shop.md`. No other sample or collection-level file was changed.

## Run and validate

Use PowerShell from this directory, with the collection's existing ancestor `node_modules`. No installation or root lockfile update is needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\010-artisan-coffee-shop'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

`build` executes `next build --webpack`, using two build workers. `test` runs the production app at **http://127.0.0.1:3110**, refuses an existing server, uses one test worker, and shuts its owned server down automatically. Startup is bounded to 60 seconds, each test to 30 seconds, expectations to 6 seconds, shutdown to 5 seconds. Do not start another instance before testing.

For manual production viewing after a build:

```powershell
npm run start
# Stop this manually started server with Ctrl+C.
```

Optional local development: `npm run dev`. To regenerate the included original menu PDF: `node scripts\generate-menu.mjs`.

To check cleanup:

```powershell
Get-NetTCPConnection -LocalPort 3110 -State Listen -ErrorAction SilentlyContinue
```

## Observed validation — October 31, 2026

- Strict TypeScript: passed.
- Optimized Next.js 16.4.3 webpack build: passed; static home page and not-found route generated with two workers.
- Playwright: **16 passed** (8 focused scenarios × desktop Chromium / mobile-emulated Chromium), final run 21.1 seconds.
- Coverage: all ten brief sections; loaded local artwork; menu filters; oat-milk surcharge and quantity math; native required, invalid-email and numeric limits; different bean grinds; fresh option defaults on reopening; basket increments, removals and empty state; local pickup confirmation; subscription price/frequency; newsletter; Saturday-only tour validation; wholesale inquiry; rewards explanation; real PDF download; Escape/focus return; mobile drawer and ordering; reduced motion; no horizontal document overflow or external resource requests.
- Final desktop (1440 × 1000) and mobile (390 × 664 CSS pixels) hero/full-page screenshots were visually inspected. They are generated inside `test-results` (ignored), not checked-in photography.
- No listening process remained on port 3110 after validation.
- Early testing exposed retained product options when reopening the same bean. Fixed with a fresh selection-form key and verified by the option-default regression assertions.

## Source fidelity and honest adaptations

The cream / amber / dark-roast palette, serif editorial typography, brick-and-plant cafe hero, four seasonal drinks, Maya Chen origin narrative, complete three-category menu, four Portland locations with specified hours, three 12oz bean products and prices, newsletter / rewards split, review strip, and footer follow the source brief. Drinks/products swipe on mobile, menu and locations stack, story stacks, and mobile navigation uses a native modal drawer.

- All services are **local in-memory previews**. There are no real orders, payments, accounts, email, APIs, maps, analytics, cookies, persistent browser storage, shipping or subscriptions. Refresh clears the basket. Contact/wholesale/careers/gift-card/rewards CTAs open local forms; press/social/privacy/terms CTAs open explicit local information rather than dead links.
- Prices use integer cents. Oat milk is +$0.75 per selected drink; quantity applies to each unit including its surcharge. Different options occupy different basket lines. Pickup has an explicitly illustrative tax-free total, without shipping or fees. Subscription previews state the exact listed bag price per delivery; no automatic billing is created.
- Dietary, organic/grade, certification-adjacent sourcing, origin, founder, above-fair-trade pricing, operational and 48-hour delivery claims are marked illustrative. Reviews/publication names appear with a no-endorsement disclaimer; no licensed brand logos are reproduced.
- Requested photography is replaced by **six original local SVG illustrations**, including a latte pour, flight, roasting journal, bean bag and decorative street grid. Maps are not geographic data. “Get Directions” opens fictional location details instead of live Google Maps.
- Playfair Display and Inter are intentionally substituted with installed **Georgia / Times New Roman** and **Arial / Helvetica** system stacks. No font files are distributed, downloaded or fetched during build. Generic camera/message symbols substitute for connected social-brand icons.
- The downloadable PDF is an actual locally generated one-page menu, with clear demo/dietary disclaimers and no third-party artwork.

## Assets and licenses

All SVG artwork in `public` and the generated PDF content were authored for this project; redistribution terms are in `ASSET-LICENSES.txt`. Lucide icons retain their ISC notice and the upstream Feather-derived MIT notice in the same file. Installed system fonts remain licensed by their operating-system vendors; no font binaries are bundled. No third-party photography or external assets were downloaded.

## Limits

This is a local design/interaction demo, not a deployable coffee business. No real availability, allergen safety, address validity, review authenticity or operational claim is verified. The tour preview accepts Saturdays from November 7, 2026, without live scheduling. Browser validation uses desktop and emulated-mobile Chromium, not physical devices, WebKit or Firefox; this is not a full accessibility audit.

## Unchanged source

Original Markdown SHA-256, verified before and after implementation:

`BF52DCB3F9D016D1248F4D1872C445EACCFECCF2E2D854B1F5245B9DB42A5648`

```powershell
Get-FileHash '.\010-artisan-coffee-shop.md' -Algorithm SHA256
```

Only project **010** is implemented and validated here. No collection completion is claimed.
