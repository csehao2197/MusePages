# KVOLT — producer & beatmaker portfolio

- **Original prompt**: `data/prompts/029-music-producer-portfolio/029-music-producer-portfolio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG covers, studio scene and portrait
  - `assets/synth.js`: Web Audio beat engine
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/music-producer-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** transparent over the hero, then solid `#0A0A0F` on scroll. Social icons glow on hover; "License a Beat" CTA. On mobile, a full-screen overlay menu with large links and socials.
- **Hero:** studio-silhouette background with a Ken Burns zoom and an animated equalizer. The equalizer follows the live audio while a beat plays. Spaced label, 120px name (64px on mobile), tagline, CTAs and stats.
- **Latest Beats:** six cards (3 columns → 1 column). **Previews are synthesized live** with Web Audio at each beat's BPM and key, in trap, R&B, drill or boom-bap style: 808s, snare/clap, hats with rolls, chords and a pluck lead. No audio files are bundled.
  - A real-time waveform canvas appears under the playing card.
- **Persistent player:** cover, title, previous/play/next, seekable progress (e.g. `0:42 / 3:45`), volume and "License This Beat". On mobile it shrinks to cover, title, play and a license icon. Space bar toggles playback.
- **Licensing:** Basic, Premium ("Most Popular", purple top border, first on mobile) and Exclusive ("Full Ownership"). The license dialog has a beat picker, tier choice and price summary. Exclusive takes an offer with a $499 minimum, and a delivery email is required.
- **Discography:** horizontal row (swipe on mobile) of six placements with 240px covers. On hover, Spotify and Apple Music overlay links appear.
- **Other sections:**
  - About with a purple-tinted portrait and credentials
  - "Trusted By" wordmarks with hover glow
  - three testimonials
  - 2×2 services
- **Booking form:** service and budget dropdowns plus optional reference-URL validation, a success state and contact alternatives.
- **Footer:** three columns with a newsletter form and dialogs for each legal page.

## Mocks and limitations

- **Audio:** the beats are procedurally synthesized previews, not KVOLT's actual productions. They sound like simple demos and each runs for its nominal length (e.g. 3:45).
- **Artwork:** covers, the hero scene and the portrait are original SVG illustrations, with no real album art or photos. Label names are plain-text wordmarks, not official logos.
- **Credits are sample content:** the brief's artist placements (Lil Baby, SZA, 21 Savage, Summer Walker, Gunna, 6LACK), the labels and the stream counts are kept as **illustrative sample content, not real credits**. The page states this under the discography.
- **Invented names:**
  - testimonial artists (Nova Reign, Dre Calloway, Mila Saint), since the brief gives only "Artist name"
  - the booking email and phone
  - beats 2–6
- **Demos:**
  - licensing checkout, the booking form and the newsletter take no payment and send nothing
  - "View All" buttons show a notice
  - social and streaming links point to the platforms' home pages

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/029-music-producer-portfolio/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- hero type sizes, EQ and solid nav
- beat grid
- **real audio playback:** time advances, waveform pixels are drawn and the EQ follows the audio
- pause/resume freezes time; next, previous, seek and volume work
- licensing, including the exclusive minimum
- discography overlay and sample note
- content sections
- form, newsletter and legal dialogs
- mobile: type, single column, Premium first, swipe row, simplified player, overlay menu and 44px targets
- no runtime, resource or non-GET request errors

The test turns off CSS smooth scrolling so automated clicks don't race scrolling. Desktop, mobile and "while playing" screenshots were reviewed visually.
