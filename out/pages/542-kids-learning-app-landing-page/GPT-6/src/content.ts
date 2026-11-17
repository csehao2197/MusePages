const brand = "Mallowpath";
const sessionMinutes = 10;
const monthlyPrice = 8;

export const content =
{
    brand,
    sessionMinutes,
    monthlyPrice,
    focus: "Phonics, first words, and everyday math",
    audience: "Curious kids ages 3–8 and their grown-ups",
    world: "A tiny garden of sunbursts, sprouts, and picnic discoveries",
    title: brand,
    links:
    {
        lesson: "./index.html#lesson-preview",
        learning: "./index.html#learning",
        parents: "./index.html#parents",
        plans: "./index.html#plans",
        questions: "./index.html#questions",
        memory: "./index.html#preview-memory",
        credit: "https://vibefather.ai/t/kids-learning-app-landing-page"
    },
    assets:
    {
        hero: { src: "./images/hero-companions.webp", alt: "Two original pink and green clay learning companions among bright rounded shapes." },
        play: { src: "./images/learning-playground.webp", alt: "Friendly abstract clay companions exploring a blank book and colorful counting pieces." },
        calm: { src: "./images/calm-corner.webp", alt: "Two small clay learning companions resting inside a soft arch with colorful cushions." }
    },
    header:
    {
        skip: "Skip to content",
        menu: "Menu",
        navigation: "Main navigation",
        items: [["How it works", "learning"], ["For grown-ups", "parents"], ["Plans", "plans"]]
    },
    hero:
    {
        eyebrow: "Little learning, lots of wonder",
        headline: ["Little lessons.", "Big discoveries."],
        description: `${brand} turns phonics, first words, and everyday math into ${sessionMinutes}-minute adventures for curious kids ages 3–8 and their grown-ups. Start with one small win, then follow their curiosity.`,
        try: "Try a lesson",
        parents: "See the parent view",
        choose: "Choose an age",
        note: "No account needed to explore."
    },
    phone:
    {
        label: "Interactive lesson preview",
        subtitle: "A little practice",
        read: "Read",
        math: "Math",
        modes: "Choose an activity",
        wordLabel: "Explore the sounds in",
        soundDefault: "Tap a word to explore its sounds.",
        soundLabel: "Word sounds",
        readAloud: "Read aloud",
        noVoice: "A local English voice is not available on this device. You can still explore the sounds here.",
        success: "You found it! One little win.",
        next: "Next activity",
        pause: "A lovely place to pause",
        again: "Start again",
        progress: (index) => `${index + 1} of 2`,
        pebbles: (groups) => `${groups.join(" + ")} counting pieces`,
        sproutArt: "A little garden sprout",
        sunArt: "A bright garden sun",
        mapArt: "A little garden map",
        capArt: "A red picnic cap"
    },
    ages: ["3–4", "5–6", "7–8"],
    lessons:
    {
        "3–4":
        {
            read:
            [
                {
                    art: "sun",
                    words: [["sun", "s · u · n"], ["map", "m · a · p"], ["red", "r · e · d"]],
                    question: "Which word begins with s?",
                    answers: ["sun", "map", "red"],
                    correct: "sun",
                    hint: "Listen for s at the start, like the sound in sunny.",
                    successSound: "s · u · n"
                },
                {
                    art: "map",
                    words: [["map", "m · a · p"], ["sun", "s · u · n"], ["cap", "c · a · p"]],
                    question: "Which word begins with m?",
                    answers: ["sun", "cap", "map"],
                    correct: "map",
                    hint: "Say mmm. Map starts with that sound.",
                    successSound: "m · a · p"
                }
            ],
            math:
            [
                {
                    groups: [2, 1], equation: "2 + 1", question: "Two pebbles and one more. How many?",
                    answers: ["2", "3", "4"], correct: "3", hint: "Touch each pebble as you count: one, two, three."
                },
                {
                    groups: [1, 3], equation: "1 + 3", question: "One pebble and three more. How many?",
                    answers: ["3", "4", "5"], correct: "4", hint: "Start with one. Count the three new pebbles too."
                }
            ]
        },
        "5–6":
        {
            read:
            [
                {
                    art: "sun",
                    words: [["The", "th · e"], ["sun", "s · u · n"], ["is", "i · s"], ["up.", "u · p"]],
                    question: "Which word names the bright thing?",
                    answers: ["sun", "cap", "log"], correct: "sun",
                    hint: "The bright thing in the sky starts with s. Try saying s · u · n.",
                    successSound: "s · u · n"
                },
                {
                    art: "cap",
                    words: [["A", "a"], ["red", "r · e · d"], ["cap.", "c · a · p"]],
                    question: "Which word tells the cap’s color?",
                    answers: ["cap", "red", "sun"], correct: "red",
                    hint: "A cap is something to wear. Red tells us its color.",
                    successSound: "r · e · d"
                }
            ],
            math:
            [
                {
                    groups: [4, 3], equation: "4 + 3", question: "Four picnic pebbles, then three. How many?",
                    answers: ["6", "7", "8"], correct: "7", hint: "Start at four, then count on: five, six, seven."
                },
                {
                    groups: [8], removed: 2, equation: "8 − 2", question: "Eight pebbles. Put two away. How many stay?",
                    answers: ["5", "6", "7"], correct: "6", hint: "Two crossed pebbles are put away. Count the six that stay."
                }
            ]
        },
        "7–8":
        {
            read:
            [
                {
                    art: "sprout",
                    words: [["A", "a"], ["little", "lit · tle"], ["gardener", "gar · den · er"], ["plants", "pl · ants"], ["four", "f · our"], ["sprouts", "spr · outs"], ["in", "i · n"], ["each", "ea · ch"], ["of", "o · f"], ["three", "thr · ee"], ["rows.", "r · ow · s"], ["Each", "ea · ch"], ["sprout", "spr · out"], ["gets", "g · e · t · s"], ["a", "a"], ["sip", "s · i · p"], ["of", "o · f"], ["water.", "wa · ter"]],
                    question: "How many rows are in the garden?",
                    answers: ["2", "3", "4"], correct: "3",
                    hint: "Look for the words three rows. Four tells us the sprouts in each row.",
                    successSound: "thr · ee"
                },
                {
                    art: "cap",
                    words: [["A", "a"], ["red", "r · e · d"], ["cap", "c · a · p"], ["is", "i · s"], ["beside", "be · side"], ["the", "th · e"], ["picnic", "pic · nic"], ["basket.", "bas · ket"], ["The", "th · e"], ["garden", "gar · den"], ["map", "m · a · p"], ["is", "i · s"], ["inside", "in · side"], ["the", "th · e"], ["basket.", "bas · ket"]],
                    question: "What is inside the picnic basket?",
                    answers: ["cap", "map", "sprout"], correct: "map",
                    hint: "Read the second sentence again. The map is inside; the cap is beside.",
                    successSound: "m · a · p"
                }
            ],
            math:
            [
                {
                    groups: [4, 4, 4], equation: "3 × 4", question: "Three trays of four sprouts. How many?",
                    answers: ["10", "12", "14"], correct: "12", hint: "Count each tray: four, eight, twelve."
                },
                {
                    groups: [6, 6, 6], removed: 7, equation: "18 − 7", question: "Eighteen picnic pebbles. Move seven away.",
                    answers: ["9", "11", "13"], correct: "11", hint: "Take six from one tray and one from the next. Five plus six stay."
                }
            ]
        }
    },
    learning:
    {
        eyebrow: "Follow their curiosity",
        heading: "A little path for every stage.",
        intro: "Pick a starting point. You can change it whenever curiosity takes a new turn.",
        labels: ["Reading", "Math", "Away from the screen"],
        try: "Try this age in the phone",
        stages:
        {
            "3–4": { title: "Notice & name", skills: ["Hear first sounds", "Count to five", "Find three sunny shapes around the room"], hint: "Try one word, one count, and one high-five.", next: "Name three things that start with the same sound" },
            "5–6": { title: "Sound it, solve it", skills: ["Blend short words", "Add and subtract to ten", "Pack a seven-piece pretend picnic"], hint: "Say the sounds together, then count what you packed.", next: "Build a short word, then make seven in two groups" },
            "7–8": { title: "Read, reason, repeat", skills: ["Read a two-sentence clue", "Make equal groups", "Plan a garden with three rows of four"], hint: "Ask how they found the answer before trying another.", next: "Read a clue, then explain a group of four" }
        }
    },
    play:
    {
        heading: "Two ways to wonder. One happy rhythm.",
        intro: "A word to notice. A puzzle to try. A little room to make it your own.",
        blocks:
        [
            { heading: "Words with a little wiggle", body: "Tap a word, explore its sounds, and find it inside a tiny story.", button: "Try reading", mode: "read" },
            { heading: "Numbers you can move around", body: "Count real-looking pieces, spot a pattern, and talk through a small problem.", button: "Try math", mode: "math" }
        ],
        note: `${sessionMinutes} minutes is a starting point, not a finish line.`
    },
    parents:
    {
        eyebrow: "The grown-up view",
        heading: "See the small steps adding up.",
        intro: "A clear little picture of practice, with space for your next conversation.",
        title: "Practice at a glance",
        illustrative: "Illustrative activity",
        periods: ["Sample week", "Previous sample"],
        samples: [{ values: [8, 12, 6, 10, 11, 9, 14], reading: 42 }, { values: [6, 8, 6, 9, 10, 8, 9], reading: 34 }],
        metrics: ["Total minutes", "Reading minutes", "Math minutes"],
        chart: "Practice sessions",
        table: ["Session", "Minutes"],
        balance: ["Reading", "Math"],
        next: "A gentle next step",
        routine: "Make a sample routine",
        sampleNote: "A sample, not a child’s account.",
        summary: (total) => `${total} total practice minutes in this illustrative sample.`,
        proportion: (value, percentage) => `${value} min · ${percentage}%`
    },
    safety:
    {
        eyebrow: "Space to be curious",
        heading: "Made for play. Kept calm by grown-ups.",
        intro: "Curiosity does not need a noisy room.",
        principles:
        [
            ["No ads or open chat", "The lesson preview stays focused on the activity in front of you.", "shield"],
            ["Your pace, your pause", "Choose a starting age and a short routine. Stop after a little win, whenever you like.", "leaf"],
            ["Less to enter", "The sample setup asks for an age band and a practice preference, never a child’s name, birthday, email, or photo.", "user"]
        ],
        memory: "What does the preview remember?"
    },
    pricing:
    {
        heading: "A small plan for big curiosity.",
        intro: "Try a little first. Choose a rhythm that fits your family.",
        periods: ["Monthly", "Yearly"],
        starter: "Little try",
        free: "Free",
        starterNote: "A little look around",
        starterFeatures: ["Try the reading and math previews", "Explore one age at a time", "See a sample parent view"],
        family: `${brand} Family`,
        label: "Room to explore",
        familyFeatures: ["Reading and math paths", "All three age stages", "A clear grown-up view", "A routine you can shape"],
        routine: "Build a family routine",
        note: "Explore the setup here. No account or payment is created.",
        included: "Two months included",
        monthly: (amount) => `$${amount} / month`,
        yearly: (amount) => `$${amount} / year`,
        equivalent: (amount) => `$${amount.toFixed(2)} per month, billed yearly`
    },
    routine:
    {
        eyebrow: "For grown-ups",
        heading: "A little routine for your family",
        close: "Close",
        age: "Age band",
        preference: "Practice preference",
        preferences: ["Reading", "Math", "A bit of both"],
        duration: "Session length",
        durations: [6, 8, sessionMinutes, 12, 15],
        minutes: (value) => `${value} minutes`,
        plan: "Selected sample plan",
        submit: "Make my sample routine",
        success: "Your next little adventure is ready.",
        result: (reading, math, pause) => [reading && `${reading} min of word play`, math && `${math} min of number play`, `${pause} min to pause and share`].filter(Boolean).join(" + ") + ".",
        idea: "A little idea to try",
        adjust: "Adjust my routine",
        note: "This routine lives only in this open page. No account, payment, or subscription is created."
    },
    questions:
    {
        heading: "A few things grown-ups ask.",
        items:
        [
            ["Where should we start?", "Choose the age that feels closest, then try one reading activity and one number activity. You can change the age at any time."],
            ["Does every word have sound?", "Tap a word to see its sound or syllable breakdown. Read-aloud is available when your device has a local English voice; the activity still works without audio."],
            ["Do we have to finish a lesson?", "No. A short pause after one activity is a good stopping point. The preview never asks you to protect a streak."],
            ["What does the preview remember?", "Your age choice, answers, billing choice, and sample routine stay in this open page only. Refreshing starts the preview again. Nothing is submitted or saved."],
            ["What happens when I choose a plan?", "You can build a sample family routine and compare the displayed plan. This preview does not create an account, take payment, or start a subscription."]
        ]
    },
    footer:
    {
        heading: "One little adventure, whenever you are ready.",
        intro: "Pick an age. Try a word. Make room for a small discovery.",
        tagline: "Little practice. Plenty of wonder.",
        links: [["Learning", "learning"], ["Grown-up view", "parents"], ["Plans", "plans"], ["Questions", "questions"]],
        credit: "Template by VibeFather"
    }
};
