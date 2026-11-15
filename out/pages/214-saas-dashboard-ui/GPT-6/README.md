# Forma workspace

Original `data\prompts\214-saas-dashboard-ui\214-saas-dashboard-ui.md` plus `src\workflows\AI Agent\DESIGN.md`. HTML/CSS/JS by `gpt-6.1-sol`, display `GPT-6`; source here, deployable `out\`.

Fixed 240px sidebar, tablet icon rail, mobile scrollable bottom navigation, search/Ctrl-K, notifications/user menu, four specified metrics, original SVG completion graph, CSS donut, five activities, deadlines and sortable workload. Eight navigation sections have functional local views: project/status filter and creation, tasks, team details, messages, calendar events, CSV reports and editable preferences.

All metrics, dates and people are illustrative. No live messaging, time tracking, authentication, payment or integrations. Changes remain in session memory; the project headline counter increases when a project is created, while other snapshot statistics intentionally remain sample data. Local Inter font and included Google Fonts OFL license.

Serve `out\` with a static HTTP server. QA: `node out\pages\214-saas-dashboard-ui\GPT-6\verify.mjs`; evidence/screenshots `.checks\`. Public `pages/saas-dashboard-ui/GPT-6/index.html`. No environment variables/backend, builds, installations or publication.
