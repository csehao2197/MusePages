# Podcast Show Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a four-page editorial podcast website for [BRAND], a show about [SHOW_TOPIC], hosted by [HOST_NAMES]. Write the default experience for [AUDIENCE] and use [SHOW_TAGLINE] as the hero message. The site includes a latest-episode audio player, a searchable archive, complete episode notes and chapters, guest profiles, and subscription actions.

- Audience: Independent podcast hosts, interview and educational shows, and small media teams; the default listeners are [AUDIENCE].
- Goal: Make the latest episode immediately playable, help listeners discover relevant archive episodes and guests, provide readable show notes and chapters, and offer working local subscribe actions without a backend.
- Tone: Curious, intelligent, warm, and quietly playful; specific rather than hype-driven, with the tactile rhythm of an independent culture magazine.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: React + ReactDOM (MIT), Tailwind CSS (MIT), lucide-react (ISC)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Configure vite.config.ts with base './', build.sourcemap false, and explicit multi-page inputs for index.html, episodes.html, episode.html, and guests.html; each HTML file loads the same React entry, which selects the page from window.location.pathname.
  - Use Tailwind for layout and component states, with the exact color tokens and font families from Design extended in tailwind.config; put the reveal keyframes, range-input styling, focus rings, and reduced-motion overrides in src/index.css.
  - Keep all show positioning, episode records, chapter data, guest biographies, interface labels, and image alt text in src/content.ts. The supplied copy is for the default variable values; whenever values change, coherently rewrite every dependent headline, episode, show note, biography, and label and remove all default proper nouns.
  - Self-host Fraunces, Inter, and IBM Plex Mono by importing the specified Fontsource packages in src/main.tsx; never use a font CDN.
  - Generate an original 24-second mono PCM WAV at public/audio/episode-preview.wav with a local standard-library wave/math script: soft synthesized electric-piano tones, a restrained pulse, and a short fade-in/fade-out, with no sampled material, speech, or external service. Bundle the WAV and the generation script, and document the audio as original generated media in ASSETS.md.
  - Create public/feed.xml as a small valid static RSS feed from the same episode content, with relative local enclosure and episode URLs suitable for the demo; the RSS subscribe button opens ./feed.xml.
  - Create a simple original waveform favicon in SVG and set only a plain document title containing [BRAND]; do not add SEO metadata beyond that.

## Variables
- [BRAND] — Show name (default: "Tangent & Tide"). An invented podcast name, used in the wordmark, page titles, footer, and feed.
- [SHOW_TOPIC] — Show subject (default: "the hidden design decisions behind everyday objects"). A concise subject phrase that should drive all episode and guest content.
- [AUDIENCE] — Listener audience (default: "curious designers, engineers, and lifelong learners"). The people the show and its copy speak to.
- [HOST_NAMES] — Host names (default: "Mara Venn and Ivo Sen"). Two invented hosts; split the value into individual profiles and keep bios consistent.
- [SHOW_TAGLINE] — Show tagline (default: "Ordinary things. Extraordinary stories."). A short original two-part line for the homepage hero.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/podcast-show-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Parchment `#F4F0E8` — Primary page background and generous editorial negative space
- Paper `#FFFDF8` — Episode notes, forms, and the audio-player surface
- Ink `#1D1B18` — Primary text, dark buttons, and fine rules
- Muted Ink `#6F6A62` — Secondary copy and metadata; never use below readable contrast
- Oxblood `#7A2E2A` — Active filters, selected chapters, and editorial emphasis
- Persimmon `#E56B45` — Play controls, progress, focus accents, and small highlights
- Sage `#A8B4A0` — Alternating geometric episode-cover shapes and quiet tags

### Typography
- Display headlines and episode titles: Fraunces Variable (OFL), weights 600/700/900
- Body copy, navigation, and controls: Inter Variable (OFL), weights 400/500/600/700
- Episode numbers, timestamps, filter counts, and labels: IBM Plex Mono (OFL), weights 400/500

