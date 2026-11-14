# CloudSync Status — service status page

- **Original prompt**: `data/prompts/064-saas-status-website/064-saas-status-website.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/feed.xml` (RSS 2.0 feed); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/saas-status-website/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Header and banner:** minimal header (logo, Visit CloudSync, Subscribe to Updates). The full-width status banner is derived from component states: green for operational (with a note when components are degraded), yellow for partial outage, red for major outage. A live "Last updated N minutes ago" ticks from a fixed demo clock.
- **Active incidents:** severity, affected components, start time, duration, a 4-step progress bar (Investigating → Identified → Monitoring → Resolved) and updates newest first. Shows "No active incidents" when there are none.
- **Current Status:** 10 components with status dots. Each row expands to show sub-components and a 7-day uptime strip.
- **Uptime over 90 days:**
  - one bar per day, colored by uptime: green 100%, yellow 99–99.9%, red below 99%, gray for maintenance
  - per-row uptime summaries and the overall "99.97% over 90 days" badge are computed from the incident data
  - tooltips on hover or tap, and keyboard stepping with arrow keys
  - on mobile the bars become a 13-bar weekly summary
- **Past Incidents:** the last 14 days grouped by date, including the brief's incidents, timelines, expandable updates and a post-mortem dialog. "View Full Incident History" reveals older incidents grouped by month.
- **Upcoming Maintenance:** blue-bordered card with a countdown and affected components. "Subscribe to get notified" pre-checks maintenance and focuses the email field.
- **Performance Metrics:** collapsible section with 3 cards and 24-hour sparklines that show a value readout on hover.
- **Stay Informed:** email form (validation, notification preferences, "All incidents" and "Only major outages" are mutually exclusive), Slack option and a real RSS feed file.
- **Footer:** links, social handle, branding, and a **demo state switcher** (Current / Operational / Partial / Major) that shows every banner and incident style.

## Mocks and limitations

- **Fictional data:** CloudSync and all status, incident, uptime and metric data are fictional sample data.
- **Fixed clock:** the clock starts at March 13, 2026, 11:59 UTC and advances in real time. Nothing polls a backend.
- **Uptime formula:** uptime counts outage minutes fully and degraded minutes at 10%. Maintenance is shown in gray and not counted as downtime.
- **Subscriptions:** email subscriptions are saved only in `localStorage` (`cs-sub`). "Add to Slack" opens an explanatory dialog, and the RSS feed is a static sample.
- **Placeholder links:** footer links and the X handle show a toast.
- **Section order:** Active Incidents appears first so outage information is visible immediately; the other sections follow the brief's order. The Slack option uses a generic chat icon rather than the Slack logo.

## Run and verify

From the repo root, `node out/pages/064-saas-status-website/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- header and banner
- component list and expansion
- uptime bars, computed percentages and tooltips (hover and keyboard)
- active incident
- past incidents, post-mortem and full history
- maintenance and metrics
- subscribe options and the RSS file
- demo states
- mobile weekly bars, tap tooltip, stacking and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
