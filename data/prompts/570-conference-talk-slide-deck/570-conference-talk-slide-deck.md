# Conference Talk Slide Deck

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A slide website for [TALK], a 20-minute talk by [SPEAKER]: nine slides across seven types, keyboard-driven, with an overview grid, speaker notes, deep links and a print handout. One page, index.html; everything runs in the browser.

- Audience: A speaker rehearsing at their desk and an audience reading the deck later from a link. Both need big type, obvious progress, and zero clicking.
- Goal: Present fluently. Within five seconds the deck advances with a keypress; within a minute the visitor has opened the overview and jumped to a slide.
- Tone: Stage-confident: short lines, big claims earned by the next slide. One joke per three slides.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (ISC), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource-variable/bricolage-grotesque (OFL-1.1), @fontsource-variable/inter (OFL-1.1), @fontsource/jetbrains-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template (pin the version if the latest template targets newer majors), then keep one real HTML page: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (stage, stage-2, line, bone, mist, spotlight, spotlight-deep, spotlight-mist, good) and fontFamily display ['Bricolage Grotesque Variable', 'system-ui', 'sans-serif'], sans ['Inter Variable', 'system-ui', 'sans-serif'], mono ['JetBrains Mono', 'ui-monospace', 'monospace']. Set borderRadius DEFAULT to 8px and add maxWidth { deck: '1180px' }.
  - In src/fonts.ts import '@fontsource-variable/bricolage-grotesque', '@fontsource-variable/inter' and '@fontsource/jetbrains-mono/400.css' plus '500.css'; import src/fonts.ts and src/index.css from the entry file.
  - File layout: src/content.ts (the talk: speaker, title, venue line, slides — a discriminated union of the seven types with every string typed; each slide carries its own speaker note), src/lib/brand.ts (speakerSlug = [SPEAKER] lowercased with every run of non-alphanumeric characters replaced by '-', talkSlug from [TALK]), src/lib/highlight.ts (the tiny tokenizer for code slides: regex spans for strings, numbers, comments, keywords, functions — returns React-safe token arrays, no dangerouslySetInnerHTML).
  - State: src/store/deck.ts is a tiny external store (useSyncExternalStore) holding { index, overviewOpen, notesOpen } and syncing the hash (#/3) both ways (hashchange listener + replaceState on navigation).
  - Keyboard: a single window keydown handler — ArrowRight/ArrowLeft/Space/Backspace navigate (Space and Backspace never scroll: preventDefault when the deck has focus context), Home/End jump, digits 1–9 jump to that slide, G toggles overview, S toggles notes, Escape closes overlays. All buttons that mirror keys carry the key hint in mono chips.
  - Components in src/components/: Deck.tsx (SlideFrame.tsx with ProgressBar.tsx, Counter.tsx, KeyHints.tsx), slides/TitleSlide.tsx, AgendaSlide.tsx, StatementSlide.tsx, BulletsSlide.tsx (BulletRow.tsx), CodeSlide.tsx (CodeBlock.tsx, FocusHint.tsx), TwoColSlide.tsx, ClosingSlide.tsx; OverviewGrid.tsx (MiniSlide.tsx), NotesDrawer.tsx. src/pages/DeckPage.tsx composes them.
  - CodeSlide: the sample occupies the left 7 cols at JetBrains Mono 400 20px / 1.7 on Stage 2; the tokenizer colors tokens per the palette; the right 4 cols carry the slide's point and a FocusHint ('← → step lines'): pressing ArrowUp/ArrowDown (when the code slide is active and no overlay is open) moves a Spotlight 2px underline between numbered lines, dimming others to 40%. The stepping is optional decoration — the full code is always visible.
  - OverviewGrid: press G — a scrim over the deck with a 3-column grid of MiniSlides (scaled-down live renders, aria-labels with slide titles); arrow keys move a Spotlight selection ring, Enter jumps, Escape/G closes.
  - NotesDrawer: press S — a bottom drawer (240px) with the current slide's speaker note in Inter 15px Mist, a 'Notes are yours, not the audience's' caption, and next/prev mirrors.
  - Slide transitions: incoming slides fade in place (opacity + 8px scale 0.995→1, 320ms --ease-out); outgoing exit instantly. Under prefers-reduced-motion: instant swaps, no transitions anywhere.
  - Print stylesheet (@media print in index.css): one slide per page (each SlideFrame breaks to a new page, backgrounds preserved via print-color-adjust: exact), progress bar and overlays hidden; @page margin 12mm. A quiet 'Print handout' button (Printer icon) beside the counter.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#0C0D10'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[TALK] — slides</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts and favicon.svg. Keep it under 3 MB.

## Variables
- [SPEAKER] — Speaker name (default: "Elena Marsh"). The invented speaker's name. Used on the title slide, closing slide and footer line. Never a real speaker.
- [TALK] — Talk title (default: "Ship Small, Sleep Well"). The talk's title, title case. Drives the title slide, document.title and the deck's voice. Invented, not a real talk.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/conference-talk-slide-deck in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Stage `#0C0D10` — The deck's ground everywhere.
- Stage 2 `#131519` — Code panels, overview tiles, notes drawer.
- Line `#23262D` — 1px hairlines: progress bar track, code panel border, drawer border.
- Bone `#F2EFE9` — Slide text — headlines, bullets, statements.
- Mist `#8E939D` — Meta text: counters, key hints, captions, notes.
- Spotlight `#E8B44A` — The one warm accent: the progress bar fill, active rings, key-hint chips, code focus underline, links.
- Spotlight Deep `#C99633` — Pressed states.
- Spotlight Mist `#2E2712` — Selected overview tiles, code keyword tint.
- Good `#7FB069` — Code strings and the closing slide's thanks dot.

### Typography
- Display: title, statements, bullet leads — Bricolage Grotesque, big and warm: Bricolage Grotesque (OFL), weights 400/600
- Text and UI: agenda, two-column copy, notes, counters: Inter (OFL), weights 400/500/600
- Mono: code, key hints, slide numbers: JetBrains Mono (OFL), weights 400/500

### Layout & motion
- Spacing: The deck fills the viewport (100dvh) with 72px side padding desktop, 24px under 640px; slides center their content vertically. Type scale — the stage rule: if it can't be read from the back row, it's too small. Title slide title clamp(56px, 9vw, 120px) Bricolage 600; statement slides clamp(44px, 7vw, 96px); bullet leads 34px; agenda items 26px; two-column copy 20px / 1.65; code 20px / 1.7; meta and key hints 13px mono/Inter. Buttons: height 40px, Inter 600 13px; ghost 1px Line border. Focus everywhere: 2px Spotlight outline, 3px offset.
- Radius: 8px on code panels and tiles; 999px for key-hint chips and the counter pill.
- Motion: Easing: --ease-out cubic-bezier(0.22, 0.61, 0.36, 1). Projector-calm: one move per action.
- Motion: Slide transitions as specified: fade-in-place 320ms; bullets and agenda rows stagger 60ms within their slide on entry; the statement slide's word underline draws once (400ms).
- Motion: Code focus: the Spotlight underline moves between lines with a 160ms ease; non-focused lines dim 180ms.
- Motion: Overview: the scrim fades 160ms; tiles rise 8px staggered 30ms; the selection ring moves with a 160ms ease.
- Motion: Notes drawer: slides up 200ms; Escape reverses.
- Motion: Progress bar: the fill width follows the slide index with a 260ms ease; the counter crossfades on change.
- Motion: prefers-reduced-motion: reduce — instant slide swaps, no staggers, no ring easing (it jumps), no underlines drawing; everything readable and fully usable. Use CSS @media in index.css plus Motion's useReducedMotion.
- Imagery: Zero images: the deck is type on black with the Spotlight accent; code colors come from the palette (strings Good, keywords Spotlight Mist-tinted, numbers Mist-bright, comments Mist-dim). Icons: lucide-react only, stroke width 1.75. The favicon is drawn SVG. No photos, no logos, no sponsor bars.

## Pages & Sections
### Deck (`index.html`)
1. **Content file and copy rules** — All copy below is written for the defaults ([SPEAKER] = Elena Marsh, [TALK] = Ship Small, Sleep Well). Put every string and note in src/content.ts and render from it. If any variable differs, rewrite all nine slides so they present that talk believably, keeping the same structure and slide-type sequence. Slides: 1 TITLE — the talk title huge, '[SPEAKER]' and the venue line 'SampleConf · Main stage (sample)' in Mist; 2 AGENDA — 'Three honest failures' with three items ('A launch that hurt', 'The rewrite that didn't', 'What I ship now'); 3 STATEMENT — 'Small ships sleep well.'; 4 BULLETS — 'What small actually means' with four leads ('One screen', 'One dependency less', 'One honest promise', 'One rollback plan') each with a one-line sub; 5 CODE — 'The whole check, honestly' with a 12-line TypeScript snippet (a tiny deployCheck function with strings, numbers, comments) and the point 'If it fits on a slide, it fits in your head'; 6 TWO-COL — 'The launch that hurt' (left: 3 short paragraphs; right: a mono 'postmortem, abridged' list of 4 lines); 7 STATEMENT — 'Boring is a feature you ship.'; 8 BULLETS — 'Monday, at your desk' with three actions ('Delete one thing', 'Write the rollback first', 'Tell one user the truth'); 9 CLOSING — 'Thank you.' + '[SPEAKER]' + 'Slides stay at this link (sample)' + the thanks dot. Every slide carries a 1–2 sentence speaker note (sample: slide 3's note 'Pause here. Let it sit for three seconds.'). All conference names and outcomes are invented sample content; jokes land on slides 2, 6 and 9.
   Layout: n/a
   Motion: n/a
2. **Deck chrome** — SlideFrame wraps every slide: a 2px progress bar (Line track, Spotlight fill) fixed top; bottom-left the counter pill ('3 / 9' mono); bottom-right KeyHints ('← → move · G grid · S notes' with mono chips) and the Print handout ghost button. The chrome hides during print.
   Layout: Fixed chrome; the slide content area centers within.
3. **Overlays** — OverviewGrid (G): a 3-column grid of scaled MiniSlides with titles and numbers; the Spotlight ring selects via arrows; Enter jumps; Escape closes. NotesDrawer (S): the current slide's note, prev/next mirrors, and the caption 'Notes are yours, not the audience's.'
   Layout: Overview: full-viewport scrim (Stage at 88%); notes: bottom drawer 240px with Line top border.

## Assets
- image: No images at all: the deck is type, code and accent color drawn in code. Do not fetch or hotlink anything.
- image: Write ASSETS.md at the project root listing the code-drawn assets (progress bar, key-hint chips, code highlighting, favicon — 'drawn in code, original') and the npm packages: @fontsource-variable/bricolage-grotesque, @fontsource-variable/inter, @fontsource/jetbrains-mono (OFL-1.1) and lucide-react (ISC).
- icon: lucide-react only: ArrowLeft, ArrowRight, Grid3x3, NotebookPen, Printer, X. Stroke width 1.75, 14–18px, color inherits. public/favicon.svg: viewBox 0 0 32 32, a 32x32 rounded square filled #0C0D10 with a 1.5px #E8B44A border, a #E8B44A right-pointing chevron centered. No brand logos.
- font: Install @fontsource-variable/bricolage-grotesque, @fontsource-variable/inter and @fontsource/jetbrains-mono and import them in src/fonts.ts as listed in Setup. Vite bundles the woff2 files into dist/.

## Don'ts
- No backend, no form submission, no fetch to API, no keyboard-shortcut libraries: one window keydown handler does everything; the hash is the only persistence.
- Every internal link is the deck itself (./index.html#/4) — never a bare directory; opening without a hash shows slide 1.
- No real conferences, talks, speakers or their slides; the talk, venue line and outcomes are invented sample content.
- No reveal.js, Spectacle or any slide library; no highlighter library — highlighting is the hand-rolled tokenizer with no dangerouslySetInnerHTML.
- No images, photos, logos or sponsor bars; everything is code-drawn type and color.
- No dates or years; the venue line is static sample text.
- Self-host everything: fonts through Fontsource, icons as npm packages or inline SVG. No CDN <script> or <link> tags, no Google Fonts, no analytics.
- Production build: minified, no source maps, no src/ copied into dist/, single command npm run build, output in dist/ under 3 MB.
- Never mention VibeFather inside the site except a tiny chrome caption 'Built with a VibeFather template' linking https://vibefather.ai in the closing slide's corner.
- Respect prefers-reduced-motion: instant swaps, no staggers; the deck remains fully keyboard-driven.
- The deck must work at 1440x900 desktop and 390x844 mobile (touch: left/right halves of the screen tap-advance; key hints mention both) with zero console errors; every keyboard path works, focus rings are visible on all chrome buttons, and Space never scrolls the page.
- Accessibility: slides are real regions with aria-labels; the counter and progress update aria-live politely; overview tiles are buttons with slide titles.

---
— Prompt by VibeFather · https://vibefather.ai/t/conference-talk-slide-deck · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
