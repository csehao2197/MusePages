# FlyFair flight search results (JFK → NRT)

- **Original prompt**: `data/prompts/003-flight-search-and-booking-page/003-flight-search-and-booking-page.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/flight-search-and-booking-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Header**: sticky nav with a currency switcher (USD/EUR/JPY re-prices everything).
- **Search bar**: sticky. Trip-type tabs, origin/destination swap, date inputs, a travelers popover and cabin select, with validation. On mobile it collapses to a summary strip with a "Modify" button.
- **Price calendar**: collapsible 7-day bar chart with cheap/average/expensive coloring, plus a full April month view. Picking a date updates the search.
- **Filters**:
  - Dual-handle price slider with a fare histogram.
  - Stops, airlines (with "show more"), departure and arrival time slots, duration slider, layover airport chips and alliances, all with live counts.
  - Removable active-filter chips, and a reset.
- **Sorting**: Best, Cheapest, Fastest, Earliest and Latest, with a tooltip explaining "Best".
- **Result cards**: airline monogram, outbound and return legs (+day indicator, stop dots, route line with plane), price per person and total, and Select.
- **Card details**:
  - Badges: Best Value, Cheapest and Fastest.
  - Expanding details show per-segment timelines with terminal/gate, layovers (with terminal-change flags), amenities, seat pitch and width, and aircraft age.
  - Three fare classes, a baggage policy, and a booking review dialog.
- **Extras in the list**: a sponsored card after the 3rd result and a trust bar after the 5th.
- **Loading more**: "Show 20 more flights" with skeleton loading, an optional infinite-scroll toggle, and a "Showing X of N" count.
- **Sidebar widgets**: price alert, similar routes (these re-run the search) and a FlyFair tip. Then a footer with trust badges.
- **Mobile**: filters open in a bottom sheet with a "Show N flights" button, sorting uses a sort sheet, and a sticky bar shows "N flights from $X" with Sort and Filter buttons. Touch targets are ≥44px.

## Mocks and limitations

- All 247 itineraries are generated deterministically in the browser (seeded). Their stop and airline counts match the prompt. The reference ANA NH 9 ($892), the cheapest ($876) and the JAL nonstop are pinned. Times and segments are illustrative.
- Changing the route, dates or class re-labels the sample results; it does not fetch new fares. Multi-City shows round-trip samples with a notice.
- Airline marks are generic colored monograms, not official logos. The trust badges are text labels.
- Booking, price lock, the price alert, sign-in and sponsored deals are local demos; nothing is sent or booked.
- The Inter font loads from Google Fonts, with system fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844: no console, page or resource errors, no horizontal overflow. Also verified: counts, filters and chips, sorting, expand and fares, the booking dialog, load more, price and duration sliders, calendar and month view, swap, validation, travelers, currency, price alert, the mobile modify strip, the filter and sort sheets, and touch-target sizes. Desktop and mobile screenshots were reviewed visually.
