export const content =
{
    brand: "Cadence House Music",
    city: "Birchwood",
    founder: "Amara Lin",
    phone: "(555) 648-3390",
    experience: "13 years",
    nav: [["Instruments", "instruments"], ["Lesson finder", "finder"], ["Pricing", "pricing"], ["Practice", "practice"], ["Events", "events"]],
    hero:
    {
        eyebrow: "MUSIC LESSONS — BIRCHWOOD, ALL AGES",
        title: "The lesson room you still remember.",
        description: "Director Amara Lin and three teachers run a sunlit house of instruments — 13 years, 300 students, and a rule that’s held: no one gets rushed past Twinkle.",
        primary: "Find your teacher",
        secondary: "See pricing",
        chips: ["First trial free", "Six instruments", "Recitals, not auditions"],
        photo: "images/hero-lessonroom.webp",
        alt: "A sunlit lesson room with an upright piano and a violin on a chair.",
        board: ["This week: 84 lessons", "Next openings: Tue 4:00 · Sat 10:30", "Sample board."],
        caption: "A little room. A lot of possibility."
    },
    sections:
    {
        instruments: ["WHAT WE TEACH", "Six instruments, four teachers, zero auditions.", "Start with the sound you love. We’ll take it from there."],
        finder: ["LESSON FINDER", "Three taps to the right teacher.", "A good lesson begins with a good fit. Find yours below."],
        pricing: ["PRICING", "Priced by the minute, published like it should be.", "Space for music, whatever your week looks like."],
        practice: ["PRACTICE TRACKER", "Minutes in, streaks on.", "Small, steady, and entirely yours."],
        events: ["RECITALS & EVENTS", "Community, not competitions.", "Music sounds better with a room full of friends."],
        teachers: ["THE TEACHERS", "Four people your kid will quote at dinner.", "Working musicians. Patient listeners. Your corner of the room."],
        reviews: ["FROM FAMILIES", "Quoted from the pickup line.", ""],
        trial: ["FREE TRIAL", "One lesson, no card, no commitment.", "Tell us a little about your student. Curiosity is plenty."]
    },
    instruments:
    [
        { name: "Piano", glyph: "piano", description: "Ben & Dana — classical and pop, duets encouraged" },
        { name: "Guitar", glyph: "guitar", description: "Carmen — chords first, songs by week three" },
        { name: "Violin & viola", match: "Violin", glyph: "violin", description: "Amara — the Suzuki-free path: good posture, real tunes" },
        { name: "Voice", glyph: "voice", description: "Carmen — range without the opera pressure (unless asked)" },
        { name: "Drums", glyph: "drums", description: "Dana — pads first, kit by month two, neighbors consulted" },
        { name: "Cello", glyph: "cello", description: "Amara — the instrument that hums back" }
    ],
    finder:
    {
        labels: { instrument: "01 / Your instrument", age: "02 / Student’s age", level: "03 / A starting point", format: "04 / Where we meet" },
        options:
        {
            instrument: ["Piano", "Guitar", "Violin", "Voice", "Drums", "Cello"],
            age: ["Child 6–10", "Tween 11–13", "Teen 14–17", "Adult 18+"],
            level: ["Beginner", "Some experience", "Advanced"],
            format: ["In-person", "Online", "Either"]
        },
        match: "Your matches",
        sample: "Sample weekly openings",
        noMatch: "No one fits that exact mix — loosen a filter, or note that online teachers match everywhere",
        loosen: "Loosen filters",
        trial: "Trial with",
        meet: "Meet them in the finder",
        opening: "Choose a weekly opening",
        saved: "Your choices stay in this browser."
    },
    teachers:
    [
        {
            name: "Amara Lin", instruments: ["Violin", "Viola", "Cello"], formats: ["In-person", "Online"],
            ages: ["Child 6–10", "Tween 11–13", "Teen 14–17", "Adult 18+"], levels: ["Beginner", "Some experience", "Advanced"],
            openings: ["Tue 4:00", "Wed 5:30", "Sat 9:00"], photo: "images/teacher-1.webp",
            alt: "Portrait of a fictional violin teacher holding her instrument.",
            style: "Teaches the Suzuki-free path: good posture, real tunes.",
            biography: "Choir kid turned fiddler; teaches the Suzuki-free path.",
            quote: "Every student gets a tune they love by month two."
        },
        {
            name: "Ben Osei", instruments: ["Piano"], formats: ["In-person"],
            ages: ["Child 6–10", "Tween 11–13", "Teen 14–17", "Adult 18+"], levels: ["Beginner", "Some experience"],
            openings: ["Mon 3:30", "Thu 4:30", "Sat 10:30"], photo: "images/teacher-2.webp",
            alt: "Portrait of a fictional piano teacher seated at an upright piano.",
            style: "Jazz degree, endless patience for Hot Cross Buns.",
            biography: "Jazz degree, endless patience for Hot Cross Buns.",
            quote: "Rhythm is a conversation; we start by listening."
        },
        {
            name: "Carmen Ruiz", instruments: ["Voice", "Guitar"], formats: ["In-person", "Online"],
            ages: ["Tween 11–13", "Teen 14–17", "Adult 18+"], levels: ["Beginner", "Some experience", "Advanced"],
            openings: ["Tue 5:00", "Fri 3:30", "Sat 11:00"], photo: "images/teacher-3.webp",
            alt: "Portrait of a fictional voice and guitar teacher with an acoustic guitar.",
            style: "Coaxes room-filling sound from shy people.",
            biography: "Open-mic veteran who coaxes room-filling sound from shy people.",
            quote: "Your voice already exists; we just tune the room."
        },
        {
            name: "Dana Whitehorse", instruments: ["Drums", "Piano"], formats: ["In-person"],
            ages: ["Child 6–10", "Tween 11–13", "Teen 14–17", "Adult 18+"], levels: ["Beginner", "Some experience"],
            openings: ["Mon 4:00", "Wed 3:30", "Thu 6:00"], photo: "images/teacher-4.webp",
            alt: "Portrait of a fictional drums teacher with sticks by a practice kit.",
            style: "The steady heartbeat of the school, literally.",
            biography: "The steady heartbeat of the school, literally.",
            quote: "Count out loud. Everything else follows."
        }
    ],
    pricing:
    {
        tiers: [[30, 38, "young students and busy weeks"], [45, 52, "the sweet spot for most"], [60, 64, "teens, adults and the serious"]],
        chosen: "MOST CHOSEN",
        unit: "/ lesson",
        minutes: "minutes",
        note: "Online lessons $6 less. Second student in a family, 10% off. Monthly billing, no registration fee — sample prices, and the trial is always free."
    },
    practice:
    {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [0, 10, 20, 30, 45],
        labels: ["—", "10", "20", "30", "45+"],
        total: "minutes this week",
        goal: "A little goal: 100 minutes",
        streak: "week streak — the metronome approves",
        reset: "Start a fresh week",
        local: "Lives in this browser only — bring your streak to lessons for bragging rights.",
        encouragement: "We’d rather see four honest tens than one heroic hour.",
        instructions: "Tap a day to add a little music. Tap again to add a little more.",
        minutes: "minutes",
        resetMessage: "Week saved. A fresh seven days, no pressure."
    },
    events:
    {
        photo: "images/recital-hall.webp",
        alt: "A small warm recital hall with empty chairs facing a lit stage.",
        rows:
        [
            ["Winter & spring recitals", "every student invited, nobody ranked; the cookie table is famous", "calendar"],
            ["Coffee-house nights", "monthly, low-stakes, five-minute slots for the brave and the almost", "voice"],
            ["Summer porch ensemble", "a mixed-instrument group that plays two farmers markets a season", "people"]
        ],
        note: "Around Birchwood, events run on a seasonal rhythm — dates live in the monthly newsletter (sample events)."
    },
    reviews:
    {
        rows:
        [
            ["The finder matched my shy 8-year-old with Amara in about thirty seconds. Two months later he practices without being asked. We checked with a doctor.", "Rosa M., violin parent"],
            ["I’m 52 and started drums because why not. Dana never once made it weird.", "Gerald T., adult beginner"],
            ["The practice tracker’s streak feature is parenting gold.", "Dana P., guitar parent"]
        ],
        note: "Sample reviews for this template demo.",
        stars: "5 out of 5 stars"
    },
    trial:
    {
        labels: { instrument: "Instrument", student: "Student name", age: "Student age", guardian: "Guardian / contact name", phone: "Phone", format: "Lesson format", notes: "Anything we should know?" },
        notes: "Instruments owned, songs loved, first-lesson butterflies…",
        submit: "Book the trial",
        another: "Book another",
        with: "With:",
        opening: "Opening:",
        remove: "Remove",
        required: "Please fill in this field.",
        ageError: "Please enter an age from 6 to 120.",
        ageMatchError: "This teacher’s age range does not fit. Adjust the lesson finder or remove the teacher.",
        phoneError: "Please enter a phone number with 7–15 digits.",
        success: "See you at the house,",
        confirmation: "We confirm by text within a day — bring nothing but curiosity; instruments are here. This demo stores the booking in this browser only.",
        disclosure: "A browser-only demo. Nothing is sent, and no lesson is reserved.",
        storageError: "Browser storage is unavailable. Your sample booking is shown here but will not survive a reload.",
        ageNote: "Adults: use your own name for the contact.",
        selected: "Your lesson",
        incomplete: "A few details need your attention."
    },
    footer:
    {
        address: "19 Chestnut Row, Birchwood",
        hours: "Mon–Fri 2–8p · Sat 9a–2p",
        school: "School",
        small: "Small print",
        sample: "Sample site for a template — teachers, openings, prices and reviews invented.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/music-lessons-school-website",
        call: "Call",
        trial: "Trial",
        book: "Book a trial",
        menu: "Open navigation",
        closeMenu: "Close navigation",
        skip: "Skip to content"
    }
};

export const brandSlug = content.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const telephone = `tel:${content.phone.replace(/\D/g, "")}`;
