export const show =
{
    brand: "Tangent & Tide",
    topic: "the hidden design decisions behind everyday objects",
    audience: "curious designers, engineers, and lifelong learners",
    tagline: "Ordinary things. Extraordinary stories.",
    heroLines: ["Ordinary things.", "Extraordinary stories."],
    intro: "Conversations with the people who notice the details, for curious designers, engineers, and lifelong learners.",
    credit: { label: "Template by VibeFather", url: "https://vibefather.ai/t/podcast-show-website" },
    links: { home: "./index.html", episodes: "./episodes.html", episode: "./episode.html", guests: "./guests.html", subscribe: "./index.html#subscribe", feed: "./feed.xml" },
    icons: "./public/icons.svg",
    audio: "./public/audio/episode-preview.wav",
    image: "./public/images/studio-hero.webp",
    imageAlt: "Two podcast hosts recording across a wooden table in a warm studio."
};

export const hosts =
[
    { name: "Mara Venn", image: "./public/images/host-mara.webp", alt: "A podcast host in a rust jacket beside a studio window.", role: "Host · Service designer", bio: "A service designer who collects overlooked details and asks one more question." },
    { name: "Ivo Sen", image: "./public/images/host-ivo.webp", alt: "A podcast host in an oxblood overshirt against a cream studio wall.", role: "Host · Engineer & radio maker", bio: "An engineer and radio maker interested in how ordinary systems earn our trust." }
];

export const guests =
[
    { id: "lena", name: "Lena Ort", image: "./public/images/guest-lena.webp", alt: "An industrial designer seated in warm directional studio light.", role: "Industrial designer", bio: "Lena studies the small mechanical choices that make objects easier to understand. Her current work focuses on accessible handles, controls, and fastenings.", episodes: [42, 37] },
    { id: "theo", name: "Theo Wren", image: "./public/images/guest-theo.webp", alt: "A public-space researcher in a walnut-brown jacket against a warm neutral background.", role: "Public-space researcher", bio: "Theo documents how streets communicate welcome, caution, and care. His field notes turn overlooked infrastructure into stories about shared life.", episodes: [41, 36] },
    { id: "amara", name: "Amara Pell", image: "./public/images/guest-amara.webp", alt: "A materials scientist in a cream shirt beside a terracotta studio wall.", role: "Materials scientist", bio: "Amara explores how surfaces respond to weather, wear, and touch. She translates lab detail into practical lessons for anyone who makes things.", episodes: [40, 35] },
    { id: "sera", name: "Sera Quince", role: "Behavior researcher", bio: "Sera studies how attention, anticipation, and shared spaces shape the way a wait feels.", episodes: [39] },
    { id: "nico", name: "Nico Vale", role: "Wayfinding researcher", bio: "Nico investigates how shared visual conventions help people make decisions under pressure.", episodes: [38] }
];

export const topics =
[
    { name: "Objects", text: "Small things, serious thinking.", number: 42 },
    { name: "Cities", text: "The choices hiding in public space.", number: 41 },
    { name: "Behavior", text: "Why we respond the way we do.", number: 39 },
    { name: "Materials", text: "Texture, tension, and the physical world.", number: 40 }
];

