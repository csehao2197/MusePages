import test from "node:test";
import assert from "node:assert/strict";
import
{
    createServer
}
from "node:http";
import
{
    spawnSync
}
from "node:child_process";
import
{
    existsSync
}
from "node:fs";
import
{
    copyFile,
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    stat,
    symlink,
    writeFile
}
from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import
{
    CodexRunner,
    GenerationCli,
    ModelService,
    PromptPageWorkflow,
    StaticHomepage,
}
from "./render-prompt-page.mjs";

const prompt = "001-travel";
const modelId = "local";
const secret = "synthetic-test-secret";
const model = {
    apiType: "openai-responses",
    baseUrl: "http://127.0.0.1:1/v1",
    modelId,
    directory: "model-a",
    apiKeyEnv: "MUSE_TEST_KEY"
};
const env = {
    ...process.env,
    MUSE_TEST_KEY: secret
};

function modelConfig(workspace)
{
    return path.join(workspace, "src", "workflows", "config.json");
}

async function save(file, value)
{
    await mkdir(path.dirname(file),
    {
        recursive: true
    });
    await writeFile(file, typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

async function fixture(t)
{
    const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages generation "));
    t.after(() => rm(workspace,
    {
        recursive: true,
        force: true
    }));
    await save(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "Use responsive, accessible UI. Preserve source licenses.");
    await save(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`), "# Travel\nBuild a travel homepage.\n& echo unsafe; $(not-a-command)\n中文");
    await save(path.join(workspace, "data", "prompts", prompt, "README.md"), "# Not an original prompt");
    const originalFetch = globalThis.fetch;
    t.mock.method(globalThis, "fetch", (url, options) => String(url) === "http://localhost:8000/v1/models" ?
        Promise.resolve(Response.json({ data: [{ id: modelId }] })) : originalFetch(url, options));
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
  console.log(process.argv.some(arg => arg.startsWith("model_providers.musepages.env_key=")) ? process.env.MUSE_TEST_KEY : "mock codex");
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
    console.error("mock codex failure");
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
        options: (mode = "success", rest = {}) => (
        {
            env,
            displayModelName: "model-a",
            command:
            {
                executable: process.execPath,
                args: [script, mode]
            },
            timeoutMs: 10000,
            ...rest
        }),
    };
}

async function service(t, workspace,
{
    advertised = modelId,
    status = 200,
    authenticated = false
} = {})
{
    let requests = 0;
    const server = createServer((request, response) =>
    {
        requests++;
        assert.equal(request.url, "/v1/models");
        assert.equal(request.headers.authorization, authenticated ? `Bearer ${secret}` : undefined);
        response.writeHead(status,
        {
            "Content-Type": "application/json"
        });
        response.end(JSON.stringify(
        {
            data: [
            {
                id: advertised
            }]
        }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const originalFetch = globalThis.fetch;
    t.mock.method(globalThis, "fetch", (url, options) => String(url) === "http://localhost:8000/v1/models" ?
        originalFetch(`http://127.0.0.1:${server.address().port}/v1/models`, options) : originalFetch(url, options));
    return () => requests;
}

async function readJson(file)
{
    return JSON.parse(await readFile(file, "utf8"));
}

function metadata(changes = {})
{
    return {
        modelId,
        tags: [],
        staticDir: "out",
        generated: true,
        preview: false,
        config_added: false,
        validated: false,
        ...changes
    };
}

async function snapshot(folder, excluded = [])
{
    const result = {};
    for (const entry of (await readdir(folder,
        {
            withFileTypes: true
        })).sort((a, b) => a.name.localeCompare(b.name)))
    {
        if (excluded.includes(entry.name)) continue;
        const file = path.join(folder, entry.name);
        result[entry.name] = entry.isDirectory() ? await snapshot(file) : (await readFile(file)).toString("base64");
    }
    return result;
}

test("local discovery works without configuration files and ignores stale workflow configuration", async (t) =>
{
    const f = await fixture(t);
    const rootConfig = path.join(f.workspace, "config.json");
    const [discovered] = await new ModelService(f.workspace).load([], "QWen3");
    assert.equal(discovered.modelId, modelId);
    assert.equal(discovered.directory, "QWen3");
    assert.equal(discovered.baseUrl, "http://localhost:8000/v1");
    await save(rootConfig, "{invalid configuration");
    await save(modelConfig(f.workspace), "{invalid configuration");
    await save(path.join(f.workspace, "deploy", "config.json"),
    {
        version: 2,
        pages:
        {}
    });
    const before = await snapshot(f.workspace);
    const [configured] = await new ModelService(f.workspace).load([], "model-a");
    assert.equal(configured.modelId, modelId);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"],
    {
        check: true,
        displayModelName: "model-a"
    });
    assert.equal(report.summary.missing, 1);
    assert.deepEqual(await snapshot(f.workspace), before);
    await rm(modelConfig(f.workspace));
    assert.equal((await ModelService.loadModels(f.workspace, [], "QWen3"))[0].modelId, modelId);
    assert.equal(await readFile(rootConfig, "utf8"), "{invalid configuration");
});

test("generates through a child process with stdin, real model selection, static checks and disabled grouped registration", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    await save(path.join(f.workspace, "deploy", "dist", "MusePages", "index.html"), "existing website");
    const diagnostics = [];
    const workflow = new PromptPageWorkflow(f.workspace, ["local"],
        f.options("success",
        {
            onLog: (message) => diagnostics.push(message)
        }));
    const report = await workflow.run();
    assert.equal(report.summary.generated, 1, JSON.stringify(report));
    assert.equal(report.items[0].preview, "generated");
    const preview = await readFile(path.join(f.output, "out", "preview.png"));
    assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(preview.readUInt32BE(16), 1200);
    assert.equal(preview.readUInt32BE(20), 900);
    assert.deepEqual(report.remainingMissing, []);
    const state = await readJson(path.join(f.output, "metadata.json"));
    assert.deepEqual(state, metadata(
    {
        generated: true,
        preview: true,
        validated: true,
        config_added: true
    }));
    await assert.rejects(readFile(path.join(f.output, "..", "metadata.json")),
    {
        code: "ENOENT"
    });
    const config = await readJson(path.join(f.workspace, "deploy", "config.json"));
    assert.equal(config.version, 2);
    assert.deepEqual(config.pages,
    {
        [prompt]:
        {
            weight: 1,
            pages: [
            {
                model: "model-a",
                enabled: false,
                deployed: false,
                slug: "travel",
                title: "travel",
                tags: [],
                staticDir: "out",
            }]
        }
    });
    const invocation = await readJson(path.join(f.output, ".invocation.json"));
    assert.equal(invocation.cwd, f.output);
    assert.equal(invocation.args.at(-1), "-");
    assert.equal(invocation.args[invocation.args.indexOf("--model") + 1], modelId);
    const command = diagnostics.find((message) => message.includes("Codex command:"));
    assert.ok(command?.includes(process.execPath));
    assert.ok(command.includes(`--model ${modelId}`));
    assert.ok(command.includes('model_providers.musepages.wire_api="responses"'));
    assert.ok(!diagnostics.join("\n").includes(secret));
    assert.ok(!diagnostics.join("\n").includes("# Travel"));
    assert.ok(invocation.args.includes('model_provider="musepages"'));
    assert.ok(invocation.args.includes('model_providers.musepages.wire_api="responses"'));
    assert.ok(!invocation.args.some((arg) => arg.startsWith("model_providers.musepages.env_key=")));
    assert.ok(invocation.args.includes('model_providers.musepages.base_url="http://localhost:8000/v1"'));
    assert.ok(invocation.args.includes("workspace-write"));
    assert.ok(invocation.args.includes("exec"));
    assert.equal(invocation.input, `Implement the specification in render-prompt-pages.md.

Arguments:
- prompt_scope: 001
- display_model_name: model-a

Read the specification completely before making changes.
Apply all required code modifications and keep the implementation consistent with existing project conventions.`);
    assert.ok(!invocation.args.some((arg) => arg.includes("unsafe") || arg.includes(secret)));
    await assert.rejects(readFile(path.join(invocation.home, "config.toml")),
    {
        code: "ENOENT"
    });
    const logs = (await readdir(f.output)).filter((file) => file.endsWith(".log"));
    assert.equal(logs.length, 1);
    const log = await readFile(path.join(f.output, logs[0]), "utf8");
    assert.ok(log.includes("turn.completed"));
    assert.ok(!log.includes(secret));
    assert.deepEqual((await readdir(path.join(f.output, "out"))).sort(), ["client.js", "images", "index.html", "preview.png", "style.css"]);
    assert.equal(await readFile(path.join(f.workspace, "deploy", "dist", "MusePages", "index.html"), "utf8"), "existing website");
    assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
    assert.equal(requests(), 1);
});

test("Codex logs the redacted multiline prompt before the command and execution", async (t) =>
{
    const f = await fixture(t);
    await mkdir(f.output,
    {
        recursive: true
    });
    const key = "synthetic'quoted\"secret";
    const note = "note with spaces and 'quotes'";
    const prompt = `Requirement sent through stdin.\nPreserve "quotes" and 中文.\n${key}`;
    const options = f.options();
    const messages = [];
    await new CodexRunner(
    {
        env:
        {
            ...env,
            MUSE_TEST_KEY: key
        },
        command:
        {
            ...options.command,
            args: [...options.command.args, note, key]
        },
    }).run(
    {
        folder: f.output,
        prompt,
        model,
        timeoutMs: options.timeoutMs,
        attempt: 1,
        onLog: (message) =>
        {
            if (message.startsWith("Codex prompt:") || message.startsWith("Codex command:"))
            {
                assert.equal(existsSync(path.join(f.output, ".invocation.json")), false);
            }
            messages.push(message);
        },
    });
    assert.equal(messages[0], `Codex prompt:\n${prompt.replaceAll(key, "[REDACTED]")}`);
    assert.ok(messages[1].startsWith("Codex command:"));
    const command = messages.find((message) => message.startsWith("Codex command:"));
    assert.ok(command?.includes(process.execPath));
    assert.ok(command.includes(`--model ${modelId}`));
    assert.ok(command.includes(process.platform === "win32" ?
        "'note with spaces and ''quotes'''" : "'note with spaces and '\\''quotes'\\'''"));
    assert.ok(command.includes("[REDACTED]"));
    assert.ok(!messages.join("\n").includes(key));
    const invocation = await readJson(path.join(f.output, ".invocation.json"));
    assert.ok(invocation.args.includes(note));
    assert.ok(invocation.args.includes(key));
    assert.equal(invocation.input, prompt);
});

test("Codex forwards complete stdout and stderr while redacting keys split across chunks", async (t) =>
{
    const f = await fixture(t);
    await mkdir(f.output, { recursive: true });
    const script = path.join(f.workspace, "stream-output.cjs");
    const content = "event\n".repeat(180000);
    await save(script, `
const key = process.env.MUSE_TEST_KEY;
process.stdout.write("start " + key.slice(0, 5));
process.stderr.write("warning " + key.slice(0, 4));
setTimeout(() => {
  process.stdout.write(key.slice(5) + "\\n" + "event\\n".repeat(180000));
  process.stderr.write(key.slice(4) + " end");
}, 30);
`);
    const streams = { stdout: "", stderr: "" };
    await new CodexRunner({ env }).run(
    {
        folder: f.output,
        prompt: "Stream test",
        model,
        command: { executable: process.execPath, args: [script] },
        timeoutMs: 10000,
        attempt: 1,
        onOutput: (stream, data) => streams[stream] += data
    });
    assert.equal(streams.stdout, `start [REDACTED]\n${content}`);
    assert.equal(streams.stderr, "warning [REDACTED] end");
    assert.ok(!JSON.stringify(streams).includes(secret));
});

test("generation works without API-key settings or environment variables", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace,
    {
        authenticated: false
    });
    const keylessEnv = {
        ...process.env
    };
    for (const key of ["MUSE_TEST_KEY", "MUSEPAGES_MODEL_API_KEY", "OPENAI_API_KEY", "CODEX_API_KEY"]) delete keylessEnv[key];
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
    {
        env: keylessEnv
    }));
    assert.equal(report.summary.generated, 1, JSON.stringify(report));
    assert.equal(requests(), 1);
    const invocation = await readJson(path.join(f.output, ".invocation.json"));
    assert.ok(invocation.args.includes("model_providers.musepages.requires_openai_auth=false"));
    assert.ok(!invocation.args.some((arg) => arg.startsWith("model_providers.musepages.env_key=")));
});

