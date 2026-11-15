# Preschool Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page site for [SCHOOL], a preschool in [CITY] offering [FOCUS], [RATIO_NOTE]. It must reassure parents: programs by age, a day-in-the-life timeline, three teacher portraits (AI-generated fictional people), a plain tuition table, an honest parent FAQ, and a tour-booking form confirming client-side. One page: index.html with sections (#programs, #day, #teachers, #tuition, #tour). Everything runs in the browser; nothing is submitted anywhere.

- Audience: Parents of 2–5-year-olds touring three schools in a week, reading on phones at 10pm. They want ratios, rhythm, tuition honesty and teachers who look like they'd kneel to talk to their kid.
- Goal: Book the tour. Within ten seconds a parent sees the promise, a teacher's face and the tour CTA; within two minutes they've read the day timeline and tuition.
- Tone: Warm teacher-voice: short sentences, concrete details, gentle humor about toddler logic. No educational jargon without a plain gloss.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (MIT), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource/baloo-2 (OFL-1.1), @fontsource-variable/nunito-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template. One HTML page at the project root: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (warmwhite, milkyway, card, skydeep, skymist, ink, slate, crayon, crayon-deep, rule, good) and fontFamily display ['Baloo 2', 'system-ui', 'sans-serif'], sans ['Nunito Sans Variable', 'system-ui', 'sans-serif']. Set borderRadius DEFAULT to 16px and add maxWidth { container: '1120px' }.
  - In src/fonts.ts import '@fontsource/baloo-2/600.css', '@fontsource/baloo-2/700.css' and '@fontsource-variable/nunito-sans'; import src/fonts.ts and src/index.css from the entry file.
  - File layout: src/content.ts (every string, rate, hour, program, timeline stop, FAQ answer and image path, typed), src/lib/brand.ts (schoolSlug = [SCHOOL] lowercased with every run of non-alphanumeric characters replaced by '-', emailDomain = schoolSlug without hyphens + '.com'), src/lib/storage.ts (safe localStorage get/set wrapped in try/catch, keys prefixed with schoolSlug + ':').
  - State: src/store/tour.ts is a tiny external store (useSyncExternalStore) holding { day, age, name, phone, sent } persisted to localStorage key schoolSlug + ':tour'.
  - Components in src/components/: Header.tsx, Reveal.tsx (Motion whileInView wrapper), Eyebrow.tsx, Footer.tsx; Hero.tsx, Programs.tsx (ProgramCard.tsx), DayTimeline.tsx (StopCard.tsx), Teachers.tsx (TeacherCard.tsx), Tuition.tsx (RateRow.tsx), Faq.tsx, TourForm.tsx (DayChips.tsx, AgeSelect.tsx, Booked.tsx). src/pages/Home.tsx composes them.
  - Before the first build, download every image listed under Assets into public/images/ with curl -L -o using the exact file names given. The build itself never fetches anything.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#FBF8F2'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[SCHOOL] — A preschool in [CITY]</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts, favicon.svg and the six images. Keep it under 10 MB.

## Variables
- [SCHOOL] — School name (default: "Bluebird Garden Preschool"). Invented school name. Used in the wordmark, title, footer, email (hello@ + schoolSlug without hyphens + '.com') and localStorage keys. Never a real school.
- [CITY] — City (default: "Boulder, Colorado"). Where the school is. Used in the title, hero, hours and footer. Real cities fine; street invented.
- [FOCUS] — Focus (default: "play-based learning with real mud"). One lowercase phrase naming the pedagogy. Drives the hero line, program copy and one FAQ. Keep it warm and specific.
- [RATIO_NOTE] — Ratio note (default: "1:8 in every room, 1:6 for toddlers"). The staff-to-child ratio line, used in the trust strip and program cards. Keep it short and plain.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/preschool-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Warm White `#FBF8F2` — Page background throughout.
- Milkyway `#F1EDE3` — Alternate section background (Programs, Tuition), chips, hover fill.
- Card `#FFFFFF` — Program cards, teacher cards, the tour panel, booked state.
- Skydeep `#3A6EA5` — Primary: headlines' accents, primary buttons, selected chips, timeline dots, focus ring.
- Skymist `#E3EDF7` — Selected chip fills, icon wells, timeline base.
- Ink `#2F3338` — Headlines and body text, icon color.
- Slate `#66707A` — Secondary text, captions, eyebrows, closed states.
- Crayon `#EE8B4A` — The one warm accent: the tour CTA, tuition figures, timeline highlight dot, focus-visible extras.
- Crayon Deep `#D2742F` — CTA hover and pressed.
- Rule `#E2DCCE` — 1px hairlines, card borders, input borders.
- Good `#3E8E6D` — Open dot, booked check, license ticks.

