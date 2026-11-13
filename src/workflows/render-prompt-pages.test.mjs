import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  loadModels, parseArguments, renderPromptPages, resolveCodex, validateStaticOutput, verifyModelService,
} from "./render-prompt-pages.mjs";

const prompt = "001-travel";
const modelId = "actual-model-id";
const secret = "synthetic-test-secret";
const model = { apiType: "openai-responses", baseUrl: "http://127.0.0.1:1/v1", modelId, directory: "model-a", apiKeyEnv: "MUSE_TEST_KEY" };
const env = { ...process.env, MUSE_TEST_KEY: secret };

async function save(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

async function fixture(t) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages generation "));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await save(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "Use responsive, accessible UI. Preserve source licenses.");
  await save(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`), "# Travel\nBuild a travel homepage.\n& echo unsafe; $(not-a-command)\n中文");
  await save(path.join(workspace, "data", "prompts", prompt, "README.md"), "# Not an original prompt");
  await save(path.join(workspace, "config.json"), { version: 1, models: { local: model } });
  const script = path.join(workspace, "mock-codex.cjs");
  await save(script, `
const fs = require("node:fs");
const mode = process.argv[2];
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  fs.writeFileSync(".invocation.json", JSON.stringify({ args: process.argv.slice(3), input, cwd: process.cwd(), home: process.env.CODEX_HOME }));
  const count = fs.existsSync(".attempt-count") ? Number(fs.readFileSync(".attempt-count")) + 1 : 1;
  fs.writeFileSync(".attempt-count", String(count));
  console.log(process.env.MUSE_TEST_KEY);
  if (mode === "empty") return;
  fs.writeFileSync("README.md", "Static travel homepage. No integration; browser-only mock interactions.");
  if (mode === "timeout") {
    fs.writeFileSync(".child-pid", String(process.pid));
    setInterval(() => {}, 100);
    return;
  }
  if (mode === "orphan") {
    const child = require("node:child_process").spawn(process.execPath, ["-e", 'require("node:fs").writeFileSync(".grandchild-ready","ready");setInterval(()=>{},100)'], { stdio: ["ignore", 1, 2] });
    child.unref();
    fs.writeFileSync(".grandchild-pid", String(child.pid));
    const waiting = setInterval(() => {
      if (fs.existsSync(".grandchild-ready")) clearInterval(waiting);
    }, 20);
    return;
  }
  if (mode === "fail" || (mode === "retry" && count === 1)) {
    fs.writeFileSync("partial.txt", "useful partial code");
    process.exitCode = 2;
    return;
  }
  if (mode === "next") {
    fs.mkdirSync("app", { recursive: true });
    fs.writeFileSync("app/page.tsx", "export default function Page(){return <h1>Travel</h1>}");
    fs.writeFileSync("package.json", JSON.stringify({ dependencies: { next: "test" } }));
    return;
  }
  fs.writeFileSync("index.html", '<!doctype html><html><head><link rel="stylesheet" href="style.css"></head><body><main>Travel<button>Explore</button></main><script src="client.js"></script></body></html>');
  fs.writeFileSync("style.css", "body{background-image:url(images/logo.svg)}");
  fs.mkdirSync("images", { recursive: true });
  fs.writeFileSync("images/logo.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="teal"/></svg>');
  fs.writeFileSync("client.js", 'document.querySelector("button").onclick=()=>alert("Travel");');
  if (mode === "bad-static") {
    fs.mkdirSync("out", { recursive: true });
    fs.writeFileSync("out/index.html", '<html><body><main>Travel</main><img src="missing.svg"></body></html>');
  }
  const model = process.argv[process.argv.indexOf("--model") + 1];
  console.log(JSON.stringify({ type: "turn.completed", model: mode === "wrong-model" ? "other-model" : model }));
});
`);
  return {
    workspace,
    output: path.join(workspace, "out", "pages", prompt, "model-a"),
    options: (mode = "success", rest = {}) => ({ env, command: { executable: process.execPath, args: [script, mode] }, timeoutMs: 10000, ...rest }),
  };
}

async function service(t, workspace, { advertised = modelId, status = 200, authenticated = true } = {}) {
  let requests = 0;
  const server = createServer((request, response) => {
    requests++;
    assert.equal(request.url, "/v1/models");
    assert.equal(request.headers.authorization, authenticated ? `Bearer ${secret}` : undefined);
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ data: [{ id: advertised }] }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const config = await readJson(path.join(workspace, "config.json"));
  config.models.local.baseUrl = `http://127.0.0.1:${server.address().port}/v1`;
  await save(path.join(workspace, "config.json"), config);
  return () => requests;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function metadata(changes = {}) {
  return { modelId, tags: [], staticDir: "out", generated: true, preview: false, config_added: false, validated: false, ...changes };
}

async function snapshot(folder) {
  const result = {};
  for (const entry of (await readdir(folder, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(folder, entry.name);
    result[entry.name] = entry.isDirectory() ? await snapshot(file) : (await readFile(file)).toString("base64");
  }
  return result;
}

test("generates through a child process with stdin, real model selection, static checks and disabled grouped registration", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  await save(path.join(f.workspace, "deploy", "dist", "MusePages", "index.html"), "existing website");
  const report = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(report.summary.generated, 1, JSON.stringify(report));
  assert.equal(report.items[0].preview, "generated");
  const preview = await readFile(path.join(f.output, "out", "preview.png"));
  assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(preview.readUInt32BE(16), 1200);
  assert.equal(preview.readUInt32BE(20), 900);
  assert.deepEqual(report.remainingMissing, []);
  const state = await readJson(path.join(f.output, "metadata.json"));
  assert.deepEqual(state, metadata({ generated: true, preview: true, validated: true, config_added: true }));
  await assert.rejects(readFile(path.join(f.output, "..", "metadata.json")), { code: "ENOENT" });
  const config = await readJson(path.join(f.workspace, "deploy", "config.json"));
  assert.equal(config.version, 2);
  assert.deepEqual(config.pages, { [prompt]: { weight: 1, pages: [{
    model: "model-a", enabled: false, deployed: false, slug: "travel", title: "travel", tags: [], staticDir: "out",
  }] } });
  const invocation = await readJson(path.join(f.output, ".invocation.json"));
  assert.equal(invocation.cwd, f.output);
  assert.equal(invocation.args.at(-1), "-");
  assert.equal(invocation.args[invocation.args.indexOf("--model") + 1], modelId);
  assert.ok(invocation.args.includes('model_provider="musepages"'));
  assert.ok(invocation.args.includes('model_providers.musepages.wire_api="responses"'));
  assert.ok(invocation.args.includes('model_providers.musepages.env_key="MUSE_TEST_KEY"'));
  assert.ok(invocation.args.includes("workspace-write"));
  assert.ok(invocation.input.includes(await readFile(path.join(f.workspace, "data", "prompts", prompt, `${prompt}.md`), "utf8")));
  assert.ok(invocation.input.includes("Use responsive, accessible UI"));
  assert.ok(!invocation.args.some((arg) => arg.includes("unsafe") || arg.includes(secret)));
  await assert.rejects(readFile(path.join(invocation.home, "config.toml")), { code: "ENOENT" });
  const logs = (await readdir(f.output)).filter((file) => file.endsWith(".log"));
  assert.equal(logs.length, 1);
  const log = await readFile(path.join(f.output, logs[0]), "utf8");
  assert.ok(log.includes("[REDACTED]"));
  assert.ok(!log.includes(secret));
  assert.deepEqual((await readdir(path.join(f.output, "out"))).sort(), ["client.js", "images", "index.html", "preview.png", "style.css"]);
  assert.equal(await readFile(path.join(f.workspace, "deploy", "dist", "MusePages", "index.html"), "utf8"), "existing website");
  assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
  assert.equal(requests(), 1);
});

test("generation works without API-key settings or environment variables", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace, { authenticated: false });
  const config = await readJson(path.join(f.workspace, "config.json"));
  delete config.models.local.apiKeyEnv;
  await save(path.join(f.workspace, "config.json"), config);
  const keylessEnv = { ...process.env };
  for (const key of ["MUSE_TEST_KEY", "MUSEPAGES_MODEL_API_KEY", "OPENAI_API_KEY", "CODEX_API_KEY"]) delete keylessEnv[key];
  const report = await renderPromptPages(f.workspace, ["local"], f.options("success", { env: keylessEnv }));
  assert.equal(report.summary.generated, 1, JSON.stringify(report));
  assert.equal(requests(), 1);
  const invocation = await readJson(path.join(f.output, ".invocation.json"));
  assert.ok(invocation.args.includes("model_providers.musepages.requires_openai_auth=false"));
  assert.ok(!invocation.args.some((arg) => arg.startsWith("model_providers.musepages.env_key=")));
});

