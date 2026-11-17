export const content =
{
    brand: "Rollerloop",
    city: "Cedar Quay",
    address: "48 Marigold Lane",
    tagline: "Good wheels. Great company.",
    ui:
    {
        navigation: "Main navigation",
        sessionType: "Session type",
        range: "Rental size range",
        sizes: "Rental guide sizes",
        planType: "Plan type",
        snackCategory: "Snack category"
    },
    navigation:
    [
        ["Sessions", "#sessions"],
        ["Rentals", "#rentals"],
        ["Parties", "#parties"],
        ["Snack bar", "#snacks"]
    ],
    common:
    {
        skip: "Skip to main content",
        plan: "Plan a visit",
        arrow: "↗",
        money: "$",
        all: "All",
        choose: "Choose session",
        chosen: "Selected session",
        rentals: "Add $5 rentals",
        pause: "Pause decoration",
        resume: "Resume decoration",
        back: "Back to top",
        close: "Close preview",
        selected: "Selected",
        days: ["All weekdays", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    hero:
    {
        eyebrow: "A little old-school. A whole lot of good.",
        intro: "A warm floor, a good groove, and room for every kind of skater in Cedar Quay.",
        primary: "Find your session",
        secondary: "Plan a party",
        rentalPill: "Rentals from $5",
        welcomePill: "First-timers welcome",
        helper: "No outside skates with exposed metal parts. Helmets welcome.",
        caption: "A fictional rink, shown with generated venue photography",
        sticker: ["LESS SCROLL.", "MORE ROLL."],
        bottom: ["Come as you are.", "Find your feet.", "Stay for one more lap."]
    },
    images:
    {
        hero: ["./images/hero-rink.webp", "Wide wooden roller rink with warm striped walls."],
        rentals: ["./images/rental-skates.webp", "Caramel quad skates ready at the rental counter."],
        party: ["./images/party-booth.webp", "Orange and avocado party booth beside the rink."],
        snacks: ["./images/snack-counter.webp", "Pizza, pretzel and sodas at a warm snack counter."],
        family: ["./images/family-roll.webp", "Skaters of different sizes rolling together from behind."]
    },
    schedule:
    {
        eyebrow: "01 / Find your floor",
        title: "There is a session for your kind of good time.",
        intro: "Small steps, big spins, or a night with your people. Pick your pace.",
        categories: ["All", "Family", "Adults", "Learn"],
        weekdayLabel: "Weekday",
        reset: "Reset filters",
        result: (n) => `${n} ${n === 1 ? "session" : "sessions"} to roll with`,
        empty: "No sessions match this mix. Try another weekday or reset your filters.",
        note: "Recurring weekly sessions; this demo does not display live capacity.",
        ticketNote: "A ticket is admission only unless noted. Spectators $3.",
        rentalIncluded: "Rentals included",
        rentalExtra: "+ $5 rentals",
        perPerson: "per skater",
        sessions:
        [
            { id: "learn", day: "Tuesday", name: "Learn to Roll", time: "4–5 PM", age: "Ages 7+", price: 14, included: true, category: "Learn" },
            { id: "easy", day: "Thursday", name: "Easy Eight", time: "6–8 PM", age: "All ages", price: 12, included: false, category: "Family" },
            { id: "afterglow", day: "Friday", name: "Afterglow", time: "8–11 PM", age: "Ages 18+", price: 18, included: false, category: "Adults" },
            { id: "family", day: "Saturday", name: "Family Spin", time: "11 AM–1 PM", age: "All ages", price: 12, included: false, category: "Family" },
            { id: "groove", day: "Saturday", name: "Groove Club", time: "7–10 PM", age: "Ages 16+", price: 16, included: false, category: "Adults" },
            { id: "first", day: "Sunday", name: "First Wheels", time: "10–11 AM", age: "Ages 5–10 with an adult", price: 14, included: true, category: "Learn" }
        ]
    },
    rental:
    {
        eyebrow: "02 / Borrow a little groove",
        title: "Your wheels are waiting.",
        intro: "No skates? No problem. There is a pair with your name on it. Figuratively, of course.",
        sizeTitle: "Find your rental fit",
        ranges: ["Adult US 1–13", "Youth Y8–Y13"],
        adult: "Adult",
        youth: "Youth",
        pick: "Pick a guide size",
        helper: "Rental sizes are a guide, not a live inventory check. Start with your usual sneaker size; our counter team helps with fit.",
        socks: "Socks required. Bring your own or add a $3 pair at the counter.",
        included: "Rentals are already included in this session or party. No extra $5 charge.",
        group: "One guide size for your group; fit each pair at the counter.",
        storyTitle: "Learning is allowed to look wobbly.",
        story: "Hold the rail, take a breath, and ask for a hand. Our floor hosts make space for beginners.",
        sizeSelected: (size) => `Your guide size: ${size}`,
        noSize: "No guide size chosen yet."
    },
    party:
    {
        eyebrow: "03 / Good times, together",
        title: "Make it a party.",
        intro: "Bring your favorite people. We have the wheels, the booth, and the pizza.",
        extra: "Extra guests $18 each, up to 24 total. Every package includes rentals; no separate rental surcharge.",
        house: "Cake is welcome. Outside hot food stays at home.",
        shared: "A booth of your own, a floor for everyone. Packages do not include exclusive rink use.",
        favorite: "A little more of everything",
        forGuests: (n) => `for ${n} guests`,
        choose: (name) => `Choose ${name}`,
        packages:
        [
            { id: "little", name: "Little Wheels", price: 180, guests: 8, details: ["Reserved booth · 90 minutes", "Admission and rentals", "Two pizzas and water"] },
            { id: "big", name: "Big Groove", price: 280, guests: 12, details: ["Reserved booth · 2 hours", "Admission and rentals", "Three pizzas and two pitchers"] },
            { id: "orbit", name: "Full Orbit", price: 390, guests: 16, details: ["Reserved booth · 2 hours", "Admission and rentals", "Four pizzas and three pitchers", "A floor-host welcome"] }
        ]
    },
    planner:
    {
        eyebrow: "04 / Your next good time",
        title: "Put a little roll in your plans.",
        intro: "A few details. A clear total. Absolutely no commitment.",
        local: "This is a local-only planner, not a reservation service.",
        modes: ["Visit", "Party"],
        name: "Your name",
        email: "Email",
        emailNote: "For this preview only. Nothing is sent or saved.",
        session: "Recurring session",
        sessionPlaceholder: "Choose a recurring session",
        guests: "Skaters / guests",
        guestsHelp: "1–24 skaters. Spectator tickets and counter extras are not included.",
        package: "Party package",
        rentalSize: "Rental guide size",
        sizePlaceholder: "Choose size",
        notes: "Anything to note? (optional)",
        notesHelp: "Up to 240 characters. Please do not include sensitive information.",
        consent: "I have checked the age rules for my group",
        submit: "Preview my plan",
        summary: "Your good-time tally",
        summaryNote: "An estimate, not a payment request.",
        total: "Estimated total",
        age: "Session age rule",
        noAge: "Choose a session to see its age rule.",
        noSession: "Choose a session to calculate your visit.",
        noRentals: "Bringing your own skates · $0 rentals",
        included: "Rental pairs included · $0 extra",
        size: "Guide size",
        receipt: "Your plan, on a roll.",
        receiptIntro: "Here is your local preview. Your details stay in this page.",
        disclaimer: "Local demo only. No booking, message, or payment was sent. This does not reserve a space.",
        edit: "Edit plan",
        clear: "Clear plan",
        noPackage: "No party package",
        noSize: "Not selected",
        notesReceipt: "Notes",
        errors:
        {
            name: "Please enter your name.",
            email: "Please enter a valid email address for this preview.",
            session: "Please choose a recurring session.",
            guests: (min) => `Enter a whole number from ${min} to 24.`,
            rentalSize: "Please choose a rental guide size.",
            age: "Please check your session’s age rule and confirm.",
            notes: "Keep notes to 240 characters."
        },
        arithmetic:
        {
            admission: (n, p) => `${n} skaters × $${p} admission = $${n * p}`,
            rentals: (n) => `${n} rental pairs × $5 = $${n * 5}`,
            party: (name, p, n) => `${name} · $${p} includes ${n} guests`,
            extra: (n) => `${n} extra guests × $18 = $${n * 18}`
        }
    },
    snack:
    {
        eyebrow: "05 / Refuel & repeat",
        title: "One more lap, then a snack.",
        intro: "Simple favorites. Happy skaters. Meet you at the counter.",
        categories: ["All", "Food", "Drinks"],
        note: "An illustrative counter menu, not an ordering service.",
        count: (n) => `${n} counter favorites`,
        items:
        [
            { name: "Cheese slice", price: 4, diet: "Vegetarian", category: "Food" },
            { name: "Tomato pie slice", price: 4, diet: "Vegan", category: "Food" },
            { name: "Soft pretzel", price: 5, diet: "Vegetarian", category: "Food" },
            { name: "Orange float", price: 6, diet: "Dairy", category: "Drinks" },
            { name: "Lime fizz", price: 4, diet: "Vegan", category: "Drinks" },
            { name: "Water bottle", price: 2, diet: "", category: "Drinks" }
        ]
    },
    house:
    {
        eyebrow: "A few things before you roll",
        title: "Good to know.",
        questions:
        [
            ["Do I need to book?", "This demo cannot reserve places. Operational site owners should connect their own reservation system."],
            ["Can beginners join?", "Yes. Try a Learn session or arrive early for a floor orientation. Everyone starts somewhere."],
            ["Can I bring my own skates?", "Clean indoor wheels and secure stops are required. No exposed metal parts; helmets are welcome."],
            ["What should I wear?", "Comfortable clothes and socks. Leave loose trailing accessories at home."]
        ],
        hoursTitle: "Counter hours",
        hours: [["Tuesday", "3–7 PM"], ["Thursday", "5–9 PM"], ["Friday", "6–11 PM"], ["Saturday", "10 AM–10 PM"], ["Sunday", "9 AM–3 PM"]],
        visit: "Find your way to the good times",
        fictional: "Fictional venue and address. Not a real-world business listing."
    },
    footer:
    {
        note: "A neighborhood state of mind. A local-only demo.",
        credit: "Template by VibeFather",
        url: "https://vibefather.ai/t/retro-roller-rink-website"
    }
};