### Typography
- Display: H1, H2, H3, program names, teacher names, the wordmark — Baloo 2, rounded and storybook: Baloo 2 (OFL), weights 600/700
- Text and UI: body, eyebrows, buttons, forms, captions; tabular numerals for tuition and hours: Nunito Sans (OFL), weights 400/600/700

### Layout & motion
- Spacing: 8px base unit. Container max-width 1120px, centered, side padding 48px desktop, 32px tablet, 20px under 640px. 12-column grid, column gap 24px. Section vertical padding 96px desktop, 72px under 1024px, 56px under 640px. Type scale: H1 clamp(40px, 6vw, 72px) Baloo 2 700, line-height 1.08; H2 clamp(28px, 3.8vw, 44px) Baloo 700; H3 21px Baloo 700; tuition figures Baloo 700 32px Crayon tabular; lead Nunito 400 17.5px / 1.65 Ink at 90%; body 15.5px / 1.7 (max-width 62ch); eyebrow Nunito 700 12px uppercase letter-spacing 0.15em Slate; caption 13px Slate. Buttons: height 50px, Nunito 700 14px. Primary: Skydeep fill, Card text. Tour CTA: Crayon fill, Card text. Secondary: 1px Skydeep border. Inputs: height 50px, 1px Rule border, Card fill, focus Skydeep border. Focus ring everywhere: 2px Skydeep outline with 3px offset.
- Radius: 16px on cards, buttons, inputs, chips and photos. 999px only for pills, timeline dots and the open dot.
- Motion: Easing: --ease-out cubic-bezier(0.22, 0.61, 0.36, 1) for reveals and the timeline draw; --ease-io cubic-bezier(0.65, 0, 0.35, 1) for the form swap. Gentle and steady — a preschool pace.
- Motion: Reveal: blocks wrapped in <Reveal> start at opacity 0, translateY(12px) and settle over 750ms --ease-out when 15% visible (Motion whileInView, viewport once). Siblings stagger 75ms.
- Motion: Hero: the classroom photo scales 1.04→1.0 over 2200ms; the H1 rises; a small drawn sun bobs once beside the eyebrow (off under reduced motion).
- Motion: Day timeline: the horizontal base line draws left-to-right as the section scrolls; each stop's dot pops in sequence with a 120ms stagger; the current-stop highlight (lunch) fills Crayon.
- Motion: Program cards: hover lifts 3px and the icon well fills Skymist; the age badge ticks once.
- Motion: Teacher cards: portraits scale 1.03 on hover and the one-liner crossfades in.
- Motion: Tuition rows: hover slides a 2px Skydeep rule; figures never animate.
- Motion: Tour form: day chips fill Skydeep on select (150ms); invalid submit shakes 4px with kind inline labels; sending swaps to Booked (300ms --ease-io) — a drawn Crayon 'SEE YOU SOON' sticker scaling in, 'We can''t wait to meet [NAME] (and their grown-up).' day/age echo, 'Change my tour' pre-filled. Persisted in localStorage.
- Motion: Links: .link-draw grows a 1px currentColor underline over 280ms on hover and focus-visible.
- Motion: prefers-reduced-motion: reduce — no scales, draws, pops or staggers; everything at rest; color/border hovers stay. Use CSS @media in index.css plus Motion's useReducedMotion in components.
- Imagery: Bright real photography, all six made for this template in one consistent style: sunlit empty classrooms and play spaces — never any children's faces or bodies; toys and tiny chairs do the talking. Teacher portraits are AI-generated fictional people (warm, kneeling-height energy) — placeholders a real school swaps for its own staff photos. No readable text or signage. Every photo uses object-fit cover with the object-position given under Assets, 16px corners, no shadow; photos on Warm White get a 1px Rule outline. Captions in Nunito 13px Slate. Drawn in code: the favicon, the sun glyph, timeline dots, the sticker and chips. Icons: lucide-react only, stroke width 1.75.