test("completed results repair registration without a model call and preserve existing switches and order", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  await save(path.join(f.workspace, "deploy", "config.json"), "{bad JSON");
  const failed = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(failed.summary.failed, 1);
  assert.equal(failed.items[0].generated, true);
  assert.match(failed.items[0].reason, /registration failed/);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).config_added, false);
  const previewFile = path.join(f.output, "out", "preview.png");
  await rm(previewFile);
  const first = { prompt: "002-food", model: "model-b", enabled: true, deployed: false, slug: "food", title: "Food", tags: ["Keep"], staticDir: "." };
  await save(path.join(f.workspace, "deploy", "config.json"), { version: 1, pages: [first] });
  const noModel = { ...f.options(), command: { executable: "must-not-run", args: [] } };
  const repaired = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(repaired.summary.registered, 1, JSON.stringify(repaired));
  assert.equal(repaired.items[0].preview, "generated");
  const preview = await readFile(previewFile);
  const modified = (await stat(previewFile)).mtimeMs;
  const file = path.join(f.workspace, "deploy", "config.json");
  const config = await readJson(file);
  config.pages[prompt].pages[0].enabled = true;
  config.pages[prompt].pages[0].deployed = true;
  config.pages[prompt].pages[0].title = "Keep my title";
  await save(file, config);
  const skipped = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(skipped.summary.skipped, 1);
  assert.equal(skipped.items[0].preview, "preserved");
  assert.deepEqual(await readFile(previewFile), preview);
  assert.equal((await stat(previewFile)).mtimeMs, modified);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
  const { prompt: firstPrompt, ...firstOption } = first;
  assert.deepEqual(Object.keys(config.pages), [firstPrompt, prompt]);
  assert.deepEqual((await readJson(file)).pages[firstPrompt], { weight: 1, pages: [firstOption] });
  assert.deepEqual((await readJson(file)).pages[prompt], config.pages[prompt]);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
  assert.equal(requests(), 1);
  await assert.rejects(readFile(path.join(f.output, "..", "metadata.json")), { code: "ENOENT" });
});

