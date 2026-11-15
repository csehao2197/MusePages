# Interactive Lesson Slides

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a real, working lesson deck web app for [BRAND]: the lesson "[LESSON_TITLE]" ([COURSE_LABEL]), taught by [INSTRUCTOR] to [AUDIENCE]. There is no marketing page. The app opens directly on the deck, and the working product is the hero: a collapsible outline sidebar, a 16:9 slide stage, and a slim control bar. Twelve slides use seven slide types that behave differently (title, concept with diagram, multiple-choice quiz, reorder check, fill-in check, live code playground, recap), all driven from one typed content file. Learners get instant quiz feedback and a running score, run real JavaScript in a sandboxed iframe, draw on any slide, and link to any slide with a URL like #/slide/7.

- Audience: Teachers, course creators and workshop leads who want a deck that checks understanding and runs code live, plus the learners who follow along on a laptop or phone.
- Goal: Within seconds of opening, a visitor sees a polished lesson deck, clicks a quiz answer, runs the code slide or draws on a slide, and understands they can teach their own lesson with it by changing the content file.
- Tone: Warm classroom editorial. A good teacher talking: plain, specific, encouraging, a little wry. Short sentences, concrete numbers, no corporate language and no exclamation marks.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), codemirror (MIT), @codemirror/view (MIT), @codemirror/state (MIT), @codemirror/language (MIT), @codemirror/lang-javascript (MIT), @lezer/highlight (MIT), lucide-react (ISC), @fontsource-variable/fraunces (OFL-1.1), @fontsource/atkinson-hyperlegible (OFL-1.1), @fontsource-variable/jetbrains-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - vite.config.ts: base './', build.sourcemap false, @vitejs/plugin-react. Do not change the stack unless the user asks.
  - tailwind.config: add every color in Design as a named theme color (paper, panel, line, ink, muted, board, boardDeep, console, chalk, chalkDim, marker, mint, clay, sky, ledge) and fontFamily display, sans, mono. Keyframes live in src/index.css.
  - Keep all copy in src/content/lesson.ts: variables at the top, then UI labels, the outline groups, and the slides array. If the variable values differ from the defaults, rewrite every slide's teaching content, the starter code, the check answers and the explanations for the new lesson and audience, but keep the 12 slides, their types and their order. The starter code must stay runnable plain JavaScript that logs its results.
  - In lesson.ts define type Slide = TitleSlide | ConceptSlide | QuizSlide | ReorderSlide | FillSlide | CodeSlide | RecapSlide, discriminated by a kind field. Each type has its own component in src/slides/. ConceptSlide has a variant field: 'photo', 'stepper', 'bars' or 'board'. The stepper takes steps: { values: number[]; sortedUpTo: number; active: number | null; shifts: number; caption: string }[], so it can draw any lesson that works on a row of numbers.
  - Routing is hash only: #/slide/N is the single source of truth, read through a hashchange listener. Navigating sets location.hash so browser back and forward work. An empty or out-of-range hash is corrected with location.replace to #/slide/1 or the nearest valid slide.
  - Persist one JSON object in localStorage under a key built from a slug of [BRAND] plus [LESSON_TITLE], with { answers, code, marks, sidebarCollapsed }. Wrap every read and write in try/catch and work normally when storage is unavailable.
  - Stage scaling: at viewport widths of 768px and up, each slide is authored on a fixed 1280x720 canvas and scaled with transform: scale(min(availableWidth/1280, availableHeight/720)), measured with ResizeObserver and centered. Below 768px there is no scaling: use the flow layout described under Mobile layout. Minimum text on the canvas is 20px, so it stays readable when scaled.
  - Code runner: on Run, remove any previous iframe and create a hidden iframe with sandbox="allow-scripts" (never allow-same-origin) and srcdoc. The srcdoc has a meta CSP of default-src 'none'; script-src 'unsafe-inline', a harness script, then the learner's code in its own script tag on a known line, with every </script in the code escaped as <\/script. The harness replaces console.log, info, warn and error with parent.postMessage calls, formats values with JSON.stringify where needed, catches errors through window.onerror (returning true so nothing reaches the page console) and reports the message and the line number minus the harness offset, then posts a done message. The parent accepts messages only when event.source is that iframe's contentWindow. If done has not arrived after 3000 ms, remove the iframe and show the timeout message from the slide 7 section.
  - CodeMirror: use basicSetup from codemirror with javascript() from @codemirror/lang-javascript, plus an original EditorView.theme and a HighlightStyle from @lezer/highlight using only the Design palette: keywords marker, strings mint, numbers clay, comments chalkDim, function names chalk at weight 600, active line background rgba(243,240,227,0.05), selection rgba(245,207,58,0.25), gutter text chalkDim. Add a Mod-Enter keymap for Run. Use a current @codemirror/view release, which handles a scaled parent correctly.
  - Global keyboard handler: ignore key events whose target is an input, textarea or .cm-editor. Ignore Space when the target is a button.

