# Forge & Co. — agency work portfolio

- **Original prompt**: `data/prompts/031-agency-portfolio/031-agency-portfolio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: generates the SVG project imagery and wordmarks
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/agency-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** minimal white nav with the anvil mark, active "Work" underline and a dark "Start a Project" button. On mobile, a dropdown menu and a sticky bottom CTA.
- **Hero:** headline, with counters that count up on load.
- **Filter bar:** sticks under the nav. Seven category pills, a live result count, and grid/list view toggles. Results fade in when they change; the bar scrolls horizontally on mobile.
- **Project grid:** masonry layout with 3, 2 or 1 columns and mixed 16:10, 1:1 and 4:5 images. On hover, a dark 90% overlay shows the title, client, category pills and link, and the image scales to 1.02. Every card opens a case-study dialog with challenge, work and results, plus previous and next.
- **Featured Solaris case study:** a dark full-width section after the first six projects, hidden for filters it doesn't belong to. It has a 55/45 split, a white logo, three metrics and "Read Full Case Study".
- **Client logos:** 16 grayscale wordmarks in two marquees running in opposite directions (one row on mobile). They colorize on hover.
- **Services:** cards open service detail dialogs.
- **Stats:** count up on scroll.
- **CTA:** opens a project-brief form (with validation and a success state) and a process dialog.
- **Footer:** four columns, socials and the Clutch badge.

## Mocks and limitations

- **Sample projects and brands:**
  - All clients, metrics and case-study details are fictional sample content.
  - The page states this in the footer.
  - The brief names 12 projects but says "Showing 24 projects", so 12 more sample projects were added. The count is computed from the visible results.
- **Images:** all project images and logos are original SVG compositions, not real client work or photography.
- **Service links:** the brief's `/services/...` links open detail dialogs instead, because those pages aren't part of this static homepage. Insights and Careers show a notice.
- **Demos:** the brief form sends nothing. Social links point to the platforms' home pages.

## Run and verify

From the repo root, `node out/pages/031-agency-portfolio/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- nav, hero and counters
- filters, counts and sticky bar
- masonry, hover overlay and scale
- featured placement and case-study dialog
- list view
- marquees
- services, stats and brief form
- mobile layout and touch targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
