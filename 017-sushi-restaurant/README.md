# Hikari · 光 — sample 017

A standalone Next.js local demo beside its original brief. No shared restaurant template, external API, account, real booking, order, payment, email, map provider or social integration.

## Run and validate

Uses the already installed ancestor workspace dependencies. **Do not reinstall dependencies or change the parent lockfile.** Node 26.13 / npm 11.20 were supplied by the environment.

PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\017-sushi-restaurant'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm run test
```

Manual production preview, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run start
```

Open `http://127.0.0.1:3117`; stop the manual preview with Ctrl+C before testing. Development alternative: `npm run dev`.

The production build uses webpack and two build workers. Playwright owns its production server on port 3117, refuses reuse of an existing server, uses one test worker, no retries, 30-second test / 60-second startup limits, and automatically shuts down the server. Run tests only when this port is free.

```powershell
Get-NetTCPConnection -LocalPort 3117 -State Listen -ErrorAction SilentlyContinue
Get-FileHash '.\017-sushi-restaurant.md' -Algorithm SHA256
```

## Implemented experience

- Hikari bilingual wordmark, scroll-aware navy navigation, mobile dropdown and centered, gently animated chef-counter hero.
- Philosophy, Spring 2026 Otoro / Uni / Sakura Masu highlights, category filters, five typed fictional dishes, allergen/raw-food details and counter-only course routing.
- 18-course omakase journey: $185 × guests, optional $25 tea or $65 adult-only sake pairing per guest. Sake requires a self-declaration, **not legal age verification**.
- Local reservation form with native required/name validation, future dates, Tuesday–Saturday calendar, 48-hour omakase lead time, 6:00 / 8:30 seatings, 1–8 guests, and explicit simulated capacity (6 remaining early seats / 14 late seats). Bar dining supports seven dinner times. Local confirmation, reset, error recovery and special-request text.
- Takeout bag with quantity adjustment/removal, eight-per-dish limits, exact totals, empty/clear recovery, native pickup form validation, one-hour lead time and closed-day checks. Local order confirmation clears the bag; nothing is transmitted.
- Chef story, six-image asymmetric gallery with button/arrow-key navigation and wraparound, fictional guest impressions, illustrative location diagram, hours/accessibility notes and native-validating local newsletter signup/reset.
- Semantic landmarks, skip link, native dialogs with keyboard containment, Escape dismissal, trigger focus restoration, reduced motion, responsive stacking and 44px controls.

All session data exists only in React state; reloading clears it. Prices are illustrative USD, without taxes/fees. No sensitive information or card details are requested. Origins, raw-food/dietary labels, experience, location, hours, transit, parking and venue access are unverified illustrations, not operational, safety, sourcing or certification promises.

## Art, typography and brief adaptations

`components/Art.tsx` contains original SVG scenes created for this demo: chef/hinoki counter, seasonal nigiri, lacquerware platter, sake vessels, dining room and noren entrance. `public/hikari-mark.svg` is an original geometric favicon. No photos, stock downloads, copied logos or external assets were used. The brief's cinematic photography, portrait and gallery photographs are deliberately replaced by disclosed original illustrations; they are not photographs of a real venue.

Lucide icons come from the declared `lucide-react` package (ISC license; its package includes the license). No font files are downloaded or redistributed. The CSS requests locally available Noto Sans / Yu Gothic / Segoe UI / Arial with system Georgia / Yu Mincho serif editorial and Japanese accents; actual fallback depends on the device. No external font service or build-time font fetch.

Real publication logos, reviews, chef affiliations and award claims were replaced by explicitly fictional narrative and guest impressions. Social links/providers are omitted rather than simulated as live. The source's email-confirmation promise is replaced by an honest instant local confirmation; the location map is a non-navigable fictional diagram.

## Observed validation

Final validation on October 31, 2026:

- `npm run typecheck`: passed, strict TypeScript.
- `npm run build`: passed; Next.js 16.4.3 webpack, two build workers, statically generated homepage.
- `npm run test`: **20 passed, 0 failed** (30.0 seconds): ten focused cases across desktop Chromium 1440×1000 and mobile Chromium iPhone-13 viewport.
- Coverage includes categories/details, allergens, counter-only routing, quantity/price limits, empty/clear recovery, required pickup/name validation, closed-day recovery/order confirmation, omakase courses/capacity/tea totals/reset, required reservation fields, sake self-declaration, bar time options, gallery wrapping/keyboard containment/focus return, newsletter validity/reset, mobile nav/Escape, reduced motion and horizontal overflow. Deterministic checks cover past dates, invalid dates, guest boundaries and exact 48-hour / one-hour lead-time boundaries.
- Tests also assert no uncaught page errors or unexpected external requests.
- Desktop/mobile full-page and reservation screenshots are generated in `test-results\hikari-responsive-navigati-65dd5-render-capture-and-overflow-{desktop,mobile}\`. Both layouts were visually inspected.
- After the final test run: **no listening process remained on port 3117**.

Browser coverage is Chromium only, not Safari/Firefox or a full accessibility certification. Availability never changes globally, requests are not fulfilled, and artwork is intentionally illustrative.

Original `017-sushi-restaurant.md` was read in full and never edited. Verified unchanged SHA-256:

```text
7ED8D4E316BFCA3A9413C95630A45F8FFC47240D1DE90E9A2172B4C011614D7B
```

Only project 017 is implemented and reported here.
