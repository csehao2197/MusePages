# Musician Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page site for [ARTIST], a [GENRE] artist from [HOMETOWN], latest release '[RELEASE]'. It must feel like a stage: a custom Web Audio player on a bundled, build-generated sample loop (no copyrighted audio), the release block, five tour dates with invented venues and statuses, a merch grid with a bag counter, a press kit with placeholder downloads, and a mailing list. One page: index.html with sections (#music, #tour, #merch, #press, #join). Everything runs in the browser; nothing is submitted anywhere.

- Audience: Fans who stream at midnight and one A&R person skimming: they want the music immediately, the tour next, and a reason to type an email. Mostly mobile, mostly headphones.
- Goal: Get the play pressed and the email typed. Within five seconds the play button is visible; within a minute a track has played and a date has been checked.
- Tone: Liner-note terse: short lines, lowercase confidence, one dry joke per section. No 'journey', no 'sonic landscape'.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (MIT), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource/oswald (OFL-1.1), @fontsource-variable/work-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template. One HTML page at the project root: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (stage-black, curtain, smoke, cream, ash, amber-light, amber-deep, wine, rule-dark) and fontFamily display ['Oswald', 'Arial Narrow', 'sans-serif'], sans ['Work Sans Variable', 'system-ui', 'sans-serif']. Set borderRadius DEFAULT to 4px and add maxWidth { container: '1120px' }.
  - In src/fonts.ts import '@fontsource/oswald/400.css', '@fontsource/oswald/600.css' and '@fontsource-variable/work-sans'; import src/fonts.ts and src/index.css from the entry file.
  - Audio: write scripts/make-sample.mjs (node), run once in setup and committed: synthesizes a 12-second loop (Am pentatonic pluck arpeggio on a soft sine with exponential decay + a muffled kick on beats + vinyl-ish filtered noise at low gain), writes public/audio/sample-loop.wav (~1.5 MB 16-bit 44.1k mono). The page plays ONLY this file. Player logic in src/lib/player.ts: Web Audio graph (source → gain → analyser → destination), play/pause/seek (loop points), volume, getLevels() for the visualizer.
  - File layout: src/content.ts (every string, track, date, merch item, press line, quote and image path, typed), src/lib/brand.ts (artistSlug = [ARTIST] lowercased with every run of non-alphanumeric characters replaced by '-', emailDomain = artistSlug without hyphens + '.com'), src/lib/storage.ts (safe localStorage get/set wrapped in try/catch, keys prefixed with artistSlug + ':').
  - State: src/store/listener.ts is a tiny external store (useSyncExternalStore) holding { email, joined } for the mailing list and bag: string[] (merch slugs) persisted to localStorage key artistSlug + ':listener'. The bag count renders in the header; a small bag drawer lists items with quantities and a total, with the caption that checkout isn't part of this demo.
  - Components in src/components/: Header.tsx (wordmark + nav + BagButton), Reveal.tsx (Motion whileInView wrapper), Eyebrow.tsx, Footer.tsx, Marquee.tsx (a drawn-bulb ticker); Hero.tsx, Player.tsx (PlayButton.tsx, SeekBar.tsx, Visualizer.tsx, VolumeControl.tsx), Release.tsx (TrackRow.tsx), Tour.tsx (DateRow.tsx), Merch.tsx (MerchCard.tsx, BagDrawer.tsx), Press.tsx, JoinStrip.tsx. src/pages/Home.tsx composes them.
  - Before the first build, run `node scripts/make-sample.mjs` to generate the wav, and download every image listed under Assets into public/images/ with curl -L -o using the exact file names given. The build itself never fetches anything.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#0C0A09'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[ARTIST] — [GENRE], [HOMETOWN]</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts, favicon.svg, the wav sample and the six images. Keep it under 12 MB.

