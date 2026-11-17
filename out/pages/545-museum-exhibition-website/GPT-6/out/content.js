export const content =
{
    brand: "The Meridian House",
    slug: "the-meridian-house",
    city: "Ashport",
    navigation:
    {
        skip: "Skip to exhibition",
        menu: "Open navigation",
        close: "Close navigation",
        mainLabel: "Main navigation",
        mobileLabel: "Mobile navigation",
        tickets: "Timed tickets",
        links: [["Exhibition", "#exhibition"], ["Objects", "#objects"], ["Visit", "#visit"], ["Events", "#events"]]
    },
    hero:
    {
        eyebrow: "Current exhibition · Ashport",
        title: ["Measure", "of Days"],
        description: "Timekeeping before the clock: forty-one objects that measured, counted and marked the day — from spiral water clocks to knotted cords.",
        link: "Plan a visit",
        caption: "Spiral water clock · Cast bronze",
        collection: "Collection of The Meridian House",
        index: "An exhibition in five galleries",
        marker: "01 / 41"
    },
    introduction:
    {
        label: "Before the clock",
        copy: "Before mainsprings, people kept time with water, sand, knots and light. Measure of Days gathers the tools they built — humble, exact and quietly beautiful — across five galleries on the first floor.",
        stats: [["41", "Objects"], ["5", "Galleries"], ["40", "Min slow visit"]]
    },
    objects:
    {
        label: "Selected from the collection",
        title: "Six objects, held still.",
        description: "Click any object to look closer — the image zooms inside its frame; drag to pan.",
        inspect: "Look closer",
        inspectPrefix: "Inspect",
        frameSuffix: "inspection",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        reset: "Reset inspection",
        hint: "Drag to pan · Scroll to zoom · Esc to reset",
        items:
        [
            {
                name: "Spiral water clock", material: "Cast bronze",
                note: "Water entered at the rim and reached the center in one measured hour; the steps marked the quarters.",
                image: "./images/spiral-water-clock.webp",
                alt: "A cast bronze spiral basin with stepped walls, photographed on a neutral gray backdrop",
                ratio: "4 / 3", gallery: "Gallery I · Water"
            },
            {
                name: "Notched tide bowl", material: "Speckled stoneware",
                note: "A rim of forty notches; one pebble moved per day kept the household's count.",
                image: "./images/tide-bowl.webp",
                alt: "A wide stoneware bowl with a notched rim on a neutral gray backdrop",
                ratio: "1", gallery: "Gallery II · Counting"
            },
            {
                name: "Black sand glass", material: "Blown glass, black sand",
                note: "Turned at the knock of the night watch; runs in four minutes.",
                image: "./images/black-sand-glass.webp",
                alt: "A two-bulb glass vessel with black sand on a neutral gray backdrop",
                ratio: "1", gallery: "Gallery III · Sand"
            },
            {
                name: "Counting cord", material: "Flax fiber",
                note: "Knots in clusters of days; a year could be held in two hands.",
                image: "./images/counting-cord.webp",
                alt: "A knotted flax cord coiled into a flat spiral on a neutral gray backdrop",
                ratio: "1", gallery: "Gallery IV · Knots"
            },
            {
                name: "Ring dial", material: "Pierced brass",
                note: "Three rings, three holes; aligned to the noon shadow it gave the month.",
                image: "./images/ring-dial.webp",
                alt: "Three nested pierced brass rings on a neutral gray backdrop",
                ratio: "1", gallery: "Gallery V · Light"
            },
            {
                name: "Day tile", material: "Fired clay, white slip",
                note: "A pressed grid of thirty dots per face, scratched off at dusk.",
                image: "./images/day-tile.webp",
                alt: "A square clay tile incised with a grid of dots on a neutral gray backdrop",
                ratio: "1", gallery: "Gallery II · Counting"
            }
        ]
    },
    visit:
    {
        label: "A little time, well spent",
        title: "Visit",
        hoursLabel: "Hours",
        hours: [["Tue–Fri", "10:00–18:00"], ["Sat", "10:00–20:00"], ["Sun", "11:00–17:00"], ["Mon", "Closed"]],
        note: "Last timed entry 60 minutes before close.",
        addressLabel: "Find us",
        address: "3 Quillon Street, Ashport",
        directions: "Two blocks from the Harbor tram stop; the door is under the blue awning.",
        admissionLabel: "Admission",
        admission: "Adults $18 · Under 18 free · Pay-what-you-wish after 16:00."
    },
    tickets:
    {
        label: "Make room for a slow visit",
        title: "Timed tickets",
        copy: "Entry is by ninety-minute slot. Pick a day and a time below — the pick saves on this device. It is a sample planner: no payment is taken and tickets are not held.",
        people: [{key: "adults", name: "Adults", price: 18, label: "$18"}, {key: "children", name: "Under 18", price: 0, label: "Free"}, {key: "reduced", name: "Reduced", price: 12, label: "$12"}],
        dayLabel: "Day",
        timeLabel: "Time",
        days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        times: [{time: "10:00", label: "Available"}, {time: "11:30", label: "Few left"}, {time: "13:00", label: "Sold out"}, {time: "14:30", label: "Available"}, {time: "16:00", label: "Pay-what-you-wish"}],
        closed: "Closed",
        soldOut: "Sold out",
        total: "Total",
        donation: "Pay what you wish",
        donationNote: "Choose your contribution at admission.",
        reserve: "Reserve a slot",
        save: "Saved to this device.",
        disclaimer: "Sample picker — nothing was charged; tickets are not held.",
        edit: "Edit saved pick",
        empty: "Add at least one visitor.",
        unavailable: "Choose an available day and time.",
        storageError: "Your device could not save this pick. Nothing was charged; tickets are not held.",
        decrease: "Decrease",
        increase: "Increase",
        summary: "Your sample visit",
        visitor: "visitors",
        status: "Planner status"
    },
    events:
    {
        label: "Around the exhibition",
        title: "Events",
        footnote: "Sample programme — a weekly pattern, not a live calendar.",
        add: "Add to my plan",
        remove: "Remove from my plan",
        saved: "Added to your device's sample event plan.",
        removed: "Removed from your sample event plan.",
        storageError: "This device could not save your event plan.",
        items:
        [
            {day: "SAT", time: "11:00", title: "The Long Noon", type: "Curator's talk", place: "Gallery II", note: "Included with a ticket."},
            {day: "SUN", time: "14:00", title: "Knot a Counting Cord", type: "Family workshop", place: "Learning Studio", note: "Materials $6."},
            {day: "THU", time: "18:00", title: "Measures at Dusk", type: "Late opening", place: "Whole museum", note: "Bar in the atrium."},
            {day: "WED", time: "10:00", title: "Quiet Hour", type: "Low light and low sound", place: "Gallery I", note: "Sensory-friendly."}
        ]
    },
    shop:
    {
        label: "At the atrium",
        title: "Take the day home.",
        note: "At the museum shop, by the atrium.",
        items: [{name: "Catalogue", price: "$34", art: "book"}, {name: "Counting-cord kit", price: "$16", art: "cord"}, {name: "Black-sand glass", price: "$48", art: "glass"}]
    },
    footer:
    {
        sample: "Objects, events and prices shown are invented sample content.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/museum-exhibition-website",
        back: "Back to exhibition"
    }
};
