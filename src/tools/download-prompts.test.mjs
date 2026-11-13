import assert from "node:assert/strict";
import test from "node:test";
import { extractFramerPrompts, extractPrompts, framerPromptUrls, isRequirement, normalize, pendingWebsitePages, promptBaseSlug, uniquePromptSlug, websiteUrls } from "./download-prompts.mjs";

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

test("extracts complete Framer prompt links without losing newlines, plus signs or literal entities", () => {
  const text = '# Example\n\nUse C++ and A+B.\n```html\n<main title="A&B">&amp;</main>\n```\nLiteral %20.';
  const href = `https://builder.example/#prompt=${encodeURIComponent(text)}`;
  assert.deepEqual(extractFramerPrompts(`<a href="${href}">Open</a><a href='${href}'>Again</a>`, decode), [{ text }]);
  assert.deepEqual(extractFramerPrompts('<a href="/prompts/example">Example</a>', decode), []);
  assert.throws(() => extractFramerPrompts('<a href="https://builder.example/#prompt=%XY">Broken</a>', decode), URIError);
});

test("reconciles Framer sitemap and search-index detail pages without collecting categories or external sites", () => {
  assert.deepEqual(framerPromptUrls(
    "<loc>https://websiteprompts.ai/prompts/one/</loc><loc>https://websiteprompts.ai/prompts/category/dark</loc>",
    { "/prompts/one": {}, "/prompts/two": {}, "/blog/post": {}, "https://other.example/prompts/three": {} },
  ), ["https://websiteprompts.ai/prompts/one", "https://websiteprompts.ai/prompts/two"]);
});

test("names website prompts by topic rather than source host, category or clipboard position", () => {
  assert.equal(promptBaseSlug({ source_url: "https://websiteprompts.com/prompts/agency/agency-about-page/" }, []), "agency-about-page");
  assert.equal(promptBaseSlug({ source_url: "https://websiteprompts.ai/prompts/accountant-website-prompt" }, []), "accountant");
  assert.equal(promptBaseSlug({ source_url: "https://websiteprompts.com/category/portfolio/#prompt-5", title: "3D Artist Portfolio" }, []), "3d-artist-portfolio");
  assert.equal(promptBaseSlug({ source_url: "https://websiteprompts.com/", title: "Task Dashboard" }, []), "task-dashboard");
});

test("names GitHub documents using the original project topic and document purpose", () => {
  const manifest = [{ id: 85, filename: "085-photography-portfolio\\085-photography-portfolio.md", source_url: "https://github.com/owner/project/blob/revision/SPEC.md" }];
  assert.equal(promptBaseSlug({ source_url: "https://github.com/owner/project/blob/new/docs/2026-01-27-major-redesign.md" }, manifest), "photography-portfolio-major-redesign");
  assert.equal(promptBaseSlug({ source_url: "https://github.com/owner/project/blob/new/plans/1779942743938-random-name.md" }, manifest, "# Animation & Interactivity Plan\n"), "photography-portfolio-animation-interactivity-plan");
});

test("distinguishes naming collisions by brand and reports unresolved semantic collisions", () => {
  const manifest = [{ filename: "041-yoga-studio\\041-yoga-studio.md" }];
  const source = { source_url: "https://websiteprompts.ai/prompts/yoga-studio" };
  assert.equal(uniquePromptSlug(source, manifest, 'Build a website called "Solis Studio".'), "yoga-studio-solis-studio");
  assert.throws(() => uniquePromptSlug(source, manifest, "Build a yoga website."), /semantic qualifier/);
  assert.throws(() => uniquePromptSlug(source, [...manifest, { filename: "485-yoga-studio-solis-studio\\485-yoga-studio-solis-studio.md" }], 'Build a website called "Solis Studio".'), /semantic qualifier/);
});