## Pages & Sections
### School (`index.html`)
1. **Content file and copy rules** — All copy below is written for the default values ([SCHOOL] = Bluebird Garden Preschool, [CITY] = Boulder, Colorado, [FOCUS] = play-based learning with real mud, [RATIO_NOTE] = 1:8 in every room, 1:6 for toddlers). Put every string and number in src/content.ts and render from it. If any variable value differs, rewrite the hero, all three programs, the six timeline stops, teacher lines, tuition, FAQ and tour copy so they are specific and believable for the new school, keeping the same structure and counts. All teachers, families and figures are invented; no children appear in any photo. Facts: address '47 Sunflower Lane, [CITY]' invented; phone (303) 555-0169; hours Mon–Fri 8:00–15:30, tours Tue/Thu 9:00 or 10:00; ages 2–5; [RATIO_NOTE]; outdoor playground rain-or-shine; snacks included, lunch from home; licensing described generically ('state-licensed, copies at the front desk'). Programs: 'Seedlings (age 2)' 'mornings of songs, sensory play and heroic snack efforts' ratio 1:6, Tue/Thu or Mon–Wed–Fri; 'Sprouts (ages 3–4)' 'stories, building, the mud kitchen and its diplomacy' ratio 1:8, three or five days; 'Blossoms (pre-K, ages 4–5)' 'letters via treasure hunts, numbers via markets, kindergarten readiness without the drill' ratio 1:8, five days. Day timeline (stop · note): '8:00 Arrival & free play' 'the room warms up one backpack at a time'; '9:00 Circle time' 'songs, calendar, one very important weather report'; '9:30 Choice centers' 'art, blocks, drama, and the science table''s current experiment'; '10:30 Outdoor play' 'rain means puddles; we have the boots'; '11:30 Lunch' 'from home, at tiny tables, with astonishing opinions'; '12:30 Story & rest' 'quiet bodies, quiet books, some heroic napping'; '14:30 Pickup' 'one sticker, one story, one muddier child'. Teachers: 't-marisol.webp' 'Marisol Vega (fictional)' 'lead teacher, Blossoms' 'twelve years; can de-escalate a block dispute at forty paces'; 't-derek.webp' 'Derek Nkemdirim (fictional)' 'lead teacher, Sprouts' 'former park ranger; the mud kitchen is his legacy'; 't-hana.webp' 'Hana Yoon (fictional)' 'lead teacher, Seedlings' 'fluent in toddler, which is harder than it sounds'. Tuition (per month): 'Two mornings (Seedlings)' '$420'; 'Three mornings' '$580'; 'Five mornings (any age)' '$860'; 'Full days, three per week' '$1,090'; 'Full days, five per week' '$1,450'; caption 'Sibling discount 10%; scholarships available — ask on the tour, it''s a two-line form.' FAQs: 'Does my child need to be potty-trained?' 'No. Seedlings especially; we keep a very calm changing station and zero embarrassment.'; 'What about naps?' 'Rest time after lunch for all rooms; cots, sheets from home, back-rubs for the brave.'; 'What food is provided?' 'Morning and afternoon snack; lunch comes from home (nut-free tables, we label everything).'; 'My child clings at drop-off.' 'Normal and welcome — we have a goodbye window routine; most days it takes four minutes, some days eleven, both fine.'; 'Screens?' 'One shared projector for Friday films, otherwise the screens are windows.'
   Layout: n/a
   Motion: n/a