test("completed results repair registration without a model call and preserve existing switches and order", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    await save(path.join(f.workspace, "deploy", "config.json"), "{bad JSON");
    const failed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(failed.summary.failed, 1);
    assert.equal(failed.items[0].generated, true);
    assert.match(failed.items[0].reason, /registration failed/);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).config_added, false);
    const previewFile = path.join(f.output, "out", "preview.png");
    await rm(previewFile);
    const first = {
        prompt: "002-food",
        model: "model-b",
        enabled: true,
        deployed: false,
        slug: "food",
        title: "Food",
        tags: ["Keep"],
        staticDir: "."
    };
    await save(path.join(f.workspace, "deploy", "config.json"),
    {
        version: 1,
        pages: [first]
    });
    const noModel = {
        ...f.options(),
        command:
        {
            executable: "must-not-run",
            args: []
        }
    };
    const repaired = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
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
    const skipped = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(skipped.summary.skipped, 1);
    assert.equal(skipped.items[0].preview, "preserved");
    assert.deepEqual(await readFile(previewFile), preview);
    assert.equal((await stat(previewFile)).mtimeMs, modified);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
    const
    {
        prompt: firstPrompt,
        ...firstOption
    } = first;
    assert.deepEqual(Object.keys(config.pages), [firstPrompt, prompt]);
    assert.deepEqual((await readJson(file)).pages[firstPrompt],
    {
        weight: 1,
        pages: [firstOption]
    });
    assert.deepEqual((await readJson(file)).pages[prompt], config.pages[prompt]);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
    assert.equal(requests(), 3);
    await assert.rejects(readFile(path.join(f.output, "..", "metadata.json")),
    {
        code: "ENOENT"
    });
});

