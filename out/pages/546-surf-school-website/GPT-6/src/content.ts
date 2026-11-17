export const content =
{
    brand: "driftline",
    beach: "Sanderling Bay",
    title: "Driftline — Surf School at Sanderling Bay",
    classSize: 6,
    navigation:
    [
        { label: "Lessons", target: "lessons" },
        { label: "Camps", target: "camps" },
        { label: "Coaches", target: "coaches" },
        { label: "Find us", target: "find-us" }
    ],
    ui:
    {
        skip: "Skip to content",
        book: "Book a lesson",
        openMenu: "Open navigation",
        closeMenu: "Close navigation",
        menu: "Main navigation",
        arrow: "Arrow pointing right",
        learn: "You’ll learn",
        bookLevel: "Book this level",
        bookCamp: "Book this",
        gearNote: "Boards, wetsuits, and a little patience. All included.",
        lessonsNumber: "01 / FIND YOUR FEET",
        campsNumber: "02 / MAKE A WEEKEND OF IT",
        coachesNumber: "03 / GOOD PEOPLE, GOOD WATER",
        bookingNumber: "04 / YOUR NEXT MORNING",
        findNumber: "05 / FOLLOW THE SALT",
        footerLine: "See you at dawn.",
        footerBook: "Book",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/surf-school-website"
    },
    hero:
    {
        label: "SURF SCHOOL AT SANDERLING BAY",
        heading: "The ocean sets the schedule.",
        description: "Surf lessons, weekend camps and private coaching at Sanderling Bay — soft boards, groups of 6 max, and coaches who grew up on this sand.",
        secondary: "See the levels",
        bottomLeft: "SMALL GROUPS. LONG MORNINGS.",
        bottomRight: "LESSONS FROM $55",
        image: "images/hero-wave.webp",
        alt: "An empty wave peeling down a sandy point at soft morning light."
    },
    forecast:
    {
        heading: "The mood out back",
        label: "SAMPLE FORECAST",
        intro: "Sanderling Bay · a little look ahead",
        footnote: "Sample forecast for the demo — the real one is chalked on the shop door every morning.",
        waveUnit: "ft",
        windUnit: "kn",
        rows:
        [
            { day: "Mon", height: 2, wind: "Offshore", speed: 6, direction: -45, tide: "low tide morning", phase: 0.75 },
            { day: "Tue", height: 3, wind: "Offshore", speed: 8, direction: -45, tide: "high tide midday", phase: 0.25 },
            { day: "Wed", height: 4, wind: "Cross-shore", speed: 11, direction: 90, tide: "low tide morning", phase: 0.75 },
            { day: "Thu", height: 3, wind: "Offshore", speed: 9, direction: -45, tide: "high tide midday", phase: 0.25 },
            { day: "Fri", height: 2, wind: "Glassy", speed: 4, direction: 0, tide: "low tide evening", phase: 0.75 }
        ]
    },
    lessons:
    {
        heading: "Three levels, one beach.",
        intro: "Nobody gets thrown in the deep end. You start where the water is kind and move out when you’re ready.",
        items:
        [
            {
                name: "First timer",
                tagline: "Waist-deep white water",
                skills: ["Beach safety, and where not to paddle", "The pop-up — on the sand first, always", "Riding broken waves all the way back to the sand"],
                duration: "90 MIN",
                included: "GEAR INCLUDED",
                price: "FROM $55"
            },
            {
                name: "Improver",
                tagline: "Out the back",
                skills: ["Paddling through the impact zone without drama", "Catching unbroken green waves", "Trimming along the wave face"],
                duration: "2 HRS",
                included: "SMALL GROUPS",
                price: "$75"
            },
            {
                name: "Advanced",
                tagline: "The whole line-up",
                skills: ["Bottom turns that hold their line", "Cutbacks that use the whole wave", "Positioning when it’s crowded"],
                duration: "2 HRS",
                included: "VIDEO FEEDBACK",
                price: "$95"
            }
        ]
    },
    camps:
    {
        heading: "Stay longer, surf better.",
        image: "images/surfer-small.webp",
        alt: "A lone surfer, tiny in the frame, paddling out over glassy water at dawn.",
        caption: "Less scrolling. More paddling.",
        items:
        [
            { name: "Weekend Camp", description: "Two days, four sessions, one very good tired.", includes: "4 lessons · board & wetsuit hire · breakfast at the surf house · Sunday video debrief", price: "$290" },
            { name: "Surf & Stay Week", description: "Seven mornings in the water, evenings on the deck.", includes: "10 sessions · 7 nights at the surf house · daily forecast briefing · airport pickup", price: "$1,150" },
            { name: "Private Coaching", description: "One coach, one surfer, one focus.", includes: "1:1 session · video analysis · a drill plan to take home", price: "$140 / session" }
        ]
    },
    coaches:
    {
        heading: "Coached by locals.",
        intro: "Between them: forty seasons on this beach, two ex-lifeguards, and one judge who will take your takeoff apart frame by frame.",
        items:
        [
            { name: "Mara Quinn", role: "Head coach", description: "Twelve seasons on this sand; reads the rip like a paperback.", specialty: "Whitewater", image: "images/coach-lineup.webp", alt: "A coach in a wetsuit seen from behind, standing in waist-deep water and watching the line-up.", caption: "Watching the line-up" },
            { name: "Tomas Ferreira", role: "Improver lead", description: "Ex-lifeguard, endlessly patient, allergic to egos.", specialty: "Green waves", image: "images/coach-push.webp", alt: "From behind, a coach steadying a beginner’s board into the white water.", caption: "First push into the white water" },
            { name: "Jun Park", role: "Advanced coach", description: "Contest judge by winter; breaks your takeoff down frame by frame.", specialty: "Video analysis", image: "images/coach-walk.webp", alt: "A coach walking away down the beach with a surfboard under one arm, seen from behind.", caption: "Off to check the point" }
        ]
    },
    booking:
    {
        heading: "Book a lesson.",
        intro: "Tell us what fits and we’ll hold a slot — or just come by the shop.",
        contactHeading: "The shop door is open.",
        address: "12 Dock Road, Sanderling Bay",
        hours: "Shop daily 8:00–17:00 · lessons dawn to mid-morning",
        phone: "(555) 014-8890",
        phoneLink: "tel:+15550148890",
        email: "hello@driftline.surf",
        emailLink: "mailto:hello@driftline.surf",
        contactNote: "New to this? Good. We like a clean slate.",
        nameLabel: "Your name",
        emailLabel: "Email",
        namePlaceholder: "First and last name",
        emailPlaceholder: "you@example.com",
        levelLabel: "Your level",
        whenLabel: "When works?",
        times: ["Weekday dawn", "Weekday mid-morning", "Weekend mornings"],
        partyLabel: "Surfers",
        partyNote: "1–6 surfers. Small groups, always.",
        fewer: "Fewer surfers",
        more: "More surfers",
        save: "Save my request",
        beforeSave: "A request, not a reservation. No payment, no inbox surprise.",
        saved: "Saved on this device only — this demo form sends nothing. Call or email us to confirm.",
        restored: "Your saved request is back. Update it here, then call or email to confirm.",
        changed: "You’ve made changes. Save again to keep them on this device.",
        storageError: "This browser couldn’t save your request. Nothing was sent. Call or email us to confirm.",
        packageLabel: "Interested in",
        clearPackage: "Remove package",
        storageKey: "bookingRequest"
    },
    find:
    {
        heading: "Find us.",
        pinLabel: "DRIFTLINE / SANDERLING BAY",
        mapLabel: "Illustrated coastline of Sanderling Bay, with Driftline at the northern end beside the old jetty. Not a navigational map.",
        seaLabel: "SANDERLING BAY",
        roadLabel: "DOCK ROAD",
        jettyLabel: "OLD JETTY",
        headingBelow: "Northern end. Blue container.",
        directions: "Northern end of Sanderling Bay, beside the old jetty. Park on Dock Road — the shop is the blue container with the boards out front.",
        note: "If you can smell the coffee and hear the wax scraping, you’re close.",
        image: "images/boards-sand.webp",
        alt: "Plain soft-top surfboards standing upright in the sand.",
        caption: "The fleet, ready for the morning session."
    }
};