## Variables
- [BRAND] — School or course provider (default: "Tallow Street Code School"). Shows in the outline header, browser title and recap. Also seeds the small square brand mark.
- [LESSON_TITLE] — Lesson title (default: "How Sorting Works"). The lesson the 12 slides teach. Changing it means rewriting all slide content.
- [COURSE_LABEL] — Course and lesson position (default: "Intro to Programming, Unit 4, Lesson 2"). Shows above the title on slide 1 and under the brand in the outline.
- [INSTRUCTOR] — Instructor name (default: "Ines Halloran"). Shows beside the portrait on slide 1, in the outline footer and on the recap.
- [AUDIENCE] — Who the lesson is for (default: "Tuesday evening beginners"). Shows on slide 1 and sets the reading level of the lesson copy.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/interactive-lesson-slides in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Paper `#F6F0E2` — App background around the stage
- Panel `#FFFBF1` — Sidebar, control bar, quiz option cards, overlays
- Line `#DDD2BA` — Hairlines and panel borders on paper
- Ink `#25302A` — Text on paper and panels
- Muted `#5E695D` — Secondary text on paper
- Board `#1F4A3C` — Chalk-green slide surface, the main stage color
- Board Deep `#173A2F` — Editor background and inset panels on the board
- Console `#122B23` — Console output pane
- Chalk `#F3F0E3` — Headlines, text and diagram lines on the board
- Chalk Dim `#B9C9B8` — Secondary text on the board, code comments
- Marker `#F5CF3A` — The one accent: current slide, primary buttons, active bar, underline. Text on it is Ink.
- Mint `#8FD3A8` — Correct feedback only, always with a check icon; also code strings
- Clay `#E58E73` — Wrong feedback and errors only, always with an X icon; also code numbers
- Sky `#9CCBE0` — Annotation swatch only, never in the UI
- Ledge `#C8B48F` — 6px chalk-tray strip under the slide

### Typography
- Display: slide headlines, big numbers, lesson name in the outline. Line height 1.02, tracking -0.01em.: Fraunces Variable (OFL), weights 500/600
- Text: UI, body copy, quiz options. Chosen for classroom legibility. Line height 1.45.: Atkinson Hyperlegible (OFL), weights 400/700
- Mono: editor, console, slide numbers, kickers, keyboard keys. Kickers are uppercase with 0.08em tracking.: JetBrains Mono Variable (OFL), weights 400/600

### Layout & motion
- Spacing: 4px base. App: sidebar 280px expanded, 60px rail collapsed; control bar 56px; 24px padding around the stage. On the 1280x720 slide canvas: 64px outer padding, 32px between major blocks, 16px inside groups. Canvas type sizes: headline 56px, title-slide headline 88px, question 38px, body 24px, options 22px, kicker 18px, code 18px.
- Radius: Slide surface 14px on top corners, square at the bottom where it meets the ledge. Cards, inputs and option rows 10px. Buttons 8px. Chips and the annotation toolbar are full pills. Photos on slides 6px with a 10px Panel border.
- Motion: Slide change: 180ms ease-out fade with a 12px horizontal shift in the direction of travel. Nothing else moves on the shell.
- Motion: Progress bar width eases over 240ms. The outline's current-slide bar snaps with no animation.
- Motion: Quiz feedback: the chosen option gets one 320ms outward ring pulse in Mint or Clay, and the explanation fades in over 160ms.
- Motion: Title underline: the Marker SVG stroke draws once over 600ms using stroke-dashoffset. Stepper bars move with a 220ms transform transition. Bars on slide 9 grow once over 400ms.
- Motion: Under prefers-reduced-motion: reduce, remove all of the above, including stepper autoplay. State changes apply instantly.
- Imagery: One shoot: warm documentary photographs in a classroom with low window light, oak, cloth-bound books and a green chalkboard, used on slides 1, 2 and 12 and for the instructor portrait. Photos sit on the board as printed pictures with a 10px Panel border, slight rotation and two semi-transparent paper tape strips drawn in CSS. All diagrams are original inline SVG with a rough chalk line (a feTurbulence plus feDisplacementMap filter at scale 2 on Chalk strokes). The board surface has a faint chalk smudge: two large radial gradients of Chalk at 4% plus an inline SVG feTurbulence noise at 5% opacity. No character illustrations.

