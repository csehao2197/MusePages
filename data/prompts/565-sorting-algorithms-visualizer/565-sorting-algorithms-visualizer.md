# Sorting Algorithms Visualizer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
[BRAND] is a single-page, browser-only sorting lab. The working visualizer is the first screen: a large canvas bar stage with its transport controls attached, and no marketing hero in front of it. Bubble, insertion, merge, quick and heap sort each precompute a full list of steps, so play, pause, step forward, step back, scrub and reset are all deterministic. Below the stage come complexity cards with counts measured on the current array, a race mode that runs two algorithms on one array and one clock, a table of step totals per input pattern, and short notes on reading the numbers.

- Audience: [AUDIENCE], who want to see what each algorithm actually does instead of memorizing a table.
- Goal: Let a visitor press nothing and already watch a sort run, then within a minute step through it, switch algorithm, change the input pattern and race two algorithms on identical data.
- Tone: Precise, calm and instrument-like. Short labels, plain English, no exclamation marks and no claims about learners, results or popularity. Every number on the page is computed live by the engine.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), lucide-react (ISC), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource-variable/bricolage-grotesque (OFL-1.1), @fontsource/ibm-plex-sans (OFL-1.1), @fontsource/jetbrains-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - vite.config.ts: set base to './' and build.sourcemap to false. Do not copy src/ into dist/.
  - index.html: plain title '[BRAND] Sorting Visualizer' and a link to ./favicon.svg. public/favicon.svg is three ascending amber and cyan bars on #0D0F12, drawn by hand.
  - tailwind.config: add every color in the Design section as a named theme color, plus fontFamily display, sans and mono. Import the Fontsource CSS files in src/main.tsx, only the listed weights.
  - File layout: src/content.ts holds all copy and labels; src/engine/types.ts, src/engine/algorithms.ts, src/engine/arrays.ts and src/engine/player.ts hold the pure engine with no React and no DOM; src/components/ holds BarStage, Transport, CounterRail, AlgorithmCards, RaceSection, PatternTable, Notes, Header and Footer.
  - Step type in src/engine/types.ts: { k: 'compare', i, j, a, b, range?, pivot? } | { k: 'swap', i, j, range?, pivot? } | { k: 'write', i, value, prev, range? } | { k: 'sorted', indices: number[], range? }. a and b are the two values being compared, so narration stays correct when merge sort compares from its buffer. range is [lo, hi]. pivot is an index.
  - Every algorithm is a pure function (input: number[]) => Step[] and never mutates its input. Every entry in the list counts as one step. Positions in the interface are 1-indexed; indices in the engine are 0-indexed.
  - Bubble: for end from n-1 down to 1, range [0, end], compare (i, i+1) for i from 0 to end-1 and swap when a[i] > a[i+1]. After each pass emit sorted [end]. If a pass made no swap, emit sorted for all of 0..end-1 at once and stop. If the loop runs to the end, emit sorted [0].
  - Insertion: for i from 1 to n-1, range [0, i], set j = i; while j > 0, compare (j-1, j); if a[j-1] > a[j] swap and decrement j, otherwise break. At the very end emit one sorted step with all indices.
  - Merge: top-down, mid = floor((lo + hi) / 2), recurse left then right, range [lo, hi]. Copy the range to a buffer silently. Merge with read cursors i and j and write cursor k: compare (i, j) carrying the buffer values, take the left value on ties, emit write at k. Copy leftovers with write steps. At the very end emit one sorted step with all indices.
  - Quick: Lomuto partition with the last position of the range as pivot. If lo > hi return; if lo == hi emit sorted [lo] and return. For j from lo to hi-1, compare (j, hi) with pivot: hi and range [lo, hi]; when a[j] < pivot value, swap (store, j) only if store != j, then increment store. Swap (store, hi) only if store != hi. Emit sorted [store]. Recurse left, then right.
  - Heap: for i from floor(n/2)-1 down to 0, siftDown(i, n). For end from n-1 down to 1, swap (0, end), emit sorted [end], siftDown(0, end). Emit sorted [0]. siftDown(root, size) uses range [0, size-1]: l = 2*root+1, stop if l >= size; child = l; if l+1 < size, compare (l, l+1) and pick the larger; compare (root, child), stop if a[root] >= a[child]; otherwise swap and continue from child.
  - src/engine/arrays.ts: seeded PRNG mulberry32. Default seed is 2048. Ladder of n values: round(5 + 95 * (k+1) / n) for k from 0 to n-1. Random: Fisher-Yates shuffle of the ladder. Nearly sorted: ascending ladder, then floor(n * 0.1) swaps of a random index with an index 1 to 3 positions later. Reversed: descending ladder. Few unique: n random picks from 20, 40, 60, 80, 100. Shuffle increments the seed by 1, so a session is reproducible.
  - src/engine/player.ts: given input and Step[], store a full array snapshot every 256 steps and prefix counts of comparisons, swaps and writes in Int32Array. Seeking to step k restores the nearest earlier snapshot and replays forward, so step back and scrubbing cost the same as forward play. Also derive the sorted set at step k, the same way.
  - Playback clock: requestAnimationFrame with a time accumulator, advancing floor(elapsed * stepsPerSecond) steps per frame, redrawing once per frame. Redraw the canvas only when state changes. Canvas honors devicePixelRatio and resizes through ResizeObserver.
  - Write ASSETS.md at the project root listing the Fontsource packages and Lucide with their licenses, and stating that all visuals are drawn in code.

