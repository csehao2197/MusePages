export const content =
{
    brand: "Asterhollow",
    deck: "The Night Field Deck",
    tagline: "A quiet card for the day ahead.",
    audience: "curious minds who enjoy a nightly reflection ritual",
    focus: "creativity, relationships, and everyday choices",
    title: "One quiet moment.\nA different perspective.",
    disclaimer: "For entertainment and reflection only",
    ui:
    {
        skip: "Skip to the reading",
        modes: "Choose your reading",
        cardBack: "./images/card-back.svg",
        icons: "./icons/",
        pageTitle: "a quiet moment",
        missingScript: "This private reading ritual needs JavaScript. No account or network service is required."
    },
    header:
    {
        deck: "The deck",
        guide: "How it works",
        note: "For entertainment & reflection"
    },
    hero:
    {
        eyebrow: "AN ORIGINAL SIX-CARD DECK",
        ritual: "A LITTLE ROOM FOR POSSIBILITY",
        private: "No sign-up. Your reading stays in this browser.",
        daily: "Daily card",
        three: "Three cards",
        dailyHelp: "One card, held for your local day.",
        threeHelp: "Past, present, and future — a fresh spread whenever you choose.",
        shuffle: "Shuffle the deck",
        shuffling: "Letting the cards settle…",
        revealing: "Turning a new perspective…",
        revealDaily: "Reveal today's card",
        revealThree: "Reveal three cards",
        again: "Shuffle a new spread",
        saved: "Your card is held for today",
        instruction: "Shuffle, then turn your card face-up.",
        ready: "The deck is ready. Take a breath, then reveal.",
        dailyHeading: "Today's quiet perspective",
        threeHeading: "Three ways to look inward",
        tableLabel: "YOUR REFLECTION TABLE",
        tableFooter: "SIX SYMBOLS · ENDLESS PERSPECTIVES",
        tableAside: "Nothing to predict.\nSomething to notice.",
        today: "TODAY'S CARD",
        complete: "Your reading is ready.",
        upright: "Upright",
        reversed: "Reversed",
        question: "A question to carry",
        positions: ["Past", "Present", "Future"]
    },
    guide:
    {
        eyebrow: "THE RITUAL",
        title: "A small pause,\nin three turns.",
        note: "Not answers from elsewhere.\nA little space to hear yourself.",
        steps:
        [
            ["Shuffle", "Let the cards gather, separate, and settle. There is nothing to get right."],
            ["Turn", "Choose one card for today or three cards for a wider view. Reversed cards offer another angle, not a warning."],
            ["Reflect", "Keep the sentence or question that feels useful. Let the rest go."]
        ],
        positions:
        [
            ["Past", "what you carry in"],
            ["Present", "what asks for attention"],
            ["Future", "what you might practice next"]
        ]
    },
    gallery:
    {
        eyebrow: "MEET THE ORIGINAL DECK",
        title: "Six symbols.\nAnother way in.",
        hint: "Turn any card to explore its meaning.",
        open: "Explore",
        close: "Close card meaning"
    },
    journal:
    {
        eyebrow: "A NOTE TO YOURSELF",
        title: "What would you like to carry?",
        note: "A private journal for this local day. Saved only in this browser; never sent anywhere.",
        label: "Your reflection",
        placeholder: "A sentence, a small intention, or simply what you noticed…",
        save: "Save reflection",
        clear: "Clear note",
        saved: "Saved in this browser.",
        cleared: "Your note has been cleared.",
        unavailable: "Browser storage is unavailable. You can still reflect here, but this note will not persist.",
        unsaved: "Your changes are not saved yet."
    },
    studio:
    {
        eyebrow: "A SMALL KEEPSAKE",
        title: "Keep the thought,\nnot the fortune.",
        text: "Turn your revealed reading into a private image. It is drawn on your device and never uploaded.",
        download: "Download reading card",
        before: "Reveal a card to create your image.",
        ready: "Image ready · 1080 × 1350 PNG",
        preparing: "Preparing your private image…",
        failed: "The image could not be prepared. Your reading is still available above.",
        preview: "A live preview of your private reading image",
        awaiting: "A thought worth keeping.",
        awaitingNote: "Your reading will find its place here.",
        privacy: "Made here. Kept by you."
    },
    faq:
    {
        eyebrow: "A FEW GROUNDING THOUGHTS",
        title: "Before you turn a card.",
        entries:
        [
            ["Does this predict my future?", "No. The cards are original visual prompts for entertainment and reflection. They do not predict events and are not medical, mental-health, legal, or financial advice."],
            ["Where is my daily reading stored?", "Only in this browser's local storage, keyed to your local day. There is no account and nothing is sent to a server. Clearing site data removes it."],
            ["Can I draw more than once?", "Your daily card stays the same for the local day. The three-card spread can be shuffled again whenever you want another set of prompts."],
            ["What does reversed mean here?", "It simply opens another interpretation of the symbol. It is not a bad omen, a warning, or a result to worry about."]
        ],
        closing: "Take what resonates and leave the rest."
    },
    footer:
    {
        text: "An original digital deck for a quieter moment.",
        credit: "Template by VibeFather",
        link: "https://vibefather.ai/t/daily-tarot-reading-page"
    },
    cards:
    [
        {
            id: "ember",
            name: "The Ember",
            art: "./images/cards/ember.webp",
            alt: "A geometric glass lantern glowing above a winding midnight path.",
            upright: "Protect the small beginning. Give one idea your attention before asking it to become more.",
            reversed: "Your energy may be scattered. Lower the stakes and return to one warm, manageable task.",
            expansion: "In this symbol, a modest light can be enough; the whole path need not be visible.",
            prompt: "What deserves a little more of my care today?"
        },
        {
            id: "current",
            name: "The Current",
            art: "./images/cards/current.webp",
            alt: "Two luminous streams weaving among smooth stepping stones.",
            upright: "Let circumstances move without gripping every outcome. A flexible next step will carry farther than a rigid plan.",
            reversed: "Notice where resistance has become habit. Change one condition rather than pushing harder.",
            expansion: "These painted streams offer a metaphor for flexibility, not a forecast of what will happen.",
            prompt: "Where can I allow an easier route?"
        },
        {
            id: "threshold",
            name: "The Threshold",
            art: "./images/cards/threshold.webp",
            alt: "An open stone archway with a small brass key and dawn beyond.",
            upright: "A useful transition is near, but it asks for a deliberate choice. Name what you are ready to leave and what comes with you.",
            reversed: "Pause before forcing closure. An unanswered question may need information, not urgency.",
            expansion: "The arch is an imagined space to consider possibility; it does not announce an event.",
            prompt: "What am I truly ready to step toward?"
        },
        {
            id: "garden",
            name: "The Garden",
            art: "./images/cards/garden.webp",
            alt: "Night-blooming flowers circling a small stone sundial.",
            upright: "Small routines are shaping more than you can see. Tend the environment around your goal, not only the goal itself.",
            reversed: "Something needs pruning. Remove one obligation or distraction before adding another.",
            expansion: "Think of the garden as a creative metaphor: room, repetition, and patience all have a place.",
            prompt: "What would help my better habits take root?"
        },
        {
            id: "mirror",
            name: "The Mirror",
            art: "./images/cards/mirror.webp",
            alt: "An oval hand mirror reflecting an abstract sunrise, with no person present.",
            upright: "Look at the story you are telling about yourself. Keep what is honest and soften what is merely familiar.",
            reversed: "Avoid using self-reflection as self-judgment. Ask for a kinder, more complete interpretation.",
            expansion: "There is no verdict in this glass, only an invitation to describe your experience with curiosity.",
            prompt: "Which assumption about myself can I revisit?"
        },
        {
            id: "orbit",
            name: "The Orbit",
            art: "./images/cards/orbit.webp",
            alt: "A small brass orrery tracing luminous rings beneath a starry sky.",
            upright: "Return to the people and practices that restore perspective. You do not have to solve everything from the center of the problem.",
            reversed: "You may be circling the same thought. Change your setting or seek another viewpoint.",
            expansion: "The little orrery is a symbol of perspective, a way to imagine more space around a thought.",
            prompt: "What helps me see the wider pattern?"
        }
    ]
};

content.slug = content.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
content.intro = `A reflective ritual for ${content.audience}, exploring ${content.focus}. ${content.hero.private}`;
content.deckIntro = `${content.deck} is a compact original deck created for ${content.focus}.`;
