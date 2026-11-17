export const content =
{
    course: "Tiny Games Workshop",
    topic: "making tiny 2D games from scratch",
    instructor: "Theo Marsh",
    courseSlug: "tiny-games-workshop",
    plans:
    {
        full:
        {
            amount: 149,
            total: 149,
            installments: 1,
            label: "ONE PAYMENT. LIFETIME ACCESS.",
            detail: "One payment of $149. Nothing more.",
            cta: "Enroll — $149",
            summary: "Pay in full · $149 USD total"
        },
        three:
        {
            amount: 55,
            total: 165,
            installments: 3,
            label: "THREE PAYMENTS. SAME LITTLE WORKSHOP.",
            detail: "3 monthly payments of $55. $165 total — $16 more than paying in full.",
            cta: "Enroll — $55 × 3",
            summary: "3 monthly payments of $55 USD · $165 USD total"
        }
    },
    modules:
    [
        {
            title: "Start with a very small idea",
            duration: 35,
            description: "Get comfortable with the workbench. Pick one thing your game will do well, and give your imagination some friendly boundaries.",
            lessons: [["Meet the tiny-game mindset", 7], ["Your browser-based workbench", 10], ["A one-page game plan", 8], ["Make your first scene", 10]],
            outcome: "You’ll have a working scene and a clear finish line."
        },
        {
            title: "Give your character a little life",
            duration: 45,
            description: "Turn key presses into movement. Learn coordinates, input, and game loops through a character that finally goes where you ask.",
            lessons: [["Meet x and y", 10], ["Read the player's input", 12], ["Movement and the game loop", 13], ["Keep your character on screen", 10]],
            outcome: "You’ll move a character with keyboard and touch controls."
        },
        {
            title: "Build a world worth exploring",
            duration: 40,
            description: "Create a tiny place with a personality. Place tiles, add boundaries, and make your first screen feel like somewhere.",
            lessons: [["A palette with a purpose", 8], ["Draw your first pixel tiles", 12], ["Place a path and a few obstacles", 12], ["Make the scene feel alive", 8]],
            outcome: "You’ll build one readable, explorable little level."
        },
        {
            title: "Make it a game, not just a walk",
            duration: 55,
            description: "Add a reason to play. Connect collision, collecting, scoring, and a win state into one complete, 60-second loop.",
            lessons: [["Give the player a goal", 10], ["When two things meet", 15], ["Collect, count, and respond", 15], ["A beginning and an ending", 15]],
            outcome: "You’ll ship a complete collect-and-win game loop."
        },
        {
            title: "Add the good little details",
            duration: 45,
            description: "Make success feel like success. Add gentle feedback, readable instructions, and an easy way to start again.",
            lessons: [["Small animations, big clarity", 12], ["A sprinkle of sound", 10], ["Menus that don't get in the way", 13], ["Try it with fresh eyes", 10]],
            outcome: "You’ll polish your game and fix the confusing bits."
        },
        {
            title: "Finish, share, and take a bow",
            duration: 40,
            description: "Test on a phone, package your tiny creation, and send it to a friend. Finishing is a skill. Let’s practice it.",
            lessons: [["Keyboard and mobile checks", 12], ["A practical bug-fixing checklist", 10], ["Export a game you can share", 10], ["Your next tiny idea", 8]],
            outcome: "You’ll have a finished browser game and a plan for the next one."
        }
    ],
    results:
    [
        {
            label: "A TINY EXPLORATION GAME",
            title: "Pocket Forest",
            image: "./images/pocket-forest.svg",
            alt: "Pixel-art forest and small adventurer created for this fictional course.",
            description: "A curious character, a winding path, five things to find. Theo’s illustrative starter project: an entire adventure in one screen.",
            skill: "Practice: movement · collecting · a win state"
        },
        {
            label: "A ONE-MINUTE ARCADE GAME",
            title: "Duck Delivery",
            image: "./images/duck-delivery.svg",
            alt: "Original pixel-art duck carrying a parcel through a miniature warm-colored town.",
            description: "Deliver three parcels before the clock runs out. A cheerful example of how making tiny 2D games from scratch can start with one simple rule.",
            skill: "Practice: collision · timers · a restart loop"
        },
        {
            label: "A LITTLE PUZZLE WITH A PAYOFF",
            title: "Moonlight Switch",
            image: "./images/moonlight-switch.svg",
            alt: "Original pixel-art nighttime puzzle scene with a moon, switches, and a lit cabin.",
            description: "Three switches, one sleepy village. An illustrative next-step project that makes the same beginner skills feel completely different.",
            skill: "Practice: state · simple logic · visual feedback"
        }
    ],
    inclusions:
    [
        "6 modules and 24 bite-sized video lesson concepts",
        "4 hours 20 minutes of planned, practical instruction",
        "Starter files and a tiny-game project checklist",
        "Keyboard and mobile control walkthroughs",
        "Lifetime access to the fictional course materials",
        "A 30-day illustrative happiness guarantee"
    ],
    faqs:
    [
        ["Do I need to know how to code?", "Not at all. Making tiny 2D games from scratch starts here with coordinates and a few simple instructions. Every concept comes with a small thing to try. You don't need prior coding or game-making experience."],
        ["What will I actually make?", "One complete, 60-second browser game: a character that moves, a small world, a collecting challenge, a win screen, and a restart button. Pocket Forest is an illustrative example of the scope. Your colors, character, and story can be your own."],
        ["What software or computer do I need?", "The proposed lessons use JavaScript and a browser-based workbench on a laptop or desktop with a current browser. No paid software is planned. The game you make is intended to run in a browser on desktop and mobile; a phone alone isn't the recommended lesson workspace."],
        ["How much time should I set aside?", "The planned lessons total 4 hours 20 minutes. Leave another 4–8 hours for experimenting and building. Try two focused sessions a week. This is self-paced, not a race against someone else's calendar."],
        ["Is this about making huge games?", "No. Making tiny 2D games from scratch means learning the essentials in one small, finished project. There are no multiplayer servers, 3D worlds, or advanced engines in this workshop. Smaller scope is how we get to the good part: finishing."],
        ["How do the payment plans work?", "The full-pay plan is $149 USD. The three-pay plan is exactly 3 monthly payments of $55 USD, or $165 total. That's $16 more overall. Both illustrate the same access. This demonstration does not process payments, create subscriptions, or enroll real students."],
        ["What does the 30-day guarantee cover?", "For a real version of this fictional course, the proposed guarantee would offer a full refund requested within 30 days of purchase. This page is a non-commercial demo with no payments, actual guarantee contract, or refund process. No purchase takes place here."],
        ["Can I try something before deciding?", "Yes—try Star Gatherer above. Use arrow keys, WASD, or the on-screen controls to collect five stars. It is an original illustrative browser sample, not footage of a course lesson or a verified student result. The introduction modal explains honestly that no video is available."]
    ],
    game:
    {
        ready: "A little adventure is waiting. Press Start.",
        active: "Collect all 5 stars. Arrow keys, WASD, or the buttons below.",
        won: "You did it! Five stars, one finished tiny game. Make another little lap?",
        start: "Start a tiny adventure",
        restart: "Play again",
        score: (count) => `${count} / 5 stars`
    }
};