test("changed exports and corrupt previews refresh screenshots without regenerating source or changing publication switches", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    assert.equal((await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options())).summary.generated, 1);
    const preview = path.join(f.output, "out", "preview.png");
    const original = await readFile(preview);
    const source = await readFile(path.join(f.output, "style.css"), "utf8");
    const file = path.join(f.workspace, "deploy", "config.json");
    const config = await readJson(file);
    config.pages[prompt].pages[0].enabled = true;
    config.pages[prompt].pages[0].title = "Keep my title";
    await save(file, config);
    const noModel = {
        ...f.options(),
        command:
        {
            executable: "must-not-run",
            args: []
        }
    };
    await save(path.join(f.output, "out", "style.css"), "body{background:rgb(17,34,51);color:white}");
    const refreshed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(refreshed.items[0].preview, "generated", JSON.stringify(refreshed));
    assert.notDeepEqual(await readFile(preview), original);
    assert.equal(await readFile(path.join(f.output, "style.css"), "utf8"), source);
    await writeFile(preview, "corrupt preview");
    const repaired = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(repaired.items[0].preview, "generated", JSON.stringify(repaired));
    assert.equal((await readFile(preview)).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
    const image = await readFile(preview);
    const stylesheet = path.join(f.output, "out", "style.css");
    const style = await readFile(stylesheet, "utf8");
    await save(stylesheet, 'body{background:url("missing.svg")}');
    const invalid = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(invalid.summary.pending, 1, JSON.stringify(invalid));
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, false);
    assert.deepEqual(await readFile(preview), image);
    await save(stylesheet, style);
    const recovered = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(recovered.items[0].preview, "generated", JSON.stringify(recovered));
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
    assert.deepEqual(await readJson(file), config);
    assert.equal(requests(), 5);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("legacy metadata migrates preview and removes deployed only during non-check writes", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    assert.equal((await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options())).summary.generated, 1);
    const file = path.join(f.output, "metadata.json");
    const noModel = {
        ...f.options(),
        command:
        {
            executable: "must-not-run",
            args: []
        }
    };
    for (const legacy of [false, true])
    {
        const state = await readJson(file);
        state.deployed = legacy;
        state.preview = false;
        if (legacy) delete state.preview;
        await save(file, state);
        const before = await snapshot(f.workspace);
        const checked = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"],
        {
            check: true,
            displayModelName: "model-a",
            env:
            {}
        });
        assert.equal(checked.summary.skipped, 1, JSON.stringify(checked));
        assert.deepEqual(await snapshot(f.workspace), before);
        const resumed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
        assert.equal(resumed.items[0].preview, "generated", JSON.stringify(resumed));
        assert.equal((await readJson(file)).preview, true);
        assert.equal(Object.hasOwn(await readJson(file), "deployed"), false);
    }
    assert.equal(requests(), 5);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("preview failure retains source and the old image, reports pending and resumes without another model call", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    await save(path.join(f.workspace, "deploy", "config.json"), "{bad JSON");
    const first = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(first.summary.failed, 1, JSON.stringify(first));
    const file = path.join(f.workspace, "deploy", "config.json");
    await rm(file);
    const preview = path.join(f.output, "out", "preview.png");
    const original = await readFile(preview);
    const source = await readFile(path.join(f.output, "client.js"), "utf8");
    const noModel = {
        ...f.options(),
        command:
        {
            executable: "must-not-run",
            args: []
        }
    };
    await save(path.join(f.output, "out", "client.js"), 'throw new Error("Cannot render this homepage");');
    const pending = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(pending.summary.pending, 1, JSON.stringify(pending));
    assert.match(pending.items[0].reason, /preview needs preparation.*Cannot render this homepage/s);
    assert.equal(pending.items[0].generated, true);
    assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata());
    assert.deepEqual(await readFile(preview), original);
    assert.equal(await readFile(path.join(f.output, "client.js"), "utf8"), source);
    await assert.rejects(readFile(file),
    {
        code: "ENOENT"
    });
    assert.ok(!(await readdir(path.join(f.output, "out"))).some((name) => name.startsWith(".preview")));
    await save(path.join(f.output, "out", "client.js"), source + "\n");
    const resumed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], noModel);
    assert.equal(resumed.summary.registered, 1, JSON.stringify(resumed));
    assert.equal(resumed.items[0].preview, "generated");
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).preview, true);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).validated, true);
    assert.equal(requests(), 3);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("cancelling preview preparation releases browser and generation locks without model calls or registration", async (t) =>
{
    const f = await fixture(t);
    await save(path.join(f.output, "metadata.json"), metadata(
    {
        preview: true,
        validated: true
    }));
    await save(path.join(f.output, "README.md"), "Static HTML homepage.");
    const html = "<html><body><main>Travel</main><script>for (;;) {}</script></body></html>";
    await save(path.join(f.output, "index.html"), html);
    await save(path.join(f.output, "out", "index.html"), html);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"],
    {
        displayModelName: "model-a",
        env:
        {},
        command:
        {
            executable: "must-not-run",
            args: []
        },
        signal: AbortSignal.timeout(1500),
    });
    assert.equal(report.summary.pending, 1, JSON.stringify(report));
    assert.match(report.items[0].reason, /preview needs preparation/);
    assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata());
    assert.equal(await readFile(path.join(f.output, "index.html"), "utf8"), html);
    assert.deepEqual(await readdir(path.join(f.output, "out")), ["index.html"]);
    assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
    await assert.rejects(readFile(path.join(f.output, ".generation-preview.sha256")),
    {
        code: "ENOENT"
    });
    await assert.rejects(readFile(path.join(f.workspace, "deploy", "config.json")),
    {
        code: "ENOENT"
    });
});

