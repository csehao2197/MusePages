# Frameshift — "How We Work" process page

- **Original prompt**: `data/prompts/032-agency-process-page/032-agency-process-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG illustrations
  - `build/pdf.mjs`: writes `assets/frameshift-process.pdf`
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/agency-process-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky white nav with the rotating-square mark, an active "Process" underline and an indigo CTA. On tablet and mobile, a full-screen slide-in overlay menu.
- **Hero:**
  - gradient background and an isometric four-block illustration
  - "Book a Discovery Call" CTA
  - "Download Process PDF", which downloads a real one-page PDF of the four phases
  - "Trusted by teams at" with six grayscale names
- **Timeline:** four numbered nodes with icons and a gradient progress line. The active node and progress follow your scroll through the phase sections, and clicking a node jumps to it. It turns vertical on mobile, with a week-allocation bar on desktop.
- **Phase sections:** four sections with badges, deliverables marked with emerald checks, an "Your involvement" note and alternating SVG mockups: brief and persona, design screens with annotations, sprint board and code diff, launch checklist and Lighthouse badge.
- **Numbers:** dark indigo band with count-up stats.
- **Testimonials:** two cards with project-type and timeline chips.
- **Toolkit:** 14 tools whose grayscale icons tint to each tool's color on hover.
- **FAQ:** six-question accordion, one open at a time.
- **Booking:** gradient CTA with a working date picker. Future weekdays are available, with time slots, month navigation and email validation; confirming shows the booked slot.
- **Footer:** four columns, newsletter validation, badges and legal links.
- **Mobile bar:** a sticky "Book a Call" bar.

## Mocks and limitations

- **Sample content:**
  - The clients and testimonials, and the Stripe/Notion/Linear/Figma/Vercel/Plaid names, come from the brief and are **illustrative**.
  - The names are plain text, not official logos, and the footer says so.
  - Tool icons are generic Lucide-style glyphs, not brand marks.
- **Booking:**
  - Availability is generated from the current date: weekdays one to 60 days ahead, minus a fixed pattern.
  - Nothing is booked or sent; the newsletter is a demo too.
  - Other pages (Services, Work, Team, Blog, Careers, legal) show a notice.
- **Badges:** the Clutch and DesignRush badges are text badges, not official widgets.

## Run and verify

From the repo root, `node out/pages/032-agency-process-page/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- nav, hero, logo names and PDF
- timeline: scroll-following progress and click-to-jump
- phase sections and their alternation
- count-up stats
- testimonials, tool hover and FAQ
- booking flow
- footer
- mobile layout, overlay, sticky bar and touch targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