2. **Header** — Left: the wordmark '[SCHOOL]' (Baloo 700 18px) over 'Ages 2–5 · [CITY]' (10px uppercase Slate) linking ./index.html. Right nav (Nunito 600 14px): 'Programs' → #programs, 'A day here' → #day, 'Teachers' → #teachers, 'Tuition' → #tuition; a small Crayon 'Book a tour' → #tour. Under 800px: wordmark + tour button.
   Layout: Sticky top, height 72px, Warm White/95% blur, Rule border.
3. **Hero** — Two columns. Left: eyebrow 'PLAY-BASED · AGES 2–5 · [CITY]'; H1 'Small people,' / '*big mornings.*' Lead (max-width 500px): '[SCHOOL] is [FOCUS] — three rooms, tiny ratios ([RATIO_NOTE]), and teachers who explain the day in stickers and complete sentences.' Primary 'Book a tour' → #tour and secondary 'See a day here' → #day; trust row: '[RATIO_NOTE]'; 'Outdoor play, rain or shine'; 'Tours Tue & Thu mornings'. Right: room-play.webp (4:3) with the caption 'The block corner, before the architects arrive'.
   Layout: Warm White background, vertical padding 104px top; left 6 cols, right 5 cols offset 1.
4. **Programs** — Section id='programs'. Eyebrow 'THREE ROOMS' and H2 'Programs by age, gently ambitious.' Three ProgramCards (age badge, name, three-line rhythm description, ratio pill, days pill): the roster. Caption: 'All rooms share the playground, the garden and the snack schedule — the mud is communal.'
   Layout: Milkyway background. Three columns 24px gap; cards on Card Rule-bordered with age badges in Skymist circles.
5. **Day timeline** — Section id='day'. Eyebrow 'A DAY HERE' and H2 'From backpacks to stickers.' The horizontal DayTimeline: seven stops (dot, time, name, note) with the drawing base line; lunch highlighted in Crayon. Under 760px the timeline becomes vertical with a left rail.
   Layout: Warm White background; the timeline spans the container; stops in a scrollable row on tablet.
6. **Teachers** — Section id='teachers'. Eyebrow 'THE TEACHERS' and H2 'Three people your child will name nightly.' TeacherCards (portrait 4:3 hover scale, name, role, one-liner): the roster. A note: 'All leads hold early-childhood credentials and current first-aid (invented details; copies at the front desk).'
   Layout: Milkyway background. Three columns 24px gap; portraits Rule-outlined.
7. **Tuition and FAQ** — Section id='tuition'. Eyebrow 'TUITION, PLAINLY' and H2 'MONTHLY RATES, NO SURPRISES.' Tuition rows (schedule · figure) hairline-divided from the roster with the caption. Section (continued) FAQ: five accordions (question Baloo 700 17px, answer 15.5px / 1.7) from the roster.
   Layout: Warm White background; tuition max-width 640px; FAQ max-width 720px below.
8. **Tour form and footer** — Section id='tour'. Eyebrow 'BOOK A TOUR' and H2 'Twenty minutes, your child welcome.' TourForm on Card: DayChips (Tue/Thu, 9:00 or 10:00 as two groups of chips); AgeSelect (2 / 3 / 4 / 5); name + phone; primary 'Request the tour' with caption 'Saved in this browser — the real page emails the school. Nothing is sent here.' Booked: the Crayon sticker, 'We can''t wait to meet [NAME] (and their grown-up).' day/time echo, 'Change my tour' pre-filled; persisted in localStorage. Footer (Skydeep→deep gradient or solid, bone text): wordmark, '47 Sunflower Lane, [CITY]', (303) 555-0169 tel:, hello@ + emailDomain; hours; bottom line '© [SCHOOL]. Licensed, loved, occasionally muddy.'
   Layout: Milkyway section for the tour (panel max-width 600px); footer solid Skydeep, three-part row.

