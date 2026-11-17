export const content =
{
    brand: "Petal Atlas",
    specimen: "Oriental lily",
    audience: "Curious beginners",
    storageKey: "petal-atlas-best",
    model:
    {
        tepalColor: "#EEA095",
        tepalInner: "#FFD7CA",
        leafColor: "#3E6B50",
        antherColor: "#B87828",
        pollenColor: "#D99A2B",
        tepalLength: 2.4,
        tepalWidth: 0.72,
        speckles: 15
    },
    chapters:
    {
        anatomy: ["01", "Inside a flower.", "Turn an Oriental lily, lift its tepals, and see how its parts work together."],
        pollination: ["02", "Follow the pollen.", "Watch a compatible grain reach a stigma. Play the sequence or inspect one stage at a time."],
        quiz: ["03", "Check your understanding.", "Five questions. Choose an answer to learn why. Your best score stays in this browser."]
    },
    parts:
    [
        { id: "tepals", name: "Tepals", index: "01", sub: "The welcoming whorls", text: "Six petal-like tepals form two whorls. In a lily, petals and sepals look nearly identical, so we call them tepals.", fact: "Two whorls × three tepals", reveal: 0 },
        { id: "stamen", name: "Stamen", index: "02", sub: "The pollen maker", text: "Six stamens surround the pistil. Each has a slender filament supporting an anther, where pollen is produced.", fact: "Anther + filament = stamen", reveal: 1 },
        { id: "stigma", name: "Stigma", index: "03", sub: "The receptive surface", text: "The three-lobed stigma crowns the pistil. Its receptive, sticky surface catches compatible pollen.", fact: "Pollination starts here", reveal: 0 },
        { id: "style", name: "Style", index: "04", sub: "The connecting passage", text: "The style links the stigma and ovary. After a compatible pollen grain germinates, its tube grows through this stalk.", fact: "A pathway, not a pollen maker", reveal: 2 },
        { id: "ovary", name: "Ovary", index: "05", sub: "The protective chamber", text: "The superior ovary sits above the tepal attachment. Its three chambers contain ovules, protected inside the green wall.", fact: "Superior means above the attachment", reveal: 2 },
        { id: "ovule", name: "Ovule", index: "06", sub: "A seed in the making", text: "Each ovule contains an egg cell. After fertilization, an ovule can develop into a seed. Open the ovary to look inside.", fact: "Ovule → seed after fertilization", reveal: 3 }
    ],
    whole:
    {
        title: "Built for making seeds.",
        text: "Showy tepals draw pollinators in. Within them, stamens make pollen and the pistil receives it. Select a part to follow the connections."
    },
    steps: ["Whole flower", "Tepals lifted", "Stamens parted", "Ovary cutaway"],
    pollination:
    [
        { name: "Pollen release", short: "Release", text: "Mature anthers split open and expose pollen grains. These tiny grains carry the cells that take part in fertilization.", time: 0 },
        { name: "Pollen transfer", short: "Transfer", text: "A visiting pollinator carries compatible pollen from an anther to the sticky stigma. This transfer is pollination.", time: 2 },
        { name: "Tube growth", short: "Tube growth", text: "After pollination, a grain germinates. Its pollen tube grows down the style toward an ovule.", time: 5 },
        { name: "Fertilization", short: "Fertilization", text: "A sperm cell joins the egg cell inside an ovule. This is fertilization, not pollination. The ovule can now develop into a seed.", time: 9 }
    ],
    questions:
    [
        { question: "Which part catches compatible pollen?", options: ["Stigma", "Filament", "Tepal", "Ovule"], answer: 0, why: "The stigma has a receptive, often sticky surface where compatible pollen lands.", part: "Stigma" },
        { question: "What are the two parts of a stamen?", options: ["Stigma and style", "Anther and filament", "Ovary and ovule", "Petal and sepal"], answer: 1, why: "A filament supports an anther; the anther produces pollen.", part: "Stamen" },
        { question: "Where would you find the ovules?", options: ["On the tepals", "Inside the anther", "Inside the ovary", "Along the stem"], answer: 2, why: "The ovary contains chambers with ovules inside.", part: "Ovary" },
        { question: "Which event is pollination?", options: ["An ovule becomes a seed", "A sperm cell joins an egg cell", "A pollen tube enters an ovule", "Pollen moves from an anther to a compatible stigma"], answer: 3, why: "Pollination is pollen transfer. Tube growth and fertilization happen afterward.", part: "Pollination" },
        { question: "How is fertilization different from pollination?", options: ["Pollination transfers pollen; fertilization joins a sperm cell and an egg cell", "Pollination makes seeds; fertilization opens anthers", "Pollination grows the style; fertilization colors tepals", "They are names for the same event"], answer: 0, why: "Pollen first reaches a stigma. Fertilization happens later, inside an ovule.", part: "Fertilization" }
    ],
    links:
    {
        credit: "https://vibefather.ai/t/flower-anatomy-3d-explainer",
        license: "https://creativecommons.org/licenses/by-nc/4.0/"
    }
};
