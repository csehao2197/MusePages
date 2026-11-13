import assert from "node:assert/strict";
import test from "node:test";
import { extractPrompts, isRequirement, normalize, pendingWebsitePages, websiteUrls } from "./download-prompts.mjs";

const decode = (value) => value.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

test("extracts complete clipboard text, preserving line breaks and literal markup", () => {
  const html = `<button data-prompt="Build &quot;A&amp;B&quot;.\nUse &lt;main&gt;." data-prompt-title="A&amp;B">Copy</button>
    <pre><code>A truncated teaser</code></pre>
    <button data-prompt="Build &quot;A&amp;B&quot;.\nUse &lt;main&gt;.">Copy again</button>`;
  assert.deepEqual(extractPrompts(html, decode), [{ title: "A&B", text: 'Build "A&B".\nUse <main>.' }]);
});

test("retains multiple distinct hub prompts and ignores unrelated pre blocks", () => {
  assert.equal(extractPrompts('<button data-prompt="Build a site"></button><button data-prompt="Build an app"></button>', decode).length, 2);
  assert.deepEqual(extractPrompts("<pre>CSS example</pre>", decode), []);
  assert.deepEqual(extractPrompts('<body data-route-type="prompt"><pre><code>Use &lt;main&gt;.</code></pre>', decode), [{ text: "Use <main>." }]);
});

test("discovers requirement and prompt files without collecting general guides or agent skills", () => {
  for (const file of ["PRD.md", "docs/product-requirements.md", "SPEC.md", "specs/features/account.md",
    ".github/prompts/checkout.prompt.md", "ROADMAP.md", "todo.md", "legacy/input.txt",
    "docs/custom-orders-plan.md", ".omo/plans/user-logs-charts.md"]) {
    assert.ok(isRequirement(file, ["legacy/input.txt"]), file);
  }
  for (const file of ["README.md", "CONTRIBUTING.md", ".agents/skills/design/SKILL.md", "node_modules/spec.js", "DEPLOYMENT_GUIDE.md",
    "backend/requirements.txt", "scripts/requirements-images.txt", ".agents/skills/design/references/component-specs.md",
    "docs/plans/README.md", ".specstory/history/session-spec.md"]) {
    assert.equal(isRequirement(file), false, file);
  }
});

test("deduplicates sitemap locations and keeps canonical English source pages", () => {
  assert.deepEqual(websiteUrls("<loc>https://websiteprompts.com/design/art-deco/</loc>"
    + "<loc>https://websiteprompts.com/design/art-deco/</loc>"
    + "<loc>https://websiteprompts.com/es/prompts/a/b/</loc><loc>https://other.example/x</loc>"),
  ["https://websiteprompts.com/design/art-deco/"]);
  assert.equal(normalize("\uFEFFhello\r\nworld\r\n"), "hello\nworld");
});

test("resumes failed or unvisited pages without recrawling successful pages", () => {
  assert.deepEqual(pendingWebsitePages(["done", "failed", "new"], [
    { url: "done", status: "downloaded" },
    { url: "failed", status: "failed" },
  ]), ["failed", "new"]);
});
