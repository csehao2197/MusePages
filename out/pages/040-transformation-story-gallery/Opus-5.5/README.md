# Ascend Fitness — transformation stories page

- **Original prompt**: `data/prompts/040-transformation-story-gallery/040-transformation-story-gallery.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: parametric before/after figure illustrations
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/transformation-story-gallery/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Before/after sliders:** drag with mouse or touch, or use the keyboard (an accessible range input underneath). Used in the hero, the featured story, each story view and the comparison gallery.
- **Featured transformation:** Sarah M. with 65 lbs, 8 months and 38% → 22%, a quote and "Read Full Story".
- **Gallery:**
  - search plus filters for goal, gender, age range, time frame and program
  - sorting by Most Recent, Most Popular or Biggest Transformation
  - a live count and an empty state
  - 12 story cards in three columns: hover reveals the After image, a Before/After toggle, and swipe on mobile
- **Story view:** "View Story" opens a full story with all the brief's sections:
  - profile, journey (starting point, motivation, goals, timeline)
  - four progress photos and a comparison slider
  - stats breakdown (weight, body fat, waist, hips, a strength lift, heart rate)
  - the program, quotes and insights, and a trainer's note with a portrait
  - a share button
- **Video stories:** four tiles that open an "animated reveal" player with play/pause and a timer.
- **Results by program:** five cards that filter the gallery.
- **Aggregate stats:** band that counts up.
- **Drag to compare:** carousel with dots, next/previous, auto-play (moves the divider and advances) and share. Share uses the Web Share API or copies a `#story-…` link; opening that link opens the story.
- **Disclaimer:** transparent note.
- **Submit your story:** form with local photo previews, a consent checkbox and validation.
- **Closing sections:** CTA with program options and a free-consultation dialog, FAQ, and a #TransformationTuesday feed and tags.

## Mocks and limitations

- **No real photos or video:**
  - every before/after, progress and feed image is an original illustrated figure generated from parameters
  - "videos" are animated crossfade illustrations
  - the disclaimer says the page uses illustrated stand-ins instead of the brief's "Photos are unedited" claim
- **Invented brand and sample content:** the brief names no gym, so "Ascend Fitness", the trainers, all 12 members and their stories, measurements and ratings are invented and illustrative; the footer says so.
- **Story view:** a dialog in place of a separate page, so it stays within the static homepage. Some journey text is generated from each member's data.
- **Demos:** uploads stay in the browser, and nothing is submitted or sent. Instagram links point to the platform home page.

## Run and verify

From the repo root, `node out/pages/040-transformation-story-gallery/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- hero slider (drag and keyboard)
- featured story and the full story view
- filters, search and sort
- card hover and toggle
- videos, program filters and stats
- comparison gallery (auto-play and share)
- submission with photo upload and consent, consultation, FAQ and feed
- mobile: no overflow, swipe toggle and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
