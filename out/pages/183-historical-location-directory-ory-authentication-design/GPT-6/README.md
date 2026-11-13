# AVARC — Authentication Decision Record

- Original: `data\prompts\183-historical-location-directory-ory-authentication-design\183-historical-location-directory-ory-authentication-design.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Superseded Ory decision timeline, clearly separated illustrative component responsibilities, provider comparison, role-action planning matrix and session-boundary walkthrough.
- Source: `out\pages\183-historical-location-directory-ory-authentication-design\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 27 actual assertions, including 6 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\183-historical-location-directory-ory-authentication-design\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed all three real images: plum decision-library typography, prominent superseded banner and clearly differentiated historical questions versus replacement facts. Mobile panels and policy worksheet stack cleanly with readable labels.
- Mocks and limits: Original records a finished design task superseded by Keycloak, not concrete Ory choices. Ory component and permission examples are explicitly illustrative proposals. No login, tokens, authorization enforcement or infrastructure is implemented.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-ory-authentication-design\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
