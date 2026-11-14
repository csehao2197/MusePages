# CredPath — professional certification landing page

- **Original prompt**: `data/prompts/047-professional-certification-platform/047-professional-certification-platform.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (badge art, catalog data and interactions); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/professional-certification-platform/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** grid-pattern background, 60/40 split, two CTAs, trust metrics, and an illustrated certificate with a seal badge and an animated shimmer (stacked above the headline on mobile).
- **Logo bar:** auto-scrolling grayscale wordmarks that pause on hover.
- **Catalog:** tabs with counts, a 3/2/1-column grid of six cards (all 12 via "View all"), SVG badge icons, colored difficulty bars and a details dialog with checkout.
- **How it works:** four numbered steps with arrow connectors (vertical on mobile) and a three-question assessment that recommends a certification.
- **Study program:** HTML dashboard mockup (67% progress, Module 5, 14-day streak, next session) and six features.
- **Career outcomes:** three stat cards that count up, survey attribution and swipeable success stories.
- **For employers:** credential lookup against a sample registry (ID or email; valid, unknown and empty states) and a Talk to Sales form.
- **Pricing:** three plans with a scaled "MOST POPULAR" middle card, a snap carousel on mobile and a comparison-table dialog.
- **Testimonials, FAQ and final CTA:** blue left-border cards with stars and LinkedIn links; a one-open-at-a-time FAQ; a navy email signup with validation.
- **Mobile:** floating "Browse Certifications" bar after the hero.

## Mocks and limitations

- **Catalog:** the brief details six certifications; the other six (DevOps & Kubernetes, Cloud Security, Analytics Engineering, Security Foundations, Penetration Testing, Applied AI) were added to match "12 certifications" and the tab counts.
- **Demos:** verification uses three sample credentials (e.g. `CP-CAP-7F3K-2291`). Checkout, sales and signup forms send nothing.
- **Images:** headshots, badges and the certificate are SVG/CSS illustrations; the dashboard is an HTML mockup.
- **Sample content:** employer names are text wordmarks, not logos. People, statistics and the 2025 survey come from the brief and are **illustrative**; the footer says so. The streak emoji is replaced by an icon.

## Run and verify

From the repo root, `node out/pages/047-professional-certification-platform/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- hero and logo marquee
- catalog filtering, details and checkout
- steps and assessment
- study preview and ROI stats
- verification and sales
- pricing, comparison, testimonials, FAQ and signup
- mobile layout and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
