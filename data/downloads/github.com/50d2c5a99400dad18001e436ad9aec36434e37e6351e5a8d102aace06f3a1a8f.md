# Interactive Synth Web Toy

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
[BRAND] is a one-page synthesizer you play in the browser. The instrument is the first screen: a wide live waveform scope, a strip of voice and transport controls, a 16-step pattern grid and a 25-key keyboard, all visible and playable at 1440x900 with no marketing section ahead of them. Every sound is synthesized live with the Web Audio API. Pattern, tempo, voice and tone are stored in the URL hash, so a copied link plays exactly what was made.

- Audience: [AUDIENCE], plus anyone who follows a link a friend sent. Nobody needs to know music theory: every grid note sits in one scale, so any pattern sounds fine.
- Goal: Get a visitor making sound within five seconds, then get them to light a few pads and send the link to someone. The toy has no sign-up, no pricing and no sales section.
- Tone: Like a small lit-up machine on a dark desk: playful, tactile and direct. Labels are short and silk-screened in uppercase mono. Sentences are plain and never explain what a synthesizer is.

## Stack
- Framework: Vite 5 + vanilla TypeScript
- Styling: Plain CSS
- Libraries: vite (MIT), typescript (Apache-2.0), lucide (ISC), @fontsource/unbounded (OFL-1.1), @fontsource/jetbrains-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - package.json scripts: dev runs vite, build runs tsc --noEmit && vite build. Use TypeScript in strict mode.
  - vite.config.ts sets base: './' and build.sourcemap: false, with no other plugins.
  - Files: index.html, public/favicon.svg, src/main.ts (wiring), src/content.ts (all visible copy and the variable values), src/presets.ts (voices, grid notes, starter patterns), src/audio.ts (engine), src/sequencer.ts (clock and pattern state), src/scope.ts (canvas), src/hash.ts (URL state), src/ui.ts (DOM, keys, pads, knobs), src/styles.css. When variable values change, rewrite the copy in src/content.ts to fit them.
  - Create one AudioContext lazily, on the first user gesture (pointerdown, touchend or keydown), and call resume() on it on every later gesture while its state is suspended. A note that triggers the start must still sound, so await resume() before starting that note. If window.AudioContext is missing, show 'This browser has no Web Audio.' in the scope and keep the grid editable.
  - Signal chain: each voice goes oscillators > per-voice gain envelope > per-voice BiquadFilter (lowpass) > voiceBus gain. voiceBus goes to a DynamicsCompressor (threshold -14, ratio 6) and also to a send: DelayNode (time = 3 sixteenth notes at the current tempo) > feedback gain 0.28 back into the delay > wet gain 0.16 > compressor. Compressor > masterGain > AnalyserNode (fftSize 2048) > destination.
  - Master volume: masterGain = (volume / 100)^2 * 0.9. Filter cutoff for a note = preset cutoff * 2^((tone - 60) / 30), clamped to 20000 Hz. Note frequency = 440 * 2^((midi - 69) / 12), with the preset transpose added to midi.
  - In src/presets.ts define exactly three voices, in this order, named from [VOICE_NAMES]. Voice 0: triangle at -7 cents plus sine at +7 cents, both gain 1, attack 0.18, decay 0.4, sustain 0.7, release 0.9, peak 0.2, cutoff 1800 Hz, Q 0.7, transpose 0, gate 1.5 steps. Voice 1: square at 0 cents gain 1 plus square at +6 cents gain 0.5, attack 0.005, decay 0.12, sustain 0.45, release 0.12, peak 0.16, cutoff 3600 Hz, Q 3, transpose 0, gate 0.9 steps. Voice 2: sawtooth at 0 cents gain 1 plus sine at -1200 cents gain 0.8, attack 0.004, decay 0.18, sustain 0.5, release 0.08, peak 0.3, cutoff 700 Hz, Q 5, transpose -24, gate 0.9 steps, and the filter starts at 3x cutoff and ramps down to cutoff over 0.18 s.
  - Envelope: at note start use setValueAtTime(0), linearRampToValueAtTime(peak) over attack, then linearRampToValueAtTime(peak * sustain) over decay. At release use cancelScheduledValues, set the current value, then setTargetAtTime(0, t, release / 3), stop the oscillators at t + release + 0.1 and disconnect them in onended. Cap at 12 live voices and steal the oldest.
  - Grid notes are fixed in src/presets.ts, C minor pentatonic, row index 0 at the bottom: C4, D#4, F4, G4, A#4, C5, D#5, F5 (midi 60, 63, 65, 67, 70, 72, 75, 77). Bit i of a step byte means row i is on, so a pattern is 16 bytes, written as 32 lowercase hex characters.
  - Starter patterns, named in order from [PATTERN_NAMES]. Pattern 0: 09002000100800201200402000081000 at 112 BPM with voice 1. Pattern 1: 01010008000104000100100800020400 at 138 BPM with voice 2. Pattern 2: 290000008000400052000000a4002000 at 76 BPM with voice 0. Tone is 60 for all three. Pattern 0 loads on a first visit with no hash, and the page is stopped until the visitor acts.
  - Sequencer clock (look-ahead scheduler): a setInterval every 25 ms schedules every step whose time falls within currentTime + 0.12 s. Step length = 60 / bpm / 4 s. Oscillators start at the exact scheduled time. Push each scheduled step and time onto a queue; a requestAnimationFrame loop running only while playing reads the queue and moves the playhead when currentTime passes that step's time. If the timer falls behind by more than the look-ahead (a hidden tab), jump the next step time to currentTime + 0.05 s and do not fire a burst of catch-up notes.
  - URL hash format: #v=1&p=<voice 0-2>&b=<bpm 60-180>&n=<tone 0-100>&g=<32 hex>. Parse with URLSearchParams. Write with history.replaceState on every pad edit, Clear, starter load, voice change, tempo change and tone change, never on load. Read it on load and on hashchange. Clamp out-of-range numbers. If g is not 32 hex characters, load pattern 0 with no error. Volume stays out of the hash.
  - Release all held notes on window blur, on visibilitychange and on pointercancel so no note can stick.