## Variables
- [BRAND] — Name of the tool (default: "Swapyard"). Shown in the header, footer and page title. Invented, one or two words.
- [AUDIENCE] — Who it is for (default: "computer science students and developers preparing for interviews")
- [ITEMS] — What the bars stand for, plural (default: "numbered cards"). Used in headings and the stage caption, for example 'Sorting 48 numbered cards by number'.
- [MEASURE] — What the bars are sorted by (default: "number"). Used in the stage caption, the hover readout and step narration.
- [SETTING] — Everyday setting for the explanations (default: "a table of numbered cards"). The five one-line explanations and the notes borrow from this setting. Rewrite them when it changes.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/sorting-algorithms-visualizer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- graphite-950 `#0D0F12` — Page background and stage background
- graphite-900 `#14171C` — Panels, cards, transport bar
- graphite-800 `#1C2027` — Raised controls, hover state of cards and buttons
- hairline `#2B3038` — All 1px borders and slider tracks
- grid `#1E232A` — Faint gridlines inside canvas stages
- text `#E8EAED` — Primary text and counter numerals
- muted `#8C94A1` — Secondary text, labels and axis numbers
- compare `#F5A524` — The one warm accent: bars being compared, play button, focus on the selected tab
- swap `#3CC8E0` — The one cool accent: bars being swapped or written, focus rings
- bar-idle `#515967` — Bars outside the active range
- bar-range `#7C8694` — Bars inside the active range
- bar-pivot `#F4EFE1` — Pivot bar, always paired with a small amber caret above it
- bar-sorted `#B9C3CF` — Bars in final position

### Typography
- Display: logo wordmark, H1 and section headings. H1 28px on desktop and 22px on mobile; H2 36px on desktop and 26px on mobile; letter-spacing -0.02em: Bricolage Grotesque (OFL), weights 600/700
- Text: body at 15px with 1.55 line height, control labels at 13px, card explanations at 14px: IBM Plex Sans (OFL), weights 400/500/600
- Mono: all live numerals, step readouts, complexity notation, axis numbers and small uppercase eyebrow labels at 11px with 0.08em tracking. Counter numerals at 36px on desktop and 22px on mobile with tabular figures: JetBrains Mono (OFL), weights 400/500/700

