export const content =
{
    brand: "Vault & Light Atlas",
    building: "Alderquay Cathedral",
    architecture: "Gothic",
    audience: "architecture students",
    primaryCTA: "Begin the light tour",
    title: "Vault & Light Atlas — Alderquay Cathedral",
    navigation: [["Tour", "tour"], ["Light study", "light"], ["Field notes", "notes"]],
    hero:
    {
        eyebrow: "Alderquay Cathedral / A procedural architecture tour",
        title: "A cathedral,<br>read in light.",
        body: "Alderquay Cathedral is a fictional Gothic interior built entirely in code. Follow six architectural stops and change the sun to see how structure shapes daylight.",
        facts: ["6 bays", "22 m vault crown", "06:00–20:00 light range"]
    },
    stops:
    [
        { name: "The nave", title: "A cathedral, read in light.", body: "A clear central axis organizes movement, view, and daylight from threshold to apse.", dimension: "6 repeated bays", position: [0, 2.2, 7], target: [0, 10, -32] },
        { name: "Clustered columns", title: "Many shafts. One structural pier.", body: "Twelve engaged shafts gather around each stone core. The lower bundle supports the arcade while the upper shafts continue visually into the vault ribs.", dimension: "12 engaged shafts per pier", noteName: "Clustered piers", position: [-2.4, 2.3, -1], target: [-4.8, 8, -4] },
        { name: "Pointed arches", title: "A curve with a steeper purpose.", body: "Two arcs meet at a point, directing thrust downward and allowing a taller opening than a round arch of the same span.", note: "Paired arcs meet above each opening, making the bay rhythm and downward load path visible.", dimension: "8m bay spacing", noteName: "Pointed arcades", position: [1.8, 2.4, -10], target: [0, 12, -16] },
        { name: "Ribbed vaults", title: "The ceiling becomes a visible framework.", body: "Four curved rib segments meet above each bay, giving the stone ceiling a legible skeleton while thinner webs fill the spans between.", note: "Curved ribs meet at a central boss while thinner webs complete the ceiling surface.", dimension: "4 rib segments per bay", position: [0, 2.5, -18], target: [0, 21, -24] },
        { name: "Clerestory & stained glass", title: "Openings that edit the sun.", body: "High windows admit daylight above the arcade. Abstract amber, ruby, cobalt, and teal glass separates that light into shifting patches of color.", note: "High geometric panels filter daylight through amber, ruby, cobalt, and teal without narrative figures.", dimension: "12 abstract lancets", noteName: "Clerestory glass", position: [2.6, 2.4, -29], target: [7.8, 10, -32] },
        { name: "Apse", title: "Structure and light arrive together.", body: "The central axis ends beneath a faceted oculus. Piers, vault ribs, and floor projections converge to make the destination visible from the threshold.", note: "The final opening anchors the long view and gives the colored light a destination.", dimension: "1 axial faceted oculus", noteName: "Apse & oculus", position: [0, 2.5, -41], target: [0, 11, -52] }
    ],
    presets: [{ label: "Morning", time: 480 }, { label: "Midday", time: 750 }, { label: "Late afternoon", time: 1050 }],
    labels:
    {
        time: "Time of day", morning: "MORNING", afternoon: "AFTERNOON", midday: "MIDDAY", evening: "EVENING",
        previous: "Previous", next: "Next", reset: "Reset view", look: "Drag to look around · arrow keys to look · R to reset",
        compactLook: "Look around", notes: "Read field notes", menu: "Open navigation", close: "Close navigation",
        renderer: "Interactive 3D nave", fallback: "WebGL is unavailable. An interactive architectural diagram replaces the 3D view.",
        illustrative: "Illustrative model", keys: "Keyboard: arrows look around; R resets the view. Use the stop buttons to move through the nave.",
        navLabel: "Main navigation", view: "View in tour", seeLight: "See this light in the nave",
        restart: "Restart at 16:30", explore: "Explore the light study", studyTime: "TIME", elevation: "SOLAR ELEVATION", length: "PROJECTION LENGTH",
        mode: "Gothic / Interior study", tourEyebrow: "Architecture in place", step: "Stop", intro: "An original interior study for architecture students.",
        fallbackStop: "Highlighted architectural stop", fallbackTime: "Shared daylight model"
    },
    light:
    {
        eyebrow: "01 / Light study", title: "One room. Fourteen hours of daylight.",
        lead: "Move from 06:00 to 20:00 in 15-minute steps. The sun, glass brightness, and floor projections share the same time value.",
        caption: "A section through one bay. Geometry and daylight are illustrative.",
        high: "High opening", incidence: "Changing incidence", projection: "Colored projection", ray: "Sun ray",
        svg: `<svg viewBox="0 0 640 480" role="img" aria-label="Architectural section through a Gothic bay, with changing sun ray and floor projection">
            <defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#b8aa93" stroke-opacity=".11"/></pattern></defs>
            <rect width="640" height="480" fill="url(#grid)"/>
            <path d="M114 392V168Q166 58 320 48Q474 58 526 168V392M136 392V174Q193 89 320 72Q447 89 504 174V392M92 392H548" fill="none" stroke="#b8aa93" stroke-width="2"/>
            <path d="M136 199H175V279H136M465 199H504V279H465" fill="#d9a44a" fill-opacity=".25" stroke="#d8b26e"/>
            <path d="M136 280H504M320 72V94M114 414H526M114 408V420M526 408V420" stroke="#b8aa93" stroke-width="1" fill="none" stroke-dasharray="4 5"/>
            <polygon id="diagram-projection" points="165,391 390,391 445,379 212,379" fill="#d9a44a" opacity=".45"/>
            <path id="diagram-ray" d="M77 133L165 229L390 389" fill="none" stroke="#d8b26e" stroke-width="2"/>
            <circle cx="77" cy="133" r="14" fill="none" stroke="#d8b26e"/>
            <path d="M55 133H46M99 133H108M77 111V102M77 155V164" stroke="#d8b26e"/>
            <g fill="#a69b8b" font-family="Plex,monospace" font-size="12"><text x="246" y="442">16 m / illustrative width</text><text x="27" y="32">SECTION A—A</text><text x="522" y="110">22 m</text></g>
            <g fill="#f2ece1" font-family="Inter,sans-serif" font-size="13"><text x="190" y="216">High opening</text><text x="260" y="297">Changing incidence</text><text x="349" y="366">Colored projection</text><text x="32" y="190">Sun ray</text></g>
        </svg>`
    },
    notes:
    {
        eyebrow: "02 / Field notes", title: "A structure you can read twice.",
        intro: "The tour explains each element in place. These notes keep the same six ideas available as text, with sample dimensions for the fictional Alderquay Cathedral.",
        disclaimer: "All geometry and dimensions are illustrative, not a survey of a real building."
    },
    closing:
    {
        eyebrow: "Alderquay Cathedral / Complete the route", title: "Follow one ray.<br>Read the whole room.",
        body: "Return to the threshold, choose another hour, or revisit any structural detail in the field notes."
    },
    footer:
    {
        brand: "Vault & Light Atlas — A procedural Gothic interior study.",
        note: "Fictional building. Illustrative geometry and daylight.",
        credit: "Template by VibeFather", creditURL: "https://vibefather.ai/t/3d-cathedral-light-tour",
        license: "CC BY-NC 4.0", licenseURL: "https://creativecommons.org/licenses/by-nc/4.0/"
    }
};