## Variables
- [BRAND] — Toy name (default: "Moonbleep"). Shown as the wordmark, page title and footer.
- [TAGLINE] — One-line tagline (default: "Sixteen steps, three voices, one link to send a friend."). Shown beside the wordmark. Keep it under 75 characters.
- [VOICE_NAMES] — Three voice names (default: "Velvet Pad, Pixel Lead, Gravel Bass"). Comma-separated, in order: soft, bright, low. Only the names change, not the sound.
- [PATTERN_NAMES] — Three starter pattern names (default: "Night Tram, Tin Rain, Slow Comet"). Comma-separated, in order: medium groove, fast bass, slow chords.
- [AUDIENCE] — Who it is for (default: "people who have never touched a synth"). Finishes the footer sentence 'made for ...'.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/interactive-synth-web-toy in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Chassis `#0D0618` — Page background and the dark text on bright fills
- Panel `#1A0D2E` — Module panels: scope frame, transport, grid, keyboard
- Raised `#2A1648` — Off controls, knob tracks, scope graticule lines
- Key violet `#3B2170` — Top of the natural key gradient, knob cap highlight
- Line `#5B3A91` — 1px panel, pad and key borders
- Hot magenta `#FF2BD6` — Hero color: wordmark start, Play button, voice 1 accent, trace start
- Electric cyan `#19F0FF` — Hero color: wordmark end, Copy link button, voice 0 accent, playhead
- Volt `#C8FF2E` — Voice 2 accent, third notes card heading
- Lilac text `#F3E8FF` — Body text, readouts, key hints
- Silk `#B9A6DC` — Silk-screened uppercase panel labels (passes AA on Panel)

### Typography
- Display: wordmark, notes headings, voice and button labels: Unbounded (OFL), weights 600/800
- Text and readouts: panel labels, tagline, key hints, notes body, numbers: JetBrains Mono (OFL), weights 400/500/700