### Layout & motion
- Spacing: Use a 4px base unit, a maximum content width of 1360px, 24px mobile and 48px desktop gutters, and a 12-column desktop grid with 24px gaps. Section padding is 72px mobile and 112px desktop; card padding is 20–32px. The desktop header is 76px tall. Keep show-note prose to 68 characters per line.
- Radius: Mostly crisp editorial edges: 2px on tiny chips, 8px on buttons and inputs, 16px on image frames and the player, and 999px only for filter pills and status badges. Use 1px ink/15 borders and no soft floating-card shadows.
- Motion: Reveal major sections once with IntersectionObserver: opacity 0 to 1 and translateY 16px to 0 over 400ms, with an 80ms stagger between sibling cards and no scroll-jacking.
- Motion: Audio progress updates smoothly while playing; play/pause, skip, speed, volume, copy, and chapter selection give immediate 160–220ms visual feedback without layout shifts.
- Motion: Episode covers scale to 1.025 and arrows move 4px on hover over 220ms; selected filter pills fill oxblood rather than bouncing.
- Motion: Never autoplay audio. Under prefers-reduced-motion, remove reveals, smooth scrolling, cover scaling, and nonessential transitions while preserving all state changes.
- Imagery: Use exactly the six coordinated generated images listed in Assets: one wide studio scene as the first-screen anchor and five fictional editorial portrait placeholders. The hero must remain a spacious scene, never a tight face close-up. Portraits represent fictional people who do not resemble real individuals, with varied ages and ethnicities and consistent terracotta, parchment, and walnut tones under soft directional window light. Generate all episode covers locally as original SVG compositions of arcs, waveform bars, circles, and grids using Parchment, Oxblood, Persimmon, and Sage; use the episode number as the only cover text and give each topic a deterministic pattern. Do not add any other photographs, external artwork, logos, or recognizable people.

## Pages & Sections
### Latest episode and show home (`index.html`)
1. **Shared header and footer** — Use this shell on all four pages. The header contains an original three-bar waveform mark, the [BRAND] wordmark, and text links Latest (./index.html), Episodes (./episodes.html), Guests (./guests.html), plus a dark Subscribe button linking to ./index.html#subscribe. The mobile Menu button opens an accessible disclosure with the same file links. The footer repeats the wordmark and [SHOW_TAGLINE], shows the same navigation, a Copy show link button, small text 'An independent show for [AUDIENCE].', and the optional [CREDIT] link.
   Layout: Sticky top header on parchment with a bottom 1px rule, 76px desktop height and 64px mobile height. Desktop navigation sits right; mobile navigation expands below without covering the page. Footer is an ink-colored band with parchment text, a 2-column desktop layout, and stacked mobile content.
   Motion: Header links underline from left on hover. Mobile disclosure fades and moves down 8px over 180ms; no animated sticky resizing.
2. **Latest episode hero and custom player** — Eyebrow: '[BRAND] · A podcast about [SHOW_TOPIC]'. H1: '[SHOW_TAGLINE]'. Supporting copy: 'Conversations with the people who notice the details, for [AUDIENCE].' Primary CTA 'Browse episodes' and text CTA 'Meet the guests'. Feature episode 42, 'Why the Humble Doorknob Turns', with metadata 'EP 42 · OBJECTS · 31 MIN' and summary 'A lever, a latch, and the ergonomics hiding in plain sight.' The player uses public/audio/episode-preview.wav and is explicitly labeled '24-second original preview'. Provide play/pause, 15-second back, 30-second forward, a keyboard-accessible seek range, elapsed and total time, 1x/1.25x/1.5x/2x speed cycling, mute, and volume. Disable skip controls when the target would exceed the actual preview duration. Play on the episode detail page loads this same preview and selected episode record without autoplay.
   Layout: At desktop, use a 12-column hero with copy in columns 1–5 and the studio-hero image in columns 6–12. The image has a 16:9 crop and 16px radius; the Paper audio-player panel overlaps its bottom edge by 48px and spans columns 6–11. The latest episode title sits above the player controls. At mobile, stack eyebrow, H1, copy, CTAs, image, then player with no overlap. Keep the complete image and primary play control visible in the first 844px on mobile without hiding copy.
   Motion: The hero image and copy enter with the standard reveal. The play icon crossfades to pause, and the persimmon progress fill follows actual audio time. No autoplay or ambient motion.
