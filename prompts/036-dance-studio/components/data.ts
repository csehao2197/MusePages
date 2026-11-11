export const styles = [
  { name: "Hip-Hop", line: "High energy. Your own groove.", levels: "Beginner to Advanced", color: "#cbbcff", pose: 0 },
  { name: "Contemporary", line: "Fluidity, emotion, possibility.", levels: "Intermediate to Advanced", color: "#ffc2b1", pose: 1 },
  { name: "Ballet", line: "Technique, grace, foundation.", levels: "Beginner to Intermediate", color: "#c6e8d4", pose: 2 },
  { name: "Salsa & Latin", line: "Partner work, rhythm, heat.", levels: "All Levels", color: "#ffc95c", pose: 3 },
  { name: "Breaking", line: "Power, creativity, flow.", levels: "Beginner to Advanced", color: "#adcff5", pose: 4 }
] as const;
export type Style = typeof styles[number]["name"];
export type Level = "Beginner" | "Intermediate" | "Advanced" | "All Levels" | "Open Level";
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const teachers = [
  { name: "Maya Chen", styles: "Hip-Hop & Breaking", color: "#cbbcff", bio: "A groove-first teaching approach, a love of musicality, and permission to make the movement your own.", note: "Fictional profile. The source’s 15-year career and Missy Elliott tour references are unverified and not endorsements." },
  { name: "Carlos Rivera", styles: "Salsa & Latin", color: "#ffc95c", bio: "Connection over perfection. Carlos makes space for solo learners and welcoming partner rotations.", note: "Fictional profile. Source championship and Havana training claims are unverified." },
  { name: "Ava Williams", styles: "Contemporary & Ballet", color: "#ffc2b1", bio: "An expressive approach to musicality and foundational technique, with room for each dancer’s voice.", note: "Fictional profile. Source Juilliard and Alvin Ailey affiliations are unverified, not endorsements." },
  { name: "Kai Nakamura", styles: "Breaking & Hip-Hop", color: "#adcff5", bio: "A curious, creative lab atmosphere. This demo describes classes, not exercise instruction or safety advice.", note: "Fictional profile. Source world-class and Red Bull BC One competition claims are unverified, not endorsements." }
] as const;
export type DanceClass = { id: string; title: string; style: Style; level: Level; teacher: number; day: number; date: string; time: string; room: string; spots: number; price: number; duration: number };
const bases: Omit<DanceClass, "id" | "day" | "date">[] = [
  { title: "Hip-Hop Foundations", style: "Hip-Hop", level: "Beginner", teacher: 0, time: "18:00", room: "Studio A", spots: 4, price: 22, duration: 60 },
  { title: "Contemporary Flow", style: "Contemporary", level: "Intermediate", teacher: 2, time: "19:15", room: "Studio B", spots: 8, price: 22, duration: 60 },
  { title: "Salsa Social", style: "Salsa & Latin", level: "All Levels", teacher: 1, time: "20:30", room: "Studio A", spots: 6, price: 22, duration: 60 },
  { title: "Breaking Lab", style: "Breaking", level: "Open Level", teacher: 3, time: "21:00", room: "Studio C", spots: 3, price: 22, duration: 60 },
  { title: "Ballet Basics", style: "Ballet", level: "Beginner", teacher: 2, time: "17:00", room: "Studio B", spots: 10, price: 22, duration: 60 }
];
export const classes: DanceClass[] = days.flatMap((_, day) => bases.map((base, index) => ({
  ...base, id: `${day}-${index}`, day, date: `2026-11-${String(day + 2).padStart(2, "0")}`,
  time: day === 5 ? ["10:00", "11:15", "12:30", "14:00", "15:00"][index] : day === 6 ? ["10:00", "11:15", "12:30", "14:00", "15:00"][index] : base.time,
  spots: day === 2 && index === 3 ? 0 : base.spots,
  level: day === 4 && index === 0 ? "Advanced" : base.level
})));
export type StudioEvent = { id: string; title: string; date: string; time: string; price: number; spots: number; label: string; description: string };
export const events: StudioEvent[] = [
  { id: "showcase", title: "Under the lights", date: "2026-11-14", time: "18:00", price: 12, spots: 18, label: "Student showcase", description: "An imagined evening celebrating creative voices across all five styles. Adult demo tickets only; no real performance scheduled." },
  { id: "social", title: "Friday, with a little salsa", date: "2026-11-20", time: "19:00", price: 8, spots: 4, label: "Community social", description: "A fictional social night for adults, solo arrivals welcome. No partner required. Availability is a fixture, not live." },
  { id: "jam", title: "Open floor / open minds", date: "2026-11-28", time: "14:00", price: 0, spots: 0, label: "Community jam", description: "A fictional all-style community gathering. Currently full in this demo; explore another event." }
];
export const plans = [
  { name: "Drop-In", price: 22, unit: "/ class", detail: "Pay as you go. No commitment.", action: "Book a Class" },
  { name: "Monthly Unlimited", price: 149, unit: "/ month", detail: "All styles. All levels. All the possibility.", action: "Start Free Trial" },
  { name: "Class Pack (10)", price: 180, unit: "/ pack", detail: "$18 / class · Valid 3 months", action: "Buy Pack" }
] as const;
export const moments = ["Showcase / under the lights", "Together in the groove", "Breaking / a still moment", "Salsa / finding connection", "Before the music starts", "The final curtain", "Community / behind the scenes", "Practice diary / two imagined moments"];
export function clock(time: string) { const [h, m] = time.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; }