## Variables
- [ARTIST] — Artist name (default: "Marisol Wave"). Invented artist/band name. Used in the wordmark, title, footer, email (list@ + artistSlug without hyphens + .com) and localStorage keys. Never a real musician.
- [GENRE] — Genre (default: "ambient soul"). Two words naming the sound. Drives the title, hero line, one press quote and the merch voice. Keep it lowercase and unusual enough to be somebody's real genre.
- [HOMETOWN] — Hometown (default: "New Orleans, Louisiana"). Where the artist is from. Used in the title, hero sub-line and press kit bio. Real cities fine.
- [RELEASE] — Latest release (default: "Slow Static"). The latest release title (an invented album/EP). Drives the release block's title, the hero sub-line and one tour row's 'album night' note.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/musician-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Stage Black `#0C0A09` — Page background throughout — the room with the lights off.
- Curtain `#171412` — Alternate section background (Release, Press), card wells, hover fill.
- Smoke `#221E1B` — Cards, the player bar, inputs, bag drawer surfaces.
- Cream `#F2E9DC` — Primary text: headlines, body, buttons on dark.
- Ash `#9A8F85` — Secondary text, captions, eyebrows, closed/sold-out states.
- Amber Light `#E8A13C` — The one accent: the play glyph, visualizer bars, seek fill, prices, focus ring, marquee bulbs.
- Amber Deep `#C4831F` — Amber hover and pressed.
- Wine `#7C2D3E` — Quiet second color: sold-out strikes, the vinyl label in drawn art, deep hover tint.
- Rule Dark `#2E2925` — 1px hairlines, card borders, input borders, tour row dividers.

### Typography
- Display: H1, H2, the wordmark, track and date titles, merch names — Oswald tall and letterspaced: Oswald (OFL), weights 400/600
- Text and UI: body, eyebrows, buttons, player controls, captions; tabular numerals for durations and prices: Work Sans (OFL), weights 400/500/600

### Layout & motion
- Spacing: 8px base unit. Container max-width 1120px, centered, side padding 48px desktop, 32px tablet, 20px under 640px. 12-column grid, column gap 24px. Section vertical padding 104px desktop, 76px under 1024px, 60px under 640px — dark rooms breathe. Type scale: H1 clamp(56px, 10vw, 132px) Oswald 600 uppercase letter-spacing 0.04em, line-height 0.95; H2 clamp(30px, 4vw, 48px) Oswald 600 uppercase; track/date titles Oswald 400 22px; lead Work Sans 400 17px / 1.7 Cream at 85%; body 15.5px / 1.7 (max-width 62ch); eyebrow Work Sans 600 11px uppercase letter-spacing 0.24em Ash; caption 12.5px Ash. Buttons: height 48px, Work Sans 600 13px uppercase letter-spacing 0.08em. Play CTA: Amber Light fill, Stage Black glyph. Secondary: 1px Cream/35% border, Cream text. Inputs: height 48px, Smoke fill, 1px Rule Dark border, focus Amber border. Focus ring everywhere: 2px Amber Light outline with 3px offset.
- Radius: 4px on cards, buttons, inputs, merch tiles and the player bar — sharp like a stage. 999px only for the play circle, volume knob and status pills.
- Motion: Easing: --ease-out cubic-bezier(0.22, 0.61, 0.36, 1) for reveals; --ease-io cubic-bezier(0.65, 0, 0.35, 1) for the player states and drawer. Slow fades, club-tempo.
- Motion: Reveal: blocks wrapped in <Reveal> start at opacity 0, translateY(14px) and settle over 750ms --ease-out when 12% visible (Motion whileInView, viewport once). Siblings stagger 80ms.
- Motion: Hero: the stage photo darkens 5% and scales 1.05→1.0 over 2800ms; the artist name's words rise with 120ms stagger; an amber light-sweep crosses the name once (a gradient mask, 1200ms, off under reduced motion).
- Motion: Player: the play circle pulses gently while playing (scale 1→1.05, 1600ms loop, off under reduced motion or paused); the Visualizer's 24 bars animate from the analyser's real levels (requestAnimationFrame, 60fps, paused when audio paused); the seek fill tracks instantly; volume knob rotates on drag.
- Motion: Tour rows: hover fills Curtain and the status pill brightens; sold-out rows carry a Wine strike that draws on hover once.
- Motion: Merch: hover lifts 3px and the price ticks Amber; adding to the bag flies a small vinyl-glyph from the card to the bag button (600ms, once) and the count pops 1→1.3→1.
- Motion: Bag drawer: overlay Stage Black at 60% fades 250ms; the drawer slides from the right 400ms --ease-out; removing collapses rows 240ms.
- Motion: Mailing list: invalid shakes 4px with an inline hint; joining swaps to 'you''re on the list' (a drawn amber envelope stamp scaling in) and stays across reloads.
- Motion: Marquee: the tour ticker scrolls at 40px/s constant, pausing on hover, static under reduced motion.
- Motion: prefers-reduced-motion: reduce — no pulses, sweeps, flights or marquee; the visualizer shows a static equal-height row; color/border hovers stay. Use CSS @media in index.css plus Motion's useReducedMotion in components.
- Imagery: Stage-light photography, all six made for this template in one consistent style: deep blacks, one warm amber light source, haze and bokeh — stages, instruments, rooms; never a person (no faces, no hands, no silhouettes of the artist). No readable text or signage. Every photo uses object-fit cover with the object-position given under Assets, 4px corners, no shadow; photos on Stage Black get a 1px Rule Dark outline. Captions in Work Sans 12.5px Ash. Drawn in code: the vinyl glyph, marquee bulbs, envelope stamp, play triangle and the favicon. Icons: lucide-react only, stroke width 1.75.

