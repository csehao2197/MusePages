# Marcus — Bennet

Actual generator: `gpt-6.1-sol`. Public model: `GPT-6`.

Original: `data\prompts\535-marcus-bennet-editorial-portfolio\535-marcus-bennet-editorial-portfolio.md`.
Source: [Nomaan Khan / frostmute, MIT](https://github.com/frostmute/msites-prompt-collection/blob/d4974f4296e2851e05eabddb9240170cc423dd46/motionsites-prompts/ms-personal-showcase/working-prompt.md).

## Implementation

Static HTML/CSS/browser JavaScript adaptation of the requested Vite/React/TypeScript/Tailwind page; no framework runtime or build. Source files are here; public files are in `out\`. Exact original image URLs and print-to-all font URL are retained as external references, not redistributed or claimed as original artwork. Their availability and rights remain with their providers. The requested background currently returns a pale gray textured image; this implementation does not replace or darken it, so the requested dark photographic look and cream contrast cannot be guaranteed.

One viewport, exact copy, desktop columns, layered portrait, dual-span marquee, entrance timing, reduced-motion handling and responsive drawer. Drawer supports toggle, close, backdrop dismissal, Escape, focus trapping, link dismissal and desktop resize recovery. All links intentionally remain `#` as requested; there are no real social destinations, portfolio subpages, backend, mocks, environment variables or production claims. Mobile X uses the Lucide SVG geometry, not Lucide React.

## Run and verify

From the repository root run `node out\pages\535-marcus-bennet-editorial-portfolio\GPT-6\.checks\verify.mjs` for the actual final-subpath browser checks. The existing `startPreviewServer` serves only `out\` at `/pages/marcus-bennet-editorial-portfolio/GPT-6/index.html`. No build or deployment is needed.

Private evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`; fresh public preview: `out\preview.png`. Actual results and visual conclusions are recorded privately, not inferred from screenshots existing. Registration is disabled and undeployed when validation succeeds.

Actual Chromium checks passed at 1200×900/DPR1 and 390×844/DPR1: HTTP, both exact images, requested font, overflow before/after interactions, hover, touch/keyboard drawer actions, focus trap, Escape, backdrop, close, link dismissal, breakpoint recovery and reduced motion. No HTTP/resource/request/console/page errors. Both real screenshots and the independently generated first-screen preview were opened for visual review. Portrait layering, whitespace and responsive cropping match the numeric specification. The exact remote background is light gray, not black; cream text therefore has limited contrast. No alternate reference screenshot exists to establish pixel-diff equality. No production build, deployment or upload was executed.

## License

Original prompt: MIT, Copyright (c) 2026 Nomaan Khan; full license retained in `LICENSE` and the static license. The referenced OnlineWebFonts stylesheet requests [Web Fonts attribution](https://www.onlinewebfonts.com/fonts) and declares CC BY 4.0; see `NOTICE`. That provider declaration does not establish ownership or grant additional rights to the third-party images.
