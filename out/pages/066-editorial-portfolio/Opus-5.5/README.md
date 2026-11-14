# Mara Ellison — editorial portfolio

- **Original prompt**: `data/prompts/066-editorial-portfolio/066-editorial-portfolio.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/content.js`: the single content source
  - `assets/art.js`: original SVG portrait and project imagery
  - `assets/resume.pdf`: a static one-page PDF generated from `content.js` by a Node script in the session scratchpad (not part of this folder)
  - `page.test.mjs`: browser checks
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/editorial-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD suggests Next.js, Tailwind CSS and Framer Motion. `DESIGN.md` allows plain HTML, and this run isn't authorized to install packages or build. The site therefore uses CSS transitions plus IntersectionObserver, which the PRD explicitly allows as an alternative.

## Features

- **Navigation:** sticky nav with About, Experience, Projects, Contact and Resume anchors, an outlined "View Resumé" CTA, scroll-spy and a hamburger menu on mobile.
- **Hero:** full-viewport asymmetric editorial grid with a serif name, tagline and pitch. Cursor-driven parallax layers and cover image respond to mouse movement. The effect is reduced on tablets and disabled on touch devices, on mobile and with reduced motion. Includes an animated scroll cue.
- **About:** two columns with drop cap, portrait (editorial crop and frame, descriptive alt text) and a serif pull quote.
- **Skills & Experience:** one section with a typographic toolkit in 4 categories (no progress bars) beside a compact timeline.
- **Projects:** 4 case studies on an editorial grid with varied card sizes.
  - clicking a card expands it inline with a smooth height transition, one at a time
  - each case study covers Context, Role & Approach, Outcome metrics, Stack and Links
  - Collapse button, Escape to close, closed panels are `inert`
- **Contact:** centered "Let's work together" with a prominent scheduler: next 5 weekdays, time slots, validated booking and a `.ics` download. Also an email link and GitHub/LinkedIn icons.
- **Resume:** an inline one-page sheet (the PRD's "image fallback" option, rendered as accessible HTML from the same content) plus "Download PDF" and "Open in new tab" for the static `assets/resume.pdf`.
- **Motion and SEO:** subtle fade/slide reveals, smooth anchor scrolling, meta and Open Graph tags.

## Mocks and limitations

- **Fictional person:** Mara Ellison, her employers, projects, metrics and talks are fictional. Project and portrait images are original SVG illustrations, not photos or screenshots.
- **Scheduler:** it stands in for a Calendly embed. It books nothing and sends no invitations; the `.ics` file is generated locally. Days are the next 5 weekdays from the visitor's current date.
- **Placeholder links:** GitHub, LinkedIn and project links show a toast. Email uses an `.example` domain.
- **Inline resume:** the inline resume is HTML rather than an embedded PDF viewer, so it renders without a browser PDF plugin.

## Run and verify

From the repo root, `node out/pages/066-editorial-portfolio/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- meta, nav and hero type/palette
- cursor parallax
- about and skills layout
- project expansion behavior
- scheduler, email and social links
- resume sheet, PDF file and download, CTA scroll
- reduced motion
- mobile layout, menu and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
