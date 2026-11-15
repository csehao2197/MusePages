# How the Human Heart Works

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page interactive science explainer by [BRAND] on how [TOPIC] works. The first screen is the working diagram itself: a large code-drawn cross-section that is already moving, with the rate slider and a live trace visible without scrolling. One clock drives every moving part. The default subject is the human heart, with cobalt oxygen-poor blood and scarlet oxygen-rich blood on a deep aubergine ground, and a phosphor-green ECG sweep. If [TOPIC] is not the human heart, keep the page structure, palette, clock, trace strip, spotlight behavior and section order exactly, redraw the diagram as a fresh stylized cross-section of [TOPIC] on the same 1000 x 900 canvas, map cobalt and scarlet to the two states named in [FLOW_PATH], take the ten scroll stops from [FLOW_PATH], the slider from [RATE_CONTROL], the trace and its marks from [TRACE_SIGNAL], and rewrite all copy so that no heart vocabulary remains.

- Audience: [AUDIENCE]. They arrive from a shared link or a lesson plan, on a laptop or a phone, with no background beyond school science.
- Goal: Make one mechanism click: a reader should be able to drag the slider, watch the parts stay in time, follow the path from start to finish and explain the cycle to someone else. All copy lives in src/content.ts; when the variable values differ from the defaults, rewrite that copy to fit them.
- Tone: Clear, curious and exact, like a good teacher at a whiteboard. Short sentences and concrete verbs. No hype, no drama and no health advice.

## Stack
- Framework: Vite 5 + vanilla TypeScript
- Styling: Plain CSS
- Libraries: vite (MIT), typescript (Apache-2.0), gsap (with its ScrollTrigger plugin) (GSAP Standard License, free including commercial use), lucide (ISC), @fontsource/gloock (OFL-1.1), @fontsource-variable/hanken-grotesk (OFL-1.1), @fontsource-variable/martian-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - package.json scripts: dev runs vite, build runs tsc --noEmit && vite build. Use TypeScript in strict mode.
  - vite.config.ts sets base: './' and build.sourcemap: false, with no plugins.
  - Files: index.html, public/favicon.svg, ASSETS.md, src/main.ts (wiring and the single requestAnimationFrame loop), src/model.ts (pure timing, volume, valve and trace functions of t and rate), src/diagram.ts (a createDiagram(svg, options) factory used for every copy of the diagram), src/trace.ts (canvas sweep), src/scroll.ts (GSAP ScrollTrigger steps), src/content.ts (all visible copy and the variable values), src/styles.css.
  - Exactly one requestAnimationFrame loop exists. Each frame it advances the clock once, then updates every diagram instance, every trace and every readout from the same t. No CSS animation or GSAP timeline may drive a beating part.
  - src/model.ts has no DOM access, so a paused or stepped diagram can be drawn at any t by calling the same functions.
  - Register ScrollTrigger once with gsap.registerPlugin(ScrollTrigger). GSAP is used only for scroll triggers and section reveals.
  - Pause the loop while the tab is hidden, and clamp the frame delta to 50 ms so the clock does not jump on return.
  - Size canvases with devicePixelRatio and redraw them on resize.
  - The title tag is '[BRAND] | How [TOPIC] works'. The favicon is public/favicon.svg.