test("read-only coverage discovers the model and ignores validation/publication without touching files", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    await save(path.join(f.output, "metadata.json"), metadata());
    const before = await snapshot(f.workspace);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, [],
    {
        check: true,
        displayModelName: "model-a",
        env:
        {}
    });
    assert.equal(report.summary.skipped, 1);
    assert.equal(report.summary.missing, 0);
    assert.deepEqual(report.remainingMissing, []);
    assert.equal(report.items[0].model, modelId);
    assert.equal(requests(), 1);
    assert.deepEqual(await snapshot(f.workspace), before);
});

test("discovery failures retain the URL and nested network causes before creating result files", async (t) =>
{
    const f = await fixture(t);
    const logs = [];
    t.mock.method(globalThis, "fetch", async () =>
    {
        const cause = Object.assign(new Error("connect ECONNREFUSED"),
        {
            code: "ECONNREFUSED",
            syscall: "connect",
            address: "127.0.0.1",
            port: 8000,
        });
        throw new TypeError("fetch failed",
        {
            cause: new AggregateError([cause])
        });
    });
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, [], f.options("success",
    {
        onLog: (message) => logs.push(message)
    })), (error) =>
    {
        const reason = GenerationCli.errorDetails(error);
        for (const pattern of [/GET http:\/\/localhost:8000\/v1\/models/, /ECONNREFUSED/, /address=127\.0\.0\.1/, /port=8000/])
        {
            assert.match(reason, pattern);
        }
        return true;
    });
    assert.ok(logs.some((message) => message.includes("Discovering local model:")));
    await assert.rejects(readFile(path.join(f.output, "metadata.json")),
    {
        code: "ENOENT"
    });
});

test("service diagnostics distinguish HTTP errors, malformed JSON and request timeouts", async (t) =>
{
    const fetch = t.mock.method(globalThis, "fetch");
    fetch.mock.mockImplementation(async () => new Response("",
    {
        status: 503
    }));
    await assert.rejects(ModelService.verifyModelService(model,
    {
        env
    }), /GET http:\/\/127\.0\.0\.1:1\/v1\/models \(HTTP 503\)/);
    fetch.mock.mockImplementation(async () => new Response("not JSON"));
    await assert.rejects(ModelService.verifyModelService(model,
    {
        env
    }), /GET http:\/\/127\.0\.0\.1:1\/v1\/models returned invalid JSON/);
    fetch.mock.mockImplementation(async (_url,
    {
        signal
    }) =>
    {
        await new Promise((resolve) =>
        {
            signal.addEventListener("abort", resolve,
            {
                once: true
            });
            setTimeout(resolve, 100);
        });
        signal.throwIfAborted();
    });
    await assert.rejects(ModelService.verifyModelService(model,
    {
        env,
        timeoutMs: 1
    }), (error) =>
    {
        assert.match(error.message, /GET http:\/\/127\.0\.0\.1:1\/v1\/models \(timeout 1 ms\)/);
        assert.equal(error.cause.name, "TimeoutError");
        return true;
    });
});

test("preflight rejects identity substitution and missing authentication before creating result files", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace,
    {
        advertised: "different-model"
    });
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options()), /does not match/);
    await assert.rejects(readFile(path.join(f.output, "metadata.json")),
    {
        code: "ENOENT"
    });
    await assert.rejects(ModelService.verifyModelService(model,
    {
        env:
        {}
    }), /Missing authentication/);
    await assert.rejects(ModelService.verifyModelService(
    {
        ...model,
        baseUrl: "http://localhost:8000/v1",
        apiKeyEnv: undefined
    }), /not advertised/);
});

test("missing, malformed and mismatched metadata never authorize overwriting existing code", async (t) =>
{
    const f = await fixture(t);
    await save(path.join(f.output, "index.html"), "<main>Keep me</main>");
    const cases = [
    {
        value: null,
        reason: /no model metadata/
    },
    {
        value: "{bad JSON",
        reason: /JSON|property|token/i
    },
    {
        value: metadata(
        {
            modelId: "wrong-model"
        }),
        reason: /identity/
    },
    {
        value: metadata(
        {
            preview: "true"
        }),
        reason: /Incomplete/
    },
    {
        value: metadata(
        {
            preview: null
        }),
        reason: /Incomplete/
    },
    {
        value:
        {
            modelId
        },
        reason: /Incomplete/
    }, ];
    for (const
        {
            value,
            reason
        }
        of cases)
    {
        if (value !== null) await save(path.join(f.output, "metadata.json"), value);
        const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
        {
            retry: true
        }));
        assert.equal(report.summary.generated, 0);
        assert.match(report.items[0].reason, reason);
        assert.equal(await readFile(path.join(f.output, "index.html"), "utf8"), "<main>Keep me</main>");
    }
});

test("failed attempts retain source and logs; retry requires authorization and remains bounded", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const failed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("fail"));
    assert.equal(failed.summary.failed, 1);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
    assert.equal(await readFile(path.join(f.output, "partial.txt"), "utf8"), "useful partial code");
    const log = (await readdir(f.output)).find((file) => file.endsWith(".log"));
    assert.match(await readFile(path.join(f.output, log), "utf8"), /Codex exited with code 2/);
    const pending = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(pending.summary.pending, 1);
    assert.match(pending.items[0].reason, /--retry/);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
    const retry = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
    {
        retry: true
    }));
    assert.equal(retry.summary.generated, 1, JSON.stringify(retry));
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
});

test("explicit automatic retries stop at the limit and do not treat exit zero as generated code", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const failed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("fail",
    {
        retries: 1
    }));
    assert.equal(failed.summary.failed, 1);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
    const empty = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("empty",
    {
        retry: true
    }));
    assert.equal(empty.summary.failed, 1);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
});

