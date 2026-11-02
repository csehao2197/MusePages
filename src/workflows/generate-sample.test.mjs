import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { generateSample } from "./generate-sample.mjs";

test("generates a linked gallery, nested sample, and unchanged original prompt", async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), "musepages-sample-"));
  try {
    await generateSample(output);
    const gallery = await readFile(path.join(output, "index.html"), "utf8");
    const page = path.join(output, "pages", "001-destination-guide");
    assert.match(gallery, /href="pages\/001-destination-guide\/index\.html"/);
    assert.match(gallery, /<img src="pages\/001-destination-guide\/preview\.png"/);
    assert.doesNotMatch(gallery, /<iframe/);
    const screenshot = await readFile(path.join(page, "preview.png"));
    assert.equal(screenshot.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.match(await readFile(path.join(page, "index.html"), "utf8"), /href="\.\.\/\.\.\/index\.html"/);
    const source = new URL("../prompts/001-destination-guide/001-destination-guide.md", import.meta.url);
    assert.deepEqual(await readFile(path.join(page, "001-destination-guide.md")), await readFile(source));
    await writeFile(path.join(output, "index.html"), "stale gallery");
    await writeFile(path.join(output, "unrelated.txt"), "preserve");
    await generateSample(output);
    assert.equal(await readFile(path.join(output, "index.html"), "utf8"), gallery);
    assert.equal(await readFile(path.join(output, "unrelated.txt"), "utf8"), "preserve");
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("page and return links work when the host lists directories instead of serving index.html", async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), "musepages-links-"));
  const server = http.createServer(async (request, response) => {
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
  let browser;
  try {
    await generateSample(output);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    for (const link of [".preview", ".details h3 a", ".open"]) {
      await page.goto(`${base}/index.html`);
      await page.locator(link).click();
      await page.waitForURL(`${base}/pages/001-destination-guide/index.html`);
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
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await rm(output, { recursive: true, force: true });
  }
});