export const episodes =
[
    {
        number: 42, slug: "why-the-humble-doorknob-turns", title: "Why the Humble Doorknob Turns", minutes: 31, topic: "Objects", guest: "lena",
        summary: "A lever, a latch, and the ergonomics hiding in plain sight.",
        notes:
        [
            "A doorknob seems solved until a closed door meets wet hands, a full bag, or a stiff wrist. Industrial designer Lena Ort joins the hosts to explain why the lever handle is more than a stylistic alternative.",
            "The conversation moves from torque and spindle springs to the difference between a shape that looks intuitive and one that actually communicates its use. Lena brings three anonymous handle studies and explains what a five-second doorway observation can reveal.",
            "The takeaway is not that one fitting wins everywhere. It is that a small everyday object becomes better when designers account for the broadest range of hands, habits, and hurried moments."
        ],
        takeaways: ["Form can instruct without a label.", "Comfort is a mechanical property, not only a feeling.", "Test the doorway, not just the drawing."],
        chapters: [["00:00", "The handle that fooled us"], ["06:18", "From grip to torque"], ["14:42", "A universal design lesson"], ["24:10", "What we notice now"]],
        transcript: ["Mara: We begin at a closed door, carrying more than we can comfortably hold.", "Lena: Think about the force a hand can apply, not only the shape a hand can recognize.", "Ivo: So the spring and the lever are part of the same invitation.", "Lena: Exactly. Watch someone use the doorway before deciding that the handle is finished."]
    },
    {
        number: 41, slug: "the-secret-life-of-street-bollards", title: "The Secret Life of Street Bollards", minutes: 28, topic: "Cities", guest: "theo",
        summary: "How a small post negotiates safety, movement, and public space.",
        notes:
        [
            "A line of posts can protect a pavement while quietly deciding who gets through. Public-space researcher Theo Wren walks us along an imaginary high street, asking where a bollard becomes a barrier rather than a boundary.",
            "Theo describes observing delivery carts, walking sticks, and two people passing side by side. Spacing that looks generous on a plan can feel very different when a street is busy, and a subtle color change may matter more than an elaborate form.",
            "We finish with a way of reading street furniture as a set of negotiated promises. Protection should not make a footpath harder to use for the very people it is meant to protect."
        ],
        takeaways: ["Measure the usable gap, not just the drawing.", "Visibility is part of street safety.", "Observe a boundary at different times of day."],
        chapters: [["00:00", "A post in the pavement"], ["05:20", "Reading the gaps"], ["12:45", "Safety for whom?"], ["21:08", "A street-level checklist"]],
        transcript: ["Mara: A bollard looks like a full stop. Is that the whole story?", "Theo: The useful question is what fits between two of them.", "Ivo: A delivery cart and a walking aid read the same gap differently.", "Theo: Good observation starts by making room for both."]
    },
    {
        number: 40, slug: "a-better-button-for-bad-weather", title: "A Better Button for Bad Weather", minutes: 24, topic: "Materials", guest: "amara",
        summary: "Gloves, rain, and the physical interface we still need.",
        notes:
        [
            "A perfectly polished button can become almost impossible to find in the rain. Materials scientist Amara Pell takes a familiar outdoor control and asks what changes when its user is cold, hurried, and wearing gloves.",
            "We compare textures, travel distance, and the difference between water rolling off a surface and collecting around its edge. Amara explains why a successful laboratory touch test needs a messy counterpart outside.",
            "The best interface in bad weather may be the one that asks for the least attention. We leave with practical questions about grip, feedback, and whether a press feels complete before the user looks down."
        ],
        takeaways: ["Test with wet gloves as well as bare hands.", "Give a press a clear physical finish.", "Design drainage along with the surface."],
        chapters: [["00:00", "Cold hands, small target"], ["04:32", "Texture under water"], ["11:16", "What a press tells us"], ["18:40", "Taking the test outside"]],
        transcript: ["Mara: Our first test today starts with a pair of wet gloves.", "Amara: A smooth surface can stop communicating when conditions change.", "Ivo: The travel of the button still tells my hand something.", "Amara: That feedback should survive the weather."]
    },
    {
        number: 39, slug: "why-elevators-have-mirrors", title: "Why Elevators Have Mirrors", minutes: 32, topic: "Behavior", guest: "sera",
        summary: "Perceived time, awkward silence, and a reflective design trick.",
        notes:
        [
            "The lift has not become faster, but the ride feels shorter. Behavior researcher Sera Quince helps us separate the measurable duration of a journey from the attention we bring into a small shared cabin.",
            "A mirror can redirect a glance, reveal who is behind us, or help someone navigate a tight space. We discuss why no single story explains every reflective wall and why accessibility belongs in the conversation about waiting.",
            "Rather than treating distraction as a universal cure, Sera asks designers to understand what makes a wait uncomfortable. The useful intervention might be information, room to turn, or simply a clearer view."
        ],
        takeaways: ["Perceived time and elapsed time differ.", "A reflective surface can support orientation.", "Ask what makes the wait uncomfortable."],
        chapters: [["00:00", "Thirty seconds in a cabin"], ["07:05", "Where attention goes"], ["15:20", "Seeing the space behind"], ["25:12", "A kinder kind of waiting"]],
        transcript: ["Mara: Why does the same ride sometimes feel longer?", "Sera: Attention is part of the experience, not a reliable stopwatch.", "Ivo: And the mirror does more than offer distraction.", "Sera: Yes. Orientation and room to maneuver matter too."]
    },
    {
        number: 38, slug: "the-color-of-emergency-exits", title: "The Color of Emergency Exits", minutes: 27, topic: "Standards", guest: "nico",
        summary: "How a safety color becomes a shared language.",
        notes:
        [
            "An exit sign must be understood when there is little time to study it. Wayfinding researcher Nico Vale explores the relationship between color, a recognizable symbol, and the places where people expect to find both.",
            "We trace a fictional building route and notice how competing lights and inconsistent placement weaken an otherwise clear sign. Nico distinguishes learning a convention from assuming that a color means the same thing everywhere.",
            "A good route is a sequence, not a single bright rectangle. Our final exercise is to follow the signs from an unfamiliar room and note every point where a decision needs clearer evidence."
        ],
        takeaways: ["Do not ask color to carry meaning alone.", "Keep guidance consistent across a route.", "Test signs from the point of decision."],
        chapters: [["00:00", "One glance to decide"], ["05:38", "A convention takes shape"], ["13:02", "Competing signals"], ["20:55", "Following the whole route"]],
        transcript: ["Mara: Can a single color tell us where to go?", "Nico: It needs a symbol, a location, and a convention people can learn.", "Ivo: A route can still break between two very good signs.", "Nico: Test the decisions between them."]
    },
    {
        number: 37, slug: "the-quiet-engineering-of-paper-clips", title: "The Quiet Engineering of Paper Clips", minutes: 22, topic: "Objects", guest: "lena",
        summary: "Wire, spring, and the beauty of almost no instructions.",
        notes:
        [
            "Lena Ort returns with a handful of bent wire and a stack of paper. We look at the paper clip as a tiny spring that must hold firmly, slide on easily, and leave the page ready to use again.",
            "The discussion moves through bend radius, friction, and the surprisingly informative moment when a clip meets too many sheets. Lena shows how an object can communicate a limit through resistance rather than a printed warning.",
            "Small does not mean simple to improve. We close by considering repair, reuse, and why removing material from a familiar object only helps when its everyday job remains intact."
        ],
        takeaways: ["Treat the clip as a spring, not a shape.", "Resistance can communicate a useful limit.", "Use less material without losing the job."],
        chapters: [["00:00", "A loop of bent wire"], ["04:10", "Spring in a small space"], ["10:35", "One sheet too many"], ["17:18", "Almost no instructions"]],
        transcript: ["Mara: This object arrives without instructions.", "Lena: Its shape introduces the action, and its spring tells you the limit.", "Ivo: Too much paper changes the whole relationship.", "Lena: A good test begins with an ordinary stack."]
    },
    {
        number: 36, slug: "who-owns-the-corner-bench", title: "Who Owns the Corner Bench?", minutes: 35, topic: "Cities", guest: "theo",
        summary: "A small seat reveals big ideas about welcome and belonging.",
        notes:
        [
            "A bench is an invitation, but not everyone receives the same one. Theo Wren joins us to examine an imagined corner seat through the routines of a tired shopper, a neighbor, and someone waiting for a friend.",
            "We talk about shade, back support, armrests, and where a seat faces. Theo explains how field notes can reveal patterns of use without reducing the people on the bench to a set of tidy measurements.",
            "The conversation ends with stewardship. A welcoming public seat needs maintenance and a surrounding space that makes lingering feel permitted, not merely a well-drawn silhouette."
        ],
        takeaways: ["A seat belongs to its surrounding space.", "Include rest in the definition of movement.", "Plan care as carefully as installation."],
        chapters: [["00:00", "An invitation on the corner"], ["08:12", "Who gets to rest?"], ["17:40", "Shade, support, and sightlines"], ["28:05", "Keeping the invitation open"]],
        transcript: ["Mara: Who is a public bench really for?", "Theo: Start by watching who can stop, and who keeps walking.", "Ivo: Shade and a backrest change how long rest feels possible.", "Theo: Welcome lives in those details, and in maintenance."]
    },
    {
        number: 35, slug: "the-sound-of-a-good-switch", title: "The Sound of a Good Switch", minutes: 26, topic: "Materials", guest: "amara",
        summary: "Why a click can make an ordinary object feel precise.",
        notes:
        [
            "A click is a small sound carrying a surprisingly large promise. Amara Pell helps us think about a switch as a combination of movement, material, and feedback rather than a decorative cap over a circuit.",
            "We describe how enclosure stiffness and contact geometry affect the experience without pretending one louder sound means better quality. The right signal depends on the room, the task, and the person using it.",
            "The closing test asks whether the switch still communicates when sound is unavailable. Tactile feedback and visible state should support the click, not leave essential information to a single sense."
        ],
        takeaways: ["Sound is feedback, not proof of quality.", "Test the switch inside its enclosure.", "Communicate state through more than sound."],
        chapters: [["00:00", "A very small promise"], ["05:44", "Materials make the click"], ["12:18", "When louder is not better"], ["20:10", "Feedback without sound"]],
        transcript: ["Mara: Why does this tiny click feel reassuring?", "Amara: Movement and material combine into a signal that the action finished.", "Ivo: We should still be able to read its state in silence.", "Amara: Exactly. The click is one part of the message."]
    }
];