### Layout & motion
- Spacing: 4px base. Page padding 14px at desktop and 16px gutter on mobile. 10px gap between panels. Panels have 10-12px inner padding. At 1440x900 the instrument fills 100dvh in a CSS grid with these rows: top bar 48px, scope minmax(200px, 1fr), transport 76px, sequencer 273px, keyboard 190px, so nothing scrolls until the notes section. Breakpoints: 1100px and up is this desktop layout; 720-1099px wraps the transport to two rows and lets the page scroll; under 720px is the stacked mobile layout.
- Radius: Panels 14px. Step pads 5px. Buttons and voice segments 10px. Starter chips full pill. Keys are square on top with 8px bottom corners. Play button and knobs are circles.
- Motion: Active accent: set --accent and --accent-2 on the root by voice. Voice 0: cyan, magenta. Voice 1: magenta, cyan. Voice 2: volt, magenta. Colors transition over 180ms when the voice changes.
- Motion: Keys press in 60ms: translateY(2px), the bottom lip collapses, fill turns --accent, box-shadow 0 0 24px of --accent at 60%. Release takes 120ms.
- Motion: When the playhead fires a lit pad it scales to 1.06 and brightens its glow for 120ms, and the matching on-screen key lights for the note length.
- Motion: Beat LED in the transport flashes for 80ms on steps 1, 5, 9 and 13 while playing.
- Motion: Under prefers-reduced-motion: no scale, translate or glow pulses and no color transitions. The scope draws one static trace. The playhead still steps, because that is state, and colors still change instantly.
- Imagery: No photos, no illustrations and no sample files. Every visual is drawn in code: the Canvas 2D scope, CSS keys, SVG knobs, inline SVG waveform glyphs. The page background is #0D0618 with two fixed radial glows: rgba(255,43,214,.16) at the top left and rgba(25,240,255,.12) at the bottom right. Panels carry 1px Line borders, an inset top highlight of rgba(243,232,255,.06) and four 6px CSS screw dots in their corners on desktop. The panel is a generic invented layout and does not resemble any real instrument.

## Pages & Sections
### [BRAND] (`index.html`)
1. **Top bar** — Left: wordmark [BRAND] in Unbounded 800 at 22px with a horizontal gradient text fill from #FF2BD6 to #19F0FF, then [TAGLINE] in JetBrains Mono 400 13px Lilac text. Right: shortcut hint in Silk 'SPACE PLAY / Z X OCTAVE', shown only at 1100px and up, then the audio status: an 8px round LED plus the label 'AUDIO OFF', which becomes 'AUDIO ON' once the AudioContext is running (LED dim Line color, then glowing --accent).
   Layout: One row, height 48px, no panel background, space-between. Under 720px the tagline moves to a second line and the shortcut hint is hidden.
2. **Scope** — The hero: a live waveform on a graticule. Silk labels inside the frame. Top left: 'SCOPE' and the active voice name. Top right: '112 BPM' and 'STEP 05/16', or 'STOPPED' when not playing. Bottom left: the last sounding note and frequency such as 'G4 392 HZ', or '-- --' before any note. Start state, centered on the scope and removed after the first gesture: first visit shows the line 'Sound starts on your first tap.' with a button 'Start sound' and the hint 'or press A'. A visit that opened with a valid hash shows 'This link holds a pattern.' with a button 'Play it', which starts the audio and the sequencer. 'Start sound' plays one short C5 in the active voice so the visitor hears it worked. Nothing sounds before a gesture.
   Layout: Full-width panel filling the free grid row. Background #0A0414 with a soft radial wash of --accent at 10% in the center. A <canvas> fills it, sized with ResizeObserver and devicePixelRatio. The graticule is a CSS background behind the transparent canvas: 16 vertical and 6 horizontal 1px lines in Raised, with a slightly brighter center line. 132px tall on mobile.
   Motion: Each animation frame: clearRect, read getByteTimeDomainData, find the first rising crossing of 128 in the first half of the buffer and draw from there so the wave stands still instead of drifting. Stroke twice with a horizontal linear gradient from --accent to --accent-2: first 7px wide at 25% alpha, then 2px at full alpha. In silence the data sits at 128, so it rests as a flat glowing line, and before the AudioContext exists it draws that same flat line. Under prefers-reduced-motion do not run this loop: draw one static trace of three cycles of the active voice's wave shape (rounded for voice 0, square for voice 1, saw for voice 2) at 55% of the height, and redraw it on voice change and resize.