test("changed exports and corrupt previews refresh screenshots without regenerating source or changing publication switches", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  assert.equal((await renderPromptPages(f.workspace, ["local"], f.options())).summary.generated, 1);
  const preview = path.join(f.output, "out", "preview.png");
  const original = await readFile(preview);
  const source = await readFile(path.join(f.output, "style.css"), "utf8");
  const file = path.join(f.workspace, "deploy", "config.json");
  const config = await readJson(file);
  config.pages[prompt].pages[0].enabled = true;
  config.pages[prompt].pages[0].title = "Keep my title";
  await save(file, config);
  const noModel = { ...f.options(), command: { executable: "must-not-run", args: [] } };
  await save(path.join(f.output, "out", "style.css"), "body{background:rgb(17,34,51);color:white}");
  const refreshed = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(refreshed.items[0].preview, "generated", JSON.stringify(refreshed));
  assert.notDeepEqual(await readFile(preview), original);
  assert.equal(await readFile(path.join(f.output, "style.css"), "utf8"), source);
  await writeFile(preview, "corrupt preview");
  const repaired = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(repaired.items[0].preview, "generated", JSON.stringify(repaired));
  assert.equal((await readFile(preview)).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
  const image = await readFile(preview);
  const stylesheet = path.join(f.output, "out", "style.css");
  const style = await readFile(stylesheet, "utf8");
  await save(stylesheet, 'body{background:url("missing.svg")}');
  const invalid = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(invalid.summary.pending, 1, JSON.stringify(invalid));
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, false);
  assert.deepEqual(await readFile(preview), image);
  await save(stylesheet, style);
  const recovered = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(recovered.items[0].preview, "generated", JSON.stringify(recovered));
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
  assert.deepEqual(await readJson(file), config);
  assert.equal(requests(), 1);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("legacy metadata migrates preview and removes deployed only during non-check writes", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  assert.equal((await renderPromptPages(f.workspace, ["local"], f.options())).summary.generated, 1);
  const file = path.join(f.output, "metadata.json");
  const noModel = { ...f.options(), command: { executable: "must-not-run", args: [] } };
  for (const legacy of [false, true]) {
    const state = await readJson(file);
    state.deployed = legacy;
    state.preview = false;
    if (legacy) delete state.preview;
    await save(file, state);
    const before = await snapshot(f.workspace);
    const checked = await renderPromptPages(f.workspace, ["local"], { check: true, env: {} });
    assert.equal(checked.summary.skipped, 1, JSON.stringify(checked));
    assert.deepEqual(await snapshot(f.workspace), before);
    const resumed = await renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(resumed.items[0].preview, "generated", JSON.stringify(resumed));
    assert.equal((await readJson(file)).preview, true);
    assert.equal(Object.hasOwn(await readJson(file), "deployed"), false);
  }
  assert.equal(requests(), 1);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("preview failure retains source and the old image, reports pending and resumes without another model call", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  await save(path.join(f.workspace, "deploy", "config.json"), "{bad JSON");
  const first = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(first.summary.failed, 1, JSON.stringify(first));
  const file = path.join(f.workspace, "deploy", "config.json");
  await rm(file);
  const preview = path.join(f.output, "out", "preview.png");
  const original = await readFile(preview);
  const source = await readFile(path.join(f.output, "client.js"), "utf8");
  const noModel = { ...f.options(), command: { executable: "must-not-run", args: [] } };
  await save(path.join(f.output, "out", "client.js"), 'throw new Error("Cannot render this homepage");');
  const pending = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(pending.summary.pending, 1, JSON.stringify(pending));
  assert.match(pending.items[0].reason, /preview needs preparation.*Cannot render this homepage/s);
  assert.equal(pending.items[0].generated, true);
  assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata());
  assert.deepEqual(await readFile(preview), original);
  assert.equal(await readFile(path.join(f.output, "client.js"), "utf8"), source);
  await assert.rejects(readFile(file), { code: "ENOENT" });
  assert.ok(!(await readdir(path.join(f.output, "out"))).some((name) => name.startsWith(".preview")));
  await save(path.join(f.output, "out", "client.js"), source + "\n");
  const resumed = await renderPromptPages(f.workspace, ["local"], noModel);
  assert.equal(resumed.summary.registered, 1, JSON.stringify(resumed));
  assert.equal(resumed.items[0].preview, "generated");
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).validated, true);
  assert.equal(requests(), 1);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("cancelling preview preparation releases browser and generation locks without model calls or registration", async (t) => {
  const f = await fixture(t);
  await save(path.join(f.output, "metadata.json"), metadata({ preview: true, validated: true }));
  await save(path.join(f.output, "README.md"), "Static HTML homepage.");
  const html = "<html><body><main>Travel</main><script>for (;;) {}</script></body></html>";
  await save(path.join(f.output, "index.html"), html);
  await save(path.join(f.output, "out", "index.html"), html);
  const report = await renderPromptPages(f.workspace, ["local"], {
    env: {}, command: { executable: "must-not-run", args: [] }, signal: AbortSignal.timeout(1500),
  });
  assert.equal(report.summary.pending, 1, JSON.stringify(report));
  assert.match(report.items[0].reason, /preview needs preparation/);
  assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata());
  assert.equal(await readFile(path.join(f.output, "index.html"), "utf8"), html);
  assert.deepEqual(await readdir(path.join(f.output, "out")), ["index.html"]);
  assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
  await assert.rejects(readFile(path.join(f.output, ".generation-preview.sha256")), { code: "ENOENT" });
  await assert.rejects(readFile(path.join(f.workspace, "deploy", "config.json")), { code: "ENOENT" });
});

