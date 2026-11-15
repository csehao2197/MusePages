import test from "node:test";
import assert from "node:assert/strict";
import
{
    mkdtemp,
    mkdir,
    readFile,
    readdir,
    rm,
    writeFile
}
from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import
{
    summarizeDeployConfig,
    updateStats
}
from "./update-stats.mjs";

function config()
{
    return {
        version: 2,
        categories: ["Creative", "Technology"],
        pages:
        {
            "001-alpha":
            {
                category: "creative",
                pages:
                [
                    { model: "GPT-6", enabled: true, deployed: false, tags: ["Motion", "motion", "Portrait"] },
                    { model: "Opus-5.5", enabled: false, deployed: true, tags: ["motion"] }
                ]
            },
            "002-empty":
            {
                category: "Technology",
                pages: []
            },
            "003-missing-category":
            {
                pages: [{ model: "gpt-6", enabled: true, tags: ["Portrait", " "] }]
            },
            "004-unlisted-category":
            {
                category: "Creative Showcase",
                pages: [{ model: "Opus-5.5", enabled: false, deployed: false, tags: [] }]
            }
        }
    };
}

test("counts prompts separately from model pages and deduplicates each page's tags", () =>
{
    const stats = summarizeDeployConfig(config());
    assert.deepEqual(stats.totals,
    {
        promptCount: 4,
        pageCount: 4,
        enabledPageCount: 2,
        deployedPageCount: 1,
        categoryCount: 2,
        modelCount: 2,
        tagCount: 2
    });
    assert.deepEqual(stats.categories.Creative,
    {
        promptCount: 1,
        pageCount: 2,
        enabledPageCount: 1,
        deployedPageCount: 1
    });
    assert.deepEqual(stats.categories.Technology,
    {
        promptCount: 1,
        pageCount: 0,
        enabledPageCount: 0,
        deployedPageCount: 0
    });
    assert.deepEqual(stats.uncategorized,
    {
        promptCount: 2,
        pageCount: 2,
        enabledPageCount: 1,
        deployedPageCount: 0
    });
    assert.deepEqual(stats.models["GPT-6"],
    {
        promptCount: 2,
        pageCount: 2,
        enabledPageCount: 2,
        deployedPageCount: 0
    });
    assert.deepEqual(stats.models["Opus-5.5"],
    {
        promptCount: 2,
        pageCount: 2,
        enabledPageCount: 0,
        deployedPageCount: 1
    });
    assert.deepEqual(stats.tags.Motion,
    {
        promptCount: 1,
        pageCount: 2,
        enabledPageCount: 1,
        deployedPageCount: 1
    });
    assert.deepEqual(stats.tags.Portrait,
    {
        promptCount: 2,
        pageCount: 2,
        enabledPageCount: 2,
        deployedPageCount: 0
    });
});

test("counts reserved object-property names and retains configured empty categories", () =>
{
    const stats = summarizeDeployConfig(
    {
        version: 2,
        categories: ["__proto__", "Unused"],
        pages:
        {
            "001-example":
            {
                category: "__proto__",
                pages: [{ model: "constructor", enabled: false, tags: ["__proto__", "constructor"] }]
            }
        }
    });
    assert.equal(stats.categories.__proto__.pageCount, 1);
    assert.equal(stats.categories.Unused.pageCount, 0);
    assert.equal(stats.models.constructor.pageCount, 1);
    assert.equal(stats.tags.__proto__.pageCount, 1);
    assert.equal(stats.tags.constructor.pageCount, 1);
    assert.equal(JSON.parse(JSON.stringify(stats)).tags.__proto__.pageCount, 1);
});

test("refreshes the saved snapshot without changing config and preserves stats on invalid input", async (t) =>
{
    const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-stats-"));
    t.after(() => rm(workspace,
    {
        recursive: true,
        force: true
    }));
    const directory = path.join(workspace, "deploy");
    await mkdir(directory);
    const file = path.join(directory, "config.json");
    const initial = JSON.stringify(config());
    await writeFile(file, initial);
    await updateStats(workspace);
    assert.equal(await readFile(file, "utf8"), initial);
    const first = JSON.parse(await readFile(path.join(directory, "stats.json"), "utf8"));
    assert.equal(first.totals.pageCount, 4);
    assert.equal(first.tags.Motion.pageCount, 2);
    const changed = config();
    changed.pages["001-alpha"].pages.pop();
    await writeFile(file, JSON.stringify(changed));
    await updateStats(workspace);
    const saved = await readFile(path.join(directory, "stats.json"), "utf8");
    const second = JSON.parse(saved);
    assert.equal(second.totals.pageCount, 3);
    assert.equal(second.tags.Motion.pageCount, 1);
    assert.notEqual(second.configSha256, first.configSha256);
    changed.pages["001-alpha"].pages[0].enabled = "yes";
    await writeFile(file, JSON.stringify(changed));
    await assert.rejects(updateStats(workspace), /Invalid model statistics fields/);
    assert.equal(await readFile(path.join(directory, "stats.json"), "utf8"), saved);
    assert.deepEqual((await readdir(directory)).sort(), ["config.json", "stats.json"]);
});
