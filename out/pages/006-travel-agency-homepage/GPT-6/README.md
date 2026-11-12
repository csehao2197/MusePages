# Wanderly travel agency

Original: `data\prompts\006-travel-agency-homepage\006-travel-agency-homepage.md`; combined with root `DESIGN.md`. Authored directly by GPT-6 using actual model **gpt-6.1-sol**. Plain HTML/CSS/JavaScript, not a framework project.

Source: `index.html` plus `assets\`. Delivery: `out\index.html`, `out\assets\`, and the actual rendered `out\preview.png` at 1200 × 900. Preview capture uses the repository's temporary loopback HTTP server; no `npm start`, build, package installation, backend or environment variables. Future publication target: `deploy\dist\pages\travel-agency-homepage\GPT-6\`. Registered disabled, not deployed.

## Features

Immersive beach hero; scroll-aware transparent/white navigation; subtle reduced-motion-aware parallax; destination/date/traveler/style search; four initial and seven total local journeys; functional style and trending filters; wishlist and package dialogs; local inquiry form; proposed Bali deal with real client-side countdown; traveler stories; on-view statistics; three original short editorial excerpts; newsletter feedback and mobile drawer/search panel.

`checks.mjs` exercises wishlist, filtered search, package inquiry, view-all count, style filtering, editorial dialog and newsletter response. The session runner validates resources at the intended public subpath, captures actual desktop/mobile screenshots, checks overflow/navigation and records errors under `.checks\`. Actual state is maintained in model metadata.

## Mock behavior and limits

All travel packages, prices, review counts, customer stories, company statistics, memberships, partner relationships, guarantees and payment logos are illustrative, not verified claims. No bookings, payments, email, subscriptions, accounts, availability queries or external forms are connected. Contact number is not a live service. Wishlist and form interactions stay in the current page session.

The deal countdown uses fixed `2026-11-15T00:00:00Z`; after expiry its CTA becomes a generic planning action rather than resetting false urgency. “6 spots” is explicitly mock inventory. Search dates are optional, but incomplete or reversed date ranges are rejected; changing dates cannot query real availability. The three article titles/reading times come from the prompt; original short editorial excerpts are supplied, not full-length or live researched guides.

Georgia/Arial provide offline serif/sans typography instead of external DM Serif/Inter font services. Initials replace fictional testimonial headshots. Generic images illustrate travel, not exact named accommodation or verified locations.

Public Unsplash CDN photo IDs: `photo-1506929562872-bb421503ef21` (beach), `photo-1613395877344-13d4a8e0d49e` (Greece), `photo-1493976040374-85c8e12f0c0e` (Japan), `photo-1448375240586-882707db888b` (forest), `photo-1533105079780-92b9be482077` (Mediterranean scenery), `photo-1537996194471-e657df975ab4` (Bali), `photo-1476610182048-b716b8518aae` (Iceland), `photo-1551632811-561732d1e306` (hike), `photo-1555939594-58d7cb561ad1` (food). Individual author/license pages remain to be verified before commercial redistribution; no additional rights are granted. Lucide SVG symbols were generated from the existing repository package; ISC license is included in `assets\LUCIDE-LICENSE.txt`.