test("a successful retry is verified and a reported model mismatch is rejected", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const generated = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("retry",
    {
        retries: 1
    }));
    assert.equal(generated.summary.generated, 1, JSON.stringify(generated));
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "2");
    assert.equal((await readJson(path.join(f.output, ".invocation.json"))).input,
        `Implement the specification in render-prompt-pages.md.

Arguments:
- prompt_scope: 001
- display_model_name: model-a

Read the specification completely before making changes.
Apply all required code modifications and keep the implementation consistent with existing project conventions.`);
    const other = await fixture(t);
    await service(t, other.workspace);
    const mismatch = await PromptPageWorkflow.renderPromptPages(other.workspace, ["local"], other.options("wrong-model"));
    assert.equal(mismatch.summary.failed, 1);
    assert.equal((await readJson(path.join(other.output, "metadata.json"))).generated, false);
});

test("Next.js source with no export stays generated but unvalidated; supplying only an export resumes without Codex", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    const pending = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("next"));
    assert.equal(pending.summary.pending, 1, JSON.stringify(pending));
    assert.deepEqual(await readJson(path.join(f.output, "metadata.json")), metadata(
    {
        generated: true
    }));
    await save(path.join(f.output, "out", "index.html"), "<html><body><main>Prepared export</main></body></html>");
    const resumed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("fail"));
    assert.equal(resumed.summary.registered, 1, JSON.stringify(resumed));
    assert.equal(requests(), 2);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("registration rejects an array-shaped version 2 config without overwriting it", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const file = path.join(f.workspace, "deploy", "config.json");
    const config = {
        version: 2,
        pages: [
        {
            prompt,
            model: [
            {
                name: "model-a",
                enabled: true
            }]
        }]
    };
    await save(file, config);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(report.summary.failed, 1);
    assert.match(report.items[0].reason, /version 2.*pages object/);
    assert.deepEqual(await readJson(file), config);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
});

test("broken static resources preserve generated code; changed inputs never silently regenerate", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const pending = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("bad-static"));
    assert.equal(pending.summary.pending, 1);
    assert.match(pending.items[0].reason, /Missing static resource/);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, true);
    await save(path.join(f.output, "out", "missing.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="teal"/></svg>');
    assert.equal((await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("fail"))).summary.registered, 1);
    await save(path.join(f.workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "Changed design");
    const changed = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
    {
        retry: true
    }));
    assert.equal(changed.summary.pending, 1);
    assert.match(changed.items[0].reason, /changed/);
    assert.equal(await readFile(path.join(f.output, ".attempt-count"), "utf8"), "1");
});

test("static validation checks CSS resources, nested public paths and forbidden files", async (t) =>
{
    const f = await fixture(t);
    const output = path.join(f.workspace, "static");
    await save(path.join(output, "style.css"), 'body{background:url("missing.png")}');
    await save(path.join(output, "index.html"), '<html><body><link href="style.css"></body></html>');
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
    await save(path.join(output, "missing.png"), "fixture");
    await StaticHomepage.validateStaticOutput(output, "travel", "model-a");
    await save(path.join(output, "index.html"), '<html><body><link href="/style.css"></body></html>');
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /escapes/);
    await save(path.join(output, "index.html"), '<html><body><link href="/pages/travel/model-a/style.css"></body></html>');
    await StaticHomepage.validateStaticOutput(output, "travel", "model-a");
    await save(path.join(output, "metadata.json"), "{}");
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /Non-public/);
    await rm(path.join(output, "metadata.json"));
    await save(path.join(output, "index.html"), '<html><body><img src="http://localhost:3000/a.png"></body></html>');
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /development service/);
    await save(path.join(output, "index.html"), '<html><body><img srcset="missing.png 1x, absent.png 2x"></body></html>');
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
    await save(path.join(output, "index.html"), '<html><body style="background:url(absent.png)">Travel</body></html>');
    await assert.rejects(StaticHomepage.validateStaticOutput(output, "travel", "model-a"), /Missing static resource/);
});

test("invalid display directories, input names and public slug collisions stop before Codex calls", async (t) =>
{
    const f = await fixture(t);
    await assert.rejects(ModelService.loadModels(f.workspace, [], "../escape"), /Invalid display model name/);
    await save(path.join(f.workspace, "data", "prompts", "another-folder", `${prompt}.md`), "Duplicate");
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options()), /Duplicate prompt/);
    await rm(path.join(f.workspace, "data", "prompts", "another-folder", `${prompt}.md`));
    await save(path.join(f.workspace, "data", "prompts", "002-travel", "002-travel.md"), "Different prompt");
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options()), /Conflicting public slug/);
});

test("shared metadata discovery ignores output-root files and still checks directory slug collisions", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    const pages = path.join(f.workspace, "out", "pages");
    await save(path.join(pages, ".DS_Store"), "Finder metadata");
    await save(path.join(pages, "notes.txt"), "Keep this file");
    const other = path.join(pages, "002-other", "metadata.json");
    await save(other,
    {
        slug: "other",
        title: "Other"
    });
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(report.summary.generated, 1, JSON.stringify(report));
    assert.equal(await readFile(path.join(pages, ".DS_Store"), "utf8"), "Finder metadata");
    assert.equal(await readFile(path.join(pages, "notes.txt"), "utf8"), "Keep this file");
    await save(other,
    {
        slug: "travel",
        title: "Another travel page"
    });
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options()), /Conflicting public slug/);
    assert.equal(requests(), 2);
});

test("locks and symbolic-link output parents cannot redirect or overwrite results", async (t) =>
{
    const f = await fixture(t);
    const lock = path.join(f.workspace, "out", ".generation-locks", `${prompt}.lock`);
    await save(lock, "another process");
    const blocked = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options());
    assert.equal(blocked.summary.pending, 1);
    assert.match(blocked.items[0].reason, /locked/);
    assert.equal(await readFile(lock, "utf8"), "another process");
    const outside = path.join(f.workspace, "outside");
    await mkdir(outside);
    await symlink(outside, path.join(f.workspace, "out", "pages"), process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options()), /Symbolic links/);
    assert.deepEqual(await readdir(outside), []);
});

test("a timeout terminates the child, retains useful artifacts, and releases the prompt lock", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("timeout",
    {
        timeoutMs: 1500
    }));
    assert.equal(report.summary.failed, 1, JSON.stringify(report));
    assert.match(report.items[0].reason, /timed out/);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
    const pid = Number(await readFile(path.join(f.output, ".child-pid"), "utf8"));
    assert.throws(() => process.kill(pid, 0));
    assert.deepEqual(await readdir(path.join(f.workspace, "out", ".generation-locks")), []);
});

