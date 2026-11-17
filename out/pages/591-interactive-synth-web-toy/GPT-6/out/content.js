export const content = {
    brand: "Moonbleep",
    tagline: "Sixteen steps, three voices, one link to send a friend.",
    audience: "people who have never touched a synth",
    credit: { label: "Template by VibeFather", url: "https://vibefather.ai/t/interactive-synth-web-toy" },
    labels: {
        shortcuts: "SPACE PLAY / Z X OCTAVE",
        off: "AUDIO OFF", on: "AUDIO ON", scope: "SCOPE", stopped: "STOPPED",
        startMessage: "Sound starts on your first tap.", linkMessage: "This link holds a pattern.",
        start: "Start sound", playLink: "Play it", startHint: "or press A",
        unsupported: "This browser has no Web Audio.", play: "Play", stop: "Stop",
        clear: "Clear", voice: "VOICE", starter: "START", tempo: "TEMPO",
        tone: "TONE", volume: "VOLUME", copy: "Copy link", copied: "Copied",
        fallback: "Copy this link", pattern: "PATTERN", keys: "KEYS",
        swipe: "Swipe for more keys", octaveDown: "Lower octave", octaveUp: "Raise octave",
        instrument: "Browser synthesizer", patternHint: "C MINOR PENTATONIC",
        keyboardHint: "25 KEYS · INFINITE POSSIBILITIES", step: "STEP",
        octave: "OCT", mono: "LIVE / NO SAMPLES", release: "All notes released.",
        audioError: "Audio could not start. Tap to try again.",
        cleared: "Pattern cleared.", footer: "No account, no download, no samples: every sound is synthesized in your browser."
    },
    voices: ["Velvet Pad", "Pixel Lead", "Gravel Bass"],
    patterns: ["Night Tram", "Tin Rain", "Slow Comet"],
    notes: [
        { title: "Play it", text: "Hold A through ; for the white keys and W, E, T, Y, U, O, P for the black ones. Z and X move the octave. Any key with a dot stays in the scale the grid uses, so it fits over whatever is running." },
        { title: "Loop it", text: "Eight pitches, sixteen steps, one scale. Click to light a pad, drag to paint a run, press Space to start and stop. Tempo runs from 60 to 180 BPM." },
        { title: "Send it", text: "Every pad you light rewrites the address bar. Copy the link and whoever opens it gets the same pattern, tempo, voice and tone. Nothing is stored anywhere: the whole loop lives in the URL." }
    ]
};