test("read-only coverage spans explicit models and ignores validation/publication without touching files or service", async (t) => {
  const f = await fixture(t);
  const config = await readJson(path.join(f.workspace, "config.json"));
  config.models.second = { ...model, modelId: "second-id", directory: "model-b" };
  await save(path.join(f.workspace, "config.json"), config);
  await save(path.join(f.output, "metadata.json"), metadata());
  const before = await snapshot(f.workspace);
  const report = await renderPromptPages(f.workspace, ["local", "second"], { check: true, env: {} });
  assert.equal(report.summary.skipped, 1);
  assert.equal(report.summary.missing, 1);
  assert.deepEqual(report.remainingMissing, [{ prompt, model: "second" }]);
  assert.deepEqual(await snapshot(f.workspace), before);
});

test("service failures report the stage, URL and nested network causes without leaking credentials", async (t) => {
  const f = await fixture(t);
  const config = await readJson(path.join(f.workspace, "config.json"));
  config.models.local.baseUrl = "http://127.0.0.1:8000/v1";
  await save(path.join(f.workspace, "config.json"), config);
  const logs = [];
  t.mock.method(globalThis, "fetch", async () => {
    const cause = Object.assign(new Error(`connect ECONNREFUSED ${secret}`), {
      code: "ECONNREFUSED", syscall: "connect", address: "127.0.0.1", port: 8000,
    });
    throw new TypeError("fetch failed", { cause: new AggregateError([cause]) });
  });
  const report = await renderPromptPages(f.workspace, ["local"], f.options("success", { onLog: (message) => logs.push(message) }));
  assert.equal(report.summary.failed, 1);
  const reason = report.items[0].reason;
  for (const pattern of [/\[verify-model-service\]/, /GET http:\/\/127\.0\.0\.1:8000\/v1\/models/, /ECONNREFUSED/, /address=127\.0\.0\.1/, /port=8000/, /\[REDACTED\]/]) {
    assert.match(reason, pattern);
  }
  assert.ok(logs.some((message) => message.includes(`[${prompt}/local] verify-model-service:`)));
  assert.ok(logs.some((message) => message.includes("failed:") && message.includes("ECONNREFUSED")));
  assert.ok(!JSON.stringify({ report, logs }).includes(secret));
  await assert.rejects(readFile(path.join(f.output, "metadata.json")), { code: "ENOENT" });
});

test("service diagnostics distinguish HTTP errors, malformed JSON and request timeouts", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch");
  fetch.mock.mockImplementation(async () => new Response("", { status: 503 }));
  await assert.rejects(verifyModelService(model, { env }), /GET http:\/\/127\.0\.0\.1:1\/v1\/models \(HTTP 503\)/);
  fetch.mock.mockImplementation(async () => new Response("not JSON"));
  await assert.rejects(verifyModelService(model, { env }), /GET http:\/\/127\.0\.0\.1:1\/v1\/models returned invalid JSON/);
  fetch.mock.mockImplementation(async (_url, { signal }) => {
    await new Promise((resolve) => {
      signal.addEventListener("abort", resolve, { once: true });
      setTimeout(resolve, 100);
    });
    signal.throwIfAborted();
  });
  await assert.rejects(verifyModelService(model, { env, timeoutMs: 1 }), (error) => {
    assert.match(error.message, /GET http:\/\/127\.0\.0\.1:1\/v1\/models \(timeout 1 ms\)/);
    assert.equal(error.cause.name, "TimeoutError");
    return true;
  });
});