test("cancellation stops the active child and leaves the result retryable", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("timeout",
    {
        signal: AbortSignal.timeout(1500)
    }));
    assert.equal(report.summary.failed, 1);
    assert.match(report.items[0].reason, /cancelled/);
    assert.equal((await readJson(path.join(f.output, "metadata.json"))).generated, false);
    const pid = Number(await readFile(path.join(f.output, ".child-pid"), "utf8"));
    assert.throws(() => process.kill(pid, 0));
});

test("completion or timeout cannot leave descendants running after their direct parent exits", async (t) =>
{
    const f = await fixture(t);
    await service(t, f.workspace);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("orphan",
    {
        timeoutMs: 1500
    }));
    const pid = Number(await readFile(path.join(f.output, ".grandchild-pid"), "utf8"));
    t.after(() =>
    {
        try
        {
            process.kill(pid);
        }
        catch
        {
            /* Already terminated. */
        }
    });
    assert.equal(report.summary.failed, 1, JSON.stringify(report));
    assert.throws(() => process.kill(pid, 0));
});

test("Windows npm wrappers run their JavaScript entry with Node rather than constructing a shell command", async (t) =>
{
    const f = await fixture(t);
    const bin = path.join(f.workspace, "bin with spaces");
    await save(path.join(bin, "codex.cmd"), "@echo off");
    const entry = path.join(bin, "node_modules", "@openai", "codex", "bin", "codex.js");
    await save(entry, "// fixture");
    assert.deepEqual(await CodexRunner.resolveCodex(
    {
        platform: "win32",
        env:
        {
            PATH: bin
        }
    }),
    {
        executable: process.execPath,
        args: [entry],
    });
    await assert.rejects(CodexRunner.resolveCodex(
    {
        platform: "win32",
        env:
        {
            PATH: ""
        }
    }), /Codex CLI not found/);
});

test("CLI arguments accept a scope and display name with existing execution flags", () =>
{
    assert.deepEqual(GenerationCli.parseArguments(["003", "QWen3", "--check", "--timeout-ms=1000", "--retries=1"]),
    {
        selections: [],
        options:
        {
            check: true,
            timeoutMs: 1000,
            retries: 1,
            prompts: ["003"],
            displayModelName: "QWen3"
        },
    });
    assert.throws(() => GenerationCli.parseArguments(["003", "QWen3", "--unknown"]), /Unknown option/);
    assert.throws(() => GenerationCli.parseArguments(["../escape", "QWen3"]), /Invalid prompt_scope/);
    assert.throws(() => GenerationCli.parseArguments(["003", "../escape"]), /Invalid display model name/);
    assert.throws(() => GenerationCli.parseArguments(["003", "QWen3", "--timeout-ms=no"]), /Invalid timeout/);
});

test("CLI arguments require two positional values and accept numbers or All", () =>
{
    for (const number of ["003", "3"])
    {
        assert.deepEqual(GenerationCli.parseArguments([number, "QWen3", "--check", "--retry"]),
        {
            selections: [],
            options:
            {
                check: true,
                retry: true,
                prompts: [number],
                displayModelName: "QWen3"
            },
        });
    }
    for (const scope of ["All", "all", "ALL"])
    {
        assert.deepEqual(GenerationCli.parseArguments([scope, "QWen3", "--check"]),
        {
            selections: [],
            options:
            {
                check: true,
                displayModelName: "QWen3"
            },
        });
    }
    for (const args of [
            [],
            ["003"],
            ["003", "QWen3", "extra"],
        ]) assert.throws(() => GenerationCli.parseArguments(args), /Expected two arguments/);
    for (const number of ["0", "000", "9007199254740992"])
    {
        assert.throws(() => GenerationCli.parseArguments([number, "QWen3"]), /positive safe integer/);
    }
});

test("CLI arguments accept inclusive prompt ranges and reject invalid bounds or old selectors", () =>
{
    for (const range of ["001-010", "1-10", "003-003"])
    {
        assert.deepEqual(GenerationCli.parseArguments([range, "QWen3", "--check", "--retry"]),
        {
            selections: [],
            options:
            {
                check: true,
                retry: true,
                prompts: [range],
                displayModelName: "QWen3"
            },
        });
    }
    assert.throws(() => GenerationCli.parseArguments(["010-001", "QWen3"]), /range start must not exceed its end/);
    for (const range of ["000-010", "001-000", "1-9007199254740992"])
    {
        assert.throws(() => GenerationCli.parseArguments([range, "QWen3"]), /positive safe integer/);
    }
    for (const args of [
            ["001-010", "QWen3", "--prompts=001-travel"],
            ["--prompts=001-travel", "001-010", "QWen3"],
        ]) assert.throws(() => GenerationCli.parseArguments(args), /Unknown option/);
});

test("prompt ranges generate sequentially in numeric order and only select inclusive bounds", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    const ids = [prompt, "2-middle", "003-last"];
    for (const id of [...ids.slice(1), "004-unselected"])
    {
        await save(path.join(f.workspace, "data", "prompts", id, `${id}.md`), `# Requirement ${id}\n`);
    }
    const logs = [];
    const
    {
        selections,
        options
    } = GenerationCli.parseArguments(["001-003", "model-a"]);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, selections, f.options("success",
    {
        ...options,
        onLog: (message) => logs.push(message),
    }));
    assert.equal(report.summary.generated, 3, JSON.stringify(report));
    assert.deepEqual(report.items.map((item) => item.prompt), ids);
    assert.deepEqual((await readdir(path.join(f.workspace, "out", "pages"))).sort(), [...ids].sort());
    for (const [index, id] of ids.entries())
    {
        const output = path.join(f.workspace, "out", "pages", id, "model-a");
        const invocation = await readJson(path.join(output, ".invocation.json"));
        assert.equal(invocation.cwd, output);
        assert.equal(invocation.input,
            `Implement the specification in render-prompt-pages.md.

Arguments:
- prompt_scope: ${String(index + 1).padStart(3, "0")}
- display_model_name: model-a

Read the specification completely before making changes.
Apply all required code modifications and keep the implementation consistent with existing project conventions.`);
        assert.equal(await readFile(path.join(output, ".attempt-count"), "utf8"), "1");
        const generation = logs.findIndex((message) => message.startsWith(`[${id}/local] generate: Attempt 1/1;`));
        assert.ok(generation >= 0);
        if (index)
        {
            const previous = logs.indexOf(`[${ids[index - 1]}/local] generated`);
            assert.ok(previous >= 0 && previous < generation, "Finish the previous prompt before starting the next Codex process");
        }
    }
    const before = await snapshot(f.workspace);
    const checked = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"],
    {
        prompts: ["001-003"],
        displayModelName: "model-a",
        check: true
    });
    assert.equal(checked.summary.skipped, 3);
    assert.deepEqual(checked.items.map((item) => item.prompt), ids);
    assert.deepEqual(await snapshot(f.workspace), before);
    assert.equal(requests(), 2);
});

