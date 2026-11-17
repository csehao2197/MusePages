export const content =
{
    brand: "Lumen Bay",
    brandFull: "Lumen Bay Aquarium",
    brandDescriptor: "AQUARIUM",
    storageKey: "lumen-bay-aquarium-visit",
    nav:
    [
        ["Exhibits", "exhibits"],
        ["Animals", "animals"],
        ["Schedule", "schedule"],
        ["Tickets", "tickets"],
        ["Membership", "membership"]
    ],
    ui:
    {
        skip: "Skip to content",
        openMenu: "Open navigation",
        closeMenu: "Close navigation",
        primaryNav: "Main navigation",
        footerNav: "Footer navigation",
        tickets: "Timed tickets",
        choose: "Choose a time",
        feedings: "Today's feedings",
        scroll: "A little closer to another world",
        scrollLink: "Explore below",
        decrease: "Decrease",
        increase: "Increase",
        scheduleDays: "Feeding schedule day",
        visitDays: "Visit day",
        slots: "Entry time",
        available: "AVAILABLE",
        few: "FEW LEFT",
        sold: "SOLD OUT",
        total: "TOTAL",
        day: "DAY",
        slot: "SLOT",
        save: "Save my visit",
        edit: "Edit my visit",
        saved: "Saved to this device.",
        savedDetail: "Sample picker — no payment taken, nothing reserved. See you at the wharf.",
        savedSummary: "Your sample visit",
        storageError: "Your browser could not save this pick. Nothing is reserved. Please allow local storage and try again.",
        invalidStorage: "A previous pick could not be read. Choose a new sample visit below.",
        zeroGuests: "Choose at least one guest to save your sample visit.",
        guests: "guests",
        guest: "guest",
        perPerson: "per person",
        mostChosen: "MOST CHOSEN",
        perYear: "/ year",
        backTop: "Back to the surface",
        zone: "ZONE",
        entrance: "ENTRANCE",
        floorMap: "Aquarium floor map. Select a numbered zone to explore.",
        mapFootnote: "ONE LEVEL · STEP-FREE LOOP",
        mapInstruction: "Follow the numbers. Take your time.",
        mapLabel: "THE SLOW CROSSING",
        zoneNumber: "ZONE"
    },
    hero:
    {
        eyebrow: "CITY AQUARIUM · PORT MERIDIAN HARBOR",
        opening: "Meet",
        name: "Aurelia,",
        ending: "the moon jelly.",
        description: "Forty-one tanks across five zones, lit like a night dive. Pick a time slot, walk slow, and stay until the jellies turn with the current.",
        image: "./images/hero-moon-jelly.webp",
        alt: "A moon jellyfish drifting through a spotlight beam in dark blue water",
        caption: "ZONE 2 · DRIFTING GARDENS",
        scientific: "Aurelia aurita",
        depth: "4 m",
        depthLabel: "BELOW THE SURFACE",
        stats:
        [
            ["41", "TANKS TO EXPLORE"],
            ["05", "WORLDS OF WATER"],
            ["½", "A DAY, WELL SPENT"]
        ],
        note: "A quieter kind of discovery."
    },
    sections:
    {
        exhibits: ["01 / EXPLORE", "Five zones, one slow crossing", "Every visit is one loop: shallow light to twilight and back."],
        animals: ["02 / ENCOUNTER", "The residents", "Familiar faces. Entirely different worlds."],
        schedule: ["03 / BE HERE", "Feedings and talks", "A small moment worth planning around."],
        tickets: ["04 / YOUR VISIT", "Timed entry, calm water", "We admit a small crowd every ninety minutes. Pick a day and a slot below — the pick saves on this device. It is a sample planner: nothing is charged and nothing is reserved."],
        membership: ["05 / RETURN", "Come back with the tide", "Quiet tiers; no badges, nothing on your lanyard."]
    },
    zones:
    [
        { id: 1, name: "Shallow Reef", depth: "2 m", color: "#FF9A62", description: "Coral heads, damselfish, and the first warm light." },
        { id: 2, name: "Drifting Gardens", depth: "4 m", color: "#5FE9D6", description: "Moon jellies in a slow turning current." },
        { id: 3, name: "Kelp Cathedral", depth: "6 m", color: "#A8D46F", description: "Forty-foot stalks that sway on a ten-second beat." },
        { id: 4, name: "Twilight Depths", depth: "9 m", color: "#7C8CFF", description: "Sharks, groupers, and the last blue of the light." },
        { id: 5, name: "Shore Pools", depth: "0 m", color: "#F2C14E", description: "Tidepools you can lean over; sleeves roll up." }
    ],
    residents:
    [
        {
            name: "Old Halimeda",
            species: "Green sea turtle",
            fact: "Arrived in a transport-tank mishap; now patrols the kelp each morning at a turtle's pace.",
            meet: "FEEDS 10:00 · ZONE 3",
            zone: 3,
            image: "./images/turtle-portrait.webp",
            alt: "A green sea turtle gliding through a spotlight beam"
        },
        {
            name: "Octavia",
            species: "Giant Pacific octopus",
            fact: "Opens jar lids in under a minute and remembers which keeper hides the crab.",
            meet: "ENRICHMENT 14:30 · ZONE 4",
            zone: 4,
            image: "./images/octopus-rock.webp",
            alt: "A red-brown octopus draped over dark rock, one arm raised"
        },
        {
            name: "The Cobalt Pair",
            species: "Lined seahorses",
            fact: "Trade anchoring spots each dawn like two neighbors trading chairs.",
            meet: "LIVE FEED 11:15 · ZONE 2",
            zone: 2,
            image: "./images/seahorse-pair.webp",
            alt: "Two lined seahorses curled around one kelp frond"
        },
        {
            name: "Ember",
            species: "Lionfish",
            fact: "Fans her banded spines when the lights dim; eats only what she hunts.",
            meet: "KEEPER TALK 15:00 · ZONE 1",
            zone: 1,
            image: "./images/lionfish.webp",
            alt: "A lionfish hovering above reef rock with spines fanned wide"
        }
    ],
    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    events:
    [
        { time: "10:00", title: "Turtle breakfast", zone: 3 },
        { time: "11:15", title: "Seahorse live feed", zone: 2 },
        { time: "14:30", title: "Octopus enrichment", zone: 4 },
        { time: "15:00", title: "Lionfish keeper talk", zone: 1 },
        { time: "16:00", title: "Twilight walk", zone: 4, weekend: true },
        { time: "17:30", title: "Jelly turn", zone: 2, weekend: true }
    ],
    scheduleNote: "Sample week — a planning pattern, not a live calendar.",
    prices:
    [
        { id: "adult", label: "Adult", detail: "Ages 18–64", price: 24 },
        { id: "youth", label: "Youth", detail: "Ages 3–17", price: 12 },
        { id: "senior", label: "Senior", detail: "Ages 65+", price: 16 }
    ],
    guestNote: "Ages 0–2 enter free. Up to 12 of each paid guest type in this sample planner.",
    slots:
    [
        { time: "09:30", status: "available" },
        { time: "11:00", status: "few" },
        { time: "13:30", status: "sold", disabled: true },
        { time: "15:15", status: "available" }
    ],
    pickerLabel: "Make a little room for wonder.",
    pickerNote: "SAMPLE ENTRY · LOCAL PLANNER ONLY",
    memberships:
    [
        { name: "Tidepool", price: 60, benefits: ["Unlimited timed entry", "Member hour before opening on Mondays", "10% off the café"] },
        { name: "Reef Line", price: 120, featured: true, benefits: ["Everything in Tidepool", "Two guest passes a season", "Reserved seats at weekend feedings"] },
        { name: "Deep Range", price: 240, benefits: ["Everything in Reef Line", "Behind-the-scenes tour for four", "Adopt-a-tank update card"] }
    ],
    membershipNote: "Illustrative annual tiers. No memberships are sold or activated here.",
    visit:
    {
        image: "./images/kelp-cathedral.webp",
        alt: "Kelp stalks fading into dark water with shafts of light",
        caption: "LET THE OUTSIDE WORLD WAIT.",
        label: "ZONE 3 · KELP CATHEDRAL",
        find: "FIND US",
        address: "12 Anchorline Wharf, Port Meridian Harbor",
        directions: "Harbor tram 6 to Wharf stop, four minutes on foot.",
        hoursLabel: "SAMPLE HOURS",
        hours: [["Mon", "10:00–17:00"], ["Tue–Thu", "10:00–18:00"], ["Fri", "10:00–20:00"], ["Sat–Sun", "09:00–19:00"]],
        hoursNote: "Last timed slot 90 minutes before close. Sample hours; not linked to the planner.",
        cafe: "CAFÉ",
        cafeText: "Second-floor counter over the kelp: chowder, brown bread, no straws."
    },
    footer:
    {
        note: "Zones, residents and feeding times shown are invented sample content.",
        copyright: "An imagined aquarium. A real moment of quiet.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/aquarium-exhibits-and-tickets-website",
        license: "CC BY-NC 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/"
    }
};
