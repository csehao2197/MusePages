# Rhythm & Flow Dance Studio — homepage

- **Original prompt**: `data/prompts/036-dance-studio/036-dance-studio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG dancers, scenes, portraits and the animated reel
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/dance-studio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** transparent over the hero, then white with a shadow on scroll. The logo has a wavy rose underline. On mobile: logo, a "Book" mini CTA and a hamburger.
- **Hero:** illustrated sunlit mirror studio with a bottom gradient, a 64px headline and two CTAs. A floating stats bar overlaps the next section (2×2 on mobile).
- **Watch Us Dance:** opens a modal "reel": an animated SVG routine with play/pause, a 30-second timer and a progress bar. The video tiles in the gallery open the same player.
- **Find Your Style:** five 3:4 cards with level badges. On hover the image zooms and a rose bar appears. Clicking a card filters the schedule to that style, with a clearable chip.
- **This Week's Classes:**
  - Mon–Sun tabs, with today's real weekday underlined in rose
  - previous/next buttons and swipe on mobile
  - each slot shows the instructor avatar, room, a level badge and spots left (rose below 5)
  - a "Book" button appears on hover; booking a slot updates its spots
- **Instructors:** 2×2 cards with 120px portraits. "View Profile" lists that instructor's classes this week.
- **Free trial:** rose-50 form (style dropdown, experience radios, validation) beside an illustration. The success message suggests the next matching class.
- **Studio Moments:** eight-tile masonry gallery (two columns on mobile), with "▶ Play" overlays on the video tiles.
- **Closing sections:**
  - testimonials
  - three pricing tiers; the "Most Popular" tier comes first on mobile; checkout and drop-in dialogs
  - footer
  - wave dividers between sections
  - a sticky mobile booking bar

## Mocks and limitations

- **No real photos or video:**
  - every image is an original SVG illustration
  - "videos" play an animated SVG reel, not real footage
- **Style card width:** on desktop the five style cards share the row (about 215px each) so all of them are visible. From tablet width down they are 280px (240px on phones) in a swipe carousel.
- **Schedule:**
  - Monday shows the brief's four classes plus a noon ballet class.
  - Other days are sample timetables.
  - Instructor names fill the brief's "Instructor Name" placeholders.
  - "View Full Schedule" and footer pages show a notice.
- **Sample content:** instructor credentials (Missy Elliott tour, Alvin Ailey, Red Bull BC One), students and quotes come from the brief and are **illustrative**; the footer says so.
- **Demos:** forms and bookings send nothing.

## Run and verify

From the repo root, `node out/pages/036-dance-studio/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- nav, hero and stats overlap
- reel modal playback
- style cards filtering the schedule
- schedule tabs, low spots, hover Book and booking
- instructors, trial form, gallery, testimonials, pricing and footer
- mobile layout and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
