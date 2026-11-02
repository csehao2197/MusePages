export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type ClassType = "CrossFit" | "Iron Foundations" | "Open Gym";
export type Coach = { name: string; short: string; role: string; credentials: string; bio: string; color: string };
export type Session = { id: string; day: Day; date: string; time: string; type: ClassType; coach: string; capacity: number; duration: number };
export type Plan = { name: "Drop-In" | "Unlimited" | "Competitor"; price: number; unit: string; features: string[] };

export const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const dates: Record<Day, string> = { Mon: "2026-11-02", Tue: "2026-11-03", Wed: "2026-11-04", Thu: "2026-11-05", Fri: "2026-11-06", Sat: "2026-11-07", Sun: "2026-11-08" };
export const coaches: Coach[] = [
  { name: "Mike Torres", short: "Mike", role: "Head Coach & Owner", credentials: "CF-L4 · 12 years coaching", bio: "A patient teacher with a technical eye. Leads our foundations sessions and the morning crew. Source backstory: former Marine and three-time Regionals competitor.", color: "#d19773" },
  { name: "Priya Sharma", short: "Priya", role: "Coach · Lifting & mobility", credentials: "CF-L2 · USAW Sports Performance", bio: "Breaks complex movements into approachable steps. Her fictional specialties are Olympic lifting and mobility.", color: "#bf7758" },
  { name: "Sarah Kim", short: "Sarah", role: "Coach · Gymnastics skills", credentials: "CF-L2 · NASM-CPT", bio: "Brings curiosity to every skill session. Source backstory: former D1 gymnast who leads gymnastics workshops.", color: "#e9ad82" },
  { name: "Alex Rivera", short: "Alex", role: "Coach · Beginner on-ramp", credentials: "CF-L2 · Precision Nutrition L1", bio: "Helps newcomers find their rhythm. The source describes nutrition coaching; this demo offers no nutrition or personalized health advice.", color: "#ae795f" },
];

const weekdaySlots: Array<[string, ClassType, string, number]> = [
  ["5:30 AM", "CrossFit", "Mike", 6], ["6:30 AM", "CrossFit", "Priya", 0],
  ["9:00 AM", "CrossFit", "Sarah", 12], ["10:00 AM", "Iron Foundations", "Mike", 4],
  ["12:00 PM", "CrossFit", "Alex", 8], ["4:30 PM", "Open Gym", "Self-directed", 16],
  ["5:30 PM", "CrossFit", "Priya", 3], ["6:30 PM", "CrossFit", "Sarah", 0],
];
export const sessions: Session[] = days.flatMap(day => {
  const slots: Array<[string, ClassType, string, number]> = day === "Sat"
    ? [["8:00 AM", "CrossFit", "Mike", 7], ["9:00 AM", "Iron Foundations", "Alex", 2], ["10:00 AM", "Open Gym", "Self-directed", 10]]
    : day === "Sun" ? [["9:00 AM", "Open Gym", "Self-directed", 8], ["10:00 AM", "Open Gym", "Self-directed", 0]] : weekdaySlots;
  return slots.map(([time, type, coach, capacity], index) => ({ id: `${day}-${index}`, day, date: dates[day], time, type, coach, capacity, duration: 60 }));
});
export const programs = [
  { name: "CrossFit", badge: "The everyday crew", number: "01", description: "Coach-led, whiteboard-briefed group classes. A 60-minute space for warm-up, skills, adaptable practice and cool-down.", details: "A coach introduces the session and discusses options before practice. This is a fictional class format, not a workout prescription. Choose a suitable session with a qualified professional.", art: "class" },
  { name: "Iron Foundations", badge: "Start here", number: "02", description: "A four-week introduction to the basics, with time to ask questions and personal coaching. No experience needed.", details: "The sample on-ramp meets weekly for four weeks. Explore equipment, class etiquette and movement concepts at a comfortable pace. Start with a free intro preview; no assessment or health information is collected here.", art: "foundations" },
  { name: "Open Gym & Competitors", badge: "Find your next chapter", number: "03", description: "Space for experienced members, plus fictional specialty sessions in lifting and gymnastics. Your goals, your pace.", details: "Open Gym is self-directed and not a coached intro. The Competitor plan includes a fictional programming track, monthly coaching and booking priority. All availability and qualifications are demo fixtures, not verified services.", art: "open" },
] as const;
export const plans: Plan[] = [
  { name: "Drop-In", price: 25, unit: "class", features: ["Single coached class", "No recurring commitment", "For visiting athletes"] },
  { name: "Unlimited", price: 185, unit: "month", features: ["Unlimited group classes", "Open gym access", "Foundations on-ramp included", "Community events", "Mock Wodify tracking concept"] },
  { name: "Competitor", price: 225, unit: "month", features: ["Everything in Unlimited", "Competitor programming concept", "Monthly 1-on-1 coaching", "Video analysis concept", "Priority booking concept"] },
];
export function money(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, minimumFractionDigits: rounded % 1 ? 2 : 0 });
}
export function dateLabel(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }
export const faqs = [
  ["Do I need experience?", "No. In this fictional gym, Iron Foundations is the four-week newcomer pathway. An intro is a conversation and orientation, not a test of fitness."],
  ["What happens in a free intro?", "Meet a coach, tour the space and discuss the class format. This site only previews a request; it never books a real appointment or collects health information."],
  ["Can I visit for one class?", "The fictional Drop-In is $25 per class. Select a coached class and preview the total. No payment is accepted and no place is held."],
  ["How does annual pricing work?", "Annual plans save 15% against twelve monthly payments. Unlimited is $1,887/year; Competitor is $2,295/year. These are fictional estimates, not offers."],
  ["What if a class is full?", "Use the waitlist preview. It does not reserve space or promise a notification. Resetting the preview clears your entries."],
  ["Is this an affiliated CrossFit gym?", "No. Iron Tide is a fictional design concept, not a verified business or CrossFit LLC affiliate. CrossFit is referenced to follow the source brief; no endorsement is implied."],
] as const;
