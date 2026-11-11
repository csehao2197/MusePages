# Golden Crumb — project 011

A standalone, local Next.js demo implemented directly beside the unchanged original brief, `011-bakery-and-cafe.md`. No nested application, shared starter-template UI, or changes to other numbered projects.

## Run

Use PowerShell with the already-installed ancestor workspace dependencies:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\011-bakery-and-cafe'
npm run typecheck
npm run build
npm run test
```

For interactive production viewing:

```powershell
npm run start
# Open http://127.0.0.1:3111
# Stop with Ctrl+C when finished.
```

Or `npm run dev` for development on port 3111. Do not run a manual server during tests: Playwright starts its own **production** server at `http://127.0.0.1:3111`, refuses an existing server, and automatically shuts down its process tree. Configuration bounds startup to 60 seconds, each test to 35 seconds, assertions to 6 seconds, and uses one browser worker with no retries. The webpack production build uses two Next workers.

No installation or ancestor lockfile changes were needed. The package declares the dependencies it actually uses: Next 16.4.3, React/React DOM 19.3.1, Lucide React 1.61.0, TypeScript 5.9.3, and Playwright 1.64.1, with the supplied Node/React types.

## Implemented brief

- Golden Crumb's wheat logo, amber/brown/cream palette, textured paper surfaces, serif/script typography, transparent-to-fixed white header, full-screen mobile navigation, and mobile sticky ordering bar.
- Centered croissant hero with restrained Ken Burns motion, scalloped edge, and working menu/pickup actions.
- The exact three specials and prices: Sourdough Boule $8.50, Almond Croissant $5.75, Lavender Honey Latte $6.25.
- Five keyboard-navigable category tabs, six specified breads, four fictional additional selections in each other category, and an expandable 22-item full menu. Recipe labels and allergen caveats are visible.
- Elena and Marcus's 2018 farmers-market story and expanded local story dialog; three ordering steps.
- Six staggered gallery scenes: cafe interior, torn croissant, latte pouring, pastry display, patio, and cooling racks. Keyboard-accessible lightbox with previous/next and focus return.
- Four explicitly fictional brief reviews, dots, previous/next, five-second autoplay, hover/focus suspension, persistent manual pause, swipe handling, and disabled autoplay under reduced motion.
- Catering/celebration-cake/office-box request preview for 10–200 guests, future event date, preferences and email.
- $32 weekly bread-box preview, Saturday start date, fictional delivery address, service-area acknowledgment, and gift option.
- Illustrated neighborhood map, exact brief address/hours/phone and parking/patio notes, clearly marked fictional and not navigable.
- Crumb Club native email validation, local welcome-coupon preview/reset; footer navigation, local social previews, and nonfunctional payment-brand **labels**, not misleading checkout controls.

## Local-only boundaries

There are **no real orders, payments, subscriptions, emails, accounts, maps, provider calls, APIs, or external social links**. No payment credentials are requested. Forms and bag state live only in React memory, disappear on reload, and are not written to app storage or sent over the network. Use invented contact/address details.

Pickup supports today/future windows, Monday closure, and Sunday pastries/drinks only. Each product/preparation combination permits 1–20 whole items, with a cumulative cap. Slicing/warming/decaf is free; oat milk or the lemon cake's gluten-free recipe adds 75 cents per item. Line prices and totals use integer cents. The preview has no tax or fees; submitting clears the bag and shows a local confirmation. Closing a confirmation discards it; reopening forms starts fresh.

Native required/email/date/min/max/step validation is combined with business-rule errors for closed dates, Sunday restrictions, Saturday box starts, and cumulative quantity limits. Dietary labels, organic/local sourcing, ratings, names, reviews, tags, location, hours, stock and delivery claims are fictional, not verified facts, certifications, or allergy-safety guarantees. The displayed “Updated daily at 6 AM” is brief copy, not a live update.

## Artwork, adaptations & provenance

- Every bakery scene in `components/BakeryArt.tsx`, the neighborhood map in `public/neighborhood.svg`, and the CSS paper texture are original SVG/CSS artwork created for this demo. No downloaded photographs, stock assets, or third-party artwork.
- The requested photography is deliberately adapted into a cohesive illustrated bakery: a warm wooden-counter croissant hero rather than a marble-counter photograph; illustrated founders, goods, catering platter, gallery and kraft bread box. These are not photographs of real people or products.
- Georgia, system Arial/Helvetica, and installed system script-font fallbacks replace Playfair Display, Inter and Dancing Script. Rendering may vary by OS. There is no remote-font or remote-asset build dependency.
- The map embed becomes a clearly labeled fictional SVG; social handles become local previews. Google/Yelp attribution is replaced by an explicit fictional-review disclaimer rather than fake provider endorsements. Payment names remain illustrative labels only.
- Lucide icons are supplied by `lucide-react` (ISC). React and Next.js are MIT licensed; TypeScript and Playwright are Apache-2.0 licensed. Dependencies retain their upstream notices in their installed distributions. No source-brief notices were removed; no additional third-party media was incorporated.

## Observed validation

Final validation on 2026-10-31:

- `npm run typecheck`: **passed**, strict TypeScript.
- `npm run build`: **passed**, optimized Next.js webpack production build, two workers, static homepage.
- `npm run test`: **16 passed**, eight scenarios each on desktop Chromium (1440 × 1000) and mobile Chromium emulating iPhone 13 (390 × 664, reduced motion), final run 52.1 seconds.
- Tests cover the source menu/specials, tab keyboard behavior, gallery focus restoration, options and exact totals, fractional/zero/excessive quantities, cumulative cap, empty/removal recovery, invalid email, pickup closed-day/Sunday recovery, confirmations/cart reset, catering bounds/past-date validation, gift-box Saturday recovery, newsletter reset, modal keyboard containment, mobile navigation/focus return, reduced motion, horizontal overflow across the main sections, review autoplay/hover/manual pause/swipe, story and mock social interactions.
- Final desktop/mobile full-page renders and hero screenshots were visually inspected, along with the mobile specials viewport. Screenshots remain in ignored `test-results\` scenario folders and are regenerated on each run.
- After the final browser run: **no listening process remained on port 3111**.

This is a local demo, not a real bakery or a production ordering service. It intentionally does not implement fulfillment, payment, recurring billing, backend persistence, geolocation, real sourcing/allergen verification, real customer reviews, or a real newsletter.

## Original preserved

SHA-256 checked before implementation and after final validation; original bytes unchanged:

```text
7DA3DC5771D4CCE64598E6E4B70F3DD20375C53B58260593BE596F0467B29A02
```

Only project **011** was implemented and validated in this task.
