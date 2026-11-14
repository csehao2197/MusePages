# Trigly — comment and DM automation for creators

- **Original prompt**: `data/prompts/079-messaging-automation-saas/079-messaging-automation-saas.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app: landing page plus a demo dashboard on hash routes (`#/dashboard`, `#/automation/:id`)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/messaging-automation-saas/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD's stack (Next.js, Clerk, Prisma/PostgreSQL, Stripe, OpenAI, Instagram Graph API and webhooks) can't run in a static collection. Each piece has a browser equivalent:

| PRD piece | Browser equivalent |
|---|---|
| Clerk | Demo sign-in form (first name, last name, email, generated `user_` id) |
| Prisma models | `localStorage` (`trigly-v1`): automations, keywords, posts, listener mode and prompt, per-listener counters, DM history, plan and integration |
| Instagram OAuth | Simulated consent dialog with handle validation and a masked token |
| Webhooks | "Send test verification" echoes `hub.challenge`; "Test a message" runs the matching engine on a simulated comment or DM event |
| OpenAI (GPT-4o) | Local Smart AI reply generator driven by the automation's brief (price, link, email, intent), capped at two sentences |
| Stripe | Test-mode checkout dialog (4242 card succeeds, others decline) that sets `PRO` |

## Features

- **Landing:** hero with an animated comment-to-DM mock, features, a live trigger playground (comment/DM, static vs Smart AI, no-match), pricing (Free $0, Smart AI $99), and FAQ
- **Dashboard:**
  - overview with totals and a 14-day stacked bar chart (validated categorical colours `#2a78d6`/`#eb6834`, bars ≤24px, rounded data end, tooltip, table view, legend)
  - top automations and recent replies
- **Automations:**
  - create, edit and delete, with an on/off switch
  - comment and DM triggers; keyword chips (deduped, case-insensitive)
  - post targeting for comments
  - Message vs Smart AI listener, with Smart AI gated behind PRO
  - validation, counters and history
  - a webhook simulator where the first active match wins
- **Integrations** (connect/disconnect, webhook verification) and **Billing** (upgrade/downgrade)

## Mocks and limitations

- **Simulated services:** no real Instagram, Clerk, Stripe or OpenAI calls. AI replies come from templates.
- **Fictional demo data:** posts and statistics are fictional.
- **Browser-only storage:** data stays in this browser.
- **Independent concept:** not affiliated with Instagram or Meta, and the footer says so.

## Run and verify

From the repo root, `node out/pages/079-messaging-automation-saas/Opus-5.5/page.test.mjs` runs 10 Playwright checks:

- landing and playground replies (including the two-sentence cap)
- sign-in validation
- chart, tooltip and table
- OAuth and webhook challenge echo
- automation create/edit validation, keywords and post targeting
- webhook simulation with targeting, counters and history
- Smart AI gate and test checkout
- delete, persistence and sign-out
- mobile layout and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots of the landing page, overview, editor and automation list were reviewed visually.
