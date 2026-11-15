# Dusk

Original: `data\prompts\311-cocktail-bar\311-cocktail-bar.md`; applied `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, display **GPT-6**. Standalone HTML/CSS/JS adaptation of the framework brief, using system fonts and original SVG/CSS bar artwork.

Source: this directory. Features: ingredient search, four menu categories, responsive navigation, date/closed-day evening planner and email validation. Browser-only demo: menu/testimonials illustrative, newsletter and table plans send/store nothing; example email address, no real booking or backend. Environment variables: none. System type and original illustration replace remote fonts/photography.

Run verification from repository root: `node out\pages\311-cocktail-bar\GPT-6\verify.mjs`. Independently serve the `out` directory with a static HTTP server. Export contains homepage, CSS, browser JS, original SVG and real preview only. Expected collection path: `pages/cocktail-bar/GPT-6/index.html`. Builds and publication are outside this run.

Actual QA: 37 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Viewed both full-page desktop and mobile images. Strong condensed cream/amber hierarchy, balanced original cocktail illustration, readable menu rows and unclipped forms. Mobile stacks the room, signatures and planner cleanly; generous spacing and no blank/error regions. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
