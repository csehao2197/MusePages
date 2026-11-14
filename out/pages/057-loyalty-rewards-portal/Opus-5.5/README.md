# Elevate Rewards — loyalty program page

- **Original prompt**: `data/prompts/057-loyalty-rewards-portal/057-loyalty-rewards-portal.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (member data, history generator, redemption logic); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/loyalty-rewards-portal/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Banner:** purple-to-blue gradient with greeting, member date, balance and a computed "points away from Platinum" bar (centered on mobile).
- **Tier status:** four color-coded tiers with perks, Gold highlighted with a glow, and a marker at 4,280. On mobile it becomes a vertical stepper. Below it, four Gold benefit cards.
- **Snapshot:** four stat cards computed from the history, each with a 6-month sparkline.
- **Points history:** 47 transactions with consistent running balances, green/red amounts, filters (All, Earned, Redeemed, Expired) and pagination. Rows become cards on mobile.
- **Rewards catalog:**
  - category filter and sort; insufficient-points buttons read "Need X more pts"
  - redeeming confirms the balance math, issues a demo code, adds a history row and updates the snapshot
  - redemptions never lower the tier
- **Ways to Earn:**
  - "Connect" adds 100 points once
  - "Write a Review" (validated) adds 50 points and raises tier progress
  - referral link with copy, stats and leaderboard note
- **Promotions:** Triple Points countdown and a "Set Reminder" button that downloads an `.ics`.
- **Challenges and badges:** progress bars animate in on scroll. Six earned and three locked badges show tooltips on hover and focus.
- **FAQ and join:** animated one-open-at-a-time FAQ, and a dark join CTA with validation.
- **Mobile:** sticky bar with the live balance and "Redeem".

## Mocks and limitations

- **Demo account:** a snapshot dated **Mar 12, 2026** (shown in the header). The promotion countdown runs on that demo clock, so the brief's March 2026 dates stay coherent. All changes are in-page and reset on reload; codes and emails are not real.
- **Corrected numbers** (computed rather than copied from the brief, where the brief's figures conflict):
  - "1,721 points away from Platinum" (6,001 − 4,280; the brief says 720)
  - snapshot totals come from the generated history (the brief's 12,450 / 8,170 can't come from catalog redemptions)
  - "Referral Bonus 3,500 pts" is 7 purchases × 500 (8 signed up; the brief's "8 successful referrals" would be 4,000)
  - "Next Reward" shows the distance to the next tier, because 4,280 pts already covers every catalog reward
- **Sample data:** older history rows (before Feb 14, 2026) are generated sample data. 2026 tier points start from the brief's 4,280.
- **Emoji:** none used.

## Run and verify

From the repo root, `node out/pages/057-loyalty-rewards-portal/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- banner math
- tier bar
- history rows, balances, filters and pagination
- catalog redemption flow
- earning actions, referral and promotions `.ics`
- snapshot, challenges, badges, FAQ and join
- mobile stepper, card history, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
