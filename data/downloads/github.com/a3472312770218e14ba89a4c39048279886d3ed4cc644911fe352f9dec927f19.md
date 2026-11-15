# Typing Speed Race Game

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a complete single-page typing race for [BRAND], using the tagline [TAGLINE], the original passage collection [PASSAGE_PACK], and a deterministic ghost named [GHOST_NAME]. The visitor types passages to move a cyan car against the ghost, with live WPM and accuracy, explicit error states, three difficulty levels, local personal-best history, and a downloadable results card. Put all variable values, UI copy, difficulty definitions, and passages in src/content.ts. The default copy below is exact; when variables change, rewrite every passage and content-dependent label to fit the new values while preserving the layout, interaction model, and visual system.

- Audience: Students, typing learners, educators running short classroom challenges, developers taking a keyboard break, and casual players who want an immediate skill-based game without signing in.
- Goal: Let a visitor understand and start a race from the first screen, receive accurate and responsive typing feedback, finish a complete run, and retain a trustworthy local record and portable result card. Every control must work with static files at desktop and mobile sizes.
- Tone: Focused, energetic, and precise, like a friendly race-control console. Use short motorsport language without aggression, branded sponsorship, fake online competition, or exaggerated claims.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Vanilla CSS
- Libraries: react (MIT), react-dom (MIT), lucide-react (ISC), @fontsource/chakra-petch (OFL-1.1), @fontsource/ibm-plex-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Use one index.html entry and a React application in src/. Set vite.config.ts base to './' and build.sourcemap to false. Keep TypeScript strict and ship only the production dist/ directory.
  - Create src/content.ts as the single source for [BRAND], [TAGLINE], [PASSAGE_PACK], [GHOST_NAME], navigation labels, instructions, result messages, difficulty settings, and all passages. Provide two original passages per difficulty for the default passage pack and cycle to the other passage on Next passage.
  - Use difficulty settings Easy = 30 ghost WPM, Medium = 45 ghost WPM, and Hard = 60 ghost WPM. Easy passages use everyday words and minimal punctuation; Medium passages add clauses and commas; Hard passages include numbers, mixed punctuation, and a few symbols. Do not change the ghost speed based on the player.
  - Model the run as idle, countdown, racing, paused, and finished states. Use performance.now() for elapsed active time, exclude paused and hidden-tab time, and keep all scoring logic in pure TypeScript functions separate from the canvas renderer.
  - Use one Canvas 2D scene for the track, cars, start lights, and share-card artwork. Cap canvas device pixel ratio at 2, resize with ResizeObserver, and do not add a graphics or physics dependency.
  - Install and bundle only the listed libraries and fonts. Import Chakra Petch weights 500, 600, and 700 and IBM Plex Mono weights 400, 500, and 600 from their Fontsource packages.
  - Store only completed runs and per-difficulty personal bests in localStorage under a versioned [BRAND]-specific key. Validate parsed data, recover safely from unavailable or malformed storage, and keep a maximum of ten recent runs.

## Variables
- [BRAND] — Game brand (default: "Keyway Circuit"). An invented two- or three-word racing name used in the header, results, share card, local storage namespace, and download filename.
- [TAGLINE] — Race tagline (default: "Outtype the echo."). A short original invitation that appears below the brand and on the result card.
- [PASSAGE_PACK] — Passage collection (default: "Night Drive"). The writing theme for all six passages and the small collection label above the typing console.
- [GHOST_NAME] — Ghost opponent name (default: "Echo"). A short invented non-human opponent label; the interface always explains that this is a target pace, not another person.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/typing-speed-race-game in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Night Ink `#080B18` — Page background and deepest track areas.
- Track Blue `#111A33` — Console and canvas panel surfaces.
- Electric Cyan `#37E6F5` — Player car, correct characters, primary controls, and live race position.
- Signal Coral `#FF536B` — Error characters, countdown lights, curb stripes, and the strong secondary hero color.
- Lap Gold `#FFC857` — Ghost car, personal-best marks, and finish-line accents.
- Pit White `#F4F7FF` — Headings and primary body copy.
- Telemetry Gray `#A8B3CF` — Secondary copy and upcoming characters; maintain AA contrast on Night Ink and Track Blue.
- Lane Grid `#2A3858` — Borders, lane marks, table rules, and inactive control outlines.

### Typography
- Display, controls, and section titles: Chakra Petch (OFL), weights 500/600/700
- Typing passage, timers, statistics, and data labels: IBM Plex Mono (OFL), weights 400/500/600