## Pages & Sections
### [LESSON_TITLE] | [BRAND] (`index.html`)
1. **App shell** — Single-page app with hash routes #/slide/1 to #/slide/12. It always opens on the deck view with no splash, loader or landing section. If the hash is empty, slide 1 shows. Browser title is [LESSON_TITLE] | [BRAND]. The favicon is an inline SVG: a Board square with a Marker underline.
   Layout: Full viewport with no page scroll (height 100dvh). CSS grid with two columns: sidebar on the left, main column on the right. The main column has two rows: stage area (1fr, Paper background, 24px padding, slide centered) and control bar (56px). The slide sits on a 6px Ledge strip that is exactly slide width, like a chalk tray, with a soft shadow beneath (0 18px 40px rgba(37,48,42,0.18)).
   Motion: See Design. The sidebar width animates over 180ms when collapsing.
2. **Outline sidebar** — Header: 32px square brand mark (Board background, first letter of [BRAND] in Fraunces Chalk, a 3px Marker underline), then [BRAND] in 15px bold, then [COURSE_LABEL] in 13px Muted, then [LESSON_TITLE] in Fraunces 24px. Score row: the label 'Checks' and a pill reading '0/5' that counts correct checks, with a 5-segment bar under it where each segment is empty, Mint or Clay. Outline groups, with mono uppercase labels: Warm up (1 How Sorting Works, 2 Why order matters, 3 Check: doubling the shelf); The idea (4 Insertion sort, step by step, 5 Check: put the steps in order, 6 Check: how many shifts?); Hands on (7 Live code: sort the shelf, 8 Check: the easy case); Going further (9 Best and worst shelves, 10 Check: the hardest shelf, 11 Mark it up); Wrap up (12 Recap). Footer: 36px round instructor portrait, [INSTRUCTOR], the line 'Press ? for shortcuts' as a button, and a collapse button using the lucide PanelLeftClose icon. If the Credit section supplies a [CREDIT] link, place it in 12px Muted at the very bottom of this footer.
   Layout: 280px wide, Panel background, 1px Line right border, flex column, with the outline list scrolling on its own. Each row is 40px: mono number, 15px title truncated with an ellipsis, right-aligned state icon. Row icons by type at 16px in Muted before the title: Presentation for title, Shapes for concept, CircleHelp for checks, Code for code, Flag for recap. State icon: nothing when untouched, a Mint Check when correct, a Clay X when wrong, a Play icon after the code slide has been run, and a small Pen icon in Muted when that slide has marks. The current row has a Paper background and a 3px Marker bar on its left edge. Collapsed state is a 60px rail showing only slide numbers with state dots, plus the expand button. The collapsed state persists in localStorage.
   Motion: Width transition 180ms. Rows have a Paper hover background at 120ms.
3. **Control bar** — From left to right: Previous and Next buttons (ChevronLeft, ChevronRight); a progress bar; the slide number in mono as '7 / 12'; Draw (Pencil icon, label 'Draw'); Copy link (Link2 icon, label 'Copy link'); Shortcuts (Keyboard icon); Present (Maximize icon), which hides the sidebar and calls requestFullscreen inside try/catch, with Esc restoring. Copy link copies location.href with the Clipboard API and falls back to a hidden textarea and execCommand. For 1.6 seconds the label reads 'Link to slide 7 copied' with a Check icon and is announced through an aria-live region.
   Layout: 56px tall, Panel background, 1px Line top border, 16px side padding, single row with 12px gaps. The progress bar fills the free space: 6px tall, Line track, Marker fill, with 12 tick divisions, and clicking a position jumps to that slide. Previous is disabled on slide 1 and Next on slide 12. An active Draw button uses a Marker background with Ink text. Buttons are 36px tall with 8px radius, and show a 2px Ink focus ring.
   Motion: Progress fill 240ms. The confirmation label swaps without movement.