test("prompt ranges reject missing or ambiguous numbers before generation without expanding huge ranges", async (t) =>
{
    const f = await fixture(t);
    const requests = await service(t, f.workspace);
    await save(path.join(f.workspace, "data", "prompts", "003-last", "003-last.md"), "# Third requirement\n");
    const before = await snapshot(f.workspace);
    for (const range of ["001-003", "1-9007199254740991"])
    {
        await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
        {
            prompts: [range],
        })), /Unknown prompt number: 2/);
    }
    assert.deepEqual(await snapshot(f.workspace), before);
    for (const id of ["002-second", "2-duplicate"])
    {
        await save(path.join(f.workspace, "data", "prompts", id, `${id}.md`), "# Duplicate number\n");
    }
    const ambiguous = await snapshot(f.workspace);
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, ["local"], f.options("success",
    {
        prompts: ["001-003"],
    })), /Ambiguous prompt number: 2/);
    assert.deepEqual(await snapshot(f.workspace), ambiguous);
    const single = await PromptPageWorkflow.renderPromptPages(f.workspace, ["local"],
    {
        prompts: ["001-001"],
        displayModelName: "model-a",
        check: true
    });
    assert.deepEqual(single.items.map((item) => item.prompt), [prompt]);
    assert.equal(requests(), 4);
});

test("numeric selection generates only the matching prompt and rejects missing or ambiguous numbers", async (t) =>
{
    const f = await fixture(t);
    const actualId = "qwen3.8-flash-next-iq3_s";
    const requests = await service(t, f.workspace, { advertised: actualId });
    const selected = "003-selected";
    await save(path.join(f.workspace, "data", "prompts", selected, `${selected}.md`), "# Selected requirement\n");
    await save(path.join(f.workspace, "data", "prompts", "030-other", "030-other.md"), "# Unselected requirement\n");
    const
    {
        selections,
        options
    } = GenerationCli.parseArguments(["003", "QWen3"]);
    const report = await PromptPageWorkflow.renderPromptPages(f.workspace, selections, f.options("success", options));
    assert.equal(report.summary.generated, 1, JSON.stringify(report));
    assert.deepEqual(report.items.map((item) => item.prompt), [selected]);
    assert.equal(report.items[0].model, actualId);
    assert.equal(report.items[0].directory, "QWen3");
    assert.deepEqual(await readdir(path.join(f.workspace, "out", "pages")), [selected]);
    assert.equal(requests(), 1);
    const output = path.join(f.workspace, "out", "pages", selected, "QWen3");
    const invocation = await readJson(path.join(output, ".invocation.json"));
    assert.equal(invocation.args[invocation.args.indexOf("--model") + 1], actualId);
    assert.equal((await readJson(path.join(output, "metadata.json"))).modelId, actualId);
    assert.equal(invocation.input, `Implement the specification in render-prompt-pages.md.

Arguments:
- prompt_scope: 003
- display_model_name: QWen3

Read the specification completely before making changes.
Apply all required code modifications and keep the implementation consistent with existing project conventions.`);
    const deployment = await readJson(path.join(f.workspace, "deploy", "config.json"));
    assert.equal(deployment.pages[selected].pages[0].model, "QWen3");
    const generated = await snapshot(f.workspace);
    const checked = await PromptPageWorkflow.renderPromptPages(f.workspace, selections,
    {
        ...options,
        check: true
    });
    assert.equal(checked.summary.skipped, 1);
    assert.deepEqual(await snapshot(f.workspace), generated);
    assert.equal(requests(), 2);
    const before = await snapshot(f.workspace);
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, [],
    {
        prompts: ["999"],
        check: true
    }), /Unknown prompt number/);
    assert.deepEqual(await snapshot(f.workspace), before);
    await save(path.join(f.workspace, "data", "prompts", "003-duplicate", "003-duplicate.md"), "# Duplicate number\n");
    const ambiguous = await snapshot(f.workspace);
    await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, [],
    {
        prompts: ["3"],
        check: true
    }), /Ambiguous prompt number/);
    assert.deepEqual(await snapshot(f.workspace), ambiguous);
    assert.equal(requests(), 4);
});

test("discovery rejects empty, ambiguous and malformed model lists before writing results", async (t) =>
{
    const f = await fixture(t);
    const
    {
        selections,
        options
    } = GenerationCli.parseArguments(["003", "QWen3", "--check"]);
    const fetch = t.mock.method(globalThis, "fetch");
    for (const body of [
            { data: [] },
            { data: [{ id: modelId }, { id: "another-model", status: { value: "loaded" } }] },
            {},
            null,
            { data: [null] },
            { data: [{ id: "" }] },
            { data: [{ id: "invalid model" }] },
        ])
    {
        fetch.mock.mockImplementation(async () => Response.json(body));
        const before = await snapshot(f.workspace);
        await assert.rejects(PromptPageWorkflow.renderPromptPages(f.workspace, selections, options),
            /exactly one model|invalid model ID/);
        assert.deepEqual(await snapshot(f.workspace), before);
    }
});

