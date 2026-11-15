# Music Lessons School Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a one-page site for [BRAND], the music school run by violinist-director [FOUNDER] in [CITY], [EXPERIENCE] and 300 students along. The page is warm — plum, brass, cream, sunlit instrument photos — with an instruments-and-teachers grid across six instruments, a lesson finder (instrument, age, level, format → matching teachers with weekly openings), pricing by lesson length, a browser-local practice tracker, a recitals-and-events page framed as community, and a trial booking that carries the finder's choices. All teachers, openings, prices and events are invented sample data.

- Audience: Primary: parents hunting for the right first teacher and adults who kept meaning to start — both checking warmth before credentials. Secondary: tutoring centers and art studios adapting the finder and tracker.
- Goal: Move a visitor from 'who would suit my kid' to a booked trial: match a teacher in three taps, show the price plainly, let the practice tracker prove the school takes joy seriously, then book the trial with everything attached.
- Tone: Warm studio English — a director who remembers every student's dog's name. Encouraging about practice without pressure; honest about instruments being loud at first.

## Stack
- Framework: Vite 6 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), vite (MIT), typescript (Apache-2.0), tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/petrona (OFL-1.1), @fontsource/mulish (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Create a Vite 6 + React 18 + TypeScript project with base './', build.outDir 'dist', build.sourcemap: false. No router, no backend, no server code.
  - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer. Extend the theme with the exact palette below, fontFamily.display 'Petrona' and fontFamily.body 'Mulish'.
  - Self-host Petrona weights 600 and 700 and Mulish weights 400, 600, 700, 800 through @fontsource/petrona and @fontsource/mulish, imported in src/main.tsx. Never load fonts from a CDN.
  - Use Motion from 'motion/react' (motion, useInView, useReducedMotion) for reveals, tracker fills and count-ups; gate every animation on useReducedMotion().
  - Keep all copy and data in src/content.ts: brand strings, hero copy, instruments, the four teachers (name, instruments, style line, formats, ages, levels, photo, weekly openings), pricing tiers, tracker copy, events, reviews, form options. When variable values change, rewrite the dependent copy there and derive storage keys and the tel: link from [BRAND] and [PHONE] so no default-brand remnants remain.
  - Lesson finder, exactly: inputs — instrument chips (Piano, Guitar, Violin, Voice, Drums, Cello), age chips (Child 6–10 / Tween 11–13 / Teen 14–17 / Adult 18+), level chips (Beginner / Some experience / Advanced), format chips (In-person / Online / Either). Teachers: 'Amara Lin' — violin, viola, cello — in-person & online — ages child+ — beginner through advanced — openings 'Tue 4:00', 'Wed 5:30', 'Sat 9:00'; 'Ben Osei' — piano — in-person — ages child+ — beginner & some experience — openings 'Mon 3:30', 'Thu 4:30', 'Sat 10:30'; 'Carmen Ruiz' — voice, guitar — in-person & online — ages tween+ — all levels — openings 'Tue 5:00', 'Fri 3:30', 'Sat 11:00'; 'Dana Whitehorse' — drums, piano — in-person — ages child+ — beginner & some experience — openings 'Mon 4:00', 'Wed 3:30', 'Thu 6:00'. Matching returns every teacher who teaches the instrument and fits the chosen filters (format 'Either' matches all); a no-match state shows 'No one fits that exact mix — loosen a filter, or note that online teachers match everywhere' plus a 'Loosen filters' chip, never an empty page. A selected match shows openings as bookable chips that prefill the trial form (teacher + opening).
  - Practice tracker, exactly: a Mon–Sun grid of seven cells; tapping a cell cycles 0 → 10 → 20 → 30 → 45+ minutes (labels '10', '20', '30', '45+'); the grid fills in brass intensity per value; a week-total counter and a goal bar toward 100 minutes; a streak line counting consecutive logged weeks from stored history ('2-week streak — the metronome approves'); a 12px note 'Lives in this browser only — bring your streak to lessons for bragging rights.' Persist to localStorage under [BRAND_SLUG]-practice.
  - Pricing tiers, exactly: 30 minutes — $38; 45 minutes — $52; 60 minutes — $64; notes — online lessons $6 less per lesson; second student in a family 10% off; monthly billing, no registration fee, sample prices.
  - Use only these lucide-react icons: Phone, Music, Piano, Guitar, Mic, Drum, CalendarCheck, Clock, CheckCircle2, Star, MapPin, ChevronRight, ArrowRight, Menu, X, Users, Sparkles, Metronome? (use Timer), Heart.
  - Persist the finder selection, practice tracker and trial booking to localStorage, namespaced with [BRAND_SLUG]; validate restored JSON and recover silently from malformed data.
  - Download the six generated photos to the exact public paths listed in Assets before building. Create ASSETS.md at the project root listing every file's path, source URL, author or generator, and license.
  - A plain <title> of [BRAND] and a favicon (the plum circle with a brass quarter-note) are enough; no meta descriptions, Open Graph tags, JSON-LD, or sitemaps.

## Variables
- [BRAND] — School name (default: "Cadence House Music"). Invented school name; a quarter-note logomark is derived from it in code.
- [CITY] — City (default: "Birchwood"). Where the school is; appears in hero, events and footer.
- [FOUNDER] — Director (default: "Amara Lin"). Invented violinist-director; also the first teacher card.
- [PHONE] — Phone (default: "(555) 648-3390"). School line; links as tel: with digits only.
- [EXPERIENCE] — Years (default: "13 years"). Plain phrase like '13 years'; used in hero copy.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/music-lessons-school-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Plum `#4B1D52` — Hero ground, dark bands, headings
- Plum deep `#38153E` — Footer ground and darkest panels
- Brass `#E3A33B` — Accent: CTAs, tracker fills, highlights
- Brass tint `#F9EFD9` — Chips and note panels
- Cream `#FAF5EC` — Page ground
- White `#FFFFFF` — Cards on cream
- Ink `#2E2233` — Body text
- Steel `#6E5F73` — Secondary text; #C4B3C9 on dark
- Hairline `#EAE0E3` — Hairline rules and card borders

### Typography
- Display: headlines, prices, week totals: Petrona (OFL), weights 600/700
- Body: paragraphs, controls, tracker: Mulish (OFL), weights 400/600/700/800

### Layout & motion
- Spacing: Sections separated by 88px desktop / 60px mobile; section headers use a 13px letter-spaced brass-on-plum (or plum-on-cream) eyebrow over a Petrona 700 title at clamp(28px, 3.2vw, 44px); cards 26px padding, 22px gaps.
- Radius: Warm studio: 14px cards, 10px chips and inputs, pill CTAs; photos 14px.
- Motion: Fade-rise reveals (14px, 500ms, 60ms stagger) via useInView, once.
- Motion: Tracker cells fill with a 200ms scale; the goal bar fills 300ms; the streak count counts up 500ms.
- Motion: Finder results crossfade 200ms on any filter change; opening chips pop 1.05× when selected.
- Motion: All motion disables instantly under prefers-reduced-motion; no parallax, no scroll-jacking, no autoplay media.
- Imagery: Sunlit lesson-room photography from one shoot: a warm room with an upright piano and a violin waiting on a chair, four teacher portraits (fictional, varied, holding or beside their instruments), and a small warm recital hall with empty chairs facing a lit stage — no people in close-up except the portraits, no brand marks on instruments.

## Pages & Sections
### [BRAND] — Music lessons in [CITY] (`index.html`)
1. **Header and hero** — Header (cream at 94% with backdrop blur, 72px): quarter-note logomark (plum circle with brass note) + [BRAND] in Petrona 700 18px plum; nav anchors Instruments, Lesson finder, Pricing, Practice, Events; right: phone chip Phone icon + [PHONE] (tel:) and brass pill 'Book a trial'. At 390px: logomark + name, phone icon button, menu button on one line; anchors in a cream dropdown. Hero: left copy (columns 1–6): eyebrow brass-on-plum chip 'MUSIC LESSONS — [CITY], ALL AGES'; H1 Petrona 700 ink 'The lesson room you still remember.'; paragraph steel 'Director [FOUNDER] and three teachers run a sunlit house of instruments — [EXPERIENCE], 300 students, and a rule that's held: no one gets rushed past Twinkle.'; brass pill 'Find your teacher' (anchor) and plum-outline pill 'See pricing' (anchor); chips: 'First trial free' · 'Six instruments' · 'Recitals, not auditions'. Right (columns 7–12): the lesson-room photo in a 14px frame 4:3 with a floating white card overlapping bottom-left: Music icon, 'This week: 84 lessons', 'Next openings: Tue 4:00 · Sat 10:30' in Petrona 700 plum, 12px steel 'Sample board.'
   Layout: 12-column grid; floating card offset -18px; mobile stacks copy then photo.
   Motion: Photo settles from 1.03; copy rises 14px staggered 70ms.
2. **Instruments and teachers** — White band. Eyebrow 'WHAT WE TEACH' (brass); title 'Six instruments, four teachers, zero auditions.' A 3×2 grid of instrument cards (cream ground, hairline): Piano — 'Ben & Dana — classical and pop, duets encouraged'; Guitar — 'Carmen — chords first, songs by week three'; Violin & viola — '[FOUNDER] — the Suzuki-free path: good posture, real tunes'; Voice — 'Carmen — range without the opera pressure (unless asked)'; Drums — 'Dana — pads first, kit by month two, neighbors consulted'; Cello — '[FOUNDER] — the instrument that hums back'. Card footers: plum link 'Meet them in the finder →'.
   Layout: 3-column grid (2 under 900px, 1 under 640px); instrument glyphs as small code-drawn SVG line icons.
   Motion: Cards rise 14px staggered 60ms.
3. **Lesson finder** — Plum band, the signature section. Eyebrow 'LESSON FINDER' (brass); title 'Three taps to the right teacher.' Controls in a white panel (left, 5 columns): instrument chips; age chips; level chips; format chips. Results (right, 7 columns): matching teacher cards (white, hairline, 14px) — portrait thumb, name Petrona 700, instruments + formats line, style sentence ('Teaches the Suzuki-free path: good posture, real tunes.'), openings as bookable brass-outline chips ('Tue 4:00' etc.) that prefill the trial form, and a brass pill 'Trial with [first name]'. No-match state: 'No one fits that exact mix — loosen a filter, or note that online teachers match everywhere' plus a 'Loosen filters' chip. The finder state persists.
   Layout: 5/7 columns desktop; stacked mobile; results crossfade 200ms on changes.
   Motion: Results crossfade; chips pop 1.05× when selected.
4. **Pricing** — Cream band. Eyebrow 'PRICING' (brass); title 'Priced by the minute, published like it should be.' Three cards: '30 minutes' — '$38 / lesson' — 'young students and busy weeks'; '45 minutes' — '$52 / lesson' — 'the sweet spot for most' tagged 'MOST CHOSEN'; '60 minutes' — '$64 / lesson' — 'teens, adults and the serious'. Note panel (brass tint, 13px): 'Online lessons $6 less. Second student in a family, 10% off. Monthly billing, no registration fee — sample prices, and the trial is always free.'
   Layout: Three cards in a row (1-column under 900px); middle lifts 12px.
   Motion: Cards rise 14px staggered 70ms; tags pop 1.1×.
5. **Practice tracker** — White band, the second tool. Eyebrow 'PRACTICE TRACKER' (brass); title 'Minutes in, streaks on.' The tracker (cream panel, max-width 720px): a Mon–Sun row of seven tappable cells; each tap cycles the cell through 0 → 10 → 20 → 30 → 45+ minutes, the cell filling brass at rising intensity; a week-total counter in Petrona 700 ('70 minutes this week'); a goal bar toward 100 minutes; a streak line with Timer icon ('2-week streak — the metronome approves'); reset link 'Start a fresh week'; the 12px browser-local note. Below, one encouraging line 14px steel: 'We'd rather see four honest tens than one heroic hour.'
   Layout: Cells 56px squares, 44px tap targets, labels beneath; goal bar full-width; mobile keeps one row of seven compact cells with smaller labels.
   Motion: Cell fills scale 200ms; goal bar fills 300ms; streak counts up 500ms.
6. **Recitals and events** — Plum band. Eyebrow 'RECITALS & EVENTS' (brass); title 'Community, not competitions.' Left (5 columns): the recital-hall photo in a 14px frame. Right (7 columns): three event rows — 'Winter & spring recitals' — 'every student invited, nobody ranked; the cookie table is famous' (CalendarCheck); 'Coffee-house nights' — 'monthly, low-stakes, five-minute slots for the brave and the almost' (Mic); 'Summer porch ensemble' — 'a mixed-instrument group that plays two farmers markets a season' (Users). Note 12px steel: 'Events run on a seasonal rhythm — dates live in the monthly newsletter (sample events).'
   Layout: 5/7 columns; mobile stacked photo then rows.
   Motion: Rows fade in 60ms apart; photo rises 14px.
7. **Teachers** — Cream band. Eyebrow 'THE TEACHERS'; title 'Four people your kid will quote at dinner.' Four cards with 3:4 portraits, name Petrona 700, instruments line, one-line philosophy: '[FOUNDER] — violin · viola · cello' — 'Choir kid turned fiddler; teaches the Suzuki-free path.' — 'Every student gets a tune they love by month two.'; 'Ben Osei — piano' — 'Jazz degree, endless patience for Hot Cross Buns.' — 'Rhythm is a conversation; we start by listening.'; 'Carmen Ruiz — voice · guitar' — 'Open-mic veteran who coaxes room-filling sound from shy people.' — 'Your voice already exists; we just tune the room.'; 'Dana Whitehorse — drums · piano' — 'The steady heartbeat of the school, literally.' — 'Count out loud. Everything else follows.'
   Layout: Four cards in a row (2×2 under 1024px, 1-column under 640px).
   Motion: Cards rise 14px staggered 70ms.
8. **Reviews** — White band. Eyebrow 'FROM FAMILIES'; title 'Quoted from the pickup line.' Three cards (cream ground, brass quote mark): five brass stars; 16px ink quote; 13px steel footer. 'The finder matched my shy 8-year-old with [FOUNDER] in about thirty seconds. Two months later he practices without being asked. We checked with a doctor.' — Rosa M., violin parent. 'I'm 52 and started drums because why not. Dana never once made it weird.' — Gerald T., adult beginner. 'The practice tracker's streak feature is_parenting_gold.' — Dana P., guitar parent. Disclaimer 12px steel: 'Sample reviews for this template demo.'
   Layout: Three cards in a row (1-column under 900px); middle lifts 12px.
   Motion: Cards rise 14px staggered 80ms.
9. **Trial booking** — Plum band. Eyebrow 'FREE TRIAL' (brass); title 'One lesson, no card, no commitment.' Form (white panel, max-width 720px): instrument select; if a finder match or opening was chosen, chips at top ('With: Amara Lin ×', 'Opening: Tue 4:00 ×'); student name (required) and age (required); guardian name + phone (required); format chips (In-person / Online); notes optional ('anything we should know — instruments owned, songs loved'). Brass pill submit 'Book the trial'. Validation inline (2px brass borders, 13px notes), no native popups. Success: CheckCircle2 brass, 'See you at the house, [student].' Petrona 700, 'We confirm by text within a day — bring nothing but curiosity; instruments are here. This demo stores the booking in this browser only.' and an outline pill 'Book another'. Persists to localStorage.
   Layout: Two-column field rows desktop, 1-column mobile with 96px bottom padding clear of the sticky bar.
   Motion: Success crossfades with a 12px rise; check pops 1.15×.
10. **Footer** — Plum-deep band. Column 1: note logomark + [BRAND] Petrona 700 white; 13px #C4B3C9 lines '19 Chestnut Row, [CITY]', '[PHONE] (tel:)', 'Mon–Fri 2–8p · Sat 9a–2p'. Column 2 'School': anchors Instruments, Lesson finder, Pricing, Events. Column 3 'Small print': 'Sample site for a template — teachers, openings, prices and reviews invented', optional [CREDIT] link in brass. Mobile sticky bar (under 768px): fixed bottom plum 96% + blur; brass pill 'Call' (tel:) and white-outline pill 'Trial' (anchor), safe-area padding.
   Layout: Footer grid 4/4/4 to 1-column mobile; body padding-bottom 80px under 768px.
   Motion: None.

## Assets
- image: Lesson room. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/hero-lessonroom.webp to public/images/hero-lessonroom.webp. Alt: 'A sunlit lesson room with an upright piano and a violin on a chair.' The hero anchor. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Teacher portrait one. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/teacher-1.webp to public/images/teacher-1.webp. Alt: 'Portrait of a fictional violin teacher holding her instrument.' The [FOUNDER] card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Teacher portrait two. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/teacher-2.webp to public/images/teacher-2.webp. Alt: 'Portrait of a fictional piano teacher seated at an upright piano.' The Ben Osei card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Teacher portrait three. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/teacher-3.webp to public/images/teacher-3.webp. Alt: 'Portrait of a fictional voice and guitar teacher with an acoustic guitar.' The Carmen Ruiz card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Teacher portrait four. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/teacher-4.webp to public/images/teacher-4.webp. Alt: 'Portrait of a fictional drums teacher with sticks by a practice kit.' The Dana Whitehorse card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Recital hall. Download https://media.vibefather.ai/assets/f2aa6a1b-ed2f-4609-9fef-1fe34458907f/recital-hall.webp to public/images/recital-hall.webp. Alt: 'A small warm recital hall with empty chairs facing a lit stage.' The events band. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- icon: Lucide (ISC) via the lucide-react package, restricted to the icon list in setup, plus small code-drawn instrument line icons and the quarter-note logomark. No other icon source.
- font: Petrona (OFL) and Mulish (OFL) self-hosted through @fontsource/petrona and @fontsource/mulish; no CDN font loading.

## Don'ts
- No real music schools, conservatories, exam boards or method trademarks (Suzuki, ABRSM and the like); levels stay generic and the violin path is explicitly 'Suzuki-free' phrasing without disparagement.
- No real instrument makers or recognizable branded instruments; instruments in photos are generic with no visible logos or headstock marks.
- No real venues named for recitals; the hall, coffee house and farmers markets are generic.
- No outcome promises: no 'guaranteed concert level', no exam-pass claims; encouragement stays warm and honest.
- All prices, openings and events are sample data; events run on seasonal rhythm, never real dates tied to the clock.
- The practice tracker stores in this browser only and says so; no accounts, no sync, no analytics.
- Forms are local-only samples: no submit to any server, no APIs. Persist to localStorage only and validate restored data.
- The finder never dead-ends: a no-match state offers the 'Loosen filters' chip and the online-everywhere note.
- No backend, server code, databases or auth. Static output in dist/ from the single build command, under 20 MB, with Vite's base relative.
- Self-host fonts through the Fontsource packages only; never load Google Fonts, Adobe Fonts or any CDN stylesheet or script.
- No source maps in production and no src/ copied into dist/.
- No Unsplash, Pexels, Pixabay, Google Images, placeholder-image services or hotlinked files; use only the six generated photos and code-drawn SVG art.
- No SEO work: no meta descriptions, Open Graph tags, JSON-LD, sitemaps or keyword-stuffed headings. A plain title with [BRAND] and a favicon are enough.
- No dates tied to the real clock: openings are weekday chips, no calendar dates, no copyright year.
- Teacher portraits are fictional people, varied, who resemble no real individual.
- No scroll-jacking, page parallax, custom cursor or autoplay media; motion limited to the specified reveals, crossfades, tracker fills and count-ups, all respecting prefers-reduced-motion.
- Keep the mobile header on one line at 390px and never let the sticky bottom bar cover the trial form's submit button.
- Build brand-derived strings (storage keys, tel: link) from [BRAND] and [PHONE] so alternate variable values never leave default-brand remnants.
- Every internal link is a file name or in-page anchor, never a bare directory; the site stays one index.html.

---
— Prompt by VibeFather · https://vibefather.ai/t/music-lessons-school-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
