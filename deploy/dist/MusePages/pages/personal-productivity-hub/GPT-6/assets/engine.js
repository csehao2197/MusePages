export const STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];
export const clone = (value) => structuredClone(value);
export const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value;
}
export function dayOffset(date, offset) {
  if (!validDate(date)) throw new Error("Choose a valid calendar date.");
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + offset);
  return next.toISOString().slice(0, 10);
}
export function nextDue(date, frequency) {
  if (!validDate(date)) throw new Error("Choose a valid calendar date.");
  if (frequency === "weekly") return dayOffset(date, 7);
  if (frequency !== "monthly") throw new Error("This is a one-time bill.");
  const source = new Date(`${date}T00:00:00Z`), next = new Date(+source);
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const end = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  next.setUTCDate(Math.min(source.getUTCDate(), end));
  return next.toISOString().slice(0, 10);
}
export function parseMoney(value) {
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(String(value))) throw new Error("Use a positive USD amount with up to two decimals.");
  const [whole, fraction = ""] = String(value).split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (result < 1) throw new Error("Enter an amount greater than zero.");
  return result;
}
export function seed(today) {
  if (!validDate(today)) throw new Error("Invalid reference date.");
  return {
    today, balance: 264000, savings: 420000,
    paths: [
      { id: "react", name: "React foundations", category: "DEVELOPMENT", color: "lavender", units: [{ name: "Thinking in components", progress: 100 }, { name: "State & side effects", progress: 65 }, { name: "Routing & data", progress: 20 }, { name: "A small final project", progress: 0 }] },
      { id: "design", name: "Visual storytelling", category: "DESIGN", color: "peach", units: [{ name: "Finding a visual voice", progress: 100 }, { name: "Composition & rhythm", progress: 40 }, { name: "The story in the details", progress: 0 }] },
      { id: "writing", name: "The writing practice", category: "PERSONAL GROWTH", color: "mint", units: [{ name: "Noticing things", progress: 100 }, { name: "A daily page", progress: 100 }, { name: "Editing with care", progress: 50 }] },
    ],
    tasks: [
      { id: "assignment-react", name: "Build a tiny habit tracker", path: "react", due: dayOffset(today, 2), status: "IN_PROGRESS" },
      { id: "assignment-design", name: "Collect five visual references", path: "design", due: today, status: "PENDING" },
      { id: "assignment-writing", name: "Write a one-page observation", path: "writing", due: dayOffset(today, 4), status: "DONE" },
    ],
    projects: [
      { id: "project-one", name: "Personal site refresh", status: "IN_PROGRESS", note: "Make the work feel more like you." },
      { id: "project-two", name: "Wireframe review", status: "PENDING", note: "A fresh pair of eyes, before the details." },
      { id: "project-three", name: "Organize the reference shelf", status: "DONE", note: "A little less searching, a little more making." },
    ],
    bills: [
      { id: "internet", name: "Internet", cents: 5000, due: dayOffset(today, 2), frequency: "monthly", paid: false, series: "internet" },
      { id: "design-tools", name: "Design tools", cents: 2400, due: dayOffset(today, 5), frequency: "monthly", paid: false, series: "design-tools" },
      { id: "tuition", name: "Course tuition", cents: 18000, due: dayOffset(today, -1), frequency: "once", paid: false, series: "tuition" },
    ],
    invoices: [
      { id: "website", name: "Website refresh", cents: 85000, paid: 25000, client: "Oak Studio" },
      { id: "illustrations", name: "Editorial illustrations", cents: 32000, paid: 0, client: "Northline" },
    ],
    study: [{ path: "react", seconds: 3120, date: today, source: "sample" }, { path: "design", seconds: 1200, date: today, source: "sample" }, { path: "writing", seconds: 900, date: today, source: "sample" }],
    journals: [{ path: "react", date: today, text: "State finally clicked today. A tiny example helped more than another tutorial. #breakthrough" }],
    ledger: [], sequence: 0,
  };
}
export const progress = (path) => path.units.reduce((sum, unit) => sum + unit.progress, 0) / path.units.length;
export const billStatus = (bill, today) => bill.paid ? "PAID" : bill.due < today ? "OVERDUE" : "UNPAID";
export const invoiceStatus = (invoice) => invoice.paid === invoice.cents ? "PAID" : invoice.paid > 0 ? "PARTIAL" : "UNPAID";
const find = (items, id, label) => { const item = items.find((value) => value.id === id); if (!item) throw new Error(`${label} was not found.`); return item; };
export function setUnit(state, id, index, value) {
  const path = find(state.paths, id, "Learning path");
  if (!Number.isInteger(index) || !path.units[index] || !Number.isInteger(value) || value < 0 || value > 100) throw new Error("Progress must be a whole number from 0 to 100.");
  path.units[index].progress = value;
}
export function logStudy(state, id, seconds, source = "manual") {
  find(state.paths, id, "Learning path");
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 86400) throw new Error("A study session must be between one second and 24 hours.");
  if (state.study.length >= 100) throw new Error("This session has reached its 100 study-entry limit.");
  state.study.push({ path: id, seconds, date: state.today, source });
}
export function saveJournal(state, id, text) {
  find(state.paths, id, "Learning path");
  const clean = text.trim();
  if (!clean || clean.length > 1200) throw new Error("Write a reflection from 1 to 1,200 characters.");
  const current = state.journals.find((entry) => entry.path === id && entry.date === state.today);
  if (current) current.text = clean;
  else state.journals.push({ path: id, date: state.today, text: clean });
}
function ledger(state, memo, cents, kind, reference) {
  if (state.ledger.length >= 100) throw new Error("This session has reached its 100 ledger-entry limit.");
  state.balance += cents;
  state.ledger.push({ id: `entry-${++state.sequence}`, date: state.today, memo, cents, kind, reference });
}
export function payBill(state, id) {
  const bill = find(state.bills, id, "Bill");
  if (bill.paid) throw new Error("This bill is already paid.");
  if (state.balance < bill.cents) throw new Error("The demo checking balance cannot cover this bill.");
  ledger(state, bill.name, -bill.cents, "bill", bill.id);
  bill.paid = true;
}
export function prepareNext(state, id) {
  const bill = find(state.bills, id, "Bill");
  if (!bill.paid) throw new Error("Mark this bill paid before preparing its next occurrence.");
  const due = nextDue(bill.due, bill.frequency);
  if (state.bills.some((item) => item.series === bill.series && item.due === due)) throw new Error("The next occurrence already exists.");
  if (state.bills.length >= 30) throw new Error("This session has reached its 30-bill limit.");
  state.bills.push({ ...bill, id: `bill-${++state.sequence}`, due, paid: false });
}
export function receive(state, id, cents) {
  const invoice = find(state.invoices, id, "Receivable");
  if (!Number.isSafeInteger(cents) || cents < 1 || cents > invoice.cents - invoice.paid) throw new Error("Enter a positive amount no larger than the outstanding balance.");
  ledger(state, invoice.name, cents, "income", invoice.id);
  invoice.paid += cents;
}
export function setTask(state, id, status, project = false) {
  if (!STATUSES.includes(status)) throw new Error("Choose Pending, In progress or Done.");
  find(project ? state.projects : state.tasks, id, "Task").status = status;
}
export function addAssignment(state, input) {
  find(state.paths, input.path, "Learning path");
  const name = input.name.trim();
  if (name.length < 3 || name.length > 90) throw new Error("Use a task name from 3 to 90 characters.");
  if (!validDate(input.due)) throw new Error("Choose a valid calendar date.");
  if (state.tasks.length >= 20) throw new Error("This session has reached its 20-assignment limit.");
  if (state.tasks.some((task) => task.path === input.path && task.name.toLowerCase() === name.toLowerCase())) throw new Error("This learning path already has that assignment.");
  state.tasks.push({ id: `task-${++state.sequence}`, name, path: input.path, due: input.due, status: "PENDING" });
}
function named(items, name, label) {
  const matches = items.filter((item) => item.name.toLowerCase() === name.trim().toLowerCase());
  if (matches.length !== 1) throw new Error(`Use one unambiguous ${label} name from the examples.`);
  return matches[0];
}
export function command(state, input) {
  const text = input.trim();
  if (!text || text.length > 500) throw new Error("Enter a supported command of up to 500 characters.");
  const parts = text.split(/\s+and\s+/i);
  if (parts.length > 4) throw new Error("Use up to four actions in one command.");
  const next = clone(state), summary = [];
  for (const part of parts) {
    let match;
    if ((match = /^log (\d+) minutes for (.+)$/i.exec(part))) {
      const path = named(next.paths, match[2], "learning path");
      logStudy(next, path.id, Number(match[1]) * 60, "command");
      summary.push(`Logged ${Number(match[1])} minutes for ${path.name}.`);
    } else if ((match = /^set (.+) unit (\d+) to (\d+)%$/i.exec(part))) {
      const path = named(next.paths, match[1], "learning path");
      setUnit(next, path.id, Number(match[2]) - 1, Number(match[3]));
      summary.push(`Updated ${path.name}, unit ${Number(match[2])}.`);
    } else if ((match = /^pay (.+)$/i.exec(part))) {
      const bill = named(next.bills.filter((item) => !item.paid), match[1], "unpaid bill");
      payBill(next, bill.id);
      summary.push(`Recorded ${money(bill.cents)} for ${bill.name}. No money moved.`);
    } else if ((match = /^receive (\d+(?:\.\d{1,2})?) for (.+)$/i.exec(part))) {
      const invoice = named(next.invoices, match[2], "receivable"), cents = parseMoney(match[1]);
      receive(next, invoice.id, cents);
      summary.push(`Recorded ${money(cents)} for ${invoice.name}.`);
    } else if ((match = /^mark (.+) done$/i.exec(part))) {
      const task = named(next.projects, match[1], "project task");
      setTask(next, task.id, "DONE", true);
      summary.push(`Marked ${task.name} done.`);
    } else throw new Error(`Unsupported action: "${part}". Nothing was applied. Use an example below.`);
  }
  return { state: next, summary };
}
