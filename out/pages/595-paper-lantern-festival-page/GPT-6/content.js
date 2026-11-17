export const content =
{
    brand: "Lumaire",
    festival: "The Quiet Current",
    river: "River Aster",
    headline: "A small wish. A little more light.",
    audience: "friends, makers, and late-night daydreamers",
    themes: "kindness, belonging, and fresh possibilities",
    storageKey: "lumaire-lantern-wishes-v1",
    title: "Lumaire — The Quiet Current",
    welcome: "An imagined gathering for friends, makers, and late-night daydreamers. Write a private wish, fold it into light, and let it drift above River Aster.",
    themeLine: "Twelve imagined wishes for kindness, belonging, and fresh possibilities. Yours stays only in this browser.",
    prompts:
    [
        { label: "A kinder tomorrow", text: "May I leave a little kindness wherever tomorrow takes me." },
        { label: "A place to belong", text: "May I find a place where I can be completely myself." },
        { label: "Something new", text: "May I make room for a possibility I have not yet imagined." }
    ],
    ambient:
    [
        { id: "ambient-wish-1", text: "May a small kindness reach someone who needs it." },
        { id: "ambient-wish-2", text: "For a table with room for one more friend." },
        { id: "ambient-wish-3", text: "May I try the idea I keep setting aside." },
        { id: "ambient-wish-4", text: "For the patience to listen all the way through." },
        { id: "ambient-wish-5", text: "May a new place begin to feel like home." },
        { id: "ambient-wish-6", text: "For a door left open to a different tomorrow." },
        { id: "ambient-wish-7", text: "May I be as gentle with myself as with a friend." },
        { id: "ambient-wish-8", text: "For an ordinary evening spent together." },
        { id: "ambient-wish-9", text: "May something unexpected give me a reason to begin." },
        { id: "ambient-wish-10", text: "For the courage to welcome someone new." },
        { id: "ambient-wish-11", text: "May there be space for every quiet voice." },
        { id: "ambient-wish-12", text: "For a small beginning that feels like my own." }
    ],
    nav: { festival: "Festival", gallery: "Your lanterns", how: "How it works" },
    scene:
    {
        pill: "AN IMAGINED FESTIVAL · LOCAL ONLY",
        mobilePill: "IMAGINED · LOCAL ONLY",
        wind: "Wind",
        winds: ["Still", "Gentle", "Brisk"],
        pause: "Pause motion",
        resume: "Resume motion",
        reset: "Reset scene",
        caption: "Procedural paper, water, wind & light",
        summary: (wind, count) => `The Quiet Current above fictional River Aster: stars, paper lanterns, and a quiet dock. Wind: ${wind}. ${count} released personal lanterns. Use the labeled wind controls and wish composer below.`,
        resetFeedback: "Scene reset to a gentle wind. Your draft and saved wishes are unchanged."
    },
    composer:
    {
        eyebrow: "A MOMENT, JUST FOR YOU",
        title: "Make a little light",
        privacy: "Your wish is stored only in this browser.",
        steps: ["Write", "Fold", "Release"],
        label: "Your wish",
        placeholder: "What would you like to send into the night?",
        helper: "3–120 characters · nothing is uploaded",
        promptLabel: "A place to begin",
        fold: "Fold my lantern",
        back: "Back to wish",
        release: "Release lantern",
        folded: "Six paper panels, one small possibility. Your lantern is ready.",
        releasing: "Folding the light into the sky…",
        success: "Your wish is drifting.",
        saved: "Saved in your personal gallery, right here.",
        another: "Write another",
        view: "View my lanterns",
        full: "Your gallery holds 24 wishes. Remove one before releasing another.",
        foldFeedback: "Your paper lantern is folded. Review your wish, then release it.",
        releaseFeedback: "Your wish is drifting. Saved in your personal gallery.",
        draftFeedback: "Back to your wish. Your words are unchanged.",
        nextFeedback: "A fresh page is ready for another wish.",
        suggestionFeedback: "A starting thought is ready. Make it your own.",
        storageError: "This browser could not save your gallery; this session still works."
    },
    gallery:
    {
        eyebrow: "YOUR LANTERNS",
        title: "Wishes you have set afloat.",
        privacy: "Saved on this device, not online. Clearing browser storage will remove them.",
        empty: "No wishes released yet.",
        emptyBody: "Every little light begins with a few words.",
        write: "Write a wish",
        lantern: "LANTERN",
        again: "Release again",
        remove: "Remove",
        confirm: "Remove this wish?",
        keep: "Keep it",
        removed: "Wish removed from your gallery and the scene.",
        relaunched: "This wish is drifting again.",
        count: (count) => `${count} saved ${count === 1 ? "wish" : "wishes"}`
    },
    notes:
    {
        eyebrow: "NOT A CEREMONY. A QUIET MOMENT.",
        title: "A wish, in three small movements",
        privacyTitle: "Private by design",
        privacy: "The other wishes are invented for this imagined festival. Your words never leave this browser, and no one can see them here unless you show them.",
        steps:
        [
            { title: "Write", text: "Choose a thought or begin with your own words. No account, no audience. Just a little room to think." },
            { title: "Fold", text: "Watch six paper panels close around the light. You can go back and change your words before release." },
            { title: "Release", text: "Send your digital lantern above River Aster. Change the wind, then find your words waiting in your gallery." }
        ],
        digital: "An entirely digital gathering. No real lanterns, fire, or outdoor releases."
    },
    footer:
    {
        sentence: "An imagined gathering shaped by kindness, belonging, and fresh possibilities.",
        privacy: "No public feed · no account · no uploaded wishes",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/paper-lantern-festival-page"
    }
};
