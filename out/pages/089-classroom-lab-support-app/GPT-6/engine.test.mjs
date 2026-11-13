import test from "node:test";
import assert from "node:assert/strict";
import { scenarios, report, nextStep, recordCheck, undoCheck, activity, saveActivity, resolveCase, parseCollection, serializeCollection, validateCollection } from "./assets/engine.js";
const time = "2026-11-13T08:00:00.000Z";
const make = (scenario = "projector", id = "test-case") => report({ scenario, device: scenarios[scenario].device, symptom: "No signal visible", impact: "Cannot show lesson slides", urgency: "High", notes: "" }, id, time);
test("three authored paths enforce safety-first, order, terminal stop and teacher resolution", () => {
  for (const scenario of Object.keys(scenarios)) {
    let record = make(scenario);
    assert.equal(nextStep(record).id, "safety");
    assert.throws(() => recordCheck(record, scenarios[scenario].steps[1].id, "still", time));
    assert.throws(() => recordCheck(record, "safety", "resolved", time));
    const stopped = recordCheck(record, "safety", "stop", time);
    assert.equal(nextStep(stopped), null);
    assert.equal(stopped.status, "open");
    assert.throws(() => recordCheck(stopped, "safety", "safe", time));
    record = recordCheck(record, "safety", "safe", time);
    for (const step of scenarios[scenario].steps.slice(1)) record = recordCheck(record, step.id, "still", time);
    assert.equal(nextStep(record), null);
    assert.equal(record.checks.length, 3);
    assert.equal(record.status, "open");
    assert.throws(() => resolveCase(record, false, time));
    const done = resolveCase(record, true, time);
    assert.equal(done.status, "resolved");
    assert.throws(() => recordCheck(done, "safety", "safe", time));
    assert.throws(() => undoCheck(done, time));
    assert.throws(() => saveActivity(done, { topic: "", learnerLevel: "Primary", availableMaterials: "" }, time));
  }
});
test("working report stops checks without claiming repair, undo returns precise prior step", () => {
  let record = recordCheck(make(), "safety", "safe", time);
  record = recordCheck(record, "source", "resolved", time);
  assert.equal(record.status, "open");
  assert.equal(nextStep(record), null);
  assert.equal(nextStep(undoCheck(record, time)).id, "source");
  assert.throws(() => undoCheck(make(), time));
});
test("report validation bounds fields, preserves business text and separates cases", () => {
  const first = make(), second = make("internet", "second");
  assert.notEqual(first.checks, second.checks);
  assert.throws(() => report({ ...first, scenario: "__proto__" }, "x", time));
  assert.throws(() => report({ ...first, symptom: "short" }, "x", time));
  assert.throws(() => report({ ...first, urgency: "Critical" }, "x", time));
  assert.throws(() => report({ ...first, notes: "a".repeat(501) }, "x", time));
  assert.throws(() => report(first, "bad<id>", time));
});
test("deterministic activities allow minimal details and never require supplied equipment", () => {
  const result = activity({ topic: "", learnerLevel: "Mixed class", availableMaterials: "" }, time);
  assert.equal(result.topic, "the current lesson");
  assert.equal(result.source, "template");
  assert.equal(result.instructions.reduce((sum, item) => sum + item.minutes, 0), 15);
  const withEquipment = activity({ topic: "Water cycle", learnerLevel: "Primary", availableMaterials: "Projector, computer, internet" }, time);
  assert.equal(withEquipment.instructions.some((item) => /projector|computer|internet/i.test(item.text)), false);
  assert.throws(() => activity({ topic: "", learnerLevel: "Unknown", availableMaterials: "" }, time));
  assert.throws(() => activity({ topic: "x".repeat(121), learnerLevel: "Primary", availableMaterials: "" }, time));
});
test("versioned storage rejects corruption, duplicate ids, forged checks and changed template content", () => {
  const record = saveActivity(recordCheck(make(), "safety", "safe", time), { topic: "Water cycle", learnerLevel: "Primary", availableMaterials: "Paper" }, time);
  assert.deepEqual(parseCollection(serializeCollection([record])), [record]);
  assert.deepEqual(parseCollection(null), []);
  assert.throws(() => parseCollection("{broken"));
  assert.throws(() => parseCollection("x".repeat(1000001)));
  assert.throws(() => validateCollection({ version: 2, cases: [] }));
  assert.throws(() => serializeCollection([record, record]));
  assert.throws(() => serializeCollection([{ ...record, checks: [{ stepId: "source", outcome: "still", at: time }] }]));
  assert.throws(() => serializeCollection([{ ...record, updatedAt: "yesterday" }]));
  assert.throws(() => serializeCollection([{ ...record, activity: { ...record.activity, title: "Changed template" } }]));
  assert.throws(() => serializeCollection([{ ...record, activity: { ...record.activity, instructions: [{ title: "Use equipment", minutes: 15, text: "Modified." }] } }]));
  assert.throws(() => serializeCollection(Array.from({ length: 31 }, (_, index) => ({ ...record, id: `case-${index}` }))));
});