test("the actual CLI discovers the local model and returns read-only coverage JSON without configuration", async (t) =>
{
    const f = await fixture(t);
    const directory = path.join(f.workspace, "src", "workflows");
    await mkdir(directory,
    {
        recursive: true
    });
    for (const filename of ["render-prompt-page.mjs", "deploy-site.mjs"])
    {
        await copyFile(new URL(filename, import.meta.url), path.join(directory, filename));
    }
    const network = path.join(f.workspace, "mock-discovery.cjs");
    await save(network, `
globalThis.fetch = async (url) => {
  if (url !== "http://localhost:8000/v1/models") throw Error("Unexpected discovery URL");
  return Response.json({ data: [{ id: ${JSON.stringify(modelId)} }] });
};
`);
    const run = (args = ["001", "model-a", "--check"]) => spawnSync(process.execPath, ["--require", network, path.join(directory, "render-prompt-page.mjs"), ...args],
    {
        cwd: f.workspace,
        env:
        {
            ...process.env,
            MUSE_TEST_KEY: ""
        },
        encoding: "utf8",
        timeout: 5000,
    });
    const before = await snapshot(f.workspace, ["logs"]);
    const missing = run();
    assert.equal(missing.status, 1, missing.stderr);
    assert.equal(JSON.parse(missing.stdout).summary.missing, 1);
    assert.match(missing.stderr, /Discovering local model: GET http:\/\/localhost:8000\/v1\/models/);
    assert.match(missing.stderr, /\[001-travel\/local\] missing/);
    assert.deepEqual(await snapshot(f.workspace, ["logs"]), before);
    await save(path.join(f.output, "metadata.json"), metadata());
    const complete = run();
    assert.equal(complete.status, 0, complete.stderr);
    assert.equal(JSON.parse(complete.stdout).summary.skipped, 1);
    await save(path.join(f.workspace, "data", "prompts", "2-middle", "2-middle.md"), "# Middle requirement\n");
    await save(path.join(f.workspace, "data", "prompts", "003-selected", "003-selected.md"), "# Selected requirement\n");
    await save(path.join(f.workspace, "data", "prompts", "030-other", "030-other.md"), "# Unselected requirement\n");
    const numericBefore = await snapshot(f.workspace, ["logs"]);
    for (const number of ["003", "3"])
    {
        const selected = run([number, "model-a", "--check"]);
        assert.equal(selected.status, 1, selected.stderr);
        const report = JSON.parse(selected.stdout);
        assert.equal(report.summary.missing, 1);
        assert.deepEqual(report.items.map((
        {
            prompt,
            model
        }) => (
        {
            prompt,
            model
        })), [
        {
            prompt: "003-selected",
            model: modelId
        }]);
    }
    const ranged = run(["001-003", "model-a", "--check"]);
    assert.equal(ranged.status, 1, ranged.stderr);
    const rangeReport = JSON.parse(ranged.stdout);
    assert.equal(rangeReport.summary.skipped, 1);
    assert.equal(rangeReport.summary.missing, 2);
    assert.deepEqual(rangeReport.items.map((item) => item.prompt), [prompt, "2-middle", "003-selected"]);
    const all = run(["All", "model-a", "--check"]);
    assert.equal(all.status, 1, all.stderr);
    const allReport = JSON.parse(all.stdout);
    assert.equal(allReport.summary.skipped, 1);
    assert.equal(allReport.summary.missing, 3);
    assert.deepEqual(allReport.items.map((item) => item.prompt), [prompt, "2-middle", "003-selected", "030-other"]);
    const unknown = run(["999", "Qwen3.8", "--check"]);
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /Unknown prompt number: 999/);
    assert.deepEqual(await snapshot(f.workspace, ["logs"]), numericBefore);
});

test("the actual CLI appends prompts, commands, Codex output and results without replacing prior logs", async (t) =>
{
    const f = await fixture(t);
    const directory = path.join(f.workspace, "src", "workflows");
    for (const filename of ["render-prompt-page.mjs", "deploy-site.mjs"])
    {
        await copyFile(new URL(filename, import.meta.url), path.join(directory, filename));
    }
    const network = path.join(f.workspace, "mock-discovery.cjs");
    await save(network, `globalThis.fetch = async () => Response.json({ data: [{ id: ${JSON.stringify(modelId)} }] });`);
    const bin = path.join(f.workspace, "bin");
    await save(path.join(bin, "codex.cmd"), "@echo off");
    const wrapper = `process.argv.splice(2, 0, "fail");\n${await readFile(path.join(f.workspace, "mock-codex.cjs"), "utf8")}`;
    if (process.platform === "win32")
    {
        await save(path.join(bin, "node_modules", "@openai", "codex", "bin", "codex.js"), wrapper);
    }
    else
    {
        await save(path.join(bin, "codex"), `#!/usr/bin/env node\n${wrapper}`);
        const { chmod } = await import("node:fs/promises");
        await chmod(path.join(bin, "codex"), 0o755);
    }
    const logFile = path.join(f.workspace, "logs", "render-prompt-page.log");
    await save(logFile, "preserve existing log\n");
    let previous = await readFile(logFile, "utf8");
    for (const flags of [[], ["--retry"]])
    {
        const result = spawnSync(process.execPath, ["--require", network, path.join(directory, "render-prompt-page.mjs"), "001", "model-a", ...flags],
        {
            cwd: f.workspace,
            env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH || ""}` },
            encoding: "utf8",
            timeout: 10000
        });
        assert.equal(result.status, 1, result.stderr);
        assert.equal(JSON.parse(result.stdout).summary.failed, 1);
        const current = await readFile(logFile, "utf8");
        assert.ok(current.startsWith(previous));
        const appended = current.slice(previous.length);
        assert.match(appended, /Codex prompt:\nImplement the specification/);
        assert.ok(appended.indexOf("Codex prompt:") < appended.indexOf("Codex command:"));
        assert.match(appended, /Codex stdout:\nmock codex/);
        assert.match(appended, /Codex stderr:\nmock codex failure/);
        assert.match(appended, /Result:\n/);
        assert.match(appended, /"failed": 1/);
        previous = current;
    }
});

test("the actual CLI prints detailed discovery failures to stderr without claiming a generation result", async (t) =>
{
    const f = await fixture(t);
    const directory = path.join(f.workspace, "src", "workflows");
    await mkdir(directory,
    {
        recursive: true
    });
    for (const filename of ["render-prompt-page.mjs", "deploy-site.mjs"])
    {
        await copyFile(new URL(filename, import.meta.url), path.join(directory, filename));
    }
    const network = path.join(f.workspace, "mock-network.cjs");
    await save(network, `
globalThis.fetch = async () => {
  const cause = Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:8000"), { code: "ECONNREFUSED", address: "127.0.0.1", port: 8000 });
  throw new TypeError("fetch failed", { cause });
};
`);
    const failed = spawnSync(process.execPath, ["--require", network, path.join(directory, "render-prompt-page.mjs"), "001", "model-a"],
    {
        cwd: f.workspace,
        env: process.env,
        encoding: "utf8",
        timeout: 5000,
    });
    assert.equal(failed.status, 1, failed.stderr);
    assert.equal(failed.stdout, "");
    assert.match(failed.stderr, /GET http:\/\/localhost:8000\/v1\/models/);
    assert.match(failed.stderr, /ECONNREFUSED.*address=127\.0\.0\.1.*port=8000/);
    const log = await readFile(path.join(f.workspace, "logs", "render-prompt-page.log"), "utf8");
    assert.match(log, /Discovering local model/);
    assert.match(log, /ECONNREFUSED/);
    await assert.rejects(readFile(path.join(f.output, "metadata.json")),
    {
        code: "ENOENT"
    });
});
