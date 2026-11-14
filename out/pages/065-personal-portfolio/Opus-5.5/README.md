# Jordan Reyes — personal developer portfolio

- **Original prompt**: `data/prompts/065-personal-portfolio/065-personal-portfolio.md` (a PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (all content in one `CONTENT` config object), `assets/art.js` (original SVG portrait and project mockups); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/personal-portfolio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD describes a Next.js 15 + Tailwind project with release tooling (`@programinglive/commiter`, Husky, commitlint). `DESIGN.md` allows plain HTML when a framework isn't needed, and this run isn't authorized to install packages or run builds. This version is therefore a dependency-free static site that meets the PRD's functional, accessibility and SEO requirements:

- content comes from one config object (PRD 6.2)
- a theme toggle is included (from the PRD backlog)

Not included: a Next.js source project, a Tailwind build, Husky/commitlint hooks and `npm run release` scripts.

## Features

- **Hero:** name, role, tagline, availability badge, View Projects / Contact CTAs, highlight stats and an illustrated portrait with descriptive alt text.
- **About:** professional summary and three working principles.
- **Projects:** 6 cards with name, description, tech stack, GitHub and live links, and type filters (All, Full-stack, Frontend, Mobile, Tools). Each has a case-study dialog with KPIs, problem, role and outcome, deep-linkable via `#project/<id>`, with focus returned on close.
- **Skills:** 4 groups with experience and level bars.
- **Experience:** 4-role timeline.
- **Contact:**
  - email shown, with a copy button
  - GitHub / LinkedIn / X links
  - validated form that composes a pre-filled `mailto:` link
- **CV download:** a one-page PDF generated in the browser from the same content.
- **Navigation and accessibility:**
  - sticky header with scroll-spy and a mobile menu
  - light/dark theme (persisted in `localStorage` `jr-theme`, respects the system preference)
  - skip link, semantic landmarks, keyboard access to every control
  - reduced-motion support
  - title, description, Open Graph and Twitter meta tags

## Mocks and limitations

- **Fictional owner:** Jordan Reyes, the employers, projects and metrics are fictional; the owner isn't the author of the tools named in the PRD.
- **Placeholder links:** GitHub, LinkedIn, X and project links show a toast. The email domain is `.example`.
- **Nothing is sent:** the contact form only builds a `mailto:` link for your email app.
- **Generated CV:** the CV is a basic Helvetica PDF built from the page content.

## Run and verify

From the repo root, `node out/pages/065-personal-portfolio/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- SEO, landmarks and hero
- projects, filters, dialog and deep link
- about, skills and experience
- contact copy and mailto composition
- CV PDF download, theme persistence and scroll-spy
- keyboard reachability
- mobile menu, layout and 44px targets
- no runtime or request errors

The suite passed 5 runs in a row. Desktop and mobile screenshots were reviewed visually.
