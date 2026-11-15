# Stellar Forge Mission Control

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

HTML monitoring frontend from `data\prompts\265-developer-bounty-marketplace-monitoring-plan\265-developer-bounty-marketplace-monitoring-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; standalone export `out\`. Seven service surfaces, sample telemetry, scenario evaluation for RPC/catalog/hash/evals/CI, attention filtering, threshold/owner drilldown, gated acknowledgement/containment/recovery and JSON snapshot download. All probes and incidents are deterministic local simulations. No RPC, chain, GitHub, email, credential or deployment access; gate controls affect only this tab. The 24-hour chart and uptime are illustrative.

Serve `out\` at `pages/developer-bounty-marketplace-monitoring-plan/GPT-6/index.html`. Existing Playwright runs the exported `verify.mjs` assertions; actual screenshots/evidence: `.checks\`. No environment variables, builds, installations, dist or publication. Original rights preserved.