## Variables
- [BRAND] — Publisher name (default: "Cutaway Lab"). The invented studio or teacher publishing the explainer.
- [TOPIC] — Subject, in lowercase mid-sentence form (default: "the human heart"). Reads inside 'How [TOPIC] works'. Pick a machine or system with a repeating cycle and a path that something travels.
- [AUDIENCE] — Who it is for (default: "curious adults and high school biology classes"). Sets the reading level and the class prompts.
- [RATE_CONTROL] — Slider name, range and starting value (default: "Heart rate: 40–180 BPM, starting at 72"). The one number the reader can drag.
- [FLOW_PATH] — The two states and ten stops (default: "Cobalt, oxygen-poor blood: right atrium, tricuspid valve, right ventricle, pulmonary valve, lungs. Scarlet, oxygen-rich blood: left atrium, mitral valve, left ventricle, aortic valve, body."). Exactly five stops per color, in travel order. These become the ten scroll steps.
- [TRACE_SIGNAL] — The live trace and its marks (default: "Stylized ECG with P, QRS and T marks"). A signal synthesized from math, never a recording.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/how-the-human-heart-works in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Aubergine ground `#16081A` — Page background and hero ground; the text color on scarlet and phosphor fills
- Aubergine panel `#26102C` — Cards, step panels, the trace strip background
- Hairline `#4B2A55` — Borders, dividers, slider ticks
- Cobalt `#1F4BFF` — Oxygen-poor blood fill in chambers and vessels
- Cobalt wall `#0F2A9E` — Walls of cobalt vessels
- Cobalt text `#7F9CFF` — Cobalt-side text on dark grounds; light particles
- Scarlet `#FF1F3D` — Oxygen-rich blood fill in chambers and vessels
- Scarlet wall `#A80F2A` — Walls of scarlet vessels
- Scarlet text `#FF4A5E` — Scarlet-side text on dark grounds
- Muscle `#6A1B45` — Heart wall fill
- Muscle line `#8E2A5A` — Heart outline and fiber hatch
- Phosphor `#39FF88` — ECG trace, electrical spark, slider thumb, active states, primary CTA fill
- Leaflet `#FFE6D6` — Valve leaflets and hinge dots
- Lung tissue `#2A1033` — Lung fill, with a #6B4A78 outline
- Text `#F8EEF4` — Headings and body text
- Muted text `#C9B6CE` — Secondary text and captions

### Typography
- Display: H1 and section headings, sentence case, line-height 1.02. H1 is 84px on desktop and 42px on mobile; section headings are 56px and 34px.: Gloock (OFL), weights 400
- Text: body at 18px with line-height 1.6, step captions, buttons at 15px weight 600: Hanken Grotesk Variable (OFL), weights 400/500/600
- Instrument: eyebrows, diagram labels, readouts and table numbers, 12–14px uppercase with 0.08em tracking for labels; the rate readout is 64px weight 500: Martian Mono Variable (OFL), weights 400/500

