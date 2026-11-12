# FlyFair flight comparison

Original: `data\prompts\003-flight-search-and-booking-page\003-flight-search-and-booking-page.md`, combined with root `DESIGN.md`. Directly authored by GPT-6, actual model **gpt-6.1-sol**. Plain HTML/CSS/JavaScript with no build, dependencies at runtime, external requests or environment variables.

Source is `index.html` plus `assets\`. Delivery is `out\index.html`, `out\assets\`, and the actual rendered `out\preview.png` (1200 × 900). The future public destination is `deploy\dist\MusePages\pages\flight-search-and-booking-page\GPT-6\`. It is only registered disabled, not deployed.

## Features

Sticky editable flight search, airport swapping, one-way and round-trip modes, validated multi-city request summary, seven-day and full-month date selectors, thirty deterministic sample results (ten initially, twenty more on demand), price/stop/airline/time/duration/layover/alliance filters, weighted best/price/duration/time sorting, expanded timelines and fare comparison, demo fare selection, currency display, mock price alerts, similar routes, responsive filter dialog and mobile navigation.

`checks.mjs` verifies filtering and resets, sort order, fare details/selection, load-more count, month/date interaction, currency display, price alerts, empty results and mobile filter opening/closing. The session runner validates resources at the intended public subpath, captures browser previews and mobile evidence, checks viewport overflow/navigation and records errors under `.checks\`. Actual state is recorded in model metadata.

## Mock behavior and limits

The original April 2026 search is a fixture, not current live availability. The illustrative 247-flight headline is explicitly labeled; only thirty real local fixture records exist. All airline schedules, aircraft details, durations, returns, gates, fares, baggage rules, reviews, guarantees and certification badges are invented demonstration values, not verified offers or affiliations. Airline names use typographic identifiers rather than copied trademark logos.

Changing the search updates the sample comparison but does not query route-specific schedules. Multi-city validates and shows the request without pretending to provide matching fares. Currency conversion is fixed for demonstration (EUR 0.92 / GBP 0.79 per USD), not live FX. Calendar amounts are illustrative date comparisons, not guaranteed re-priced inventory.

No accounts, alerts, bookings, price locks, payment, refunds, cookies or external support services are connected. Forms send no data. Other travel product links lead to the concept information area, not nonexistent pages. Georgia is not used; offline Arial is the sans-serif fallback to the requested Inter styling.

`assets\icons.svg` is generated from the existing Lucide React package; its ISC notice is preserved in `assets\LUCIDE-LICENSE.txt`. No photographs or downloaded airline logos are needed.
