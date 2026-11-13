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
  config.pages["001-destination-guide"].pages[0].enabled = true;
  config.pages["001-destination-guide"].pages[0].title = "Tokyo destination guide";
  await writeFile(file, JSON.stringify(config));
  await publishSite(workspace);
}

test("generates a linked gallery, nested sample, and plain-text prompt page", async () => {
  const workspace = await sampleWorkspace();
  const output = path.join(workspace, "deploy", "dist", "MusePages");
  try {
    await generateSample(workspace);
    const config = JSON.parse(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"));
    assert.deepEqual(Object.keys(config.pages), ["001-destination-guide"]);
    assert.equal(config.pages["001-destination-guide"].pages[0].enabled, false);
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
  const output = path.join(workspace, "deploy", "dist", "MusePages");
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

test("gallery groups models into stable, accessible carousels with synchronized links and touch controls", async () => {
  const workspace = await sampleWorkspace();
  const output = path.join(workspace, "deploy", "dist", "MusePages");
  const server = createStaticServer(output);
  let browser;
  try {
    const prompt = "001-destination-guide";
    const models = ["model-z", "model-a", "model-b", "disabled-model"];
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=", "base64");
    for (const [name, variants] of [[prompt, models], ["002-single", ["only-model"]]]) {
      const input = path.join(workspace, "data", "prompts", name);
      await mkdir(input, { recursive: true });
      await writeFile(path.join(input, `${name}.md`), "# Original prompt\n<literal text>");
      for (const model of variants) {
        const folder = path.join(workspace, "out", "pages", name, model);
        await mkdir(folder, { recursive: true });
        await writeFile(path.join(folder, "index.html"), `<h1>${model}</h1>`);
        if (model !== "model-a") await writeFile(path.join(folder, "preview.png"), png);
      }
    }
    const config = await syncDeployConfig(workspace);
    config.pages[prompt].weight = 2;
    config.pages = { "002-single": config.pages["002-single"], [prompt]: config.pages[prompt] };
    config.pages[prompt].pages.sort((a, b) => models.indexOf(a.model) - models.indexOf(b.model));
    for (const option of Object.values(config.pages).flatMap((group) => group.pages)) {
      option.enabled = option.model !== "disabled-model";
      option.title = option.model === "model-a"
        ? 'A much longer title with <literal markup> & "quotes" to test layout stability'
        : `Title for ${option.model}`;
      option.tags = [`Style for ${option.model}`];
    }
    const configPath = path.join(workspace, "deploy", "config.json");
    await writeFile(configPath, JSON.stringify(config));
    await publishSite(workspace);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ hasTouch: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const card = page.locator("[data-carousel]").first();
    const active = card.locator(".slide:not([hidden])");
    const check = async (index) => {
      const model = models[index];
      assert.equal(await active.count(), 1);
      assert.equal(await active.locator(".model").textContent(), `Model: ${model}`);
      assert.equal(await active.locator(".tag").first().textContent(), `Style for ${model}`);
      assert.equal(await active.locator("h3").textContent(), config.pages[prompt].pages[index].title);
      for (const link of [".preview", "h3 a", ".open", ".prompt"]) {
        assert.equal(await active.locator(link).getAttribute("href"),
          `pages/destination-guide/${model}/${link === ".prompt" ? "prompt" : "index"}.html`);
      }
      assert.equal(await card.locator('.dot[aria-current="true"]').getAttribute("data-index"), String(index));
      assert.equal(await card.getByRole("status").textContent(), model);
      assert.equal(await card.locator(".slide[hidden]").evaluateAll((slides) =>
        slides.every((slide) => slide.inert && getComputedStyle(slide).visibility === "hidden")), true);
      if (model === "model-a") {
        assert.equal(await active.locator("img").count(), 0);
        assert.equal(await active.locator(".preview-label").textContent(), "No preview provided");
      } else {
        assert.equal(await active.locator("img").getAttribute("src"), `pages/destination-guide/${model}/preview.png`);
        await active.locator("img").evaluate((image) => image.decode());
        assert.equal(await active.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0), true);
      }
    };
    for (const width of [1280, 800, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.mouse.move(0, 0);
      await page.goto(`${base}/index.html`);
      assert.equal(await page.title(), "MusePages - AI Prompts & Generated Websites");
      assert.equal(await page.locator('meta[name="description"]').getAttribute("content"),
        "Explore AI prompts and websites generated by different AI models. Discover creative designs, compare results, and get inspired.");
      assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), "Explore AI Prompts & Generated Websites");
      assert.equal(await page.locator("[data-carousel]").count(), 2);
      const panels = await page.locator("[data-carousel]").evaluateAll((cards) => cards.map((card) => {
        const bounds = card.getBoundingClientRect();
        return { height: bounds.height, controls: card.querySelector(".carousel-controls").getBoundingClientRect().top - bounds.top };
      }));
      assert.ok(panels.every((panel) => Math.abs(panel.height - panels[0].height) < 1),
        "short and multiline titles keep panels equal in height across rows");
      assert.ok(panels.every((panel) => Math.abs(panel.controls - panels[0].controls) < 1),
        "carousel controls align within equally sized panels");
      assert.equal(await card.getByRole("button", { name: /^Show model/ }).count(), 3);
      const dots = await card.locator(".dot").evaluateAll((buttons) => buttons.map((button) => {
        const bounds = button.getBoundingClientRect();
        return { center: bounds.x + bounds.width / 2, width: bounds.width, height: bounds.height };
      }));
      assert.ok(dots.every((dot) => dot.width >= 24 && dot.height >= 24), "dots retain usable touch targets");
      assert.ok(dots.slice(1).every((dot, index) => dot.center - dots[index].center <= 24),
        "dot centers stay compact on desktop and mobile");
      const controls = await card.locator(".carousel-controls").boundingBox();
      assert.ok(Math.abs((dots[0].center + dots.at(-1).center) / 2 - (controls.x + controls.width / 2)) < 1,
        "dots remain centered without arrow buttons");
      assert.equal(await page.getByRole("button", { name: /^(Previous|Next) model$/ }).count(), 0);
      assert.equal(await page.locator(".count").count(), 0);
      assert.doesNotMatch(await page.locator("body").innerText(), /\d+ prompts \/ \d+ pages/);
      assert.equal(await page.locator('[aria-label="Show model disabled-model"]').count(), 0);
      const single = page.locator("[data-carousel]").nth(1);
      assert.equal(await single.locator(".dot").count(), 1);
      assert.equal(await single.getByRole("button").count(), 1);
      await check(0);
      const height = (await card.boundingBox()).height;
      const firstDot = card.getByRole("button", { name: "Show model model-z", exact: true });
      await firstDot.focus();
      await card.getByRole("button", { name: "Show model model-a", exact: true }).locator("span").hover();
      await check(1);
      assert.equal(await firstDot.evaluate((button) => button === document.activeElement), true,
        "hover changes the model without moving keyboard focus");
      await card.getByRole("button", { name: "Show model model-b", exact: true }).hover();
      await check(2);
      await page.mouse.move(0, 0);
      await check(2);
      await single.locator(".dot").hover();
      await check(2);
      await firstDot.dispatchEvent("pointerenter", { pointerType: "touch" });
      await check(2);
      await firstDot.hover();
      await check(0);
      await card.getByRole("button", { name: "Show model model-a", exact: true }).click();
      await check(1);
      assert.equal((await card.boundingBox()).height, height);
      await card.getByRole("button", { name: "Show model model-b", exact: true }).click();
      await check(2);
      await page.keyboard.press("ArrowRight");
      await check(0);
      await page.keyboard.press("ArrowLeft");
      await check(2);
      await page.keyboard.press("Home");
      await check(0);
      await page.keyboard.press("ArrowRight");
      await check(1);
      assert.equal(await card.locator('.dot[aria-current="true"]').evaluate((button) => button === document.activeElement), true);
      await page.keyboard.press("End");
      await check(2);
      await page.keyboard.press("ArrowLeft");
      await check(1);
      await card.getByRole("button", { name: "Show model model-b", exact: true }).tap();
      await check(2);
      assert.equal((await card.boundingBox()).height, height);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await single.locator(".slide:not([hidden]) .model").textContent(), "Model: only-model");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.mouse.move(0, 0);
    await page.goto(`${base}/index.html`);
    const session = await context.newCDPSession(page);
    const swipe = async (dx, dy = 0) => {
      await active.locator(".preview").scrollIntoViewIfNeeded();
      const box = await active.locator(".preview").boundingBox();
      const x = box.x + box.width / 2;
      const y = box.y + box.height / 2;
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + dx, y: y + dy }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    await swipe(-85);
    await check(1);
    assert.equal(page.url(), `${base}/index.html`);
    await swipe(85);
    await check(0);
    await swipe(-10);
    await check(0);
    await swipe(0, -70);
    await check(0);
    await card.getByRole("button", { name: "Show model model-b", exact: true }).click();
    await active.locator(".open").click();
    await page.waitForURL(`${base}/pages/destination-guide/model-b/index.html`);
    assert.equal(await page.locator("h1").textContent(), "model-b");
    await page.goto(`${base}/index.html`);
    await card.getByRole("button", { name: "Show model model-a", exact: true }).click();
    await active.locator(".prompt").click();
    await page.waitForURL(`${base}/pages/destination-guide/model-a/prompt.html`);
    assert.equal(await page.locator("pre code").textContent(), "# Original prompt\n<literal text>");
    config.pages[prompt].pages[0].enabled = false;
    config.pages[prompt].pages[1].enabled = false;
    await writeFile(configPath, JSON.stringify(config));
    await publishSite(workspace);
    await page.goto(`${base}/index.html`);
    assert.equal(await card.locator(".dot").count(), 1);
    assert.equal(await active.locator(".model").textContent(), "Model: model-b");
    assert.equal(await card.getByRole("button").count(), 1);
    config.pages[prompt].pages[2].enabled = false;
    await writeFile(configPath, JSON.stringify(config));
    await publishSite(workspace);
    await page.goto(`${base}/index.html`);
    assert.equal(await page.locator("[data-carousel]").count(), 1);
    assert.equal(await page.locator('a[href*="destination-guide"]').count(), 0);
    config.pages["002-single"].pages[0].enabled = false;
    await writeFile(configPath, JSON.stringify(config));
    await publishSite(workspace);
    await page.goto(`${base}/index.html`);
    assert.equal(await page.locator("[data-carousel]").count(), 0);
    assert.equal(await page.getByText("No published pages yet.").count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await rm(workspace, { recursive: true, force: true });
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
  Object.values(config.pages).flatMap((group) => group.pages).forEach((entry) => { entry.enabled = true; });
  await writeFile(path.join(workspace, "deploy", "config.json"), JSON.stringify(config));
  await publishSite(workspace);
  const server = createStaticServer(path.join(workspace, "deploy", "dist", "MusePages"));
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
      const folder = Object.keys(config.pages).find((key) => config.pages[key].pages.some((entry) => entry.slug === href.split("/")[1]));
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