3. **Topic sampler** — Heading: 'Follow a thread.' Intro: 'Start with a question and stay for the connections.' Show four linked topic cards: Objects — 'Small things, serious thinking.'; Cities — 'The choices hiding in public space.'; Behavior — 'Why we respond the way we do.'; Materials — 'Texture, tension, and the physical world.' Each links to ./episodes.html?topic=<lowercase-topic> and the archive initializes that filter.
   Layout: Section heading spans 4 columns; a 2-by-2 card grid spans the remaining 8 columns. Each card has a small deterministic SVG cover fragment, mono topic label, one-sentence description, and ArrowRight. Mobile uses one column with horizontal 96px cover thumbnails.
   Motion: Apply the standard sibling-card reveal and the cover hover scale.
4. **Recent episodes** — Heading: 'New from the studio.' Link: 'All episodes'. Feature episodes 41 'The Secret Life of Street Bollards' (28 min, Cities, Theo Wren), 40 'A Better Button for Bad Weather' (24 min, Materials, Amara Pell), and 39 'Why Elevators Have Mirrors' (32 min, Behavior, Sera Quince). Each row includes its generated SVG cover, episode number, topic, duration, title, one-sentence summary, and a 'Notes & preview' link to ./episode.html?slug=<slug>.
   Layout: Three full-width horizontal rows separated by fine rules. Cover is 144px square at desktop, title takes 6 columns, guest and topic take 3, and the arrow action takes 1. Mobile rows become a 96px cover above compact metadata and title, with the action below.
   Motion: Rows reveal with an 80ms stagger; arrow and cover respond on hover.
5. **Hosts and recent guests** — Heading: 'The voices in the room.' Host cards use host-mara.webp for Mara Venn and host-ivo.webp for Ivo Sen. Mara's bio: 'A service designer who collects overlooked details and asks one more question.' Ivo's bio: 'An engineer and radio maker interested in how ordinary systems earn our trust.' Recent guest cards use guest-lena.webp, guest-theo.webp, and guest-amara.webp for industrial designer Lena Ort, public-space researcher Theo Wren, and materials scientist Amara Pell. Link each guest to ./guests.html#<first-name-lowercase>.
   Layout: Two large host cards occupy the left 7 columns in a 2-column inner grid; three compact guest cards stack in the right 5 columns. Host portraits use a 4:5 crop, guest portraits 72px squares. On mobile, hosts remain a 2-column grid if names fit, otherwise stack; guest rows stay horizontal.
   Motion: Portraits use the standard reveal only; no image parallax.
6. **Subscribe and email updates** — Anchor id='subscribe'. Heading: 'Keep the thread going.' Copy: 'New episodes, occasional notes, nothing else.' Provide three actions: 'RSS feed' opens ./feed.xml; 'Copy show link' copies the current site's ./index.html URL and changes to 'Copied' with a Check icon; 'Email updates' reveals a validated email form. The email form says 'Demo only: your address is stored in this browser and is not sent anywhere.', saves the address in localStorage, and shows 'You are on the local list.' after valid submission, with a 'Remove' action.
   Layout: An oxblood section with parchment text, heading in columns 1–6 and action stack in columns 8–12. Buttons are full width on mobile. The inline email form expands below the button without opening a modal and includes a visible label.
   Motion: The form expands over 200ms and the copy confirmation persists for 2 seconds; reduced motion makes both immediate.

### Searchable episode archive (`episodes.html`)
1. **Archive introduction** — Eyebrow: 'THE COMPLETE ARCHIVE'. H1: 'Every episode, every thread.' Copy: 'Search by idea, guest, or object, then filter by the thread you want to follow.' Include a visible search label 'Search episodes' and placeholder 'Try “buttons”, “Lena”, or “cities”'.
   Layout: A compact editorial header with H1 in columns 1–8 and search input in columns 9–12, aligned to the baseline. On mobile, stack the search below the intro at full width.
   Motion: Standard single reveal; search focus uses a 2px persimmon outline.