### Layout & motion
- Spacing: 4px base unit. Page max-width 1360px with 24px gutters on desktop and 16px on mobile. Sections below the visualizer have 96px vertical padding on desktop and 64px on mobile. Panels have 16px inner padding and 1px hairline borders, no shadows.
- Radius: 4px on panels, cards and buttons. 2px on slider thumbs. Bars are square with no rounding. The play button is the only circle.
- Motion: Autoplay: 400ms after load the main stage starts playing quick sort at 50 steps per second, unless prefers-reduced-motion is set.
- Motion: Bars cut crisply between steps. Only at 12 steps per second or slower do swapped bars slide over 90% of the step interval with ease-out; above that they cut.
- Motion: Completion sweep: when the last step lands, a white (#FFFFFF) highlight travels left to right across the bars in 700ms, each bar lit for 120ms, then settles to bar-sorted. The play button becomes a replay icon.
- Motion: Controls: 120ms color transitions on hover and press; cards lift their border from hairline to muted on hover with no movement.
- Motion: In-page navigation scrolls smoothly; under reduced motion it jumps.
- Motion: prefers-reduced-motion: both stages start paused at step 0, the sweep is skipped, slides are skipped, the race does not auto-start, and a one-line note under the main stage reads 'Reduced motion is on, so playback starts paused. Step manually or press play.'
- Imagery: No photographs or bitmaps. The visual anchor of the first screen is the live visualizer itself, drawn on canvas 2D: crisp bars on a faint grid with mono axis numbers. The logo glyph and favicon are three ascending bars in hand-written SVG. Icons are Lucide at 18px with 1.75 stroke.

## Pages & Sections
### [BRAND] Sorting Visualizer (`index.html`)
1. **Header** — Logo glyph plus wordmark '[BRAND]'. Anchor links: Visualizer (#visualizer), Algorithms (#algorithms), Race (#race), Patterns (#patterns). Right side: mono chip 'Runs in your browser'.
   Layout: Sticky, 56px tall, graphite-950 at 92% opacity with a 1px hairline bottom border. Logo left, links centered, chip right. On mobile: 52px tall, logo left, only the Algorithms and Race links at 13px on the right, chip hidden.
2. **Visualizer (first screen)** — H1: 'See every compare, swap, and write.' Mono caption beside it, live: 'Sorting 48 [ITEMS] by [MEASURE]'. Algorithm tabs: Bubble, Insertion, Merge, Quick, Heap; Quick is selected on load. Stage corner readouts in mono: top left 'seed 2048', top right hover readout 'position 12 · [MEASURE] 37' when a bar is hovered. Scrubber label: 'Step 214 / 612'. Transport buttons: Reset, Step back, Play/Pause, Step forward, Shuffle, each with an aria-label. Speed slider labeled 'Speed' with live value '50 steps/s', range 1 to 500 on a log scale, default 50. Size slider labeled 'Size' with live value '48', range 8 to 128, default 48. Pattern segmented control: Random, Nearly sorted, Reversed, Few unique; Random is selected on load. Right rail counters with mono labels: 'Comparisons' with an amber dot, 'Swaps' with a cyan dot, 'Writes' with a cyan dot. Below them a 'Now' panel with narration written for one line per step: compare 'Comparing positions 12 and 31: [MEASURE] 37 against [MEASURE] 12.'; swap 'Trading places: positions 12 and 31.'; write 'Writing 37 into position 8 from the buffer.'; sorted 'Position 31 is final.' At step 0 it reads 'Ready. Press play or step forward.' When finished it reads 'Sorted in 612 steps.' Below that a 'Key' legend with five chips: Comparing, Swapping or writing, Pivot, Active range, Final position. At the bottom of the rail a one-line summary of the selected algorithm in mono: 'Average O(n log n) · Space O(log n) · Not stable'. Desktop-only hint under the transport: 'Space play · Left and Right step · R reset · S shuffle'.
   Layout: Fills the first 1440x900 viewport under the header, with all controls visible without scrolling. Top row 56px: H1 and caption left, algorithm tabs right; the selected tab has a 2px amber underline. Main row is a two-column grid: stage column flexible, rail 288px wide with a 16px gap. Stage column stacks the canvas panel (flex-grow, at least 480px tall on desktop), a full-width scrubber with the step label at its right, and an 80px transport bar directly attached to the canvas panel with no gap, sharing one hairline border. Transport order: Reset, Step back, a 52px amber circular Play/Pause with graphite-950 icon, Step forward, Shuffle, a vertical hairline, Speed, Size, Pattern. Canvas drawing: horizontal grid lines at 25, 50, 75 and 100 with small mono axis numbers at the left in muted; bars sit on a baseline and fill the width with a 2px gap at 64 bars or fewer and 1px above. Under the baseline, a 6px marker strip shows an amber tick under compared positions and a cyan tick under swapped or written positions, so state never relies on bar color alone. A 2px bar-range line above the strip brackets the active range. The pivot gets a small amber triangular caret above its top. On mobile at 390x844: H1, then caption, then tabs as a horizontally scrollable row; canvas fixed at 300px tall; scrubber; three counters in a 3-column strip at 22px; one-line narration; Speed, Size and Pattern stacked in a panel below; Key legend after that. The transport buttons move to a bar fixed at the bottom of the viewport with 48px targets while this section or the Race section is on screen.
   Motion: Autoplay as described in the Design section. Changing tab keeps the same array, resets to step 0 and keeps playing if it was playing. Changing size, pattern or Shuffle regenerates the array, resets to step 0 and recomputes all step lists after a 120ms debounce. Dragging the scrubber pauses playback and seeks. Counters update each frame with no easing. Narration box has a fixed height so nothing shifts.
3. **Algorithm cards** — Mono eyebrow 'ALGORITHMS'. H2: 'Five ways to put [ITEMS] in order'. Sub: 'Explained with [SETTING]. Counts on each card are measured on the array now on the stage.' Five cards, each with name, a Best / Average / Worst / Space / Stable grid in mono, a one-line explanation, and measured counts. Bubble sort: O(n), O(n²), O(n²), O(1), Stable. 'Walk along the cards, swapping any neighbors that are out of order, until a full pass changes nothing.' Insertion sort: O(n), O(n²), O(n²), O(1), Stable. 'Take the next card and slide it left until it sits where it belongs among the cards already behind it.' Merge sort: O(n log n), O(n log n), O(n log n), O(n), Stable. 'Split the cards into smaller piles, then zip sorted piles together by always taking the lower top card.' Quick sort: O(n log n), O(n log n), O(n²), O(log n), Not stable. 'Pick a pivot card, move every lower card to its left, then repeat on each side of it.' Heap sort: O(n log n), O(n log n), O(n log n), O(1), Not stable. 'Arrange the cards as a tree with the highest on top, then keep moving the top card to the end.' Measured row on every card, live: '312 compares · 156 swaps · 0 writes', and a total line '510 steps on this array'. Button text on each card: 'Load on stage'.
   Layout: Section id algorithms. Heading block left-aligned. Five equal columns at 1440px with a 12px gap; 2 columns at 768px; 1 column at 390px. Each card is a graphite-900 panel with a hairline border. Order inside: name in display 20px, complexity grid as two-column rows in mono 12px, explanation in text 14px, then a 4px meter whose fill width is this card's total divided by the largest total among the five (amber fill on the hairline track), then the measured numbers in mono 12px, then the button. The card matching the selected algorithm has an amber top border of 2px.
   Motion: The whole card is clickable. Selecting it loads that algorithm, scrolls to #visualizer and starts playback from step 0 unless reduced motion is on. Meters update instantly when the array changes, with no animation.
4. **Race** — Mono eyebrow 'RACE'. H2: 'Race two on the same array'. Sub: 'One shared clock. Each lane takes one step per tick, and the lane with fewer steps takes the flag.' Controls: 'Lane A' select, 'vs', 'Lane B' select, 'Pattern' select, 'Size' slider, 'Speed' slider with live value '90 ticks/s', buttons 'Start' / 'Pause', 'Step', 'Reset', 'New array'. Defaults: Bubble against Quick, Random, size 48, seed 2048. Tick readout: 'Tick 612'. Each lane header: badge 'A' or 'B', algorithm name, mono counters 'C 412 · S 198 · W 0', and 'Step 610 / 1,684'. When a lane finishes first it shows a Lucide Flag icon and the chip 'Finished first'; the other lane keeps running and then shows '+1,074 steps'. Result strip: 'Quick sort won by 1,074 steps.' or 'Dead heat at 610 steps.' Note under the lanes: 'Steps are not milliseconds. One step is one compare, swap, write or final mark.'
   Layout: Section id race. Control row in a graphite-900 panel, wrapping at narrow widths. Below it two lanes side by side at 50% each with a 12px gap; each lane is a panel with its header above a 320px canvas drawn exactly like the main stage, with a 3px progress line along the bottom. Between controls and lanes, the tick readout is centered in mono 28px. Result strip sits under the lanes, full width, 56px tall, with the text in display 20px and left amber border 2px. On mobile the lanes stack with 200px canvases, the two lane selects share a 2-column row, and the fixed bottom bar drives Start/Pause, Step and Reset while this section is on screen.
   Motion: Both lanes run from identical copies of one array. The race auto-starts once when the section is 40% visible, unless reduced motion is on. A finished lane freezes after its sweep. The same algorithm cannot be chosen for both lanes: the other lane's current choice is disabled in each select. Changing any setting resets the race to tick 0 and leaves it paused.
5. **Pattern table** — Section id patterns. Mono eyebrow 'INPUT PATTERNS'. H2: 'Where each one struggles'. Sub: 'Total steps at the current size and seed. Select a cell to load that run on the stage.' Rows: Bubble, Insertion, Merge, Quick, Heap. Columns: Random, Nearly sorted, Reversed, Few unique. Every cell is a total computed live from the engine, formatted with a thousands separator. Note under the table: 'Quick sort here always uses the last position as its pivot, so ordered input gives it the most lopsided splits it can get.'
   Layout: Full-width table in a graphite-900 panel with hairline row separators. Row headers in text 14px, cells in mono 14px, right-aligned, 52px tall. Cell background runs from transparent to compare at 28% alpha, scaled by log(cell total) across the table. The cell matching the current stage has a 1px amber outline. On mobile the column headers shorten to Random, Nearly, Reversed, Few at 12px and all columns fit at 390px without horizontal scroll.
   Motion: Hovering a cell lifts its background to graphite-800 underneath the tint. Selecting it sets algorithm and pattern, scrolls to #visualizer and plays from step 0 unless reduced motion is on.
6. **Reading the numbers** — Mono eyebrow 'NOTES'. H2: 'Reading the numbers'. Four notes. 'What counts as a step?': 'Every entry in the list does: a compare, a swap, a write, or marking a position final.' 'Does fewer steps mean faster in real code?': 'Not always. A step count ignores memory access and overhead. Merge sort copies through a second buffer and heap sort jumps across the array, and neither cost shows up here.' 'Why does merge sort show no swaps?': 'It never trades two positions. It copies values back from a temporary buffer, so that work appears under Writes.' 'Why does quick sort slow down on ordered input?': 'Its pivot is always the last position. With [ITEMS] already in order, each split leaves one side almost empty.'
   Layout: Two-column grid of plain text blocks at 1440px with 48px column gap, one column at 390px. Each note has its question in text 600 at 16px and its answer in muted at 15px, separated by a hairline above. No accordions: everything is visible.
7. **Footer** — Logo glyph plus '[BRAND]'. Line: 'A browser tool for [AUDIENCE].' Line: 'Runs entirely in this tab. Nothing is saved or sent.' The optional [CREDIT] link goes here.
   Layout: Hairline top border, 48px padding, two columns on desktop with the logo and audience line left and the other lines right-aligned in muted 13px; stacked on mobile with 96px of bottom padding so the fixed bar never covers it.

## Assets
- image: None to download. The stages are canvas 2D. The logo glyph and public/favicon.svg are hand-written SVG. No photographs or other bitmaps.
- icon: lucide-react (ISC), installed from npm: Play, Pause, SkipBack for reset, StepBack, StepForward, Shuffle, RotateCcw for replay, Flag for the race winner. Listed in ASSETS.md.
- font: Self-hosted through npm: @fontsource-variable/bricolage-grotesque, @fontsource/ibm-plex-sans (400, 500, 600) and @fontsource/jetbrains-mono (400, 500, 700), all OFL-1.1. Listed in ASSETS.md.

## Don'ts
- No backend, API routes, database, auth, leaderboard, saved results or third-party APIs. Race results and counters exist only in the browser tab.
- No fonts from fonts.googleapis.com, fonts.gstatic.com or any CDN; self-host through Fontsource. No commercial fonts.
- No CDN script or link tags and no analytics. Everything ships locally in dist/.
- No source maps in production, and no src/ in dist/. Use relative asset paths with base './'. Keep dist/ under 20 MB.
- Internal links are in-page anchors on index.html. Never link to a bare directory.
- Zero console errors at 1440x900 and 390x844. No horizontal page scroll at 390px. Respect prefers-reduced-motion as specified.
- No marketing hero, sign-up prompt or tutorial overlay in front of the visualizer. The tool is the first screen.
- Do not use Math.random or Date.now anywhere in the engine. All arrays come from the seeded generator, so the same settings always give the same run.
- Do not copy code, step text, pseudocode or explanatory copy from any existing sorting visualizer or textbook. Write every explanation fresh, using the copy given here.
- Do not use the names, logos or wordmarks of existing algorithm-learning sites, courses or coding platforms.
- Do not reuse the recognizable color coding, panel layout or signature bar styling of any well-known visualizer. Keep exactly the palette and layout described above.
- No audio, sound effects, video clips or embedded third-party animations.
- No real people's portraits or names, no authors or testimonials, and no claims about learner numbers, course results or popularity.
- No restricted UI library source, such as purchased or paid component kits. Build every control from scratch with Tailwind and native inputs.
- No extra animation library. Playback runs on requestAnimationFrame and canvas 2D, and bars are never DOM elements.

---
— Prompt by VibeFather · https://vibefather.ai/t/sorting-algorithms-visualizer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
