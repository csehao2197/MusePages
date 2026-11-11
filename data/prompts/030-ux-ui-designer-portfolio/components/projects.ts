export type Category = "All work" | "Mobile" | "SaaS" | "Healthcare";
export type Project = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  category: Category;
  year: string;
  description: string;
  metrics: [string, string][];
  color: string;
  challenge: string;
  research: string;
  constraints: string;
  decision: string;
  iteration: string;
  outcome: string;
  next: string;
};

export const projects: Project[] = [
  {
    id: "calendar", number: "01", title: "A calmer kind of calendar.",
    eyebrow: "Notion Calendar Redesign", category: "Mobile", year: "2025",
    description: "Making room for real life. A mobile scheduling concept that brings multiple workspaces into one clear, considered day.",
    metrics: [["34%", "faster task creation¹"], ["4.8/5", "target app rating¹"], ["2M+", "scenario scale¹"]],
    color: "lavender",
    challenge: "A fictional designer moves between a studio workspace and personal commitments. Switching calendars hides conflicts until after an event is created.",
    research: "A desk-based, invented journey maps three scenarios: planning a focus block, moving a client meeting, and checking a shared workspace. The hypothesis is that workspace context should stay visible without becoming another required step. No participants were recruited or interviewed.",
    constraints: "Small screens, one-handed use, and busy calendars. The design must distinguish workspaces without relying only on color and must preserve event ownership when an event moves.",
    decision: "Use a unified day view with named workspace chips. Place a persistent create action within thumb reach, and show a time-conflict warning before confirmation.",
    iteration: "Version A used a separate workspace picker before the event form. Version B keeps the current workspace in context, with an explicit switch and a conflict summary. The interactive prototype demonstrates Version B; it is not connected to a calendar.",
    outcome: "34% faster creation and a 4.8/5 rating are illustrative targets, not measured outcomes or an App Store rating. The 2M+ figure is a fictional scale assumption, not adoption.",
    next: "A real evaluation would compare completion time, error rate, and perceived control with consented participants across assistive-technology and multi-workspace scenarios.",
  },
  {
    id: "analytics", number: "02", title: "Less searching. More insight.",
    eyebrow: "Stripe Dashboard Analytics", category: "SaaS", year: "2024",
    description: "From six reporting views to one useful story. An analytics concept built around the questions merchants actually need to answer.",
    metrics: [["60%", "less page switching¹"], ["89%", "satisfaction target¹"], ["6 → 1", "reporting concept"]],
    color: "peach",
    challenge: "A fictional merchant can see revenue, refunds, and subscriptions, but each lives in a separate report with a different date range. Comparing performance becomes a spreadsheet exercise.",
    research: "A synthetic task inventory explores daily reconciliation, month-end review, and investigating a revenue dip. These are authored scenarios, not merchant interviews or findings from Stripe.",
    constraints: "Financial numbers need explicit periods and units. Dense tables must remain usable with a keyboard and must not hide negative changes behind decorative charts.",
    decision: "Put one shared period control above revenue, trend, and transaction detail. Pair every chart with plain-text values and distinguish gross revenue from net revenue.",
    iteration: "An early concept emphasized a large chart but buried refunds. The revision adds a comparable summary row and a visible source-of-change table. Toggle the period in the prototype to explore the relationship.",
    outcome: "60% fewer page switches and 89% satisfaction are untested targets. The brief's $2.4B processing claim is intentionally not presented as real activity; this prototype processes no money.",
    next: "Validate date-range comprehension and reconciliation accuracy with consented merchants before testing whether consolidation reduces navigation.",
  },
  {
    id: "plugins", number: "03", title: "Find your next flow state.",
    eyebrow: "Figma Plugin Manager", category: "SaaS", year: "2024",
    description: "A little less tool wrangling. A discoverable, organized home for the plugins that make a design workflow feel effortless.",
    metrics: [["3×", "install-rate target¹"], ["52%", "fewer support requests¹"], ["800K", "scenario scale¹"]],
    color: "mint",
    challenge: "A fictional design team loses track of installed plugins and cannot tell which tools are current. Discovery and maintenance compete for attention in one crowded list.",
    research: "An invented inventory groups tasks into finding a tool, assessing it, and keeping it current. A speculative journey identifies the risk of accidental installation. No Figma usage data or user research was accessed.",
    constraints: "Preserve recognizable plugin names, distinguish installed from available, and never represent a local demonstration as an actual third-party installation.",
    decision: "Separate discovery from maintenance. Show a short purpose, category, and explicit local install state on each plugin. Make bulk updates a distinct action rather than an automatic side effect.",
    iteration: "The first layout sorted by popularity alone. The revision surfaces category and maintenance state first, avoiding invented reviews as evidence of trust. The prototype supports category selection and reversible local installation.",
    outcome: "3× installation, 52% fewer tickets, and 800K designers are fictional goals and scale assumptions. There are no real installations, support outcomes, or endorsements.",
    next: "Test findability and accidental-install rates, including keyboard-only navigation, before introducing recommendations or ratings.",
  },
  {
    id: "health", number: "04", title: "Care, without the complexity.",
    eyebrow: "HealthTrack Patient Portal", category: "Healthcare", year: "2023",
    description: "Bringing a human touch to healthcare. An accessible-first portal concept for appointments, results, and the next step.",
    metrics: [["AA", "accessibility goal¹"], ["4.6/5", "patient-rating target¹"], ["40%", "fewer missed visits¹"]],
    color: "blue",
    challenge: "A fictional patient receives a lab result but cannot tell what to do next. Appointment booking, results, and messages are disconnected, adding uncertainty at an already stressful moment.",
    research: "An authored patient journey follows checking a result and scheduling a follow-up. Plain-language and cognitive-load principles inform the concept. No patient records, clinician interviews, or clinical research were used.",
    constraints: "No medical advice or real health data. Make status understandable without color, explain time slots clearly, and keep navigation and confirmation reachable with a keyboard.",
    decision: "Use a single next-action card, plain-language result status, and a short booking sequence. Keep the date and selected time visible in confirmation so mistakes can be corrected.",
    iteration: "The first version led with a long results table. The revision prioritizes an explicit follow-up action. The prototype books only a local fictional appointment and can be reset.",
    outcome: "WCAG AA is a design goal, not a certification or comprehensive conformance claim. The 4.6/5 rating and 40% missed-appointment reduction are illustrative targets, not patient evidence.",
    next: "A real product needs clinical safety review, a full accessibility audit, privacy assessment, and consented usability evaluation before any patient use.",
  },
];
