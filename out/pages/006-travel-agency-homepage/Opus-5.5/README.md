# Wanderly travel agency homepage

- **Original prompt**: `data/prompts/006-travel-agency-homepage/006-travel-agency-homepage.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/travel-agency-homepage/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav**: transparent over the hero, turning white with a shadow on scroll. Phone, wishlist counter and Plan My Trip; a slide-in drawer on mobile.
- **Hero**: full-viewport aerial-beach hero with parallax, and a floating trip search card (destination, date range with validation, traveler stepper, trip style). It collapses to a panel on mobile. Trending quick links filter destinations.
- **Destinations**: four featured cards (hover zoom, wishlist hearts), with View All for eight. Six trip-style cards filter the destinations ("Showing Adventure trips", with Clear).
- **How it works**: three steps with a dotted connector and a Start Planning dialog.
- **Deal of the Week**: Bali terraces background, crossed-out price, a live countdown, Claim This Deal (pre-fills the plan form) and a spots-left counter.
- **Social proof**: reviews on a teal tint, and a dark stats band with count-up numbers (2×2 on mobile) plus partner wordmarks.
- **Bottom of page**: three blog cards, a teal-gradient newsletter with validation, a footer with trust/payment badges, and a sticky mobile "Plan My Trip" bar.

## Mocks and limitations

- Photography is replaced by generated SVG illustrations (no licensed photos are bundled).
- Bali, Iceland, Patagonia and the Maldives are extra sample destinations added so the trending links and trip-style filters have results. Their prices are illustrative.
- Partner names are plain text wordmarks, not the companies' logos, and imply no real partnership. Blog authors and review dates are placeholders.
- The deal countdown starts at 2d 14h 32m when the page opens (a demo timer), and the spots counter is local.
- Plan My Trip, newsletter and article links are local demos; nothing is sent.
- The prompt's emoji are replaced with Lucide-style icons, per `DESIGN.md`. Fonts load from Google Fonts with fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844 (the layout viewport stays 390px): no console, page or resource errors, no horizontal overflow. Also verified: nav state, search validation and filtering, the traveler stepper, trending links, style filters, View All, wishlist, the countdown, count-up stats, the deal → plan dialog with validation, the newsletter, the mobile drawer, the collapsible search, the carousel and the 2-column grids. Desktop and mobile screenshots were reviewed visually.
