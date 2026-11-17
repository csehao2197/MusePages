export const content =
{
    variables:
    {
        brand: "Phase Assembly",
        venue: "The Copper Vault",
        city: "West Briar",
        address: "42 Foundry Lane",
        credit: "Template by VibeFather"
    },
    meta:
    {
        title: "Phase Assembly — Find your frequency",
        description: "An original fictional Friday techno night at The Copper Vault, West Briar.",
        creditUrl: "https://vibefather.ai/t/techno-club-night-event-page"
    },
    nav:
    {
        label: "Main navigation",
        skip: "Skip to poster",
        logo: ["PHASE", "ASSEMBLY"],
        items: [["Lineup", "#lineup"], ["The room", "#room"], ["Tickets", "#tickets"], ["Door policy", "#policy"]],
        strap: "INDEPENDENT SOUND. SHARED SPACE.",
        badge: "FRIDAYS / 18+"
    },
    hero:
    {
        eyebrow: "Recurring Friday / 10 PM–4 AM / 18+",
        title: ["Feel the", "room find", "its pulse."],
        intro: "Six hours below the surface.\nA different frequency, together.",
        primary: "Explore ticket options",
        secondary: "Read the door policy",
        location: "The Copper Vault / West Briar",
        serial: "PA—FM / 132",
        artworkAlt: "Original chrome signal sculpture: intersecting elliptical ribbons around an acid waveform on violet.",
        corner: "PRESS PLAY.\nENTER THE FREQUENCY.",
        lower: "ONE ROOM. FOUR PERSPECTIVES.",
        bottom: ["NO HEADLINERS. JUST A LONG ARC.", "FICTIONAL NIGHT / REAL ORIGINAL SOUND"]
    },
    audio:
    {
        title: "A frequency to start with.",
        label: "Original bundled demo loop / 132 BPM / no vocals",
        file: "./audio/circuit-loop.wav",
        play: "Play loop",
        pause: "Pause loop",
        volume: "Volume",
        waveform: "Waveform",
        spectrum: "Spectrum",
        pauseVisuals: "Pause visuals",
        resumeVisuals: "Resume visuals",
        idle: "Paused — press Play loop",
        active: "Live signal / original synthesis",
        frozen: "Visuals paused / audio continues",
        reduced: "Reduced motion / stable level",
        level: "Level",
        canvas: "Real-time audio waveform or spectrum; elapsed time and level are also provided as text.",
        error: "Audio could not load. Try again",
        retry: "Try again",
        note: "Audio preview only. This fictional event has no ticket sale or real announced date."
    },
    lineup:
    {
        number: "01 / THE RUNNING ORDER",
        title: "Four voices.\nOne long arc.",
        intro: "From the first low pulse to the last loose thread. No rush, no reset.",
        overnight: "After-midnight times continue the same Friday running order. No calendar date is announced.",
        savedOnly: "Saved only",
        clear: "Clear saved",
        count: "saved",
        note: "Artist note",
        save: "Add to my running order",
        remove: "Remove from my running order",
        empty: "Your running order is empty. Switch off Saved only to find your frequency.",
        fictional: "FICTIONAL ARTIST / ORIGINAL MUSICAL SKETCH",
        close: "Close artist note",
        artists:
        [
            {
                name: "Nilo Trace",
                time: "10–11:30 PM",
                sound: "Soft-edged sub pressure. Space between every strike.",
                type: "orbit",
                bio: "Nilo Trace is a fictional selector imagined for the opening stretch at The Copper Vault. Their approach begins with negative space: rounded sub tones, dusty chord fragments, and percussion that arrives a fraction later than expected. Instead of chasing a first peak, Nilo lets small changes gather weight. This opening set is a patient invitation to settle into the room, find a comfortable distance, and listen with your whole body."
            },
            {
                name: "Veya Flux",
                time: "11:30 PM–1 AM",
                sound: "Broken metallic rhythms, stitched into a steady current.",
                type: "grid",
                bio: "Veya Flux is a fictional producer whose imagined sound lives between rigid grids and unruly textures. Small metallic hits gather around a steady pulse, then slip sideways into syncopation. At The Copper Vault, Veya takes the opening warmth somewhere more angular without breaking its continuity. The musical approach favors economical arrangements, careful handovers, and enough silence for each new shape to register. Nothing here represents a real performer or booking."
            },
            {
                name: "Kern Relay",
                time: "1–2:30 AM",
                sound: "Coiled bass lines and a slow-building, physical release.",
                type: "wave",
                bio: "Kern Relay is an invented artist built around the idea of pressure with somewhere to go. Their fictional sets connect firm low frequencies with curling, acidic phrases, returning to familiar motifs after unexpected detours. In this running order, Kern holds the central stretch without making every moment a climax. The aim is sustained movement and clear breathing space, with transitions that feel like a single mechanism gradually changing its shape."
            },
            {
                name: "Esme Drift",
                time: "2:30–4 AM",
                sound: "Off-axis electronics. An open-ended way back up.",
                type: "star",
                bio: "Esme Drift is a fictional closing selector with an ear for the unresolved. Their imagined collection moves from sturdy rhythms into elastic electro patterns, translucent pads, and the occasional rough edge left deliberately intact. At The Copper Vault, the final stretch loosens the room rather than racing the clock. Esme's musical approach treats the ending as a gradual change in perspective, leaving listeners room to slow down on their terms."
            }
        ]
    },
    room:
    {
        number: "02 / KNOW YOUR SPACE",
        title: "The room before\nthe room.",
        subtitle: "The Copper Vault, mapped simply.",
        address: "42 Foundry Lane, West Briar",
        demo: "Fictional demo location / not a real venue map",
        mapLabel: "Illustrative venue plan with entrance at bottom left, quiet room at top left, main floor in the center and water point on the right.",
        legend: "Dashed line = illustrative step-free route",
        access: "Access questions need real venue confirmation before a real visit.",
        travel: "Demo travel note: fictional district tram stop Foundry End, two blocks east. No real travel directions.",
        zones:
        [
            {name: "Entrance", note: "Have original photo ID ready for the illustrative admission check; the doorway is at the lower left of this plan."},
            {name: "Main floor", note: "The central dance space. Keep the floor open for movement and leave your camera flash off."},
            {name: "Water point", note: "A free refill station on the right side of this fictional room. Bring an empty reusable bottle in this local plan."},
            {name: "Quiet room", note: "A lower-volume space at the upper left. Give people room to decompress and keep conversations gentle."},
            {name: "Step-free route", note: "Illustrative route, 1.2m minimum drawn width, linking the entrance to each room. This diagram is not verified access information for a real building."}
        ]
    },
    tickets:
    {
        number: "03 / MAKE A LOCAL PLAN",
        title: "Choose how\nyou arrive.",
        intro: "A useful estimate. Never a ticket.",
        note: "All options are illustrative, 18+ only and grant no admission. No real availability, payments or reservations.",
        choose: "Plan this option",
        selected: "Edit local plan",
        unit: "PER PERSON / USD",
        tiers:
        [
            {name: "First through", price: 16, rule: "Arrive before 11 PM", label: "01 / EARLY ARRIVAL"},
            {name: "On your time", price: 23, rule: "Any time after doors", label: "02 / STANDARD"},
            {name: "At the door", price: 29, rule: "Comparison only. No stock promised.", label: "03 / DOOR ESTIMATE"}
        ],
        drawerTitle: "Your local ticket plan",
        drawerNote: "This estimate is not a ticket. It grants no admission.",
        quantity: "People (1–6)",
        tier: "Arrival option",
        fees: "Fees",
        noFees: "$0 / no transaction",
        total: "Estimated total",
        id: "I understand the 18+ photo-ID rule",
        policy: "I have read the door policy",
        readPolicy: "Read the full door policy",
        save: "Save local ticket plan",
        close: "Close ticket plan",
        reset: "Reset plan",
        remove: "Remove saved plan",
        confirmation: "Saved on this device only. No ticket, entry reservation, payment or message was created.",
        removed: "Local plan removed. No admission was ever reserved.",
        savedLabel: "LOCAL PLAN SAVED",
        unsavedLabel: "LOCAL ESTIMATE / THIS VISIT ONLY",
        edit: "Edit saved plan",
        validation: "Choose 1–6 people and acknowledge both door-policy statements.",
        storage: "Device storage is unavailable. Changes work for this visit only and were not saved."
    },
    policy:
    {
        number: "04 / THE NON-NEGOTIABLES",
        title: "Good sound.\nClear boundaries.",
        rules:
        [
            "18+ only. Bring original government-issued photo ID.",
            "Consent is not optional. Harassment, intimidation and discriminatory behavior are not welcome.",
            "No weapons, illegal substances, outside drinks or large bags.",
            "No flash photography. Leave room for other people.",
            "Respect floor staff and the lower-volume room."
        ],
        disclaimer: "This demo sells no entry and cannot enforce real-world safety; a real organizer must publish and maintain its own policy.",
        faqTitle: "Before you head down.",
        faqs:
        [
            ["Can I leave and return?", "Illustrative policy: no re-entry. Confirm with a real operator before a real event."],
            ["Is the audio a real recording?", "It is an original synthesized demo loop bundled locally, not a performer set."],
            ["Can I buy tickets here?", "No. You can save a local plan only. No sale, reservation or payment takes place."],
            ["Does this announce a real night?", "No. Phase Assembly, all performers, The Copper Vault and its address are fictional."]
        ]
    },
    footer:
    {
        location: "THE COPPER VAULT / WEST BRIAR",
        note: "Fictional event. Original sound. Local-only tools.",
        back: "Back to poster",
        license: "CC BY-NC 4.0 / non-commercial adaptation",
        licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/"
    }
};
