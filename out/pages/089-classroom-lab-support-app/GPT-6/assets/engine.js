export const KEY = "labrescue.static.v1";
export const LIMIT = 30;
export const scenarios = {
  projector: { name: "Projector · no signal", device: "Classroom projector", icon: "projector", summary: "The screen is blank. The lesson does not have to be.", steps: [
    { id: "safety", title: "Start with safety", text: "If you notice smoke, a burning smell, liquid, sparking, damaged equipment or exposed wiring, stop using the equipment, keep people away and follow your school's safety procedure. Contact qualified staff and leave suspect equipment untouched." },
    { id: "source", title: "Read the selected source", text: "Using normal on-screen menus only, compare the projector's selected input with your lesson setup. Leave cabling to qualified staff. If the setting is unfamiliar, stop and ask IT." },
    { id: "display", title: "Look at the presentation mode", text: "In the computer's normal display controls, see whether the lesson window is on the intended screen. Follow the device's user guide; leave unfamiliar settings to IT." }
  ] },
  computer: { name: "Computer · will not start", device: "Classroom computer", icon: "monitor", summary: "A quiet computer, not a cancelled class.", steps: [
    { id: "safety", title: "Start with safety", text: "If you notice smoke, a burning smell, liquid, sparking, damaged equipment or exposed wiring, stop using the equipment, keep people away and follow your school's safety procedure. Contact qualified staff and leave suspect equipment untouched." },
    { id: "status", title: "Observe the status", text: "From a safe distance, note any normal status light or screen message for IT. This guide is observational: leave power supplies, wiring, repeated restarts and internal repairs to qualified staff." },
    { id: "alternative", title: "Check the approved alternative", text: "If your school already provides a ready-to-use alternative device, follow its normal classroom procedure. Otherwise, leave the faulty computer for IT and use a device-free lesson." }
  ] },
  internet: { name: "Internet · unavailable", device: "Classroom internet connection", icon: "wifi", summary: "Connection lost. Curiosity still very much online.", steps: [
    { id: "safety", title: "Start with safety", text: "If you notice smoke, a burning smell, liquid, sparking, damaged equipment or exposed wiring, stop using the equipment, keep people away and follow your school's safety procedure. Contact qualified staff and leave suspect equipment untouched." },
    { id: "network", title: "Read the connection status", text: "Read the connection status in your device's normal settings and note the message. Leave network hardware and administrative settings to IT." },
    { id: "page", title: "Check a permitted page", text: "If school policy permits, manually try an ordinary, known educational page. Keep student information out of the check. Leave school filtering and safety controls in place." }
  ] }
};
const text = (value, min, max) => typeof value === "string" && value.trim().length >= min && value.length <= max;
const iso = (value) => typeof value === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const levels = ["Mixed class", "Primary", "Secondary", "Adult learners"];
export function report(input, id, now) {
  if (!Object.hasOwn(scenarios, input.scenario) || !text(input.device, 3, 70) || !text(input.symptom, 8, 240) || !text(input.impact, 5, 240) || !text(input.notes || "", 0, 500) || !["High", "Medium", "Low"].includes(input.urgency)) throw Error("Complete the device, symptom, lesson impact and urgency.");
  if (!/^[a-zA-Z0-9-]{1,60}$/.test(id) || !iso(now)) throw Error("Invalid case identity or time.");
  return { id, scenario: input.scenario, device: input.device.trim(), symptom: input.symptom.trim(), impact: input.impact.trim(), urgency: input.urgency, notes: (input.notes || "").trim(), status: "open", createdAt: now, updatedAt: now, checks: [], activity: null };
}
export function nextStep(record) {
  if (record.status !== "open" || record.checks.some((entry) => ["stop", "resolved"].includes(entry.outcome))) return null;
  return scenarios[record.scenario].steps[record.checks.length] || null;
}
export function recordCheck(record, stepId, outcome, now) {
  const step = nextStep(record);
  if (!step || step.id !== stepId || !(stepId === "safety" ? ["safe", "stop"] : ["still", "resolved", "stop"]).includes(outcome) || !iso(now)) throw Error("This check is not available.");
  return { ...record, updatedAt: now, checks: [...record.checks, { stepId, outcome, at: now }] };
}
export function undoCheck(record, now) {
  if (record.status !== "open" || !record.checks.length || !iso(now)) throw Error("There is no editable response.");
  return { ...record, updatedAt: now, checks: record.checks.slice(0, -1) };
}
export function activity(input, now) {
  if (!text(input.topic || "", 0, 120) || !levels.includes(input.learnerLevel) || !text(input.availableMaterials || "", 0, 180) || !iso(now)) throw Error("Check the topic, learner level and materials.");
  const topic = input.topic.trim() || "the current lesson";
  return { topic, learnerLevel: input.learnerLevel, availableMaterials: input.availableMaterials.trim(), source: "template", title: `${topic} — think, pair, share`, duration: 15, createdAt: now, instructions: [
    { title: "Recall", minutes: 3, text: `Invite learners to recall one idea or question about ${topic}. Thinking aloud is enough; paper is optional.` },
    { title: "Pair", minutes: 7, text: "In pairs, take turns explaining the idea. Each partner adds an example and asks one question. Offer a solo reflection option where needed." },
    { title: "Share", minutes: 5, text: "Invite a few learners to share one insight or open question. Close by connecting the ideas to the lesson goal." }
  ] };
}
export function saveActivity(record, input, now) {
  if (record.status !== "open") throw Error("This case is already resolved.");
  return { ...record, updatedAt: now, activity: activity(input, now) };
}
export function resolveCase(record, confirmed, now) {
  if (record.status !== "open" || confirmed !== true || !iso(now)) throw Error("Confirm the repair with your technician or school staff first.");
  return { ...record, status: "resolved", updatedAt: now };
}
export function validateCollection(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.cases) || value.cases.length > LIMIT) throw Error("Unsupported or damaged case collection.");
  const ids = new Set();
  for (const record of value.cases) {
    if (!record || ids.has(record.id) || !iso(record.updatedAt) || !["open", "resolved"].includes(record.status)) throw Error("Invalid case.");
    report(record, record.id, record.createdAt);
    ids.add(record.id);
    if (!Array.isArray(record.checks) || record.checks.length > 3) throw Error("Invalid check history.");
    let replay = { ...record, status: "open", checks: [] };
    for (const entry of record.checks) {
      if (!entry || !iso(entry.at)) throw Error("Invalid response time.");
      replay = recordCheck(replay, entry.stepId, entry.outcome, entry.at);
    }
    if (record.activity !== null) {
      const saved = record.activity;
      if (!saved || saved.source !== "template") throw Error("Unknown activity source.");
      const expected = activity(saved, saved.createdAt);
      if (saved.title !== expected.title || saved.duration !== expected.duration || JSON.stringify(saved.instructions) !== JSON.stringify(expected.instructions)) throw Error("Invalid saved activity.");
    }
  }
  return value.cases;
}
export function parseCollection(raw) {
  if (raw === null) return [];
  if (typeof raw !== "string" || raw.length > 1000000) throw Error("The stored collection cannot be read safely.");
  return validateCollection(JSON.parse(raw));
}
export function serializeCollection(cases) {
  validateCollection({ version: 1, cases });
  return JSON.stringify({ version: 1, cases });
}
