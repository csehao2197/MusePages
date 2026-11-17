export const content =
{
    brand: "The Ruby Lantern",
    slug: "the-ruby-lantern",
    city: "Old Milltown",
    price: 11,
    currency: "$",
    nav:
    [
        ["Now showing", "now-showing"],
        ["Showtimes", "showtimes"],
        ["Membership", "membership"],
        ["Visit", "visit"]
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hero:
    {
        eyebrow: "INDEPENDENT CINEMA · OLD MILLTOWN",
        first: "The Ruby",
        second: "Lantern",
        subtitle: "Now showing · six films · three screens",
        primary: "See showtimes",
        secondary: "Become a member",
        doors: "DOORS 30 MIN BEFORE FIRST SHOW",
        foot: "A little magic. A seat for you.",
        edition: "YOUR NEIGHBORHOOD PICTURE HOUSE"
    },
    labels:
    {
        tonight: "Tonight’s shows",
        menu: "Open navigation",
        close: "Close navigation",
        program: "THE HOUSE PROGRAM",
        showing: "Now showing",
        programNote: "Six stories worth stepping out for.",
        filmLink: "Film page",
        scheduleLabel: "MAKE A NIGHT OF IT",
        showtimes: "Showtimes",
        cheap: "Cheap Tuesday: every screening before 17:00 is $7 at the door.",
        sample: "Sample week — times follow a weekday pattern, not a live calendar.",
        weekend: "Weekend screenings only",
        membership: "Membership",
        membersLabel: "KEEP THE LANTERN LIT",
        membersIntro: "Your regular seat. A few extra perks.",
        membershipNote: "Memberships shown for information — this demo has no signup flow.",
        chosen: "MOST CHOSEN",
        visit: "Find the house",
        visitLabel: "WE’LL SAVE YOU A SPOT",
        address: "14 Marquee Lane, Old Milltown",
        directions: "Night bus 12 stops at the fountain; two minutes on foot.",
        hours: "BOX OFFICE HOURS",
        houseNotes: "A FEW HOUSE NOTES",
        doors: "Doors open 30 minutes before the first show.",
        rooms: "Screen One seats 96; screens Two and Three seat 48. The concession takes cards only.",
        footer: "Films, showtimes and seats shown are invented sample content.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/movie-theater-showtimes-website",
        back: "All films",
        filmLabel: "FROM THE PROJECTION BOOTH",
        seatsTitle: "Pick your little patch of magic.",
        seatsLabel: "YOUR SEATS, PLEASE",
        screening: "Choose a screening",
        screenOne: "SCREEN ONE",
        screen: "SCREEN",
        available: "Available",
        taken: "Taken",
        selected: "Selected",
        seat: "Seat",
        seats: "SEATS",
        hold: "Hold seats",
        clear: "Clear local hold",
        held: "Held on this device — this is a local demo. No booking was made and nothing was charged.",
        storageError: "Device storage is unavailable. Your seats are selected for this visit only; no hold was saved and nothing was charged.",
        holdCleared: "Local hold cleared. No booking was made.",
        restored: "Your saved local hold is restored. No booking was made and nothing was charged.",
        changed: "Selection changed. Hold seats to save this selection on this device.",
        empty: "Choose an available seat to begin.",
        none: "No screenings on this day. Choose Saturday or Sunday.",
        stepFree: "Row H end seats are step-free; ask an usher at the door.",
        localNote: "Seat map is a local demo — no real booking.",
        priceNote: "$11 per seat · no fees · no payment",
        discountNote: "Tuesday before 17:00: $7 at the door only. This local tally uses the standard $11 seat price.",
        daysLabel: "Choose a day",
        timesLabel: "Choose a time",
        seatMapLabel: "Screen One seating, rows A to H, twelve seats per row",
        restoredLabel: "LOCAL HOLD",
        pause: "Pause ticker",
        resume: "Resume ticker",
        posterLabel: "Original abstract poster for",
        tickets: "Tickets"
    },
    hours: [["Mon–Thu", "15:00–23:00"], ["Fri", "13:00–24:00"], ["Sat–Sun", "10:30–24:00"]],
    tiers:
    [
        { name: "Matinee Member", price: "$9", period: "/ month", perks: ["One ticket a month", "Cheap Tuesday included", "No booking fees"] },
        { name: "Double Feature", price: "$17", period: "/ month", popular: true, perks: ["Two tickets a month", "One guest pass a season", "Free popcorn refills"] },
        { name: "Season Pass", price: "$149", period: "/ year", perks: ["Unlimited standard shows", "Four preview invitations", "Your name on the lobby wall"] }
    ],
    seatRows: ["A", "B", "C", "D", "E", "F", "G", "H"],
    seatCount: 12,
    taken: ["A2", "A3", "B7", "B8", "C5", "D4", "D5", "D6", "D7", "D8", "D9", "E4", "E5", "E6", "E7", "E8", "E9", "F4", "F5", "F6", "F7", "F8", "F9", "G10", "H2"],
    films:
    [
        {
            title: "Midnight Orchard", slug: "midnight-orchard", genre: "Thriller", runtime: 104, rating: "PG",
            blurb: "Something is taking the fruit in the dark, one circle at a time.",
            notes: ["A keeper walks the orchard rows after the last bus leaves. Something has been taking the fruit in the dark, one precise circle at a time.", "Shot over nineteen nights in a single field, with a score for tape and bowed saw."],
            times: ["16:15", "19:00", "21:30"],
            poster: { field: "#0E1F16", pale: "#E8E1C5", dark: "#06120C", accent: "#C9A227", type: "orchard" }
        },
        {
            title: "Signal to Solace", slug: "signal-to-solace", genre: "Science fiction", runtime: 131, rating: "PG",
            blurb: "A lighthouse operator answers a signal that shouldn't exist.",
            notes: ["A lighthouse operator answers a signal that shouldn't exist, in a code she half remembers from childhood.", "Every beacon in the film was built and lit in camera."],
            times: ["13:45", "17:15", "20:30"], weekendExtra: "23:00",
            poster: { field: "#101B33", pale: "#F2E7CE", accent: "#D4A06A", type: "signal" }
        },
        {
            title: "The Fox of Fetter Lane", slug: "fox-of-fetter-lane", genre: "Animated family", runtime: 88, rating: "G",
            blurb: "A fox with a market habit trades favors down one long street.",
            notes: ["A fox with a market habit and a baker with a soft heart trade favors across one long street.", "Hand-inked at twelve frames a second; the smell of bread is almost visible."],
            times: ["11:00", "14:00"], weekendsOnly: true,
            poster: { field: "#C25B2E", pale: "#F2E7CE", dark: "#1C1611", type: "fox" }
        },
        {
            title: "Iron Lullaby", slug: "iron-lullaby", genre: "Noir", runtime: 117, rating: "PG-13",
            blurb: "One last fare, and the city has quietly changed hands.",
            notes: ["A night-shift driver takes one last fare and finds the city has quietly changed hands.", "Rain, neon and a brass score; the shadows do the talking."],
            times: ["18:00", "20:45"],
            poster: { field: "#14161A", pale: "#F2E7CE", accent: "#D3A14C", type: "iron" }
        },
        {
            title: "Aunt Marigold’s Aeroplane", slug: "aunt-marigolds-aeroplane", genre: "Adventure comedy", runtime: 116, rating: "G",
            blurb: "A retired pilot and her great-niece rebuild a biplane from barn parts.",
            notes: ["A retired pilot and her great-niece rebuild a biplane from barn parts and borrowed afternoons.", "A comedy that lands softly; the loop-the-loop is real."],
            times: ["10:30", "13:15", "16:00"],
            poster: { field: "#F3E3C2", dark: "#5C5141", accent: "#AD343C", type: "plane" }
        },
        {
            title: "Backlot Honeymoon", slug: "backlot-honeymoon", genre: "Screwball romance", runtime: 91, rating: "PG",
            blurb: "Two rival publicists must stage a wedding neither wants.",
            notes: ["Two rival studio publicists must stage a wedding neither wants, for a studio that no longer exists.", "Screwball pace, matinee heart; romance by way of the props department."],
            times: ["15:00", "17:45", "20:15"],
            poster: { field: "#E9C8C8", pale: "#F2E7CE", accent: "#B43A46", type: "honeymoon" }
        }
    ]
};

function composePoster(p)
{
    const compositions =
    {
        orchard: () => `<circle cx="221" cy="99" r="52" fill="${p.pale}"/>${[25, 70, 115, 160, 205, 250].map((x) => `<rect x="${x}" y="0" width="17" height="450" fill="${p.dark}"/>`).join("")}<circle cx="151" cy="366" r="10" fill="${p.accent}"/>`,
        signal: () => [96, 188, 280].map((r) => `<path d="M25 ${410 - r} A${r} ${r} 0 0 1 ${25 + r} 410" fill="none" stroke="${p.pale}" stroke-width="12"/>`).join("") + `<circle cx="25" cy="410" r="10" fill="${p.accent}"/><path d="m240 55 13 17-13 17-13-17z" fill="${p.accent}"/>`,
        fox: () => `<path d="M108 45A54 54 0 1 0 108 137A42 42 0 0 1 108 45Z" fill="${p.pale}"/>${[[42, 225, -20], [128, 178, 13], [198, 246, 40]].map(([x, y, a]) => `<path d="M0 0Q-40-80 0-115Q40-35 0 0Z" fill="${p.dark}" transform="translate(${x} ${y}) rotate(${a})"/>`).join("")}<path d="M241 302C150 300 133 410 219 414C282 418 294 351 251 350C221 349 216 380 240 381" stroke="${p.pale}" stroke-width="23" fill="none" stroke-linecap="round"/>`,
        iron: () => Array.from({ length: 40 }, (_, n) => `<path d="M${n * 8 + 2} ${-20 + n % 5 * 13}v450" stroke="${p.pale}" stroke-opacity=".25"/>`).join("") + `<path d="m210 151-55 190h110z" fill="${p.accent}" opacity=".18"/><circle cx="210" cy="151" r="12" fill="${p.accent}"/>`,
        plane: () => `<path d="M-20 369C206 418 284 302 149 310C18 319 82 204 165 222" stroke="${p.dark}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/><g transform="translate(165 152) rotate(-17)"><path d="M-80-30H75L-30 20Z" fill="${p.accent}"/><path d="M-65 12H90L-13 52Z" fill="${p.accent}"/><circle cx="80" cy="3" r="17" fill="none" stroke="${p.accent}" stroke-width="6"/></g>`,
        honeymoon: () => `<circle cx="151" cy="220" r="112" fill="${p.pale}"/><path d="M-30 318 313 68l24 49L0 367Z" fill="${p.accent}"/>${[30, 59, 88].map((x) => `<circle cx="${x}" cy="406" r="7" fill="${p.accent}"/>`).join("")}`
    };
    return `<rect width="300" height="450" fill="${p.field}"/>${compositions[p.type]()}`;
}

for (const film of content.films)
{
    film.poster.art = composePoster(film.poster);
}
