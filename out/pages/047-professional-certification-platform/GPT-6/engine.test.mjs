import test from "node:test";
import assert from "node:assert/strict";
import { catalog, recommendation, lookup, LESSONS, EXAM, grade, seatCount, sessionCalendar } from "./assets/engine.js";
test("catalog combines category and case-insensitive search, expands only the initial view", () => {
  assert.equal(catalog().items.length, 6);
  assert.equal(catalog("all", "", true).items.length, 12);
  for (const [category, count] of [["cloud", 4], ["data", 3], ["security", 3], ["ai", 2]]) assert.equal(catalog(category).total, count);
  assert.equal(catalog("all", "  FOUNDATIONS ").total, 3);
  assert.equal(catalog("data", "cloud").total, 0);
  assert.equal(catalog("all", "<script>").total, 0);
});
test("recommendation considers experience, goal, time and pace with a beginner fallback", () => {
  assert.equal(recommendation(["cloud", "experienced", "8", "lead", "stretch"]).level, 3);
  assert.equal(recommendation(["cloud", "experienced", "3", "lead", "stretch"]).level, 2);
  assert.equal(recommendation(["security", "new", "8", "lead", "stretch"]).level, 1);
  assert.equal(recommendation(["data", "some", "5", "build", "gentle"]).level, 1);
  assert.equal(recommendation(["ai", "some", "5", "build", "stretch"]).level, 1);
  assert.throws(() => recommendation(["cloud"]));
});
test("credential lookup only matches exact fixed examples and respects UTC date boundaries", () => {
  const issued = Date.parse("2026-01-15T00:00:00Z"), expires = Date.parse("2029-01-15T00:00:00Z");
  assert.equal(lookup("  MARIA@EXAMPLE.COM ", issued).status, "active");
  assert.equal(lookup("cp-demo-cloud-001", issued - 1).status, "not yet active");
  assert.equal(lookup("CP-DEMO-CLOUD-001", expires - 1).status, "active");
  assert.equal(lookup("CP-DEMO-CLOUD-001", expires).status, "expired");
  assert.equal(lookup("priya@example.com", issued).status, "expired");
  assert.equal(lookup("maria"), null); assert.equal(lookup("<img src=x>"), null);
});
test("lesson and practice grading rejects incomplete and invalid answers", () => {
  assert.equal(grade(EXAM, EXAM.map((item) => item.answer)), 3);
  assert.equal(grade(LESSONS, LESSONS.map((item) => (item.answer + 1) % 3)), 0);
  assert.throws(() => grade(EXAM, []));
  assert.throws(() => grade(EXAM, [1, 1, NaN]));
  assert.throws(() => grade(EXAM, [1, 1, 3]));
});
test("enterprise inquiries require bounded whole-seat counts", () => {
  assert.equal(seatCount("10"), 10); assert.equal(seatCount("100000"), 100000);
  for (const value of ["", "9", "10.5", "-10", "1e2", "100001", "Infinity"]) assert.throws(() => seatCount(value));
});
test("calendar export creates a future 45-minute UTC event and rejects invalid input", () => {
  const now = +new Date("2026-01-01T00:00:00Z"), value = sessionCalendar("2027-01-15T10:30", now);
  assert.match(value, /BEGIN:VCALENDAR\r\n/);
  const start = value.match(/DTSTART:(\w+)/)[1], end = value.match(/DTEND:(\w+)/)[1];
  const parse = (stamp) => Date.parse(stamp.replace(/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z$/, "$1-$2-$3T$4:$5:$6Z"));
  assert.equal(parse(end) - parse(start), 45 * 60000);
  for (const input of ["", "2020-01-01T10:00", "2027-02-30T10:00", "not-a-date"]) assert.throws(() => sessionCalendar(input, now));
});
