export const content =
{
    brand: "Vault Nine",
    brandEnd: "Nine",
    city: "Portland, Oregon",
    rate: 38,
    phone: "(503) 555-0173",
    phoneHref: "tel:+15035550173",
    navigation: [["Rooms", "rooms"], ["Book", "book"], ["Teams", "teams"], ["FAQ", "faq"]],
    labels:
    {
        skip: "Skip to content",
        menu: "Open navigation",
        close: "Close navigation",
        mainNav: "Main",
        mobileNav: "Mobile",
        footerNav: "Footer",
        book: "Book a room",
        see: "See the rooms",
        choose: "Choose this room",
        players: "players",
        perPlayer: "per player",
        difficulty: "Difficulty",
        room: "Room",
        evening: "Evening",
        party: "Party size",
        fewer: "Fewer players",
        more: "More players",
        hold: "Hold this slot",
        change: "Change hold",
        held: "Held on this device",
        confirmation: "Nothing was paid or sent. Call (503) 555-0173 to confirm — we answer Wed–Sun from noon.",
        storageError: "Device storage is unavailable. Nothing was saved or sent. Call to confirm.",
        dark: "dark hours — ask us",
        total: "Your total",
        sample: "A sample week. Not live availability.",
        local: "A local hold, not a reservation. No payment. No messages sent.",
        range: "Choose a room to see its recommended party size.",
        recommended: "Recommended for",
        chooseDay: "Choose your evening",
        chooseSlot: "Choose your time",
        scroll: "The night starts below",
        roomNumber: "ROOM",
        minutes: "60 minutes",
        footerDisclaimer: "Every room, price and package on this page is an invented example.",
        credit: "Template by VibeFather",
        creditHref: "https://vibefather.ai/t/escape-room-website",
        address: "Sublevel 3, 44 Mercer Lane, Portland, Oregon",
        hours: "Wed–Sun 16:00–23:30",
        footerNote: "Come curious. Leave different.",
        of: "of",
        countSummary: "Players"
    },
    hero:
    {
        eyebrow: "ESCAPE ROOMS — PORTLAND, OREGON",
        subtitle: "Four rooms. Sixty minutes each. One way out — bring people you trust.",
        note: "THE LAST SIGNAL IS WAITING.",
        image: "./images/hero-vault-room.webp",
        alt: "A brick vault room in near darkness, one hanging bulb over a table of brass cogs and an open blank ledger"
    },
    sections:
    {
        rooms: ["THE ROOMS", "Pick your hour.", "Four stories. None of them tell themselves."],
        book: ["YOUR EVENING, UNDER LOCK", "Hold an evening.", "Pick a room. Bring your people. We’ll keep the lights low."],
        teams: ["AFTER HOURS, TOGETHER", "Nights that build teams.", "Same rooms, private floor, and a leaderboard nobody forgets."],
        faq: ["A LITTLE INTELLIGENCE", "Before you knock."]
    },
    rooms:
    [
        {slug: "the-last-signal", name: "The Last Signal", locks: 4, min: 2, max: 6, teaser: "The radio tower answers one question before midnight.", image: "./images/prop-radio.webp", alt: "A vintage valve radio in the dark, its unmarked dial glowing amber"},
        {slug: "the-clockmakers-debt", name: "The Clockmaker’s Debt", locks: 3, min: 2, max: 5, teaser: "Wind the wrong spring and the workshop keeps you.", image: "./images/prop-clockwork.webp", alt: "A workshop wall of brass gears lit by one amber lamp"},
        {slug: "the-red-ledger", name: "The Red Ledger", locks: 2, min: 2, max: 4, teaser: "A burnt-out detective left the case half-solved.", image: "./images/prop-desk.webp", alt: "A brass lamp glowing over a rotary telephone and blank ledger pages"},
        {slug: "hall-of-second-thoughts", name: "Hall of Second Thoughts", locks: 5, min: 4, max: 8, teaser: "The mirrors disagree about the exit.", image: "./images/prop-mirror.webp", alt: "An ornate mirror at the end of a dark corridor catching one amber light"}
    ],
    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    slots: ["17:00", "18:30", "20:00", "21:30", "23:00"],
    darkDays: ["MON", "TUE", "WED", "THU", "SUN"],
    party: {min: 2, max: 8, initial: 4},
    teams:
    {
        image: "./images/lounge-team.webp",
        alt: "A briefing lounge of worn leather chairs around a low table, lit by one floor lamp",
        intro: "Room-only evenings from $38 per player. Make a night of it:",
        packages:
        [
            ["The Warm-Up", 49, "one room, coffee after"],
            ["The Full Night", 79, "two rooms, pizza between"],
            ["The Lockout", 119, "private floor, three rooms, engraved trophy"]
        ],
        note: "Packages are sample tiers for this template — weekday blocks from 17:00, up to 32 players. Call (503) 555-0173 and ask for the night desk."
    },
    faqs:
    [
        ["What if we get stuck?", "Ask the radio. Hints are unlimited and the game master is paid to be mysterious, not cruel."],
        ["Is it scary?", "Tense, never horror. Our darkest room still has a light switch — finding it is the puzzle."],
        ["Can two people play?", "Yes. The Hall needs four or more; the Ledger was built for pairs."],
        ["What should we bring?", "Nothing but wits and closed shoes. Lockers, pencils and nerves provided."]
    ]
};
