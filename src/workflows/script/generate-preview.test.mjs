import test from "node:test";
import assert from "node:assert/strict";
import
{
    spawn
}
from "node:child_process";
import
{
    createServer
}
from "node:http";
import
{
    copyFile,
    mkdtemp,
    mkdir,
    readFile,
    readdir,
    rm,
    symlink,
    writeFile
}
from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import
{
    fileURLToPath
}
from "node:url";
import
{
    chromium
}
from "@playwright/test";
import
{
    generatePreview,
    startPreviewServer
}
from "./generate-preview.mjs";

async function fixture(t, html = "<h1>A real static homepage</h1>", exported = true)
{
    const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-preview-"));
    t.after(() => rm(workspace,
    {
        recursive: true,
        force: true
    }));
    const model = path.join(workspace, "out", "pages", "001-travel", "model-a");
    const directory = exported ? path.join(model, "out") : model;
    await mkdir(directory,
    {
        recursive: true
    });
    await writeFile(path.join(directory, "index.html"), html);
    return {
        workspace,
        model,
        directory
    };
}

async function assertClean(directory)
{
    assert.ok(!(await readdir(directory)).some((name) => name.startsWith(".preview")));
}

test("captures rendered modules and public-subpath assets as a 1200x900 first viewport, replacing only preview.png", async (t) =>
{
    const f = await fixture(t, `<!doctype html><html><head>
    <link rel="stylesheet" href="/pages/custom-travel/model-a/style.css">
    </head><body><h1>Loading</h1><img src="picture.svg" width="40" height="40">
    <script type="module" src="client.mjs"></script></body></html>`);
    await writeFile(path.join(f.model, "..", "metadata.json"), JSON.stringify(
    {
        slug: "custom-travel",
        title: "Travel"
    }));
    await writeFile(path.join(f.model, "metadata.json"), '{"generated":true,"preview":false}');
    await writeFile(path.join(f.directory, "style.css"), "body{margin:0;min-height:1800px;background:rgb(17,34,51);color:white}");
    await writeFile(path.join(f.directory, "client.mjs"), 'import {title} from "./title.mjs";document.querySelector("h1").textContent=title;location.hash="home";');
    await writeFile(path.join(f.directory, "title.mjs"), 'export const title="Travel";');
    await writeFile(path.join(f.directory, "picture.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="green"/></svg>');
    await writeFile(path.join(f.directory, "preview.png"), "previous preview");
    const original = await readFile(path.join(f.directory, "index.html"), "utf8");
    const result = await generatePreview(f.directory,
    {
        workspace: f.workspace
    });
    assert.deepEqual(result,
    {
        file: path.join(f.directory, "preview.png"),
        width: 1200,
        height: 900
    });
    const image = await readFile(result.file);
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    const browser = await chromium.launch(
    {
        headless: true
    });
    try
    {
        const page = await browser.newPage();
        const decoded = await page.evaluate(async (data) =>
        {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            return {
                width: image.naturalWidth,
                height: image.naturalHeight,
                pixel: [...context.getImageData(1100, 800, 1, 1).data],
            };
        }, image.toString("base64"));
        assert.deepEqual(decoded,
        {
            width: 1200,
            height: 900,
            pixel: [17, 34, 51, 255]
        });
    }
    finally
    {
        await browser.close();
    }
    assert.equal(await readFile(path.join(f.directory, "index.html"), "utf8"), original);
    assert.equal(await readFile(path.join(f.model, "metadata.json"), "utf8"), '{"generated":true,"preview":false}');
    await assertClean(f.directory);
});

test("the server serves only the chosen static directory and closes its loopback port", async (t) =>
{
    const f = await fixture(t, "<h1>Legacy HTML</h1>", false);
    await writeFile(path.join(f.directory, "metadata.json"), '{"private":"state"}');
    await writeFile(path.join(f.directory, "package.json"), '{"private":true}');
    await writeFile(path.join(f.directory, ".env"), "not public");
    await writeFile(path.join(f.directory, "menu.pdf"), "%PDF-1.4\npublic menu");
    const outside = path.join(f.workspace, "outside");
    await mkdir(outside);
    await writeFile(path.join(outside, "private.txt"), "not public");
    await symlink(outside, path.join(f.directory, "linked"), process.platform === "win32" ? "junction" : "dir");
    const service = await startPreviewServer(f.directory,
    {
        workspace: f.workspace
    });
    try
    {
        assert.match(service.url, /^http:\/\/127\.0\.0\.1:\d+\/pages\/travel\/model-a\/index\.html$/);
        const response = await fetch(service.url);
        assert.equal(response.status, 200);
        assert.match(response.headers.get("content-type"), /text\/html/);
        assert.equal(await response.text(), "<h1>Legacy HTML</h1>");
        assert.equal((await fetch(service.url,
        {
            method: "HEAD"
        })).headers.get("content-length"), "20");
        const menu = await fetch(new URL("menu.pdf", service.url));
        assert.equal(menu.status, 200);
        assert.equal(menu.headers.get("content-type"), "application/pdf");
        assert.equal(await menu.text(), "%PDF-1.4\npublic menu");
        for (const relative of ["metadata.json", "package.json", ".env", "linked/private.txt", "%2e%2e%5cprivate.txt"])
        {
            assert.equal((await fetch(new URL(relative, service.url))).status, 404, relative);
        }
        assert.equal((await fetch(new URL("/outside/private.txt", service.url))).status, 404);
        assert.equal((await fetch(service.url,
        {
            method: "POST"
        })).status, 405);
    }
    finally
    {
        await service.close();
    }
    await assert.rejects(fetch(service.url));
});

test("missing resources, JavaScript errors and blank pages preserve an existing preview", async (t) =>
{
    const f = await fixture(t);
    const preview = path.join(f.directory, "preview.png");
    await writeFile(preview, "keep old preview");
    for (const [html, reason] of [
            ['<h1>Travel</h1><script src="missing.js"></script>', /HTTP 404|Failed resource/],
            ['<h1>Travel</h1><script>throw Error("broken interaction")</script>', /broken interaction/],
            ['<h1>Travel</h1><img src="missing.png">', /decode|HTTP 404|source image/i],
            ['<html><body style="height:100vh"></body></html>', /appears blank/],
            ['<h1>Travel</h1><script src="/wrong-root.js"></script>', /HTTP 404/],
        ])
    {
        await writeFile(path.join(f.directory, "index.html"), html);
        await assert.rejects(generatePreview(f.directory,
        {
            workspace: f.workspace
        }), reason);
        assert.equal(await readFile(preview, "utf8"), "keep old preview");
        await assertClean(f.directory);
    }
});

test("timeouts and cancellation retain the old preview and release the lock", async (t) =>
{
    const f = await fixture(t);
    const preview = path.join(f.directory, "preview.png");
    await writeFile(preview, "keep old preview");
    await assert.rejects(generatePreview(f.directory,
    {
        workspace: f.workspace,
        timeoutMs: 1
    }), /timed out/);
    const controller = new AbortController();
    const pending = generatePreview(f.directory,
    {
        workspace: f.workspace,
        signal: controller.signal
    });
    controller.abort(Error("test cancellation"));
    await assert.rejects(pending, /test cancellation/);
    assert.equal(await readFile(preview, "utf8"), "keep old preview");
    await assertClean(f.directory);
    await generatePreview(f.directory,
    {
        workspace: f.workspace
    });
    await assertClean(f.directory);
});

test("cancelling an active browser closes its preview server without stopping an unrelated service", async (t) =>
{
    const f = await fixture(t);
    const controller = new AbortController();
    let previewOrigin;
    const observer = createServer((request, response) =>
    {
        if (request.url === "/wait")
        {
            previewOrigin = request.headers.origin;
            controller.abort(Error("active cancellation"));
        }
        else
        {
            response.end("unrelated service still running");
        }
    });
    await new Promise((resolve) => observer.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${observer.address().port}`;
    try
    {
        await writeFile(path.join(f.directory, "index.html"), `<h1>Travel</h1><script>fetch("${origin}/wait")</script>`);
        await writeFile(path.join(f.directory, "preview.png"), "keep old preview");
        await assert.rejects(generatePreview(f.directory,
        {
            workspace: f.workspace,
            signal: controller.signal,
            timeoutMs: 10000,
        }), /active cancellation/);
        assert.ok(previewOrigin);
        await assert.rejects(fetch(previewOrigin));
        assert.equal(await (await fetch(`${origin}/ready`)).text(), "unrelated service still running");
        assert.equal(await readFile(path.join(f.directory, "preview.png"), "utf8"), "keep old preview");
        await assertClean(f.directory);
    }
    finally
    {
        const closed = new Promise((resolve) => observer.close(resolve));
        observer.closeAllConnections();
        await closed;
    }
});

test("invalid inputs, missing index files, links and active locks cannot overwrite other files", async (t) =>
{
    const f = await fixture(t);
    await assert.rejects(generatePreview(f.workspace,
    {
        workspace: f.workspace
    }), /Input must stay inside/);
    await assert.rejects(generatePreview(f.directory,
    {
        workspace: f.workspace,
        timeoutMs: 0
    }), /timeoutMs/);
    await assert.rejects(generatePreview(path.join(f.model, "missing"),
    {
        workspace: f.workspace
    }), /ENOENT/);
    await writeFile(path.join(f.directory, ".preview.lock"), "existing capture");
    await assert.rejects(generatePreview(f.directory,
    {
        workspace: f.workspace
    }), /Preview is locked/);
    assert.equal(await readFile(path.join(f.directory, ".preview.lock"), "utf8"), "existing capture");
    await rm(path.join(f.directory, ".preview.lock"));
    const original = path.join(f.workspace, "original");
    await mkdir(original);
    await writeFile(path.join(original, "sentinel.txt"), "untouched");
    await symlink(original, path.join(f.directory, "preview.png"), process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(generatePreview(f.directory,
    {
        workspace: f.workspace
    }), /Expected a real file/);
    assert.equal(await readFile(path.join(original, "sentinel.txt"), "utf8"), "untouched");
    await rm(path.join(f.directory, "preview.png"));
    await symlink(f.directory, path.join(f.model, "linked"), process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(generatePreview(path.join(f.model, "linked"),
    {
        workspace: f.workspace
    }), /Expected a real directory/);
    await rm(path.join(f.model, "linked"));
    await rm(path.join(f.directory, "index.html"));
    await assert.rejects(generatePreview(f.directory,
    {
        workspace: f.workspace
    }), /ENOENT/);
    await assertClean(f.directory);
});

test("the CLI captures an isolated static export, documents usage and rejects invalid flags", async (t) =>
{
    const script = fileURLToPath(new URL("./generate-preview.mjs", import.meta.url));
    const run = (args, entry = script) => new Promise((resolve, reject) =>
    {
        const child = spawn(process.execPath, [entry, ...args],
        {
            windowsHide: true
        });
        let stdout = "";
        let stderr = "";
        child.stdout.on("data", (chunk) =>
        {
            stdout += chunk;
        });
        child.stderr.on("data", (chunk) =>
        {
            stderr += chunk;
        });
        child.once("error", reject);
        child.once("close", (code) => resolve(
        {
            code,
            stdout,
            stderr
        }));
    });
    const help = await run(["--help"]);
    assert.equal(help.code, 0);
    assert.match(help.stdout, /<static-directory>/);
    const invalid = await run(["--wrong"]);
    assert.equal(invalid.code, 1);
    assert.match(invalid.stderr, /Expected <static-directory>/);
    const f = await fixture(t);
    const workflows = path.join(f.workspace, "src", "workflows", "script");
    await mkdir(workflows,
    {
        recursive: true
    });
    const isolated = path.join(workflows, "generate-preview.mjs");
    await copyFile(script, isolated);
    await symlink(fileURLToPath(new URL("../../../node_modules", import.meta.url)),
        path.join(f.workspace, "node_modules"), process.platform === "win32" ? "junction" : "dir");
    const generated = await run([f.directory, "--timeout-ms=15000"], isolated);
    assert.equal(generated.code, 0, generated.stderr);
    assert.match(generated.stdout, /Preview saved:.*1200 x 900/);
    assert.equal((await readFile(path.join(f.directory, "preview.png"))).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    await assertClean(f.directory);
});
