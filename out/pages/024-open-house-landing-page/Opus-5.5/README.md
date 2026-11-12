# 4821 Ridgewood Terrace open house (Pinnacle Realty)

- **Original prompt**: `data/prompts/024-open-house-landing-page/024-open-house-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/open-house-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation and hero:** sticky nav (logo, RSVP and hamburger on mobile). Twilight desert-modern hero with a Ken Burns zoom, an "Open House This Weekend" badge, price and stats, and a gold divider.
- **At a Glance:** 4×2 highlight grid, 2×4 on mobile.
- **Gallery:** 12-photo masonry with a lightbox ("1 of 12" counter, keys, swipe). On mobile, a carousel with dots.
- **The Details:** stylized floor plan (scrollable on mobile), the 14-row spec table, and a spec-sheet PDF generated in the browser.
- **Neighborhood:** map with six points of interest synced to the distance list (static map with the list below on mobile), plus three community highlights.
- **RSVP:**
  - event card and validated form, with per-slot spots-left counts
  - agent yes/no
  - a confirmation with an `.ics` download (America/Phoenix, UTC−7)
  - a private-showing request dialog
- **Mortgage calculator:** price, 5–50% down slider, 15/20/30 toggle, rate, tax, HOA and insurance. Shows the monthly total and a donut breakdown, and links to a pre-approval dialog pre-filled with the figures.
- **Agent and similar listings:** agent profile with stats, call and message actions; three similar listings (horizontal scroll on mobile).
- **Footer and floating RSVP:** three-column footer with legal text; floating RSVP button on mobile.

## Mocks and limitations

- All photography, the headshot, the floor plan and the map are original SVG illustrations. There are no photos or map tiles.
- **Payment figure:** the brief's sample payment of $14,890 does not follow from its own inputs. $1.96M at 6.75% over 30 years, plus $14,280/yr tax, $285 HOA and $3,600/yr insurance, comes to **$14,488/mo**, so the calculator shows the computed value.
- The open-house date is kept exactly as the brief gives it (Saturday, April 4, 2026), even though that date has passed.
- **Local demos:**
  - RSVP, private showing, pre-approval and messages; nothing is sent.
  - "View Listing" and the social buttons show a notice.
- **Invented to complete the brief:** room dimensions, spots-left counts, map positions and the casita placement.

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/024-open-house-landing-page/Opus-5.5/page.test.mjs` runs 10 Playwright checks at 1440×900 and 390×844 (touch):

- hero and Ken Burns animation
- highlights grid
- lightbox counter
- spec table and PDF (xref validated)
- map/list sync
- RSVP validation, slot count and `.ics`
- private showing dialog
- mortgage maths, including the 0% rate case
- agent and similar listings
- mobile nav, carousels and dots, plan scroll and floating RSVP
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
