export const content =
{
    brand: "Asterwyn",
    collection: "The Lantern Sky",
    headline: "Find the stories between the stars.",
    audience: "curious stargazers and families reading together",
    themes: "wonder, courage, and connection",
    storageKey: "asterwyn-creations-v1",
    defaultDate: "2026-09-21",
    names: "Lyra, Cygnus, Cassiopeia, Orion, Ursa Major, Corona Borealis",
    intro: "A field guide for curious stargazers and families reading together. Wander the night, follow six old patterns, and leave a new one of your own.",
    mobileIntro: "Wander the night, follow six old patterns, and leave a new one of your own.",
    ui:
    {
        subtitle: "An imaginative night atlas",
        help: "How to explore",
        eyebrow: "The Lantern Sky · SIX STORIES",
        theme: "Original retellings shaped by wonder, courage, and connection.",
        selected: "Selected story",
        unselected: "Unselected pattern",
        index: "Stories in this sky",
        blank: "Prefer a blank page?",
        make: "Make your own",
        choose: "Choose a constellation",
        field: "FIELD 01",
        explore: "Explore",
        create: "Create",
        drag: "Drag to wander · Tap a pattern to trace",
        touch: "Drag to wander · Tap a star or pattern",
        makerHelp: "Tap up to 8 stars to connect your shape",
        disclosure: "Simplified patterns · Illustrative sky, not a live ephemeris",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        resetView: "Reset view",
        storyLabel: "CONSTELLATION STORY",
        note: "Pattern note",
        trace: "Trace again",
        instead: "Make a constellation instead",
        makerTitle: "Name a new pattern",
        makerBody: "Connect three to eight maker stars. Your creation stays in this browser.",
        name: "Constellation name",
        placeholder: "For example, The Quiet Harbor",
        undo: "Undo",
        clear: "Clear",
        selectStar: "Choose a maker star",
        star: "Star",
        add: "Add point",
        save: "Save constellation",
        savedTitle: "Your small sky",
        empty: "No saved patterns yet. Connect at least three stars to begin.",
        load: "Load",
        delete: "Delete",
        confirm: "Confirm delete",
        cancel: "Cancel",
        date: "Sky at date",
        resetDate: "Reset date",
        day: "Day of the illustrative atlas",
        footer: "Six old patterns. One small sky of your own.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/constellation-story-map",
        guideTitle: "A few ways to wander",
        close: "Close guide",
        guideNote: "Star patterns are simplified. Classical names belong to old stories; every retelling here is newly written.",
        ready: "Lyra is traced. Choose a story, or make one of your own.",
        saved: "Saved to this browser",
        full: "Your small sky is full. Delete a saved pattern before saving another.",
        storageError: "Browser storage is unavailable. This pattern is not saved across reloads.",
        maxPoints: "Eight stars connected. Undo or clear to change your pattern.",
        duplicate: "That star is already connected. Choose another star.",
        cleared: "Pattern cleared.",
        undone: "Last point removed.",
        exploreStatus: "Explore mode. Choose one of six stories.",
        createStatus: "Create mode. Connect three to eight maker stars.",
        resetStatus: "View reset.",
        dateResetStatus: "Illustrative date reset to Sep 21, 2026.",
        dateLimit: "Choose a date in the fixed 2026 atlas.",
        traced: (name) => `${name} traced.`,
        count: (count) => `${count}/8 stars`,
        savedCount: (count) => `${count} stars`,
        dateStatus: (date) => `${date} · Illustrative sky only.`,
        zoomStatus: (percent) => `${percent}% zoom.`,
        connected: (id, count) => `Star ${id} connected. ${count}/8 stars.`,
        savedStatus: (name) => `${name}. Saved to this browser.`,
        loaded: (name, count) => `${name} loaded. ${count} stars.`,
        deleted: (name) => `${name} deleted.`,
        panned: "Sky panned.",
        canvasExplore: "Illustrative star field in Explore mode. Choose a constellation using the story buttons or selector. Arrow keys pan; plus and minus zoom.",
        canvasCreate: "Illustrative star field in Create mode. Choose maker stars with the labeled selector and Add point button. Arrow keys pan; plus and minus zoom; Escape returns to Explore.",
        guide:
        [
            ["Drag", "Move across the field, or use the arrow keys on the focused canvas."],
            ["Trace", "Choose a pattern in the sky or story index to draw its lines and read an original retelling."],
            ["Make", "Connect three to eight maker stars, name the pattern, and save it locally. The star selector offers the same action without a pointer."],
            ["Change the date", "Move through the fixed 2026 atlas to shift the illustrative field. This is not an astronomical forecast or an astrology reading."]
        ],
        chapters:
        [
            "Chapter I · The listening sky",
            "Chapter II · The turning sky",
            "Chapter III · The wandering sky",
            "Chapter IV · The homeward sky"
        ]
    },
    stories:
    [
        {
            epithet: "The listening harp",
            summary: "A small instrument, a lasting act of listening.",
            story: "Orpheus carried a lyre whose music made even stones seem to listen. In this retelling, the instrument remains after the player is gone, holding not a spell but a reminder: careful listening can change the shape of a room. The small harp becomes an invitation to make something worth remembering.",
            note: "Five guide points form a small harp-like frame. Vega is the brightest anchor in this simplified map."
        },
        {
            epithet: "The traveling swan",
            summary: "Courage is sometimes the next small stretch of sky.",
            story: "A swan circles the old stories in more than one disguise. Here, its long wings are read as a sign of safe passage rather than a literal transformation. The bird carries a traveler over dark water, asking them to trust the next small stretch of sky.",
            note: "A long central line and crossbar give this pattern its swan and Northern Cross associations."
        },
        {
            epithet: "The borrowed crown",
            summary: "A crown passed from hand to generous hand.",
            story: "A queen speaks too proudly and finds her place in the heavens turned upside down. This version keeps the lesson modest: praise is fleeting, but generosity can outlast a throne. Her five bright points rise and dip like a crown passed from hand to hand.",
            note: "Five points make the familiar W-shaped rhythm used for this illustrative pattern."
        },
        {
            epithet: "The winter walker",
            summary: "A familiar journey, read in footprints and frost.",
            story: "A hunter strides through many ancient tales, forever followed by his dogs and the coming winter. Our telling imagines him less as a conqueror than a watchful walker, learning the season by footprints and frost. His belt becomes three pauses on a long journey home.",
            note: "Three closely spaced belt points sit between four corner stars in this simplified figure."
        },
        {
            epithet: "The northern bear",
            summary: "The great bear keeps a familiar path.",
            story: "A mother and child are set among the stars as bears in a story told across generations. Here the great bear guards a familiar path rather than a treasure. In real skies, people have used the bowl’s outer stars as pointers toward north; this decorative field is only a place to share that story, never a navigation chart.",
            note: "Seven points form the Big Dipper asterism, part of the larger Ursa Major constellation; do not use this illustration to navigate."
        },
        {
            epithet: "The kindness arc",
            summary: "Every jewel remembers a kindness.",
            story: "A crown shines after the wedding feast has ended. This retelling treats each jewel as a promise kept by someone who helped its wearer begin again. The arc is less a royal ornament than a small constellation of kindness, bright enough to follow without needing a throne.",
            note: "Seven guide points form a compact arc; real constellations occupy three-dimensional space, not flat connect-the-dots figures."
        }
    ]
};
