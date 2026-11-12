# Casa Azul vacation rental listing (StayDirect)

- **Original prompt**: `data/prompts/009-vacation-rental-listing/009-vacation-rental-listing.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/index.html` + `out/styles.css`, `out/app.js`, `out/assets/scenes.js`; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/vacation-rental-listing/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

Sticky header with currency selector (USD/EUR/GBP), Sign In and Book Now, condensed to logo + Book + menu on mobile. Breadcrumb, listing title, rating and location links, save/share/report actions and Superhost badge. Five-photo mosaic opening a 42-frame lightbox (arrows, keyboard, swipe, thumbnails); on mobile, a swipe carousel with dots and a 1/42 counter. Quick stats, highlights, expandable description, three bedroom cards, amenity grid with a 28-item categorized modal. Two-month availability calendar (one month with swipe on mobile) with booked dates, check-in/out labels, 3-night minimum and booked-night checks. Map illustration with privacy radius and zoom, plus nearby distances. Sticky booking card: date picker, guest stepper (max 6 guests, 1 pet), and a price breakdown that matches the prompt (7 nights = $3,332, 16% IVA, no service fee). On mobile it is a fixed bottom bar that expands into a booking sheet. Reviews with rating bars, six cards and a searchable modal; host profile with a message form; house rules, cancellation timeline and safety notes; scrollable similar listings with hover zoom; four-column footer with language/currency selectors.

## Mocks and limitations

- Photography is replaced by original SVG illustrations: 14 villa scenes at three times of day make up the 42-photo tour; similar listings use 4 more. No licensed photos are bundled.
- Availability and booked dates are generated relative to today in the browser. "Updated 2 hours ago" is static text.
- Reserve, message, report and sign-in validate locally and show demo confirmations; nothing is sent and no payment is taken. Currency uses fixed indicative rates. Language selection shows a "coming soon" notice.
- The full review modal holds the 6 sample reviews, not all 127. Nav and footer links are in-page anchors.
- The prompt's emoji are rendered as Lucide icons (inline SVG sprite), per `DESIGN.md`.
- Fonts load from Google Fonts, with system fallbacks when offline. Saved listings and currency persist in `localStorage` when it is available.

## Run and verify

Serve `out/` from any static server (the page uses relative URLs and works under `/pages/vacation-rental-listing/Opus-5.5/`). From the repo root, `node out/pages/009-vacation-rental-listing/Opus-5.5/page.test.mjs` runs 17 Playwright checks at 1440×900 and 390×844 (mobile touch). They cover pricing, the minimum stay, booked dates, guest limits, currency, reserve, lightbox, modals and forms, mobile sheet, carousel, menu, no horizontal overflow, and no runtime, resource or non-GET request errors. Desktop and mobile screenshots, including open calendar, lightbox and booking sheet states, were reviewed visually.
