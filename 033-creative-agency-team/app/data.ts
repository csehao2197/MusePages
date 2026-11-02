export type Department = "Design" | "Engineering" | "Strategy" | "Operations";
export type Person = { name: string; role: string; department: Department; fact: string; bio: string; color: string; index: number; social: string[] };
const rows: [string, string, Department, string][] = [
  ["Rachel Kim", "CEO & Co-Founder", "Operations", "Believes every pixel should have a purpose"],
  ["Marcus Chen", "CTO & Co-Founder", "Engineering", "An open-source advocate with a very full sketchbook"],
  ["Priya Sharma", "Creative Director", "Design", "Obsessed with motion and micro-interactions"],
  ["David Okafor", "Head of Strategy", "Strategy", "Turns business problems into design opportunities"],
  ["Sofia Reyes", "Senior Designer", "Design", "Can identify any typeface in under 3 seconds"],
  ["James Wright", "Frontend Engineer", "Engineering", "Built his first website at age 11"],
  ["Aiko Tanaka", "Motion Designer", "Design", "Collects vintage synthesizers"],
  ["Liam O’Brien", "Backend Engineer", "Engineering", "The studio’s resident chess champion"],
  ["Nina Petrova", "UX Researcher", "Design", "Always has one more question"],
  ["Carlos Mendez", "Project Manager", "Operations", "Fluent in 4 languages"],
  ["Zara Ahmed", "Brand Strategist", "Strategy", "Finds brand stories in unexpected places"],
  ["Tom Fischer", "DevOps Engineer", "Engineering", "Bakes sourdough while builds are running"],
  ["Eden Brooks", "Product Designer", "Design", "Sketches every café they visit"],
  ["Noor Ali", "Visual Designer", "Design", "A color palette for every playlist"],
  ["Mateo Silva", "Design Engineer", "Engineering", "Makes tiny games for friends"],
  ["Imani Cole", "Content Strategist", "Strategy", "Collects beautiful first sentences"],
  ["Theo Park", "Frontend Engineer", "Engineering", "Grows a balcony jungle"],
  ["Ruby Shaw", "Brand Designer", "Design", "Carves her own printmaking stamps"],
  ["Alex Rivera", "Studio Producer", "Operations", "Knows everyone’s coffee order"],
  ["Leila Hassan", "Research Strategist", "Strategy", "Draws maps of imaginary cities"],
  ["Oliver Reed", "Full-Stack Engineer", "Engineering", "Can juggle three oranges"],
  ["Mei Lin", "Interaction Designer", "Design", "Builds elaborate marble runs"],
  ["Sam Bell", "Platform Engineer", "Engineering", "Keeps a notebook of bird sightings"],
  ["Amara Jones", "Illustrator", "Design", "Paints murals in miniature"],
  ["Hugo Costa", "Backend Engineer", "Engineering", "Makes a legendary Sunday pasta"],
  ["Freya Lund", "People Coordinator", "Operations", "Organizes the studio book swap"],
  ["Ben Ito", "Quality Engineer", "Engineering", "Solves a puzzle before breakfast"],
  ["Ada Novak", "Accessibility Engineer", "Engineering", "Plays accordion after hours"],
  ["Omar Saleh", "Experience Strategist", "Strategy", "Sees a story in every street sign"],
  ["Chloe Martin", "Digital Designer", "Design", "Collects mismatched ceramic cups"],
  ["Kai Morgan", "Creative Developer", "Engineering", "Turns field recordings into music"],
  ["Dani Cruz", "Studio Coordinator", "Operations", "Always planning the next potluck"]
];
const colors = ["#edb5c1", "#b9c9ae", "#c5b4df", "#e7b075", "#e9c765", "#a9c8d6", "#c9bea4", "#e8a68f"];
export const people: Person[] = rows.map(([name, role, department, fact], index) => ({
  name, role, department, fact, index, color: colors[index % colors.length],
  bio: `${name.split(" ")[0]} brings curiosity and care to our ${department.toLowerCase()} practice. In this fictional studio, they collaborate across disciplines, make space for the quieter ideas, and believe the best work starts with a good question. Away from the desk? ${fact.charAt(0).toLowerCase() + fact.slice(1)}.`,
  social: index === 1 ? ["LinkedIn", "GitHub"] : index === 2 ? ["LinkedIn", "Dribbble"] : ["LinkedIn", "Twitter"]
}));
export type Job = { title: string; department: Department; location: string; type: string; detail: string };
export const jobs: Job[] = [
  { title: "Senior Product Designer", department: "Design", location: "Remote · US / EU", type: "Full-time", detail: "Shape thoughtful product experiences, from early research to the last interaction. Partner with a small engineering team and give generous design feedback." },
  { title: "Full-Stack Engineer (Next.js)", department: "Engineering", location: "Remote", type: "Full-time", detail: "Build accessible, resilient web experiences with Next.js and TypeScript. Help turn ambitious ideas into useful, maintainable products." },
  { title: "Content Strategist", department: "Strategy", location: "Remote · US", type: "Full-time", detail: "Find the human story, map clear content journeys, and help teams communicate with warmth and purpose." },
  { title: "Design Intern — Summer 2026", department: "Design", location: "New York or Remote", type: "Internship", detail: "An archival fictional summer role, not a current opening. Explore visual ideas with a mentor and practice sharing your creative process." }
];
export const scenes = [
  { title: "A little fresh air, a lot of ideas", tag: "THE QUARTERLY RESET", color: "#b9c9ae", kind: "retreat" },
  { title: "Room for the unexpected", tag: "STUDIO DAYS", color: "#e5bd93", kind: "studio" },
  { title: "No bad ideas (just more sticky notes)", tag: "MAKING TOGETHER", color: "#c5b4df", kind: "workshop" },
  { title: "The best ideas start around a table", tag: "AFTER HOURS", color: "#e5b3b0", kind: "dinner" }
];
