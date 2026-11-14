# DevNexus — Kai Navarro developer portfolio

- **Original prompt**: `data/prompts/067-devnexus-developer-portfolio/067-devnexus-developer-portfolio.md` (technical spec), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript single-page app with hash routes (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (router and views)
  - `assets/data.js`: all content
  - `assets/fx.js`: canvas particle field, skill sphere and SVG screen mockups
  - `page.test.mjs`: browser checks
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/devnexus-developer-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The spec asks for Next.js 14 with multiple routes, ShadCN, Framer Motion/GSAP, React Three Fiber, React Hook Form + Zod and Lenis. Installing and building aren't authorized in this run, and the collection publishes one static homepage. So every "page" is a hash route in a single `index.html`:

- `#/`, `#/about`, `#/projects`, `#/projects/<slug>`, `#/skills`, `#/blog`, `#/blog/<slug>`, `#/contact`

Library features were rebuilt by hand:

| Spec feature | Implementation |
|---|---|
| Three.js particles | perspective-projected canvas point cloud |
| Skill sphere | rotating DOM tag sphere |
| Zod schema | small validation schema object |
| Page transitions | CSS animations |

## Features

- **Global:**
  - loading screen
  - sticky blurred nav with animated logo, hover underlines, current-page state, light/dark theme (persisted in `dn-theme`) and hamburger menu
  - fade/slide page transitions
  - per-route title, description and Open Graph updates
  - focus moves to content on navigation
  - toasts and a modal
- **Home:**
  - 3D particle field that reacts to the mouse
  - typewriter tagline
  - Hire Me / View Work CTAs and count-up stats
  - 3 featured projects
  - draggable, keyboard-rotatable skill sphere
  - 3 testimonials (CEO TechCorp, CTO StartupXYZ, Lead Developer Agency)
- **About:** story, animated experience timeline (4 roles), education, core strengths and a CV download (a PDF generated in the browser).
- **Projects:** filters (All, Web, Mobile, AI, Full-stack) and 6 glass cards with hover glow. The 5 projects from the spec plus PulseFit cover the Mobile filter.
- **Case studies:** problem, objectives, stack badges, architecture flow diagram, challenges & solutions, result metrics, a 3-screen gallery with lightbox (arrow keys), live/GitHub links and prev/next navigation.
- **Skills:** accessible tabs (Frontend, Backend, DevOps, Tools) with animated progress bars and radial charts.
- **Blog:** 4 posts with category filter and reading time. Post pages have syntax-highlighted code with a copy button.
- **Contact:** schema validation on blur and submit, a character counter, a submit animation (spinner, then sent), a success toast, socials, location and availability.
- **Accessibility:** reduced motion turns off the loader delay, typewriter, particles animation and reveals.

## Mocks and limitations

- **Fictional content:** Kai Navarro, clients, testimonials, metrics and projects are fictional. Screens are generated SVG mockups.
- **Contact form:** it sends nothing; the toast points to the email address.
- **Placeholder links:** social, live-demo and GitHub links show a toast.
- **Blog posts:** posts are excerpts only.
- **Hash routes:** routes are hash-based (`#/about`) rather than server paths, so the whole site deploys as one static page.

## Run and verify

From the repo root, `node out/pages/067-devnexus-developer-portfolio/Opus-5.5/page.test.mjs` runs 11 Playwright checks:

- hero, particles and typewriter
- skill sphere
- projects and filters
- case study and lightbox
- about and CV PDF
- skills tabs and charts
- blog and code copy
- contact validation and submission
- theme persistence and history navigation
- mobile layout across all routes
- reduced motion
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
