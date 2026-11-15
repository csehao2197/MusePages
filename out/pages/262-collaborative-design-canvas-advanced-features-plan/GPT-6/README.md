# Forma

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

Standalone HTML design-canvas homepage from `data\prompts\262-collaborative-design-canvas-advanced-features-plan\262-collaborative-design-canvas-advanced-features-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; independent export `out\`. Features: pointer dragging, multi-layer selection, 1px/10px keyboard nudging, 20px duplicate, internal snapshot copy/30px paste, multi-fill colour, six bounding-box alignments, equal-gap horizontal/vertical distribution, add/delete/reset. Typing fields protect canvas shortcuts. No system clipboard access, cloud saving or real collaboration; all work stays in tab memory.

Serve `out\` through static HTTP at `pages/collaborative-design-canvas-advanced-features-plan/GPT-6/index.html`. Existing Playwright runs the exported checks in `verify.mjs`; `.checks\evidence.json` holds actual results and image observations. No environment variables, builds, installations, dist or publication. Original rights preserved.