## Pages & Sections
### Home (`index.html`)
1. **Content file and copy rules** — All copy below is written for the default values ([ARTIST] = Marisol Wave, [GENRE] = ambient soul, [HOMETOWN] = New Orleans, Louisiana, [RELEASE] = Slow Static). Put every string, time and price in src/content.ts and render from it. If any variable value differs, rewrite the hero, track list, tour rows, merch, press kit and quotes so they are specific and believable for the new artist, keeping the same structure and counts (6 tracks, 5 dates, 4 merch items, 3 press quotes, 5 press-kit assets). All venues, press outlets and quotes are invented; the audio sample is build-generated and the player UI labels it 'sample loop — build-generated'. Release '[RELEASE]' track list: 'Static Bloom' 4:12; 'Amber Room' 3:48; 'Slow Static (title)' 5:02; 'Hold the Hiss' 2:57; 'Ninth Ward Hum' 6:14; 'Outro (Dust)' 3:33. Tour (city · venue · note · status): 'New Orleans · The Amber Room · album night, two sets' tickets; 'Atlanta · The Loggia · with string quartet' tickets; 'Nashville · Bell & Antler · seated, early' sold out; 'Austin · Neon Chapel · late show' tickets; 'Marfa · Static Field Festival · one-off under the stars' invite. Merch: 'Slow Static LP (black 180g)' $28; 'Cassette + digital' $14; 'Amber Room tee' $32; 'Tote — hold the hiss' $18.
   Layout: n/a
   Motion: n/a
2. **Header** — Left: the wordmark '[ARTIST]' (Oswald 600 19px uppercase letter-spacing 0.12em) linking ./index.html. Nav (Work Sans 600 13px uppercase letter-spacing 0.08em): 'Music' → #music, 'Tour' → #tour, 'Merch' → #merch, 'Press' → #press; right the BagButton (Lucide ShoppingBag + Amber count pill) opening the BagDrawer. Under 760px: wordmark + bag + a Menu icon opening a Curtain full-screen menu.
   Layout: Sticky top, height 68px, Stage Black/85% blur, Rule Dark border — the room stays dark while scrolling.
3. **Hero** — Full-bleed hero-stage.webp (92svh) under a Stage Black gradient. Centered: eyebrow 'AMBIENT SOUL · [HOMETOWN]'; H1 the artist name stacked tall; sub-line ''[RELEASE]'' — the new record, six songs about bad reception and good rooms.' (Work Sans 16px Cream at 80%); the PlayButton — a 72px amber circle that starts the sample loop and scrolls #music into view — with the caption 'press play — 12-second sample loop, generated at build'.
   Layout: Photo object-position 50% 45%; gradient rgba(12,10,9,0.55)→rgba(12,10,9,0.2)→rgba(12,10,9,0.9). Name centered max-width 900px; play CTA 32px below the sub-line.
