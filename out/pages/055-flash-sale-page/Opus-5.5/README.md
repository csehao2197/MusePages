# VoltEdge — flash sale & daily deals page

- **Original prompt**: `data/prompts/055-flash-sale-page/055-flash-sale-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (deal data, timers, cart and interactions)
  - `assets/art.js`: generic SVG product illustrations
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/flash-sale-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Announcement bar and nav:**
  - amber announcement bar (static on desktop, scrolling marquee on mobile)
  - nav with the active "Deals" link, a 280px search that filters deals live, account and cart buttons, and an animated item-count badge
- **Hero:** 50vh dark hero with a geometric pattern, a glowing 72px amber headline (40px on mobile), floating product art, and a live countdown to local midnight in 80px monospace boxes (56px on mobile) that flip as they change.
- **Category tabs:** sticky, with deal counts and an amber underline. They filter the grid and the Lightning Deals.
- **Deal of the Day:** two-column card (stacked on mobile) with SAVE badge, rating, prices, savings, features, a ticking countdown, the red low-stock line and Add to Cart.
- **Deals grid:** nine cards (horizontal cards on mobile), each with a discount badge, wishlist heart, rating, struck-through original price, amber sale price, mini countdown and Add to Cart.
- **Stock bars:** color thresholds (green >50%, yellow 20–50%, red <20%) and labels. Adding the last units shows "Sold out".
- **Urgency banner:** pulsing banner between deal rows.
- **Lightning Deals:** carousel of 220px cards with "EXTRA 10% OFF", the extra discount applied, and seconds countdowns. Arrows, grab-to-scroll with the mouse, swipe on touch.
- **Based on your browsing:** four cards with "you viewed…" notes.
- **Alerts and trust bar:** deal-alert signup with validation, and a trust bar.
- **Cart:** drawer with quantity steppers, subtotal, savings and a free-shipping hint. On mobile, a sticky "View Cart (n)" bar appears after adding items.

## Mocks and limitations

- **Sample data:** prices, stock, review counts, "items sold in the last hour", "you viewed" notes and per-deal timers are sample data. Timers count from page load; the master countdown counts to real local midnight.
- **Demo cart:** stock changes as you add items and resets on reload. Checkout is disabled; the alert form sends nothing.
- **Images and names:** product names (Sony, Apple, Samsung and others) are descriptive text only. Images are generic illustrations, not manufacturer photos or logos.
- **Edits to the brief:**
  - the brief's emoji are replaced by icons
  - the brief's "four boxes" lists three units (hours, minutes, seconds), so three are shown
  - Lightning Deal badges show the total discount after the extra 10%
  - the iPad sits under "Laptops" and the TV under "Smart Home", since the brief's category list has no tablet or TV tab

## Run and verify

From the repo root, `node out/pages/055-flash-sale-page/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- nav and hero countdown accuracy
- deal of the day and cart badge
- category counts, filtering and search
- deal grid badges, stock colors and urgency banner
- sell-out, lightning deals, grab-scroll, recent items, cart math, alerts and trust bar
- mobile marquee, sizes, horizontal cards, sticky View Cart bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
