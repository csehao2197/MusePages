(function ()
{
    "use strict";

    var DIMENSIONS =
    [
        {
            name: "Curiosity", construct: "Openness to experience", reference: 0,
            low: { letter: "A", name: "Anchor", description: "You revisit a trusted place to discover its quieter layers." },
            high: { letter: "V", name: "Venture", description: "You try an unfamiliar route to give new possibilities a chance." },
            insight: "Familiarity versus novelty is inspired by openness research; neither end is better."
        },
        {
            name: "Rhythm", construct: "Conscientiousness: planning", reference: 1,
            low: { letter: "S", name: "Structure", description: "You sketch a plan so your attention is free when the moment arrives." },
            high: { letter: "F", name: "Flow", description: "You leave room in the day so a good surprise has somewhere to land." },
            insight: "Planning versus flexibility borrows from conscientiousness research, not a measure of diligence or worth."
        },
        {
            name: "Energy", construct: "Extraversion: social engagement", reference: 0,
            low: { letter: "I", name: "Inward", description: "You seek a little solitude to hear your own response to an experience." },
            high: { letter: "T", name: "Together", description: "You invite company because another viewpoint adds life to the experience." },
            insight: "Solo versus shared activity is loosely inspired by extraversion; it does not measure social skill."
        },
        {
            name: "Perspective", construct: "Analytic and holistic attention", reference: 2,
            low: { letter: "D", name: "Detail", description: "You notice the small, specific things that make a place feel real." },
            high: { letter: "B", name: "Big picture", description: "You connect the atmosphere and the wider story before zooming in." },
            insight: "Focal versus contextual attention draws on attention research. No cultural or ability inference is made."
        }
    ];
    var REFERENCES =
    [
        "Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. Psychological Assessment, 4(1), 26–42. doi:10.1037/1040-3590.4.1.26",
        "John, O. P., & Srivastava, S. (1999). The Big Five trait taxonomy: History, measurement, and theoretical perspectives. In L. A. Pervin & O. P. John (Eds.), Handbook of Personality: Theory and Research (2nd ed., pp. 102–138). Guilford Press.",
        "Nisbett, R. E., Peng, K., Choi, I., & Norenzayan, A. (2001). Culture and systems of thought: Holistic versus analytic cognition. Psychological Review, 108(2), 291–310. doi:10.1037/0033-295X.108.2.291"
    ];
    var QUESTION_BANK =
    [
        { dimension: 0, weight: 1, intro: "You have a free Saturday.", question: "Where do you begin?", options: ["A favorite corner", "A familiar area, new stop", "A new neighborhood", "Somewhere unplanned"] },
        { dimension: 1, weight: 1, intro: "A day trip is on the horizon.", question: "What do you prepare?", options: ["A route and reservations", "A few useful checkpoints", "One place to start", "Just the essentials"] },
        { dimension: 2, weight: 1, intro: "An exhibition catches your eye.", question: "Who comes with you?", options: ["I take a solo afternoon", "One quiet companion", "A few curious friends", "I bring the whole group"] },
        { dimension: 3, weight: 1, intro: "You step into a little café.", question: "What draws your eye?", options: ["The handmade cup", "A note on the menu", "The people and setting", "The feeling of the place"] },
        { dimension: 0, weight: 2, intro: "Your regular lunch spot is closed.", question: "What sounds good?", options: ["My reliable second choice", "A new dish nearby", "That place I have not tried", "The least familiar menu"] },
        { dimension: 1, weight: 2, intro: "Rain changes your afternoon plans.", question: "What happens next?", options: ["I use my backup plan", "I adjust the schedule", "I follow a new idea", "I see where the day goes"] },
        { dimension: 2, weight: 2, intro: "A busy week has finally ended.", question: "How do you reset?", options: ["Time entirely to myself", "A quiet one-to-one catch-up", "Dinner with close friends", "A lively shared evening"] },
        { dimension: 3, weight: 2, intro: "You tell someone about a film.", question: "What do you mention?", options: ["A very particular scene", "A character's small gesture", "The story's connections", "The world it made me see"] },
        { dimension: 0, weight: 1, intro: "You find an unexpected spare hour.", question: "Where does it lead?", options: ["A well-loved ritual", "A small twist on a ritual", "Something on my try list", "An entirely new experiment"] },
        { dimension: 1, weight: 1, intro: "Friends suggest a weekend away.", question: "What is your approach?", options: ["Book the important details", "Agree on a loose itinerary", "Choose on the day", "Leave the route open"] },
        { dimension: 2, weight: 1, intro: "You discover a beautiful viewpoint.", question: "How do you enjoy it?", options: ["Keep a private moment", "Share it with one person", "Invite a couple of friends", "Make it a group outing"] },
        { dimension: 3, weight: 1, intro: "You remember a place you loved.", question: "What stays with you?", options: ["A texture or tiny object", "One vivid, close-up moment", "How everything connected", "Its whole atmosphere"] }
    ];
    var PROFILE_SEEDS =
    [
        ["Compass & Cloud", "🧭", "You mark the route before wandering, because a little certainty makes room for wonder."],
        ["Lantern & Horizon", "🏮", "You revisit the same view to see a bigger story, because depth can be its own adventure."],
        ["Teacup & Tide", "🍵", "You gather people around familiar rituals, because the small details make belonging tangible."],
        ["Hearth & Comet", "☄️", "You give a shared day a shape, because a good plan lets everyone look up."],
        ["Pebble & Sail", "🪨", "You drift through familiar streets alone, because freedom does not always need a new destination."],
        ["Acorn & Ocean", "🌰", "You leave your day open in a well-loved place, because the world feels larger when you slow down."],
        ["Nest & Kite", "🪁", "You invite a friend into an ordinary moment, because a tiny surprise is better when it is noticed together."],
        ["Garden & Meteor", "🪴", "You let familiar company change the plan, because the shared story matters more than the schedule."],
        ["Map & Moth", "🗺️", "You research a new place and explore it alone, because preparation helps you notice what others pass by."],
        ["Anchor & Aurora", "⚓", "You build a route into the unfamiliar, because a steady starting point makes the horizon feel reachable."],
        ["Pocketwatch & River", "⌚", "You plan a new outing around little discoveries, because the best memories have both company and texture."],
        ["Telescope & Root", "🔭", "You organize the next shared adventure, because new possibilities feel richer when everyone can come along."],
        ["Needle & Dune", "🪡", "You take a new turn and stop for a small detail, because curiosity does not need an audience or a timetable."],
        ["Shell & Thunder", "🐚", "You follow an unfamiliar feeling on your own, because space and surprise help you see the whole scene."],
        ["Feather & Flint", "🪶", "You bring friends down the side street, because an unplanned detail can become a shared memory."],
        ["Lighthouse & Sparrow", "🐦", "You turn a chance invitation into an adventure, because new perspectives come alive in conversation."]
    ];

    function tierFor(value)
    {
        return value >= 50 ? 1 : 0;
    }

    var PROFILES = [];
    PROFILE_SEEDS.forEach(function (seed, index)
    {
        var tiers = [Math.floor(index / 8), Math.floor(index / 4) % 2, Math.floor(index / 2) % 2, index % 2];
        var code = tiers.map(function (tier, d)
        {
            return (tier ? DIMENSIONS[d].high : DIMENSIONS[d].low).letter;
        }).join("");
        var first = DIMENSIONS[0][tiers[0] ? "high" : "low"].description + " " + DIMENSIONS[1][tiers[1] ? "high" : "low"].description;
        var second = DIMENSIONS[2][tiers[2] ? "high" : "low"].description + " " + DIMENSIONS[3][tiers[3] ? "high" : "low"].description;
        var experiment = tiers[1] ? "For your next outing, choose one small anchor: a meeting time, a place, or a pause." : "For your next outing, leave one small part of the plan blank and see what fills it.";
        PROFILES.push({ code: code, name: seed[0], emoji: seed[1], quote: seed[2], tiers: tiers, paragraphs: [first, second, experiment + " This is an invitation to experiment, not a rule about who you are."] });
    });

    function calculateResult(answers)
    {
        if (!Array.isArray(answers) || answers.length !== QUESTION_BANK.length)
        {
            throw new Error("Please answer all twelve questions.");
        }
        var raw = [0, 0, 0, 0];
        var maximum = [0, 0, 0, 0];
        var values = [0, 1, 3, 4];
        answers.forEach(function (answer, index)
        {
            if (typeof answer !== "number" || answer % 1 !== 0 || answer < 0 || answer > 3)
            {
                throw new Error("An answer is missing or invalid.");
            }
            var question = QUESTION_BANK[index];
            raw[question.dimension] += values[answer] * question.weight;
            maximum[question.dimension] += 4 * question.weight;
        });
        var scores = raw.map(function (value, index)
        {
            return Math.round(value / maximum[index] * 100);
        });
        var tiers = scores.map(tierFor);
        var profileIndex = tiers[0] * 8 + tiers[1] * 4 + tiers[2] * 2 + tiers[3];
        return { scores: scores, raw: raw, maximum: maximum, profile: PROFILES[profileIndex], index: Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / 4) };
    }

    function findPartners(profile)
    {
        return PROFILES.filter(function (candidate) { return candidate.code !== profile.code; }).map(function (candidate)
        {
            var differences = [];
            var points = candidate.tiers.reduce(function (total, tier, d)
            {
                if (tier !== profile.tiers[d])
                {
                    differences.push(DIMENSIONS[d].name.toLowerCase());
                    return total + [4, 3, 2, 1][d];
                }
                return total;
            }, 0);
            return { profile: candidate, points: points, reason: "A different take on " + differences.join(", ") + "." };
        }).sort(function (a, b)
        {
            return b.points - a.points || a.profile.code.localeCompare(b.profile.code);
        }).slice(0, 3);
    }

    function shuffledOptions(question)
    {
        var items = question.options.map(function (text, value) { return { text: text, value: value }; });
        for (var index = items.length - 1; index > 0; index--)
        {
            var other = Math.floor(Math.random() * (index + 1));
            var saved = items[index];
            items[index] = items[other];
            items[other] = saved;
        }
        return items;
    }

    window.OffscriptData =
    {
        dimensions: DIMENSIONS,
        references: REFERENCES,
        questions: QUESTION_BANK,
        profiles: PROFILES,
        calculateResult: calculateResult,
        findPartners: findPartners,
        shuffledOptions: shuffledOptions
    };
}());
