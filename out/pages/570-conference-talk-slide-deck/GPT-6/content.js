export const talk =
{
    title: "Ship Small, Sleep Well",
    speaker: "Elena Marsh",
    venue: "SampleConf · Main stage (sample)",
    duration: "A 20-minute talk",
    topic: "On software, scope & a good night’s sleep.",
    label: "A field guide to calmer releases",
    speakerSlug: "elena-marsh",
    talkSlug: "ship-small-sleep-well",
    closingLink: "./index.html#/1",
    credit: "Built with a VibeFather template",
    creditUrl: "https://vibefather.ai",
    slides:
    [
        {
            type: "title",
            section: "Opening",
            title: "Ship Small, Sleep Well",
            lines: ["Ship Small,", "Sleep Well."],
            note: "Opening · 2 minutes. Introduce yourself as an invented sample speaker, then ask who has ever watched a deploy instead of going to bed; this is a talk about shrinking uncertainty, not ambition."
        },
        {
            type: "agenda",
            section: "The route",
            title: "Three honest failures",
            items:
            [
                ["A launch that hurt", "When everything shipped except our confidence."],
                ["The rewrite that didn’t", "A smaller decision, not a second system."],
                ["What I ship now", "One promise. One check. One way back."]
            ],
            aside: "No hero’s journey. Mostly version control.",
            note: "The route · 2 minutes. Set up three invented experiences: an oversized launch, an avoided rewrite, and the small release habit that replaced both; the only hero today is the undo button."
        },
        {
            type: "statement",
            section: "The principle",
            title: "Small ships sleep well.",
            lines: ["Small ships", "sleep well."],
            accent: 1,
            note: "The principle · 2 minutes. Pause here and let it sit for three seconds; small means a change whose consequences you can explain, observe, and reverse."
        },
        {
            type: "bullets",
            section: "Define small",
            title: "What small actually means",
            items:
            [
                ["One screen", "A complete user task, not half of every feature."],
                ["One dependency less", "Remove a moving part before adding another."],
                ["One honest promise", "Say exactly what works, and what does not."],
                ["One rollback plan", "Know the way back before you go forward."]
            ],
            note: "Define small · 3 minutes. Walk through a fictional receipt-download release: one screen, the existing service, an explicit file-size limit, and a switch back to the old flow; small is end-to-end, not unfinished."
        },
        {
            type: "code",
            section: "Make the check legible",
            title: "The whole check, honestly",
            filename: "release-check.ts",
            language: "TypeScript",
            code:
            [
                "type Release = {",
                "    errors: number;",
                "    rollback: boolean;",
                "};",
                "",
                "function deployCheck(r: Release) {",
                "    // Keep the way home open.",
                "    const budget = 0;",
                "    if (r.errors > budget) return 'hold';",
                "    if (!r.rollback) return 'hold';",
                "    return 'ship';",
                "}"
            ],
            point: "If it fits on a slide, it fits in your head.",
            detail: "No errors. A way back. A decision someone can explain.",
            focusHint: "↑ ↓ step lines",
            note: "The check · 3 minutes. Step through the two hold conditions with the up and down arrows: a zero-error budget and a rehearsed rollback; this teaching snippet is a decision gate, not a production deployment system."
        },
        {
            type: "two-col",
            section: "A fictional postmortem",
            title: "The launch that hurt",
            paragraphs:
            [
                "We bundled a new checkout, a new queue, and a new pricing rule. Each was tested. Their combination was a surprise.",
                "When receipts stalled, we had three suspects and no safe way to separate them. We restored the old flow, then untangled the changes.",
                "The proposed rewrite became one queue limit and one release switch. Our architecture diagram lost weight. So did our on-call snack budget."
            ],
            panelTitle: "postmortem, abridged",
            outcomes:
            [
                ["03", "changes coupled together"],
                ["00", "independent rollback paths"],
                ["01", "user promise: a receipt"],
                ["→", "separate, observe, reverse"]
            ],
            note: "The launch · 3 minutes. These events and outcomes are invented sample content, not measured case-study results; explain how independently releasable changes would have narrowed both the failure and the recovery."
        },
        {
            type: "statement",
            section: "The payoff",
            title: "Boring is a feature you ship.",
            lines: ["Boring is a feature", "you ship."],
            accent: 0,
            note: "The payoff · 2 minutes. Boring means users can trust the release and the team can predict recovery; it does not mean avoiding important work or ignoring risk."
        },
        {
            type: "bullets",
            section: "Take it to work",
            title: "Monday, at your desk",
            items:
            [
                ["Delete one thing", "Remove one dependency or one unnecessary promise."],
                ["Write the rollback first", "Rehearse how you will restore the previous version."],
                ["Tell one user the truth", "Name the limit, ask what matters, ship that."]
            ],
            note: "Monday · 2 minutes. Ask listeners to choose one action, not start a transformation programme; before their next release, they should be able to name its user, its limit, and its way back."
        },
        {
            type: "closing",
            section: "Go make something smaller",
            title: "Thank you.",
            link: "Slides stay at this link (sample)",
            aside: "May your pager remain a very expensive clock.",
            note: "Closing · 1 minute. Thank the audience, point out that the current URL opens this deck, and invite questions; leave the last joke up while everyone remembers where they put their coffee."
        }
    ]
};

export const ui =
{
    deck: "Presentation slides",
    progress: "Presentation progress",
    previous: "Previous slide",
    next: "Next slide",
    overview: "Slide overview",
    notes: "Speaker notes",
    print: "Print handout",
    grid: "Grid",
    notesShort: "Notes",
    move: "move",
    tap: "Tap left / right to move",
    keyboard: "Use ← → to begin",
    overviewHint: "Arrows to select · Enter to open · Esc to close",
    notesCaption: "Notes are yours, not the audience’s.",
    close: "Close",
    selected: "Current slide",
    sample: "Invented talk · Sample content",
    slide: "Slide",
    of: "of",
    all: "All nine slides",
    line: "Focused line",
    escape: "Esc"
};
