const cert = (id, name, category, level, hours, exam, price, count, icon, shape, description) => ({ id, name, category, level, hours, exam, price, count, icon, shape, description });
export const CERTIFICATIONS = [
  cert("cloud-architecture", "Cloud Architecture Professional", "cloud", 3, 80, 3, 549, 2340, "cloud", "shield", "Design and implement scalable, secure cloud infrastructure"),
  cert("data-engineering", "Data Engineering Associate", "data", 2, 50, 2, 399, 4120, "database", "hexagon", "Build and maintain data pipelines at production scale"),
  cert("cybersecurity-analyst", "Cybersecurity Analyst", "security", 2, 60, 2.5, 449, 3580, "shield-check", "octagon", "Detect, analyze, and respond to security threats"),
  cert("ai-engineer", "AI/ML Engineer Professional", "ai", 3, 100, 3.5, 599, 1890, "network", "diamond", "Deploy and optimize production machine learning systems"),
  cert("cloud-foundations", "Cloud Foundations", "cloud", 1, 25, 1, 199, 8740, "cloud", "circle", "Core concepts of cloud computing and services"),
  cert("data-analytics", "Data Analytics Fundamentals", "data", 1, 30, 1.5, 249, 6210, "chart-no-axes-combined", "circle", "SQL, data visualization, and analytical thinking"),
  cert("cloud-operations", "Cloud Operations Associate", "cloud", 2, 45, 2, 349, 2850, "server", "hexagon", "Operate resilient services and investigate infrastructure incidents"),
  cert("cloud-security", "Cloud Security Professional", "cloud", 3, 75, 3, 499, 1640, "lock", "shield", "Design least-privilege access and defensible cloud boundaries"),
  cert("data-platforms", "Data Platform Professional", "data", 3, 85, 3, 549, 1520, "database", "hexagon", "Model reliable data systems and plan warehouse workloads"),
  cert("security-foundations", "Security Foundations", "security", 1, 30, 1.5, 249, 4290, "shield-check", "circle", "Understand threats, access controls and incident response basics"),
  cert("security-operations", "Security Operations Professional", "security", 3, 80, 3, 549, 1320, "scan-line", "octagon", "Build detection workflows and coordinate incident response"),
  cert("ai-foundations", "AI Foundations", "ai", 1, 30, 1.5, 249, 3810, "brain-circuit", "diamond", "Evaluate model limitations, data quality and responsible applications"),
];
export function catalog(category = "all", query = "", expanded = false) {
  const term = query.trim().toLowerCase();
  const matches = CERTIFICATIONS.filter((item) => (category === "all" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(term));
  return { total: matches.length, items: category === "all" && !term && !expanded ? matches.slice(0, 6) : matches };
}
export function recommendation(answers) {
  if (answers.length !== 5 || !["cloud", "data", "security", "ai"].includes(answers[0]) || !["new", "some", "experienced"].includes(answers[1]) || !["3", "5", "8"].includes(answers[2]) || !["explore", "build", "lead"].includes(answers[3]) || !["gentle", "stretch"].includes(answers[4])) throw Error("Complete all five assessment choices.");
  const level = answers[1] === "new" || answers[3] === "explore" || answers[4] === "gentle" ? 1 : answers[1] === "experienced" && answers[3] === "lead" && answers[2] === "8" ? 3 : 2;
  const options = CERTIFICATIONS.filter((item) => item.category === answers[0]);
  return options.find((item) => item.level === level) ?? options.find((item) => item.level === 1);
}
export const CREDENTIALS = [
  { id: "CP-DEMO-CLOUD-001", email: "maria@example.com", name: "Maria Garcia", certification: "Cloud Architecture Professional", issued: "2026-01-15", expires: "2029-01-15" },
  { id: "CP-DEMO-DATA-002", email: "james@example.com", name: "James Taylor", certification: "Data Engineering Associate", issued: "2026-02-20", expires: "2029-02-20" },
  { id: "CP-DEMO-SECURITY-003", email: "priya@example.com", name: "Priya Kapoor", certification: "Cybersecurity Analyst", issued: "2020-03-10", expires: "2023-03-10" },
];
export function lookup(value, now = Date.now()) {
  const normalized = value.trim().toLowerCase();
  const record = CREDENTIALS.find((item) => item.id.toLowerCase() === normalized || item.email.toLowerCase() === normalized);
  if (!record) return null;
  return { ...record, status: now < Date.parse(record.issued + "T00:00:00Z") ? "not yet active" : now < Date.parse(record.expires + "T00:00:00Z") ? "active" : "expired" };
}
export const LESSONS = [
  { title: "Nodes & networks", text: "A distributed system runs on multiple computers. Messages can be delayed or lost; a timeout alone cannot prove a remote operation failed.", code: "request -> network -> remote node\nresponse may arrive late, or not at all", question: "What does a timeout prove?", options: ["The operation definitely failed", "A response did not arrive within the deadline", "The remote node is permanently offline"], answer: 1 },
  { title: "Replication basics", text: "Replication keeps copies of data on multiple nodes. It can improve availability, but replication delay means replicas may temporarily disagree.", code: "primary -> replica A\n        -> replica B (may lag)", question: "Why can two replicas return different values?", options: ["Replication may be delayed", "Replicas always contain random data", "Replicas cannot store the same key"], answer: 0 },
  { title: "Consistency models", text: "Strong consistency can make reads observe the latest completed write, at a coordination cost. Eventual consistency allows temporary differences while replicas converge.", code: "write v2 -> coordination -> read v2\nwrite v2 -> asynchronous propagation -> possible read v1", question: "Which model permits temporarily stale reads?", options: ["Strong consistency", "No model permits them", "Eventual consistency"], answer: 2 },
  { title: "Queues & delivery", text: "At-least-once delivery retries messages until acknowledged. A consumer may receive duplicates, so use an idempotency key before applying a side effect.", code: "if processed(message.id): return\napply_effect_and_record_id_atomically()", question: "What helps prevent a duplicate payment effect?", options: ["A shorter label", "An atomic idempotency check and effect", "Ignoring every retry"], answer: 1 },
  { title: "Failure boundaries", text: "A circuit breaker stops repeated calls to a failing dependency for a while. It does not repair the dependency; bounded retries and backoff reduce overload.", code: "closed -> repeated failures -> open\nopen -> timeout -> half-open probe", question: "What does an open circuit breaker do?", options: ["Rejects calls temporarily", "Guarantees the dependency is repaired", "Retries without a limit"], answer: 0 },
  { title: "Observability", text: "Metrics show trends, logs capture events, and traces follow a request across services. Correlation IDs help connect evidence without assuming one slow service is the root cause.", code: "request_id -> service A span -> service B span\ncompare latency, errors and saturation", question: "Which signal follows a request across services?", options: ["A price list", "A release name", "A distributed trace"], answer: 2 },
];
export const EXAM = [LESSONS[0], LESSONS[3], LESSONS[4]];
export function grade(questions, answers) {
  if (answers.length !== questions.length || answers.some((value, index) => !Number.isInteger(value) || value < 0 || value >= questions[index].options.length)) throw Error("Answer every question.");
  return answers.reduce((score, value, index) => score + Number(value === questions[index].answer), 0);
}
export function seatCount(value) {
  if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < 10 || Number(value) > 100000) throw Error("Choose a whole number from 10 to 100,000 seats.");
  return Number(value);
}
export function sessionCalendar(localDate, now = Date.now()) {
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(localDate)) throw Error("Choose a valid local date and time.");
  const start = new Date(localDate);
  if (!Number.isFinite(+start) || +start <= now) throw Error("Choose a future study session.");
  const parts = [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()];
  if (parts.map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0")).join("") !== localDate.replace(/\D/g, "")) throw Error("That local time does not exist. Choose another time.");
  const stamp = (value) => new Date(value).toISOString().replace(/[-:]|\.\d{3}/g, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CredPath//Local Study Preview//EN", "BEGIN:VEVENT", `UID:credpath-study-${+start}@example.invalid`, `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(+start)}`, `DTEND:${stamp(+start + 45 * 60000)}`, "SUMMARY:CredPath local study preview", "DESCRIPTION:Fictional learning preview. No notification service or real course.", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
}