2. **Filters and episode results** — Provide All, Objects, Cities, Behavior, Materials, and Standards filter pills, plus a live result count and Clear filters action. Search and topic filtering combine, match case-insensitively across titles, summaries, topics, and guests, and update immediately. Read ?topic= on load. Empty state: 'No episodes found. Try another phrase or clear the filters.' Store exactly eight records in content.ts: EP42 'Why the Humble Doorknob Turns', 31 min, Objects, Lena Ort, 'A lever, a latch, and the ergonomics hiding in plain sight.'; EP41 'The Secret Life of Street Bollards', 28 min, Cities, Theo Wren, 'How a small post negotiates safety, movement, and public space.'; EP40 'A Better Button for Bad Weather', 24 min, Materials, Amara Pell, 'Gloves, rain, and the physical interface we still need.'; EP39 'Why Elevators Have Mirrors', 32 min, Behavior, Sera Quince, 'Perceived time, awkward silence, and a reflective design trick.'; EP38 'The Color of Emergency Exits', 27 min, Standards, Nico Vale, 'How a safety color becomes a shared language.'; EP37 'The Quiet Engineering of Paper Clips', 22 min, Objects, Lena Ort, 'Wire, spring, and the beauty of almost no instructions.'; EP36 'Who Owns the Corner Bench?', 35 min, Cities, Theo Wren, 'A small seat reveals big ideas about welcome and belonging.'; EP35 'The Sound of a Good Switch', 26 min, Materials, Amara Pell, 'Why a click can make an ordinary object feel precise.' Each result links to ./episode.html?slug=<slug>.
   Layout: Filter pills wrap above the results, with result count right-aligned on desktop. Episode results use the same horizontal rows as the homepage but with 160px covers and two-line summaries. Mobile uses a 2-column card grid at widths above 480px and one column at 390px; filter pills wrap rather than causing horizontal page overflow.
   Motion: On filter changes, crossfade the result list over 160ms without animating item heights. Announce result counts through aria-live.
3. **Archive subscribe strip** — Use the heading 'Not sure where to start?' and copy 'Play the latest preview, then follow the thread that catches your attention.' Buttons link to ./index.html and ./index.html#subscribe.
   Layout: A Paper panel with 32px padding, heading left and two buttons right, stacked on mobile.
   Motion: Standard reveal only.

### Episode notes and chapters (`episode.html`)
1. **Episode header and preview** — Read the slug query and render the matching episode; with no slug or an unknown slug, render EP42, never a blank or not-found state. Show a breadcrumb to ./episodes.html, episode number, topic, duration, title, summary, guest, and the same custom preview player used on the homepage. The preview button never autoplays and always uses the bundled 24-second original sample.
   Layout: Desktop header uses a 5-column square SVG cover and 7-column episode copy, with the player full width below. Mobile stacks metadata, title, cover, and player. Keep the title to a readable maximum of 12 words in the content model.
   Motion: Standard reveal and immediate audio-control feedback.
2. **Show notes, chapters, and takeaways** — Heading: 'Inside this episode'. For EP42 write these three paragraphs: 'A doorknob seems solved until a closed door meets wet hands, a full bag, or a stiff wrist. Industrial designer Lena Ort joins the hosts to explain why the lever handle is more than a stylistic alternative.'; 'The conversation moves from torque and spindle springs to the difference between a shape that looks intuitive and one that actually communicates its use. Lena brings three anonymous handle studies and explains what a five-second doorway observation can reveal.'; 'The takeaway is not that one fitting wins everywhere. It is that a small everyday object becomes better when designers account for the broadest range of hands, habits, and hurried moments.' Takeaways: 'Form can instruct without a label.', 'Comfort is a mechanical property, not only a feeling.', and 'Test the doorway, not just the drawing.' Chapters: 00:00 'The handle that fooled us', 06:18 'From grip to torque', 14:42 'A universal design lesson', and 24:10 'What we notice now'. Selecting a chapter highlights its corresponding note panel and timestamp; it does not pretend that the 24-second preview contains the full episode. For every other episode, author a unique three-paragraph show-note body, three specific takeaways, and four realistic timestamped chapters in content.ts based on its title, summary, and guest; never duplicate EP42's notes.
   Layout: A 12-column layout with chapter navigation in columns 1–4 and show notes in columns 6–12. Chapter buttons are full-width rows with mono timestamps and an oxblood selected state. Notes have a 68-character measure, 18px body text, and generous paragraph spacing. Takeaways appear as three numbered rows below. On mobile, chapters become a horizontal selectable list above the notes with no overflow beyond its own container.
   Motion: Selected chapter notes use a 180ms background highlight; no automatic scrolling or audio seek.
