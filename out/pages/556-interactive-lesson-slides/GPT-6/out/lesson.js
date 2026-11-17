/**
 * @typedef {{kind: 'title', title: string, kicker: string, body: string}} TitleSlide
 * @typedef {{kind: 'concept', variant: 'photo'|'stepper'|'bars'|'board', title: string, kicker: string, body?: string}} ConceptSlide
 * @typedef {{kind: 'quiz', title: string, kicker: string, options: string[], correct: number, explanation: string}} QuizSlide
 * @typedef {{kind: 'reorder', title: string, kicker: string, items: string[], correct: number[], explanation: string}} ReorderSlide
 * @typedef {{kind: 'fill', title: string, kicker: string, explanation: string}} FillSlide
 * @typedef {{kind: 'code', title: string, kicker: string, body: string}} CodeSlide
 * @typedef {{kind: 'recap', title: string, kicker: string}} RecapSlide
 * @typedef {TitleSlide|ConceptSlide|QuizSlide|ReorderSlide|FillSlide|CodeSlide|RecapSlide} Slide
 */

export const lesson =
{
    brand: "Tallow Street Code School",
    title: "How Sorting Works",
    course: "Intro to Programming, Unit 4, Lesson 2",
    instructor: "Ines Halloran",
    audience: "Tuesday evening beginners",
    credit: { label: "Template by VibeFather", url: "https://vibefather.ai/t/interactive-lesson-slides" },
    images:
    {
        desk: { src: "./images/lesson-desk.webp", alt: "Stack of plain cloth-bound books and chalk on an oak classroom desk in front of a green chalkboard" },
        instructor: { src: "./images/instructor.webp", alt: "The lesson instructor at a green chalkboard, seen from behind" },
        shelf: { src: "./images/uneven-shelf.webp", alt: "Wooden shelf of plain books in uneven heights and no particular order" },
        cards: { src: "./images/arranging-cards.webp", alt: "Hands arranging blank index cards in a row on an oak desk" }
    }
};

