# 013 — Iron Ridge Brewing Co.

Individually tailored Next.js brewery/taproom demo. App source lives directly beside the original brief, not in a nested project. For adults 21+; all venues, stock, products, production figures, events and business claims are fictional. No real alcohol sales, bookings, payments, accounts, email or provider integrations.

## Run and validate

Prerequisites: the supplied ancestor `node_modules`, Node 26.13/npm 11.20 and installed Playwright Chromium. No install or root lockfile changes are needed.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\013-brewery-and-taproom'
npm run typecheck
npm run build
npm test
```

`build` uses `next build --webpack`, with two workers in `next.config.ts`. `test` starts its own production server at **http://127.0.0.1:3113**, refuses an existing server, uses one Chromium worker, a 60-second startup deadline and 30-second per-test timeout, then automatically tears the server down.

For a manual preview (stop with Ctrl+C afterward):

```powershell
npm run start
```

For the explicit port guard and teardown check used during validation:

```powershell
if (Get-NetTCPConnection -State Listen -LocalPort 3113 -ErrorAction SilentlyContinue) {
  throw 'Port 3113 occupied; refusing reuse'
}
try {
  npm test
  $testCode = $LASTEXITCODE
} finally {
  if (Get-NetTCPConnection -State Listen -LocalPort 3113 -ErrorAction SilentlyContinue) {
    throw 'Unexpected listener remains on 3113'
  }
}
if ($testCode -ne 0) { throw 'Browser tests failed' }
```

## Observed validation

Validated October 31, 2026:

- Strict TypeScript: passed.
- Next.js 16.4.3 webpack production build: passed, statically prerendered homepage, two workers.
- Playwright: **12/12 passed**, 13.5 seconds for the final run.
- Final desktop (1440px) and mobile (390px) full-page screenshots inspected: `test-results\desktop.png`, `test-results\mobile.png`.
- No document overflow at 360, 390, 768 or 1440px. Reduced-motion behavior, mobile menu, swipeable tap cards, footer accordions, native modal keyboard containment/Escape/focus return verified.
- No remaining listener on port 3113 after testing.
- An earlier run caught invalid modern HTML phone-pattern syntax and a native-dialog Tab-boundary issue; both were corrected and all tests rerun.

Coverage includes all 12 source beers, style/search filters, empty recovery, detailed ABV/IBU menu, four-beer flight limit/replacement/reset, standard/VIP tour pricing/date/weekday/capacity, native required/email/phone/age/quantity validation, reservation success/reset, paid dinner capacity and free RSVP, ZIP/pin/list stockist synchronization, merch quantities and gift values, prohibition of alcohol ordering, food/menu/gallery previews, distribution inquiry, newsletter success/reset and absence of external requests during signup.

## Source-specific scope

- Mountain wordmark, copper-tank hero, amber/stone palette, condensed industrial headings and textured dark sections.
- Twelve exact named beer concepts with style-family borders, badges, tasting notes and a local four-pour flight preview.
- Taproom hours, source-story address, kitchen menu, garden/flight gallery, fictional amenities and sober-ride reminder.
- $15 standard weekend and $45 Friday VIP tours. Date/time and guest previews; adult acknowledgment, contact fields, capacity depletion and reset. Times use the browser's local timezone; already-started same-day times are rejected.
- Four event concepts, including $85 dinner seats; eight selectable fictional WNC stockists with ZIP-prefix filtering.
- Mixed 12-pack display only; hoodie, flight board and $25/$50/$100 gift-card wishlist previews. No checkout or redeemable value.
- Founders' garage-to-warehouse story, functional local footer information, social/privacy/terms previews, private-event/distribution inquiry and newsletter.

## Honest adaptations and limitations

The source's real named businesses were replaced with explicitly fictional stockists to avoid implying affiliations or inventory. The map is an original schematic, not geographic directions. Date-specific March/April events moved to 2027 so they remain upcoming at validation; the anniversary title is retained as a source concept, not a real anniversary claim. The hero's source hours badge is labeled a decorative demo fixture, not live open status.

Photography is deliberately replaced by original SVG/CSS artwork: taproom tanks, mountain garden, flight board, product concepts and a founders' story poster rather than a real founders photo. Six additional rotating taps remain unspecified; only the source's twelve featured beers are represented. The PDF link opens a complete accessible menu with browser print/save-to-PDF. Social and full-shop links open useful local previews rather than real external destinations.

Reservation capacity is a **per-open-dialog mock pool**, not date-specific real availability: standard 12, VIP 6 of a 12-guest maximum, dinner 4 of a fictional 30-seat concept, free events 12. Previewing consumes the pool until the dialog closes. Reset clears the form while retaining depletion; closing/reopening resets it. Wishlists, flights and newsletter state live in React memory only and disappear on reload. Contact fields accept fictional data only; nothing is transmitted. No persistence backend, cancellation service, payment flow, real age verification, verified accessibility, certified production, reviews or endorsements exist.

The notice and acknowledgment are **not legally sufficient age verification**. Family dining is described separately; all alcohol experiences are adult-only. No remote fonts or assets are fetched.

## Assets, fonts and licenses

`public\taproom.svg`, `public\garden.svg`, `public\flight.svg` and CSS product/story artwork were created for this demo, with no downloaded imagery or third-party photographs. No external asset licenses or notices were removed. Icons are supplied by `lucide-react` under its ISC license; retain the supplied dependency's `LICENSE` notice when redistributing. System font stacks use locally available Impact/Arial Narrow/Arial/Helvetica, falling back to sans-serif; no font binaries are distributed and no remote font build dependency exists.

## Original brief preservation

`013-brewery-and-taproom.md` was read fully and never modified.

Original and final SHA-256:

```text
60E19EFCE22ED21E82FF4856623B8F6A399CA65F06F8BDADD8E022743D727292
```

Only project 013 was implemented here; this makes no collection-completion claim.
