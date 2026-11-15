# Techno Club Night Event Page

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], a fictional recurring Friday techno night at [VENUE], [ADDRESS], [CITY]. This is an original acid poster with usable local audio and planning tools.

- Audience: Adult electronic music listeners checking the sound, access and door rules before making a plan.
- Goal: Audition an original bundled loop, inspect set times and venue zones, build a local ticket estimate and understand the strict demo-only door policy.
- Tone: Direct, underground and typographically loud; practical details are calm and specific.

## Stack
- Framework: Vite + React + TypeScript
- Styling: Vanilla CSS
- Libraries: vite (MIT), react (MIT), react-dom (MIT), typescript (Apache-2.0), @fontsource/anton (OFL-1.1), @fontsource/ibm-plex-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Set Vite base to ./ and build.sourcemap to false. Use a single src/content.ts for all editable content and fully rewrite its data for variable changes.
  - Implement responsive components and CSS tokens in src/styles.css. Bundle fonts through the listed Fontsource packages; import only the weights actually used.
  - Provide semantic native controls and keyboard/touch alternatives; implement focus-managed dialogs and local-only validated form feedback.
  - Write scripts/make-club-loop.mjs using Node fs only and run it before Vite in npm run build. Generate public/audio/circuit-loop.wav as original PCM16 mono 22050Hz, 16 beats at 132BPM (duration=16*60/132 seconds). Compose from scratch: sine kick with 100→44Hz exponential sweep every beat, 16th-note seeded noise hats with decay, snare-like filtered deterministic noise on beats 2/4, an original four-note bass pattern from D2/F2/C2/A1 with short envelope, soft saturation. No recorded samples, existing melody, licensed recording or external music. Normalize peak <=.7 with 8ms edge fade for seamless looping. Document synthesis/original composition in ASSETS.md.
  - Use one AudioContext and one media element source connected exactly once through AnalyserNode (fftSize 1024, smoothing .85) and GainNode to output. Resume/play only on deliberate Play loop gesture. Draw waveform from getByteTimeDomainData and spectrum from getByteFrequencyData; no random fake live data. Limit canvas to 30fps and smooth small scale changes; pause RAF when paused/hidden and clean up resources.

