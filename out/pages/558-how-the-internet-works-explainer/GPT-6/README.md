# Northbeam Primers — one web request

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\558-how-the-internet-works-explainer\558-how-the-internet-works-explainer.md`.
- Design input: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory. Standalone public export: `out\`.
- Public subpath: `/pages/how-the-internet-works-explainer/GPT-6/index.html`.
- Tags: Networking, Scrollytelling, Science.

## Experience

Seven scenes explain the request, simulated DNS, route distance, a manually stepped TCP handshake, an HTTP/HTTPS inspector, deterministic packet loss and reassembly, and a cold/warm rendering waterfall. Each scene has one grouped hands-on control and three reading beats. A stage rail and cumulative first-visit timer follow scrolling. A four-second replay and 14-term glossary close the story. Diagrams, map, laptop and recipe artwork are original inline SVG.

`src\content.ts` is the canonical, JavaScript-compatible content module. `content.js` and `out\content.js` are byte-identical browser copies. `state.js` centralizes shared state and timing calculations.

## Running and validation

No build is needed or authorized. Serve only this directory's `out` using the repository's `startPreviewServer` from `src\workflows\script\generate-preview.mjs`; it supplies the final nested public URL. Open the returned URL in a browser. Do not serve the source directory.

Private evidence lives in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png` and additional scene captures. Validation uses installed Playwright Chromium, real HTTP, desktop 1200×900 and mobile 390×844, plus the requested 1440×900 desktop width. Results and manual visual-review findings are recorded after execution. `out\preview.png` is a fresh real 1200×900 first-screen render maintained by `StaticHomepage.ensurePreview`; hidden SHA-256 files bind full inputs and exported files to that image.

The private `.checks\verify.mjs` runs from the repository root with `node out\pages\558-how-the-internet-works-explainer\GPT-6\.checks\verify.mjs`. It completed 22 verification groups, including all seven scene controls on both devices, keyboard navigation, DNS validation/cache boundaries, 15 distance/loss combinations per device, first-trip/warm budgets, real replay completion, glossary navigation and reduced motion. The final run has no HTTP, request, page or console errors and no horizontal overflow before or after interactions. Both actual homepage PNGs and both TLS scene PNGs were opened for visual review: balanced desktop hierarchy, clear navy/paper contrast, readable mobile content and reachable controls. Mobile intentionally scrolls beyond the initial viewport to reveal the entire hero illustration.

Initial private QA failures are retained: a missing Lucide default-attributes module (fixed by including it), a doubled anchor offset (fixed in CSS), and an assertion reading a mobile stage before its scroll event (fixed by waiting for the actual milestone). The final suite is run against the corrected public files, not these earlier attempts. Each owned server/browser is closed in `finally`. The coordinator-owned generation lock remains untouched. `task\TASK.md` is absent; the explicit one-job assignment supplies this task's scope.

## Static adaptation and limits

This authorized no-build adaptation uses native ES modules and CSS instead of a Vite/TypeScript/Tailwind production build. Public JavaScript is readable rather than build-minified; no source maps or development/source directories are exported. IntersectionObserver, CSS transitions and requestAnimationFrame replace GSAP/ScrollTrigger. The canonical content file remains TypeScript-compatible; no TypeScript compilation was performed. Fontsource packages supply the specified self-hosted fonts; individual Lucide icons are reused from the installed licensed package. No CDN, remote images, analytics, APIs, backend, secrets or environment variables are used.

This is a conceptual HTTP/1.1-over-TCP lesson, not a packet capture or performance test. DNS is a deterministic local simulation, including the nonexistent `.example` delegation; accepted reserved names never trigger network lookups. Cache entries last for the page session, not a real TTL clock. Route dots are abstract and forwarding behavior is explanatory, not a routing protocol simulator. Key-share/certificate labels and seeded hexadecimal bytes are illustrative, not working cryptography or a real certificate validator. An HTTPS lock is not a site safety rating.

Twelve tiles stand for chunks of 48,213 bytes, not literal wire packets; TCP counts bytes. Loss is deterministic and adds one round trip per missing teaching tile. Real congestion control, parallel loss recovery, fragmentation, bandwidth, queuing, TLS resumption and HTTP/2 or HTTP/3 are outside this model. Warm reload assumes reused DNS/connection and cached subresources, still fetches HTML, ignores loss and uses a 30 ms paint budget. The header always reports the cold trip. Subresource work is folded into the paint budget. The recipe and Save recipe shape are noninteractive SVG illustration, not a recipe application.

The replay compresses stages with a 0.4-second minimum; it summarizes the journey rather than reproducing every packet path. Native animations approximate the specified motion without exact GSAP choreography. The mobile TLS inspector uses fewer visual pixels but retains all six byte rows. Font weights use the variable display/serif faces and a regular mono face.

Generation, preview, validation and disabled registration are separate gates. No build, distribution assembly, deployment, commit or push is performed.

## Attribution and license

Adapted from **How the Internet Works Explainer**, prompt by **VibeFather**, [original template](https://vibefather.ai/t/how-the-internet-works-explainer), [source snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/how-the-internet-works-explainer/prompt.md).

Prompt-derived work is provided for non-commercial use under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires the original licensor's authorization. The applicable source notice is preserved in `LICENSE` and `out\LICENSE`. See `ASSETS.md` and `out\licenses\` for font and icon licenses. No third-party demo screenshot or illustration is reused. Publisher and editorial credits are fictional, as labeled on the page.
