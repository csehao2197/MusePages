# Crescendo Academy of Music — homepage

- **Original prompt**: `data/prompts/045-music-academy/045-music-academy.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG theater stage, lesson scene, portraits, building and map
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/music-academy/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:**
  - sticky, blurred white nav with a treble clef worked into the "C"
  - the phone number and a violet "Book a Free Trial" button
  - on mobile, a "Book Trial" mini CTA, a hamburger and a full-screen overlay menu
- **Hero:** 85vh (65vh on mobile). An illustrated historic theater stage with a pianist, a bottom overlay, a staff motif, two CTAs and the trust row.
- **Programs:**
  - four cards with violet, emerald, amber and rose top borders, prices, level paths and a hover lift (a swipe carousel on mobile)
  - "Learn More" shows 30, 45 and 60-minute pricing and pre-selects the instrument in the trial form
  - "See All Programs" lists every offering
- **Why Crescendo:** four benefits beside an illustrated violin lesson (the image stacks above on mobile).
- **Faculty:** four cards with 120px portraits (larger on mobile) and specialty tags.
- **Events:** three cards with a violet left border. RSVP and audition-application dialogs update each card once submitted.
- **Testimonials:** three cards with quote marks, italic quotes and 5 stars. On mobile, a swipe carousel with dots.
- **Free trial:** violet section with an inline form (name, email, phone, instrument, age group), validation and confirmation.
- **Location:** illustrated map with hours, parking, transit, the building exterior and a Google Maps directions link.
- **Footer:** four columns with NAMM/MTNA text badges.

## Mocks and limitations

- **Images:** all photos (stage, lesson, faculty, building) and the map are original SVG illustrations; the map isn't an embedded live map.
- **Dates:** the brief's 2026 recital dates (April–June) are kept as written, although they have passed.
- **Demos:** RSVPs, applications and trial bookings send nothing. The faculty directory, calendar, blog and policies show a notice.
- **Sample content:**
  - faculty credentials (Juilliard, Nashville Symphony, Hamilton tour) and testimonials come from the brief and are **illustrative**; the footer says so
  - the NAMM/MTNA marks are text badges, not official logos
  - the program icons replace the brief's emoji

## Run and verify

From the repo root, `node out/pages/045-music-academy/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- nav and hero
- program cards and dialogs
- why section and faculty
- event RSVP and application
- testimonials, trial form, location and footer
- mobile overlay, carousels, stacking and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