## Assets
- image: Template photos made for this design (free to redistribute with the template). Download each with curl -L -o into public/images/: https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/room-play.webp → public/images/room-play.webp (Hero; alt 'A bright preschool room with a block corner and art easels'); https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/t-marisol.webp → public/images/t-marisol.webp (Teacher card; alt 'Marisol Vega, a fictional preschool teacher'); https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/t-derek.webp → public/images/t-derek.webp (Teacher card; alt 'Derek Nkemdirim, a fictional preschool teacher'); https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/t-hana.webp → public/images/t-hana.webp (Teacher card; alt 'Hana Yoon, a fictional preschool teacher'); https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/room-art.webp → public/images/room-art.webp (Programs side; alt 'An art easel with washable paints at child height'); https://media.vibefather.ai/assets/3c706d5d-2ab2-4098-b3c2-0d76cbe48dc1/yard-mud.webp → public/images/yard-mud.webp (Trust/day side; alt 'A playground with a mud kitchen and rain boots'). Six files in total.
- image: Write ASSETS.md at the project root with a table: path, source URL, author, license — one row for each photo (source 'media.vibefather.ai, made for this template', author 'VibeFather', license 'Distributed with the template'), plus rows for @fontsource/baloo-2 and @fontsource-variable/nunito-sans (OFL-1.1) and lucide-react (ISC). Teacher portraits are AI-generated fictional people per the portrait rules; NO children appear in any photo — classrooms and yards stay empty.
- icon: lucide-react only: Sun, Blocks, Palette, CloudRain, Utensils, BookOpen, Smile, Check, Plus. Stroke width 1.75, 16–24px, color inherits. The sun glyph, timeline dots, the SEE YOU SOON sticker and favicon are drawn SVG. public/favicon.svg: viewBox 0 0 32 32, a 32x32 rect rx 9 filled #3A6EA5, a Card (#FFFFFF) bird glyph with a Crayon (#EE8B4A) sun dot. No other logo: the school name is always set as type.
- font: Install @fontsource/baloo-2 and @fontsource-variable/nunito-sans and import them in src/fonts.ts as listed in Setup. Vite bundles the woff2 files into dist/.
- image: Drawn in code: the sun glyph, timeline dots and rail, the sticker, chips and the favicon. No other bitmaps beyond the six photos; no illustrations; no map tiles.

## Don'ts
- No backend, no form submission, no fetch to any API: the tour request saves in the browser only (localStorage) and says so; tel: links are built from the phone digits.
- All links on this single page are anchors (./index.html#programs, #day, #teachers, #tuition, #tour) plus the footer mailto.
- No children's faces or identifiable children in any photo — classrooms and yards stay empty; only the three teacher portraits show people, as AI-generated fictional adults.
- Self-host everything: fonts through Fontsource, icons as npm packages or inline SVG, images downloaded into public/images/. No CDN <script> or <link> tags, no Google Fonts, no analytics.
- Production build: minified, no source maps, no src/ copied into dist/, single command npm run build, output in dist/ under 10 MB.
- No real schools, licensing bodies or their marks; licensing described generically; no real addresses.
- No dates or years anywhere; day chips are weekday-named; the site never shows today's date.
- Never mention VibeFather or any other brand inside the site except the optional credit footer link; all copy is invented US English.
- Respect prefers-reduced-motion: no scales, draws, pops or staggers; everything at rest; color/border hovers stay.
- The page must work at 1440x900 desktop and 390x844 mobile with zero console errors; chips, selects and the form work with keyboard only and visible focus rings.
- Keep copy teacher-warm: no lorem, no academic jargon; every rate, hour and ratio lives in src/content.ts.

---
— Prompt by VibeFather · https://vibefather.ai/t/preschool-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
