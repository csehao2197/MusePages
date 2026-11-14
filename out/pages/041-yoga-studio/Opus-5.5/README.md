# Inhale Studio — yoga & wellness homepage

- **Original prompt**: `data/prompts/041-yoga-studio/041-yoga-studio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG studio scene, poses, portraits and maps
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/yoga-studio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:**
  - sticky white nav with the lotus-accented "Inhale" logo
  - a South Lamar/Domain location selector that drives the schedule
  - a taupe "Book a Class" button
  - on mobile, a full-screen cream overlay menu
- **Hero:** illustrated light-filled studio with a practitioner in warrior pose and a cream gradient overlay. Centered copy and two CTAs.
- **Find Your Practice:** seven class cards in a horizontal scroll, each with a muted color strip, icon, duration and level. "Book This Class" appears on hover and filters today's schedule (switching location when needed).
- **Today's Classes:**
  - the brief's seven classes
  - tabs for South Lamar, Domain and Livestream, plus type filter pills
  - linked instructor names that filter by instructor
  - teal "Book" buttons, or gray "Waitlist" when full
  - booking dialogs; a booked row updates its spots
  - on mobile, rows group into Morning/Midday/Evening accordions
- **Your Guides:** four instructor cards with portraits. On hover the card scales and "View Schedule" appears.
- **Pricing:** three tiers (Most Popular and Best Value badges), the new-student offer banner and the inclusions note. Membership dialogs.
- **Practice Anywhere:** dark section with four on-demand previews that open an animated preview player.
- **Workshops:** three cards with date blocks, prices, availability and a "Register" dialog.
- **Closing sections:**
  - horizontally scrolling testimonials
  - two location cards with illustrated maps and Google Maps direction links
  - a taupe-gradient "free class" email form
  - a four-column footer with socials
  - a floating mobile "Book Class" button

## Mocks and limitations

- **Images:** the studio, practitioner, instructors, video thumbnails and maps are original SVG illustrations, not photos or embedded maps.
- **Previews:** animated illustrations, not class videos.
- **Dates:** the schedule shows today's real date with the brief's classes. The workshops keep the brief's dates (Jan 18, Feb 1, Mar 1), which read as upcoming.
- **Demos:**
  - bookings, registrations, memberships and the free-class claim send nothing and charge nothing
  - "View Full Week Schedule", "Browse Full Library" and info pages show a notice
- **Sample content:** instructors and reviews are illustrative; the footer says so.

## Run and verify

From the repo root, `node out/pages/041-yoga-studio/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- nav and hero
- class cards and filtering from a card
- schedule tabs, pills, instructor filter, button states and booking
- guides and pricing
- on-demand, workshops, testimonials, locations and claim form
- mobile overlay, accordion, stacking, FAB and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
