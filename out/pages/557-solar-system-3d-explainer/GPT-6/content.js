export const bodies =
[
    {
        id: "sun", name: "Sun", kind: "G2V star", kicker: "00 / THE CENTER OF THINGS", symbol: "☉",
        note: "99.86% of the system’s mass. The other eight are sharing the rounding error.",
        diameterKm: 1392700, distanceKm: 0, orbitDays: 0, rotationHours: 609.12, tiltDeg: 7.25,
        startAngleDeg: 0, tourAngleDeg: 0, color: "#e9ae55", surface: 0,
        radius: 5, distance: 0, atmosphere: null, rings: null,
        caption: "Start with the Sun. Over a million Earths could fit inside it by volume. Its light takes about eight minutes to reach us.",
        facts: [["Diameter", "865,370 mi"], ["Rotation", "~25.4 Earth days"], ["Surface", "~9,930 °F"]]
    },
    {
        id: "mercury", name: "Mercury", kind: "Terrestrial planet", kicker: "01 / THE INNER EDGE", symbol: "☿",
        note: "A small, cratered world. Fast around the Sun. In no hurry to turn.",
        diameterKm: 4879, distanceKm: 57900000, orbitDays: 87.97, rotationHours: 1407.6, tiltDeg: .034,
        startAngleDeg: 12, tourAngleDeg: 40, color: "#a6a29c", surface: 1,
        radius: .55, distance: 15, atmosphere: null, rings: null,
        caption: "Mercury takes 88 Earth days to orbit, but 59 to rotate. A sunrise-to-sunrise solar day lasts about 176 Earth days.",
        facts: [["Diameter", "3,032 mi"], ["Mean Sun distance", "36.0 million mi"], ["Year", "88 Earth days"]]
    },
    {
        id: "venus", name: "Venus", kind: "Terrestrial planet", kicker: "02 / THE CLOUDY ONE", symbol: "♀",
        note: "Nearly our size. Nothing like our weather. Its thick atmosphere keeps the heat in.",
        diameterKm: 12104, distanceKm: 108200000, orbitDays: 224.7, rotationHours: -5832.5, tiltDeg: 177.36,
        startAngleDeg: 153, tourAngleDeg: 90, color: "#d9b685", surface: 2,
        radius: .95, distance: 22, atmosphere: null, rings: null,
        caption: "Venus rotates backward, once every 243 Earth days. Its surface is hotter than Mercury’s, even though it is farther from the Sun.",
        facts: [["Diameter", "7,521 mi"], ["Mean Sun distance", "67.2 million mi"], ["Year", "224.7 Earth days"]]
    },
    {
        id: "earth", name: "Earth", kind: "Terrestrial planet", kicker: "03 / YOU ARE HERE", symbol: "⊕",
        note: "Our entire frame of reference. A thin atmosphere, some water, and everything we know.",
        diameterKm: 12742, distanceKm: 149600000, orbitDays: 365.256, rotationHours: 23.934, tiltDeg: 23.44,
        startAngleDeg: 51, tourAngleDeg: 130, color: "#6ba7c0", surface: 3,
        radius: 1.18, distance: 29, atmosphere: null, rings: null,
        caption: "This is the ruler we are used to. Earth is about 7,918 miles across. Its average distance from the Sun is roughly 11,741 Earth diameters.",
        facts: [["Diameter", "7,918 mi"], ["Mean Sun distance", "93.0 million mi"], ["Year", "365.26 Earth days"]]
    },
    {
        id: "mars", name: "Mars", kind: "Terrestrial planet", kicker: "04 / THE NEXT DOOR WORLD", symbol: "♂",
        note: "A rust-colored desert with a day only a little longer than ours.",
        diameterKm: 6779, distanceKm: 227900000, orbitDays: 686.98, rotationHours: 24.623, tiltDeg: 25.19,
        startAngleDeg: 240, tourAngleDeg: 170, color: "#c57858", surface: 1,
        radius: .75, distance: 37, atmosphere: null, rings: null,
        caption: "Mars is about half Earth’s diameter. After Mars comes the asteroid belt: scattered material, not the crowded obstacle course of the movies.",
        facts: [["Diameter", "4,212 mi"], ["Mean Sun distance", "141.6 million mi"], ["Year", "1.88 Earth years"]]
    },
    {
        id: "jupiter", name: "Jupiter", kind: "Gas giant", kicker: "05 / A DIFFERENT ORDER", symbol: "♃",
        note: "More than twice the mass of all the other planets combined. Still small beside the Sun.",
        diameterKm: 139820, distanceKm: 778600000, orbitDays: 4332.59, rotationHours: 9.925, tiltDeg: 3.13,
        startAngleDeg: 325, tourAngleDeg: 210, color: "#c4ab90", surface: 2,
        radius: 3.6, distance: 51, atmosphere: null, rings: null,
        caption: "Jupiter’s mean diameter is about eleven Earths. Even this giant is only a tenth the Sun’s width. There is no solid surface to stand on.",
        facts: [["Diameter", "86,881 mi"], ["Mean Sun distance", "483.8 million mi"], ["Year", "11.86 Earth years"]]
    },
    {
        id: "saturn", name: "Saturn", kind: "Gas giant", kicker: "06 / THE RINGED ONE", symbol: "♄",
        note: "The rings are mostly ice. An enormous spread, and remarkably little thickness.",
        diameterKm: 116460, distanceKm: 1433500000, orbitDays: 10759.22, rotationHours: 10.7, tiltDeg: 26.73,
        startAngleDeg: 147, tourAngleDeg: 250, color: "#d3bc8c", surface: 2,
        radius: 3, distance: 65, atmosphere: null, rings: [1.35, 2.3],
        caption: "Saturn’s bright main rings stretch roughly 170,000 miles across, but much of the ring system is only tens of feet thick. The model exaggerates their opacity.",
        facts: [["Diameter", "72,367 mi"], ["Mean Sun distance", "890.7 million mi"], ["Year", "29.46 Earth years"]]
    },
    {
        id: "uranus", name: "Uranus", kind: "Ice giant", kicker: "07 / OFF AXIS", symbol: "♅",
        note: "Its rotation axis lies almost in its orbital plane. A planet with a sideways habit.",
        diameterKm: 50724, distanceKm: 2872500000, orbitDays: 30688.5, rotationHours: -17.24, tiltDeg: 97.77,
        startAngleDeg: 265, tourAngleDeg: 290, color: "#91c5ca", surface: 2,
        radius: 2, distance: 79, atmosphere: null, rings: null,
        caption: "Uranus tips by about 98 degrees. It takes 84 Earth years to circle the Sun, with long, strongly seasonal periods of light and dark near its poles.",
        facts: [["Diameter", "31,518 mi"], ["Mean Sun distance", "1.785 billion mi"], ["Year", "84.0 Earth years"]]
    },
    {
        id: "neptune", name: "Neptune", kind: "Ice giant", kicker: "08 / NOT QUITE THE EDGE", symbol: "♆",
        note: "The last planet, not the end of the Solar System. There is plenty more nothing after this.",
        diameterKm: 49244, distanceKm: 4495100000, orbitDays: 60182, rotationHours: 16.11, tiltDeg: 28.32,
        startAngleDeg: 35, tourAngleDeg: 330, color: "#6683bd", surface: 2,
        radius: 1.9, distance: 93, atmosphere: null, rings: null,
        caption: "Neptune takes about 165 Earth years to orbit. Now use one scale for everything. The worlds nearly disappear. That is not a rendering mistake.",
        facts: [["Diameter", "30,599 mi"], ["Mean Sun distance", "2.793 billion mi"], ["Year", "164.8 Earth years"]]
    }
];
