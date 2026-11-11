export type Discipline = "BJJ" | "Muay Thai" | "MMA";
export type Audience = "Adults" | "Youth 5–12";
export type ClassType = {
  id: string; name: string; discipline: Discipline; days: number[]; time: string;
  audience: Audience; level: string; description: string; trial: boolean; capacity: number;
};
export const programs: { id: Discipline; name: string; subtitle: string; description: string; note: string; art: string }[] = [
  { id: "BJJ", name: "Brazilian Jiu-Jitsu", subtitle: "Patience. Perspective. Progress.", description: "A structured path through grappling, from a first introduction to experienced practice. Explore fundamentals, advanced groups, no-gi sessions, and a dedicated youth program. This demo covers class discovery, not technique instruction.", note: "The long game · A dedicated progression pathway", art: "mat" },
  { id: "Muay Thai", name: "Muay Thai", subtitle: "Focus has a rhythm.", description: "Find your rhythm in a welcoming, coach-led setting. Foundations and all-levels groups sit alongside a dedicated competitor group and a non-contact cardio option. Choose an introduction that fits your experience.", note: "Find your pace · Foundations to experienced groups", art: "bag" },
  { id: "MMA", name: "MMA", subtitle: "One academy. A broader perspective.", description: "An integrated program bringing disciplines together in a structured academy environment. Explore fundamentals, experienced groups, and supervised open mat. Participation and readiness would be discussed with a coach at a real academy.", note: "Connected disciplines · A considered next step", art: "cage" },
];
export const classes: ClassType[] = [
  { id: "bjj-f", name: "Fundamentals", discipline: "BJJ", days: [1,3,5], time: "18:00", audience: "Adults", level: "Beginner", description: "A welcoming introduction to the academy and its learning structure.", trial: true, capacity: 5 },
  { id: "bjj-a", name: "Advanced BJJ", discipline: "BJJ", days: [2,4], time: "19:00", audience: "Adults", level: "Experienced", description: "An experienced group; a coach conversation is required before joining.", trial: false, capacity: 3 },
  { id: "bjj-n", name: "No-Gi Grappling", discipline: "BJJ", days: [6], time: "10:00", audience: "Adults", level: "All levels", description: "A no-gi program overview with coach-supported orientation.", trial: true, capacity: 2 },
  { id: "bjj-k", name: "Kids BJJ", discipline: "BJJ", days: [1,3], time: "16:30", audience: "Youth 5–12", level: "Beginner", description: "A youth group centered on cooperation, confidence, and a welcoming routine.", trial: true, capacity: 4 },
  { id: "mt-f", name: "Foundations", discipline: "Muay Thai", days: [1,3], time: "17:00", audience: "Adults", level: "Beginner", description: "Meet the coaching team and learn how an introductory class is organized.", trial: true, capacity: 4 },
  { id: "mt-all", name: "All Levels", discipline: "Muay Thai", days: [2,4], time: "18:00", audience: "Adults", level: "All levels", description: "A mixed-experience group with a guided first-visit orientation.", trial: true, capacity: 3 },
  { id: "mt-team", name: "Fight Team", discipline: "Muay Thai", days: [5], time: "17:30", audience: "Adults", level: "Experienced", description: "A fictional competitor cohort; not available for trial selection.", trial: false, capacity: 0 },
  { id: "mt-cardio", name: "Cardio Kickboxing", discipline: "Muay Thai", days: [6], time: "09:00", audience: "Adults", level: "All levels", description: "An illustrative non-contact class option. No fitness outcomes are promised.", trial: true, capacity: 0 },
  { id: "mma-f", name: "MMA Fundamentals", discipline: "MMA", days: [2,4], time: "17:00", audience: "Adults", level: "Beginner", description: "A first look at the integrated program and academy expectations.", trial: true, capacity: 3 },
  { id: "mma-a", name: "Advanced MMA", discipline: "MMA", days: [1,3], time: "19:30", audience: "Adults", level: "Experienced", description: "An experienced group with coach-led readiness discussion.", trial: false, capacity: 2 },
  { id: "open", name: "Open Mat", discipline: "MMA", days: [0], time: "11:00", audience: "Adults", level: "All levels", description: "A supervised, all-discipline community session with a visitor orientation.", trial: true, capacity: 6 },
];
export const dates = [
  { value: "2026-11-02", label: "Mon, Nov 2", day: 1 }, { value: "2026-11-03", label: "Tue, Nov 3", day: 2 },
  { value: "2026-11-04", label: "Wed, Nov 4", day: 3 }, { value: "2026-11-05", label: "Thu, Nov 5", day: 4 },
  { value: "2026-11-06", label: "Fri, Nov 6", day: 5 }, { value: "2026-11-07", label: "Sat, Nov 7", day: 6 },
  { value: "2026-11-08", label: "Sun, Nov 8", day: 0 },
];
export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2,"0")}` : ""} ${hour >= 12 ? "PM" : "AM"}`;
}
export function recurringLabel(c: ClassType) {
  return `${c.days.map(d => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(" / ")} · ${formatTime(c.time)}`;
}
export const coaches = [
  { name: "Marcus Torres", role: "BJJ Program Lead", discipline: "BJJ", initials: "MT", color: "#9fa7b4", bio: "Marcus is a fictional coach persona for the BJJ program. His demo approach emphasizes a clear orientation, thoughtful grouping, and a learning path that gives newcomers room to ask questions.", detail: "Program focus: fundamentals, no-gi discovery, and individual progression conversations." },
  { name: "Sana Patel", role: "Muay Thai Program Lead", discipline: "Muay Thai", initials: "SP", color: "#b06d4d", bio: "Sana is a fictional coach persona for the Muay Thai program. Her demo approach puts a welcoming first visit and a consistent class routine at the center of the academy experience.", detail: "Program focus: foundations, all-levels discovery, and non-contact class options." },
  { name: "Jake Brennan", role: "MMA Program Lead", discipline: "MMA", initials: "JB", color: "#677787", bio: "Jake is a fictional coach persona for the integrated MMA program. His demo approach helps visitors understand which group suits their experience before making a local class selection.", detail: "Program focus: integrated program orientation and supervised open mat." },
  { name: "Adrienne Cole", role: "Youth Program Director", discipline: "Youth", initials: "AC", color: "#957d65", bio: "Adrienne is a fictional youth-program persona. Her demo approach centers on cooperation and an age-appropriate academy routine, with a guardian involved in the first-visit conversation.", detail: "Program focus: the broad 5–12 age band. Never enter a child's name or other identifying details." },
];
export const belts = [
  { name: "White", color: "#f9fafb", text: "A place to begin. Get familiar with the academy and its learning rhythm." },
  { name: "Blue", color: "#3984de", text: "Build a consistent learning foundation and explore your interests." },
  { name: "Purple", color: "#a66fe0", text: "Make connections, reflect on progress, and support the learning community." },
  { name: "Brown", color: "#ab704b", text: "Refine your understanding with individual coach feedback." },
  { name: "Black", color: "#242e3e", text: "A lifelong learning mindset, rather than a finish line." },
];
export const facilities = [
  { title: "The mat room", art: "mat", caption: "An imagined open mat room with a clean grid, wall mirrors, and generous light." },
  { title: "The MMA space", art: "cage", caption: "An illustrative padded-fence training space. Not a measured or safety-certified plan." },
  { title: "The bag area", art: "bag", caption: "A dedicated equipment zone, represented in original vector artwork." },
  { title: "Strength corner", art: "strength", caption: "A schematic equipment corner. No workouts or exercise instructions are provided." },
  { title: "The lounge", art: "lounge", caption: "An imagined place to pause, refill water, and connect with the academy community." },
  { title: "The pro shop", art: "shop", caption: "An illustrative gear display. No merchandise, checkout, or actual inventory." },
];
export type Plan = "Single Discipline" | "All Access" | "Family Plan";
export const memberships: { name: Plan; price: number; badge: string; features: string[] }[] = [
  { name: "Single Discipline", price: 129, badge: "Your starting point", features: ["One discipline of your choice", "Unlimited chosen-discipline classes", "Open mat access", "Illustrative loaner gear option"] },
  { name: "All Access", price: 169, badge: "Featured plan", features: ["All three disciplines", "Strength & conditioning area", "Illustrative 10% gear discount", "Coach discussion for team groups"] },
  { name: "Family Plan", price: 249, badge: "Built for families", features: ["Two members, any discipline", "Youth classes included", "Additional members +$59/month", "Illustrative event priority"] },
];
export const resources: Record<string, string[]> = {
  "Beginner's Guide": ["You do not need prior academy experience to explore a beginner group.", "Pick a program, review a sample session, then simulate a free trial. This is discovery only, not instruction."],
  "What to Expect": ["For an illustrative first visit: gym clothes and water; the demo assumes loaner gear.", "A real academy would explain its own policies and discuss participation with you. Nothing is booked here."],
  FAQ: ["Is this a real academy? No. All people, capacity, prices, dates, and community stories are fictional.", "Do I need an account? No. Everything is held in memory and resets on reload.", "Can I bring a child? The youth demo uses an age band and a synthetic guardian alias only."],
  "Gear Guide": ["The illustration includes gis, wraps, and gloves, but no real stock or store.", "Ask a real academy about appropriate gear; this demo gives no equipment safety guidance."],
  "Belt Requirements": ["Belt colors are an illustrative BJJ learning pathway, not a rank awarded to anyone.", "No promotion timelines, student counts, certifications, or rank guarantees are represented."],
  "Private Lessons": ["Private lessons are an illustrative inquiry topic, not a bookable service.", "Explore a group trial in this demo instead; no inquiry is sent."],
  "Competition Team": ["Experienced cohorts appear in the sample schedule but are not eligible for beginner trials.", "No real fighters, competition records, endorsements, or results are claimed."],
  "Academy Notes": ["A first visit, without the pressure: choose an introductory group and leave room for questions.", "Community before competition: our fictional academy story is built around welcome, routine, and individual learning."],
  "Community Open House": ["Illustrative community gathering · Sunday, November 8, 2026, noon–1 PM, America/New_York.", "A fictional tour and conversation after open mat. No attendance list, registration, or real event."],
  "Contact & Location": ["Fictional location: 1840 South Blvd, Charlotte, NC 28203. The displayed map is schematic, not navigation.", "Brief-supplied placeholder: (704) 555-0318 · info@ironpathacademy.com. Neither is linked or used.", "Illustrative hours: Mon–Fri 5 AM–9 PM; Sat 8 AM–2 PM; Sun 10 AM–1 PM. No actual opening-hours claim."],
  "Social Channels": ["Instagram · YouTube · Facebook · TikTok are brief-requested channel concepts only.", "No real accounts are linked or endorsed. Explore the local Academy Notes instead."],
};
