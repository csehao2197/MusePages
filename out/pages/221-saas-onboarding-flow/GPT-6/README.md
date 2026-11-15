# TaskFlow onboarding

Original: `data\prompts\221-saas-onboarding-flow\221-saas-onboarding-flow.md`; follows `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`. Faithful static HTML frontend adaptation of the requested Next.js flow; no Next runtime/build. Source here, independent export `out`, public URL `pages/saas-onboarding-flow/GPT-6/index.html`.

Seven truthful setup stages (the prompt expands beyond its example four), desktop checklist/mobile progress, workspace/account validation, local logo selection, six-stop tour with restart, role-based/bulk invites, five templates, preference/theme/email opt-ins, plan/seats handoff, completion summary and empty dashboard. A single onboarding object persists non-password state in sessionStorage. Reusable shell/field/progress rendering stays browser-only.

Run `node out\pages\221-saas-onboarding-flow\GPT-6\verify.mjs` at root using existing Playwright Chromium. `.checks` retains evidence/screenshots; `out\preview.png` is the current homepage capture. Serve `out` through static HTTP.

Invites, account creation, file uploads, email capture and billing are explicit mocks. Passwords never enter saved state. No payments, messages or API calls; video is an honest text walkthrough. No environment variables/backend. Builds, installs, dist and publication were not performed.
