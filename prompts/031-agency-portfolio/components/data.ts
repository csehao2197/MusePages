export const categories = ["All", "Branding", "Web Design", "E-commerce", "Mobile Apps", "Digital Marketing", "Product Design"] as const;
export type Category = typeof categories[number];
export type Project = {
  slug: string; title: string; client: string; categories: Exclude<Category, "All">[];
  year: string; summary: string; challenge: string; approach: string; decision: string; outcome: string;
};
export const projects: Project[] = [
  {
    slug: "solaris", title: "Solaris Rebrand", client: "Solaris Energy", categories: ["Branding"], year: "2026",
    summary: "A brighter point of view for a new energy era.",
    challenge: "A fictional regional solar installer needed a clearer identity for a national audience. Its old quote journey mixed technical specifications with sales language, making the next step hard to find.",
    approach: "We imagined an identity around the everyday optimism of sunlight: a modular sun symbol, confident yellow, and plain-language explanations of the installation journey.",
    decision: "Lead with household needs, not panel specifications. A single quote pathway would replace competing calls to action; supporting proof would sit alongside each decision.",
    outcome: "The concept proposes +340% qualified leads, +127% organic traffic, and a 2.8s → 0.9s load-time target. These are illustrative scenario targets, not measured results. A real launch would require consented analytics, a baseline period, and lead-quality review."
  },
  {
    slug: "bloom", title: "Bloom E-commerce", client: "Bloom Skincare", categories: ["E-commerce", "Web Design"], year: "2026",
    summary: "Less noise. More room for a daily ritual.",
    challenge: "The imagined skincare store had too many competing product claims and no clear way to compare routines. Sensitive-skin shoppers needed clarity without medical promises.",
    approach: "A soft editorial storefront groups products by routine step, with transparent ingredient notes and calm, consistent packaging.",
    decision: "Make the routine builder optional and preserve direct product browsing. Never infer a diagnosis from a shopper’s answers.",
    outcome: "The prototype demonstrates a three-step routine and a transparent product comparison. No checkout, clinical evidence, conversion uplift, or real product efficacy is claimed."
  },
  {
    slug: "nexus", title: "Nexus Dashboard", client: "Nexus Finance", categories: ["Product Design"], year: "2026",
    summary: "Financial complexity, brought into focus.",
    challenge: "A fictional finance team needed to separate cash on hand from projected revenue. Mixing both values in a headline chart could create false confidence.",
    approach: "We developed a dark workspace with restrained data visualization, readable labels, and explicit actual-versus-forecast states.",
    decision: "Keep forecast data visually distinct and expose its assumptions before offering any export. Reduce decorative charts in favor of a concise cash summary.",
    outcome: "An original static dashboard artifact demonstrates the hierarchy. Figures are fabricated; there are no linked accounts, financial recommendations, or validated research findings."
  },
  {
    slug: "wander", title: "Wander App", client: "Wander Travel", categories: ["Mobile Apps"], year: "2025",
    summary: "Take the road a little less planned.",
    challenge: "An imagined travel app needed to support spontaneous discovery without burying practical information such as distance and accessibility.",
    approach: "A map-led interface pairs small neighborhood collections with a readable stop list. Saved itineraries would remain available offline.",
    decision: "Location access should be optional. A manually selected area would offer the same discovery tools without background tracking.",
    outcome: "The map and phone artwork explore this interaction model. Routes, travel times, accessibility details, and destinations are illustrative, not live travel guidance."
  },
  {
    slug: "crest", title: "Crest Brewing", client: "Crest Craft Beer", categories: ["Branding", "Web Design"], year: "2025",
    summary: "Made slowly. Shared generously.",
    challenge: "A fictional independent brewery wanted a recognizable shelf presence and a website that could distinguish taproom visits from wholesale enquiries.",
    approach: "Earthy inks, topographic linework, and a bold wordmark connect the packaging system to its imagined coastal setting.",
    decision: "Separate taproom hours from trade information. Keep batch notes readable rather than using the label as a purely decorative surface.",
    outcome: "The packaging and website direction form a concept identity system. There is no actual brewery, beverage sale, industry award, or verified customer response."
  },
  {
    slug: "pulse", title: "Pulse Fitness", client: "Pulse Gym", categories: ["Digital Marketing", "Web Design"], year: "2026",
    summary: "Find your rhythm. Not someone else’s.",
    challenge: "The concept gym’s acquisition pages leaned on intimidating performance claims. First-time visitors needed practical class information instead.",
    approach: "A high-energy typographic campaign pairs expressive motion marks with clear beginner class pathways.",
    decision: "Offer a class introduction before asking for a membership commitment. Replace body-transformation promises with schedule and accessibility details.",
    outcome: "Original campaign artifacts outline a testable landing-page hypothesis. No ad spend, membership lift, health outcome, or audience research has been measured."
  },
  {
    slug: "arborist", title: "Arborist", client: "Arborist Consulting", categories: ["Branding"], year: "2025",
    summary: "Rooted in better questions.",
    challenge: "An imagined sustainability consultancy needed a credible identity without suggesting environmental certifications it did not hold.",
    approach: "A precise branching mark, forest-green typography, and generous white space create a system for careful, evidence-led communication.",
    decision: "Use specific project descriptions rather than generic green claims. Reserve certification marks for independently verified credentials.",
    outcome: "The identity concept shows stationery and report covers. All environmental credentials, client relationships, and business outcomes remain unverified and are not asserted."
  },
  {
    slug: "kindred", title: "Kindred", client: "Kindred Community", categories: ["Web Design"], year: "2026",
    summary: "A little closer to your people.",
    challenge: "A fictional neighborhood platform needed to help newcomers find small local gatherings while keeping private addresses out of public listings.",
    approach: "Warm color fields and welcoming editorial cards put interest groups before follower counts. Public events would show an area, not a home address.",
    decision: "Make host moderation and reporting visible. Exact meeting details would only be shared through a consent-based RSVP flow.",
    outcome: "The concept illustrates a welcoming discovery system. No community exists here and no safety, moderation, participation, or retention claims are made."
  },
  {
    slug: "volt", title: "Volt EV", client: "Volt Motors", categories: ["E-commerce", "Branding"], year: "2026",
    summary: "An electric future, without the friction.",
    challenge: "A fictional electric vehicle brand needed to explain configuration choices without hiding running costs or presenting estimated range as a guarantee.",
    approach: "A minimal configurator direction puts a sculptural vehicle profile alongside readable specification and option summaries.",
    decision: "Show the total alongside each selection and qualify range assumptions. Keep comparison available before any reservation step.",
    outcome: "The vehicle and configurator artwork are original concepts. No real vehicle, range certification, reservation, payment, or purchasing service is available."
  },
  {
    slug: "nourish", title: "Nourish", client: "Nourish Meal Kits", categories: ["E-commerce"], year: "2025",
    summary: "Good food. A simpler kind of week.",
    challenge: "An imagined meal-kit shop needed to distinguish dietary preferences from allergen guarantees and make subscription terms understandable.",
    approach: "An editorial recipe system combines playful food illustrations with clear preparation-time, ingredient, and portion labels.",
    decision: "Allow one-off browsing before subscription selection. Allergens would have a dedicated, persistent label rather than a hidden tooltip.",
    outcome: "A fictional product-page direction demonstrates the content hierarchy. Recipes are visual concepts, not nutritional advice or verified allergen-safe products."
  },
  {
    slug: "studiox", title: "StudioX", client: "StudioX Coworking", categories: ["Web Design", "Digital Marketing"], year: "2026",
    summary: "Space for your next big thing.",
    challenge: "A fictional coworking studio needed to explain the difference between a day pass, a desk, and a private room without sending every visitor to a sales call.",
    approach: "Architectural grids, oversized type, and an availability-first booking direction organize membership information.",
    decision: "Publish plan inclusions before collecting contact details. Availability would need a real booking source before any promise could be made.",
    outcome: "The original spatial artwork and membership direction are static concepts. No office, bookable inventory, occupancy evidence, or campaign results exist."
  },
  {
    slug: "clarity", title: "Clarity", client: "Clarity Health", categories: ["Mobile Apps", "Product Design"], year: "2026",
    summary: "Small steps. A clearer picture.",
    challenge: "An imagined wellbeing journal needed to encourage reflection without implying diagnosis or turning everyday fluctuations into alarming scores.",
    approach: "Soft lavender screens combine optional check-ins with a plain-language weekly reflection. Sensitive entries would stay under the user’s control.",
    decision: "Avoid streak penalties and diagnostic scoring. Prioritize export and deletion over engagement mechanics.",
    outcome: "The app screens explore a wellbeing journal, not a medical device. No health data is collected and no clinical, wellbeing, or usability result has been validated."
  }
];
export type Service = { slug: string; title: string; description: string; deliverables: string[]; detail: string; };
export const services: Service[] = [
  { slug: "branding", title: "Brand Strategy & Identity", description: "From naming to full visual systems.", deliverables: ["Positioning & messaging", "Naming exploration", "Visual identity system", "Practical brand guidelines"], detail: "Start with what makes your organization useful, then build a coherent expression across every touchpoint. The concept scope includes discovery, two creative territories, and a documented identity system." },
  { slug: "web", title: "Web Design & Development", description: "Websites that turn attention into action.", deliverables: ["Content & information architecture", "Accessible interface design", "Responsive development", "Launch & measurement plan"], detail: "A clear story, a faster path, and a site your team can own. A proposed engagement moves from content mapping to a responsive prototype, build, accessibility review, and handover." },
  { slug: "marketing", title: "Digital Marketing", description: "Search, content, and campaigns with purpose.", deliverables: ["Search & content audit", "Campaign creative", "Landing-page experiments", "Measurement framework"], detail: "Turn a business question into a testable campaign. We would agree a baseline, a useful success measure, and a responsible measurement plan before proposing channels or paid spend." }
];
export const team = [
  { name: "Alex Rowan", role: "Creative direction", initials: "AR", bio: "Connects brand strategy with expressive identity systems. In this fictional studio, Alex facilitates discovery and steers the creative review." },
  { name: "Mika Chen", role: "Design & experience", initials: "MC", bio: "Turns complex journeys into calm, useful interfaces. Mika’s fictional role covers information architecture, prototyping, and accessibility planning." },
  { name: "Sam Ellis", role: "Technology & delivery", initials: "SE", bio: "Bridges ambitious design and maintainable delivery. Sam’s fictional remit includes performance budgets, frontend architecture, and handover." }
];
export const insights = [
  { title: "A brand is a decision-making tool", category: "Brand thinking", time: "4 min read", body: ["A visual identity is most useful when it helps a team choose. What should the homepage emphasize? Which story belongs on the packaging? A clear position gives those choices a shared reference.", "For the fictional Solaris concept, optimism became more than a yellow palette. It guided simpler language, an approachable quote pathway, and a system that puts the household before the hardware.", "A practical starting point: write down one audience need, one reason to believe, and one action each touchpoint should make easier. Test those assumptions with real people before treating them as evidence."] },
  { title: "Less dashboard. More direction.", category: "Product notes", time: "3 min read", body: ["A dashboard can have plenty of charts and still leave a user unsure what to do. Good hierarchy starts with the decision, not the available data.", "In our fictional Nexus direction, cash on hand is separated from projected revenue. That distinction matters more than adding another graph. Every forecast should explain its assumptions.", "Before designing a new metric card, ask who uses it, what action it supports, and how uncertainty will be communicated. These are design principles, not findings from a research study."] },
  { title: "The brief before the beautiful", category: "Studio practice", time: "5 min read", body: ["A useful brief describes a problem, not a predetermined page count. What is difficult today? Who experiences it? What would a better outcome look like?", "Constraints are creative material. A budget range, a realistic date, and an honest description of what is not known can prevent weeks of designing the wrong solution.", "Our local brief builder models these questions. It stores nothing and sends nothing. In a real engagement, the next step would be a conversation about scope, evidence, and responsibilities."] }
];