export const copy =
{
    nav: [["Latest", "home"], ["Episodes", "episodes"], ["Guests", "guests"]],
    latest: "The latest conversation",
    preview: "24-second original preview",
    previewNote: "An original instrumental sample, not the full spoken episode.",
    browse: "Browse episodes",
    meet: "Meet the guests",
    threads: "Follow a thread.",
    threadsIntro: "Start with a question and stay for the connections.",
    recent: "New from the studio.",
    voices: "The voices in the room.",
    subscribe: "Keep the thread going.",
    subscribeIntro: "New episodes, occasional notes, nothing else.",
    emailDisclosure: "Demo only: your address is stored in this browser and is not sent anywhere.",
    emailSuccess: "You are on the local list.",
    archiveEyebrow: "The complete archive",
    archiveTitle: "Every episode, every thread.",
    archiveIntro: "Search by idea, guest, or object, then filter by the thread you want to follow.",
    searchLabel: "Search episodes",
    searchPlaceholder: "Try “buttons”, “Lena”, or “cities”",
    filters: ["All", "Objects", "Cities", "Behavior", "Materials", "Standards"],
    empty: "No episodes found. Try another phrase or clear the filters.",
    archiveStripTitle: "Not sure where to start?",
    archiveStripCopy: "Play the latest preview, then follow the thread that catches your attention.",
    notesTitle: "Inside this episode",
    chaptersNote: "Full-episode reading chapters. These highlight the notes; they do not seek the 24-second preview.",
    transcriptTitle: "Read transcript",
    transcriptDisclosure: "Demo transcript · a scripted editorial companion, not a verbatim recording. The bundled audio is instrumental only.",
    relatedTitle: "Keep following the thread.",
    guestsEyebrow: "Guests & hosts",
    guestsTitle: "Good questions need generous guests.",
    guestsIntro: "Designers, researchers, and close observers bring the evidence behind each conversation.",
    hostsTitle: "Your regular hosts",
    hostsNote: "They record around one wooden table, with one rule: follow the interesting detail.",
    guestsStripTitle: "Hear the next conversation.",
    guestsStripCopy: "Follow Tangent & Tide for new episodes and notes from the studio.",
    footerNote: "An independent show for curious designers, engineers, and lifelong learners.",
    demoNote: "An independent-show concept. Fictional people and editorial stories; real original preview audio."
};

