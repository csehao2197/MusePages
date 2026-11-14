# BrightMinds — tutoring marketplace homepage

- **Original prompt**: `data/prompts/049-tutoring-marketplace-homepage/049-tutoring-marketplace-homepage.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (sample tutor data and interactions)
  - `assets/art.js`: SVG people, laptop collage, classroom, matching, progress and teaching scenes
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/tutoring-marketplace-homepage/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation and hero:**
  - sticky nav with a shadow and a purple "Get Started Free" button; a hamburger menu on mobile
  - 55/45 hero on a white-to-lavender gradient, with the rating badge and an illustrated three-laptop collage of live lessons
- **Search:** autocomplete with arrow keys and tutor counts, plus expandable filters (max price, availability, native speakers) and six popular-subject pills.
- **Trust bar and steps:**
  - stats and "As seen in" text wordmarks
  - three steps with purple numbers on a dotted connector, then a "Find Your Tutor" button
- **Subjects:** eight cards (2 columns on mobile) that open filtered tutor results. "View All" lists sample subjects.
- **Top-rated tutors:**
  - a scroll-snap carousel with arrow buttons
  - each card shows a verified mark, rating, rate, badge and online dot
  - intro "video" with timed captions
- **Booking:** "Book Free Trial" opens a slot picker plus a form with validation and confirmation.
- **Platform features:** three alternating rows, with images first on mobile. They include a working whiteboard canvas and a three-question smart-match quiz with match scores.
- **Stories:** three cards with purple left borders and highlighted results.
- **Pricing:** range bars, a "First Lesson Free" callout, package notes, a 15% bundle calculator and the guarantee.
- **For tutors:** lavender split section with an apply form that checks the $25–$80 rate range.
- **FAQ, final CTA and footer:**
  - one-at-a-time FAQ
  - gradient final CTA whose email feeds the signup dialog
  - four-column footer with socials and app badges
- **Mobile:** sticky "Find a Tutor" bar after the hero.

## Mocks and limitations

- **Tutor sample:**
  - search and results use 18 sample tutors: the brief's four plus 14 invented ones, so counts differ from the marketing stats
  - availability and online status are sample data
- **Demos:** booking, signup, login and applications send nothing.
- **Images:** all photos, screenshots and the collage are original SVG illustrations. The intro videos are captioned stills.
- **Sample content:**
  - press names and app-store badges are text, not official logos
  - people, reviews and statistics are **illustrative**; the footer says so
  - "Senior Engineer at Google" and "Princeton grad" come from the brief
- **Edits to the brief:**
  - "University of Stanford" is shown as "Stanford University"
  - the brief's emoji (subject icons, star) are replaced by icons

## Run and verify

From the repo root, `node out/pages/049-tutoring-marketplace-homepage/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav and hero
- search, filters and booking
- trust bar, steps and subjects
- tutor carousel and intro
- features, whiteboard, quiz and stories
- pricing, calculator, apply, FAQ, signup and footer
- mobile layout, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
