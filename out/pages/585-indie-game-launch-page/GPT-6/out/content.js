export const content =
{
    game: "Emberveil",
    studio: "Hollowmoor Games",
    world: "the Ashen Vale",
    window: "the ember season",
    icons: "./assets/icons.svg",
    favicon: "./assets/favicon.svg",
    navigation:
    {
        skip: "Skip to the story",
        home: "Emberveil home",
        wordmark: "Hollowmoor",
        wordmarkSubline: "G A M E S",
        menu: "Toggle navigation",
        label: "Main navigation",
        items:
        [
            { label: "The story", href: "#story" },
            { label: "The world", href: "#world" },
            { label: "Release", href: "#release" }
        ],
        wishlist: "Wishlist",
        wishlistHref: "#wishlist"
    },
    hero:
    {
        image: "./assets/vale.svg",
        alt: "An original painted landscape: a cloaked traveller carries a lantern into a misty mountain vale, toward a distant ruined tower.",
        eyebrow: "A hand-painted adventure",
        line: "Some lights are worth getting lost for.",
        description: "Carry a little warmth into a world that has forgotten the sun.",
        enter: "Enter the vale",
        enterHref: "#story",
        trailer: "Watch the teaser",
        trailerHref: "#trailer",
        footnote: "A small flame. A forgotten world.",
        scroll: "Scroll to discover",
        scrollHref: "#story",
        genre: "A quiet, single-player adventure",
        credit: "An imagined world by Hollowmoor Games"
    },
    story:
    {
        eyebrow: "Every ending leaves an ember",
        title: "The fires went out.\nYours did not.",
        body: "Long after the last hearth fell silent in the Ashen Vale, one small light remained. Take up its lantern. Follow the old paths. Find what the dark has kept.",
        beats:
        [
            {
                number: "I",
                eyebrow: "Wander where the light leads",
                title: "A world that waits\nto be found.",
                body: "Beneath the ash, the old roads are still there. Cross sleeping forests and weather-worn bridges. Let curiosity, not a compass, carry you home.",
                note: "Explore at your own pace",
                icon: "compass",
                image: "./assets/vale.svg",
                alt: "Lantern light on an ancient mountain path, framed by crooked pines."
            },
            {
                number: "II",
                eyebrow: "Leave a little warmth behind",
                title: "Wake the things\nthe world forgot.",
                body: "A cold altar. A familiar melody. A door with no handle. Lend your flame to the quiet places, and listen for their answer.",
                note: "Unravel gentle environmental mysteries",
                icon: "flame",
                image: "./assets/shrine.svg",
                alt: "An ember burns inside a weathered stone shrine in a dusky forest."
            },
            {
                number: "III",
                eyebrow: "Not every lost thing is alone",
                title: "Find a friend\nin the in-between.",
                body: "There are other wanderers in the vale. Some have stories. Some have fur. Walk beside them for a while; even the longest night is kinder in company.",
                note: "Meet the keepers of the vale",
                icon: "sparkles",
                image: "./assets/companion.svg",
                alt: "A red-cloaked traveller offers lantern light to a small pale forest fox."
            }
        ]
    },
    trailer:
    {
        id: "trailer",
        eyebrow: "A glimpse through the veil",
        title: "Let the quiet draw you in.",
        image: "./assets/vale.svg",
        alt: "The Ashen Vale, painted in dusk and copper, used as an illustrative trailer poster.",
        button: "Trailer placeholder — no video",
        caption: "TRAILER — PLACEHOLDER",
        subline: "A painted placeholder; no video ships with this demo."
    },
    map:
    {
        eyebrow: "A place between remembering and forgetting",
        title: "Welcome to the Ashen Vale.",
        body: "Three places. A thousand untold stories. Touch a light on the map to find your first path.",
        image: "./assets/map.svg",
        alt: "An original painted map of a forested vale with mountains, a river and ancient settlements.",
        label: "Places in the Ashen Vale",
        marker: "Uncharted paths lie beyond",
        north: "N",
        detailLabel: "Selected location",
        locations:
        [
            {
                name: "Briar Hollow",
                tag: "The first light",
                text: "A village held together by roots and remembering. Its empty windows still face the road, waiting for someone to return.",
                detail: "Listen for the wind chimes beneath the broken eaves.",
                x: 29, y: 54
            },
            {
                name: "The Quiet Spire",
                tag: "Above the ash",
                text: "A bell tower without a bell, standing where the forest gives way to sky. From here, the old paths begin to make sense.",
                detail: "Bring a little warmth to the altar at its feet.",
                x: 47, y: 37
            },
            {
                name: "Mothlight Mere",
                tag: "Where the night rests",
                text: "A still lake that remembers every star. Pale wings gather at the water's edge, drawn to a light somewhere below.",
                detail: "Stay a moment. Some paths only appear in stillness.",
                x: 62, y: 67
            }
        ]
    },
    release:
    {
        eyebrow: "Good things grow slowly",
        prefix: "Coming in",
        studioLine: "Made with care by Hollowmoor Games.",
        platforms: "An independent adventure, finding its way.",
        storeCaption: "generic buttons for the demo — no real storefronts",
        stores:
        [
            { label: "Store A", icon: "store", href: "#wishlist" },
            { label: "Store B", icon: "gamepad-2", href: "#wishlist" },
            { label: "Store C", icon: "tag", href: "#wishlist" }
        ]
    },
    wishlist:
    {
        eyebrow: "Keep a little light",
        title: "When the vale wakes,\nbe the first to know.",
        body: "Make a little room for Emberveil.",
        button: "Save to my local wishlist",
        savedButton: "Saved on this device",
        idle: "A local bookmark only — not a store wishlist.",
        saved: "Emberveil is on this device's wishlist. No store or account was contacted.",
        removed: "Removed from this device's wishlist.",
        unavailable: "Saved for this visit only. Browser storage is unavailable.",
        emailLabel: "Your email address",
        placeholder: "Your email, little wanderer",
        submit: "Leave a light on",
        consent: "I understand this is a local demo. My email will not be sent or saved.",
        disclosure: "A client-side form, not a mailing list. Nothing leaves your browser.",
        success: "Your light is lit — in this demo only. Your email was not sent or saved.",
        invalid: "Please enter a valid email address.",
        consentRequired: "Please acknowledge that this form is a local demo.",
        reset: "Try another address"
    },
    footer:
    {
        note: "For the little lights that refuse to go out.",
        fiction: "Emberveil and Hollowmoor Games are fictional. An independent concept, not a released game.",
        credit: "Template by VibeFather",
        creditHref: "https://vibefather.ai/t/indie-game-launch-page",
        license: "Non-commercial adaptation · CC BY-NC 4.0",
        licenseHref: "https://creativecommons.org/licenses/by-nc/4.0/",
        back: "Back to the light",
        backHref: "#home"
    }
};