export const ui =
{
    menu: "Menu", subscribe: "Subscribe", allEpisodes: "All episodes", notes: "Notes & preview", guest: "In conversation with",
    back: "All episodes", chapters: "Chapters", takeaways: "Three things to take with you", latest: "Latest episode",
    rss: "RSS feed", copy: "Copy show link", copied: "Copied", email: "Email updates", emailLabel: "Email address",
    save: "Join the local list", remove: "Remove", stored: "Saved in this browser only.", storageError: "Browser storage is unavailable. No address has been saved.",
    clear: "Clear filters", results: "episodes", play: "Play preview", pause: "Pause preview", skipBack: "Back 15 seconds",
    skipForward: "Forward 30 seconds", seek: "Seek preview", speed: "Playback speed", mute: "Mute", unmute: "Unmute", volume: "Volume",
    playError: "Playback could not start. Please try the play button again.", chapterSelected: "Reading chapter",
    transcriptHide: "Transcript & text companion", previewBadge: "Listen a little closer", hosts: "Your hosts", recentGuests: "Recent guests",
    episode: "Episode", season: "Small details. Bigger questions.", about: "About the show", privacy: "Local demo · No tracking",
    clipboardFallback: "Copy this show URL:", guestDirectory: "Guest directory", localRemoved: "Your local address has been removed.",
    audioLoadError: "The local preview could not be loaded. Reload this page to try again.",
    begin: "A good place to begin", studio: "In the studio", episodeShort: "EP", minutesShort: "MIN",
    mainNavigation: "Main navigation", footerNavigation: "Footer navigation", topicFilter: "Filter by topic",
    coverAlt: "Original geometric cover for episode", homeLabel: "home", previewLabel: "audio preview",
    episodeNotesLabel: "notes", showUrlLabel: "Show URL", emailPlaceholder: "you@example.com",
    podcastAbout: "A podcast about", of: "of", subscribeTo: "Subscribe to"
};
