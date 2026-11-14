# GoHealth (GoSans) — wellness commerce platform

- **Original prompt**: `data/prompts/069-gohealth-commerce-platform/069-gohealth-commerce-platform.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (router, auth, store, admin)
  - `assets/data.js`: seed catalog and demo accounts
  - `assets/pack.js`: illustrated SVG packshots
  - `page.test.mjs`: browser checks
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/gohealth-commerce-platform/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD specifies Next.js 15, MySQL, Supabase Auth, Redux and Recharts. A static collection can't run those, so the same flows run entirely in the browser with `localStorage` as the "database". The PRD's V1 scope and acceptance checklist are covered:

| PRD item | How it's covered |
|---|---|
| Auth (login/register) | Demo accounts, passwords stored as SHA-256 hashes, show/hide password |
| Protected routes | `#/cart`, `#/checkout`, `#/orders` need sign-in; `#/admin` needs the admin role |
| Persistent cart | Per user, survives reload and logout/login |
| Accurate 7-day chart | Derived from the order records |
| Category CRUD | Updates the storefront immediately |

Nice-to-haves included: password visibility toggle, toasts, PDF admin report and a customer PDF invoice.

## Features

- **Storefront:** hero, category tiles and nav, 16 products, sort, search and product detail with quantity.
- **Purchase flow (PRD flow 1):** adding to cart while signed out prompts login. After signing in, the add completes and the user returns to the product.
- **Cart:** quantity, remove, subtotal/shipping/tax totals and a free-shipping threshold.
- **Checkout:** address and test-card validation (Luhn, future expiry, CVC). Placing an order clears the cart and opens the order detail with a downloadable PDF invoice. The order history lists past orders.
- **Admin dashboard (PRD flow 2):**
  - KPIs (7-day orders, revenue, AOV, categories) and a recent orders table
  - **7-day bar chart** built with the dataviz method: one validated series color (`#16A34A`, passes the palette check on the light surface), bars capped at 24px with 4px rounded data-ends on a baseline, recessive grid, selective direct labels (max and today), hover/focus/tap tooltips, Orders↔Revenue toggle on a single axis, a table view and a PDF report
- **Category management:** create (validated, case-insensitive unique), inline rename (Enter/Escape) and delete with confirmation (products move to "Uncategorized"). Changes show immediately in the nav, tiles and storefront.

## Mocks and limitations

- **Demo accounts:** customer `demo@gohealth.example` / `demo1234`; admin `admin@gohealth.example` / `admin1234`. Users, sessions, carts, categories and orders live in this browser's `localStorage` (`gh-*` keys). This is not real security; a production build would use Supabase Auth and RLS as specified.
- **Payment:** simulated, with no provider connected (the PRD lists the provider as an open question). Use test card 4242 4242 4242 4242.
- **Sample analytics:** store-wide history is deterministic sample data per calendar day, plus real orders placed in this browser.
- **Sample products:** products and packshots are fictional illustrations, not real brands or photos.

## Run and verify

From the repo root, `node out/pages/069-gohealth-commerce-platform/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- storefront browsing
- purchase flow with login redirect and pending add
- cart persistence, totals and protected-route guards (including the admin-only denial)
- checkout validation, order, history and PDF invoice
- admin chart accuracy (removing the new order drops today's bar by exactly that order), tooltip, toggle, table and PDF report
- category CRUD reflected in the storefront and persisted
- registration
- mobile layout, chart fit and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