### Layout & motion
- Spacing: Use an 8px base unit. The desktop content maximum is 1440px with 32px side gutters and 24px panel gaps; mobile gutters are 16px with 12px gaps. Keep the header 64px high on desktop and 56px on mobile. Cockpit panels use 24px desktop padding and 16px mobile padding. Lower sections have 64px desktop and 40px mobile vertical spacing.
- Radius: Use clipped 14px corners on the two main cockpit panels, 6px on buttons and difficulty tabs, and 2px on stat cells. Use fully rounded shapes only for tiny live-status dots and the current-position marker, not for generic floating cards.
- Motion: On Start race, show a centered 3, 2, 1, GO sequence at 650ms per step with a 160ms opacity and scale transition; input remains disabled until GO.
- Motion: Move cars strictly from race progress. Smooth visual interpolation may take 100ms, but it must never change the underlying progress or result. The ghost is calculated from active elapsed time, not random animation.
- Motion: Pulse the current-character caret every 800ms and give a newly incorrect character one 120ms horizontal nudge. Never shake the whole console.
- Motion: Reveal the inline results panel with a 220ms opacity and 12px vertical transition, then move focus to its heading. Do not use an unsolicited modal.
- Motion: With prefers-reduced-motion, remove countdown scaling, caret pulsing, nudges, smooth scrolling, and interpolation. Update essential car positions without decorative tweening and show all state changes immediately.
- Imagery: All visuals are original and drawn in code. The hero canvas shows a top-down two-lane straight circuit at night, cyan and coral curb lights, a checkered finish stripe, and two unbranded geometric cars made from simple trapezoids, rectangles, and small circular wheels. Use layered lane markers and tiny pit-light details to make the scene rich at first glance. The player's car is Electric Cyan and the ghost is Lap Gold. Do not use photographs, vehicle-brand silhouettes, mascots, people, generated images, or downloaded game art.

## Pages & Sections
### Typing race cockpit, results, and local records (`index.html`)
1. **Header and playable race cockpit** — Header: a small original checkered-line mark, [BRAND] in Chakra Petch 700, and [TAGLINE] in smaller Telemetry Gray text. Right-side anchors read Race, Records, and How to race and point to ./index.html#race, ./index.html#records, and ./index.html#how-to-race. A compact Local play status reads Saved on this device. On mobile, keep the brand and a How to race anchor; do not hide gameplay behind a menu.

Race cockpit: a small overline reads [PASSAGE_PACK] / TYPING CIRCUIT. The visible instruction is Type the passage. Correct characters move your car. Backspace fixes an error. Three difficulty tabs read Easy · Ghost 30 WPM, Medium · Ghost 45 WPM, and Hard · Ghost 60 WPM; Medium is selected initially. Next passage cycles through the two passages for that level while idle or finished. Difficulty changes and Next passage are disabled during an active run; Restart race is always available after countdown begins.

The canvas labels the cyan lane YOU and the gold lane [GHOST_NAME] · TARGET PACE. Both cars begin at the left starting line. A live position caption reads Level pace before the race, You lead while ahead, Ghost leads while behind, and Photo finish when progress is equal. This is always a mathematical pace comparison, never a simulated person.

Below the canvas, three equal stat cells show WPM, ACCURACY, and TIME. Initial values are 0, 100.0%, and 0:00.0. Live WPM is (number of correct characters in the current matching prefix / 5) divided by active elapsed minutes, rounded to a whole number. Accuracy is correct printable-character entries divided by all printable-character entries × 100, shown to one decimal; Backspace does not count as a printable entry. A corrected mistake remains in the entry-based accuracy denominator.

The typing console uses a single native text input that is visually positioned offscreen but remains focusable and accessible, never display:none. Set autocapitalize='none', autocomplete='off', autocorrect='off', and spellcheck='false'. Clicking the passage or Tap to type focuses it and opens the mobile keyboard. Do not intercept operating-system or browser shortcuts. Ignore paste and drop input. Compare input with the passage one Unicode code point at a time: matching characters are cyan, the next expected character has a bright underline caret, and the first mismatch has a coral background with the expected character visible. Allow only one unresolved mismatch; further printable input is blocked until Backspace removes it. Player progress is the matching-prefix length divided by passage length.

After GO, the active timer begins on the first printable input. Ghost progress is min(1, activeElapsedSeconds × ghostWpm × 5 / 60 / passageLength). If the ghost reaches the finish first, show Ghost reached the line — keep typing but allow the player to finish. Pause race and document visibility loss freeze both player timing and ghost progress; Resume race continues without counting paused time. Finishing requires the entire passage to match exactly.

Primary buttons are Start race, Pause race or Resume race when applicable, Restart race, and Tap to type on touch devices. Use a confirmation second click only when Restart would discard a run with progress. Include the helper line No sign-in. No online opponents. Your records stay in this browser.

Default Easy passage 1: The street is quiet before the signal turns green. Cool air moves through the open window. Your hands settle over the keys as the first lane lights appear ahead. Keep your eyes on the words, find a steady rhythm, and let every clean sentence carry you toward the finish.