3. **Guest context and subscription** — For featured guests Lena Ort, Theo Wren, and Amara Pell, show the matching portrait, role, short biography, and link to the guests page. For Sera Quince and Nico Vale, use a code-drawn monogram accent only beside a text biography and keep the page's existing photographic anchor; do not invent extra portraits. Include a compact 'Subscribe to [BRAND]' link to ./index.html#subscribe.
   Layout: Place this aside in the right rail below the notes on wide screens, or as a Paper card immediately after the notes on smaller screens. Portrait is 96px square and the text remains left aligned.
   Motion: Standard reveal only.
4. **Related episodes** — Heading: 'Keep following the thread.' Select three other episodes, prioritizing the same topic and then the same guest. Reuse the episode card with SVG cover, title, metadata, and a working file link.
   Layout: Three equal cards on desktop and one stacked column at 390px, separated by 24px gaps.
   Motion: Staggered reveal and cover hover scale.

### Guests and hosts (`guests.html`)
1. **Guest directory introduction** — Eyebrow: 'GUESTS & HOSTS'. H1: 'Good questions need generous guests.' Copy: 'Designers, researchers, and close observers bring the evidence behind each conversation.'
   Layout: H1 spans 8 columns and the supporting copy sits below at a 52-character measure, with 64px bottom spacing. Stack naturally on mobile.
   Motion: Standard reveal.
2. **Featured guest profiles** — Create three anchored profiles. Lena Ort (id='lena'), industrial designer: 'Lena studies the small mechanical choices that make objects easier to understand. Her current work focuses on accessible handles, controls, and fastenings.' Episodes: 42 and 37. Theo Wren (id='theo'), public-space researcher: 'Theo documents how streets communicate welcome, caution, and care. His field notes turn overlooked infrastructure into stories about shared life.' Episodes: 41 and 36. Amara Pell (id='amara'), materials scientist: 'Amara explores how surfaces respond to weather, wear, and touch. She translates lab detail into practical lessons for anyone who makes things.' Episodes: 40 and 35. Every episode title links to its detail URL.
   Layout: Three equal vertical cards with 3:4 portrait crops, name and role above a short bio, then compact episode links. Use guest-lena.webp, guest-theo.webp, and guest-amara.webp. Desktop cards sit in one row; mobile stacks them with a 40% width portrait beside the text if that remains readable, otherwise full width.
   Motion: Staggered reveal; episode links underline on hover.
3. **Host profiles** — Heading: 'Your regular hosts'. Show Mara Venn and Ivo Sen with host-mara.webp and host-ivo.webp and the same biographies from the homepage. Add a shared note: 'They record around one wooden table, with one rule: follow the interesting detail.' When HOST_NAMES changes, rewrite both names and biographies coherently.
   Layout: An ink band containing two 6-column profiles. Each profile has a 160px square portrait to the left and parchment text to the right. Stack portrait above text on mobile.
   Motion: Standard reveal only.
4. **Guest subscribe strip** — Heading: 'Hear the next conversation.' Copy: 'Follow [BRAND] for new episodes and notes from the studio.' Buttons: 'Latest episode' linking to ./index.html and 'Subscribe' linking to ./index.html#subscribe.
   Layout: Simple centered text block with two inline buttons, stacked full-width on mobile.
   Motion: Standard reveal only.

