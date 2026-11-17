# Jubilee Junction

English, single-page illustrated theme-park homepage. Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.

## Input and attribution

- Original: `data\prompts\620-theme-park-website\620-theme-park-website.md`.
- Shared design: `src\workflows\AI Agent\DESIGN.md`.
- Prompt by **VibeFather**, [Theme Park Website](https://vibefather.ai/t/theme-park-website), [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Non-commercial adaptation; commercial use requires the applicable VibeFather license. Upstream snapshot: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/theme-park-website/prompt.md.
- Applicable source license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`. See local `LICENSE` and `ASSETS.md`. No third-party demo artwork copied.

## Implementation

Original code-drawn SVG park with four organic zones, wheel, double-loop coaster, carousel, lake, trees, fourteen keyboard-operable numbered ride dots and ride-detail popover. Mirrored thrill and cumulative minimum-height filters share state with nine featured ride cards. Three ticket comparisons reveal a no-payment demo note. Static sample hours and three shows feed an ordered, locally saved itinerary, with completion checks, move up/down, remove, clear and live categorized totals. Reduced motion suppresses springs and confetti. Mobile navigation and a horizontally scrollable map retain keyboard access.

Source: `index.html`, `styles.css`, `app.js`, `src\content.ts`. The latter is JavaScript-compatible TypeScript and the single editable content/data file; `content.js` is its unchanged browser copy. `out\` contains only independent static HTML/CSS/JavaScript, SVG, local Fontsource fonts and license notices. Source and static copies are kept identical; no build was run.

**Authorized stack adaptation:** the requested Vite 5 / React 18 / TypeScript / Tailwind 3.4 / Motion component project is adapted to native HTML, CSS and browser ES modules to deliver static output without an unauthorized build. Native DOM components, CSS animations, IntersectionObserver and Web Animations replace React/Motion/Tailwind. Fredoka 500/600/700 and DM Sans 400/500/700 are shipped locally from existing Fontsource packages; Lucide shapes are rendered once from the installed package into a local SVG sprite. No CDN, external runtime requests, image generation, APIs, backend, dependencies installed or production build.

## Running and validation

From the repository root, serve the actual export with the repository preview helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\620-theme-park-website\GPT-6\out
```

This captures the real 1200×900 homepage and closes its server/browser; it is not a permanent web server. The private `.checks\verify.mjs` runs focused Playwright assertions using `startPreviewServer`, only serving this export at `/pages/theme-park-website/GPT-6/index.html`, and closes owned resources in `finally`. Run it from the repository root with `node out\pages\620-theme-park-website\GPT-6\.checks\verify.mjs`.

Actual QA results and viewport evidence are saved in `.checks\qa.json`; actual screenshots are `.checks\desktop.png` and `.checks\mobile.png`. Final validation and visual-review results are documented there and in the private job report. `out\preview.png` is the separately captured collection preview, with `.generation-preview.sha256` binding it to static content. No collection build, deployment or publication is performed; registration is disabled by default.

Final focused run: **21 verification groups passed**, covering 1200×900 and 1440×900 desktop, 390×844 mobile, no overflow before/after interactions, all ticket demos, shared filters and empty matches, keyboard popovers/focus return, touch/keyboard navigation, saved/reordered/completed/removed/cleared plans, reduced motion, corrupt storage recovery and blocked-storage fallback. No HTTP, request, console or page errors occurred. Both final desktop/mobile PNGs were actually opened for visual review; ride, ticket and mobile-plan section captures were also opened. The fresh 1200×900 repository-managed preview was separately opened and inspected. QA found and fixed a menu event-target replacement bug and desktop menu visibility; screenshot review refined map labels, entrance visibility and mobile swipe guidance. CSS easing approximates the requested Motion spring rather than reproducing its physical parameters.

## Honest limits

Everything is fictional sample data, including heights, prices, hours and ride counts. Fourteen mapped rides and nine featured cards represent a sample park of 24, not 24 implemented rides. The requested day-pass “Both daily shows” copy is retained; the separate schedule also includes a parade. Height filters are cumulative: 102 cm includes any-height rides; 122 cm includes all sample thresholds. They are illustrative, not safety advice. No live wait times are presented or implied. Ticket buttons only reveal information; they do not reserve, charge, contact a booking service or collect customer data. Plan ids use localStorage `dayPlan`; completion ids use `dayPlanDone`. Storage failure leaves a session-only plan with a visible warning. There is no cross-device synchronization, itinerary timing/conflict calculation, live operating schedule or real-world booking.

No environment variables or credentials are required. Artwork is original geometric code; the prompt credit and non-commercial notice remain visible.