Default Easy passage 2: A silver moon hangs above the empty avenue. The road curves past dark windows and sleeping gardens. There is no need to hurry at the beginning. Relax your shoulders, breathe evenly, and trust the small movements of your fingers. Smooth typing will always take you farther than a rushed start.

Default Medium passage 1: At the edge of the city, the circuit glows with reflected color. Every correct word sends a pulse through the console, while a small mistake asks for patience rather than panic. Release the wrong key, step back, and repair the line. The best drivers know that control is not the opposite of speed; it is the reason speed can last.

Default Medium passage 2: Your rival holds a measured pace through the electric night. You can see the gap change with each phrase, but the track never decides the result for you. Read one word ahead, keep your movements light, and give every comma the same attention as a letter. A clean run is built from hundreds of ordinary choices made well.

Default Hard passage 1: By 02:17, the rain had polished the circuit into a mirror of cyan, coral, and gold. The telemetry read 96.8% accuracy; one careless keystroke could still undo a flawless sector. Hold the rhythm through brackets, numbers, and punctuation: (breathe) → read → respond. Precision is a sequence, not a mood, and the finish line rewards the driver who protects it.

Default Hard passage 2: Sector 3 begins where the old tramway crosses the floodlit docks. At 58 WPM, hesitation costs more than a corrected error, yet frantic typing costs both time and control. Watch the next 3 words, keep 2 light fingers near the home row, and do not chase the ghost's signal. Your own clean output is the only engine in this race.
   Layout: Place the header across the top. The race cockpit has id='race' and fills the first desktop viewport below it, with a 5/12-width canvas panel on the left and a 7/12-width typing console on the right. Difficulty tabs span the full cockpit width above both panels. The canvas panel is at least 430px high at 1440×900 and includes the instruction strip and position caption. The typing console places the three stat cells above a large passage area, with controls aligned along its bottom. Render passage text at 27px with 1.7 line height on desktop. At 390×844, stack the canvas above the console, reduce the canvas to 168px high, use 19px passage text with 1.65 line height, keep stats in three columns, and make every touch target at least 44px high. The Start race control and the beginning of the passage must be reachable without opening any overlay.
   Motion: The start lights run the specified countdown. Cars move from matching-prefix and ghost calculations only. Correct input can emit a tiny 120ms cyan tick at the active lane; an error produces only the local character nudge. No perpetual speed illusion while the player is idle.
2. **Inline race results and share card** — Keep this section hidden until a run is finished. The overline reads OFFICIAL RUN COMPLETE and the heading is Race complete. Show final WPM, final accuracy, active elapsed time, selected difficulty, and whether the player or [GHOST_NAME] reached the line first. If the final WPM exceeds the previous best for that difficulty, add a Lap Gold New personal best label; otherwise show the distance to the existing best without disparaging the player. Buttons read Race again, Next passage, Download PNG, and Copy result. Race again repeats the same passage after a countdown; Next passage loads the other passage at the same difficulty.

Generate a 1200 × 630 PNG entirely in Canvas 2D using the same Night Ink background, cyan player car, gold ghost car, coral finish stripe, local fonts after document.fonts.ready, [BRAND], [TAGLINE], final WPM, accuracy, time, difficulty, and personal-best state. Include no date, URL, QR code, portrait, or external logo. Download it as a filename derived from [BRAND], difficulty, and final WPM. Copy result copies a plain-text summary of those same actual values. If Clipboard API access is unavailable, select the text in a visible field for manual copying. Never claim the result was posted anywhere.
   Layout: Place the results directly below the cockpit as a wide Track Blue panel with a 1/3-width summary on the left and a 2/3-width miniature share-card preview on the right. Put four action buttons below the summary. On mobile, stack summary, preview, and a two-column button grid. The preview uses aspect-ratio 1200/630 and must remain fully visible without horizontal scrolling. Move keyboard focus to the Race complete heading after finishing, but do not cover the race with a dialog.
   Motion: Use the specified 220ms reveal and an optional instant scroll into view for reduced motion, otherwise a short smooth scroll. Download and copy actions show inline confirmation text for 1.5 seconds without toast animations.
3. **Personal bests and recent history** — Section overline: LOCAL RECORDS. Heading: Your personal pace. Intro: Completed runs are stored only in this browser. The personal-best grid has one row each for Easy, Medium, and Hard with columns Best WPM, Best accuracy, and Last time. Before any runs, show em dashes and the honest empty state No finishes yet. Your first completed race sets the record. Do not seed fictional scores.

