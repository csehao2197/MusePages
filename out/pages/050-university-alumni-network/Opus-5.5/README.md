# Crestfield University — alumni network homepage

- **Original prompt**: `data/prompts/050-university-alumni-network/050-university-alumni-network.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (sample data and interactions)
  - `assets/art.js`: SVG campus, portraits, mentor call, news thumbnails and dot world map
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/university-alumni-network/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** 60vh illustrated autumn campus with a dark gradient, purple and white-outline CTAs, and a white stat bar with icons overlapping the next section.
- **Spotlight:** three stories with 120px portraits and "Read Story" dialogs. On mobile, a swipe carousel with dots.
- **Events:**
  - date column, color-coded badges and per-event actions
  - register, RSVP and join forms with validation and guests for the reunion
  - "Save the Date" downloads an `.ics` file
  - full calendar dialog; stacked cards with the date on top on mobile
- **Directory:**
  - search plus Class Year, Industry, Location and Chapter filters over a 16-person sample (a "Filters" toggle on mobile)
  - shows four cards until login; "Connect" asks you to log in first, then marks the request sent
- **Mentorship:** tinted split section with stats, a video-call illustration, a testimonial and a mentor sign-up form.
- **Giving:**
  - progress bars animate on scroll, with the Annual Fund and three campaigns
  - the gift dialog (preset or custom amount, monthly option) adds the gift to the fund total and the donor count
- **Chapters:** dot world map with keyboard-accessible pins that highlight cards, six chapter cards with flags and join toggles, and a nearest-chapter lookup.
- **News:** three cards with 16:9 thumbnails and badges.
- **Benefits:** an 8-item grid that becomes an accordion on mobile.
- **Sign-up and footer:** diagonal-pattern sign-up banner that creates a demo account; footer with columns, socials and address.
- **Mobile:** sticky "Join the Network" bar.

## Mocks and limitations

- **Sample content:** Crestfield, its people, events, campaigns, rankings and figures are fictional; the footer says so. Directory, chapter and campaign data are in-page sample data.
- **Demos:** login accepts any email and password. Gifts, RSVPs and forms send and charge nothing; changes last only until reload.
- **Dates:** the brief's 2026 event dates (April–October) are kept as written, although they have passed.
- **Images:** campus photo, headshots, map and thumbnails are original SVG illustrations. The map is a stylized dot map, not a geographic map service.
- **Edits to the brief:** campaign percentages are computed from the amounts and rounded to match the brief, e.g. $2.18M of $3M shows 73%.

## Run and verify

From the repo root, `node out/pages/050-university-alumni-network/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- hero and stat bar
- spotlight
- events and `.ics`
- directory search, filters and login gate
- mentorship
- giving and progress
- chapters and map
- news, benefits, sign-up and footer
- mobile layout and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
