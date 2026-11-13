import { test } from "node:test";
import assert from "node:assert/strict";
import sheet from "./assets/cheatsheet.json" with { type: "json" };
import { validate, filterSections, copyText, entryForHash, subscriptionDraft } from "./assets/engine.js";
test("snapshot validates unique mappings and official sources", () => {
  assert.equal(validate(sheet), sheet);
  const duplicate = structuredClone(sheet); duplicate.sections[1].items[0].id = duplicate.sections[0].items[0].id;
  assert.throws(() => validate(duplicate));
  const external = structuredClone(sheet); external.sections[0].items[0].source = "https://example.com/docs/en/page";
  assert.throws(() => validate(external));
});
test("search combines literal terms across examples, explanations and sections", () => {
  assert.equal(filterSections(sheet).flatMap((group) => group.items).length, 32);
  assert.equal(filterSections(sheet, { query: "NON-INTERACTIVE -p" })[0].items[0].id, "print-mode");
  assert.equal(filterSections(sheet, { query: "[" }).length, 0);
  assert.equal(filterSections(sheet, { query: "ｃｏｎｆｉｇ" }).length, filterSections(sheet, { query: "config" }).length);
  assert.equal(filterSections(sheet, { query: "trace response", section: "workflows-tips" })[0].items[0].id, "trace-request");
});
test("category and saved filters intersect and empty selections stay empty", () => {
  const saved = new Set(["help", "interrupt"]);
  assert.equal(filterSections(sheet, { savedOnly: true, saved }).flatMap((group) => group.items).length, 2);
  assert.equal(filterSections(sheet, { savedOnly: true, saved, section: "slash-commands" })[0].items.length, 1);
  assert.equal(filterSections(sheet, { savedOnly: true, saved, query: "unmatchable" }).length, 0);
  assert.equal(filterSections(sheet, { section: "unknown" }).length, 0);
});
test("deep links decode known IDs only and copy preserves the actual example", () => {
  assert.equal(entryForHash(sheet, "#%68elp").item.id, "help");
  assert.equal(entryForHash(sheet, "#%zz"), null);
  assert.equal(entryForHash(sheet, "#<script>"), null);
  const recipe = sheet.sections[2].items[0];
  assert.equal(copyText(recipe), recipe.example);
  assert.equal(copyText(sheet.sections[0].items[0]), "Ctrl+C");
});
test("signup is an explicit unsent draft and refuses invalid or non-consenting inputs", () => {
  assert.ok(subscriptionDraft(" reader@example.com ", true).includes("Email: reader@example.com\n"));
  assert.ok(subscriptionDraft("reader@example.com", true).includes("NOT SENT"));
  for (const email of ["bad", "x@@example.com", "x@example..com", "x\n@example.com", "<x>@example.com"]) assert.throws(() => subscriptionDraft(email, true));
  assert.throws(() => subscriptionDraft("reader@example.com", false));
});