test("preflight rejects identity substitution and missing authentication before creating result files", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace, { advertised: "different-model" });
  const report = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(report.summary.failed, 1);
  assert.match(report.items[0].reason, /not advertised/);
  await assert.rejects(readFile(path.join(f.output, "metadata.json")), { code: "ENOENT" });
  await assert.rejects(verifyModelService(model, { env: {} }), /Missing authentication/);
});

test("missing, malformed and mismatched metadata never authorize overwriting existing code", async (t) => {
  const f = await fixture(t);
  await save(path.join(f.output, "index.html"), "<main>Keep me</main>");
  const cases = [
    { value: null, reason: /no model metadata/ },
    { value: "{bad JSON", reason: /JSON|property|token/i },
    { value: metadata({ modelId: "wrong-model" }), reason: /identity/ },
    { value: metadata({ preview: "true" }), reason: /Incomplete/ },
    { value: metadata({ preview: null }), reason: /Incomplete/ },
    { value: { modelId }, reason: /Incomplete/ },
  ];
  for (const { value, reason } of cases) {
    if (value !== null) await save(path.join(f.output, "metadata.json"), value);
    const report = await renderPromptPages(f.workspace, ["local"], f.options("success", { retry: true }));
    assert.equal(report.summary.generated, 0);
    assert.match(report.items[0].reason, reason);
    assert.equal(await readFile(path.join(f.output, "index.html"), "utf8"), "<main>Keep me</main>");
  }
});

test("failed attempts retain source and logs; retry requires authorization and remains bounded", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const failed = await renderPromptPages(f.workspace, ["local"], f.options("fail"));
  assert.equal(failed.summary.failed, 1);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
  assert.equal(await readFile(path.join(f.output, "partial.txt"), "utf8"), "useful partial code");
  const log = (await readdir(f.output)).find((file) => file.endsWith(".log"));
  assert.match(await readFile(path.join(f.output, log), "utf8"), /Codex exited with code 2/);
  const pending = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(pending.summary.pending, 1);
  assert.match(pending.items[0].reason, /--retry/);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
  const retry = await renderPromptPages(f.workspace, ["local"], f.options("success", { retry: true }));
  assert.equal(retry.summary.generated, 1, JSON.stringify(retry));
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
});

test("explicit automatic retries stop at the limit and do not treat exit zero as generated code", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const failed = await renderPromptPages(f.workspace, ["local"], f.options("fail", { retries: 1 }));
  assert.equal(failed.summary.failed, 1);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
  const empty = await renderPromptPages(f.workspace, ["local"], f.options("empty", { retry: true }));
  assert.equal(empty.summary.failed, 1);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
});

test("a successful retry is verified and a reported model mismatch is rejected", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const generated = await renderPromptPages(f.workspace, ["local"], f.options("retry", { retries: 1 }));
  assert.equal(generated.summary.generated, 1, JSON.stringify(generated));
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
  const other = await fixture(t);
  await service(t, other.workspace);
  const mismatch = await renderPromptPages(other.workspace, ["local"], other.options("wrong-model"));
  assert.equal(mismatch.summary.failed, 1);
  assert.equal((await readJson(path.join(other.output, "metadata.json"))).generated, false);
});

test("Next.js source with no export stays generated but unvalidated; supplying only an export resumes without Codex", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  const pending = await renderPromptPages(f.workspace, ["local"], f.options("next"));
  assert.equal(pending.summary.pending, 1, JSON.stringify(pending));
  assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata({ generated: true }));
  await save(path.join(f.output, "out", "index.html"), "<html><body><main>Prepared export</main></body></html>");
  const resumed = await renderPromptPages(f.workspace, ["local"], f.options("fail"));
  assert.equal(resumed.summary.registered, 1, JSON.stringify(resumed));
  assert.equal(requests(), 1);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("registration rejects an array-shaped version 2 config without overwriting it", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const file = path.join(f.workspace, "deploy", "config.json");
  const config = { version: 2, pages: [{ prompt, model: [{ name: "model-a", enabled: true }] }] };
  await save(file, config);
  const report = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(report.summary.failed, 1);
  assert.match(report.items[0].reason, /version 2.*pages object/);
  assert.deepEqual(await readJson(file), config);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
});