## Variables
- [BRAND] — Brand (default: "Sublevel Circuit"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [VENUE] — Venue (default: "The Relay Room"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CITY] — City (default: "Port Alder"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [ADDRESS] — Address (default: "19 Coil Passage"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/techno-club-night-event-page in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Acid green `#C6FF00` — Large hero and lineup block, dark labels. WCAG relative-luminance calculations: #080808 text on #C6FF00: 16.89:1; #FFFFFF text on #8B00FF: 5.93:1; #FFFFFF text on #080808: 20.03:1; #080808 text on #C5D0DB: 12.80:1. Use these pairs for every normal-size label/body/button. Decorative overlaps/gradients carry no text; readable text gets a solid backing.
- Electric violet `#8B00FF` — Large hero sculpture field and venue band.
- Black `#080808` — Poster base, text on acid, policy ground.
- White `#FFFFFF` — Copy on violet/black.
- Chrome `#C5D0DB` — Decorative metallic bands only; no low-contrast body copy.

### Typography
- Display: Anton (OFL), weights 700
- Body: IBM Plex Mono (OFL), weights 400/700

### Layout & motion
- Spacing: 1240px max, 40px desktop/20px mobile gutters. 8px grid, 96px/56px major spacing. Poster title 144px desktop/68px mobile in 3 deliberate lines, body 16px/1.6 monospace.
- Radius: 0px major blocks, 6px controls, 999px orbit geometry only. 2px hard rules, no translucent gradient text panels.
- Motion: Warped type is static authored skew/scale and remains real accessible text, no jitter. Large chrome rings slowly rotate only with active user playback and can be paused independently.
- Motion: Audio canvas morphs line radius at max ±10% using actual RMS/frequency data; no flashing colors or brightness oscillation. Reduced motion freezes shapes and shows track time plus a stable level value at 2Hz.
- Imagery: Entirely code-drawn original acid poster: intersecting elliptical chrome ribbons, thornless waveform loops, black geometric orbit frames on large acid/violet fields. Hero has a high-craft sound sculpture and live instrument-like UI, not typography alone. No real DJs, copyrighted poster art, identifiable venue photos, logos or existing album art. Artist entries use distinct original abstract signal emblems rather than portrait placeholders; this is an event lineup, not a team profile page.

## Pages & Sections
### [BRAND] — Feel the room find its pulse (`index.html`)
1. **Acid poster and sound preview** — Header [BRAND], Lineup, The room, Tickets, Door policy. Eyebrow 'Recurring Friday / 10 PM–4 AM / 18+'. H1 'Feel the room find its pulse.' Intro 'Six hours of focused sound. One room for moving together.' Venue [VENUE] / [CITY]. Primary 'Explore ticket options', secondary 'Read the door policy'. Sound card label 'Original bundled demo loop / 132 BPM / no vocals'. Play loop / Pause loop, volume slider default 35%, waveform/spectrum toggle, elapsed/duration, Pause visuals. Permanent note 'Audio preview only. This fictional event has no ticket sale or real announced date.' Audio starts only on explicit play; visible fallback 'Audio could not load. Try again' with retry. Canvas actual analyzer data, idle labeled 'Paused — press Play loop'.
   Layout: Hero 45% acid #C6FF00 left and 55% violet #8B00FF right over black #080808 stage; both occupy >=30% first screen. Title black on acid in Anton 144px, subtitle white on violet only where solid. Large original chrome torus/wave sculpture fills right with dark player panel white labels and acid controls. Mobile stacked poster then >=330px full-width player; shapes contained away from text.
   Motion: No idle strobe or autoplay. Sound-reactive waveform responds smoothly only to real loop playback.
2. **Lineup and running order** — Heading 'Four voices. One long arc.' Fictional artists: Mera Coil, 10–11:30 PM, 'Patient dub textures and a low, elastic beginning'; Raster June, 11:30 PM–1 AM, 'Clipped percussion, bright edges, no hurry to resolve'; Tern Static, 1–2:30 AM, 'Driving low-end patterns and a pressure-release middle'; Oru Vale, 2:30–4 AM, 'Left-field turns and a closing stretch that leaves room to breathe'. Explain set times after midnight belong to the same running order; show no calendar date. 'Artist note' opens local modal with 70-word original fictional bio and musical approach, not real performers. 'Add to my running order' toggles bookmark, persists locally; Saved only filter with count and clear action. No fake external artist socials or streaming links.
   Layout: Acid #C6FF00 full section with black #080808 body. Four horizontal table rows, huge outlined index, time in opaque black/white tag, abstract violet #8B00FF signal emblem, strong top rules. Mobile each row becomes vertical time/name/note with all actions visible.
   Motion: Hover/focus line shifts 3px and gives underline; no continuous marquee.
3. **The room before the room** — '[VENUE], mapped simply.' Address [ADDRESS], [CITY], a fictional demo location. Original SVG schematic with five selectable zones Entrance / Main floor / Water point / Quiet room / Step-free route. Entry at bottom left; main floor center; water right; quiet room top left; step-free route a dashed path from entrance to each room with explicit legend. Buttons outside SVG select same zones for keyboard/touch. Details: Entrance 'ID check before admission; keep a photo ID ready'; Main floor 'Dance area; no filming with flash'; Water point 'Free refill point in this fictional venue plan'; Quiet room 'A lower-volume room away from the main floor'; Step-free route 'Illustrative route, 1.2m minimum drawn width; this diagram is not verified access information for a real building'. Add 'Access questions need real venue confirmation before a real visit'. Travel note 'Fictional district tram stop: Coil Yard, two blocks south' clearly marked demo, no external map.
   Layout: Violet #8B00FF band with white #FFFFFF copy. Schematic black #080808 field, acid #C6FF00 selected zone with black labels; unselected zones white outline/white labels. 60/40 map/details, mobile map responsive viewBox and text below, no tiny hover-only hotspots.
   Motion: Selecting zone outlines and updates text; no zoom animation.
4. **Tickets as a local plan** — Heading 'Choose how you arrive.' Illustrative tiers: Early arrival $18, enter before 11 PM; Standard $24, any time after doors; At the door $30, shown for comparison only. All adult 18+, no real availability, no ticket sale. Tier buttons choose radio and open local drawer; quantity 1–6; line items tier×quantity, no fees, total. Checkboxes 'I understand the 18+ photo-ID rule' and 'I have read the door policy' required for 'Save local ticket plan'. Confirm in drawer 'Saved on this device only. No ticket, entry reservation, payment or message was created.' localStorage stores tier/qty/checked policy with Reset plan. 'At the door' is a planning option, not a promise of stock. Plan never grants admission. Close/edit/remove controls functional.
   Layout: Black #080808 section with white #FFFFFF headings; 3 large ticket panels alternate acid #C6FF00/black type, violet #8B00FF/white, chrome #C5D0DB/black. Drawer white on black and selected acid controls, 44px targets; mobile 1col tickets.
   Motion: Drawer slides max 220ms except reduced motion instant; proper trap/restore focus and scroll lock.
5. **Door policy and practical questions** — Strict policy card: '18+ only. Bring original government-issued photo ID.' 'Consent is not optional. Harassment, intimidation and discriminatory behavior are not welcome.' 'No weapons, illegal substances, outside drinks or large bags.' 'No flash photography. Leave room for other people.' 'Respect floor staff and the lower-volume room.' 'This demo sells no entry and cannot enforce real-world safety; a real organizer must publish and maintain its own policy.' FAQ: 'Can I leave and return?' — Illustrative policy: no re-entry; confirm with a real operator before a real event; 'Is the audio a real recording?' — It is an original synthesized demo loop bundled locally, not a performer set; 'Can I buy tickets here?' — No, save a local plan only; 'Does this announce a real night?' — No, all performers, venue and address are fictional. Footer [BRAND], [VENUE], local demo note and Back to poster. No year/date.
   Layout: Acid #C6FF00 policy slab with black #080808 text and bold 32px rules. FAQ below black with white text and violet #8B00FF/white question bars, two columns desktop and one mobile. Decorative chrome keyline stays away from text.
   Motion: Static policy always visible, FAQ native details.

## Assets
- font: Self-host Anton, IBM Plex Mono using the Fontsource packages listed in Stack; OFL-1.1, no external font requests.
- image: Original code-drawn chrome ribbons, orbit geometry, acid poster ornaments, artist signal emblems and fictional SVG venue schematic. Original project artwork, no existing nightclub poster or real performer photograph. List local files and original authorship in ASSETS.md.
- image: Audio instructions (schema has no audio kind): synthesize public/audio/circuit-loop.wav from original code during npm run build exactly as Stack specifies, PCM16 mono 22050Hz, sixteen beats at 132BPM. No external recording, sample, existing melody or copyright music. Record script, WAV path, synthesis method and original composition/redistribution in ASSETS.md.

## Don'ts
- Build a static-only demo: no backend, API routes, databases, authentication, payments, third-party APIs, analytics, telemetry, or forms that send network requests. Confirmations must explicitly say local demo; never claim an order, booking, generated service result, or email was sent.
- Use Vite base ./, relative local assets, hash routes or real .html filenames; no bare-directory links. Direct-open every route and ensure any detail route without an ID renders its first item. Build minified dist/ with npm run build, no source maps or source files, total dist under 20 MB.
- Keep all editable copy, fictional sample data, prices, interaction labels, alt text and A/B content in a single src/content.ts module. Keep 3–6 variables. When variables change, rewrite all related content consistently; never leave the default brand or subject in the second case.
- All visible language and alt text use US English. Do not render calendar dates, years, dated copyright lines, fake freshness or popularity metrics. Operational weekdays and times, track durations, relative timers, issue identifiers and dimensions are permitted.
- Use only original code/art/copy, permissive MIT/ISC/BSD/Apache/CC0 dependencies and locally bundled OFL fonts. No copied site code, existing logos, famous characters, commercial fonts, restricted components or recognizable real-person likeness. List every font, dependency and generated artwork in ASSETS.md with source and license.
- Everything is local at runtime: no hotlinked pictures, font CDNs, remote scripts, remote music or placeholder-image services. Download exactly the specified template-hosted images before build; record full source URL, target path, alt text and generated credit in ASSETS.md.
- At 1440×900 and 390×844 keep zero console errors and no horizontal overflow. Touch targets at least 44px, visible keyboard focus and labeled inputs, Escape/outside close and focus restore for dialogs, drawer focus trap, scroll lock and aria-live for result changes. Hover effects need equivalent focus/tap paths.
- Respect prefers-reduced-motion: remove looping transforms, scroll scrub and parallax, show final static states, never autoplay audio/video, no flashing, strobe or rapid full-screen luminance changes. Do not hide essential content pending animation.
- Preserve the assigned palette with at least two strong hero colors occupying large areas. No neutral cream/charcoal fallback, no gradients behind normal text, no low-contrast small labels. Use the calculated AA text/background pairs in Design.
- No strobe, flash, high-contrast brightness pulsing, autoplay, fake analyzer data, remote music, sampled track or real artist name. The loop is original build-time synthesis and real playback must drive all sound-reactive movement.
- No calendar dates or announced real event; recurring Friday and operational set times are allowed. No false safety guarantee, real availability, real map/verified access claim, ticket receipt, payment, checkout or email collection. Local ticket plans must say they grant no admission.
- For Phase Assembly completely rewrite the fictional lineup names/bios/set order, ticket prices, venue-zone notes and welcome copy for The Copper Vault in West Briar. Use the same acid/violet/chrome structure and original local sound architecture; no default event, venue or address remains.

---
— Prompt by VibeFather · https://vibefather.ai/t/techno-club-night-event-page · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
