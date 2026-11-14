# Historical Atlas Access Portal

- Original: `data\prompts\153-historical-location-directory-authentication-specification\153-historical-location-directory-authentication-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Password-free access portal and educational OIDC/PKCE flow, session/role simulator, viewer/editor/admin permission matrix, request-policy tester, Keycloak account/admin handoff explanations and explicit social-role ambiguity note.
- Source: `out\pages\153-historical-location-directory-authentication-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 30 actual assertions, including 9 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\153-historical-location-directory-authentication-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and 1200x900 preview after improving contrast and replacing an unsupported glyph. Access portal, simulator, policy matrix and step controls are clear; narrow layout stacks cards and contains the horizontally scrollable role table. All simulations and policy ambiguity are explicitly labeled.
- Mocks and limits: No real authentication, passwords, cookies, tokens, Keycloak, admin API or protected data. UI-only simulations do not secure a service. English visible UI; actual Keycloak would offer English/German. Source conflict between implicit viewer and role-less social denial is explicitly surfaced, not silently resolved.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-authentication-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
