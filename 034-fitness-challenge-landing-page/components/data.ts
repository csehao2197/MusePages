export type Level = "Beginner" | "Intermediate" | "Advanced" | "All levels";
export type Plan = "Free" | "Pro";
export type Exercise = { name: string; cue: string };
export type Workout = { day: number; title: string; minutes: number; level: Level; exercises: Exercise[] };
export type Week = { id: number; title: string; theme: string; days: Workout[] };
const movements: Record<string, string> = {
  "Squats": "Use a comfortable range; a chair can offer support.",
  "Push-ups": "A wall variation is welcome. Keep the movement controlled.",
  "Plank holds": "Try a wall or elevated surface; breathe freely.",
  "Lunges": "Use a stable support or swap for a comfortable sit-to-stand.",
  "Mountain climbers": "A standing march is a lower-impact alternative.",
  "Pike push-ups": "Swap for wall push-ups if more comfortable.",
  "Tricep dips": "Preview only; wall push-ups are a simpler alternative.",
  "Resistance band rows": "Optional band variation; inspect equipment before use.",
  "Shoulder taps": "Try the movement standing against a wall.",
  "Superman holds": "Stay within a small, comfortable range.",
  "High knees": "A relaxed standing march is an alternative.",
  "Burpees": "Skip the jump; a standing reach is an alternative.",
  "Jump squats": "Choose a regular squat or supported sit-to-stand instead.",
  "Speed skaters": "Step side to side without jumping.",
  "Boxing combos": "Keep movements easy and controlled; no contact.",
  "Dead bugs": "Move slowly in a comfortable range.",
  "Bicycle crunches": "A seated march is an alternative.",
  "Plank variations": "Use a wall or elevated surface.",
  "V-ups": "Choose a seated march for a gentler option.",
  "Hollow body holds": "A relaxed seated hold is an alternative.",
  "Bulgarian split squats": "A supported split stance is an alternative.",
  "Glute bridges": "Use a comfortable range and avoid straining.",
  "Wall sits": "Keep the bend shallow or use a chair.",
  "Calf raises": "Hold a stable support if useful.",
  "Lateral lunges": "A small side step is an alternative.",
  "Jump lunges": "Choose supported steps without a jump.",
  "Push-up jacks": "Wall push-ups are an alternative.",
  "Tuck jumps": "Choose gentle standing reaches instead.",
  "Yoga flow": "Explore only comfortable positions; no forced stretches.",
  "Foam rolling guide": "Optional equipment; skip if uncomfortable.",
  "Mobility stretches": "Gentle movement, never force a range.",
  "Breathwork session": "Breathe normally; no breath holding.",
};
const weekOne: Omit<Workout, "day">[] = [
  { title: "Full Body Fire", minutes: 28, level: "Beginner", exercises: ["Squats", "Push-ups", "Plank holds", "Lunges", "Mountain climbers"].map(exercise) },
  { title: "Upper Body Blitz", minutes: 32, level: "Intermediate", exercises: ["Pike push-ups", "Tricep dips", "Resistance band rows", "Shoulder taps", "Superman holds"].map(exercise) },
  { title: "Cardio Surge", minutes: 25, level: "All levels", exercises: ["High knees", "Burpees", "Jump squats", "Speed skaters", "Boxing combos"].map(exercise) },
  { title: "Core Crusher", minutes: 22, level: "Intermediate", exercises: ["Dead bugs", "Bicycle crunches", "Plank variations", "V-ups", "Hollow body holds"].map(exercise) },
  { title: "Lower Body Power", minutes: 30, level: "Intermediate", exercises: ["Bulgarian split squats", "Glute bridges", "Wall sits", "Calf raises", "Lateral lunges"].map(exercise) },
  { title: "HIIT Storm", minutes: 20, level: "Advanced", exercises: ["Burpees", "Jump lunges", "Push-up jacks", "Tuck jumps"].map(exercise) },
  { title: "Active Recovery", minutes: 30, level: "All levels", exercises: ["Yoga flow", "Foam rolling guide", "Mobility stretches", "Breathwork session"].map(exercise) },
];
function exercise(name: string): Exercise { return { name, cue: movements[name] }; }
export const weeks: Week[] = [
  { id: 1, title: "Find your rhythm", theme: "Start easy. Make showing up your first win.", days: weekOne.map((w, i) => ({ ...w, day: i + 1 })) },
  { id: 2, title: "Build your rhythm", theme: "Revisit the foundations at your own pace.", days: weekOne.map((w, i) => ({ ...w, title: `${w.title} · Revisit`, day: i + 8 })) },
  { id: 3, title: "Keep it going", theme: "Consistency over intensity. Rest is always an option.", days: weekOne.map((w, i) => ({ ...w, title: `${w.title} · Practice`, day: i + 15 })) },
  { id: 4, title: "Finish your way", theme: "Celebrate the routine, not a number on a scale.", days: weekOne.map((w, i) => ({ ...w, title: `${w.title} · Your pace`, day: i + 22 })) },
  { id: 5, title: "Take it forward", theme: "Reflect, recover, and choose what comes next.", days: [
    { day: 29, title: "Your Favorite Flow", minutes: 25, level: "All levels", exercises: ["Mobility stretches", "Yoga flow"].map(exercise) },
    { day: 30, title: "Reset & Reflect", minutes: 20, level: "All levels", exercises: ["Mobility stretches", "Breathwork session"].map(exercise) },
  ] },
];
export const plans: Record<Plan, { price: number; features: string[] }> = {
  Free: { price: 0, features: ["Beginner + intermediate previews", "Community concept tour", "Local completion tracker", "Flexible nutrition framework"] },
  Pro: { price: 29, features: ["Everything in Free", "Advanced workout previews", "Coach Q&A sample notes", "Small-group coaching concept", "Expanded recovery resources"] },
};
export const faqs = [
  ["Do I need any equipment?", "No equipment is required to explore this demo. Optional band and foam-roller references include alternatives. There are no exercise videos or real guided sessions."],
  ["What if I miss a day?", "There is no penalty. Rest, skip, or return when you want. The local tracker records only the days you choose; it never scores your body or health."],
  ["I'm a total beginner — is this for me?", "The preview includes beginner and lower-impact options, but it is not a personalized training program. Choose what feels comfortable, stop for pain or dizziness, and seek qualified guidance when needed."],
  ["How long are the workouts?", "The fictional schedule ranges from 20–32 minutes. These are sample durations, not a prescription. You can pause, shorten, or skip any activity."],
  ["Is there a diet plan?", "Only a general, flexible food framework: variety, regular meals, and room for foods you enjoy. No calories, macro targets, restrictions, weight tracking, or medical advice."],
  ["When does the challenge start?", "The source's April 1–30, 2026 cohort is archival. Its countdown is closed at zero. You can explore a local practice enrollment at any time; no upcoming cohort or availability is claimed."],
];
export const leaderboard = [
  { name: "FitMomJess", workouts: 30, points: 847, streak: 30 },
  { name: "IronMike_ATX", workouts: 30, points: 812, streak: 30 },
  { name: "YogaWarrior22", workouts: 29, points: 789, streak: 29 },
  { name: "SweatSquadRon", workouts: 28, points: 756, streak: 25 },
  { name: "MarcusT_Gains", workouts: 28, points: 742, streak: 28 },
];
