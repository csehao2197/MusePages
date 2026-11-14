# Ship It — podcast show page

- **Original prompt**: `data/prompts/054-podcast-website/054-podcast-website.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (episode data, player and interactions)
  - `assets/art.js`: SVG cover art, generated episode artwork and host portraits
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/podcast-website/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** dark slate gradient with 400px cover art, title, tagline, hosts and rating. Five brand-colored platform buttons (2-column grid on mobile); RSS opens a copyable feed URL.
- **Latest episode:** EP 187 card with a custom-styled player: play/pause, seekable progress, current/total time, speed (1x → 2x → 0.75x), volume and mute.
- **Episode actions:** Show Notes have clickable chapter timestamps that jump the player. Transcript excerpt, a Share dialog with a copy link, and violet tags.
- **Episode list:**
  - search, topic tabs (Founders, Engineering, Design, Growth, AI), a sort menu behind the filter icon, and "Load More" (8 at a time)
  - each row has a play button that switches the player and highlights the row
- **Popular episodes:** four cards with play-count badges (scrolls horizontally on mobile).
- **Guests:** six cards with monogram avatars and episode links (scrolls horizontally on mobile).
- **Hosts, newsletter, sponsors:** host cards with rounded-square portraits and social links; newsletter form with validation; sponsor cards and a media-kit request form.
- **Stats and footer:** stats bar, platform ratings and footer.
- **Mini player:** sticky at the bottom whenever an episode is loaded, on every screen size so episodes started from the list stay controllable. Spacebar toggles play.

## Mocks and limitations

- **No audio:** the player is a timed demo, labeled on the page. There are no audio files.
- **Show:** Ship It, its hosts and episodes are fictional.
  - EP 179–170 and the popular episodes' numbers and dates are added sample data
  - show notes and transcripts are illustrative
- **Real names:**
  - real people (Dylan Field and other guests) and companies (Figma, Stripe, Vercel, LinearB, Datadog) appear only as text, as the brief asks
  - guests get monogram avatars, not likenesses; sponsors are text wordmarks
  - the footer marks these as illustrative mentions, not endorsements
- **Links:** platform links show a demo notice. Forms send nothing.
- **Dates:** the brief lists EP 186 and EP 187 both on March 4; kept as written.

## Run and verify

From the repo root, `node out/pages/054-podcast-website/Opus-5.5/page.test.mjs` runs 5 Playwright checks:

- hero and platforms
- player controls, chapters, transcript and share
- episode search, tabs, sort, load more and row playback
- popular, guests, hosts, newsletter, sponsors, stats and footer
- mobile layout, mini player and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
