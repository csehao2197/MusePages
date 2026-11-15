# Maison Visitor Analytics

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

HTML homepage slice from `data\prompts\267-fashion-catalog-website-visitor-analytics-plan\267-fashion-catalog-website-visitor-analytics-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; independent export `out\`. Monochrome admin workspace, URL-persisted 7/30/90-day ranges, actual aggregation of deterministic fictional visits, distinct identities across the full range, zero-filled inline SVG trends, daily inspection, four breakdowns, composed empty state, light/dark appearance and aggregate CSV export. No chart library or external analytics. This frontend uses browser state rather than server components; the PostgreSQL tracker, hashing and migrations remain unimplemented. No visitor data, cookies or IP addresses are collected. No environment variables.

Serve `out\` at `pages/fashion-catalog-website-visitor-analytics-plan/GPT-6/index.html`. Existing Playwright executes `verify.mjs`; actual QA/screenshots: `.checks\`. No builds, installs, dist or publication. Original rights preserved.