test("broken static resources preserve generated code; changed inputs never silently regenerate", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const pending = await renderPromptPages(f.workspace, ["local"], f.options("bad-static"));
  assert.equal(pending.summary.pending, 1);
  assert.match(pending.items[0].reason, /Missing static resource/);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
  await save(path.join(f.output, "out", "missing.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="teal"/></svg>');
  assert.equal((await renderPromptPages(f.workspace, ["local"], f.options("fail"))).summary.registered, 1);
  await save(path.join(f.workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "Changed design");
  const changed = await renderPromptPages(f.workspace, ["local"], f.options("success", { retry: true }));
  assert.equal(changed.summary.pending, 1);
  assert.match(changed.items[0].reason, /changed/);
  assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("static validation checks CSS resources, nested public paths and forbidden files", async (t) => {
  const f = await fixture(t);
  const output = path.join(f.workspace, "static");
  await save(path.join(output, "style.css"), 'body{background:url("missing.png")}');
  await save(path.join(output, "index.html"), '<html><body><link href="style.css"></body></html>');
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
  await save(path.join(output, "missing.png"), "fixture");
  await validateStaticOutput(output, "travel", "model-a");
  await save(path.join(output, "index.html"), '<html><body><link href="/style.css"></body></html>');
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /escapes/);
  await save(path.join(output, "index.html"), '<html><body><link href="/pages/travel/model-a/style.css"></body></html>');
  await validateStaticOutput(output, "travel", "model-a");
  await save(path.join(output, "metadata.json"), "{}");
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /Non-public/);
  await rm(path.join(output, "metadata.json"));
  await save(path.join(output, "index.html"), '<html><body><img src="http://localhost:3000/a.png"></body></html>');
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /development service/);
  await save(path.join(output, "index.html"), '<html><body><img srcset="missing.png 1x, absent.png 2x"></body></html>');
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
  await save(path.join(output, "index.html"), '<html><body style="background:url(absent.png)">Travel</body></html>');
  await assert.rejects(validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
});

test("model directories, input names and public slug collisions stop before any model call", async (t) => {
  const f = await fixture(t);
  const config = await readJson(path.join(f.workspace, "config.json"));
  config.models.duplicate = { ...model };
  await save(path.join(f.workspace, "config.json"), config);
  await assert.rejects(loadModels(f.workspace, ["local"]), /directory collision/);
  delete config.models.duplicate;
  config.models.local.directory = "../escape";
  await save(path.join(f.workspace, "config.json"), config);
  await assert.rejects(loadModels(f.workspace, ["local"]), /Invalid model directory/);
  config.models.local = model;
  await save(path.join(f.workspace, "config.json"), config);
  await save(path.join(f.workspace, "data", "prompts", "another-folder", `${prompt}.md`), "Duplicate");
  await assert.rejects(renderPromptPages(f.workspace, ["local"], f.options()), /Duplicate prompt/);
  await rm(path.join(f.workspace, "data", "prompts", "another-folder", `${prompt}.md`));
  await save(path.join(f.workspace, "data", "prompts", "002-travel", "002-travel.md"), "Different prompt");
  await assert.rejects(renderPromptPages(f.workspace, ["local"], f.options()), /Conflicting public slug/);
});

test("shared metadata discovery ignores output-root files and still checks directory slug collisions", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  const pages = path.join(f.workspace, "out", "pages");
  await save(path.join(pages, ".DS_Store"), "Finder metadata");
  await save(path.join(pages, "notes.txt"), "Keep this file");
  const other = path.join(pages, "002-other", "metadata.json");
  await save(other, { slug: "other", title: "Other" });
  const report = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(report.summary.generated, 1, JSON.stringify(report));
  assert.equal(await readFile(path.join(pages, ".DS_Store"), "utf8"), "Finder metadata");
  assert.equal(await readFile(path.join(pages, "notes.txt"), "utf8"), "Keep this file");
  await save(other, { slug: "travel", title: "Another travel page" });
  await assert.rejects(renderPromptPages(f.workspace, ["local"], f.options()), /Conflicting public slug/);
  assert.equal(requests(), 1);
});

test("locks and symbolic-link output parents cannot redirect or overwrite results", async (t) => {
  const f = await fixture(t);
  const lock = path.join(f.workspace, "out", ".generation-locks", `${prompt}.lock`);
  await save(lock, "another process");
  const blocked = await renderPromptPages(f.workspace, ["local"], f.options());
  assert.equal(blocked.summary.pending, 1);
  assert.match(blocked.items[0].reason, /locked/);
  assert.equal(await readFile(lock, "utf8"), "another process");
  const outside = path.join(f.workspace, "outside");
  await mkdir(outside);
  await symlink(outside, path.join(f.workspace, "out", "pages"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(renderPromptPages(f.workspace, ["local"], f.options()), /Symbolic links/);
  assert.deepEqual(await readdir(outside), []);
});

test("a timeout terminates the child, retains useful artifacts, and releases the prompt lock", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const report = await renderPromptPages(f.workspace, ["local"], f.options("timeout", { timeoutMs: 1500 }));
  assert.equal(report.summary.failed, 1, JSON.stringify(report));
  assert.match(report.items[0].reason, /timed out/);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
  const pid = Number(await readFile(path.join(f.output, ".child-pid"), "utf8"));
  assert.throws(() => process.kill(pid, 0));
  assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
});

test("cancellation stops the active child and leaves the result retryable", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const report = await renderPromptPages(f.workspace, ["local"], f.options("timeout", { signal: AbortSignal.timeout(1500) }));
  assert.equal(report.summary.failed, 1);
  assert.match(report.items[0].reason, /cancelled/);
  assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
  const pid = Number(await readFile(path.join(f.output, ".child-pid"), "utf8"));
  assert.throws(() => process.kill(pid, 0));
});

test("completion or timeout cannot leave descendants running after their direct parent exits", async (t) => {
  const f = await fixture(t);
  await service(t, f.workspace);
  const report = await renderPromptPages(f.workspace, ["local"], f.options("orphan", { timeoutMs: 1500 }));
  const pid = Number(await readFile(path.join(f.output, ".grandchild-pid"), "utf8"));
  t.after(() => { try { process.kill(pid); } catch { /* Already terminated. */ } });
  assert.equal(report.summary.failed, 1, JSON.stringify(report));
  assert.throws(() => process.kill(pid, 0));
});

test("Windows npm wrappers run their JavaScript entry with Node rather than constructing a shell command", async (t) => {
  const f = await fixture(t);
  const bin = path.join(f.workspace, "bin with spaces");
  await save(path.join(bin, "codex.cmd"), "@echo off");
  const entry = path.join(bin, "node_modules", "@openai", "codex", "bin", "codex.js");
  await save(entry, "// fixture");
  assert.deepEqual(await resolveCodex({ platform: "win32", env: { PATH: bin } }), {
    executable: process.execPath, args: [entry],
  });
  await assert.rejects(resolveCodex({ platform: "win32", env: { PATH: "" } }), /Codex CLI not found/);
});

test("CLI arguments reject unknown flags and unsafe prompt paths", () => {
  assert.deepEqual(parseArguments(["local", "--check", "--prompts=001-travel", "--timeout-ms=1000", "--retries=1"]), {
    selections: ["local"], options: { check: true, prompts: ["001-travel"], timeoutMs: 1000, retries: 1 },
  });
  assert.throws(() => parseArguments(["local", "--unknown"]), /Unknown option/);
  assert.throws(() => parseArguments(["local", "--prompts=../escape"]), /Invalid prompt/);
  assert.throws(() => parseArguments(["local", "--timeout-ms=no"]), /Invalid timeout/);
});

test("CLI arguments accept a leading prompt number while preserving existing model selections and flags", () => {
  for (const number of ["003", "3"]) {
    assert.deepEqual(parseArguments([number, "Qwen3.8", "--check", "--retry"]), {
      selections: ["Qwen3.8"], options: { check: true, retry: true, prompts: [number] },
    });
  }
  assert.deepEqual(parseArguments(["local", "another-model", "--check"]), {
    selections: ["local", "another-model"], options: { check: true },
  });
  for (const args of [
    ["003", "Qwen3.8", "--prompts=001-travel"],
    ["--prompts=001-travel", "003", "Qwen3.8"],
  ]) assert.throws(() => parseArguments(args), /either a positional prompt number or --prompts/);
  assert.throws(() => parseArguments(["003"]), /followed by a model selection/);
  for (const number of ["0", "000", "9007199254740992"]) {
    assert.throws(() => parseArguments([number, "Qwen3.8"]), /positive safe integer/);
  }
});

test("numeric selection generates only the matching prompt and rejects missing or ambiguous numbers", async (t) => {
  const f = await fixture(t);
  const requests = await service(t, f.workspace);
  const config = await readJson(path.join(f.workspace, "config.json"));
  await save(path.join(f.workspace, "config.json"), {
    version: 1, models: { "Qwen3.8": { ...config.models.local, directory: "qwen3.8" } },
  });
  const selected = "003-selected";
  await save(path.join(f.workspace, "data", "prompts", selected, `${selected}.md`), "# Selected requirement\n");
  await save(path.join(f.workspace, "data", "prompts", "030-other", "030-other.md"), "# Unselected requirement\n");
  const { selections, options } = parseArguments(["003", "Qwen3.8"]);
  const report = await renderPromptPages(f.workspace, selections, f.options("success", options));
  assert.equal(report.summary.generated, 1, JSON.stringify(report));
  assert.deepEqual(report.items.map((item) => item.prompt), [selected]);
  assert.equal(report.items[0].model, "Qwen3.8");
  assert.equal(report.items[0].directory, "qwen3.8");
  assert.deepEqual(await readdir(path.join(f.workspace, "out", "pages")), [selected]);
  assert.equal(requests(), 1);
  const output = path.join(f.workspace, "out", "pages", selected, "qwen3.8");
  const invocation = await readJson(path.join(output, ".invocation.json"));
  assert.equal(invocation.args[invocation.args.indexOf("--model") + 1], modelId);
  assert.notEqual(modelId, "Qwen3.8");
  assert.equal((await readJson(path.join(output, "metadata.json"))).modelId, modelId);
  assert.ok(invocation.input.includes("# Selected requirement"));
  assert.ok(!invocation.input.includes("# Unselected requirement"));
  assert.ok(!invocation.input.includes("# Travel"));
  const before = await snapshot(f.workspace);
  await assert.rejects(renderPromptPages(f.workspace, ["Qwen3.8"], { prompts: ["999"], check: true }), /Unknown prompt number/);
  assert.deepEqual(await snapshot(f.workspace), before);
  await save(path.join(f.workspace, "data", "prompts", "003-duplicate", "003-duplicate.md"), "# Duplicate number\n");
  const ambiguous = await snapshot(f.workspace);
  await assert.rejects(renderPromptPages(f.workspace, ["Qwen3.8"], { prompts: ["3"], check: true }), /Ambiguous prompt number/);
  assert.deepEqual(await snapshot(f.workspace), ambiguous);
  assert.equal(requests(), 1);
});

test("the actual CLI returns coverage JSON and an appropriate exit code without generation or authentication", async (t) => {
  const f = await fixture(t);
  const directory = path.join(f.workspace, "src", "workflows");
  await mkdir(directory, { recursive: true });
  for (const filename of ["render-prompt-pages.mjs", "deploy-site.mjs", "render-prompt-page.mjs"]) {
    await copyFile(new URL(filename, import.meta.url), path.join(directory, filename));
  }
  const run = (args = ["local", "--check"]) => spawnSync(process.execPath, [path.join(directory, "render-prompt-pages.mjs"), ...args], {
    cwd: f.workspace, env: { ...process.env, MUSE_TEST_KEY: "" }, encoding: "utf8", timeout: 5000,
  });
  const before = await snapshot(f.workspace);
  const missing = run();
  assert.equal(missing.status, 1, missing.stderr);
  assert.equal(JSON.parse(missing.stdout).summary.missing, 1);
  assert.match(missing.stderr, /Loading model configuration:/);
  assert.match(missing.stderr, /\[001-travel\/local\] missing/);
  assert.deepEqual(await snapshot(f.workspace), before);
  await save(path.join(f.output, "metadata.json"), metadata());
  const complete = run();
  assert.equal(complete.status, 0, complete.stderr);
  assert.equal(JSON.parse(complete.stdout).summary.skipped, 1);
  const config = await readJson(path.join(f.workspace, "config.json"));
  await save(path.join(f.workspace, "config.json"), { version: 1, models: { "Qwen3.8": config.models.local } });
  await save(path.join(f.workspace, "data", "prompts", "003-selected", "003-selected.md"), "# Selected requirement\n");
  await save(path.join(f.workspace, "data", "prompts", "030-other", "030-other.md"), "# Unselected requirement\n");
  const numericBefore = await snapshot(f.workspace);
  for (const number of ["003", "3"]) {
    const selected = run([number, "Qwen3.8", "--check"]);
    assert.equal(selected.status, 1, selected.stderr);
    const report = JSON.parse(selected.stdout);
    assert.equal(report.summary.missing, 1);
    assert.deepEqual(report.items.map(({ prompt, model }) => ({ prompt, model })), [{ prompt: "003-selected", model: "Qwen3.8" }]);
  }
  const unknown = run(["999", "Qwen3.8", "--check"]);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown prompt number: 999/);
  assert.deepEqual(await snapshot(f.workspace), numericBefore);
});

