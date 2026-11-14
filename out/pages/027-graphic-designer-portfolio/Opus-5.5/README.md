# Graphic designer portfolio (template with sample content)

- **Original prompt**: `data/prompts/027-graphic-designer-portfolio/027-graphic-designer-portfolio.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static multi-page HTML site, pre-rendered by a Node script (no framework, no runtime backend)
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/graphic-designer-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

The prompt is a template with `[designer name]` placeholders. It is filled with a clearly labelled **sample designer, "Iris Calder"**:
- A banner on every page says the content is sample content.
- No client results or testimonials are invented. Every result, quote, client name and award is a visibly labelled placeholder.

## Structure

| Path | Purpose |
| --- | --- |
| `assets/data.js` | **Editable structured content**: site, accent colour, projects, case studies, services, clients, recognition, process |
| `build/components.mjs` | Reusable components: `ProjectCard`, `ProjectFilter`, `CaseStudyHeader`, `ImageSequence`, `ServicesGrid`, `Testimonial`, `InquiryForm`, plus `Hero`, `Header`, `Footer` and `Head` (SEO) |
| `build/art.mjs` | Original SVG artwork for the sample projects |
| `build/generate.mjs` | Pre-renders everything listed below |
| `app.js` | Progressive enhancement: menu, filters, hero rotation, accent preview, form states, checklist progress |
| `index.html` | Homepage (generated) |
| `work/<slug>/index.html` | Case studies (generated) |
| `checklist/index.html` | Pre-launch checklist (generated) |
| `sitemap.xml`, `robots.txt` | Generated |
| `assets/img/*.svg`, `assets/og/*.png` | Generated artwork and social images |
| `page.test.mjs` | Playwright checks (not published) |

`generate.mjs` produces:
- `index.html`
- `work/<slug>/index.html` for the three full case studies
- `checklist/index.html`
- `sitemap.xml` and `robots.txt`
- `assets/img/*.svg`
- `assets/og/*.png`, 1200×630 social images rendered with Playwright
- a sample capabilities PDF

To regenerate after editing the data, run `node build/generate.mjs` from this folder.

## Features

- **Home page:**
  - editorial hero with a rotating featured pair (pause control, art-directed square crop on mobile)
  - text introduction
  - eight-project grid in source order, with no masonry
  - keyboard filters that announce results
  - services with fit, deliverables and engagement (no prices)
  - first-person About with credentials placeholders and a sample PDF
  - four-stage process with feedback, revision and delivery expectations
  - inquiry form
- **Case studies:**
  - client, industry, year, role, collaborators and deliverables
  - challenge, audience and constraints
  - direction and key decisions
  - system (type, colour swatches, logo behaviour, grid)
  - applications and process material, including a rejected direction
  - outcome placeholder and testimonial placeholder
  - contextual CTA that pre-fills the project type, and next-project navigation
- **Inquiry form:**
  - validation inline and in an error summary
  - loading state (`aria-busy`), then a success or error state
  - the error state appears when offline, keeps your answers and offers retry
  - consent and privacy note, direct email and response time

## Accessibility notes

- Landmarks, a single `h1` per page, labelled controls, visible focus, and a skip link.
- Filter buttons expose `aria-pressed` and use a live status region.
- Every image has descriptive alt text plus `width`/`height` to prevent layout shift. Below-the-fold images use `loading="lazy"`.
- Touch targets are at least 44px. Colours are chosen for WCAG AA. Reduced motion stops the hero rotation and transitions.
- Form errors clear as you type rather than on blur. This avoids a layout shift that could make the submit click miss; it was found and fixed during testing.

## SEO

- Each page has a unique title, meta description, canonical URL and Open Graph/Twitter tags.
- JSON-LD: `Person` + `ProfessionalService` on the homepage; `CreativeWork` + `BreadcrumbList` on case studies.
- Clean `/work/<slug>/` URLs, an XML sitemap and a robots.txt recommendation.
- Canonical URLs, social images and the sitemap use the placeholder domain `https://www.iriscalder.example`. Replace it before launch; it is listed in the checklist.

## Mocks and limitations

- All names, projects, copy, artwork and the portrait are sample content. Artwork is original SVG; there is no real photography.
- The form doesn't send anything: it simulates sending and states that in its success message. Its no-JS fallback is a `mailto:` action.
- Only three projects have full case studies; the other five are marked "Case study in preparation".
- The footer accent swatches are a template preview control.
- Social links point to the platforms' home pages.
- The pre-launch checklist (`/checklist/`, 83 items) lists every image, client fact, quote, link, result and setting to supply. Its progress is saved in the browser.

## Run and verify

Serve `out/` statically. From the repo root, `node out/pages/027-graphic-designer-portfolio/Opus-5.5/page.test.mjs` runs 11 Playwright checks:

- SEO and structured data
- hero rotation and pause
- grid content and image attributes
- filters and announcements
- placeholders: no invented praise or results
- form validation, loading, success and offline error with retry
- accent persistence
- case-study sections, navigation and images
- checklist, sitemap and robots
- mobile with reduced motion: overflow, 44px targets, menu, reading order and art-directed crop

The test turns off CSS smooth scrolling so automated clicks don't race scrolling. Desktop, mobile and case-study screenshots were reviewed visually.
