# Tasklane — API reference documentation

- **Original prompt**: `data/prompts/062-api-documentation-website/062-api-documentation-website.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/api-documentation-website/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Header:** logo, version selector (v2.1 / v2.0 / v1.x), search (`/` to focus, arrow keys, Enter), status link, dark-mode toggle (persisted) and Get API Key.
- **Sidebar:** collapsible groups (Getting Started, Core Resources with per-endpoint method badges, Webhooks, SDKs & Libraries, Guides, Reference) with scroll-spy; becomes a drawer under 900px.
- **Content:** two-column layout with prose on the left and code on the right. It includes:
  - Quick Start in 3 steps
  - Authentication (API key, OAuth 2.0, refresh, best practices)
  - Versioning, Errors table, Rate Limits (plans and headers), cursor Pagination, Filtering and Batch operations
  - Webhooks (setup, retry policy, CLI testing, 11 events, payload, HMAC signature verification)
  - SDK install and quick examples for 5 languages
  - Changelog with New/Breaking/Deprecated badges and a migration guide
  - Support links
- **Endpoints:** 11 endpoints generated from one spec covering Users, Projects, Tasks, Comments and Files. Each has a method badge, path, path/query/body tables, response fields, a response example, and code in 6 languages (cURL, JavaScript, Python, Ruby, Go, PHP). Language tabs switch all examples at once and are remembered.
- **Code blocks:** a small built-in syntax highlighter, and Copy buttons on every block.
- **Try it playground:** editable key, parameters and JSON body. The code snippet updates live, and responses show status, headers and timing. It returns 200/201/204, plus 400 (missing parameter, bad JSON, invalid limit), 401, 404 and 429 (20/min sandbox limit). Created users can be retrieved afterwards.
- **Get API Key:** generates a `tl_test_…` key that can be applied to all examples and the playground.
- **Version selector:** rewrites every path (`/v2` ↔ `/v1`) and shows a deprecation banner for older versions.

## Mocks and limitations

- **Fictional API:** Tasklane, its API, CLI and SDKs are fictional, and `api.tasklane.example` is a reserved, non-resolving domain.
- **Simulated playground:** every response is simulated in the browser and labeled "simulated"; no network requests are made. Playground state resets on reload.
- **Local storage only:** the generated key exists only in this browser's `localStorage` (`tl-key`), alongside `tl-theme` and `tl-lang`.
- **Sample status:** status-page data is sample content.
- **Inactive links:** the GitHub repo, library docs and community links show a toast. The Stack Overflow and email links are ordinary links.
- **Not production-ready:** the highlighter is a lightweight tokenizer, not a full parser.

## Run and verify

From the repo root, `node out/pages/062-api-documentation-website/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- header and sidebar groups
- all sections and badges
- highlighting and language tabs
- copy
- playground status codes and state
- API key dialog
- version switching
- search, dark-mode persistence and status dialog
- mobile drawer, no overflow and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
