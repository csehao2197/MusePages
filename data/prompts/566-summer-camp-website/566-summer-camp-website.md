# Summer Camp Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a warm single-page site for [BRAND], an invented lakeside sleepaway camp. A layered paper-cut SVG camp scene anchors the hero, followed by age-group programs with activity lists, a Monday-to-Sunday week-at-camp strip, cabins and safety cards, an illustrated staff row, a session-labeled fees table, and a registration form that saves locally.

- Audience: Parents choosing a first — or fifth — summer for campers aged [AGE_RANGE], plus camp directors and program coordinators who want a site that feels hand-made and answers safety questions before they are asked.
- Goal: Show the daily reality of camp — programs, rhythm, cabins, staff, price — warmly enough to excite a kid and credibly enough to reassure a parent, ending in a registration form saved in the browser.
- Tone: Warm, proud, a little bit funny; speaks to parents and kids at once. Concrete details over slogans, safety stated plainly and never scary. Rewrite programs, schedule, staff, fees and FAQs to fit the supplied variables.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: motion (MIT), lucide-react (ISC), @fontsource/baloo-2 (OFL), @fontsource/nunito (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Vite with base './', React 18, TypeScript and Tailwind CSS 3.4; vite.config sets base './' and build.sourcemap: false.
  - Keep programs, week schedule, cabins, staff, fees, FAQs and all page copy in src/content.ts, derived from the variable values.
  - Import @fontsource/baloo-2 (600, 700, 800) and @fontsource/nunito (400, 600, 700) in src/main.tsx; map them to heading and body fonts in tailwind.config.js.
  - Define the Craft Cream, Paper White, Cocoa, Sun Yellow and Lake Blue tokens in tailwind.config.js; keyframes (float, pop, rise) live in src/index.css.
  - Build the hero as a single layered SVG component in src/components/CampScene.tsx with one group per paper layer so each layer can drift on its own keyframe loop; registration state uses React plus localStorage key camp-registration.v1.
  - Add a static paper-grain overlay (SVG turbulence filter, 5% opacity) fixed above the page; it never animates.
  - Set a plain document title from [BRAND] and an original 32px SVG favicon (Sun Yellow circle with cut rays on Cocoa); add no other metadata.

## Variables
- [BRAND] — Camp name (default: "Camp Bluejay"). The invented camp; used in the wordmark, copy, fees and footer. Must not resemble a real camp brand.
- [CAMP_FOCUS] — Camp focus (default: "canoeing, forest crafts and campfire cooking"). What camp days are built around; drives program lists, the week schedule and the hero subline.
- [AGE_RANGE] — Age range (default: "7 to 14"). Campers' ages; the three program bands split this range between them.
- [SESSION_LENGTH] — Session length (default: "one week"). Sessions are named and priced by this length, never by calendar dates.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/summer-camp-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Craft Cream `#FBF2DC` — Page ground under the grain overlay.
- Paper White `#FFFDF6` — Cards, the fees table and the registration panel.
- Cocoa `#4A3728` — Text, hand-drawn outlines and strokes.
- Sun Yellow `#FFC53D` — Primary accent, CTAs, water-activity chips and avatar discs.
- Lake Blue `#3F8DB4` — Secondary accent, day cards, table header and land-activity chips.

### Typography
- Display / headlines: Baloo 2 (OFL), weights 600/700/800
- Body / UI text: Nunito (OFL), weights 400/600/700

### Layout & motion
- Spacing: Friendly and roomy: 88px section padding on desktop and 56px on mobile, a 1120px container, 24px card gaps; the hero scene is 62vh.
- Radius: Extra rounded: 24px cards and photo frames, 999px chips, buttons and avatar circles, 16px inputs and table corners.
- Motion: Hero paper layers drift: each SVG layer floats on its own 9-13s ease-in-out loop, translateY up to 8px, staggered; all loops freeze under prefers-reduced-motion.
- Motion: Scroll reveals: cards rise 20px and fade in over 0.45s whileInView, staggered 70ms.
- Motion: Micro-interactions: activity chips lift 2px on hover, the save button presses in like paper, inputs and selects get a Sun Yellow focus ring.
- Motion: The grain overlay is static; nothing on the page loops faster than 9s.
- Imagery: One hand-built paper-cut world: layered flat SVG shapes with long soft shadows and Cocoa ink outlines for the hero scene, program discs, cabin glyphs and staff avatars. Three real-camp photographs (lake, cabins, campfire) share one warm golden-hour documentary grade and hang like taped prints; staff and campers are always illustrated, never photographed.

## Pages & Sections
### [BRAND] summer camp (`index.html`)
1. **Header and navigation** — Left, the wordmark: [BRAND] in Baloo 2 800 beside a small drawn canoe glyph. Center navigation: Programs, A week at camp, Cabins & safety, Fees. Right, a Sun Yellow pill reading Register. On mobile a Menu button opens a cream panel with the same anchors that closes after selection.
   Layout: Sticky 76px header on Craft Cream with the grain overlay; shared 1120px container. Anchors are ./index.html#programs, #week, #cabins, #fees and #register.
   Motion: A soft 2px shadow fades in after 24px of scroll.
2. **Hero with layered paper-cut lake scene** — A full-width layered paper-cut SVG of the camp: a cut sun with rays, two Lake Blue hill bands, the lake with a dock and two canoes, pine trees in graduated blues, an A-frame cabin and two tents, a small campfire; every layer is a separate SVG group. Over the scene, in Baloo 2 800: Six days of lake, woods and cooking outside. Subline in Nunito: A sleepaway camp built around [CAMP_FOCUS], on the quiet shore of Loonshore Lake, for campers aged [AGE_RANGE]. CTAs: Sun Yellow pill See a week at camp and Lake Blue outline pill Fees & registration. Three cream chips: 8 campers a cabin, 1:6 staff on the water, 0 screens.
   Layout: The scene fills 62vh with the headline block on a cream wash card at bottom-left, rotated -1deg, 24px radius; the chip row wraps under the CTAs; at 390px the scene crops to keep the sun, cabin and dock in frame.
   Motion: Sun and canoes drift slowest, treetops fastest, each on its own loop; the headline card rises 20px on load; chips pop in 90ms apart; all drift freezes under prefers-reduced-motion.
3. **The real place: taped photo strip** — Three photographs taped to the page like prints: the dock and canoes at golden hour (camp-lake.webp), the gravel path between cabins in morning light (camp-cabins.webp), the campfire circle at dusk (camp-campfire.webp). Caption line under the row: Loonshore Lake, photographed on an ordinary Tuesday.
   Layout: Three 4:3 prints in a row, stacked on mobile, each rotated -2, 1 and 2 degrees with hand-cut white borders, CSS tape strips and soft drop shadows.
   Motion: Prints reveal whileInView with a 90ms stagger and straighten 1deg toward level.
4. **Programs by age band** — Headline: Three bands, one lake. Sub: Campers join a band by age; the lake does not care how old you are. Three cards on Paper White with layered paper-cut icon discs. Otters, ages 7-9, lily-pad icon: pond dips, bead crafts, short canoe loops, the frog census, lights-out stories; group of 8 with 2 staff. Falcons, ages 10-11, wing icon: full-lake canoe days, woodshop, capture-the-flag, the Tuesday overnight, knot school; group of 10 with 2 staff. Voyagers, ages 12-14, compass icon: the sunrise paddle, trail cooking, the high-ropes grove, leader-of-the-day, a two-night island camp; group of 10 with 2 staff. Water activities sit in Sun Yellow chips, land activities in Lake Blue; the bands restate [AGE_RANGE].
   Layout: Three equal cards with 24px radius; icon discs are layered SVG about 72px; chips wrap at two lines maximum; a footnote row reads: Every band swims daily; every band cooks Friday supper.
   Motion: Cards rise and fade in whileInView with a 70ms stagger; chips lift 2px on hover.
5. **A week at camp** — Headline: A week, honestly. A strip of seven day cards, Monday to Sunday, each with a theme and four activity chips. Monday — arrive, swim check, cabin flag. Tuesday — canoe day and the overnight. Wednesday — crafts fair and rest-hour rebellion. Thursday — island hike and skits night. Friday — camper-cooked supper and the barn dance. Saturday — regatta, campfire, secret buddies. Sunday — pancake breakfast and the goodbye circle. Under the strip, an Every day rhythm bar: flag-up, breakfast, two activity blocks, rest hour, free swim, evening fire.
   Layout: Day cards 240px wide in a horizontally scrollable row with soft edge fades; the rhythm bar is one rounded Lake Blue track with six cream stations; on mobile the strip stays scrollable and the bar becomes a two-column list.
   Motion: The strip scrolls with a gentle drag hint on first view; rhythm stations light in sequence whileInView.
6. **Cabins and safety** — Left, three cabin mini-cards: Hemlock, Birch and Cedar — 8 campers and 2 staff each, screened windows, porch swings, and shelves sized for exactly one flashlight and one pencil case. Right, a safety card with drawn icon rows: lifeguards at every swim; a 1:6 staff ratio on the water; a nurse on site around the clock; all staff first-aid trained; gate check-in and check-out; kitchens fenced and inspected. Closing line: The scary part of camp is the spider in the shower. We even have a plan for him.
   Layout: Two columns at 45/55; cabin cards in a row inside the left column; safety rows separated by hairline Cocoa rules with 24px icons.
   Motion: Cards reveal whileInView; safety icons draw themselves once (stroke-dashoffset) as their rows enter.
7. **Staff row with illustrated avatars** — Headline: The people who run the lake. Four illustrated paper-cut avatars on Sun Yellow discs — layered SVG faces with varied skin tones, a beanie, glasses, braids — never photographs. Marisol Vega, Camp Director, fourteenth summer. Theo Brandt, Water Lead, ferryman in a past life. Nia Okafor, Crafts Lead, keeper of the bead vault. Ruth Calloway, Camp Nurse, unbothered by everything.
   Layout: Four columns at desktop, two by two on mobile; avatars 96px; names in Baloo 2 700 with role lines in Nunito 600 at 70% Cocoa.
   Motion: Avatars pop in with a 100ms stagger and tilt 2deg on hover.
8. **Sessions and fees table** — Headline: Sessions & fees. A table on Paper White: First Session ([SESSION_LENGTH]), all ages, $895, includes all meals, canoe training and one laundry. Two-Week Voyager, ages 12-14, $1,690, includes the island overnight. Full Summer, three sessions, all ages, $2,480, includes everything plus a camp hoodie. Day Camp, 8am to 6pm, ages 7-9, $390 a week, lunch included. Footnote: a $150 deposit holds a bunk; 10% off for siblings; fees never rise after you register.
   Layout: Five rows with a Lake Blue header row and cream/paper zebra rows, rounded 16px with hidden overflow; on mobile the table becomes stacked cards with the session name as its title.
   Motion: Rows fade in whileInView with a 50ms stagger.
9. **Registration form saved locally** — Headline: Hold a bunk. Fields: camper first name, age, session select (the four sessions above), cabin buddy request (optional), parent name, parent email, and anything we should know (textarea). Submit button: Save my registration. On save, the form swaps to a confirmation card: Saved in this browser only — this demo does not send anything anywhere, with Edit and Clear buttons below. State persists in localStorage key camp-registration.v1.
   Layout: A two-column card on Paper White with 16px inputs, Sun Yellow focus rings and a full-width Sun Yellow pill submit; the confirmation card keeps the same footprint.
   Motion: The submit button presses in on click; the confirmation card rises 16px with a Sun Yellow check drawing itself once.
10. **Frequently asked questions** — Three accordions. What do campers pack? One duffel: layers, broken-in boots, a hat, a flashlight; we provide the rest, including the courage. Can my child room with a friend? Yes — one buddy request per camper, and we honor nearly all of them. What about homesickness? It is normal, it is short, and the canoe usually fixes it; the nurse or director calls home the same evening if it is not.
   Layout: A single 720px column of rounded 16px rows on Paper White; a Plus icon rotates to an X while open; only one row opens at a time.
   Motion: Answers expand over 0.3s with height animation; the open icon rotates 45 degrees.
11. **Footer** — Craft Cream ground with a hairline Cocoa top rule: the [BRAND] wordmark in Baloo 2 800, then 1 Canoe Launch Road, Loonshore Lake. Small print: Registration in this demo saves to this browser only. Anchors repeated: Programs, A week at camp, Cabins & safety, Fees. The optional [CREDIT] link goes last.
   Layout: A centered column about 96px tall; small print on one hairline-ruled row.

## Assets
- image: Template photos made for this design, free to redistribute with the template. Download each with curl -L -o into public/images/: https://media.vibefather.ai/assets/19cb2ddb-ed54-4fb8-96e1-05a7823a7171/camp-lake.webp → public/images/camp-lake.webp (The real place, print 1; alt A wooden dock and two orange canoes on a calm lake at golden hour); https://media.vibefather.ai/assets/19cb2ddb-ed54-4fb8-96e1-05a7823a7171/camp-cabins.webp → public/images/camp-cabins.webp (print 2; alt A gravel path between small wood cabins among pines in morning light); https://media.vibefather.ai/assets/19cb2ddb-ed54-4fb8-96e1-05a7823a7171/camp-campfire.webp → public/images/camp-campfire.webp (print 3; alt A stone campfire circle with log benches and a small fire at dusk). All three share one warm golden-hour documentary grade; no identifiable people.
- image: Write ASSETS.md at the project root with a table: path, source URL, author, license — one row per photo (source media.vibefather.ai, made for this template; author VibeFather; license Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template), plus rows for @fontsource/baloo-2 and @fontsource/nunito (OFL-1.1) and lucide-react (ISC).
- icon: lucide-react (ISC) for small UI strokes: Plus, X, Check, ArrowRight, ShieldCheck, Sun (stroke width 2, 16-24px, color inherits). The hero paper-cut scene, program icon discs, cabin glyphs, staff avatars, tape strips and the favicon are original layered SVG drawn for this template; no other icon packs, no brand marks, no mascot resembling an existing camp.
- font: Install @fontsource/baloo-2 and @fontsource/nunito and import them in src/main.tsx as listed in Setup; Vite bundles the woff2 files into dist/. Never load fonts from fonts.googleapis.com or any CDN.
- image: Drawn in code: the layered paper-cut hero scene (sun, hills, lake, dock, canoes, pines, cabin, tents, campfire), program discs, cabin mini-glyphs, staff avatars, the grain overlay and the favicon are original inline SVG. No other bitmaps beyond the three photos.

## Don'ts
- Do not copy or reference any real camp, organization, association or accreditation body; the camp, lake, staff, cabins and fees are entirely invented and must not resemble real camp brands.
- Do not use photographs of identifiable real people anywhere; staff and campers are illustrated paper-cut avatars, and photos show only places, with any people distant and from behind.
- Do not put calendar dates, years or a date picker anywhere; sessions and events carry session and week labels only.
- Do not imply the registration form transmits anything; it saves to localStorage only and the confirmation says so in plain words.
- Do not take payments or deposits through the site; fees and deposits are display copy only.
- Do not add a backend, server code, API routes, databases, auth, form submission, third-party APIs or analytics; the site runs as static files.
- Do not use stock-photo sites, placeholder-image services, hotlinked assets, CDN scripts, CDN stylesheets or external font URLs; only the three generated photos downloaded into public/images/ plus code-drawn SVG.
- Do not load commercial fonts or fonts from Google or Adobe CDNs; self-host Baloo 2 and Nunito through Fontsource only.
- Do not ship source maps or src/ inside dist/, exceed 20 MB in dist/, use absolute asset paths, or change the fixed build command npm run build.
- Do not use bare-directory internal links; the single page stays at index.html with ./index.html# anchors.
- Do not add SEO metadata, Open Graph tags, JSON-LD, sitemaps or keyword-stuffed headings; a plain [BRAND] title and the favicon are enough.
- Do not leave dead controls: menu, chips, accordions, form fields, save, edit and clear must all respond locally; layer drift and reveals respect prefers-reduced-motion.
- Do not allow console errors, horizontal overflow or tap targets under 44px at 1440x900 and 390x844.

---
— Prompt by VibeFather · https://vibefather.ai/t/summer-camp-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
