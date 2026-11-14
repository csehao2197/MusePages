# LinguaLeap — language learning app landing page

- **Original prompt**: `data/prompts/044-language-learning-app-landing-page/044-language-learning-app-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/flags.js`: drawn SVG flags and step illustrations
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/language-learning-app-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav with the globe speech-bubble logo. The English/Español/Français selector actually translates the nav and hero copy. On mobile, a slide-out drawer and a sticky "Start Free" bar.
- **Hero:** an HTML/CSS phone mockup with an animated AI chat, live waveform, XP bar and floating cards. "Watch How It Works" opens an auto-advancing three-step walkthrough.
- **Featured In:** a grayscale press bar (an auto-scrolling marquee on mobile).
- **Language selector:**
  - five cards with drawn SVG flags (instead of the brief's flag emoji, per DESIGN.md)
  - hover scale with a purple glow
  - the cards act as a radio group with arrow-key support
  - choosing a language updates a sample lesson preview: words, romanization, a sentence, and "Listen" buttons using the browser's speech synthesis when available
- **How it works:** three numbered steps with gently animated illustrations and a dotted connector.
- **Mini lesson:** match Hola, Gracias, Amigo and Libro by tap or drag-and-drop. Wrong matches shake; a progress bar fills; finishing shows confetti, "+40 XP" and a reset.
- **Features and progress:** six feature cards, and a progress dashboard (32-day streak, B1 68%, weekly XP chart, 1,240 words) with three stat callouts.
- **Testimonials:** three with 5-star ratings.
- **Pricing:** the annual toggle saves 40% ($5.99 and $8.99 per month), Pro is scaled up, and every "Start Free Trial" opens a sign-up dialog.
- **FAQ:** accordion with animated height, where the + rotates to ×.
- **Closing:** a purple-gradient final CTA with App Store and Google Play badges, and a four-column footer.

## Mocks and limitations

- **Demos:** sign-ups, trials and the language selector's account flow create nothing. The pronunciation coach and AI chat are illustrated, not live speech recognition.
- **Audio:** "Listen" uses the Web Speech API when present, and otherwise shows a notice.
- **Sample content:**
  - press names are plain-text wordmarks, not official logos
  - app stats, testimonials and press mentions come from the brief and are **illustrative**; the footer says so
  - the testimonial's competitor mention is kept as written
- **Store badges:** generic styled links to the app stores, not the official badge artwork.

## Run and verify

From the repo root, `node out/pages/044-language-learning-app-landing-page/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- nav, site-language switching and hero
- the watch modal and press bar
- language cards, preview and keyboard
- steps
- mini lesson (wrong match, tap, drag, success, reset)
- features, dashboard, testimonials, pricing toggle and sign-up, and FAQ animation
- final CTA and footer
- mobile drawer, scrolling, stacking, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
