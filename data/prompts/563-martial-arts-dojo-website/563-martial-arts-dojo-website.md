# Martial Arts Dojo Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a one-page site for [BRAND], the martial arts school led by head instructor [FOUNDER] in [CITY], [EXPERIENCE] of teaching behind it. The page is disciplined — black, crimson, rice-paper white, brush strokes drawn in code — with three program tracks, an animating belt progression path, a day-filterable schedule, two instructor bios, family pricing, an anti-bullying section for parents and a free trial booking. Photography is moody training-hall work with students in plain uniforms from behind. All rank timings, prices and reviews are invented sample data.

- Audience: Primary: parents of kids 6–15 (the anti-bullying and confidence angle) and adults 16+ who keep meaning to start. Secondary: grappling and fitness schools re-pointing programs and ranks.
- Goal: Move a visitor from 'maybe for my kid' to a booked free trial: show the path (belts), the schedule (fits our week), the people (instructors), the price (family math), then make the trial form the shortest step on the page.
- Tone: Calm, respectful dojo English — short sentences, earned confidence, zero machismo. The school sounds like a place that teaches restraint first.

## Stack
- Framework: Vite 6 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), vite (MIT), typescript (Apache-2.0), tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/big-shoulders-display (OFL-1.1), @fontsource/figtree (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Create a Vite 6 + React 18 + TypeScript project with base './', build.outDir 'dist', build.sourcemap: false. No router, no backend, no server code.
  - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer. Extend the theme with the exact palette below, fontFamily.display 'Big Shoulders Display' and fontFamily.body 'Figtree'.
  - Self-host Big Shoulders Display weights 600 and 700 and Figtree weights 400, 500, 600, 700 through @fontsource/big-shoulders-display and @fontsource/figtree, imported in src/main.tsx. Never load fonts from a CDN.
  - Use Motion from 'motion/react' (motion, useScroll, useTransform, useInView, useReducedMotion) for the belt-path scroll fill and reveals; gate every animation on useReducedMotion().
  - Keep all copy and data in src/content.ts: brand strings, hero copy, programs, the six ranks with typical months and requirements, the weekly schedule (day, time, program, level), instructors, pricing, anti-bullying points, reviews, trial form options. When variable values change, rewrite the dependent copy there and derive storage keys and the tel: link from [BRAND] and [PHONE] so no default-brand remnants remain.
  - The belt path, exactly six ranks on an SVG path that climbs left-to-right across the section (each node a wrapped-belt glyph drawn in code in its color): White — 0 months — 'shows up, bows in'; Yellow — 3–5 months — 'stances hold, first form learned'; Green — 8–12 months — 'controlled partner drills'; Blue — 14–20 months — 'sparring with control'; Brown — 24–30 months — 'assists in kids' classes'; Black — 36–48 months — 'teaches a class, lives the courtesy'. The path stroke fills with scroll progress via useScroll + useTransform (a crimson stroke drawing over a hairline track); each node's card fades in as the stroke reaches it; under prefers-reduced-motion the full path renders instantly with all cards visible. A footnote reads 'Typical times, not promises — the path adjusts to the student.'
  - The schedule is a data-driven table: rows = time slots, columns = days Mon–Sat; filters = day chips (All + each day) and program chips (All / Kids / Teens / Adults / Family); matching cells highlight crimson-tint while others dim to 40% (never hide, so the week stays legible); each cell shows time, program, level ('Beginner friendly' / 'All levels' / 'Advanced').
  - Draw brush-stroke accents as inline SVG in code: one horizontal stroke under each section title (single crimson path with slight taper and rough edge via 2–3 overlapping paths), and a large translucent stroke behind the hero title. No calligraphy fonts, no third-party art.
  - Use only these lucide-react icons: Phone, Users, CalendarCheck, Clock, Shield, Heart, Star, MapPin, ChevronRight, ArrowRight, Menu, X, CheckCircle2, GraduationCap, Hand, Eye, Footprints, Medal.
  - Persist the schedule filter choice and the trial booking to localStorage, namespaced with [BRAND_SLUG]; validate restored JSON and recover silently from malformed data.
  - Download the six generated photos to the exact public paths listed in Assets before building. Create ASSETS.md at the project root listing every file's path, source URL, author or generator, and license.
  - A plain <title> of [BRAND] and a favicon (the ink square with a crimson belt knot) are enough; no meta descriptions, Open Graph tags, JSON-LD, or sitemaps.

## Variables
- [BRAND] — School name (default: "Blackpine Martial Academy"). Invented school name; a belt-knot logomark is derived from it in code.
- [CITY] — City (default: "Eastgate"). Where the dojo is; appears in hero, schedule and footer.
- [FOUNDER] — Head instructor (default: "Marcus Ito"). Invented head instructor, named in hero and the first bio card.
- [PHONE] — Phone (default: "(555) 913-7742"). School line; links as tel: with digits only.
- [EXPERIENCE] — Years teaching (default: "18 years"). Plain phrase like '18 years'; used in hero and instructor copy.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/martial-arts-dojo-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Ink `#14151A` — Hero ground, dark bands, headings on light
- Ink deep `#0D0E12` — Footer ground and darkest panels
- Crimson `#C8102E` — The single accent: CTAs, belt path stroke, schedule highlights
- Crimson tint `#F9E4E7` — Highlight chips and note panels on light
- Rice paper `#F5F1E8` — Page ground
- White `#FFFFFF` — Cards on paper
- Steel `#5D5F66` — Secondary text on light; #9BA0AB on dark
- Hairline `#E4DFD4` — Hairline rules and card borders
- Belt white `#FFFFFF` — Belt glyph fills where needed (outlined on paper)

### Typography
- Display: headlines, rank names, prices: Big Shoulders Display (OFL), weights 600/700
- Body: paragraphs, schedule cells, forms: Figtree (OFL), weights 400/500/600/700

### Layout & motion
- Spacing: Sections separated by 88px desktop / 60px mobile; section headers sit over a code-drawn crimson brush stroke with a 13px letter-spaced crimson eyebrow and a Big Shoulders Display 700 title at clamp(30px, 3.4vw, 48px); cards 24px padding, 20px gaps.
- Radius: Restrained: 4px cards and chips, 0 on buttons — the discipline is in square edges; photos 4px with a 1px ink border.
- Motion: Fade-rise reveals (12px, 450ms, 50ms stagger) via useInView, once — quick and settled.
- Motion: The belt path stroke fills with scroll progress (useScroll + useTransform on the section); rank cards fade in as the stroke reaches them.
- Motion: Schedule filter changes crossfade cell opacity 150ms; the trial success check pops 1.15×.
- Motion: All motion disables instantly under prefers-reduced-motion (the belt path renders complete); no parallax beyond the path, no scroll-jacking, no autoplay media.
- Imagery: Moody training-hall photography from one shoot: wide shots of students in plain white uniforms seen from behind under warm spots, a kids' class lined up, adults drilling, a still life of colored belts hanging on a rack, and two plain-uniform instructor portraits — no close-up faces, no crests or emblems, no readable text.

## Pages & Sections
### [BRAND] — Martial arts in [CITY] (`index.html`)
1. **Header and hero** — Header (ink at 94% with backdrop blur, 68px, sticky): belt-knot logomark (ink square with a crimson knot glyph) + [BRAND] in Big Shoulders Display 700 uppercase rice-white 17px; nav anchors Programs, The path, Schedule, Pricing, Free trial; right: phone chip Phone icon + [PHONE] (tel:) in rice-white and a crimson pill 'Book a free trial'. At 390px: logomark + name, phone icon button, menu button on one line; anchors in an ink dropdown. Hero: full-bleed training-hall photo (wide shot, students from behind under warm spots, 82vh desktop / 560px mobile) with a bottom-up ink gradient 95%→transparent and a large translucent crimson brush stroke behind the title; content bottom-left: eyebrow crimson 'MARTIAL ARTS — KIDS · TEENS · ADULTS'; H1 Big Shoulders Display 700 uppercase rice-white 'COURTESY FIRST. TECHNIQUE SECOND.'; paragraph '#C9CCC4' 'Head instructor [FOUNDER] has taught [CITY] for [EXPERIENCE] — a blended striking-and-grappling foundation taught the traditional way: quiet bows, patient drills, no shortcuts.'; crimson pill 'Two weeks, $29, uniform included' (anchor to trial) and rice-outline pill 'See the schedule' (anchor); chips in 12px rice-white on translucent ink: 'Free trial week for families' · '6 days a week' · 'Parents watch every class'.
   Layout: Copy columns 1–7; chips wrap two rows max at 390px; scrim guarantees AA contrast.
   Motion: Photo scales 1.04→1 over 800ms; copy rises 12px staggered 60ms.
2. **Programs** — Rice-paper band. Eyebrow 'PROGRAMS' (crimson); title 'Three tracks, one standard.' Three cards (white, hairline, 4px radius): 'Kids · 6–9' — 'Focus games, falling safely, and the two words parents love: yes, instructor. Stranger-awareness folded into every unit.'; 'Teens · 10–15' — 'Real technique with real partners: striking, clinch, ground — plus the leadership ladder of assisting lower belts.'; 'Adults · 16+' — 'Beginner-friendly fundamentals through advanced sparring. The 7 p.m. class is the quietest hour of your week.' Each card: age chip, the class photo for kids/adults respectively, a 'first class is free' line, and a crimson link 'Try this track →' anchoring the trial with the program preselected.
   Layout: Three cards in a row (1-column under 900px); photos 4:3 tops.
   Motion: Cards rise 12px staggered 70ms.
3. **The belt path** — Ink band, the signature section. Eyebrow 'THE PATH' (crimson); title 'White to black, drawn honestly.' The SVG path climbs left-to-right across the section — a hairline rice-white track with a crimson stroke filling by scroll progress — through six nodes, each a wrapped-belt glyph drawn in code in the rank color (white outlined, yellow, green, blue, brown, black) with a rank card: rank name in Big Shoulders Display 700, typical time in Figtree 600, requirement line in #9BA0AB — White '0 months · shows up, bows in'; Yellow '3–5 months · stances hold, first form learned'; Green '8–12 months · controlled partner drills'; Blue '14–20 months · sparring with control'; Brown '24–30 months · assists in kids' classes'; Black '36–48 months · teaches a class, lives the courtesy'. Footnote 12px '#9BA0AB': 'Typical times, not promises — the path adjusts to the student.' The belts-rack photo sits as a quiet 4:3 panel at the band's right edge.
   Layout: Path spans full width (min-height 420px), rank cards alternate above/below the line (all below on mobile in a vertical path); photo absolute-right on desktop, hidden-band-bottom on mobile.
   Motion: Stroke fills with scroll; cards fade in as the stroke reaches them; reduced-motion renders the complete path instantly.
4. **Schedule** — Rice-paper band. Eyebrow 'SCHEDULE' (crimson); title 'Six days, filtered your way.' Filter chips: days (All, Mon–Sat) and programs (All / Kids / Teens / Adults / Family); matching cells highlight crimson-tint with ink text, non-matching dim to 40% opacity (never hidden). Table (white panel, hairline grid; columns Mon–Sat): Mon — 4:00 Kids beginner · 5:15 Teens all levels · 7:00 Adults beginner; Tue — 4:00 Kids all · 6:30 Adults advanced sparring; Wed — 4:00 Kids beginner · 5:15 Teens advanced · 7:00 Adults all; Thu — 5:15 Family class · 6:30 Adults beginner; Fri — 4:00 Kids all · 6:30 Teens all; Sat — 9:00 Family class · 10:15 Adults all levels. Each cell: time Figtree 700, program, level chip ('Beginner friendly' / 'All levels' / 'Advanced'). Filter choice persists. Note 12px steel: 'Sample weekly rhythm — holiday schedules post at the door.'
   Layout: Table scrolls horizontally under 800px with the time column sticky-left; chips scroll horizontally on mobile.
   Motion: Cell opacity crossfades 150ms on filter change.
5. **Instructors** — White band. Eyebrow 'INSTRUCTORS' (crimson); title 'Two teachers, zero egos.' Two cards with 3:4 portraits (plain white uniforms, no crests): '[FOUNDER] — Head instructor' — '[EXPERIENCE] teaching; rank held quietly' — 'Teaches the way he was taught: small class, sharp eye, patient hands.' — line: 'The best students ask the boring questions.'; 'Sena Okafor — Senior instructor' — 'Runs the teens and family classes' — 'A former reluctant kid who stayed 14 years; she remembers exactly why.' — line: 'Confidence is a skill, not a mood.' Ranks appear as plain text only.
   Layout: Two cards side by side (1-column under 800px); portraits crop 3:4.
   Motion: Cards rise 12px staggered 80ms.
6. **Family pricing** — Rice-paper band. Eyebrow 'PRICING' (crimson); title 'The family math, published.' Three cards: 'Trial — two weeks' — '$29' — 'unlimited classes in your track, uniform included' tagged 'START HERE' crimson chip; 'Individual' — '$129 / mo' — 'one member, all classes in their track, belt testing included'; 'Family Path' — '$229 / mo' — 'up to three household members, each additional $39, family classes included' tagged 'MOST CHOSEN'. Note panel (crimson tint, 13px): 'A family of three on Family Path pays $76 per member — and the 6 p.m. drives home together. Sample prices; no contracts, month to month.'
   Layout: Three cards in a row (1-column under 900px); middle card lifts 12px.
   Motion: Cards rise 12px staggered 70ms; tags pop 1.1×.
7. **For parents: anti-bullying** — Ink band. Eyebrow 'FOR PARENTS' (crimson); title 'What we actually teach about bullies.' Four cards on translucent panels: 'Posture before punches' — Eye icon — 'How a child carries themselves changes who gets picked. We drill it like technique, because it is.'; 'The voice' — Hand icon — 'A loud, calm 'stop' practiced until it's automatic — most situations end right there.'; 'When to walk' — Footprints icon — 'Leaving is a skill with a name in our curriculum, not a retreat.'; 'When to tell' — Shield icon — 'Adults are told every time. Our rule: the physical answer is the last resort, and it's taught as one.' Footer line '#9BA0AB': 'No child is taught to solve words with fists. Parents sit ringside whenever they like.'
   Layout: Four cards 2×2 (1-column under 800px); icons in crimson circles.
   Motion: Cards rise 12px staggered 80ms.
8. **Reviews** — Rice-paper band. Eyebrow 'FROM FAMILIES'; title 'The quiet confidence reviews.' Three cards (white, crimson quote mark): five crimson stars; 16px ink quote; 13px steel footer. 'Six months in, my daughter walks into rooms differently. The belts matter to her; the posture matters to us.' — Rosa M., parent, kids track. 'I'm 44 and terrified of gyms. The 7 p.m. adults class meets you exactly where you are. I've made the walk every Tuesday.' — Gerald T., adults track. 'Two kids on Family Path, one car, one schedule. The family class is the best hour of our week.' — the Okonjo family. Disclaimer 12px steel: 'Sample reviews for this template demo.'
   Layout: Three cards in a row (1-column under 900px); middle lifts 12px.
   Motion: Cards rise 12px staggered 80ms.
9. **Free trial booking** — White band. Eyebrow 'FREE TRIAL' (crimson); title 'Two weeks. Bring water.' Form (ink panel, max-width 720px, rice-white fields): track select (Kids 6–9 / Teens 10–15 / Adults 16+ / Family); student name (required; 'your name if the trial is yours'); age (required); guardian name + phone (required, 'we text the confirmation'); preferred start chips (This week / Next week / Just asking first). Crimson pill submit 'Reserve the trial'. Validation inline (2px crimson borders, 13px notes), no native popups. Success: CheckCircle2 crimson, 'Welcome in, [student].' Big Shoulders Display 700 rice-white, 'We text your first-class time within a day — uniform waits at the desk. This demo stores the booking in this browser only.' and an outline pill 'Book another'. Persists to localStorage.
   Layout: Two-column field rows desktop, 1-column mobile with 96px bottom padding clear of the sticky bar.
   Motion: Success crossfades with a 12px rise; check pops 1.15×.
10. **Footer** — Ink-deep band. Column 1: knot logomark + [BRAND] Big Shoulders Display 700 uppercase rice-white; 13px #9BA0AB lines '88 Forge Street, Second Floor, [CITY]', '[PHONE] (tel:)', 'Mon–Sat, mornings and evenings'. Column 2 'School': anchors Programs, The path, Schedule, Pricing. Column 3 'Small print': 'Sample site for a template — ranks, times, prices and reviews invented', 'Curriculum described generically; no lineage claimed', optional [CREDIT] link in crimson. Mobile sticky bar (under 768px): fixed bottom ink 96% + blur; crimson pill 'Call' (tel:) and rice-outline pill 'Free trial' (anchor), safe-area padding.
   Layout: Footer grid 4/4/4 to 1-column mobile; body padding-bottom 80px under 768px.
   Motion: None.

## Assets
- image: Training hall hero. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/hero-dojo.webp to public/images/hero-dojo.webp. Alt: 'A wide shot of students in plain white uniforms training under warm spots.' The hero anchor. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Kids class. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/class-kids.webp to public/images/class-kids.webp. Alt: 'A kids' class lined up on the mat, seen from behind.' The kids program card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Adults class. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/class-adults.webp to public/images/class-adults.webp. Alt: 'Adults drilling technique in a dim hall, seen from behind.' The adults program card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Belts rack. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/belts-rack.webp to public/images/belts-rack.webp. Alt: 'Colored martial-arts belts hanging on a wooden rack.' The belt-path band's quiet panel. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Instructor portrait one. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/instructor-1.webp to public/images/instructor-1.webp. Alt: 'Portrait of a fictional head instructor in a plain white uniform.' The [FOUNDER] card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Instructor portrait two. Download https://media.vibefather.ai/assets/bf5a81ed-bcd2-45cd-8456-5a9ad2172f1c/instructor-2.webp to public/images/instructor-2.webp. Alt: 'Portrait of a fictional senior instructor in a plain white uniform.' The Sena Okafor card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- icon: Lucide (ISC) via the lucide-react package, restricted to the icon list in setup, plus original code-drawn brush-stroke SVGs, belt glyphs and the knot logomark. No other icon source.
- font: Big Shoulders Display (OFL) and Figtree (OFL) self-hosted through @fontsource/big-shoulders-display and @fontsource/figtree; no CDN font loading.

## Don'ts
- No real martial-arts organizations, federations, lineage claims, style trademarks, crests or emblems; the curriculum is described generically as a blended foundation and ranks are plain text.
- No real dojos, instructors or tournament records; [BRAND], ranks, times, prices and reviews are invented sample data.
- No close-up faces anywhere: photos show students from behind, in wide shots, or still-life halls — instructor portraits are composed but not dramatic.
- Anti-bullying copy stays calm and practical: posture, voice, walking away, telling adults; the physical answer is explicitly the last resort, and no self-defense outcome is promised.
- No machismo or fear-based marketing: no 'fight like a champion', no scare copy about streets or predators.
- Rank timings are 'typical, not promises' and labeled so; no guaranteed-black-belt language.
- No dates tied to the real clock: the schedule is a weekly rhythm on weekday anchors, no calendar dates, no copyright year.
- Forms are local-only samples: no submit to any server, no APIs, no analytics. Persist to localStorage only and validate restored data.
- No backend, server code, databases or auth. Static output in dist/ from the single build command, under 20 MB, with Vite's base relative.
- Self-host fonts through the Fontsource packages only; never load Google Fonts, Adobe Fonts or any CDN stylesheet or script.
- No source maps in production and no src/ copied into dist/.
- No Unsplash, Pexels, Pixabay, Google Images, placeholder-image services or hotlinked files; use only the six generated photos and code-drawn SVG art.
- No SEO work: no meta descriptions, Open Graph tags, JSON-LD, sitemaps or keyword-stuffed headings. A plain title with [BRAND] and a favicon are enough.
- Schedule filters dim rather than hide non-matching cells, so the week is always legible.
- No scroll-jacking: the belt path fills with scroll but never traps or hijacks it; motion limited to the specified reveals, the path fill, crossfades and pops, all respecting prefers-reduced-motion.
- Keep the mobile header on one line at 390px and never let the sticky bottom bar cover the trial form's submit button.
- Build brand-derived strings (storage keys, tel: link) from [BRAND] and [PHONE] so alternate variable values never leave default-brand remnants.
- Every internal link is a file name or in-page anchor, never a bare directory; the site stays one index.html.

---
— Prompt by VibeFather · https://vibefather.ai/t/martial-arts-dojo-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