export const ui =
{
    checks: "Checks", previous: "Previous slide", next: "Next slide", draw: "Draw", done: "Done",
    copy: "Copy link", copied: n => `Link to slide ${n} copied`, copyFailed: "Copy this address from your browser.",
    shortcuts: "Keyboard shortcuts", present: "Present", outline: "Toggle outline", menu: "Open lesson outline",
    start: "Start the lesson", jump: "Jump to live code", chip: "12 slides · 5 checks · 1 live code",
    location: "Room 3 · 45 minutes", warmup: "A little order. A lot less work.",
    instructor: "YOUR INSTRUCTOR", shortcutsHint: "Press ? for shortcuts", ready: "YOUR EVENING CLASSROOM",
    first: "Right.", wrong: "Not quite.", again: "Try again", nextSlide: "Next slide",
    checkOrder: "Check order", checkAnswers: "Check answers",
    reorderRight: "That is the whole algorithm.", reorderWrong: "Close. The marked rows are out of place.",
    fillRight: "Exactly. The best case does almost no work.", fillWrong: "Not yet. Trace the first two books by hand.",
    compare: "comparisons and", shiftSentence: "shifts.", fillStart: "On a shelf that is already sorted, insertion sort compares each book once with its neighbor, so 8 books take",
    comparisons: "Number of comparisons", shifts: "Number of shifts",
    back: "Back", stepNext: "Next step", play: "Play", pause: "Pause",
    step: (a, b) => `STEP ${a} OF ${b}`, shiftCount: n => `Shifts so far: ${n}`,
    run: "Run", reset: "Reset", file: "sandbox.js", console: "Console", notRun: "Not run yet",
    emptyConsole: "Press Run to see each pass.", running: "Running…", ran: n => `Ran in ${n} ms`,
    errorLine: n => `Error on line ${n}`, timeout: "Stopped after 3 seconds. Look for a loop that never ends.",
    editorLabel: "Editable JavaScript", sandbox: "LOCAL SANDBOX · NO NETWORK", malformedMessage: "Code could not be run.",
    barsLabel: "Books arranged by height", sorted: "Sorted", active: "Current book", unsorted: "Not sorted yet",
    shiftLabel: "shifts", stats: ["looks at most on 1,000 unsorted books", "looks at most once they are sorted"],
    footnote: "Halve 1,000 ten times and you are down to one book.",
    barLabels: ["Already sorted", "Our shelf from earlier", "Exactly reversed"],
    bigShifts: "shifts to sort 1,000 reversed books",
    conclusion: "That is why insertion sort is great for short or nearly sorted lists, and why long lists need something faster. That is next lesson.",
    markStart: "Start drawing", pen: "Pen", highlighter: "Highlighter", eraser: "Eraser",
    colors: ["Yellow marker", "White chalk", "Clay", "Sky"], undo: "Undo mark", clear: "Clear slide",
    score: n => `${n} / 5`, firstTry: n => `${n} on the first try`, waiting: "Five checks are waiting for you.",
    retry: "Retry what I missed", resetProgress: "Reset my progress", confirmReset: "Clear all answers, code and marks?",
    confirm: "Yes, reset", cancel: "Keep learning", check: n => `Check ${n}`, takeawaysTitle: "TAKE THESE WITH YOU",
    takeaways:
    [
        "Insertion sort grows a sorted part one book at a time.",
        "The starting order sets the work: 0 shifts when sorted, 28 when reversed, for eight books.",
        "Sorted data is what makes fast search possible."
    ],
    homeworkLabel: "BEFORE TUESDAY",
    homework: "Sort ten cards by this method, then again from reversed order. Count the shifts and bring both numbers.",
    nextLesson: "Next up: Lesson 3, merge sort. Tuesday at 6:30 pm.",
    office: "Thursdays 5:30 to 6:15 pm, Room 3, 14 Tallow Street",
    close: "Close", drawerClose: "Close lesson outline", jumpSlide: n => `Go to slide ${n}`,
    up: "Move step up", down: "Move step down", grip: "Drag to reorder",
    correct: "Correct", incorrect: "Not correct yet", untouched: "Not answered", removeMarks: "Marks on this slide",
    progress: "Lesson progress", reduced: "Autoplay is off with reduced motion.",
    helpRows:
    [
        ["← / →", "Previous / next slide"], ["PgUp / PgDn", "Previous / next slide"],
        ["Space", "Next slide"], ["Home / End", "First / last slide"], ["O", "Toggle outline"],
        ["D", "Toggle draw"], ["P / H / E", "Pen / highlighter / eraser"], ["Z / Ctrl+Z", "Undo mark"],
        ["1–4", "Choose a quiz answer"], ["C", "Copy slide link"], ["F", "Present"], ["Esc", "Close"],
        ["Ctrl / ⌘ + Enter", "Run code in the editor"], ["?", "This list"]
    ]
};

export const outline =
[
    { title: "Warm up", slides: [[1, "How Sorting Works"], [2, "Why order matters"], [3, "Check: doubling the shelf"]] },
    { title: "The idea", slides: [[4, "Insertion sort, step by step"], [5, "Check: put the steps in order"], [6, "Check: how many shifts?"]] },
    { title: "Hands on", slides: [[7, "Live code: sort the shelf"], [8, "Check: the easy case"]] },
    { title: "Going further", slides: [[9, "Best and worst shelves"], [10, "Check: the hardest shelf"], [11, "Mark it up"]] },
    { title: "Wrap up", slides: [[12, "Recap"]] }
];

export const starterCode = `// Sort the shelf, smallest book first.
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
console.log("sorted:", insertionSort(shelf).join(" "));`;

export const steps =
[
    { values: [5, 2, 8, 3, 7, 1, 6, 4], sortedUpTo: 0, active: 5, shifts: 0, caption: "The first book alone is a sorted shelf of one." },
    { values: [2, 5, 8, 3, 7, 1, 6, 4], sortedUpTo: 1, active: 2, shifts: 1, caption: "Pick up 2. The 5 is larger, so it moves right." },
    { values: [2, 5, 8, 3, 7, 1, 6, 4], sortedUpTo: 2, active: 8, shifts: 1, caption: "Pick up 8. Nothing is larger, so it stays." },
    { values: [2, 3, 5, 8, 7, 1, 6, 4], sortedUpTo: 3, active: 3, shifts: 3, caption: "Pick up 3. The 5 and 8 move right." },
    { values: [2, 3, 5, 7, 8, 1, 6, 4], sortedUpTo: 4, active: 7, shifts: 4, caption: "Pick up 7. Only the 8 moves." },
    { values: [1, 2, 3, 5, 7, 8, 6, 4], sortedUpTo: 5, active: 1, shifts: 9, caption: "Pick up 1. Everything moves. Five shifts for one book." },
    { values: [1, 2, 3, 5, 6, 7, 8, 4], sortedUpTo: 6, active: 6, shifts: 11, caption: "Pick up 6. The 7 and 8 move." },
    { values: [1, 2, 3, 4, 5, 6, 7, 8], sortedUpTo: 7, active: 4, shifts: 15, caption: "Pick up 4. Four books move, and the shelf is sorted." }
];

