export const content =
{
    school: "Bluebird Garden Preschool",
    city: "Boulder, Colorado",
    focus: "play-based learning with real mud",
    ratio: "1:8 in every room, 1:6 for toddlers",
    schoolSlug: "bluebird-garden-preschool",
    emailDomain: "bluebirdgardenpreschool.com",
    nav:
    {
        label: "Main navigation",
        skip: "Skip to the good stuff",
        home: "./index.html",
        tour: "Book a tour",
        links:
        [
            ["Programs", "#programs"],
            ["A day here", "#day"],
            ["Teachers", "#teachers"],
            ["Tuition", "#tuition"]
        ],
        ages: "Ages 2–5"
    },
    hero:
    {
        eyebrow: "Play-based · Ages 2–5",
        heading: "Small people,",
        accent: "big mornings.",
        lead: "Bluebird Garden Preschool is play-based learning with real mud — three rooms, tiny ratios (1:8 in every room, 1:6 for toddlers), and teachers who explain the day in stickers and complete sentences.",
        secondary: "See a day here",
        caption: "The block corner, before the architects arrive",
        meet: "A familiar face, from the very first hello.",
        teacher: "Meet Marisol, our fictional Blossoms lead",
        trusts:
        [
            { icon: "Smile", title: "Small groups. Big attention.", text: "1:8 in every room, 1:6 for toddlers" },
            { icon: "CloudRain", title: "Outside is a classroom, too.", text: "Outdoor play, rain or shine" },
            { icon: "Sun", title: "Come see an ordinary morning.", text: "Tours Tue & Thu mornings" }
        ]
    },
    images:
    {
        room:
        {
            path: "./images/room-play.webp",
            alt: "A bright preschool room with a block corner and art easels",
            position: "50% 50%"
        },
        art:
        {
            path: "./images/room-art.webp",
            alt: "An art easel with washable paints at child height",
            position: "50% 50%"
        },
        yard:
        {
            path: "./images/yard-mud.webp",
            alt: "A playground with a mud kitchen and rain boots",
            position: "50% 50%"
        }
    },
    programs:
    {
        eyebrow: "Three rooms",
        heading: "Programs by age, gently ambitious.",
        note: "All rooms share the playground, the garden and the snack schedule — the mud is communal.",
        artCaption: "Mess is part of the method.",
        ratioLabel: "Teacher : children",
        items:
        [
            { age: "Age 2", name: "Seedlings", icon: "Smile", description: "Mornings of songs, sensory play and heroic snack efforts.", ratio: "1:6", days: "Tue/Thu or Mon–Wed–Fri" },
            { age: "Ages 3–4", name: "Sprouts", icon: "Blocks", description: "Stories, building, the mud kitchen and its diplomacy.", ratio: "1:8", days: "Three or five days" },
            { age: "Pre-K · Ages 4–5", name: "Blossoms", icon: "Palette", description: "Letters via treasure hunts, numbers via markets, kindergarten readiness without the drill.", ratio: "1:8", days: "Five days" }
        ]
    },
    day:
    {
        eyebrow: "A day here",
        heading: "From backpacks to stickers.",
        lead: "A steady rhythm. Plenty of room for a very important worm.",
        timelineLabel: "Our daily rhythm",
        stops:
        [
            { time: "8:00", name: "Arrival & free play", note: "The room warms up one backpack at a time.", icon: "Smile" },
            { time: "9:00", name: "Circle time", note: "Songs, calendar, one very important weather report.", icon: "Sun" },
            { time: "9:30", name: "Choice centers", note: "Art, blocks, drama, and the science table’s current experiment.", icon: "Palette" },
            { time: "10:30", name: "Outdoor play", note: "Rain means puddles; we have the boots.", icon: "CloudRain" },
            { time: "11:30", name: "Lunch", note: "From home, at tiny tables, with astonishing opinions.", icon: "Utensils", highlight: true },
            { time: "12:30", name: "Story & rest", note: "Quiet bodies, quiet books, some heroic napping.", icon: "BookOpen" },
            { time: "14:30", name: "Pickup", note: "One sticker, one story, one muddier child.", icon: "Smile" }
        ],
        yardCaption: "The mud kitchen. Reservations not required.",
        outsideEyebrow: "Boots on, almost always",
        outsideHeading: "Real play. Real mud.",
        outsideText: "Our outdoor playground is a rain-or-shine kind of place. We build, dig, notice small things, and practice taking turns with the extremely popular saucepan.",
        outsideNote: "Snacks included. Lunch from home. Curiosity encouraged."
    },
    teachers:
    {
        eyebrow: "The teachers",
        heading: "Three people your child will name nightly.",
        lead: "We get down to their level. Literally.",
        fictional: "Fictional teacher",
        note: "All leads hold early-childhood credentials and current first-aid (invented details; copies at the front desk).",
        disclosure: "These are AI-generated fictional adults, not real staff. No children appear in our photos.",
        items:
        [
            { name: "Marisol Vega", role: "Lead teacher, Blossoms", line: "Twelve years; can de-escalate a block dispute at forty paces.", image: "./images/t-marisol.webp", alt: "Marisol Vega, a fictional preschool teacher", position: "50% 42%" },
            { name: "Derek Nkemdirim", role: "Lead teacher, Sprouts", line: "Former park ranger; the mud kitchen is his legacy.", image: "./images/t-derek.webp", alt: "Derek Nkemdirim, a fictional preschool teacher", position: "50% 38%" },
            { name: "Hana Yoon", role: "Lead teacher, Seedlings", line: "Fluent in toddler, which is harder than it sounds.", image: "./images/t-hana.webp", alt: "Hana Yoon, a fictional preschool teacher", position: "50% 40%" }
        ]
    },
    tuition:
    {
        eyebrow: "Tuition, plainly",
        heading: "Monthly rates, no surprises.",
        lead: "The numbers, all in one place. No “call us for pricing.”",
        schedule: "Schedule",
        monthly: "Per month",
        rows:
        [
            ["Two mornings (Seedlings)", "$420"],
            ["Three mornings", "$580"],
            ["Five mornings (any age)", "$860"],
            ["Full days, three per week", "$1,090"],
            ["Full days, five per week", "$1,450"]
        ],
        caption: "Sibling discount 10%; scholarships available — ask on the tour, it’s a two-line form.",
        disclaimer: "Illustrative rates for an invented school, not a real tuition offer."
    },
    faq:
    {
        eyebrow: "The questions parents ask",
        heading: "Yes, you can ask that.",
        items:
        [
            ["Does my child need to be potty-trained?", "No. Seedlings especially; we keep a very calm changing station and zero embarrassment."],
            ["What about naps?", "Rest time after lunch for all rooms; cots, sheets from home, back-rubs for the brave."],
            ["What food is provided?", "Morning and afternoon snack; lunch comes from home (nut-free tables, we label everything)."],
            ["My child clings at drop-off.", "Normal and welcome — we have a goodbye window routine; most days it takes four minutes, some days eleven, both fine."],
            ["Screens?", "One shared projector for Friday films, otherwise the screens are windows."]
        ]
    },
    tour:
    {
        eyebrow: "Book a tour",
        heading: "Twenty minutes, your child welcome.",
        lead: "See the rooms. Meet the grown-ups. Try the tiny chairs.",
        dayLabel: "Which morning works?",
        days: ["Tuesday", "Thursday"],
        timeLabel: "And what time?",
        times: ["9:00", "10:00"],
        ageLabel: "Your child’s age",
        agePlaceholder: "Choose their age",
        ages: ["2", "3", "4", "5"],
        ageSuffix: "years old",
        nameLabel: "Your child’s first name",
        namePlaceholder: "Their everyday name",
        phoneLabel: "Grown-up’s phone",
        phonePlaceholder: "(303) 555-0123",
        request: "Request the tour",
        caption: "Saved in this browser only. Nothing is sent here. A real school would need its own booking service.",
        privacy: "Fictional school · Browser-only tour planner",
        privacyNote: "Use example details. There is no real booking or email.",
        errorSummary: "A couple of little things before we’re ready.",
        errors:
        {
            day: "Pick Tuesday or Thursday.",
            time: "Choose a morning time.",
            age: "Tell us whether your child is 2, 3, 4 or 5.",
            name: "A first name, please (up to 60 characters).",
            phone: "Add a phone number with 10–15 digits."
        },
        sticker: "SEE YOU SOON",
        bookedBefore: "We can’t wait to meet ",
        bookedAfter: " (and their grown-up).",
        echo: "Your browser-only plan",
        ageEcho: "Age",
        bookedNote: "This plan is saved here, not booked with a school. Nothing has been submitted.",
        change: "Change my tour",
        storedWarning: "Your browser could not save this plan. It still works here, but it won’t survive a refresh.",
        restoreWarning: "This browser’s previous tour plan could not be read. Let’s start fresh."
    },
    footer:
    {
        address: "47 Sunflower Lane, Boulder, Colorado",
        phone: "(303) 555-0169",
        phoneLink: "tel:3035550169",
        hoursTitle: "Our little corner of Boulder",
        hours: "Mon–Fri · 8:00–15:30",
        tours: "Tours Tue/Thu · 9:00 or 10:00",
        licensed: "State-licensed, copies at the front desk.",
        licenseNote: "Invented school, address and licensing details.",
        copyright: "Licensed, loved, occasionally muddy.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/preschool-website"
    }
};
