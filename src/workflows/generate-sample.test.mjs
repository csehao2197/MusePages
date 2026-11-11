import test from "node:test";
import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { generateSample } from "./generate-sample.mjs";
import { renderPromptPage } from "./render-prompt-page.mjs";
import { publishSite, syncDeployConfig } from "./deploy-site.mjs";

async function sampleWorkspace() {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-sample-"));
  const assets = path.join(workspace, "src", "gallery");
  const input = path.join(workspace, "data", "prompts", "001-destination-guide");
  await mkdir(assets, { recursive: true });
  await mkdir(input, { recursive: true });
  for (const name of ["index.html", "sample-destination.html"]) {
    await copyFile(new URL(`../gallery/${name}`, import.meta.url), path.join(assets, name));
  }
  await copyFile(new URL("../../data/prompts/001-destination-guide/001-destination-guide.md", import.meta.url),
    path.join(input, "001-destination-guide.md"));
  return workspace;
}

async function selectSample(workspace) {
  const file = path.join(workspace, "deploy", "config.json");
  const config = JSON.parse(await readFile(file, "utf8"));
  config.pages[0].enabled = true;
  config.pages[0].title = "Tokyo destination guide";
  await writeFile(file, JSON.stringify(config));
  await publishSite(workspace);
}

test("generates a linked gallery, nested sample, and plain-text prompt page", async () => {
  const workspace = await sampleWorkspace();
  const output = path.join(workspace, "deploy", "MusePages");
  try {
    await generateSample(workspace);
    const config = JSON.parse(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"));
    assert.equal(config.pages.length, 1);
    assert.equal(config.pages[0].enabled, false);
    await selectSample(workspace);
    const gallery = await readFile(path.join(output, "index.html"), "utf8");
    const page = path.join(output, "pages", "destination-guide", "unspecified");
    assert.match(gallery, /href="pages\/destination-guide\/unspecified\/index\.html"/);
    assert.match(gallery, /<img src="pages\/destination-guide\/unspecified\/preview\.png"/);
    assert.doesNotMatch(gallery, /<iframe/);
    assert.match(gallery, /class="prompt" href="pages\/destination-guide\/unspecified\/prompt\.html"/);
    assert.doesNotMatch(gallery, /href="[^"]+\.md"/);
    const screenshot = await readFile(path.join(page, "preview.png"));
    assert.equal(screenshot.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.match(await readFile(path.join(page, "index.html"), "utf8"), /href="\.\.\/\.\.\/\.\.\/index\.html"/);
    const source = new URL("../../data/prompts/001-destination-guide/001-destination-guide.md", import.meta.url);
    const prompt = await readFile(source, "utf8");
    assert.equal(
      await readFile(path.join(page, "prompt.html"), "utf8"),
      renderPromptPage(prompt, "Tokyo destination guide", "../../../index.html"),
    );
    await writeFile(path.join(output, "index.html"), "preserve existing gallery");
    await writeFile(path.join(output, "unrelated.txt"), "preserve");
    await generateSample(workspace);
    assert.equal(await readFile(path.join(output, "index.html"), "utf8"), "preserve existing gallery");
    assert.equal(await readFile(path.join(output, "unrelated.txt"), "utf8"), "preserve");
    await publishSite(workspace);
    assert.equal(await readFile(path.join(output, "index.html"), "utf8"), gallery);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

function createStaticServer(output) {
  return http.createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname.endsWith("/")) {
      response.setHeader("Content-Type", "text/html");
      response.end("<h1>Directory listing</h1>");
      return;
    }
    try {
      const contents = await readFile(path.join(output, pathname));
      response.setHeader("Content-Type", pathname.endsWith(".html") ? "text/html"
        : pathname.endsWith(".png") ? "image/png" : "text/plain");
      response.end(contents);
    } catch {
      response.statusCode = 404;
      response.end("Not found");
    }
  });
}

test("page and return links work when the host lists directories instead of serving index.html", async () => {
  const workspace = await sampleWorkspace();
  const output = path.join(workspace, "deploy", "MusePages");
  const server = createStaticServer(output);
  let browser;
  try {
    await generateSample(workspace);
    await selectSample(workspace);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    for (const link of [".preview", ".details h3 a", ".open"]) {
      await page.goto(`${base}/index.html`);
      await page.locator(link).click();
      await page.waitForURL(`${base}/pages/destination-guide/unspecified/index.html`);
      assert.equal(await page.locator("h1").innerText(), "Tokyo.");
      await page.getByRole("link", { name: "Wanderly." }).click();
      assert.equal(await page.locator("h1").innerText(), "Tokyo.");
      await page.getByRole("link", { name: "Back to MusePages" }).click();
      await page.waitForURL(`${base}/index.html`);
      assert.equal(await page.title(), "MusePages | A little inspiration, beautifully generated");
    }
    await page.locator(".open").click();
    await page.getByRole("link", { name: "MusePages", exact: false }).first().click();
    await page.waitForURL(`${base}/index.html`);
    await page.locator(".brand").click();
    assert.equal(await page.title(), "MusePages | A little inspiration, beautifully generated");
    await page.locator(".prompt").click();
    await page.waitForURL(`${base}/pages/destination-guide/unspecified/prompt.html`);
    const prompt = await readFile(new URL("../../data/prompts/001-destination-guide/001-destination-guide.md", import.meta.url), "utf8");
    assert.equal(await page.locator("pre code").textContent(), prompt.replace(/\r\n?/g, "\n"));
    await page.getByRole("link", { name: "Back to MusePages" }).click();
    await page.waitForURL(`${base}/index.html`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await rm(workspace, { recursive: true, force: true });
  }
});

test("prompt codebox preserves text, escapes markup, and fits desktop and mobile", async () => {
  const prompt = "# Prompt\n中文 & \"quotes\" 'text'\n</code></pre><script>window.injected = true</script>\n" + "long-content-".repeat(200);
  const title = '<img src="invalid" onerror="window.injected = true">';
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 800 });
      await page.setContent(renderPromptPage(prompt, title, "../../../index.html"));
      assert.equal(await page.locator("pre code").textContent(), prompt);
      assert.equal(await page.locator("h1").textContent(), title);
      assert.equal(await page.locator("pre code > *").count(), 0);
      assert.equal(await page.evaluate(() => "injected" in window), false);
      assert.equal(await page.locator("a").getAttribute("href"), "../../../index.html");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      await page.getByRole("region", { name: "Prompt text" }).focus();
      assert.equal(await page.locator("pre").evaluate((element) => element === document.activeElement), true);
    }
  } finally {
    await browser.close();
  }
});

