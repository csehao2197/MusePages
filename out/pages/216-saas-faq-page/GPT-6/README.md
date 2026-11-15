# Gather FAQ

Original: `data\prompts\216-saas-faq-page\216-saas-faq-page.md`; follows `src\workflows\AI Agent\DESIGN.md`.
Actual model: `gpt-6.1-sol`; public label: `GPT-6`. Standalone HTML, CSS and browser JavaScript in this directory; independent export in `out`.

Seven topic groups, live highlighted search, filters, empty state, native accordions, deep links, answer feedback, clipboard links, sharing, print view and contextual resource/contact dialogs. Sage-and-cream editorial design adapts to mobile.

Run `node out\pages\216-saas-faq-page\GPT-6\verify.mjs` from repository root using existing Playwright Chromium. QA screenshots and assertion results are in `.checks`; preview is `out\preview.png`. Serve `out` using any static HTTP server. Expected public path: `pages/saas-faq-page/GPT-6/index.html`.

All product policies, resources and support requests are illustrative browser-only mocks. Feedback lasts for this visit. Sharing opens LinkedIn; clipboard requires browser permission; printing uses the browser. No backend, environment variables, real authentication or sent messages. Builds, installs, dist and publication were not performed.
