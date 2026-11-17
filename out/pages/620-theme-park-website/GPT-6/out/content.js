export const content =
{
    brand: "Jubilee Junction",
    city: "Fernhollow",
    title: "Jubilee Junction — Fernhollow's Theme Park",
    nav: [["Map", "map"], ["Rides", "rides"], ["Tickets", "tickets"], ["Shows", "shows"], ["Plan", "plan"]],
    header: { tickets: "Get tickets", menu: "Open navigation", close: "Close navigation", skip: "Skip to park map", navigation: "Main navigation" },
    hero:
    {
        eyebrow: "24 RIDES · FOUR ZONES · FERNHOLLOW",
        title: "Pick your thrill.",
        intro: "Tap a dot, check the height, build your day. Jubilee Junction is a demo park — every number on this page is sample copy.",
        plan: "Plan your day", tickets: "See tickets", stamp: ["A LITTLE WONDER", "a whole lot", "of wheee.", "YOUR DAY, YOUR WAY"],
        mapLabel: "THE JUBILEE FIELD GUIDE", mapNumber: "01 / EXPLORE", mapTitle: "Four corners of happy.",
        mapHint: "Tap a numbered dot to meet a ride.", scroll: "Swipe the map to explore all four zones.",
        entrance: "HELLO, ADVENTURE", entranceSub: "MAIN ENTRANCE", mapAlt: "Illustrated park map with Candy Canyon, Sky Harbor, Lemon Grove and Mint Meadow.",
        north: "N", lake: "Cloud Lake", count: "map rides match", legend: "14 mapped rides · 24 in our sample park"
    },
    filters:
    {
        thrill: "Thrill", height: "Height",
        thrills: [["all", "All"], ["mild", "Mild"], ["wild", "Wild"], ["max", "Max"]],
        heights: [["all", "All"], ["any", "Any height"], ["102", "102 cm+"], ["122", "122 cm+"]],
        help: "Height filters show rides suitable for that minimum height, including lower requirements.",
        reset: "Reset filters"
    },
    zones:
    [
        { name: "Candy Canyon", color: "#FF7DA5", key: "candy" },
        { name: "Sky Harbor", color: "#79C7F2", key: "sky" },
        { name: "Lemon Grove", color: "#FFD23F", key: "lemon" },
        { name: "Mint Meadow", color: "#7BD9B0", key: "mint" }
    ],
    rides:
    [
        { id: "gumdrop", name: "Gumdrop Coaster", zone: 0, thrill: "mild", height: "any", icon: "coaster", blurb: "First loops, gentle speed, endless grins.", x: 177, y: 170 },
        { id: "taffy", name: "Taffy Twister", zone: 0, thrill: "wild", height: "102", icon: "spinner", blurb: "Spins until the horizon disagrees.", x: 332, y: 215 },
        { id: "diver", name: "Sky Diver", zone: 1, thrill: "max", height: "122", icon: "tower", blurb: "Straight down, politely.", x: 704, y: 118 },
        { id: "cloud", name: "Cloud Carousel", zone: 1, thrill: "mild", height: "any", icon: "carousel", blurb: "Bobbing seahorses, vintage paint.", x: 558, y: 207 },
        { id: "wheel", name: "Big Wheel", zone: 1, thrill: "mild", height: "any", icon: "wheel", blurb: "The view, at a civilized speed.", x: 767, y: 219 },
        { id: "drop", name: "Lemon Drop Tower", zone: 2, thrill: "wild", height: "122", icon: "tower", blurb: "Up slowly, down immediately.", x: 173, y: 370 },
        { id: "splash", name: "Citrus Splash", zone: 2, thrill: "wild", height: "102", icon: "flume", blurb: "The flume with the famous final wave.", x: 359, y: 418 },
        { id: "express", name: "Mint Express", zone: 3, thrill: "mild", height: "any", icon: "coaster", blurb: "A family coaster through the mint beds.", x: 557, y: 411 },
        { id: "racers", name: "Meadow Racers", zone: 3, thrill: "wild", height: "102", icon: "spinner", blurb: "Head-to-head karts, one winner's photo.", x: 759, y: 385 },
        { id: "ribbons", name: "Ribbon Racers", zone: 0, thrill: "mild", height: "any", icon: "spinner", blurb: "Round the bend, under the bunting.", x: 112, y: 240 },
        { id: "sugar", name: "Sugar Spin", zone: 0, thrill: "wild", height: "102", icon: "spinner", blurb: "A little sugar rush, with extra turns.", x: 374, y: 106 },
        { id: "kite", name: "Kite Flyers", zone: 1, thrill: "wild", height: "102", icon: "wheel", blurb: "Swoop through a make-believe summer sky.", x: 817, y: 141 },
        { id: "lemon", name: "Lemon Squeeze", zone: 2, thrill: "mild", height: "any", icon: "carousel", blurb: "Small turns for the smallest explorers.", x: 367, y: 352 },
        { id: "clover", name: "Clover Cups", zone: 3, thrill: "mild", height: "any", icon: "spinner", blurb: "A meadow-sized swirl for the whole family.", x: 666, y: 470 }
    ],
    rideSection: { label: "ALL RIDES", title: "Nine of 24, filtered.", intro: "A first loop or a big leap? There's a little happy here for everyone.", note: "HEIGHTS AND THRILL LEVELS ARE SAMPLE DATA.", count: "featured rides match", number: "02 / FIND YOUR FUN" },
    actions: { add: "Add to my day", added: "In your day", close: "Close ride details", up: "Move up", down: "Move down", remove: "Remove", done: "Mark completed", undo: "Mark not completed", clear: "Clear the day" },
    detail: { height: "Minimum height", thrill: "Thrill level", any: "Any height", cm: "cm+", added: "Added to your day.", saved: "Your day is saved on this device.", unavailable: "Device storage is unavailable. Your plan will last for this visit only.", all: "All zones", matched: "Matches your filters", dimmed: "Does not match your filters" },
    ticketSection:
    {
        label: "TICKETS", title: "Pick your wristband.", number: "03 / MAKE A DAY OF IT",
        intro: "One happy day. Or a whole summer of them.", ribbon: "PICKED FOR SUMMER",
        buy: "Buy — demo", note: "Demo button — no ticketing is connected; nothing is charged.", sample: "PRICES ARE SAMPLE DATA.",
        selected: "Selected demo ticket:"
    },
    tickets:
    [
        { name: "Day pass", price: "$58", unit: "one person, one lovely day", perks: ["All 24 rides", "Both daily shows", "Free parking after noon"] },
        { name: "Season pass", price: "$149", unit: "a summer full of see-you-agains", perks: ["Every open day", "Bring-a-friend mornings", "10% off snacks"] },
        { name: "Family four", price: "$199", unit: "your favorite four, together", perks: ["Two grown-ups, two kids", "All rides and shows", "One souvenir photo"] }
    ],
    hours: { label: "TODAY'S HOURS", time: "10:00 — 20:00", note: "SAMPLE HOURS — NO REAL CLOCK.", title: "A little extra spectacle.", intro: "Leave a little room between the loops.", labelShows: "HOURS & SHOWS" },
    shows:
    [
        { id: "parade", name: "Parade of Sprinkles", time: "13:00 & 17:00", zoneName: "Main Street", blurb: "Floats, brass, one very slow tortoise.", kind: "parade" },
        { id: "dive", name: "Harbor Stunt Dive", time: "14:30", zoneName: "Sky Harbor stage", blurb: "Kites, trampolines, a suspicious amount of confetti.", kind: "show" },
        { id: "glow", name: "Lantern Glow", time: "19:30", zoneName: "Mint Meadow", blurb: "A quiet end; bring the sleepy ones.", kind: "show" }
    ],
    plan:
    {
        label: "PLAN YOUR DAY", title: "Your day, in order.", intro: "Tap rides and shows anywhere on this page — they land here, saved on this device.",
        empty: "Nothing yet — go tap something fun on the map.", emptyLink: "Back to the map", note: "Saved on this device only — this demo sends nothing.",
        stops: "stops", rides: "rides", shows: "shows", parades: "parade", completed: "completed", labelList: "Your ordered day plan"
    },
    footer:
    {
        address: "1 Confetti Way, Fernhollow — an invented park; rides, heights, hours and prices on this page are sample copy.",
        credit: "Template by VibeFather", creditUrl: "https://vibefather.ai/t/theme-park-website",
        license: "CC BY-NC 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
        signoff: "A pocketful of happy."
    }
};
