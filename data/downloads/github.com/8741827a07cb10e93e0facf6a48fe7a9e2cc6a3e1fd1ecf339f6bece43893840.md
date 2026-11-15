# Daily Word Puzzle Game

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page word game called [GAME]: guess the hidden five-letter word in six tries. Tile flips, a state-mirroring keyboard, stats in localStorage, a copyable original-format results row, a help modal, and the next puzzle served from an original curated list themed around [FLAVOR] per completed round. One page, index.html; everything runs in the browser.

- Audience: People with four minutes and a keyboard: commuters, queue-standers, and the 'one more word' crowd. They want crisp feedback and zero friction.
- Goal: Play, win, share. Within ten seconds a first guess is typed; within a round the player has opened stats or copied their result.
- Tone: Warm-arcade: short, kind, lightly teasing on a loss. One dry line in the help modal.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (ISC), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource-variable/bricolage-grotesque (OFL-1.1), @fontsource-variable/inter (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template (pin the version if the latest template targets newer majors), then keep one real HTML page: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (cream, panel, card, line, ink, softink, marigold, marigold-deep, marigold-mist, hit, near, miss, slateink, good) and fontFamily display ['Bricolage Grotesque Variable', 'system-ui', 'sans-serif'], sans ['Inter Variable', 'system-ui', 'sans-serif']. Set borderRadius DEFAULT to 12px and add maxWidth { shell: '560px' }.
  - In src/fonts.ts import '@fontsource-variable/bricolage-grotesque' and '@fontsource-variable/inter'; import src/fonts.ts and src/index.css from the entry file.
  - File layout: src/content.ts (game name, help copy, stats labels, every string, and two word lists — answers: 40 curated five-letter words themed around [FLAVOR]; accepted: the answers plus 80 more common five-letter words; both lists plain string arrays), src/lib/brand.ts (gameSlug = [GAME] lowercased with every run of non-alphanumeric characters replaced by '-', storageKey = gameSlug + ':stats'), src/lib/game.ts (pure logic: pickAnswer(index), judge(guess, answer) → five letter-states resolving duplicate letters correctly, isValid(word)), src/lib/share.ts (buildResultRow(statesByRow) → an original multi-line text format using unicode box-drawing characters like ▉ ◪ ▢ plus a header '[GAME] — solved in 4/6 (sample puzzle)', never colored-square emoji).
  - State: src/store/game.ts is a tiny external store (useSyncExternalStore) holding { rowIndex, rows: string[] (committed guesses), current: string (in-progress letters), status: 'playing'|'won'|'lost', answerIndex, shakeAt } plus stats { played, wins, streak, best, distribution: number[6] } persisted to localStorage under storageKey.
  - Components in src/components/: TopBar.tsx (Wordmark, HelpButton, StatsButton), Board.tsx (TileRow.tsx, Tile.tsx), Keyboard.tsx (Key.tsx), ResultPanel.tsx (StatsBlock.tsx with DistributionRow.tsx, ShareRow.tsx), HelpModal.tsx (ExampleTile.tsx), Toast.tsx. src/pages/Game.tsx composes them.
  - Input: one window keydown listener — letters a–z append (max 5), Enter commits (invalid → shakeAt bump + toast 'Not in the word list'), Backspace removes; the on-screen Keyboard mirrors the same actions. Physical input works whether or not the Keyboard is focused; every Key is a real button for touch.
  - Tile flip: on commit, each tile of the row flips (rotateX 0→90→0, 520ms total) with a 110ms per-tile stagger, revealing its state color at the 90° midpoint; the Keyboard's matching keys update as each tile lands. Invalid shake: the row translates ±6px three times (300ms). Reduced motion: states swap instantly, no shake translation (a toast still explains invalidity).
  - End state: after the flip completes, ResultPanel slides up in-sheet (not a modal): the answer in display type, 'solved in N/6' or 'the word was …', StatsBlock (played, win %, current streak, best streak, and a six-bar distribution with the winning bar in Marigold), ShareRow ('Copy result' → clipboard + toast 'Copied — paste it anywhere'), and 'Next puzzle' serving pickAnswer(next) with the quiet label 'Sample rotation · puzzle 7 of 40 (no dates here)'.
  - Keyboard: QWERTY rows plus Enter/Backspace keys; key letter-states: hit (Marigold fill, Slate Ink text), near (Cocoa outline + dot), miss (Miss gray, text at 40%). Physical keyboards get the same feedback only through the board; the Keyboard is stateless to typing.
  - HelpModal: rules in four lines with a worked ExampleTile trio (one hit, one near, one miss with one-line explanations), the dry line ('No letters are reused in scoring unless the word reuses them — fairness beats cleverness.'), and a close X. Focus-trapped, Escape closes.
  - Stats persist across rounds; Reset stats lives inside StatsBlock as a quiet 'reset' link with a confirm popover.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#FBF3E4'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[GAME] — a five-letter puzzle</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts and favicon.svg. Keep it under 3 MB.

## Variables
- [GAME] — Game name (default: "Larkspur"). The invented game's name, one word. Used in the wordmark, title, share text and localStorage key. Never a real game.
- [FLAVOR] — Word theme (default: "everyday English words"). One lowercase phrase naming the answer list's flavor. Rewrites the 40 answers (and the help copy) so the list fits. Keep words common and five letters exactly.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/daily-word-puzzle-game in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Cream `#FBF3E4` — Page background — warm arcade daylight.
- Panel `#FFFBF0` — Result panel, help modal.
- Card `#FFFFFF` — Tiles before commit, keys, toasts.
- Line `#E5D9C0` — 2px tile and key borders (1px on panels).
- Ink `#241F16` — Tile letters pre-commit, headings, body.
- Soft Ink `#6E6552` — Hints, stats labels, the sample-rotation line.
- Marigold `#E8A33C` — The one accent: hit tiles, primary buttons, winning distribution bar, focus ring, wordmark dot.
- Marigold Deep `#C4842A` — Hover/pressed primary.
- Marigold Mist `#F8E8CB` — Toast fills, selected states.
- Hit `#E8A33C` — Correct-letter tile fill (same as the accent — the game owns it).
- Near `#F3D9A4` — Present-elsewhere tile fill: a paler marigold with a Cocoa 2px border so it never reads as the hit color.
- Miss `#D8CFBC` — Absent-letter tile fill and disabled keys.
- Slate Ink `#241F16` — Text on marigold fills (kept dark for warmth).
- Good `#5E8C4A` — Streak ticks, copied confirmation.

### Typography
- Display: wordmark, result headings, big answer reveal — Bricolage Grotesque: Bricolage Grotesque (OFL), weights 400/600
- Text and UI: tiles, keys, stats, help — Inter; tabular numerals for stats: Inter (OFL), weights 400/500/700

### Layout & motion
- Spacing: 8px base unit. Shell max-width 560px centered; board 350px wide (tiles 62px, gap 8px; scales to 92vw with tiles at min(62px, 16vw)); keyboard full shell width, keys 40px tall with 6px gaps. Top bar 56px. Type scale: wordmark 22px Bricolage 600; tile letters Inter 700 26px uppercase; key letters Inter 600 14px uppercase; result heading 24px Bricolage 600; stats numerals Inter 700 22px tabular; body and help 14.5px / 1.6; toasts 13px. Buttons: height 44px, Inter 600 13.5px; primary Marigold fill with Slate Ink text, ghost 1px Line border. Focus everywhere: 2px Marigold outline, 3px offset.
- Radius: 12px on tiles and primary buttons; 10px on keys; 8px on panels and modals; 999px for toasts and pills.
- Motion: Easing: --ease-io cubic-bezier(0.65, 0, 0.35, 1) for flips; a spring (stiffness 420, damping 26) for the result panel. Arcade-crisp, never sluggish.
- Motion: Tile typing: each letter pops in (scale 0.9→1, 90ms) as it's typed.
- Motion: Tile flip: the row's five tiles flip in sequence (110ms stagger, 520ms each: rotateX 0→90→0) revealing state colors at midpoint; keys recolor as each lands.
- Motion: Invalid shake: row ±6px, three cycles, 300ms total, then rest.
- Motion: Win: the completed row's tiles bounce once in sequence (translateY -8px, 80ms each, staggered) — small joy, no confetti.
- Motion: ResultPanel: slides up in-sheet with the spring; distribution bars grow from 0 over 400ms staggered 40ms; the winning bar carries a Marigold fill.
- Motion: Help modal: scrim 160ms, panel scale 0.96→1 with the spring.
- Motion: Toast: rises 6px, 160ms, auto-dismiss 2.2s.
- Motion: prefers-reduced-motion: reduce — states swap instantly (no flips, no shake translation, no bounce), bars render at full width, panel fades only; the game stays fully playable. Use CSS @media in index.css plus Motion's useReducedMotion.
- Imagery: No images at all: tiles, keys, chips, the distribution chart and the favicon are drawn in code. The share format uses unicode box characters in plain text — never colored-square emoji. Icons: lucide-react only, stroke width 1.75.

## Pages & Sections
### Game (`index.html`)
1. **Content file and copy rules** — All copy below is written for the defaults ([GAME] = Larkspur, [FLAVOR] = everyday English words). Put every string and both word lists in src/content.ts and render from it. If any variable differs, rewrite the 40 answers and 80 accepted extras so they fit [FLAVOR] (all exactly five letters, common, US spellings), and adjust the help copy's example words. Help copy: 'Guess the word in six tries.' / 'Each guess must be a five-letter word we know (the list is kind, not huge).' / 'After each guess, the tiles show how close you are.' / Examples: 'STARE — the S is in the word and in place (a full marigold tile)'; 'CRANE — the R is in the word, wrong spot (pale tile with a border)'; 'PLUMB — the U isn't in the word at all (gray tile).' / Dry line: 'No letters are double-counted unless the word doubles them — fairness beats cleverness.' / Loss line: 'The word was {answer}. Tomorrow's word forgives everything. (There's no tomorrow — just press next.)' Sample answers list (40, write them all in content.ts): CRANE, PLANT, BRICK, MOUSE, DRIFT, SPARK, GLOVE, TIDAL, MARCH, QUITE, FROST, GRAPE, SWORD, HONEY, PEARL, CLOUD, SHINE, BREAD, RIVER, STONE, LEAFY, MIRTH, VOCAL, WIDEN, ZESTY, BLAZE, CHARM, DWELL, EAGER, FLINT, GRASP, HABIT, IVORY, JOUST, KNEEL, LUNAR, MEDAL, NOBLE, ORBIT, PIQUE. Accepted extras (80 more; write plausible common five-letter words in the same voice). Stats labels: 'Played', 'Win %', 'Streak', 'Best'; distribution heading 'Guesses it took'; sample-rotation line 'Sample rotation · puzzle {n} of 40 · no dates here'.
   Layout: n/a
   Motion: n/a
2. **Top bar** — Left: the wordmark '[GAME]' (Bricolage 600 22px) with a Marigold dot. Right: two icon buttons — HelpButton (CircleHelp) and StatsButton (ChartNoAxesColumn) opening HelpModal and (between rounds) the ResultPanel's stats respectively. Under 400px the wordmark shrinks, buttons persist.
   Layout: 56px row, Cream background, Line bottom border; sticky.
3. **Board** — Six TileRows of five Tiles. Empty tiles: Card fill, 2px Line border, no letter. Typing fills the current row's tiles letter by letter (pop-in). Committed rows keep their letters with state fills (hit Marigold / near pale-with-border / miss gray) and Ink-to-white text contrast per state. The current row sits at rest. Below the board, one quiet status line while playing: 'Puzzle {n} · six tries' (Soft Ink, 12.5px).
   Layout: Centered; board width min(350px, 92vw); 28px above the keyboard.
4. **Keyboard** — Three rows: QWERTYUIOP / ASDFGHJKL / (Enter) ZXCVBNM (Backspace). Keys are real buttons; state fills per Design; Enter primary-wide (70px), Backspace with Delete icon. Hover lifts 1px; active presses 1px.
   Layout: Full shell width at bottom; keys height 44px (52px on the Enter row), 6px gaps; margin-bottom safe-area aware.
5. **Result panel and help modal** — ResultPanel (in-sheet, replaces the keyboard area after a round ends): heading 'Solved in {n}/6' or 'Out of tries'; the answer in Bricolage 600 26px; StatsBlock (four numerals + distribution); ShareRow ('Copy result' primary + quiet 'Next puzzle' ghost with the sample-rotation line); a 'reset stats' link opening a confirm popover ('Reset your stats? The tiles forget faster than you will.'). HelpModal: rules, three ExampleTile lines, the dry line, close X; opens from HelpButton and auto-opens on a visitor's very first game (a localStorage flag).
   Layout: ResultPanel max-width 420px centered; modal 420px centered over a scrim.

## Assets
- image: No images at all: every visual is drawn in code. Do not fetch or hotlink anything.
- image: Write ASSETS.md at the project root listing the code-drawn assets (tiles, keys, distribution bars, favicon — 'drawn in code, original') and the npm packages: @fontsource-variable/bricolage-grotesque and @fontsource-variable/inter (OFL-1.1) and lucide-react (ISC). State that word lists are original curated lists.
- icon: lucide-react only: ChartNoAxesColumn, Check, CircleHelp, Copy, Delete, X. Stroke width 1.75, 16–20px, color inherits. public/favicon.svg: viewBox 0 0 32 32, a 32x32 rounded square filled #241F16, a marigold (#E8A33C) five-tile row glyph (five small rounded squares, the middle one filled marigold, the rest outlined). No brand logos.
- font: Install @fontsource-variable/bricolage-grotesque and @fontsource-variable/inter and import them in src/fonts.ts as listed in Setup. Vite bundles the woff2 files into dist/.

## Don'ts
- No backend, no form submission, no fetch to API, no network: stats and state persist to localStorage only; the share row copies to clipboard.
- Every internal link is the game itself (./index.html) — never to a bare directory; there is exactly one page.
- No resemblance to Wordle or any real word game: different name, colors, tile shape, share format (unicode box characters, never colored-square emoji), and original word lists — no scraped dictionaries.
- No daily lockout or real dates: puzzles rotate per completed round with an honest 'sample rotation' label; nothing prints today's date or years.
- No images, photos or logos; everything is code-drawn.
- Self-host everything: fonts through Fontsource, icons as npm packages or inline SVG. No CDN <script> or <link> tags, no Google Fonts, no analytics.
- Production build: minified, no source maps, no src/ copied into dist/, single command npm run build, output in dist/ under 3 MB.
- Never mention VibeFather inside the game except a footer-corner credit line 'Built with a VibeFather template' linking https://vibefather.ai under the keyboard, one quiet row.
- Respect prefers-reduced-motion: instant state swaps, no shake/bounce; the game stays fully playable by keyboard and touch.
- The game must work at 1440x900 desktop and 390x844 mobile with zero console errors; physical and on-screen keyboards both play; help modal, stats and copy buttons work with keyboard only and visible focus rings.
- Accessibility: tiles carry aria-labels describing letter and state; status changes announce via aria-live politely; the keyboard is real buttons; color never carries meaning alone (near tiles get a border + dot).

---
— Prompt by VibeFather · https://vibefather.ai/t/daily-word-puzzle-game · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
