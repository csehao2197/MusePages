# Field Day Weekend

Source: `data\prompts\341-festival\341-festival.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, display **GPT-6**. Standalone HTML adaptation uses one system sans family and original SVG concert art; no external assets or dependencies.

`index.html`, `style.css`, `app.js`, `art.svg` implement the tomato red gig poster, complete lineup with day filters, ticket quantity/day review, schematic site plan, travel and six accessible disclosure questions. Ticket selection is transient browser memory, never a purchase. Contact addresses and event information are illustrative; dates preserve the original 2026 brief. No backend, inventory, payment, tracking, environment variables or real reservation.

Static export: `out\`, expected public entry `pages/festival/GPT-6/index.html`. Serve that directory with any static HTTP server. From repository root run `node out\pages\341-festival\GPT-6\verify.mjs` for desktop/mobile interaction and public-subpath checks. Source and QA remain outside the export. React/motion were adapted to browser JavaScript without a build; reduced-motion preferences are respected. Actual evidence is appended after image inspection.

Verified: 42 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 screenshots opened: Opened desktop and mobile full-page PNGs. Strong black-on-tomato poster hierarchy, readable complete lineup, aligned tickets, legible schematic and clean stacked mobile layout; no clipping or blank sections. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