3. **Transport strip** — Left to right. (1) Round 52px Play button, #FF2BD6 fill with #0D0618 Lucide Play icon; while playing it turns #19F0FF with a Square icon; aria-label 'Play' or 'Stop'. (2) Beat LED. (3) Ghost button 'Clear' with the Eraser icon, wipes the grid. (4) Silk label 'VOICE' and a three-part segmented control with the names from [VOICE_NAMES], each with a small inline SVG glyph of its wave (rounded, square, saw); the selected part is filled --accent with #0D0618 text; role radiogroup. (5) Silk label 'START' and three pill chips with the names from [PATTERN_NAMES]; a chip loads that grid, tempo and voice and keeps playing if already playing; a chip is outlined in --accent-2 while the grid and tempo match it exactly. (6) Three knobs: TEMPO 60-180 default 112 with readout in BPM, TONE 0-100 default 60, VOLUME 0-100 default 70. (7) 'Copy link' button, #19F0FF fill, #0D0618 text in Unbounded 600 12px, Lucide Link icon: writes the hash, copies location.href, and for 1.6 s shows 'Copied' with the Check icon. Wrap the clipboard call in try/catch; if it is refused or unavailable, show a read-only input holding the URL, selected, with the label 'Copy this link'. Announce through an aria-live region.
   Layout: Full-width panel, 76px tall at desktop, one flex row with 14px gaps and 1px Line dividers between groups. Knobs are SVG, 52px, a 270 degree arc from -135 to +135: track stroke Raised 5px, value arc --accent 5px with round caps, center disc radial gradient from #3B2170 to #1A0D2E, 2px Lilac pointer line. Label and readout sit to the right of each knob, stacked. Mobile order: row 1 Play, Clear, Copy link; row 2 voice control full width; row 3 chips; row 4 three knobs evenly spaced with label and readout under each.
   Motion: Knob: role slider with aria-valuemin, aria-valuemax and aria-valuenow, tabindex 0. Vertical pointer drag with pointer capture, 100px covers the full range, Shift for quarter speed. touch-action: none. Arrow keys step 1, PageUp and PageDown step 10, double-click resets to default. The value arc follows the pointer with no easing.
4. **Step sequencer** — Silk header 'PATTERN' with a row of step numbers 1-16 above the columns (1, 5, 9, 13 in Lilac text, the others Silk). Eight rows of pads, top row F5 down to bottom row C4, each row labeled with its note name in mono 11px. Each pad is a <button> with aria-pressed and aria-label such as 'Step 5, note G4'. Any number of notes may sound on one step. Keyboard shortcut: Space toggles play and stop unless focus is on a button or input.
   Layout: Full-width panel. Structure: two .bar blocks, each with two .beat groups of four step columns. Pad gap 3px, gap between beat groups 14px, gap between bars 14px, so spacing marks every 4 steps. Pads stretch to fill the width and are 26px tall on desktop. Row labels are on the left of the first bar only. Off pad: #241244 with a 1px #4A2C78 border; the first column of each beat group is #2E1A58. On pad: --accent fill with box-shadow 0 0 12px of --accent. Under 720px the two .bar blocks stack vertically, each with its own row labels, its 8 columns about 37px wide and rows 28px tall, so all 16 steps stay visible without sideways scrolling.
   Motion: Playhead: a 2px --accent-2 bar above the current column, and off pads in that column tint with --accent-2 at 28%. Click or tap toggles a pad. With a mouse or pen, holding and dragging paints every pad crossed with the state of the first pad; touch is tap only so the page can still scroll. The URL hash updates on every change.
5. **Keyboard** — Silk header 'KEYS' with octave controls at its right: Lucide Minus button, readout 'OCT 0', Lucide Plus button, range -2 to +2 (Z and X do the same). 25 keys C4 to C6, shifted by the octave. Computer keyboard map using event.code, shown as small key-cap hints on the keys: A=C4 W=C#4 S=D4 E=D#4 D=E4 F=F4 T=F#4 G=G4 Y=G#4 H=A4 U=A#4 J=B4 K=C5 O=C#5 L=D5 P=D#5 ;=E5 '=F5. The remaining keys have no hint. Hints are hidden with @media (hover: none). A small dot on each key in the grid's scale (C, D#, F, G, A#) tells players which keys fit the pattern. C keys show their note name. Ignore key events with event.repeat or Ctrl, Cmd or Alt held, and while focus is in an input. Under 720px a Silk line reads 'Swipe for more keys'.
   Layout: Full-width panel. Desktop: 15 natural keys stretch evenly across the width and 160px tall. Natural key: vertical gradient #3B2170 to #241244, 1px Line border, 6px bottom lip in #160A2A, 8px bottom corners. Sharps: absolutely positioned between naturals, 58% of a natural's width, 62% of its height, gradient #0D0618 to #1A0D2E, 3px top edge in --accent-2 at 70%. Under 720px: naturals 52px wide and 152px tall inside a horizontally scrolling container with touch-action: pan-x, starting at C4. Mobile order puts this panel above the sequencer, using CSS order.
   Motion: Track each pointerId separately so several fingers play chords. With a mouse held down, moving onto another key releases the old note and plays the new one. Key lights also follow notes fired by the sequencer when that pitch is on screen.