### Layout & motion
- Spacing: 8px base. Page max-width 1320px with 40px gutters on desktop and 16px on mobile. Sections have 120px vertical padding on desktop and 72px on mobile. Sections are divided by a 1px #4B2A55 line, not by alternating backgrounds.
- Radius: Cards and step panels 14px. Buttons and chips are pills. The trace strip is square and runs edge to edge.
- Motion: Timing model in src/model.ts, in seconds, with t = 0 at the R peak of each beat: RR = 60 / rate; Ts = 0.16 + 0.12 * RR (systole); Td = RR - Ts (diastole); PR = 0.06 + 0.08 * min(1, RR); Tic = 0.05; Tir = min(0.07, 0.25 * Td); Tf = RR - PR - Ts - Tir (filling).
- Motion: Five phases in order: 1 Squeeze begins, 0 to Tic. 2 Ejection, Tic to Ts. 3 Relaxation, Ts to Ts + Tir. 4 Filling, Ts + Tir to RR - PR. 5 Atrial top-up, RR - PR to RR.
- Motion: Ventricle scale v: F = 0.74 + 0.22 * (1 - exp(-Tf / 0.05)) and E = F + 0.04. Phase 1 holds E. Phase 2 eases in-out from E to 0.74. Phase 3 holds 0.74. Phase 4 is 0.74 + 0.22 * (1 - exp(-tau / 0.05)), where tau is time since the phase began. Phase 5 eases out from F to E. At high rates filling is cut short, so the ventricle visibly fills less.
- Motion: Atrium scale a: 1 at all times except phase 5, where a = 1 - 0.12 * sin(pi * x) and x is progress through the phase from 0 to 1.
- Motion: Valve openness, 0 to 1. Inlet valves (tricuspid, mitral) ramp 1 to 0 over the first 0.03 s of phase 1, stay 0 through phases 2 and 3, ramp 0 to 1 over the first min(0.04, Tf) of phase 4, and stay 1 through phase 5. Outlet valves (pulmonary, aortic) ramp 0 to 1 over the first 0.03 s of phase 2, ramp 1 to 0 over the first min(0.03, Tir) of phase 3, and stay 0 otherwise.
- Motion: Trace, synthesized as a sum of gaussians A * exp(-((t' - c)^2) / (2 * s^2)), where t' is t wrapped into -RR/2 to RR/2. P: A 0.15, c -PR, s 0.025. Q: A -0.12, c -0.025, s 0.009. R: A 1.0, c 0, s 0.011. S: A -0.22, c 0.028, s 0.011. T: A 0.30, c Ts - 0.05, s 0.045.
- Motion: When the rate changes, keep the current fraction of the cycle (t / RR) so the beat never jumps. Slider input takes effect on the same frame.
- Motion: Electrical spark, using the wrapped t' of the trace: from t' = -PR - 0.02 to t' = -PR + 0.06 a 7-unit phosphor dot travels the atrial segment of the conduction line, in step with the P mark; from t' = -0.03 to t' = 0.04 it travels the septal segment and both branches, in step with QRS. The node dots flash and the line brightens from 0.25 to 1 opacity as the spark passes.
- Motion: Section reveals: headings and cards fade in and rise 16px over 0.5s via ScrollTrigger, once only. Buttons scale to 0.97 on press. Spotlight dimming transitions over 0.35s.
- Motion: prefers-reduced-motion: the clock never runs. Every diagram renders a static frame, the hero shows the frame for the mid-point of phase 2, the trace strip draws two static beats, particles are hidden, and Previous and Next buttons appear under the hero diagram to step through the five phases. Scroll steps still swap the spotlight and caption, with no transitions and the drop placed at the step's stop.
- Imagery: No photographs and no downloaded images. Everything is drawn in code as flat, confident anatomical shapes with a fine hatch on the muscle: the feel of a modern printed scientific plate, drawn fresh from the coordinates in this prompt, never traced from an atlas or textbook. For another [TOPIC], draw an equally simple cross-section on the same canvas with the same flat fills, tube walls, hatch, leaflet color and phosphor signal line.

## Pages & Sections
### How [TOPIC] works (`index.html`)
1. **Diagram specification (shared by every diagram on the page)** — Not a visible section: createDiagram builds this inline SVG with viewBox '0 0 1000 900'. The viewer faces the person, so the person's right side is on screen left. All shapes below are for the default [TOPIC]. Closed shapes are closed Catmull-Rom splines converted to cubic beziers (control points p1 + (p2 - p0) / 6 and p2 - (p3 - p1) / 6). A tube is a stroked path drawn twice with butt caps: wall color at width W, then blood color at width W - 12.

Chamber control points, each scaled about its anchor by the model scale (a for atria, v for ventricles).
RA, cobalt, anchor (332,428): 262,272 330,250 392,276 402,345 388,410 330,428 268,404 244,340.
LA, scarlet, anchor (626,404): 566,266 640,244 716,266 738,324 712,386 640,404 574,388 548,328.
RV, cobalt, anchor (350,462): 290,478 350,456 440,462 470,540 472,622 452,706 392,672 326,606 284,540.
LV, scarlet, anchor (626,450): 548,482 622,446 704,470 730,550 710,652 656,738 596,790 552,716 530,626 526,546.

Heart outline, each point tagged with the chamber it follows. It scales about that chamber's anchor by 1 - (1 - scale) * 0.55: 262,238 RA; 400,236 RA; 470,250 LA; 550,236 LA; 640,214 LA; 742,244 LA; 774,324 LA; 752,410 LV; 768,500 LV; 768,584 LV; 740,676 LV; 676,776 LV; 596,840 LV; 530,792 LV; 462,742 RV; 388,710 RV; 300,632 RV; 252,548 RV; 244,452 RV; 216,404 RA; 210,330 RA. Fill #6A1B45, stroke #8E2A5A at 4. Overlay the same path filled with a pattern of 7-unit spaced lines, rotated 38 degrees, stroke #8E2A5A at 1.6, opacity 0.4.

Draw order, back to front, each item in its own named group so it can be spotlighted:
1. Lungs: closed splines 66,160 120,126 168,170 176,270 160,370 96,396 46,340 40,240 and its mirror (x becomes 1000 - x), fill #2A1033, stroke #6B4A78 at 3. Inside each, draw branching trees: recursive lines that split by plus and minus 26 degrees with length times 0.72 and stroke width depth * 1.4 with round caps. Cobalt trees start at (172,188) angle 175 and (828,188) angle 5, length 40, depth 5. Scarlet trees start at (172,290) angle 180, (172,346) angle 170, (828,290) angle 0 and (828,346) angle 10, length 34, depth 4.
2. Body bed: rect x 176, y 826, width 640, height 52, radius 26, opacity 0.85, with a horizontal gradient from #FF1F3D on the right to #1F4BFF on the left.
3. Descending aorta: scarlet tube M792 150 L792 838, W 50.
4. Left pulmonary veins, passing behind the heart: scarlet tubes M172 290 L300 290 and M172 346 L300 346, W 34.
5. Heart outline and hatch.
6. Right pulmonary veins: scarlet tubes M828 290 L700 290 and M828 346 L700 346, W 34.
7. Pulmonary artery as one group: wall strokes first, then blood strokes, so the T-junction is clean. Wall #0F2A9E: M172 188 L828 188 at width 44 and M432 210 L432 480 at width 56. Blood #1F4BFF: M172 188 L828 188 at width 32 and M432 188 L432 480 at width 44.
8. Venae cavae: cobalt tubes M318 0 L318 280 and M204 836 L204 500 C204 450 236 420 290 380, W 50.
9. Aorta: scarlet tube M612 502 C540 470 500 440 500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166, W 60. Three arch branches: scarlet tubes M590 66 L590 0, M650 66 L650 0, M710 66 L710 0, W 26. Then redraw M500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166 in #FF1F3D at width 48 to clear the branch ends.
10. Inlet channels: cobalt rect x 288, y 404, w 88, h 70 and scarlet rect x 574, y 384, w 104, h 84.
11. The four chambers, drawn over tube ends so the joins disappear.
12. Valves, center x, center y, flow angle in degrees, half-width: tricuspid 332,442,90,44; mitral 626,425,90,52; pulmonary 432,290,-90,22; aortic 500,330,-90,24. Each has two leaflets hinged at center plus and minus the perpendicular times half-width, length half-width * 1.04. Leaflet angle goes from pointing at the center (closed) toward the flow direction by 87 percent of the turn at openness 1. Draw each as a quadratic curve whose midpoint is pushed 6 units along the flow, stroke #FFE6D6 at 7 with round caps, plus a 5-unit hinge dot.
13. Conduction line, stroke #39FF88 at 2.5: atrial segment M262 262 C330 330 420 410 500 470; septal segment M500 470 L500 700; branches M500 560 C450 600 400 620 360 600 and M500 620 C550 680 620 700 680 640. Node dots at (262,262) radius 7 and (500,470) radius 6.
14. Particles: 90 circles of radius 3.5, #7F9CFF on cobalt paths and #FF9AA6 on scarlet paths, spread evenly across these paths and moving at 520 units per second when their gate is open and 40 otherwise. Always open: M318 0 L318 280; M204 836 L204 500 C204 450 236 420 290 380; M828 290 L700 290; M828 346 L700 346. Open when inlet openness is above 0.5: M330 340 L332 442 L380 560; M640 320 L626 425 L626 580. Open when outlet openness is above 0.5: M380 560 L432 480 L432 188; M432 188 L172 188; M432 188 L828 188; M626 580 L612 502 C540 470 500 440 500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166 L792 838.
15. Labels, Martian Mono 15 units, hidden on thumbnails: 'Right atrium' at 322,345 and 'Right ventricle' at 385,565 in #FFFFFF; 'Left atrium' at 640,325 and 'Left ventricle' at 628,590 in #16081A; 'Aorta' at 640,112 in #FF4A5E; 'Pulmonary artery' at 610,152 in #7F9CFF; 'Vena cava' at 350,30 in #7F9CFF; 'Lungs' at 108,112 and 892,112 in #C9B6CE; 'Body' at 496,858 in #F8EEF4. All centered. Below 768px wide, show only 'RA', 'RV', 'LA', 'LV' at 36 units.

createDiagram accepts { labels, particles, frozenT, frozenRate } so thumbnails can render a fixed frame.
   Layout: One function, many instances: hero, sticky scroll diagram, phase thumbnails and the small trace-section diagram. Every instance reads the same clock unless it is frozen.
2. **Header** — Left: a small code-drawn mark (a 20px circle split vertically, cobalt left and scarlet right) and [BRAND] in Hanken Grotesk 600. Right, in Martian Mono 12px uppercase: The beat, Blood path, Five moments, Rate, The trace, Valves, Class. Each is a same-page hash link. On mobile show only the mark, [BRAND] and one link, 'Blood path'.
   Layout: Sticky, 64px tall on desktop and 52px on mobile. Background #16081A at 92 percent opacity with a 1px #4B2A55 bottom line.
   Motion: The current section's link turns #39FF88 as you scroll.
3. **Hero: the working diagram (id beat)** — Eyebrow: '[BRAND] Explainer No. 07'. H1: 'How the human heart works'. Sub: 'Four chambers, four valves and one electrical signal, running on a single clock. Drag the slider and watch every part keep time.'

Instrument panel: the slider label 'Heart rate' in mono; the current value as a 64px number with 'BPM' beside it; a range input from 40 to 180, step 1, starting at 72, with ticks at 40, 60, 90, 120, 150, 180 and no words on the ticks; a pause and play icon button; the phase readout showing the current phase name in #39FF88; 'Systole 0.26 s' and 'Diastole 0.57 s', computed live to two decimals; and a 10px share bar in which systole is #39FF88 and diastole is #4B2A55, its widths updating live.

Buttons: primary 'Follow one drop of blood' (phosphor fill, #16081A text) links to #path. Secondary 'Step through one beat' (1px #4B2A55 outline) links to #moments.

Small orientation line under the diagram, in muted mono: 'You are facing the person, so their right side is on your left.'

Trace strip caption, top left of the strip: 'Stylized trace, synthesized from math. Not a recording.' Top right, three letter chips P, QRS and T, with a live sentence beside the active one. P, within 0.04 s of its center: 'P: the signal crosses the atria. They squeeze next.' QRS, from -0.04 s to 0.05 s: 'QRS: the signal reaches the ventricles. They squeeze next.' T, within 0.05 s of its center: 'T: the ventricles reset for the next beat.'
   Layout: Desktop: exactly 100vh below the header, as a column. The upper area is a two-column grid: left column 500px with eyebrow, H1, sub, instrument panel and buttons, vertically centered; right column is the diagram, filling all remaining height with its full 1000 x 900 canvas visible and nothing cropped. The lower area is the trace strip, 168px tall, full bleed, #26102C with #4B2A55 top and bottom lines. At 1440 x 900 everything is visible without scrolling. Mobile: stacked, in this order: eyebrow and H1, diagram at full width, value and slider, phase readout and systole and diastole numbers, trace strip 110px tall, then sub and buttons below the fold.
   Motion: The diagram beats from the first frame, with no intro animation. Trace: a canvas sweep moving left to right at a constant speed that crosses the strip in 5 s, so more beats fit as the rate rises. Advance in steps of 1/240 s each frame so no QRS is missed. Line #39FF88 at 2px with an 8px shadow blur; older columns fade to 35 percent alpha with age; a 28px gap is erased ahead of the bright head dot. Baseline at 62 percent of the strip height, vertical scale 50 percent of the height per 1.0 of signal. Write small 'P', 'QRS' and 'T' marks above the wave where each one is drawn, fading with the line. Keyboard: the slider uses native arrow keys; space toggles pause when focus is not on a button or link.
4. **Follow one drop of blood (id path)** — Heading: 'Follow one drop of blood'. Intro: 'One full trip goes through the heart twice. Scroll, and the diagram lights up each stop in order.'

Ten steps, each with a mono number, a short title in Gloock and a caption. Mono numbers are #7F9CFF for steps 1–5 and #FF4A5E for steps 6–10.
1 Right atrium, 'Arrival': 'Blood back from the body collects here, through one large vein from above and one from below. It has given up much of its oxygen, so it is drawn in cobalt.'
2 Tricuspid valve, 'A one-way door opens': 'When the chamber below relaxes, pressure drops and this valve swings open. A small squeeze from the atrium tops up the ventricle before the door shuts.'
3 Right ventricle, 'The short push': 'The electrical signal arrives and this chamber squeezes. The tricuspid valve shuts so nothing flows back. The wall is thinner here because the lungs are close by.'
4 Pulmonary valve, 'Out to the lungs': 'Pressure forces these cusps open and blood leaves through the pulmonary artery. When the squeeze ends, the cusps catch the backflow and seal.'
5 Lungs, 'The color change': 'Blood spreads through tiny vessels wrapped around air sacs. Carbon dioxide leaves and oxygen comes in. This is where the diagram turns from cobalt to scarlet.'
6 Left atrium, 'Back to the heart': 'Four veins carry the refreshed blood back. The left atrium holds it until the next relaxation, filling at the same time as its partner on the other side.'
7 Mitral valve, 'The two-leaflet door': 'This valve has two leaflets where the tricuspid has three. It opens as the left ventricle relaxes, and the atrium adds a last squeeze.'
8 Left ventricle, 'The thick wall': 'This chamber has the heaviest wall in the diagram. It sends blood all the way around the body, against far more resistance than the right side faces.'
9 Aortic valve, 'The big exit': 'Both ventricles squeeze together, so this valve opens at the same moment as the pulmonary valve. Blood rushes into the aorta, and the first branches arch off toward the head and arms.'
10 Body, 'The long way round': 'Arteries divide into smaller and smaller vessels until oxygen can pass to the tissue. The blood turns cobalt again and heads for the two large veins. Then the trip starts over.'

Drop stops in diagram units, in order: (330,340), (332,442), (380,560), (432,290), then (432,188) and (880,188) on the way to (880,290) for lungs, then (700,290) on the way to (640,320), (626,425), (626,580), (500,330), then (500,120), (640,56) and (792,166) on the way to (792,700) for body. The drop then continues to (500,852) and (204,836) as the last step ends.

Spotlight target per step: 1 RA; 2 tricuspid valve and inlet channel; 3 RV; 4 pulmonary valve and pulmonary artery; 5 both lungs; 6 LA and right pulmonary veins; 7 mitral valve and inlet channel; 8 LV; 9 aortic valve and aorta; 10 aorta, descending aorta, body bed and both venae cavae.
   Layout: Desktop: two columns. Left 42 percent: the steps, each with min-height 80vh and its card vertically centered (14px radius, #26102C, 1px #4B2A55 border, 32px padding). Right 58 percent: a sticky panel with top 64px and height calc(100vh - 64px) holding the diagram with labels off except the active stop's label, a 96px trace strip below it, and a column of ten progress dots at its right edge. Mobile: the sticky panel is on top at 44svh with no trace strip, and the step cards scroll beneath it at full width with 60vh between them.
   Motion: ScrollTrigger on each step (start 'top 60%', end 'bottom 60%') sets the active step. Everything outside the spotlight dims to opacity 0.22 over 0.35s. Spotlight targets stay at full opacity with an SVG glow (feGaussianBlur stdDeviation 8, merged under the source). A leader line and the stop's name appear next to the target. A second ScrollTrigger, scrubbed across the whole section, moves the drop along the polyline: a 10-unit circle with a 3-unit #F8EEF4 ring, filled #1F4BFF up to the lungs and #FF1F3D after them. The heart keeps beating during all of this, at the slider's rate. Active card border turns #39FF88; its progress dot fills.
5. **One beat, five moments (id moments)** — Heading: 'One beat, five moments'. Intro: 'Pick a moment and the page holds there. Every diagram, trace and valve card waits with it.'

Five tiles, each with a frozen thumbnail at the mid-point of its phase, a name, a sentence and two chips.
1 'Squeeze begins': 'The ventricles tighten, but every valve is shut. Pressure climbs with nowhere to go.' Chips: 'Inlets closed', 'Outlets closed'.
2 'Ejection': 'Pressure wins. The outlet valves open and blood leaves for the lungs and the body.' Chips: 'Inlets closed', 'Outlets open'.
3 'Relaxation': 'The ventricles let go. The outlet valves snap shut against the backflow, and for a moment everything is closed again.' Chips: 'Inlets closed', 'Outlets closed'.
4 'Filling': 'Pressure falls below the atria. The inlet valves open and blood pours down.' Chips: 'Inlets open', 'Outlets closed'.
5 'Atrial top-up': 'A small squeeze from the atria pushes in the last of the blood, just before the next beat.' Chips: 'Inlets open', 'Outlets closed'.

Controls under the tiles: Previous, Next and 'Back to live', with Lucide chevron icons.
   Layout: Desktop: five equal columns, 16px gap. Each tile is a #26102C card with the thumbnail on top (labels and particles off). Selected tile: 2px #39FF88 border. Mobile: horizontal scroll-snap row of cards 78vw wide.
   Motion: Clicking a tile pauses the clock and sets t to that phase's mid-point. All diagrams and readouts update. The trace keeps its drawn line and stops. 'Back to live' resumes from that t. Tile thumbnails never animate. This same section is the reduced-motion fallback, working identically.
6. **Faster beats, shorter rests (id rate)** — Heading: 'Faster beats, shorter rests'. Intro: 'Systole, the squeeze, barely changes as the rate climbs. Diastole, the rest and refill, gives up almost all of the difference.'

A bar table for rates 40, 60, 90, 120, 150 and 180, plus a live row marked 'Your slider' that repeats the current rate. All numbers are computed from the timing model in the same function the diagram uses. At these rates the systole and diastole values in seconds are: 40: 0.34, 1.16. 60: 0.28, 0.72. 90: 0.24, 0.43. 120: 0.22, 0.28. 150: 0.21, 0.19. 180: 0.20, 0.13.

Caption, muted mono: 'Output of the simple model on this page, not measured data. It is drawn to show the pattern.' No words anywhere describing any rate as good, bad, typical, healthy or dangerous.
   Layout: Each row: rate in mono on the left, then a horizontal bar on a shared time scale (1.5 s equals the full width), systole in #39FF88 and diastole in #4B2A55 with a #C9B6CE 1px outline, then the two numbers on the right. Rows are 44px tall. The 'Your slider' row sits on a #26102C band at the top with its own compact copy of the range input, kept in sync with the hero slider. On mobile the numbers move under the bar.
   Motion: Bars grow from zero over 0.6s when first revealed. The live row updates on every slider input.
7. **Reading the trace (id trace)** — Heading: 'Three marks on one line'. Intro: 'The trace shows the electrical signal, not the movement. The signal comes first, then the muscle answers.'

Three cards.
'P': 'A spark starts at the top of the right atrium and spreads across both atria. They squeeze a moment later.' Highlights the atrial conduction segment, RA and LA.
'QRS': 'The signal drops down the wall between the ventricles and fans out. It is the tallest mark because the ventricles are the largest muscle in the diagram.' Highlights the septal segment, branches, RV and LV.
'T': 'The ventricle muscle resets, ready for the next signal. The chambers are finishing their squeeze as this mark passes.' Highlights RV and LV.

Note below: 'This line is built from smooth math curves to show where each mark falls. It cannot be used to read a real heart.'
   Layout: Top: one large static SVG of a single beat from the same trace function, full content width and 240px tall, on #26102C with faint 40px grid lines in #4B2A55 and the three marks labeled. Below, two columns: the three cards on the left and a small diagram with labels off on the right, 420px wide. On mobile the diagram sits between the trace and the cards.
   Motion: Hovering, focusing or tapping a card highlights its part of the static trace in full phosphor (the rest dims to 35 percent) and spotlights its parts in the small diagram, which keeps beating.
8. **Four valves, one direction (id valves)** — Heading: 'Four valves, one direction'. Intro: 'Valves do not push anything. They open and close because of pressure on either side.'

Four cards, each with an animated close-up, a name, a route and a state line.
'Tricuspid': 'Right atrium to right ventricle. Three leaflets, shown as two in this slice.'
'Pulmonary': 'Right ventricle to pulmonary artery. Three cusps, shown as two in this slice.'
'Mitral': 'Left atrium to left ventricle. Two leaflets.'
'Aortic': 'Left ventricle to aorta. Three cusps, shown as two in this slice.'
Live state line on each, in mono: 'Open' in #39FF88 or 'Closed' in #C9B6CE, from the same openness values, with Open meaning above 0.5.
   Layout: Four equal cards on desktop and two columns on mobile. Each close-up is a 200 x 140 SVG: a channel of the correct blood color between two #6A1B45 walls with two large #FFE6D6 leaflets, using the same valve function at twice the scale.
   Motion: Leaflets follow the live clock. Particles cross the channel only while that valve is open.
9. **Use it in class (id class)** — Heading: 'Use it in class'. Three numbered prompts:
1 'Set the slider to 40, then to 180. Which part of the beat lost more time, and what did the ventricles do differently?'
2 'Pause on Ejection. Name the two open valves and say why the other two must stay shut.'
3 'Find the point where the diagram turns from cobalt to scarlet. What changed, and where?'

Four questions, as native details and summary elements:
'Why does the trace move before the heart does?': 'The electrical signal comes first and the muscle responds a moment later. Watch the green spark travel just before each squeeze.'
'Is this a real ECG?': 'No. The trace is a sum of smooth math curves shaped to show where P, QRS and T fall. It is not a recording and should not be read as one.'
'Are the timings real?': 'They come from a simple formula chosen to show one pattern: systole barely changes while diastole shrinks. Treat them as a teaching model, not as measurements.'
'Can this page tell me anything about my own heart?': 'No. It does not read your pulse and it cannot assess anything. Questions about your own heart belong with a clinician.'
   Layout: Two columns on desktop: prompts on the left with large Gloock numerals in #FF4A5E, questions on the right with 1px #4B2A55 dividers. One column on mobile.
   Motion: Plus icon on each question rotates 45 degrees when open.
10. **Footer** — Disclaimer line in Hanken Grotesk 18px: 'A stylized teaching model for [AUDIENCE]. Not medical advice and not a measuring tool.' Colophon in muted mono: 'Words: Odalys Renn. Drawing and code: Teo Marchetti. Published by [BRAND].' A row titled 'Next in the series', with three non-link items marked 'In progress': 'How lungs trade gas', 'How a kidney filters', 'How a four-stroke engine breathes'. The [CREDIT] link, when kept, sits at the far right of the bottom line.
   Layout: Full-width band: top border as a 6px horizontal gradient from #1F4BFF to #FF1F3D, then a three-column grid on #16081A with 64px padding. One column on mobile.
   Motion: None.

## Assets
- image: None downloaded. Every visual is drawn in code from the coordinates in this prompt: inline SVG for the diagrams and canvas for the trace. public/favicon.svg is hand-written: a #16081A rounded square with a circle split vertically, #1F4BFF left and #FF1F3D right. In ASSETS.md at the project root, list gsap, lucide and the three fonts with path, source URL, author and license, and state that the project has no third-party images.
- icon: Lucide (ISC) from the lucide npm package, imported individually and rendered as inline SVG: Play, Pause, ChevronLeft, ChevronRight, Plus. The header mark is hand-drawn inline SVG.
- font: Self-hosted through @fontsource/gloock (400), @fontsource-variable/hanken-grotesk and @fontsource-variable/martian-mono, all OFL-1.1, imported in src/main.ts.

## Don'ts
- No backend, server code, API routes, database, auth, forms that submit anywhere or third-party APIs. No webcam, microphone or sensor access.
- No CDN script or link tags, no fonts.googleapis.com or fonts.gstatic.com, no analytics. Fonts, icons and scripts are all bundled locally.
- No source maps, and no src/ copied into dist/. Use relative asset paths with Vite base './'. Keep dist/ under 20 MB. Same-page links are hash links and any link to the page itself uses ./index.html, never a bare directory.
- No plates or linework traced from anatomy atlases, textbooks or commercial medical illustration. Draw the diagram only from the coordinates here, or fresh as a stylized drawing for another [TOPIC].
- No real patient ECG recordings or copied tracings. The waveform is synthesized from the math here and labeled as stylized.
- No logos, names or badges of hospitals, health charities, medical journals or device makers.
- No text copied from health encyclopedias, textbooks or patient leaflets. Use the copy written here.
- No diagnostic features or medical advice: no symptom checker, no reading of the user's own pulse, no labels saying a rate or rhythm is healthy, normal, good, risky or dangerous, no named conditions, and no treatment or drug claims.
- No photographs of real organs, surgery or patients, and no gore. No realistic blood splashes or dripping.
- No invented statistics or expert quotes presented as sourced medical fact, and no doctor endorsements or 'medically reviewed' badges. Numbers on the page come from the stated model and are labeled as model output.
- No second animation clock: no CSS keyframes, GSAP timelines or separate loops driving chambers, valves, particles or the trace.
- Do not fall back to a pale background or a muted palette. Cobalt and scarlet must both fill large areas of the hero.
- Do not crop the diagram in the hero, and do not push the slider or trace below the fold on desktop.
- No hard-coded heart vocabulary when [TOPIC] is something else: labels, phase names, valve cards, class prompts, questions, the disclaimer and the series row all follow the variables.
- Must work at 1440 x 900 and 390 x 844 with zero console errors and no horizontal page scroll. Respect prefers-reduced-motion as described.
- No template name or mention of the prompt's source anywhere in the site, except the optional [CREDIT] footer link.

---
— Prompt by VibeFather · https://vibefather.ai/t/how-the-human-heart-works · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
