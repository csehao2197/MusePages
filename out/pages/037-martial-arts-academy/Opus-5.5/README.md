# Iron Path Academy — martial arts homepage

- **Original prompt**: `data/prompts/037-martial-arts-academy/037-martial-arts-academy.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG training scenes and portraits
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/martial-arts-academy/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky charcoal nav with the crossed-fist mark, a red "Path", the phone number and a CTA. On mobile, a dark slide-out drawer and a sticky "Free Trial Class" bar with a call button.
- **Hero:** illustrated mat room (heavy-bag kick, pad drilling, grappling) with a left gradient and slow parallax. Includes the eyebrow badge, two CTAs and three trust badges.
- **Choose Your Discipline:**
  - accessible tabs for BJJ, Muay Thai and MMA, with arrow keys (a dropdown on mobile)
  - each tab has a scene, description, competitive callout and class cards
  - "Try this class" pre-fills the trial form
- **Built Different:** four value cards.
- **Belt progression:** five BJJ ranks with belt bars, descriptions, average time and student counts with bars, on a dark band. It becomes a vertical timeline on tablet and mobile.
- **Coaches:** four cards with a hard-shadow hover. "View Bio" appears on hover and opens a bio dialog with that coach's classes.
- **Pricing:**
  - three tiers with the "Most Popular" and "Best for Families" badges; Most Popular comes first on mobile
  - a copyable IRONPATH50 code
  - the plan dialog applies the code (first month 50% off, e.g. $84.50)
- **Testimonials:** three cards with portraits and 5-star ratings.
- **The Academy:** six facility scenes that auto-advance (pausing on hover, focus or touch), with arrows and swipe snapping.
- **Free trial:** red-gradient form with phone and email validation and a date picker limited to the next 60 days.
- **Footer:** four columns with the address, hours and socials.

## Mocks and limitations

- **Images:** every photo (hero, programs, coaches, members, facility) is an original SVG illustration.
- **Demos:**
  - Bookings and checkout send nothing and take no payment.
  - Blog, FAQ and other resource pages show a notice.
- **Sample content:** coach records and credentials (IBJJF, WBC), competition stats, members and reviews come from the brief and are **illustrative**; the footer says so.
- **Badges:** "USA Boxing Certified" and "IBJJF Affiliated" are text badges, not official logos.

## Run and verify

From the repo root, `node out/pages/037-martial-arts-academy/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- nav, hero and parallax
- program tabs and keyboard navigation
- value cards, belts and coach bio
- pricing promo code
- testimonials, facility strip and trial form date validation
- mobile drawer, dropdown, vertical belts, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
