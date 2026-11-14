# IGNITE 30 — PulseUp fitness challenge landing page

- **Original prompt**: `data/prompts/034-fitness-challenge-landing-page/034-fitness-challenge-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG scenes and avatars
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/fitness-challenge-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky dark nav with section highlighting. On mobile: logo, a "Join" mini CTA and a hamburger.
- **Hero:**
  - illustrated gym and kettlebell scene behind a 75% slate overlay
  - live ticking countdowns in the hero and final CTA
  - headline and CTA
  - a sign-up counter that counts up, with five avatars
- **Six feature cards:** with Lucide-style icons and an orange glow on hover.
- **Week 1:** seven 200px day cards in a horizontal swipe row with arrow buttons. Each has a difficulty stripe (green, yellow or red), duration and level tags. Days 1–3 open a workout preview dialog. Days 4–7 are blurred behind a "Sign up to unlock" lock.
- **Transformations:** three cards with blurred before/after placeholders, metrics, quotes and 5-star ratings.
- **How it works:** a four-step timeline with orange nodes (vertical on mobile).
- **Leaderboard:** medal badges, workout progress bars, a points tooltip and a "Your name could be here" join row. It becomes cards on mobile.
- **Pricing:** Free and a glowing Pro ($29, with $49 struck through). Pro comes first on mobile. Includes the refund note.
- **FAQ:** accordion with animated height and a +/− toggle.
- **Final CTA:** group-workout scene, a second countdown, urgency copy and a capacity bar.
- **Join dialog:** name, email, starting level and partner match. Submitting increments the live counter.
- **Footer:** footer and a sticky mobile "Join" bar.

## Mocks and limitations

- **Countdown and dates:** the brief fixes the start date at April 1, 2026, which has passed (it is November 2026). It also shows "06 Days : 14 Hours : 23 Minutes : 08 Seconds". The timer starts from that value when the page loads and ticks down live. The April 1, 2026 copy is kept as written.
- **Images:**
  - The hero, final CTA, before/after photos and avatars are original SVG illustrations, not photographs.
  - The before/after slots are blurred placeholders, as the brief describes.
- **Emoji:** the brief's emoji are replaced with icons and medal badges, following DESIGN.md.
- **Demos:**
  - The sign-up count starts at the brief's 2,847 and changes only on the page.
  - Joining and Pro checkout send nothing and take no payment.
  - Footer pages and "See All Transformations" show a notice.
- **Sample content:** challenger names, stats and quotes are illustrative; the footer says so.

## Run and verify

From the repo root, `node out/pages/034-fitness-challenge-landing-page/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- nav and hero, including the live countdown and counter
- features and hover
- day cards, locking and preview
- results
- timeline, leaderboard and tooltip
- pricing and the join flow
- FAQ animation
- final CTA and footer
- mobile layout, sticky bar and 48px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
