# Ava Chen — UX/UI designer portfolio

- **Original prompt**: `data/prompts/030-ux-ui-designer-portfolio/030-ux-ui-designer-portfolio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG interface illustrations and portrait
  - `build/resume.mjs`: writes the sample resume PDF in `assets/`
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same public files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/ux-ui-designer-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky, blurred white bar with an active-section underline. The "Let's Talk" button is outlined and fills on hover. On mobile, a drawer slides in from the right.
- **Hero:** text sits left of a 12°-rotated composition of a tablet dashboard, phone calendar and component spec card, on a dotted grid. Text slides up on load; the mockups fade in and move with pointer and scroll parallax.
- **Selected Work:** four case-study cards with alternating image sides, tags, metric rows and a hover lift. "View Case Study" opens a dialog with problem, process and outcome, plus next and previous navigation.
- **How I Work:** four steps with dashed connectors (vertical on mobile) and a pull quote.
- **Tools & Skills:** 12 chips with icons and an indigo hover state; three per row on mobile.
- **About:** illustrated portrait and bio. The three fun facts use Lucide-style icons instead of the brief's emoji.
- **Testimonials:** four cards with indigo left borders.
- **Contact:** form validation and a success state, direct email, social links, and a dark footer.
- **Download Resume:** downloads a real one-page sample PDF.

## Mocks and limitations

- **Sample content:**
  - Ava Chen is a fictional persona.
  - The roles at Notion, Figma and Stripe, the case studies, metrics and testimonials come from the brief and are **illustrative**.
  - The page states this under the work and testimonials sections.
  - The case-study details (problem, process, outcome) are invented to fill the dialog.
- **Images:** all interface "screenshots" and the headshot are original SVG illustrations, not real product screenshots or a photo.
- **Demos:** the form sends nothing. Social and LinkedIn links point to the platforms' home pages. The resume PDF is labelled SAMPLE.
- **Fonts:** DM Sans and Inter load from Google Fonts, with system fallbacks offline.

## Run and verify

Serve `out/` from any static server. From the repo root, `node out/pages/030-ux-ui-designer-portfolio/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- hero and nav styling
- resume PDF
- project cards: alternation and hover
- case-study dialog
- process connectors
- chip hover
- about and testimonials
- form flow and footer
- mobile layout: drawer, stacking and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
