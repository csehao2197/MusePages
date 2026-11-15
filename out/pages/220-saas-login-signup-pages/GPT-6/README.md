# Orbit account experience

Original: `data\prompts\220-saas-login-signup-pages\220-saas-login-signup-pages.md`; follows `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; public display `GPT-6`. Standalone HTML source here, export `out`, public path `pages/saas-login-signup-pages/GPT-6/index.html`.

Violet/pink split-screen brand story with original CSS orbital illustration; mobile form-first layout. Login, signup and reset views have stable `?view=login|signup|reset` URLs, browser history, inline validation, show/hide passwords, strength/requirements, confirmation and terms checks, loading/success states, contextual social and privacy dialogs.

Run `node out\pages\220-saas-login-signup-pages\GPT-6\verify.mjs` at repository root using existing Playwright Chromium. QA images/results are in `.checks`; current desktop browser preview is `out\preview.png`. Serve `out` using a static server.

All authentication, remembered sessions, social login, email reset and support are explicit local mocks. Inputs remain in memory; passwords are cleared after successful demo submission and never transmitted or persisted. Product security text is a design principle, not certification. No environment variables/backend. Builds, installs, dist and publication were not performed.
