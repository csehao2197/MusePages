# Online Course Sales Page

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page sales page for [COURSE], an online course teaching [TOPIC], taught by [INSTRUCTOR], priced $[PRICE] or three payments of $[PRICE]/3-ish (plan math exact in content.ts). It must do the long-form job in one scroll: promise + video-frame hero (placeholder modal, honest), sample outcome strip, six-module curriculum accordion, instructor story, three sample results, full-pay/3-pay pricing with inclusions, a 30-day guarantee, and an eight-question FAQ. One page: index.html with sections (#curriculum, #instructor, #results, #pricing, #faq). Everything runs in the browser; nothing is submitted anywhere.

- Audience: Hobbyists and career-switchers 22–45 who have three tabs of similar courses open and a folder of abandoned projects. They buy when the curriculum proves depth, the results feel honest, and the guarantee removes the last excuse.
- Goal: Sell the enrollment. Within ten seconds a visitor knows what they'll make and that it's for beginners; within three minutes they've read two modules, one result and the guarantee.
- Tone: Encouraging and specific, like the instructor's first email to a student: concrete outcomes ('you will ship a 60-second game'), zero income claims, one warm joke per screen.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (MIT), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource/domine (OFL-1.1), @fontsource-variable/assistant (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template. One HTML page at the project root: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (cream, walnut, card, espresso, roast, marigold, marigold-deep, sage, rule) and fontFamily display ['Domine', 'Georgia', 'serif'], sans ['Assistant Variable', 'system-ui', 'sans-serif']. Set borderRadius DEFAULT to 14px and add maxWidth { container: '1080px' } — a letter-width read.
  - In src/fonts.ts import '@fontsource/domine/500.css', '@fontsource/domine/700.css' and '@fontsource-variable/assistant'; import src/fonts.ts and src/index.css from the entry file.
  - File layout: src/content.ts (every string, module, lesson, run time, result, plan, inclusion, FAQ answer and image path, typed), src/lib/brand.ts (courseSlug = [COURSE] lowercased with every run of non-alphanumeric characters replaced by '-', emailDomain = 'hello.' + instructorSlug + '.example' style invented address: instructor@ + courseSlug without hyphens + '.com'), src/lib/storage.ts (safe localStorage get/set wrapped in try/catch, keys prefixed with courseSlug + ':').
  - State: src/store/plan.ts is a tiny external store (useSyncExternalStore) holding { plan: 'full' | 'three' } persisted to localStorage key courseSlug + ':plan'; the pricing card, sticky CTA and final CTA all read the same plan price.
  - Components in src/components/: Header.tsx (sticky with an always-visible Enroll button reading the live plan price), Hero.tsx (VideoFrame.tsx — poster, play glyph, duration badge; PlayModal.tsx — the honest placeholder), OutcomeStrip.tsx, Curriculum.tsx (ModuleAccordion.tsx), Instructor.tsx, Results.tsx (ResultCard.tsx), Pricing.tsx (PlanToggle.tsx, IncludedList.tsx), Guarantee.tsx, Faq.tsx, FinalCta.tsx, Footer.tsx, Reveal.tsx (Motion whileInView wrapper), Eyebrow.tsx. src/pages/Home.tsx composes them.
  - Before the first build, download every image listed under Assets into public/images/ with curl -L -o using the exact file names given. The build itself never fetches anything.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#FAF6EE'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[COURSE] — Learn [TOPIC] from zero</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts, favicon.svg and the six images. Keep it under 10 MB.

## Variables
- [COURSE] — Course name (default: "Tiny Games Workshop"). Invented course title. Used in the title, hero, header, footer, localStorage keys and the enrollment button ('Enroll — $[PRICE]'). Never a real course.
- [TOPIC] — What it teaches (default: "making tiny 2D games from scratch"). One lowercase phrase for the skill. Drives the hero promise, module titles, two results and three FAQ answers. Keep it beginner-true (no prior experience needed).
- [INSTRUCTOR] — Instructor (default: "Theo Marsh"). The invented teacher's name. Used in the bio, the video modal ('a note from [INSTRUCTOR]'), results' context and the footer signature. Never a real person.
- [PRICE] — Full price (default: "149"). The full-payment price as digits. The three-pay plan is exactly 3 × $55 for the default ($165 total, stated plainly); if [PRICE] differs, the plan prices recompute in content.ts as round thirds + $16 with the total shown. Drives the pricing card, sticky CTA and final CTA.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/online-course-sales-page in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/online-course-sales-page?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/online-course-sales-page · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