4. **Release and player** — Section id='music'. Two columns. Left: the album block — a drawn vinyl-on-turntable SVG (the record spins slowly while audio plays; the label in Wine reads '[RELEASE]'), the track list as TrackRows (number, title, duration tabular; the title track carries a small amber 'sample' tag), and one line: 'streaming everywhere fine music is algorithmically denied to you.' Right: the Player card on Smoke — track title 'Slow Static (title) — sample', the Visualizer (24 amber bars), SeekBar (loop points at 0:00/0:12, real time), VolumeControl, and the caption 'All audio on this page is generated by the build — no recordings were harmed or licensed.'
   Layout: Curtain background. Left 5 cols (vinyl 280px, tracks hairline-divided), right 6 cols offset 1 sticky top 96px. Under 1024px: stacked, player first.
5. **Tour** — Section id='tour'. Eyebrow 'ON THE ROAD' and H2 'FIVE ROOMS.' DateRows: city (Oswald 400 24px), venue + note (14px Ash), status pill right — 'tickets' (Amber outline, href '#', placeholder), 'sold out' (Wine strike, inert), 'invite' (Ash). Rows hairline-divided; the Marquee above the list ticks 'NEW ORLEANS · ATLANTA · NASHVILLE · AUSTIN · MARFA ·' in Oswald with amber bulb separators.
   Layout: Stage Black background. Marquee a hairline-bounded strip 36px tall; rows 64px tall, hover fills Curtain; container max-width 860px.
6. **Merch** — Section id='merch'. Eyebrow 'TAKE SOME OF IT HOME' and H2 'MERCH, FOUR WAYS.' MerchCards: photo (or drawn vinyl art for the LP/cassette), name (Oswald 20px), price (Work Sans 600 tabular, Amber), 'Add to bag' secondary-on-dark button; the bag counter in the header ticks. The BagDrawer: line items with qty steppers, a total, and the caption 'This demo bag lives in your browser — checkout is a rumor we don't spread.'
   Layout: Curtain background. 4 columns 20px gap (2 under 900px, 1 under 640px); tiles on Smoke with Rule Dark borders, 4px radius; drawer 360px from the right.
7. **Press kit** — Section id='press'. Eyebrow 'FOR THE WRITE-UPS' and H2 'PRESS KIT.' A list of five described assets, each a row with an icon and a '#' placeholder link: 'Photos — 6 stage shots, 3000px, credit [ARTIST]'; 'Bio — short (60 words) and long (240)'; 'One-sheet — [RELEASE], quotes and numbers'; 'Stage plot — one page, PDF'; 'Rider — the honest version (tea, one lamp)'. Three press quotes beside: '"A voice like a dial tone you actually want to hear."' — 'Nightpost (invented)'; '"[GENRE] that finally respects silence."' — 'The Listener (invented)'; '"We played the sample loop eleven times writing this."' — ' Tape Kitchen (invented)'.
   Layout: Stage Black background. Assets 6 cols hairline-divided; quotes 5 cols offset 1 in Oswald 22px / 1.45 with Ash attributions.
8. **Mailing list and footer** — JoinStrip (id='join'): a Curtain band — 'one email a month: dates, demos, no urgency.' with the email input + Amber 'join' button, inline confirmation ('you''re on the list — first letter lands with the next moon.'), saved locally. Footer: Stage Black with a Rule Dark top border; three columns: 1) wordmark + '[ARTIST]' over '[GENRE] · [HOMETOWN] · [RELEASE], out now'; 2) 'Write': list@ + emailDomain; 3) 'Around': Music, Tour, Merch, Press, join anchors. Bottom line: '© [ARTIST]. Sample audio generated at build; bulbs drawn by hand.'
   Layout: JoinStrip vertical padding 72px centered max-width 560px; footer padding 56px, 3 columns, bottom line 28px below a Cream/10% rule. Under 768px stacked.

