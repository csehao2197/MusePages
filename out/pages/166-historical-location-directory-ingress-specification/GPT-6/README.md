# Historic Atlas — One origin, clear routes

- Original: `data\prompts\166-historical-location-directory-ingress-specification\166-historical-location-directory-ingress-specification.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model: `gpt-6.1-sol`; directory alias: `GPT-6`. Standalone HTML/CSS/JavaScript.
- Features: Dark blueprint ingress explainer with interactive path resolver, environment-dependent actuator routing, trusted-hop forwarded-header and request-ID simulation, sanitized JSON access-log specimen and upstream diagram.
- Source: `out\pages\166-historical-location-directory-ingress-specification\GPT-6\index.html` and adjacent browser assets. Static export: the same directory's `out\`.
- Serve `out\` with a static HTTP server. No build, environment variables, external assets or runtime backend required.
- Validation: 29 actual assertions, including 8 focused interaction assertions; widths 1440, 1024, 768, 390, 320px; no browser/resource errors. `verify.mjs` exports assertions exercised by this run's temporary Playwright harness, not a standalone CLI.
- Preview recheck from workspace root: `node src\workflows\generate-preview.mjs out\pages\166-historical-location-directory-ingress-specification\GPT-6\out`. This renders and resource-checks a 1200×900 screenshot; it does not update metadata or replay interaction assertions.
- Evidence: `.checks\desktop.png`, `.checks\mobile.png`, `out\preview.png`. Visual review: Reviewed actual desktop, mobile and preview PNGs. Navy blueprint grid, cobalt nginx node and mint selected upstream establish a clear routing hierarchy; local form and JSON output remain readable when stacked on mobile. No clipped controls or horizontal overflow in five-width checks.
- Mocks and limits: Local policy visualization only, not a running proxy or security test. Keycloak endpoint allowlist belongs to the separate authentication specification. No containers, TLS, DNS resolution, telemetry or network requests run.
- Assets: original CSS/SVG artwork; system fonts. Where used, Lucide icon paths are ISC licensed. Original requirement authors retain their rights; this collection grants no additional source rights.
- Registered disabled, undeployed. Expected publication: `pages\historical-location-directory-ingress-specification\GPT-6\index.html`.
- Not performed: build, install, dist, publication, upload or production backend testing.
