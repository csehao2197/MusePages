# Alwayzz

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\532-alwayzz-subscription-design-agency\532-alwayzz-subscription-design-agency.md`; common design: `src\workflows\AI Agent\DESIGN.md`.
- Source: [Nomaan Khan / frostmute, MIT prompt collection](https://github.com/frostmute/msites-prompt-collection/blob/d4974f4296e2851e05eabddb9240170cc423dd46/motionsites-prompts/405-subscription-agency/prompt.md). See `LICENSE`.
- Model source: `out\pages\532-alwayzz-subscription-design-agency\GPT-6\`; static export: its `out\` folder.

## Implementation

Minimal monochrome hero with the exact requested remotely hosted background and portrait, Google Fonts, animated side/top curves, service and company marquees, responsive typography and stacked mobile CTAs. The keyboard-accessible full-screen navigation opens working discipline, plan, studio-role, FAQ and booking panels. Plans update the consultation context; the local booking form validates and previews a date/time. Escape closes dialogs and returns focus; reduced-motion preferences are supported.

This authorized static HTML/custom CSS/browser JavaScript adaptation replaces the requested React + Vite + Tailwind setup without a build. Chevron artwork uses the Lucide ChevronUp path. No backend, pricing, real staff or verified client endorsements are claimed. Booking is explicitly a browser-only demo, with no persistence, transmission, email or calendar reservation. Additional panel copy and the typographic concept are illustrative, not a client portfolio.

Exact external images are referenced, not downloaded or relicensed. The prompt MIT license does not grant separate rights to those images, brand names or Google Fonts. Their hosts must remain available; no ownership is claimed. Availability of Cedarville Cursive is limited to its supplied Google Fonts weight.

## Running and validation

From the repository root: `node src\workflows\script\generate-preview.mjs "out\pages\532-alwayzz-subscription-design-agency\GPT-6\out"` captures a preview with the existing static-only local server. For complete private browser assertions, run `node src\workflows\script\.ai-gpt6-532-qa.mjs`.

Public subpath: `/pages/alwayzz-subscription-design-agency/GPT-6/index.html`. Private QA is in `.checks\qa.json`, `.checks\desktop.png` and `.checks\mobile.png`; the actual public first-screen capture is `out\preview.png`. Validation and visual-review outcomes are recorded after execution. No production builds or deployment are authorized; registration stays disabled and undeployed.

Actual Chromium QA passed at 1200×900 and 390×844, DPR 1: HTTP/resource/font/image loading, visible homepage, overflow before and after all interactions, keyboard menu/Escape/focus management, discipline selection, plan-to-booking context, required-field validation, local booking preview, clearing form data, FAQ expansion, studio contact navigation and reduced motion. Both actual screenshots were opened and visually reviewed: strong serif/sans contrast, balanced centered hierarchy, readable copy and clear stacked mobile controls. The exact background introduces faint cyan/blue edge color despite the otherwise monochrome design. An initial keyboard focus-wrap assertion failed, was fixed with explicit dialog Tab wrapping, and passed on rerun. QA screenshots and reports remain private; this is not a production service.

The fresh 1200×900 `out\preview.png` was generated through `StaticHomepage.ensurePreview`, opened and reviewed separately; its paired static/image digest is recorded in `.generation-preview.sha256`.
