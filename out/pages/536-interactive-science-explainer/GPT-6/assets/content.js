export const VARS = Object.freeze(
{
    BRAND: "Kestrel Review",
    DEVICE: "noise-cancelling headphones",
    NOISE_SOURCE: "the low hum of a jet cabin",
    READER: "curious commuters",
    ISSUE_LABEL: "Issue 14 · Acoustics"
});

export const content =
{
    brand: `${VARS.BRAND}`,
    issue: `${VARS.ISSUE_LABEL}`,
    skip: "Skip to the story",
    navigation: ["The story", "Phase lab", "Check understanding"],
    hero:
    {
        eyebrow: "THE EVERYDAY SCIENCE SERIES / 014",
        title: "Silence, made<br>of <em>sound.</em>",
        dek: `How ${VARS.DEVICE} turn ${VARS.NOISE_SOURCE} into a little room of quiet.`,
        byline: `A field guide for ${VARS.READER}`,
        reading: "8 minute read · 4 chapters",
        start: "Follow the wave",
        note: "No audio. No microphone. Just an idea you can touch.",
        figure: "FIG. 00",
        figureTitle: "Two waves. One quiet moment.",
        legend: ["The noise", "Its opposite", "What remains"],
        caption: "Equal pressure. Opposite phase. The sum is silence.",
        signal: ["NOISE", "ANTI-NOISE", "SUM"],
        experiment: "Explore the phase lab",
        arrow: "↓"
    },
    chapters: ["01 / THE WAVE", "02 / THE EXPERIMENT", "03 / THE DEVICE", "04 / THE LIMITS"],
    pressure:
    {
        title: "First, a little<br>push on the air.",
        intro: "Sound is not a thing flying toward you. It is a pattern of pressure moving through air.",
        figure: "FIG. 01 / PRESSURE IN MOTION",
        canvasLabel: "Animated pressure wave and air particles. The particles move back and forth; the wave pattern travels to the right.",
        controlsLabel: "Explore the pressure wave",
        steps:
        [
            { title: "Air at rest", text: "Before the noise, air pressure is balanced. The dots are a simplified view of air particles, not their actual size.", label: "1. At rest", caption: "No disturbance. No travelling pressure pattern." },
            { title: "A push, then a pull", text: "A vibrating source squeezes nearby air, then lets it spread out. High and low pressure follow one another.", label: "2. Push & pull", caption: "Close dots mean higher pressure. Wider gaps mean lower pressure." },
            { title: "The pattern travels", text: "Each region nudges the next. The pressure pattern travels onward, while air particles stay near their starting positions.", label: "3. Travelling wave", caption: "The pattern moves right. The highlighted particle only moves back and forth." }
        ],
        graphLabels: ["HIGHER PRESSURE", "BALANCED", "LOWER PRESSURE"],
        marker: "ONE AIR PARTICLE",
        footer: "Illustration slowed down. Particle spacing and wave scale are schematic."
    },
    phase:
    {
        title: "Meet noise<br>with its opposite.",
        intro: "Drag the coral wave. Or move the slider. Find the point where two sounds add up to less.",
        figure: "FIG. 02 / THE ANTI-NOISE PHASE LAB",
        canvasLabel: "Interactive graph of the noise, anti-noise and their sum. Drag horizontally to change the anti-noise phase.",
        slider: "Anti-noise phase",
        endpoints: ["In step", "Opposite", "In step again"],
        presets: [{ phase: 0, label: "In step · 0°" }, { phase: 90, label: "Quarter turn · 90°" }, { phase: 180, label: "Opposite · 180°" }],
        legend: ["Noise", "Anti-noise", "Sum"],
        level: "RESULTING LEVEL",
        reference: "relative to the original noise",
        amplitude: "Remaining amplitude",
        states:
        {
            reinforcing: "In step, the waves reinforce one another. Twice the amplitude means about 6 dB more sound.",
            partial: "Some pressure cancels, but not all. Keep moving toward a half-turn.",
            cancelling: "The sum is quieter than the original noise. The closer to 180°, the more pressure cancels.",
            silent: "At 180°, every push meets an equal pull. The ideal summed wave is flat."
        },
        ideal: "Ideal silence",
        infinity: "−∞ dB",
        model: "An ideal model: equal-amplitude sine waves at one frequency, measured at the same point. Real headphones leave some residual sound.",
        learn: "Phase is timing, expressed as a share of a wave cycle. 180° is half a cycle.",
        units: "dB",
        canvasHints: ["NOISE + ANTI-NOISE", "WHAT REACHES YOUR EAR", "DRAG TO SHIFT THE CORAL WAVE ↔"]
    },
    earcup:
    {
        title: "A small lab.<br>Right by your ear.",
        intro: `Inside ${VARS.DEVICE}, listening and correcting happen together.`,
        figure: "FIG. 03 / AN EARCUP, OPENED UP",
        label: "Schematic cut-away of a headphone earcup showing the cushion, microphone, processor and speaker.",
        controls: "Reveal the earcup parts",
        steps:
        [
            { title: "The cushion seals", text: "A soft cushion makes a physical barrier. This passive isolation blocks some sound before any electronics are involved.", label: "1. Cushion" },
            { title: "The microphone listens", text: "A microphone samples the surrounding noise. It gives the electronics a changing pressure signal to work with.", label: "2. Microphone" },
            { title: "The processor predicts", text: "A tiny processor shapes a matching signal with the opposite pressure. It must account for timing and the acoustic path to your ear.", label: "3. Processor" },
            { title: "The speaker responds", text: "The speaker produces the anti-noise. At your ear, it meets the incoming noise and reduces the combined pressure.", label: "4. Speaker" }
        ],
        labels: ["Cushion", "Microphone", "Processor", "Speaker", "Your ear", "Incoming noise", "Anti-noise"],
        caption: "A simplified feedforward layout. Real designs may add a second microphone inside the earcup.",
        note: "The microphone never “removes” sound. The speaker adds a carefully chosen sound."
    },
    limits:
    {
        title: "Quiet has<br>its boundaries.",
        intro: `The steady, low-pitched part of ${VARS.NOISE_SOURCE} is easier to cancel than a sudden voice or a sharp clatter.`,
        figure: "FIG. 04 / DIFFERENT TOOLS, DIFFERENT FREQUENCIES",
        label: "Illustrative active and passive sound reduction by frequency, in decibels.",
        legend: ["Active cancellation", "Passive isolation"],
        axis: "ILLUSTRATIVE REDUCTION / dB",
        frequency: "FREQUENCY / Hz",
        controls: "Inspect a frequency band",
        bands:
        [
            { hz: 100, active: 24, passive: 3, text: "100 Hz · Low hum. Long, steady waves give the electronics time to match the pressure." },
            { hz: 250, active: 21, passive: 6, text: "250 Hz · Engine rumble. Active cancellation is still effective in this illustrative low-frequency band." },
            { hz: 500, active: 15, passive: 10, text: "500 Hz · Midrange. Shorter wave cycles make precise timing more demanding." },
            { hz: 1000, active: 8, passive: 17, text: "1,000 Hz · Speech range. A cushion helps, but voices span many frequencies and change rapidly." },
            { hz: 4000, active: 2, passive: 27, text: "4,000 Hz · Sharp sounds. A good physical seal often does more than the active system here." }
        ],
        caption: "Illustrative values, not measured product data. Active and passive reductions are shown separately; do not add these bars to predict a headphone’s performance.",
        note: "More reduction means less sound. Cancellation is local to the listening point, not silence throughout the cabin.",
        reading: "Selected band",
        unit: "Hz",
        db: "dB reduction"
    },
    quiz:
    {
        eyebrow: "THE TAKEAWAY",
        title: "Did the idea click?",
        intro: "Four quick questions. Choose an answer to see why it works.",
        progress: "correct",
        reset: "Try again",
        incomplete: "Answer all four to complete the field guide.",
        complete: `The wave has come full circle. A little more quiet for ${VARS.READER}.`,
        correct: "That’s right.",
        incorrect: "Not quite.",
        questions:
        [
            { question: "At equal amplitude, which phase makes the summed wave flat?", options: ["0° — in step", "90° — a quarter turn", "180° — half a turn"], answer: 2, explanation: "A half-turn puts every peak opposite a trough. Equal pushes and pulls sum to zero at the listening point." },
            { question: "What travels from the source to your ear?", options: ["A pressure pattern", "The same air particles", "A stream of empty space"], answer: 0, explanation: "The pressure pattern travels. Air particles oscillate locally; they do not make the whole journey to your ear." },
            { question: "Which part makes the anti-noise?", options: ["The cushion", "The microphone", "The speaker"], answer: 2, explanation: "The microphone measures and the processor calculates. The speaker produces the pressure wave that cancels the noise." },
            { question: "Which sound is usually easier to actively cancel?", options: ["A sudden nearby clap", "A steady low engine hum", "Every sound equally"], answer: 1, explanation: "A predictable low-frequency hum is easier to track. Short, changing wave cycles make accurate cancellation more difficult." }
        ]
    },
    footer:
    {
        closing: "Stay curious. Travel quietly.",
        description: "Independent ideas for the everyday world.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/interactive-science-explainer",
        license: "Adapted under CC BY-NC 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
        top: "Back to the top ↑"
    }
};
