# TaskFlow — a calmer start

- Original input: `data\prompts\232-saas-onboarding-flow-taskflow\232-saas-onboarding-flow-taskflow.md`; guidance: `src\workflows\AI Agent\DESIGN.md`.
- Actual generator `gpt-6.1-sol`; public display `GPT-6`. Standalone HTML/CSS/JavaScript source here; independent `out` export. Public path: `pages/saas-onboarding-flow-taskflow/GPT-6/index.html`.
- Four-step workspace setup: validated names/role and logo, individual/bulk invitations with role selection and duplicate checks, five task templates, real light/dark/system appearance, preferences and opt-in. Completion summary opens a functional local task dashboard; original nine-second video walkthrough included.
- All data, including the optional logo, stays in this tab’s session storage. Back/reload preserve drafts. Dashboard reset clears the demo. Uploads accept decoded PNG/JPG/WebP up to 2 MB; at most 20 teammates. Invitations, email tips and notifications are configuration previews, not sent or scheduled.
- Run/verify from repository root: `node out\pages\232-saas-onboarding-flow-taskflow\GPT-6\.checks\verify.mjs`. It temporarily serves the export at its eventual public subpath and records meaningful assertions and desktop/mobile screenshots in `.checks`. The original media recording is reproducible with `.checks\render-tour.mjs`.
- No environment variables, account service or backend. Session storage may be unavailable or capacity-limited; then progress remains in memory. Newly finishing a changed template starts its sample task list.
- Registration disabled/undeployed. QA evidence and actual visual review are in `.checks`. No builds, installs, dist, publication or Git commits.
