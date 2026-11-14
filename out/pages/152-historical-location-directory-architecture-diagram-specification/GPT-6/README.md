# Historical Atlas Architecture Explorer

- Original: `data\prompts\152-historical-location-directory-architecture-diagram-specification\152-historical-location-directory-architecture-diagram-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Top-to-bottom architecture overview with interactive component inspector, explicit frontend/backend/auth/database connections, distinct undecided and post-MVP styles, readable Mermaid source and local copy; repository text-source diagram maintained beside the implementation.
- Source: `out\pages\152-historical-location-directory-architecture-diagram-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 28 actual assertions, including 7 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\152-historical-location-directory-architecture-diagram-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed desktop, mobile and preview: top-to-bottom component map with distinct dashed undecided choices and muted dotted MCP extension. Inspector and explicit connection cards clarify relationships; narrow layouts retain paired application nodes and independently scroll the source block. Mermaid text matches the repository diagram source.
- Mocks and limits: Architecture presentation only. Ingress product, application stack and database remain undecided; Keycloak is the named identity component. No services are deployed or probed. Rendered overview uses HTML/CSS, not a committed rendered diagram image.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-architecture-diagram-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
