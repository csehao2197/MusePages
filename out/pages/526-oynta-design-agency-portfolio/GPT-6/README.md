# Oynta — Independent by design

- Original input: `data\prompts\526-oynta-design-agency-portfolio\526-oynta-design-agency-portfolio.md`.
- Actual generator: **gpt-6.1-sol**. Public model directory: **GPT-6**.
- Source: this directory. Independent static homepage: `out\index.html`.
- Public subpath: `/pages/oynta-design-agency-portfolio/GPT-6/index.html`.
- Prompt provenance: frostmute/msites-prompt-collection, snapshot `d4974f4296e2851e05eabddb9240170cc423dd46`; copyright 2026 Nomaan Khan, MIT. See `LICENSE` and `NOTICE`.

## Experience

Dark liquid WebGL hero with original 2D noise/domain-warp shader, animated solution underline, rotating project badge, four services, draggable three-card project stack, case-study dialogs, sticky studio story and parallax masonry, grayscale team hover/focus treatment, outlined marquee, single-open FAQ, three project plans, and a parallax-reveal footer. Mobile navigation uses a native modal with focus containment, Escape dismissal, and background scroll lock.

Project inquiries produce a downloadable brief in the current tab only. Nothing is sent, persisted, or connected to a backend. Prices, projects, studio statistics, and named profiles are illustrative. Social controls explicitly explain that no real accounts are connected. No environment variables or credentials are required.

## Static adaptation and limits

The original specifies React/Vite/TypeScript, Tailwind v4, Framer Motion, R3F/Three.js, and Lenis. This authorized no-build adaptation uses semantic HTML, CSS, and native browser JavaScript instead. It preserves the specified section architecture, shader palette/domain warping, card depth and drag interactions, responsive layouts, scroll transforms, and major motions without framework runtimes. Native smooth scrolling and 0.1-interpolated scroll transforms replace Lenis; a globally identical Lenis wheel curve is not claimed. FAQ expansion uses native disclosure with CSS entrance motion rather than Framer height interpolation.

Inter and Outfit are self-hosted under the SIL Open Font License. Photographs are downloaded Unsplash visual references; their subjects are not presented as real Oynta staff or clients. Lucide-style icons retain their upstream license. The WebGL shader caps DPR at 2, pauses offscreen/when hidden, and uses a CSS fallback if WebGL is unavailable. Reduced motion pauses decorative motion and disables parallax.

## Run and verify

From the repository root, preview without a build:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\526-oynta-design-agency-portfolio\GPT-6\out
```

Private targeted QA runner: `node src\workflows\script\.ai-gpt6-526.mjs qa`.
Evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`, plus public `out\preview.png`. Static check, browser assertions, actual screenshot review, preview digest, and disabled configuration registration are recorded separately in the private outcome report. QA status is finalized after those checks, not inferred from the existence of these instructions. No build, dist, publication, upload, external AI call, or real contact submission is performed.

### Verified browser result

Chromium passed 29 assertions at 1200 × 900 and 390 × 844, DPR 1: final-subpath HTTP, local fonts/images, nonblank hero, overflow checks before/after interactions, previous/next/keyboard/background-card selection, mouse drag/mobile touch swipe, case studies, FAQ keyboard behavior, Pro plan selection, validation/editing/download of a local brief, menu focus containment/Escape/scroll unlock, team focus treatment, social disclosure, and back-to-top. A normal-motion test verified WebGL offscreen pause/resume. No HTTP/resource/request/console/page errors were recorded.

Both real first-screen PNGs and full-page PNGs were opened and visually reviewed: strong headline hierarchy, restrained dark liquid treatment, consistent white-section spacing, readable typography, coherent stacked work imagery, unclipped mobile layouts, and clear light/dark section transitions. Initial font weight and focus-containment issues were corrected and the complete final QA passed. See the private report for final preview/registration state; the option remains disabled and undeployed.

## Asset record

- `images\data.jpg`: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85
- `images\abstract.jpg`: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=85
- `images\workspace.jpg`: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85
- `images\team.jpg`: https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85
- `images\office.jpg`: https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=85
- `images\alex.jpg`: https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85
- `images\maya.jpg`: https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85
- `images\sam.jpg`: https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85
- `fonts\inter.ttf`: https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf
- `fonts\LICENSE-Inter.txt`: https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt
- `fonts\outfit.ttf`: https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/Outfit%5Bwght%5D.ttf
- `fonts\LICENSE-Outfit.txt`: https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/OFL.txt
- `LICENSE-Lucide.txt`: https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE
