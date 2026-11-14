# Punchly — digital punch card & loyalty platform

- **Original prompt**: `data/prompts/074-restaurant-loyalty-platform/074-restaurant-loyalty-platform.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/restaurant-loyalty-platform/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD's stack (Next.js, Clerk, Supabase/Drizzle, WebSockets, Storybook, ShadCN, Framer Motion) can't run in a static collection, and installing or building isn't authorized. Each piece has a browser equivalent:

| PRD piece | Browser equivalent |
|---|---|
| Clerk | **Demo sign-in** with three personas (User, Restaurant admin, System admin), stored per tab in `sessionStorage`, with role-guarded routes |
| Supabase | `localStorage` tables (`punchly-db`) mirroring the PRD's Drizzle schema: users, restaurants, punchCards, raffleEntries, prizes, prizeRedemptions, pointBalances, pointTransfers, achievements, plus punch events for analytics |
| WebSockets | **BroadcastChannel**: open the user and staff views in two tabs and a scan updates the user's card instantly |

Small schema extensions: `staffRestaurantIds` on users (to scope restaurant admins), `restaurantId`/`won` on raffle entries, and `color` on restaurants.

## Features

- **Users:**
  - punch cards (10 holes, progress, next reward) and a "Show code" dialog with the card code and live punch count
  - restaurant list and start-card buttons
  - prizes: rewards redeemed with punches (deducted from the card, pending with expiry and usage limit), plus raffles
  - points: balance, transfers with validation, history and achievements (7 types, shareable)
  - **live leaderboard** with simulated activity that can be paused
- **Restaurant admins:**
  - **scan station** (type the code or tap a guest): increments the card, adds 10 points, and is limited to the admin's own restaurant
  - completing a card creates a **raffle entry** and a fresh card
  - prize CRUD with validated rules (punches 1–10, quantity, expiration days, usage limit, terms) and an availability toggle
  - redemptions (mark redeemed or cancel; pending items auto-expire)
  - raffle draw
  - analytics: punches, active guests, completion and redemption rates, and a 14-day bar chart with tooltips and table view (chart color `#eb6834` validated with the dataviz palette script)
- **System admins:** analytics across all restaurants, add and edit restaurants, and change user roles (including assigning a restaurant admin's restaurant).

## Mocks and limitations

- **No real security:** sign-in has no passwords. Anyone can pick a persona; this stands in for Clerk.
- **Demo code, not a real QR:** the code pattern isn't a standards-compliant QR. Staff enter the printed code (for example `PCH-0001-AC`); camera scanning is simulated.
- **Simulated real-time:** updates reach other tabs in the same browser only, via BroadcastChannel. Leaderboard activity from other users is simulated.
- **Fictional data:** restaurants, people and prizes are fictional. "Reset demo data" in the footer restores the seed.

## Run and verify

From the repo root, `node out/pages/074-restaurant-loyalty-platform/Opus-5.5/page.test.mjs` runs 10 Playwright checks:

- landing and sign-in guard
- user cards, code dialog and role guard
- **two-tab real-time scan**, restaurant scoping, and completion leading to a raffle entry and new card
- prize redemption
- point transfer validation and achievement unlock
- leaderboard order, live updates and pause
- restaurant admin prize CRUD, redemptions and raffle draw
- analytics chart, tooltip and table consistency
- system admin analytics, restaurants and role changes
- mobile layout across both roles and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
