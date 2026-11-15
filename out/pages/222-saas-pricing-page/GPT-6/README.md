# Forma pricing

Original: `data\prompts\222-saas-pricing-page\222-saas-pricing-page.md`; follows `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`. HTML/CSS/JavaScript source here; independent `out` export; public URL `pages/saas-pricing-page/GPT-6/index.html`.

Warm gold/graphite plans, Free/Pro/Enterprise, accessible monthly/annual 20% switch, 1–20 seat calculator with exact annual totals/savings, complete comparison matrix/differences filter, FAQs, plan-specific workspace preview and enterprise demo form.

Run `node out\pages\222-saas-pricing-page\GPT-6\verify.mjs` at root using existing Playwright Chromium. `.checks` retains screenshots/assertions; current capture is `out\preview.png`. Serve `out` through static HTTP.

Policies, features, security and SLA are illustrative product content. Trial/signup and enterprise forms prepare browser-only previews, send nothing and collect no payment details. Comparison table is horizontally scrollable on mobile. No environment variables/backend. Builds, installs, dist and publication were not performed.
