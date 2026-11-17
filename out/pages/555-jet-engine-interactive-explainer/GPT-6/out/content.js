export const content =
{
    brand: "Aerofield Lab",
    engine: "High-Bypass Turbofan",
    audience: "engineering students",
    model: "AF-09",
    cta: "Explore the engine",
    nav: ["The engine", "How it works", "Test your knowledge"],
    hero:
    {
        eyebrow: "FIELD NOTES / PROPULSION SERIES 01",
        title: "Small details.<br>Extraordinary <em>thrust.</em>",
        description: "Follow a breath of air through a high-bypass turbofan. Discover the quietly brilliant machinery that turns it into forward motion.",
        aside: "An interactive field guide for engineering students. No thermodynamics degree required.",
        badge: "AF-09 / EDUCATIONAL CUTAWAY",
        note: "Original schematic · not a real engine or performance simulation",
        direction: "AIR IN",
        exhaust: "AIR OUT",
        core: "CORE FLOW",
        bypass: "BYPASS FLOW"
    },
    controls:
    {
        throttle: "Visual throttle",
        pause: "Pause motion",
        play: "Resume motion",
        bypass: "Bypass air",
        core: "Core air",
        reset: "Reset view",
        teaching: "N2:N1 ≈ 2.6:1 is a visual teaching ratio, not measured RPM.",
        stopped: "Motion stopped",
        running: "Illustrative motion",
        reduced: "Reduced motion respected"
    },
    facts:
    [
        ["02", "Independent spools", "One engine. Two rotating systems."],
        ["05", "Steps to understanding", "Follow the air, not the jargon."],
        ["01", "Connected story", "Every stage has a job to do."]
    ],
    stages:
    [
        {name: "Overview", kicker: "01 / THE WHOLE PICTURE", title: "Two paths. One purpose.", copy: "The fan sends most incoming air around the hot core. A smaller stream enters the core, where compression, combustion and expansion keep the engine turning.", detail: "A high-bypass engine makes much of its thrust by accelerating a large mass of bypass air by a relatively small amount.", focus: "all", fact: "The casing is opened here so you can follow both air paths."},
        {name: "Fan & bypass", kicker: "02 / MOVE MORE AIR", title: "The big fan does the heavy lifting.", copy: "Twenty-two wide fan blades draw air into the engine. Most of it takes the bypass duct around the core; the rest continues toward the compressors.", detail: "The low-pressure turbine drives the fan and three low-pressure compressor rows through the inner N1 shaft. Static vanes guide the flow between rotor rows.", focus: "fan", fact: "Bypass air does not pass through the combustor."},
        {name: "Compressor", kicker: "03 / SQUEEZE", title: "Less space. Higher pressure.", copy: "Three low-pressure and six high-pressure rotor rows progressively compress the core air. Stationary stator vanes redirect it between the rotating rows.", detail: "The high-pressure compressor is driven by the high-pressure turbine through the outer, hollow N2 shaft. Compression also raises air temperature; the drawing does not calculate either quantity.", focus: "compressor", fact: "N1 and N2 are coaxial: two shafts sharing one axis."},
        {name: "Combustor", kicker: "04 / ADD HEAT", title: "A continuous flame. Not an explosion.", copy: "Twelve small fuel-nozzle markers surround an annular combustion chamber. Fuel burns in compressed air, adding heat before the gas reaches the turbines.", detail: "Combustion is continuous during normal operation. Pressure drops slightly across a real combustor. Orange indicates heat, not a calculated temperature or a simulated flame.", focus: "combustor", fact: "This fuel-free illustration has no ignition or combustion simulation."},
        {name: "Turbine & exhaust", kicker: "05 / TAKE ENERGY, MAKE THRUST", title: "The back powers the front.", copy: "One high-pressure turbine row drives N2. Three low-pressure turbine rows drive N1. The remaining gas expands through the exhaust, contributing to thrust.", detail: "The turbines extract work from hot gas; they are not powered by the fan. Net thrust comes from changes in air momentum and pressure forces across the whole engine.", focus: "turbine", fact: "The two spools turn independently, not at a fixed real-world ratio."}
    ],
    tour: {eyebrow: "FOLLOW THE AIR", title: "An engine, from the inside out.", description: "Scroll through the five steps, or select a stage on the cutaway. Blue takes the long way around. Amber goes through the core."},
    lab: {eyebrow: "YOUR TURN", title: "Make the connection.", description: "Move the throttle. Isolate an air path. Watch how the two spools respond together.", title2: "What powers the fan?", options: ["The high-pressure compressor", "The low-pressure turbine", "The exhaust nozzle"], answer: 1, correct: "Exactly. The low-pressure turbine drives the fan and low-pressure compressor through the N1 shaft.", incorrect: "Not quite. Follow the teal N1 shaft: the low-pressure turbine supplies the work that turns the fan.", reset: "Try again", hint: "A quick check before you go. Choose one answer."},
    footer: {line: "Stay curious. Look closer.", text: "AF-09 is an invented teaching engine. Geometry, speed and air paths are simplified. No measured operating data, physics solver or live engine controls.", credit: "Template by VibeFather", url: "https://vibefather.ai/t/jet-engine-interactive-explainer", license: "CC BY-NC 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/"},
    geometry: {fanBlades: 22, lpc: 3, hpc: 6, nozzles: 12, hpt: 1, lpt: 3, n1: 4.8, n2: 12.5}
};