Below it, Recent runs lists at most ten actual completed attempts, newest first. Each row contains a sequential run label, difficulty, WPM, accuracy, active time, passage number, and a small Personal best marker when applicable. Display no calendar dates. A Clear history button requires a second confirmation click labeled Confirm clear, then removes all runs and bests for [BRAND] and restores the empty state. If storage is unavailable, retain scores for the current page session and show Storage is unavailable; these records will last only for this visit.
   Layout: Use id='records'. The three-difficulty best table occupies the left 7/12 and the recent-run list occupies the right 5/12 on desktop, aligned at their top edges with a 24px gap. Use compact mono rows rather than separate floating cards. On mobile, stack both and make rows scroll internally only if needed; no page-level horizontal overflow. Clear history sits below the recent list and uses a coral outline rather than a dominant button.
   Motion: New records receive one 400ms gold background fade. List updates are immediate and respect reduced motion; do not animate old rows or use count-up numbers that delay the actual result.
4. **How to race and scoring notes** — Heading: Three steps to the finish. Step 01 is Pick your pace — choose Easy, Medium, or Hard; the ghost speed is shown before you start. Step 02 is Type clean — follow the caret, use Backspace on a coral error, and keep your eyes on the next word. Step 03 is Beat your record — finish the full passage, save the result locally, and download a card if you want to share it.

A compact scoring note reads WPM counts every five correct characters in the matching prefix as one word. Accuracy includes printable mistakes even after you correct them. Paused time never counts. A final line reads [GHOST_NAME] is a fixed target pace, not a live player.
   Layout: Use id='how-to-race'. Arrange the three steps as equal columns separated by thin Lane Grid rules, each with a large coral step number, Chakra Petch heading, and two concise lines. Put the scoring note in a full-width mono strip below. On mobile, stack steps vertically with numbers on the left and copy on the right.
   Motion: No scroll-jacking or staged reveal is needed. A simple 160ms border-color change on hover is sufficient.
5. **Footer** — Left: [BRAND] and [TAGLINE]. Right: Built for local play · No account · No remote leaderboard, followed by the optional [CREDIT] link. All text remains in English and all brand-dependent copy follows the variables.
   Layout: A single Lane Grid top border, 28px vertical padding, and a horizontal space-between row on desktop. Stack with 8px gaps on mobile. Do not add newsletter forms, social icons, or unrelated navigation.
   Motion: None.

## Assets
- image: No bitmap images or generated assets. Draw the night track, two original geometric cars, lane lights, checkered finish, and the 1200 × 630 result card with Canvas 2D. Keep the rendering code in the project and use no downloaded game art.
- icon: Use bundled lucide-react icons only for Play, Pause, RotateCcw, Download, Copy, Trash2, Keyboard, Flag, and ArrowRight. The checkered-line brand mark is original CSS/SVG geometry, not a Lucide or third-party logo.
- font: Self-host Chakra Petch 500/600/700 through @fontsource/chakra-petch and IBM Plex Mono 400/500/600 through @fontsource/ibm-plex-mono, both OFL-1.1. Record both packages and licenses in ASSETS.md together with lucide-react (ISC); there are no third-party media files.

## Don'ts
- Do not add a backend, API routes, accounts, databases, analytics, remote forms, third-party APIs, global leaderboards, live multiplayer, or claims that [GHOST_NAME] is a real online player.
- Do not use names, logos, slogans, mascots, layouts, passages, code, icons, sounds, tracks, or interface elements copied from existing typing games or racing franchises.
- Do not use real vehicle brands, recognizable production-car designs, sponsor markings, licensed characters, real people's likenesses, photographs, stock images, placeholder services, or downloaded game sprites.
- Do not load fonts, scripts, styles, icons, or media from a CDN or external URL. Bundle the listed packages locally and never request Google Fonts at runtime.
- Do not add dependencies beyond the listed stack, commercial fonts, restricted component source, or assets with noncommercial, share-alike, unclear, or missing licenses.
- Do not fabricate personal bests, recent runs, accuracy, WPM, online activity, or sharing success. Every statistic must come from the current run or valid local history.
- Do not allow paste, autocorrect, hidden-tab time, paused time, or animation timing to distort scores. Do not block browser shortcuts or make mobile users type into a custom non-native keyboard.
- Do not replace the playable first screen with a promotional hero, a flat typography-only scene, a generic bento landing page, or a sequence of marketing cards.
- Do not use excessive rounded cards, glassmorphism, unrelated gradients, perpetual decorative motion, scroll-jacking, or flashing effects. Respect prefers-reduced-motion.
- Do not display calendar dates in race history or on share cards. Internal ordering metadata may be stored but never shown as a front-end date.
- Do not produce source maps, copy src/ into dist/, exceed 20 MB, use bare-directory links, or require a server. Use relative assets and ensure index.html works from static object storage.
- Do not leave dead controls, empty results, console errors, horizontal overflow, inaccessible focus states, or touch targets below 44px. Verify Easy, Medium, Hard, restart, pause/resume, history clearing, PNG download, and mobile typing at 1440×900 and 390×844.

---
— Prompt by VibeFather · https://vibefather.ai/t/typing-speed-race-game · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