test("four selected prompt pages show original text and return to the collection", async () => {
  const workspace = await sampleWorkspace();
  const names = ["001-destination-guide", "002-eco-tourism-landing-page", "003-flight-search-and-booking-page", "004-group-travel-booking"];
  for (const name of names) {
    const input = path.join(workspace, "data", "prompts", name);
    const output = path.join(workspace, "out", "pages", name, "unspecified");
    await mkdir(input, { recursive: true });
    await mkdir(output, { recursive: true });
    await copyFile(new URL(`../../data/prompts/${name}/${name}.md`, import.meta.url), path.join(input, `${name}.md`));
    await writeFile(path.join(output, "index.html"), "<h1>Static result</h1>");
  }
  const config = await syncDeployConfig(workspace);
  config.pages.forEach((entry) => { entry.enabled = true; });
  await writeFile(path.join(workspace, "deploy", "config.json"), JSON.stringify(config));
  await publishSite(workspace);
  const server = createStaticServer(path.join(workspace, "deploy", "MusePages"));
  let browser;
  try {
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`${base}/index.html`);
    const prompts = await page.locator(".prompt").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert.equal(prompts.length, 4);
    for (const href of prompts) {
      assert.ok(href.endsWith("/prompt.html"));
      const folder = config.pages.find((entry) => entry.slug === href.split("/")[1]).prompt;
      const prompt = await readFile(new URL(`../../data/prompts/${folder}/${folder}.md`, import.meta.url), "utf8");
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`${base}/index.html`);
        await page.locator(`a.prompt[href="${href}"]`).click();
        await page.waitForURL(`${base}/${href}`);
        assert.equal(await page.locator("pre code").textContent(), prompt.replace(/\r\n?/g, "\n"));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
        assert.equal(await page.locator("pre").evaluate((element) => element.scrollHeight > element.clientHeight), true);
        await page.getByRole("link", { name: "Back to MusePages" }).click();
        await page.waitForURL(`${base}/index.html`);
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await rm(workspace, { recursive: true, force: true });
  }
});
