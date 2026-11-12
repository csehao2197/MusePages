# Maya Torres — illustrator portfolio

- **Original prompt**: `data/prompts/028-illustrator-portfolio/028-illustrator-portfolio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js` (procedural SVG illustrations); browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/illustrator-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** transparent over the hero and solid on scroll. Instagram and Behance links and a dark/light toggle (follows the OS, then persists). On mobile, a full-screen overlay menu with a focus trap and Esc to close.
- **Hero:** 100vh with *The Midnight Garden* full-bleed, a bottom gradient, the 64px name and tagline, an animated scroll cue and subtle parallax.
- **Selected Work:**
  - true masonry: CSS grid rows spanned from each piece's aspect ratio, kept in DOM reading order
  - 3, 2 or 1 columns depending on width
  - 18 pieces (6 shown, Load More)
  - filters with a rose underline and a fade swap, announced to screen readers
  - hover/focus overlays with title, category and "View Project →"
  - Motion pieces are animated SVGs with a badge
- **Project overlay:** dialog up to 1200px wide (full-screen on mobile) with:
  - a 3-view carousel (arrows, keys, swipe)
  - the client/category/year/tools panel (the Bloomberg piece uses the brief's exact text)
  - a 2-column sub-grid
  - X, Esc and backdrop close
- **About:** 60/40 layout with portrait, bio, stats and a generated CV PDF.
- **Services:** three cards with prices and turnaround; "Inquire" pre-fills the contact form.
- **Prints & Originals:** horizontal scroll of four prints with a quick view (size changes the price, plus a demo reservation).
- **Testimonials:** auto-scroll that pauses on hover, focus or touch.
- **Contact:** validated form and info column; footer with a privacy dialog.
- **Motion:** fade-ins on scroll; reduced motion disables parallax, auto-scroll and fades.

## Mocks and limitations

- **Artwork:** original, procedurally drawn SVG illustrations — no real portfolio images, GIFs or video. The portrait is an illustration.
- **Clients and testimonials:** the brief's clients (Bloomberg, The New Yorker, HarperCollins, Oatly, Wired) and its testimonials are kept as given but are **illustrative sample content, not real engagements or endorsements**.
  - The page shows this note under the testimonials.
  - Client "logos" are generic monograms.
  - The Oatly-themed illustration avoids the brand's real slogan.
- **Invented to fill the 18-piece grid:** clients for non-brief pieces (Moonwell Press, The Weekly Ledger, Little Wave Books, Rose City Kite Festival, Fauna Coffee, Luna Tea), print editions and prices.
- **Demos:**
  - the contact form, print reservation and "Browse All Prints" don't send or sell anything
  - social links point to the platforms' home pages
  - `hello@mayatorres.com` is shown as written in the brief

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/028-illustrator-portfolio/Opus-5.5/page.test.mjs` runs 10 Playwright checks:

- hero size, typography, solid-on-scroll nav and parallax
- masonry columns, Load More to 18 and the motion badges
- filters with underline colour and announcements
- project overlay details, carousel and Esc
- About, CV PDF and service pre-fill
- shop quick view
- testimonial auto-scroll and pause
- contact validation and dark-mode persistence
- mobile single column, overlay menu, full-screen modal with swipe and 44px targets
- reduced motion with OS dark mode
- no runtime, resource or non-GET request errors

The test turns off CSS smooth scrolling so automated clicks don't race scrolling. Desktop, mobile and dark-mode screenshots were reviewed visually.
