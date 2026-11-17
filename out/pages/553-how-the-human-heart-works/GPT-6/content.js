export const content =
{
    brand: "Cutaway Lab",
    audience: "curious adults and high school biology classes",
    title: "How the human heart works",
    nav: [["beat", "The beat"], ["path", "Blood path"], ["moments", "Five moments"], ["rate", "Rate"], ["trace", "The trace"], ["valves", "Valves"], ["class", "Class"]],
    eyebrow: "Cutaway Lab Explainer No. 07",
    sub: "Four chambers, four valves and one electrical signal, running on a single clock. Drag the slider and watch every part keep time.",
    orientation: "You are facing the person, so their right side is on your left.",
    legend: ["Oxygen-poor blood", "Oxygen-rich blood", "Electrical signal"],
    instrument:
    {
        label: "Heart rate", unit: "BPM", systole: "Systole", diastole: "Diastole",
        pause: "Pause the clock", play: "Resume the clock", previous: "Previous", next: "Next", live: "Back to live",
        follow: "Follow one drop of blood", step: "Step through one beat", held: "Held frame",
        model: "One clock · teaching model", current: "Your slider"
    },
    traceCaption: "Stylized trace, synthesized from math. Not a recording.",
    marks:
    [
        ["P", "P: the signal crosses the atria. They squeeze next."],
        ["QRS", "QRS: the signal reaches the ventricles. They squeeze next."],
        ["T", "T: the ventricles reset for the next beat."]
    ],
    phases:
    [
        ["Squeeze begins", "The ventricles tighten, but every valve is shut. Pressure climbs with nowhere to go.", "Inlets closed", "Outlets closed"],
        ["Ejection", "Pressure wins. The outlet valves open and blood leaves for the lungs and the body.", "Inlets closed", "Outlets open"],
        ["Relaxation", "The ventricles let go. The outlet valves snap shut against the backflow, and for a moment everything is closed again.", "Inlets closed", "Outlets closed"],
        ["Filling", "Pressure falls below the atria. The inlet valves open and blood pours down.", "Inlets open", "Outlets closed"],
        ["Atrial top-up", "A small squeeze from the atria pushes in the last of the blood, just before the next beat.", "Inlets open", "Outlets closed"]
    ],
    path:
    {
        title: "Follow one drop of blood",
        intro: "One full trip goes through the heart twice. Scroll, and the diagram lights up each stop in order.",
        steps:
        [
            ["Right atrium", "Arrival", "Blood back from the body collects here, through one large vein from above and one from below. It has given up much of its oxygen, so it is drawn in cobalt.", ["RA"], [330, 340]],
            ["Tricuspid valve", "A one-way door opens", "When the chamber below relaxes, pressure drops and this valve swings open. A small squeeze from the atrium tops up the ventricle before the door shuts.", ["tricuspid", "inlet-right"], [332, 442]],
            ["Right ventricle", "The short push", "The electrical signal arrives and this chamber squeezes. The tricuspid valve shuts so nothing flows back. The wall is thinner here because the lungs are close by.", ["RV"], [380, 560]],
            ["Pulmonary valve", "Out to the lungs", "Pressure forces these cusps open and blood leaves through the pulmonary artery. When the squeeze ends, the cusps catch the backflow and seal.", ["pulmonary", "pulmonary-artery"], [432, 290]],
            ["Lungs", "The color change", "Blood spreads through tiny vessels wrapped around air sacs. Carbon dioxide leaves and oxygen comes in. This is where the diagram turns from cobalt to scarlet.", ["lungs"], [880, 290]],
            ["Left atrium", "Back to the heart", "Four veins carry the refreshed blood back. The left atrium holds it until the next relaxation, filling at the same time as its partner on the other side.", ["LA", "right-veins"], [640, 320]],
            ["Mitral valve", "The two-leaflet door", "This valve has two leaflets where the tricuspid has three. It opens as the left ventricle relaxes, and the atrium adds a last squeeze.", ["mitral", "inlet-left"], [626, 425]],
            ["Left ventricle", "The thick wall", "This chamber has the heaviest wall in the diagram. It sends blood all the way around the body, against far more resistance than the right side faces.", ["LV"], [626, 580]],
            ["Aortic valve", "The big exit", "Both ventricles squeeze together, so this valve opens at the same moment as the pulmonary valve. Blood rushes into the aorta, and the first branches arch off toward the head and arms.", ["aortic", "aorta"], [500, 330]],
            ["Body", "The long way round", "Arteries divide into smaller and smaller vessels until oxygen can pass to the tissue. The blood turns cobalt again and heads for the two large veins. Then the trip starts over.", ["aorta", "descending-aorta", "body", "cavae"], [792, 700]]
        ]
    },
    moments: ["One beat, five moments", "Pick a moment and the page holds there. Every diagram, trace and valve card waits with it."],
    rate: ["Faster beats, shorter rests", "Systole, the squeeze, barely changes as the rate climbs. Diastole, the rest and refill, gives up almost all of the difference.", "Output of the simple model on this page, not measured data. It is drawn to show the pattern."],
    trace:
    {
        title: "Three marks on one line",
        intro: "The trace shows the electrical signal, not the movement. The signal comes first, then the muscle answers.",
        cards:
        [
            ["P", "A spark starts at the top of the right atrium and spreads across both atria. They squeeze a moment later.", ["atrial", "RA", "LA"]],
            ["QRS", "The signal drops down the wall between the ventricles and fans out. It is the tallest mark because the ventricles are the largest muscle in the diagram.", ["septal", "branches", "RV", "LV"]],
            ["T", "The ventricle muscle resets, ready for the next signal. The chambers are finishing their squeeze as this mark passes.", ["RV", "LV"]]
        ],
        note: "This line is built from smooth math curves to show where each mark falls. It cannot be used to read a real heart."
    },
    valves:
    {
        title: "Four valves, one direction",
        intro: "Valves do not push anything. They open and close because of pressure on either side.",
        open: "Open", closed: "Closed",
        cards:
        [
            ["Tricuspid", "Right atrium to right ventricle. Three leaflets, shown as two in this slice.", "inlet", "blue"],
            ["Pulmonary", "Right ventricle to pulmonary artery. Three cusps, shown as two in this slice.", "outlet", "blue"],
            ["Mitral", "Left atrium to left ventricle. Two leaflets.", "inlet", "red"],
            ["Aortic", "Left ventricle to aorta. Three cusps, shown as two in this slice.", "outlet", "red"]
        ]
    },
    classroom:
    {
        title: "Use it in class",
        prompts:
        [
            "Set the slider to 40, then to 180. Which part of the beat lost more time, and what did the ventricles do differently?",
            "Pause on Ejection. Name the two open valves and say why the other two must stay shut.",
            "Find the point where the diagram turns from cobalt to scarlet. What changed, and where?"
        ],
        questions:
        [
            ["Why does the trace move before the heart does?", "The electrical signal comes first and the muscle responds a moment later. Watch the green spark travel just before each squeeze."],
            ["Is this a real ECG?", "No. The trace is a sum of smooth math curves shaped to show where P, QRS and T fall. It is not a recording and should not be read as one."],
            ["Are the timings real?", "They come from a simple formula chosen to show one pattern: systole barely changes while diastole shrinks. Treat them as a teaching model, not as measurements."],
            ["Can this page tell me anything about my own heart?", "No. It does not read your pulse and it cannot assess anything. Questions about your own heart belong with a clinician."]
        ]
    },
    footer:
    {
        disclaimer: "A stylized teaching model for curious adults and high school biology classes. Not medical advice and not a measuring tool.",
        colophon: "Words: Odalys Renn. Drawing and code: Teo Marchetti. Published by Cutaway Lab.",
        series: "Next in the series", pending: "In progress",
        next: ["How lungs trade gas", "How a kidney filters", "How a four-stroke engine breathes"],
        credit: "Template by VibeFather", url: "https://vibefather.ai/t/how-the-human-heart-works"
    },
    labels:
    [
        ["Right atrium", 322, 345, "#FFFFFF", "RA"], ["Right ventricle", 385, 565, "#FFFFFF", "RV"],
        ["Left atrium", 640, 325, "#16081A", "LA"], ["Left ventricle", 628, 590, "#16081A", "LV"],
        ["Aorta", 640, 112, "#FF4A5E"], ["Pulmonary artery", 610, 152, "#7F9CFF"],
        ["Vena cava", 350, 30, "#7F9CFF"], ["Lungs", 108, 112, "#C9B6CE"],
        ["Lungs", 892, 112, "#C9B6CE"], ["Body", 496, 858, "#F8EEF4"]
    ],
    diagramDescription: "Stylized frontal cross-section of the human heart, with the person's right chambers on the left, two lungs and systemic circulation.",
    traceDescription: "Synthesized ECG waveform with P, QRS and T marks.",
    stopLabel: "Blood path stop",
    svgPaths:
    {
        atrial: "M262 262 C330 330 420 410 500 470", septal: "M500 470 L500 700",
        branches: ["M500 560 C450 600 400 620 360 600", "M500 620 C550 680 620 700 680 640"]
    }
};