4. **Annotation layer and toolbar** — Draw mode works on every slide. Tools in order: Pen (4 canvas px, full opacity), Highlighter (22 canvas px, alpha 0.4, square caps), Eraser (removes any whole stroke the pointer touches), four swatches (Marker #F5CF3A, Chalk #F3F0E3, Clay #E58E73, Sky #9CCBE0), Undo (Undo2), Clear slide (Trash2), and Done (X). Marks are stored per slide as strokes with coordinates normalized from 0 to 1 against the slide surface, saved on pointerup, and restored when returning to the slide or reloading. Undo keeps up to 30 snapshots per slide. Slide 11 starts with instructor marks from its content entry, which can be erased like any other stroke.
   Layout: A canvas absolutely positioned over the slide surface, sized for devicePixelRatio and redrawn from strokes on any resize. It has pointer-events none outside draw mode so slide controls stay usable with marks visible. In draw mode it has pointer-events auto, touch-action none and a crosshair cursor, and slide controls are inert. Use Pointer Events with setPointerCapture and getCoalescedEvents, and smooth with quadratic curves through midpoints. The toolbar is a floating Panel pill with a 1px Line border and soft shadow, centered 16px above the bottom of the stage area, with 36px buttons. The active tool has a Marker background and the active swatch a 2px Ink ring.
   Motion: Toolbar fades in over 120ms.
5. **Keyboard shortcuts overlay** — Title: 'Keyboard shortcuts'. Rows: Left / Right or Page Up / Page Down: previous and next slide. Space: next slide. Home / End: first and last slide. O: toggle outline. D: toggle draw. P, H, E: pen, highlighter, eraser. Z or Cmd/Ctrl+Z: undo mark. 1 to 4: choose a quiz answer. C: copy link. F: present. ?: this list. Esc: close.
   Layout: Modal 640px wide, Panel background, 14px radius, over a scrim of rgba(37,48,42,0.45). Two-column grid of rows, with keys rendered as mono chips (Paper background, 1px Line border, 6px radius). Close button top right. Focus moves into the modal and returns on close.
   Motion: Fade over 120ms.
6. **Mobile layout (under 768px)** — A 52px top bar replaces the sidebar: menu button (Menu icon), [LESSON_TITLE] truncated, and the score pill. The menu button opens the outline as a 304px left drawer over a scrim, closing on scrim tap, Esc or choosing a slide. The bottom control bar keeps Previous, Next, the slide number, Draw and Copy link, with the progress bar as a 3px strip along its top edge; Present and Shortcuts are hidden. Touch targets are at least 44px.
   Layout: No scaled canvas. The Board surface fills the space between the bars edge to edge and scrolls vertically inside itself, with no page scroll and no horizontal overflow at 390px. Each slide becomes a single column with 20px padding: headline 32px, question 26px, body 17px, options 17px, code 14px. Photos go full width and unrotated. The stepper SVG scales to width, with controls wrapping beneath it. The code slide stacks the editor (height 300px) above the console (min-height 180px). The annotation canvas covers the full scrollable slide height and locks scrolling while in draw mode, and the toolbar wraps to two rows above the control bar.
   Motion: Drawer slides in over 180ms; instant under reduced motion.
7. **Slide 1: Title (#/slide/1)** — Kicker in mono: [COURSE_LABEL]. Headline: [LESSON_TITLE], with a hand-drawn Marker SVG underline beneath the last word. Subhead: 'Put eight books in order by hand, then teach a computer to do it.' Instructor row: 56px round portrait, [INSTRUCTOR], then '[AUDIENCE] · Room 3 · 45 minutes'. Primary button: 'Start the lesson' with ArrowRight, going to #/slide/2. Secondary text button: 'Jump to live code', going to #/slide/7. Right side: the desk photo, and a Panel chip overlapping its lower-left corner that reads '12 slides · 5 checks · 1 live code'. Along the bottom of the slide, eight chalk SVG bars of heights 5, 2, 8, 3, 7, 1, 6, 4.
   Layout: Canvas split: left column 660px holds kicker, headline at 88px, subhead at 26px, instructor row and buttons, vertically centered. Right column is the 500x375 photo rotated -1.5deg with a Panel border and two tape strips, sitting in the upper right. The chalk bars run along the bottom right under the photo, 460px wide and 110px tall, with the third bar filled Marker. This must read as a rich first screen, never type on a flat background.
   Motion: Underline draws once on first view. Standard slide transition.
8. **Slide 2: Why order matters, concept with photo (#/slide/2)** — Kicker: 'Warm up'. Headline: 'A messy shelf makes every search slow.' Body: 'Looking for one title on an unsorted shelf means checking book after book. Sort the shelf and you can open in the middle, see which half to keep, and ignore the rest.' Two big stats: '1,000' with the label 'looks at most on 1,000 unsorted books' and '10' in Marker with the label 'looks at most once they are sorted'. Footnote: 'Halve 1,000 ten times and you are down to one book.'
   Layout: Left 56%: kicker, headline, body, then the two stats side by side in Fraunces 84px, separated by a 1px Chalk line at 30% opacity. Right 44%: the shelf photo at 4:3, rotated 1deg, with a Panel border and tape strips.
   Motion: Standard slide transition only.
9. **Quiz behavior (slides 3, 6 and 10)** — Clicking an option or pressing 1 to 4 answers immediately and locks all options. The chosen option shows Mint with a Check or Clay with an X. If the choice was wrong, the correct option also gets a Mint outline. An explanation panel appears with a one-line verdict and the explanation, a 'Try again' button that unlocks the options and clears the result, and a 'Next slide' primary button. The sidebar score and segment bar update at once. Each answer record stores the selection, whether it is correct, and the attempt count.
   Layout: Left 5/12 of the canvas: mono kicker 'Check 1 of 5' and the question in Fraunces 38px. Right 7/12: a vertical stack of four 72px Panel rows with Ink text. Each has a mono letter A to D in a 36px circle with a 1px Line border, then the option text. Hover and focus give a 2px Marker border. All option rows look identical until answered: no colored tiles and no shapes. The explanation sits below the options as a Board Deep inset with Chalk text and 10px radius.
   Motion: One 320ms ring pulse on the chosen option. Explanation fades in over 160ms.
10. **Slide 3: Check, doubling the shelf (#/slide/3)** — Kicker 'Check 1 of 5'. Question: 'A sorted shelf grows from 1,000 books to 2,000. Using the halving method, how many extra looks do you need at most?' A: 'About 1 more' (correct). B: 'About 10 more'. C: 'About 1,000 more'. D: 'Twice as many'. Correct verdict: 'Right.' Wrong verdict: 'Not quite.' Explanation for both: 'One look halves the shelf, so 2,000 books are back to 1,000 after a single look. From there nothing changes.'
   Layout: Uses the quiz layout.
   Motion: Uses the quiz motion.
11. **Slide 4: Insertion sort stepper, concept with diagram (#/slide/4)** — Headline: 'Take the next book and slide it into place.' A stepper with 8 steps over the shelf. Captions and running shifts: (1) values 5 2 8 3 7 1 6 4, 'The first book alone is a sorted shelf of one.', 0 shifts. (2) values 2 5 8 3 7 1 6 4, 'Pick up 2. The 5 is larger, so it moves right.', 1. (3) values 2 5 8 3 7 1 6 4, 'Pick up 8. Nothing is larger, so it stays.', 1. (4) values 2 3 5 8 7 1 6 4, 'Pick up 3. The 5 and 8 move right.', 3. (5) values 2 3 5 7 8 1 6 4, 'Pick up 7. Only the 8 moves.', 4. (6) values 1 2 3 5 7 8 6 4, 'Pick up 1. Everything moves. Five shifts for one book.', 9. (7) values 1 2 3 5 6 7 8 4, 'Pick up 6. The 7 and 8 move.', 11. (8) values 1 2 3 4 5 6 7 8, 'Pick up 4. Four books move, and the shelf is sorted.', 15. Controls: Back, Next, Play / Pause (1200ms per step, disabled under reduced motion), step dots, and a counter 'Shifts so far: 15' in mono.
   Layout: Headline at the top, 44px. Below it, an SVG diagram 1152px wide and 340px tall with 8 bars on a chalk baseline. Bar width 96px, height proportional to the value, number in mono above each bar. Sorted bars are filled Chalk at 85% with Ink numbers, the active bar is filled Marker, and unsorted bars are rough Chalk outlines with no fill. Below the diagram, a row: caption at 24px on the left and controls plus the counter on the right. The stepper has its own buttons and does not capture the arrow keys, which always change slides.
   Motion: Each bar is keyed by its value and moves to its new position with a 220ms transform. Autoplay stops at the last step.
12. **Slide 5: Reorder check (#/slide/5)** — Kicker 'Check 2 of 5'. Question: 'Put the steps of insertion sort in order.' Rows in their starting order: 'Compare it with the sorted books, moving right to left'; 'Drop the book into the gap and repeat'; 'Treat the first book as a sorted shelf of one'; 'Shift each larger book one place right'; 'Pick up the next unsorted book'. Correct order: Treat the first book; Pick up the next; Compare it; Shift each larger; Drop the book. Button: 'Check order'. Feedback marks each row with a Mint Check or Clay X by position. Correct verdict: 'That is the whole algorithm.' Wrong verdict: 'Close. The marked rows are out of place.' Explanation: 'You cannot shift books until you have compared them, and the drop always comes last.' 'Try again' keeps the current order and clears the marks.
   Layout: Left 4/12: kicker and question. Right 8/12: a stack of five 64px Panel rows, each with a GripVertical handle, a position number in mono, the step text, and up and down arrow buttons for keyboard and touch users. Drag with Pointer Events on the handle (touch-action none on the handle only). The dragged row lifts with a shadow and a 2px Marker border, and other rows make room.
   Motion: Rows shift with a 160ms transform; instant under reduced motion. One 320ms pulse on Check.
13. **Slide 6: Check, how many shifts (#/slide/6)** — Kicker 'Check 3 of 5'. Question: 'The sorted part is 2 3 5 8. The next book is 4. How many books shift right?' Include a small chalk SVG of the four sorted bars and a Marker bar labeled 4 under the question. A: '1'. B: '2' (correct). C: '3'. D: '4'. Explanation: 'Only books larger than 4 move: the 5 and the 8. The 2 and 3 stay put.'
   Layout: Uses the quiz layout, with the 360x120 SVG under the question in the left column.
   Motion: Uses the quiz motion.
14. **Slide 7: Live code playground (#/slide/7)** — Headline: 'Now teach the computer.' Task line: 'Press Run to watch each pass. Then change one character so the shelf sorts largest first.' Editor file label: 'sandbox.js'. Starter code, exactly:

// Sort the shelf, smallest book first.
function insertionSort(books) {
  for (let i = 1; i < books.length; i++) {
    const current = books[i];
    let gap = i;
    while (gap > 0 && books[gap - 1] > current) {
      books[gap] = books[gap - 1]; // shift right
      gap--;
    }
    books[gap] = current; // drop into the gap
    console.log("pass " + i + ":", books.join(" "));
  }
  return books;
}

const shelf = [5, 2, 8, 3, 7, 1, 6, 4];
console.log("start: ", shelf.join(" "));
console.log("sorted:", insertionSort(shelf).join(" "));

Buttons: 'Run' (Play icon, Marker background, shows a Cmd/Ctrl+Enter hint) and 'Reset' (RotateCcw icon, ghost button; restores the starter code and clears the console). Console header: 'Console' with a status at right: 'Not run yet', 'Ran in 3 ms' or 'Error on line 6'. Empty console text: 'Press Run to see each pass.' Log lines render in Chalk mono. Errors render in Clay with an X icon, showing the message and line number. Timeout message: 'Stopped after 3 seconds. Look for a loop that never ends.' Edits persist in localStorage. Running the slide adds the Play state icon in the outline.
   Layout: Top 96px: headline at 40px and the task line at 22px. Below it, two panes filling the remaining canvas with a 16px gap. Left 60%: Board Deep editor with a 44px toolbar (file label on the left, Run and Reset on the right), CodeMirror at 18px JetBrains Mono, scrolling internally. Right 40%: Console background pane with a 44px header and scrolling log at 18px. Both have 10px radius and a 1px Chalk border at 15% opacity. Clicking in the editor must place the caret correctly while the canvas is scaled.
   Motion: Status text swaps instantly. New console lines appear without animation.
15. **Slide 8: Fill-in check (#/slide/8)** — Kicker 'Check 4 of 5'. Sentence with two inputs: 'On a shelf that is already sorted, insertion sort compares each book once with its neighbor, so 8 books take [ ] comparisons and [ ] shifts.' Answers: 7 (also accepts 'seven') and 0 (also accepts 'zero' or 'none'), trimmed and case-insensitive. Button: 'Check answers', also triggered by Enter. Each input shows a Mint Check or Clay X. Correct verdict: 'Exactly. The best case does almost no work.' Wrong verdict: 'Not yet. Trace the first two books by hand.' Explanation: 'Every book after the first gets one comparison, finds a smaller neighbor, and stays put.' 'Try again' clears only the wrong inputs.
   Layout: Centered column 960px wide. Kicker, then the sentence in Fraunces 38px with line height 1.4, with inline 96px inputs in mono, transparent background, Marker 3px bottom border, Chalk text and a centered value. Below: the button and then the explanation inset as in the quiz layout.
   Motion: One 320ms pulse on each input after Check. Explanation fades in over 160ms.
16. **Slide 9: Best and worst shelves, concept with bars (#/slide/9)** — Kicker: 'Going further'. Headline: 'Same eight books, very different work.' Horizontal bars with labels and values: 'Already sorted' 0 shifts; 'Our shelf from earlier' 15 shifts; 'Exactly reversed' 28 shifts. Side callout: '499,500' in Fraunces 72px Marker, with the label 'shifts to sort 1,000 reversed books'. Closing line: 'That is why insertion sort is great for short or nearly sorted lists, and why long lists need something faster. That is next lesson.'
   Layout: Left 66%: kicker, headline, then three rows of SVG bars. Label 22px above each bar, a 40px tall bar with a rough Chalk outline, filled Chalk at 85%, width proportional to 28, value in mono at the end. A zero value renders as a 4px tick. Right 34%: Board Deep inset with the callout and closing line.
   Motion: Bars grow from zero once over 400ms the first time the slide is shown.
17. **Slide 10: Check, the hardest shelf (#/slide/10)** — Kicker 'Check 5 of 5'. Question: 'Which shelf makes insertion sort do the most shifts?' Options in mono: A: '1 2 3 4 5 6'. B: '2 1 4 3 6 5'. C: '6 5 4 3 2 1' (correct). D: '1 2 3 6 5 4'. Explanation: 'In reversed order every book has to pass all the books before it. That is 15 shifts for six books.'
   Layout: Uses the quiz layout, with option text in JetBrains Mono.
   Motion: Uses the quiz motion.
18. **Slide 11: Mark it up, board slide (#/slide/11)** — Kicker: 'Your turn at the board'. Headline: 'Circle every book that has to shift.' Body: 'The sorted part is 2 4 7 9. The next book is 5. I have marked where it lands. Press D and finish the job.' Signed '[INSTRUCTOR]'. Diagram: five bars for 2, 4, 7, 9 and 5, with the 5 in Marker. Seeded marks in the content entry, in Marker with the Pen tool: a loose hand-drawn ellipse around the 5 bar and a curved arrow from it to the gap between the 4 and the 7. A 'Start drawing' button (Pencil icon) turns on draw mode and selects the Pen.
   Layout: Left 34%: kicker, headline at 48px, body and button. Right 66%: a large open area of bare board holding the SVG bars on a chalk baseline with plenty of room for marks. Bars are 110px wide.
   Motion: Standard slide transition only. Seeded marks appear without animation.
19. **Slide 12: Recap (#/slide/12)** — Headline: 'What you can do now'. Score block: live score such as '4 / 5' in Fraunces 96px, the line '3 on the first try', and five chips labeled Check 1 to Check 5, each showing untouched, correct or wrong state and linking to that slide. With nothing answered it reads '0 / 5' and 'Five checks are waiting for you.' Buttons: 'Retry what I missed' (goes to the first wrong or untouched check; hidden at 5 of 5) and a 'Reset my progress' text button that clears answers, code and marks after an inline confirm. Takeaways: 'Insertion sort grows a sorted part one book at a time.' 'The starting order sets the work: 0 shifts when sorted, 28 when reversed, for eight books.' 'Sorted data is what makes fast search possible.' Homework card: photo of hands arranging cards, then 'Before Tuesday: sort ten cards by this method, then again from reversed order. Count the shifts and bring both numbers.' Next: 'Next up: Lesson 3, merge sort. Tuesday at 6:30 pm.' Office hours with the small portrait: '[INSTRUCTOR], Thursdays 5:30 to 6:15 pm, Room 3, 14 Tallow Street, [BRAND].'
   Layout: Three columns with 32px gaps and the headline above. Left 30%: score block and buttons. Middle 34%: takeaways as a numbered list with mono numerals and 1px Chalk dividers at 20% opacity. Right 36%: a Panel card with Ink text, the 16:9 crop of the photo on top, then homework, next lesson and office hours.
   Motion: Standard slide transition only. The score does not count up.

## Assets
- image: Download https://media.vibefather.ai/assets/979b73ac-0de6-4168-9126-974bb813156d/lesson-desk.webp to public/images/lesson-desk.webp. Alt: 'Stack of plain cloth-bound books and chalk on an oak classroom desk in front of a green chalkboard'. Used on slide 1. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/979b73ac-0de6-4168-9126-974bb813156d/instructor.webp to public/images/instructor.webp. Alt: 'The lesson instructor at a green chalkboard, seen from behind'. Used on slide 1, the outline footer and slide 12. A fictional person and a placeholder for the user's own photo. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/979b73ac-0de6-4168-9126-974bb813156d/uneven-shelf.webp to public/images/uneven-shelf.webp. Alt: 'Wooden shelf of plain books in uneven heights and no particular order'. Used on slide 2. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/979b73ac-0de6-4168-9126-974bb813156d/arranging-cards.webp to public/images/arranging-cards.webp. Alt: 'Hands arranging blank index cards in a row on an oak desk'. Used on the slide 12 homework card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Drawn in code as original inline SVG or CSS: all bars and diagrams, the title underline, tape strips, chalk texture, the brand mark and the favicon. No image files.
- icon: lucide-react (ISC), installed from npm: PanelLeftClose, PanelLeftOpen, Presentation, Shapes, CircleHelp, Code, Flag, Check, X, Play, Pause, Pen, Pencil, Highlighter, Eraser, Undo2, Trash2, Link2, Keyboard, Maximize, ChevronLeft, ChevronRight, ArrowRight, RotateCcw, GripVertical, ChevronUp, ChevronDown, Menu.
- font: Self-host through Fontsource npm packages, imported in src/main.tsx: @fontsource-variable/fraunces, @fontsource/atkinson-hyperlegible (400, 700), @fontsource-variable/jetbrains-mono. All OFL-1.1.
- image: Create ASSETS.md at the project root listing every third-party file: path, source URL, author and license. The four photos above are credited as 'Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template'. Also list the fonts (OFL-1.1) and lucide-react (ISC).

## Don'ts
- No backend: no server code, API routes, databases, auth, third-party APIs or forms that submit anywhere. Quiz answers, code and annotations stay in localStorage.
- No CDN script or link tags, no analytics, no network requests at runtime. Download all images into the project and never hotlink.
- Self-host every font through Fontsource. Never load from fonts.googleapis.com, fonts.gstatic.com, Adobe Fonts or any other CDN. No commercial classroom or handwriting fonts.
- Build static files to dist/ with one command, using relative asset paths (base './'). No source maps and no src/ in dist/. Keep dist/ under 20 MB.
- Internal navigation uses hash routes on ./index.html, never a bare directory path.
- No console errors at 1440x900 or 390x844. Learner code errors must be caught and shown in the slide console, never leaked to the page console.
- The code iframe must never have allow-same-origin, network access or access to the parent page.
- Respect prefers-reduced-motion: no transitions, pulses, draw-in effects or stepper autoplay.
- Do not add a landing page, marketing hero, pricing section, sign-up or splash screen. The app opens on the deck.
- No logos, product names, default themes or starter deck layouts of any existing presentation tool, slide framework or quiz platform.
- No game-show quiz look: no answer-shape and color pairings, colored answer tiles, lobby or podium screens, countdown timers, leaderboards, mascots or sound effects. All options look the same until answered.
- No copy, lesson text, diagrams or exercises from real textbooks, online courses, school curricula or published lectures. All lesson content is invented.
- No real schools, school crests, exam board marks or real teachers. The instructor and school are invented.
- No editor themes, icons or branding that identify a specific code editor or online playground. Use the original syntax theme from this prompt.
- No mascots, character illustrations or signature drawings from learning apps. Diagrams are drawn in SVG or CSS for this template.
- No lorem ipsum. Do not add accent colors beyond Marker: Mint and Clay are for feedback only, and Sky is for annotation only.
- No SEO work: a plain title with [BRAND] and a favicon are enough. No mention of VibeFather in the site except the optional [CREDIT] link. All copy is in US English.

---
— Prompt by VibeFather · https://vibefather.ai/t/interactive-lesson-slides · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
