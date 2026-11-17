export const content =
{
    brand: "Lantern Guides",
    topic: "How a language model picks the next word",
    nav: ["The explainer", "Field notes"],
    themeLabel: "Switch color theme",
    mainNavigation: "Main navigation",
    figure: "FIG. 01",
    figureTitle: "THE NEXT WORD",
    inputLabel: "INPUT →",
    tokenCountLabel: "14 TOKENS",
    seed: 42,
    seedLabel: "Seed",
    kicker: "A FIELD GUIDE TO EVERYDAY AI",
    headline: ["One word.", "A world of", "possibilities."],
    intro: "How does a language model turn a few words into a whole sentence? Follow one small thought on its surprisingly interesting journey.",
    meta: "8 small steps · 6 minute read · No math required",
    start: "Follow the sentence",
    heroLabel: "A SENTENCE, STILL BECOMING",
    sentence: "After a rainy walk, the sleepy dog curled up by the",
    heroEnding: "fire",
    heroCandidates: [{ word: "window", probability: "12%", style: "small" }, { word: "fire", probability: "32%", style: "winner" }, { word: "heater", probability: "22%", style: "medium" }],
    heroAside: "Not a finished thought. A field of possibilities.",
    heroFoot: "An illustrated explanation. Not a running language model.",
    path: ["Split", "Embed", "Attend", "Predict", "Sample"],
    sectionKicker: "FROM WORDS TO POSSIBILITIES",
    sectionTitle: "Let’s look under the sentence.",
    sectionIntro: "The same unfinished thought travels through every step. Scroll at your own pace, or choose a step in the diagram.",
    disclaimer: "A small, honest model of the idea",
    disclaimerBody: "Every token ID, coordinate, attention weight and starting probability here is invented. The diagram and sampler use fixed teaching data, not a trained language model. No text leaves your browser.",
    stage: "THE SENTENCE LAB",
    stageNote: "Illustrative data · not real inference",
    steps:
    [
        { title: "Start with a little context.", label: "The input", body: "A language model starts with the text it has so far. Our sentence hints at weather, an animal and somewhere comfortable.", analogy: "Think of a story with its last page missing.", detail: "The model predicts a token, not necessarily a whole word." },
        { title: "Break the text into tokens.", label: "Split", body: "A token is a piece of text. It can be a whole word, a word fragment or punctuation. Even spaces can be part of tokens.", analogy: "Like cutting a sentence into reusable puzzle pieces.", detail: "Our 14 pieces are invented. “rain + y” and “sleep + y” demonstrate fragments; real tokenizers may split differently." },
        { title: "Give each piece an address.", label: "Token IDs", body: "Each token maps to an ID in a vocabulary. The number is a lookup key, not a score for how important the token is.", analogy: "Like the call number on a library book.", detail: "The IDs below are made up, not from a real vocabulary." },
        { title: "Put meaning on the map.", label: "Embed", body: "An embedding is a list of learned numbers representing a token. Similar uses can give tokens similar representations.", analogy: "Like a map where related ideas live nearby.", detail: "This 2D map is a cartoon. Real embeddings have many dimensions; position and context matter too." },
        { title: "Let the pieces look back.", label: "Attend", body: "Attention mixes information from earlier positions and the current position. Select a token to see one invented row of weights.", analogy: "Like highlighting the clues that help you read a sentence.", detail: "Thicker lines mean larger toy weights, not explanations of a real model’s reasoning. A real transformer has many heads and layers." },
        { title: "Make a shortlist.", label: "Predict", body: "The final representation becomes scores for the vocabulary. A softmax turns those scores into probabilities for the next token.", analogy: "Like a weather forecast: likely does not mean certain.", detail: "These eight candidates form our entire toy vocabulary. Real models score a much larger one; these are not measured predictions." },
        { title: "Turn the temperature.", label: "Temperature", body: "A lower temperature concentrates probability on the favorites. A higher one spreads it out. Move the slider to change the distribution.", analogy: "Like choosing between a familiar path and a wider wander.", detail: "We compute softmax(log(p) / T). Temperature changes the draw, not the knowledge or truth of an answer." },
        { title: "Draw a word. Then repeat.", label: "Sample", body: "Sampling draws one token from the distribution. Roll again to draw from the same possibilities. A real model would append the result and do another forward pass.", analogy: "Like a weighted raffle, not a search for a stored sentence.", detail: "Here we stop after one word. The seeded dice are reproducible, not fresh model inference." }
    ],
    tokens:
    [
        { text: "After", id: 481, category: "structure", mapX: 100, mapY: 72 },
        { text: "a", id: 17, category: "structure", mapX: 155, mapY: 112 },
        { text: "rain", id: 2901, category: "weather", mapX: 355, mapY: 72 },
        { text: "y", id: 84, category: "structure", mapX: 205, mapY: 65 },
        { text: "walk", id: 756, category: "action", mapX: 295, mapY: 178 },
        { text: ",", id: 12, category: "structure", mapX: 115, mapY: 157 },
        { text: "the", id: 25, category: "structure", mapX: 170, mapY: 204 },
        { text: "sleep", id: 3402, category: "comfort", mapX: 392, mapY: 234 },
        { text: "y", id: 84, category: "structure", mapX: 220, mapY: 145 },
        { text: "dog", id: 1688, category: "animal", mapX: 306, mapY: 285 },
        { text: "curled", id: 5032, category: "comfort", mapX: 437, mapY: 177 },
        { text: "up", id: 94, category: "action", mapX: 265, mapY: 232 },
        { text: "by", id: 67, category: "structure", mapX: 66, mapY: 225 },
        { text: "the", id: 25, category: "structure", mapX: 150, mapY: 284 }
    ],
    ghostWords: [{ text: "storm", x: 418, y: 44 }, { text: "cat", x: 359, y: 319 }, { text: "rest", x: 473, y: 271 }],
    regions: [{ text: "WEATHER", x: 340, y: 20 }, { text: "STRUCTURE", x: 65, y: 331 }, { text: "REST & COMFORT", x: 350, y: 355 }],
    attentionRows: Array.from({ length: 14 }, (_, row) => Array.from({ length: row + 1 }, (_, column) => column === row ? 2 : column === 9 || column === 10 ? 7 : column === 2 ? 4 : 1)),
    candidates:
    [
        { word: "fire", probability: 0.32 },
        { word: "heater", probability: 0.22 },
        { word: "door", probability: 0.15 },
        { word: "window", probability: 0.12 },
        { word: "sofa", probability: 0.08 },
        { word: "fireplace", probability: 0.06 },
        { word: "stove", probability: 0.03 },
        { word: "bed", probability: 0.02 }
    ],
    ui:
    {
        previous: "Previous step", next: "Next step", temperature: "Temperature", focused: "More focused", varied: "More varied",
        roll: "Roll again", reset: "Reset seed", seed: "Draw", random: "Random value", result: "THE NEXT WORD", tokenHelp: "Select a token to inspect its attention.",
        sum: "The probabilities add up to 100%.", replay: "Back to the beginning", input: "OUR UNFINISHED SENTENCE", analogy: "A useful way to picture it",
        attention: "Attention from", row: "Normalized weights, including the selected token", map: "A made-up 2D meaning map", tokens: "14 illustrative tokens", ids: "Token → vocabulary ID"
    },
    recapKicker: "THE WHOLE JOURNEY",
    recapTitle: "Five ideas to take with you.",
    recap: ["Text becomes pieces.", "Pieces become numbers.", "Context connects the pieces.", "Scores become probabilities.", "One possibility becomes text."],
    glossaryTitle: "A small field glossary.",
    glossary:
    [
        ["Token", "A piece of text from a model’s vocabulary. It is not always a word."],
        ["Embedding", "A learned numerical representation of a token."],
        ["Attention", "A way to mix information across permitted positions in a sequence."],
        ["Probability", "A share of the possible outcomes. It is not a measure of truth."],
        ["Temperature", "A setting that sharpens or flattens a sampling distribution."],
        ["Seed", "A starting value that makes a pseudo-random sequence reproducible."]
    ],
    faqTitle: "A few good questions.",
    faq:
    [
        ["Is a language model just guessing?", "It predicts using patterns learned during training. That can support remarkably useful behavior, but a plausible continuation is not automatically a factual one."],
        ["Why can the same prompt produce different answers?", "Sampling can choose different tokens from the same distribution. Later choices then depend on the new context. Some settings are deterministic; not every system behaves identically."],
        ["What does this guide leave out?", "Training, positional representations, multiple attention heads, feed-forward layers, normalization, safety tuning and much more. This is a conceptual view of next-token generation, not a complete transformer simulator."],
        ["Is anything being sent to a language model?", "No. This page runs only fixed, invented teaching data and mathematical sampling in your browser. There are no external APIs or AI calls."]
    ],
    closing: "A little less mystery. A little more understanding.",
    footer: "Independent explanations for curious minds.",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/how-large-language-models-work",
    license: "Adapted under CC BY-NC 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/"
};