## Assets
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/studio-hero.webp to public/images/studio-hero.webp. Alt: 'Two podcast hosts recording across a wooden table in a warm studio.' Use as the large index-hero anchor. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/host-mara.webp to public/images/host-mara.webp. Alt: 'A podcast host in a rust jacket beside a studio window.' Use for the first host on index.html and guests.html. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/host-ivo.webp to public/images/host-ivo.webp. Alt: 'A podcast host in an oxblood overshirt against a cream studio wall.' Use for the second host on index.html and guests.html. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/guest-lena.webp to public/images/guest-lena.webp. Alt: 'An industrial designer seated in warm directional studio light.' Use for Lena Ort on the homepage, episode page, and guest directory. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/guest-theo.webp to public/images/guest-theo.webp. Alt: 'A public-space researcher in a walnut-brown jacket against a warm neutral background.' Use for Theo Wren on the homepage, episode page, and guest directory. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- image: Download https://media.vibefather.ai/assets/9ae01d35-9734-4df7-8dc6-13aefcabdd03/guest-amara.webp to public/images/guest-amara.webp. Alt: 'A materials scientist in a cream shirt beside a terracotta studio wall.' Use for Amara Pell on the homepage, episode page, and guest directory. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record the same credit and source URL in ASSETS.md.
- icon: Use lucide-react (ISC) only for generic interface icons: Play, Pause, Search, ArrowRight, SkipBack, SkipForward, Volume2, VolumeX, Copy, Check, Menu, X, Rss, Mail, and ChevronDown. Render with currentColor and accessible labels; use no brand icons. Document the package and license in ASSETS.md.
- font: Install and self-host @fontsource-variable/fraunces, @fontsource-variable/inter, and @fontsource/ibm-plex-mono (400 and 500), all OFL. Import the required weights locally and list every package and license in ASSETS.md; do not use Google Fonts URLs.

## Don'ts
- Do not use real podcast names, logos, cover art, slogans, episode copy, guest biographies, or recognizable people; every show, person, and story must be fictional and original.
- Do not use third-party episode audio, music samples, speech, or remote streams. Bundle only the original generated WAV, never autoplay it, and keep the 24-second preview label truthful.
- Do not use external podcast-platform logos or make any real platform part of the invented show's identity; use only generic RSS, email, and copy-link subscribe actions.
- Do not hotlink any asset in the finished site, use placeholder-image services, or add Unsplash, Pexels, Pixabay, Google Images, CC BY-NC, or CC BY-SA material. Keep the six supplied generated images local and preserve their credits in ASSETS.md.
- Do not add other people, portraits, brand marks, mascots, anime or game characters, or signature illustrations. Episode covers must be original code-drawn SVGs, and icons must be generic Lucide symbols.
- Do not load commercial fonts, fonts.googleapis.com, fonts.gstatic.com, Adobe Fonts, CDN scripts, CDN stylesheets, analytics, or any third-party API. Self-host every font, icon, image, script, and audio file.
- Do not use Aceternity UI source, Tailwind Plus or Tailwind UI source, purchased templates, packages without allowed licenses, or restricted component source.
- Do not add a backend, server code, API routes, database, authentication, external form submission, or real email capture. Search, filters, player state, chapter selection, copy feedback, and the disclosed email demo must work entirely in the browser.
- Do not use bare-directory internal links or client routes that require a rewrite. Link only to ./index.html, ./episodes.html, ./episode.html?slug=..., ./guests.html, and file anchors; episode.html without a valid slug must show EP42.
- Do not ship source maps, source files in dist/, assets over the 20 MB total limit, console errors, horizontal page overflow, or inaccessible unlabeled controls. Verify at 1440×900 and 390×844.
- Do not autoplay media, scroll-jack, or ignore prefers-reduced-motion. Preserve keyboard operation, visible focus states, readable contrast, and functional controls with motion disabled.
- Do not add SEO descriptions, Open Graph tags, JSON-LD, sitemaps, keyword-stuffed headings, or dates as decorative metadata; a plain [BRAND] title and favicon are sufficient.
- Do not leave default names, episode topics, show notes, alt text, or feed copy unchanged when variables change; all dependent content must be rewritten from src/content.ts and the feed must match.

---
— Prompt by VibeFather · https://vibefather.ai/t/podcast-show-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