test("the actual CLI prints detailed network failures to stderr and keeps stdout as JSON", async (t) => {
  const f = await fixture(t);
  const directory = path.join(f.workspace, "src", "workflows");
  await mkdir(directory, { recursive: true });
  for (const filename of ["render-prompt-pages.mjs", "deploy-site.mjs", "render-prompt-page.mjs"]) {
    await copyFile(new URL(filename, import.meta.url), path.join(directory, filename));
  }
  const config = await readJson(path.join(f.workspace, "config.json"));
  delete config.models.local.apiKeyEnv;
  config.models.local.baseUrl = "http://127.0.0.1:8000/v1";
  await save(path.join(f.workspace, "config.json"), config);
  const network = path.join(f.workspace, "mock-network.cjs");
  await save(network, `
globalThis.fetch = async () => {
  const cause = Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:8000"), { code: "ECONNREFUSED", address: "127.0.0.1", port: 8000 });
  throw new TypeError("fetch failed", { cause });
};
`);
  const failed = spawnSync(process.execPath, ["--require", network, path.join(directory, "render-prompt-pages.mjs"), "001", "local"], {
    cwd: f.workspace, env: process.env, encoding: "utf8", timeout: 5000,
  });
  assert.equal(failed.status, 1, failed.stderr);
  const report = JSON.parse(failed.stdout);
  assert.equal(report.summary.failed, 1);
  assert.match(report.items[0].reason, /\[verify-model-service\].*ECONNREFUSED/);
  assert.match(failed.stderr, /GET http:\/\/127\.0\.0\.1:8000\/v1\/models/);
  assert.match(failed.stderr, /ECONNREFUSED.*address=127\.0\.0\.1.*port=8000/);
  await assert.rejects(readFile(path.join(f.output, "metadata.json")), { code: "ENOENT" });
});