## Assets
- image: Template photos made for this design (free to redistribute with the template). Download each with curl -L -o into public/images/: https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/hero-stage.webp → public/images/hero-stage.webp (Hero; object-position 50% 45%; alt 'An empty stage washed in a single amber spotlight through haze'); https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/keys-amber.webp → keys-amber.webp → public/images/keys-amber.webp (Release side; alt 'A vintage electric piano lit amber in a dark room'); https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/vinyl-turntable.webp → public/images/vinyl-turntable.webp (Merch LP; alt 'A record spinning on a turntable under low light'); https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/cassette-dark.webp → public/images/cassette-dark.webp (Merch cassette; alt 'A black cassette tape on a dark surface with amber light'); https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/tee-merch.webp → public/images/tee-merch.webp (Merch tee; alt 'A folded plain t-shirt under a single warm lamp'); https://media.vibefather.ai/assets/0828a284-0cfb-4376-a947-c7db26adbdd2/room-bokeh.webp → public/images/room-bokeh.webp (Press/Join side; alt 'A dark venue room with amber bokeh lights'). Six files in total. NOTE: this entry originally contained a duplicated path typo (keys-amber.webp appearing twice); keep exactly the six files above.
- image: Write ASSETS.md at the project root with a table: path, source URL, author, license — one row for each photo (source 'media.vibefather.ai, made for this template', author 'VibeFather', license 'Distributed with the template'), a row for public/audio/sample-loop.wav ('Generated by scripts/make-sample.mjs at build; no third-party audio'), plus rows for @fontsource/oswald and @fontsource-variable/work-sans (OFL-1.1) and lucide-react (ISC). Never replace photos with stock sites or images with people, faces, hands or readable branding; never bundle third-party audio.
- icon: lucide-react only: Play, Pause, Volume2, ShoppingBag, Plus, Minus, X, Ticket, Download, Mail. Stroke width 1.75, 16–24px, color inherits. The vinyl/turntable art, marquee bulbs, envelope stamp, play triangle and the favicon are drawn SVG. public/favicon.svg: viewBox 0 0 32 32, a 32x32 circle filled #0C0A09 with a 1px Amber (#E8A13C) ring, an Amber play triangle centered. No other logo: the artist name is always set as type; no real platform or ticketing marks.
- font: Install @fontsource/oswald and @fontsource-variable/work-sans and import them in src/fonts.ts as listed in Setup. Vite bundles the woff2 files into dist/.
- video: Audio asset: scripts/make-sample.mjs generates public/audio/sample-loop.wav — a 12-second Am-pentatonic pluck arpeggio (sine with exponential decay), soft kick on the beat, low-gain filtered noise for vinyl hiss, 44.1kHz mono 16-bit, loop-seamless. Run it once before the first build; commit the wav. The site plays ONLY this file via the Web Audio graph in src/lib/player.ts; no fetches, no external audio, no copyrighted material.

## Don'ts
- No backend, no form submission, no fetch to any API: the mailing list and bag save in the browser only (localStorage); audio is the bundled generated wav through Web Audio; ticket and press-kit links are '#' placeholders.
- All links on this single page are anchors (./index.html#music, #tour, #merch, #press, #join) plus placeholders.
- Self-host everything: fonts through Fontsource, icons as npm packages or inline SVG, images downloaded into public/images/, audio generated at build. No CDN <script> or <link> tags, no Google Fonts, no analytics, no external audio.
- Production build: minified, no source maps, no src/ copied into dist/, single command npm run build, output in dist/ under 12 MB (the wav is ~1.5 MB).
- No real musicians, labels, venues, press outlets or platforms; no photos with people, faces, hands or artist silhouettes; no readable signage; no third-party audio of any kind.
- No dates or years anywhere; tour rows carry cities and notes only, never calendar dates; the site never shows today's date.
- Never mention VibeFather or any other brand inside the site except the optional credit footer link; all copy is invented US English.
- Respect prefers-reduced-motion: no pulses, sweeps, marquee motion or visualizer animation (static row); audio playback itself is user-initiated and unaffected; color/border hovers stay.
- The page must work at 1440x900 desktop and 390x844 mobile with zero console errors; the player controls, bag and form work with keyboard only (Space toggles play when the player is focused, arrows seek) and visible focus rings; audio must not autoplay.
- Keep copy liner-note terse: no lorem, no 'sonic journey'; every track, price and venue lives in src/content.ts.

---
— Prompt by VibeFather · https://vibefather.ai/t/musician-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
