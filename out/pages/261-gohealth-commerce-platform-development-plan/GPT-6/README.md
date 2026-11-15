# GoHealth Commerce Workspace

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

Standalone HTML admin homepage from `data\prompts\261-gohealth-commerce-platform-development-plan\261-gohealth-commerce-platform-development-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Real model `gpt-6.1-sol`; label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; static homepage/resources: `out\`. Local product CRUD, search, categories, sorting, pagination, stock-aware sample cart, local order/inventory adjustment and printable invoice. Print / Save as PDF uses the browser, not jsPDF. MySQL, Redux persistence, Midtrans Snap and Resend SMTP are not integrated; all data is session-only and payment/email remain simulations. No environment variables.

Serve `out\` using static HTTP. Expected entry: `pages/gohealth-commerce-platform-development-plan/GPT-6/index.html`. `verify.mjs` provides reusable Playwright checks; `.checks\evidence.json` records actual assertions, resource checks and desktop/mobile visual review. No builds, installs, dist or publication. Original rights preserved.