export const checks = [3, 5, 6, 8, 10];
export const swatches = ["#F5CF3A", "#F3F0E3", "#E58E73", "#9CCBE0"];

/** @type {Slide[]} */
export const slides =
[
    { kind: "title", kicker: lesson.course, title: lesson.title, body: "Put eight books in order by hand, then teach a computer to do it." },
    { kind: "concept", variant: "photo", kicker: "Warm up", title: "A messy shelf makes every search slow.", body: "Looking for one title on an unsorted shelf means checking book after book. Sort the shelf and you can open in the middle, see which half to keep, and ignore the rest." },
    { kind: "quiz", kicker: "Check 1 of 5", title: "A sorted shelf grows from 1,000 books to 2,000. Using the halving method, how many extra looks do you need at most?", options: ["About 1 more", "About 10 more", "About 1,000 more", "Twice as many"], correct: 0, explanation: "One look halves the shelf, so 2,000 books are back to 1,000 after a single look. From there nothing changes." },
    { kind: "concept", variant: "stepper", kicker: "The idea", title: "Take the next book and slide it into place." },
    { kind: "reorder", kicker: "Check 2 of 5", title: "Put the steps of insertion sort in order.", items: ["Compare it with the sorted books, moving right to left", "Drop the book into the gap and repeat", "Treat the first book as a sorted shelf of one", "Shift each larger book one place right", "Pick up the next unsorted book"], correct: [2, 4, 0, 3, 1], explanation: "You cannot shift books until you have compared them, and the drop always comes last." },
    { kind: "quiz", kicker: "Check 3 of 5", title: "The sorted part is 2 3 5 8. The next book is 4. How many books shift right?", options: ["1", "2", "3", "4"], correct: 1, explanation: "Only books larger than 4 move: the 5 and the 8. The 2 and 3 stay put." },
    { kind: "code", kicker: "Hands on", title: "Now teach the computer.", body: "Press Run to watch each pass. Then change one character so the shelf sorts largest first." },
    { kind: "fill", kicker: "Check 4 of 5", title: "The easy case.", explanation: "Every book after the first gets one comparison, finds a smaller neighbor, and stays put." },
    { kind: "concept", variant: "bars", kicker: "Going further", title: "Same eight books, very different work." },
    { kind: "quiz", kicker: "Check 5 of 5", title: "Which shelf makes insertion sort do the most shifts?", options: ["1 2 3 4 5 6", "2 1 4 3 6 5", "6 5 4 3 2 1", "1 2 3 6 5 4"], correct: 2, explanation: "In reversed order every book has to pass all the books before it. That is 15 shifts for six books." },
    { kind: "concept", variant: "board", kicker: "Your turn at the board", title: "Circle every book that has to shift.", body: "The sorted part is 2 4 7 9. The next book is 5. I have marked where it lands. Press D and finish the job." },
    { kind: "recap", kicker: lesson.brand, title: "What you can do now" }
];

export function seededMarks(mobile = false)
{
    const cx = mobile ? 0.83 : 0.88;
    const cy = mobile ? 0.80 : 0.64;
    const rx = mobile ? 0.10 : 0.055;
    const ry = mobile ? 0.085 : 0.15;
    return [
        { tool: "pen", color: swatches[0], points: Array.from({ length: 49 }, (_, i) => [cx + rx * Math.cos(i * Math.PI / 24), cy + ry * Math.sin(i * Math.PI / 24)]) },
        { tool: "pen", color: swatches[0], points: [[cx, cy - ry], [cx - .03, cy - ry - .07], [cx - .10, cy - ry - .11], [cx - .19, cy - ry - .05], [cx - .22, cy + .03], [cx - .24, cy], [cx - .22, cy + .03], [cx - .19, cy]] }
    ];
}
