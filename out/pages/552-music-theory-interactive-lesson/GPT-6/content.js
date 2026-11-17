export const content =
{
    brand: "Overtone Night School",
    topic: "Intervals and chords",
    instructor: "Marisol Adeyemi",
    nav: ["Intervals", "Circle", "Chords", "Quiz"],
    hero:
    {
        eyebrow: "Intervals and chords · a free lesson",
        title: ["Press a key.", "Hear why", "it works."],
        lead: "For beginners who play by ear and want to name what they hear. Four short chapters, about 20 minutes, no sign-up.",
        start: "Start the lesson",
        quiz: "Jump to the quiz",
        chips: ["4 chapters", "20 minutes", "Keyboard, mouse or touch"],
        readout: "Press any key, or try A S D F G H J on your keyboard.",
        circleLabel: "The circle of fifths",
        circleHint: "Twelve notes. A world of possibilities.",
        pianoFoot: ["YOUR FIRST INSTRUMENT IS RIGHT HERE.", "24 KEYS · INFINITE POSSIBILITIES"],
        octaveHint: "Z / X · OCTAVE"
    },
    colors:
    {
        title: "Every note has a color.",
        body: "It keeps that color on this whole page. Neighbors in this row are a perfect fifth apart, so colors that look close also sound close."
    },
    chapters:
    [
        {id: "intervals", number: "01", kicker: "The space between", title: "Intervals are distances.", body: "An interval is the gap between two notes, counted in half steps. One half step is the very next key, black or white. Count seven from C and you land on G.", extra: "Each gap has its own feel. Learn the feel first and the names follow.", helper: "Press any key to move the bottom note."},
        {id: "circle", number: "02", kicker: "Find your way around", title: "Fifths go in a circle.", body: "Start anywhere and climb by perfect fifths. After twelve steps you are back where you began. Each step clockwise adds one sharp to the key; each step the other way adds one flat.", extra: "Keys next to each other share almost all their notes, which is why they sound like family.", helper: "Drag the ring, tap a key, or use the arrow keys."},
        {id: "chords", number: "03", kicker: "A little harmony", title: "Stack notes, change the mood.", body: "A chord is three or more notes played together. Move one note by one half step and the whole mood flips.", extra: "Same notes. A different feeling. Build it, then hear it.", helper: "Pick a root. Try a different mood."},
        {id: "quiz", number: "04", kicker: "Listen first", title: "Now use your ears.", body: "Eight rounds. Listen, then answer. You can replay each sound as often as you like."}
    ],
    intervals:
    [
        ["Minor second", "tense like a held breath"],
        ["Major second", "a step forward"],
        ["Minor third", "soft and a little sad"],
        ["Major third", "bright and settled"],
        ["Perfect fourth", "open like a call"],
        ["Tritone", "restless and wants to move"],
        ["Perfect fifth", "wide and stable"],
        ["Minor sixth", "bittersweet"],
        ["Major sixth", "warm and open"],
        ["Minor seventh", "bluesy and unresolved"],
        ["Major seventh", "dreamy, almost home"],
        ["Octave", "the same note, higher"]
    ],
    qualities:
    [
        {id: "major", name: "Major", steps: [0, 4, 7], degrees: [1, 3, 5], labels: ["Root", "Major 3rd", "Perfect 5th"], mood: "bright and settled"},
        {id: "minor", name: "Minor", steps: [0, 3, 7], degrees: [1, 3, 5], labels: ["Root", "Minor 3rd", "Perfect 5th"], mood: "soft and inward"},
        {id: "diminished", name: "Diminished", steps: [0, 3, 6], degrees: [1, 3, 5], labels: ["Root", "Minor 3rd", "Diminished 5th"], mood: "tight and unstable"},
        {id: "augmented", name: "Augmented", steps: [0, 4, 8], degrees: [1, 3, 5], labels: ["Root", "Major 3rd", "Augmented 5th"], mood: "floating and unresolved"},
        {id: "sus2", name: "Sus2", steps: [0, 2, 7], degrees: [1, 2, 5], labels: ["Root", "Major 2nd", "Perfect 5th"], mood: "open, neither happy nor sad"},
        {id: "sus4", name: "Sus4", steps: [0, 5, 7], degrees: [1, 4, 5], labels: ["Root", "Perfect 4th", "Perfect 5th"], mood: "leaning, wants to land"},
        {id: "dominant7", name: "Dominant 7th", steps: [0, 4, 7, 10], degrees: [1, 3, 5, 7], labels: ["Root", "Major 3rd", "Perfect 5th", "Minor 7th"], mood: "restless, pushes home"},
        {id: "major7", name: "Major 7th", steps: [0, 4, 7, 11], degrees: [1, 3, 5, 7], labels: ["Root", "Major 3rd", "Perfect 5th", "Major 7th"], mood: "warm and dreamy"},
        {id: "minor7", name: "Minor 7th", steps: [0, 3, 7, 10], degrees: [1, 3, 5, 7], labels: ["Root", "Minor 3rd", "Perfect 5th", "Minor 7th"], mood: "mellow and smooth"}
    ],
    wins:
    [
        "Small win: play a perfect fifth. Press any key, then the key seven half steps above it.",
        "Small win: turn the circle to the key with three sharps.",
        "Small win: turn a major chord into a minor one.",
        "Small win: finish all eight ear-training rounds."
    ],
    progressions:
    [
        {name: "I V vi IV", degrees: [0, 4, 5, 3]},
        {name: "ii V I", degrees: [1, 4, 0]},
        {name: "I IV V", degrees: [0, 3, 4]}
    ],
    quiz:
    [
        {kind: "interval", value: 4, answer: "Major third", options: ["Minor third", "Major third", "Perfect fourth", "Perfect fifth"], note: "A major third: four half steps, bright and settled."},
        {kind: "interval", value: 7, answer: "Perfect fifth", options: ["Perfect fourth", "Perfect fifth", "Major sixth", "Octave"], note: "A perfect fifth: seven half steps, wide and stable."},
        {kind: "chord", value: "major", answer: "Major", options: ["Major", "Minor", "Diminished", "Augmented"], note: "A major chord: a major third with a minor third on top."},
        {kind: "interval", value: 3, answer: "Minor third", options: ["Minor third", "Major third", "Perfect fifth", "Minor seventh"], note: "A minor third: three half steps, soft and a little sad."},
        {kind: "chord", value: "minor", answer: "Minor", options: ["Major", "Minor", "Diminished", "Augmented"], note: "A minor chord: same outer notes as major, with the middle note a half step lower."},
        {kind: "interval", value: 12, answer: "Octave", options: ["Perfect fifth", "Major sixth", "Minor seventh", "Octave"], note: "An octave: twelve half steps, the same note name, higher."},
        {kind: "interval", value: 5, answer: "Perfect fourth", options: ["Major second", "Perfect fourth", "Tritone", "Perfect fifth"], note: "A perfect fourth: five half steps, open like a call."},
        {kind: "chord", value: "dominant7", answer: "Dominant 7th", options: ["Major 7th", "Dominant 7th", "Minor 7th", "Sus4"], note: "A dominant seventh: a major chord with a minor seventh on top, restless and ready to move."}
    ],
    school:
    {
        eyebrow: "Who wrote this lesson",
        title: "Taught by Marisol Adeyemi.",
        bio: "Marisol Adeyemi spent eleven years playing keys in touring bands before opening Overtone Night School above a bike shop at 418 Marlow Street, Eastfield. She teaches the way she learned: by ear first, with the names right after.",
        stats: [["2,140", "students since the first class"], ["10", "seats per room"], ["86%", "finish all six classes"]],
        course: "Six evenings on real keyboards.",
        facts: ["Tuesdays and Thursdays, 7:30 to 9:00 pm", "Room 2B, 418 Marlow Street", "$186 for all six, or $34 drop-in"],
        classes: ["Intervals by ear", "Triads and inversions", "Keys and the circle", "Seventh chords", "Common progressions", "Write your own eight bars"],
        quotes: [["I stopped guessing at chords after two weeks. Now I name them on the bus.", "Theo Lindqvist", "Night-shift nurse"], ["I had played for years without knowing why anything worked. Class three fixed that.", "Priya Venkataraman", "Wedding band guitarist"]]
    },
    faq:
    [
        ["Do I need a piano?", "No. A laptop keyboard, a mouse or a phone screen is enough. If you own a keyboard, try each exercise on it afterward."],
        ["Do I have to read music?", "No. This lesson uses note names and half steps only, with no staff notation."],
        ["I hear nothing. What now?", "Browsers keep sound off until your first tap, so press a key once. Then check the Sound button at the top and the silent switch on your phone."],
        ["What does the evening course add?", "Real keyboards, a teacher listening to you, and live ear training in a room of ten. You also leave with eight bars you wrote yourself."]
    ],
    final:
    {
        title: "Come play it in the room.",
        body: "New groups start the first Tuesday of each month. Call or write to save a seat.",
        phone: "(555) 014-2277",
        email: "hello@overtonenight.example",
        replay: "Replay the quiz",
        address: "418 Marlow Street, Eastfield",
        hours: "Office open Monday to Friday, 4 to 7 pm",
        synthesis: "All sounds in this lesson are made live in your browser.",
        demo: "An invented school. Course details and student stories are illustrative.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/music-theory-interactive-lesson"
    },
    images:
    {
        hero: ["./images/hero-stage.webp", "An empty small club stage at night, hazy with ultraviolet light and crossed by a coral beam"],
        instructor: ["./images/instructor-portrait.webp", "The instructor at a keyboard on a small stage, seen from behind under violet and coral light"],
        class: ["./images/evening-class.webp", "Adult students seen from behind, practicing at small keyboards in a dim violet rehearsal room"],
        final: ["./images/keys-closeup.webp", "A close view of piano keys glowing under coral and ultraviolet stage light"]
    },
    ui:
    {
        soundOn: "Sound on", soundOff: "Sound off", enableSound: "Turn sound on", muted: "Sound is off",
        press: "Press any key", root: "Root note", quality: "Chord quality", scale: "Play scale",
        strum: "Strum", shape: "The same chord type makes the same shape in every key.",
        cheat: "Keep this page open while you play.", halfSteps: "half steps",
        play: "Play the sound", startQuiz: "Start the quiz", next: "Next round", results: "See my score",
        again: "Play again", quizListen: "Quiz: listen and answer", ready: "Eight sounds. No hints. Just you and your ears.",
        quizHelp: "The notes stay hidden until you answer.", before: "Before you ask.",
        resultsTitles: ["Warming up", "Your ears are waking up", "Sharp ears"],
        perfect: "Nothing missed. Beautiful listening.", missed: "One more listen to the ones you missed.",
        replay: "Replay last sound", noSound: "Play a note first", octave: "Keyboard octave",
        circleScale: "Play selected major scale", wins: "wins", selectedKey: "YOUR SELECTED KEY",
        noAccidentals: "No sharps or flats", sharps: "Sharps", flats: "Flats",
        chordDiagram: "Chord notes on the circle of fifths", cheatEyebrow: "A little help, whenever you need it",
        schoolEyebrow: "From your screen to the stage", finalEyebrow: "Less guessing. More playing.",
        panelLabels: ["01 / FIND THE DISTANCE", "02 / A MAP OF ALL TWELVE KEYS", "03 / MAKE YOUR OWN HARMONY"],
        sharp: " sharp", flat: " flat", round: "ROUND",
        winCircle: "Win 2. A major: three sharps, F#, C# and G#.",
        winQuiz: "Win 4. You trained your ears for eight rounds."
    },
    format:
    {
        firstNote: (note) => `${note}. Now press another key.`,
        sameNote: (note) => `${note} again: same note.`,
        distance: (first, second, name, distance) => `${first} to ${second}: ${name}${distance > 12 ? " plus an octave" : ""}, ${distance} half steps.`,
        winFifth: (first, second) => `Win 1. You found a perfect fifth: ${first} up to ${second}.`,
        winMinor: (before, after) => `Win 3. You lowered one note by a half step, ${before} to ${after}, and the mood changed.`,
        chord: (root, name, notes) => `${root} ${name.toLowerCase()} chord: ${notes.join(" ")}`,
        scale: (root) => `${root} major scale`,
        quiz: (name, notes) => `Quiz: ${name} · ${notes.join(" ")}`,
        progression: (root) => `Try it in ${root} major`,
        relative: (root) => `Relative minor: ${root} minor`,
        round: (round) => `Round ${round} of 8`,
        score: (score) => `Score ${score}`,
        formula: (steps) => `Half steps: ${steps}`
    }
};