6. **Panel notes** — Below the instrument, three short cards. 'Play it': 'Hold A through ; for the white keys and W, E, T, Y, U, O, P for the black ones. Z and X move the octave. Any key with a dot stays in the scale the grid uses, so it fits over whatever is running.' 'Loop it': 'Eight pitches, sixteen steps, one scale. Click to light a pad, drag to paint a run, press Space to start and stop. Tempo runs from 60 to 180 BPM.' 'Send it': 'Every pad you light rewrites the address bar. Copy the link and whoever opens it gets the same pattern, tempo, voice and tone. Nothing is stored anywhere: the whole loop lives in the URL.'
   Layout: Three equal columns on desktop with 10px gaps, one column under 720px. Each card is a Panel with a 3px top border (magenta, cyan, volt in order), padding 28px, heading in Unbounded 800 clamp(24px, 2.4vw, 34px) in the matching color, body in JetBrains Mono 400 15px, line-height 1.65, Lilac text.
7. **Footer** — '[BRAND] is made for [AUDIENCE]. No account, no download, no samples: every sound is synthesized in your browser.' The [CREDIT] link, when kept, sits at the right.
   Layout: One row of JetBrains Mono 400 13px in Silk, padding 24px 14px, wrapping to two lines on mobile.

## Assets
- image: None downloaded. All visuals are drawn in code. public/favicon.svg is hand-written: a #0D0618 rounded square with one wave stroke using a #FF2BD6 to #19F0FF gradient. List lucide, Unbounded and JetBrains Mono in ASSETS.md at the project root with path, source URL, author and license, and note there that the project has no third-party images and no audio files.
- icon: Lucide (ISC) from the lucide npm package, imported individually and rendered as inline SVG: Play, Square, Eraser, Link, Check, Minus, Plus. Waveform glyphs and knobs are hand-drawn inline SVG.
- font: Self-hosted through @fontsource/unbounded (600, 800) and @fontsource/jetbrains-mono (400, 500, 700), both OFL-1.1, imported in src/main.ts.

## Don'ts
- No backend, server code, API routes, database, auth, forms that submit anywhere or third-party APIs. All state lives in memory and the URL hash.
- No CDN script or link tags, no fonts.googleapis.com or fonts.gstatic.com, no analytics. Fonts, icons and scripts are all bundled locally.
- No source maps, and no src/ copied into dist/. Use relative asset paths with Vite base './'. Keep dist/ under 20 MB.
- Internal links point to file names such as ./index.html, never to a bare directory.
- No autoplay: no sound and no AudioContext before a user gesture.
- No console errors at 1440x900 or 390x844, including when clipboard access is refused or the hash is malformed.
- Do not ignore prefers-reduced-motion.
- No audio libraries, no audio files and no samples. Every sound is synthesized live with Web Audio oscillators; nothing is taken from commercial instruments, sample packs or drum machines.
- No logos, badges or model names of real synth and drum machine makers.
- Do not recreate a specific hardware faceplate or a known product's signature color scheme and panel layout.
- No recognizable melodies, riffs or basslines from existing songs. Use the starter patterns given here unchanged.
- Do not lift interface, copy, visuals or sound presets from existing browser music toys or music-learning sites.
- No restricted UI library source, no commercial fonts, no real artist names or likenesses in the copy.
- No marketing section, hero headline or tutorial modal above the instrument, and no off-white or muted neutral palette. Keep the keys violet, not white.
- Do not add sign-up, pricing, testimonials, invented user counts, or any mention of VibeFather other than the optional [CREDIT] footer link.
- Do not change the stack unless the user asks.

---
— Prompt by VibeFather · https://vibefather.ai/t/interactive-synth-web-toy · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
