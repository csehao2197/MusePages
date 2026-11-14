import test from "node:test";
import assert from "node:assert/strict";
import
{
    copyFile,
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    writeFile
}
from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import
{
    spawnSync
}
from "node:child_process";
import
{
    publishToSite
}
from "./publish-site.mjs";

async function fixture(t)
{
    const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-copy-site-"));
    t.after(() => rm(workspace,
    {
        recursive: true,
        force: true
    }));
    await mkdir(path.join(workspace, "deploy", "dist", "MusePages"),
    {
        recursive: true
    });
    return workspace;
}

async function tree(folder)
{
    const files = {};
    for (const entry of await readdir(folder,
        {
            withFileTypes: true
        }))
    {
        const file = path.join(folder, entry.name);
        files[entry.name] = entry.isDirectory() ? await tree(file) : await readFile(file);
    }
    return files;
}

test("publishing clears and copies only MusePages, preserving source and sibling sites", async (t) =>
{
    const workspace = await fixture(t);
    const deploy = path.join(workspace, "deploy");
    const source = path.join(deploy, "dist", "MusePages");
    const destination = path.join(deploy, "site", "MusePages");
    await mkdir(path.join(source, "pages", "example"),
    {
        recursive: true
    });
    await mkdir(path.join(source, ".well-known"));
    await writeFile(path.join(source, "index.html"), "<h1>Gallery</h1>");
    await writeFile(path.join(source, "pages", "example", "index.html"), "<h1>Example</h1>");
    await writeFile(path.join(source, ".well-known", "asset"), Buffer.from([0, 255, 1, 128]));
    await writeFile(path.join(deploy, "dist", "robots.txt"), "outside MusePages");
    await mkdir(path.join(destination, ".git"),
    {
        recursive: true
    });
    await mkdir(path.join(destination, "obsolete"));
    await mkdir(path.join(destination, "pages", "example", "stale-empty"),
    {
        recursive: true
    });
    await writeFile(path.join(destination, ".git", "config"), "old metadata");
    await writeFile(path.join(destination, "obsolete", "old.html"), "obsolete");
    await writeFile(path.join(destination, "pages", "example", "removed.html"), "stale nested file");
    await writeFile(path.join(destination, ".well-known"), "replaced by a directory");
    await mkdir(path.join(destination, "index.html"));
    await writeFile(path.join(destination, "index.html", "old.txt"), "replaced by a file");
    await mkdir(path.join(deploy, "site", "OtherSite"));
    await writeFile(path.join(deploy, "site", "OtherSite", "index.html"), "keep sibling");
    await writeFile(path.join(deploy, "config.json"), "keep config");
    const before = await tree(source);
    const gitMetadata = {
        config: Buffer.from("old metadata")
    };

    assert.equal(await publishToSite(workspace), destination);
    assert.deepEqual(await tree(destination),
    {
        ...before,
        ".git": gitMetadata
    });
    assert.deepEqual(await tree(source), before);
    assert.equal(await readFile(path.join(deploy, "site", "OtherSite", "index.html"), "utf8"), "keep sibling");
    assert.equal(await readFile(path.join(deploy, "config.json"), "utf8"), "keep config");
    await rm(path.join(source, "pages"),
    {
        recursive: true
    });
    await writeFile(path.join(source, "index.html"), "updated index");
    await publishToSite(workspace);
    assert.deepEqual(await tree(destination),
    {
        ...await tree(source),
        ".git": gitMetadata
    });
});

test("publishing keeps collections and its navigation dist-only and removes stale published previews", async (t) =>
{
    const workspace = await fixture(t);
    const source = path.join(workspace, "deploy", "dist", "MusePages");
    const destination = path.join(workspace, "deploy", "site", "MusePages");
    const publicIndex = '<nav><a href="index.html#collection">Explore</a></nav>';
    const distIndex = '<nav><a href="index.html#collection">Explore</a><a href="collections/index.html">Collections</a></nav>';
    await mkdir(path.join(source, "collections"));
    await writeFile(path.join(source, "collections", "index.html"), "administrator preview");
    await writeFile(path.join(source, "index.html"), distIndex);
    await mkdir(path.join(source, "pages", "example", "collections"),
    {
        recursive: true
    });
    await writeFile(path.join(source, "pages", "example", "collections", "index.html"), "website asset");
    await mkdir(path.join(destination, "collections"),
    {
        recursive: true
    });
    await writeFile(path.join(destination, "collections", "index.html"), "stale administrator preview");
    const before = await tree(source);
    for (let attempt = 0; attempt < 2; attempt++)
    {
        await publishToSite(workspace);
        assert.deepEqual(await tree(destination),
        {
            "index.html": Buffer.from(publicIndex),
            pages:
            {
                example:
                {
                    collections:
                    {
                        "index.html": Buffer.from("website asset")
                    }
                }
            },
        });
        assert.deepEqual(await tree(source), before);
    }
});

test("publishing preserves root Google verification files while removing unrelated stale HTML", async (t) =>
{
    const workspace = await fixture(t);
    const source = path.join(workspace, "deploy", "dist", "MusePages");
    const destination = path.join(workspace, "deploy", "site", "MusePages");
    const verification = "google-site-verification: google1234abcd.html\n";
    await mkdir(destination,
    {
        recursive: true
    });
    await writeFile(path.join(destination, "google1234abcd.html"), verification);
    await writeFile(path.join(destination, "google.custom-token.html"), "custom verification");
    await writeFile(path.join(destination, "obsolete.html"), "stale page");
    await writeFile(path.join(source, "index.html"), "new index");
    await writeFile(path.join(source, "google5678abcd.html"), "source verification");
    for (let attempt = 0; attempt < 2; attempt++)
    {
        await publishToSite(workspace);
        assert.deepEqual(await tree(destination),
        {
            "google1234abcd.html": Buffer.from(verification),
            "google.custom-token.html": Buffer.from("custom verification"),
            "google5678abcd.html": Buffer.from("source verification"),
            "index.html": Buffer.from("new index"),
        });
    }
});

test("publishing preserves robots.txt absent from dist and refreshes it when dist provides one", async (t) =>
{
    for (const name of ["robots.txt", "ROBOTS.TXT"])
    {
        const workspace = await fixture(t);
        const source = path.join(workspace, "deploy", "dist", "MusePages");
        const destination = path.join(workspace, "deploy", "site", "MusePages");
        const original = "User-agent: *\nDisallow: /private/\n";
        const updated = "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n";
        await mkdir(destination,
        {
            recursive: true
        });
        await writeFile(path.join(destination, name), original);
        await writeFile(path.join(source, "index.html"), "new index");
        for (let attempt = 0; attempt < 2; attempt++)
        {
            await publishToSite(workspace);
            assert.equal(await readFile(path.join(destination, name), "utf8"), original);
        }
        await writeFile(path.join(source, name), updated);
        await publishToSite(workspace);
        assert.equal(await readFile(path.join(destination, name), "utf8"), updated);
        await rm(path.join(source, name));
        await publishToSite(workspace);
        assert.equal(await readFile(path.join(destination, name), "utf8"), updated);
    }
});

test("publishing preserves destination .ssh and excludes source .ssh even on repeated copies", async (t) =>
{
    for (const protectedName of [".ssh", ".SSH", null])
    {
        const workspace = await fixture(t);
        const source = path.join(workspace, "deploy", "dist", "MusePages");
        const destination = path.join(workspace, "deploy", "site", "MusePages");
        await mkdir(path.join(source, ".SSH"));
        await writeFile(path.join(source, ".SSH", "marker.txt"), "source test marker");
        await writeFile(path.join(source, "index.html"), "new index");
        if (protectedName)
        {
            await mkdir(path.join(destination, protectedName, "nested"),
            {
                recursive: true
            });
            await writeFile(path.join(destination, protectedName, "marker.txt"), "destination test marker");
            await writeFile(path.join(destination, protectedName, "nested", "keep.txt"), "nested test marker");
        }
        for (let attempt = 0; attempt < 2; attempt++)
        {
            await publishToSite(workspace);
            assert.deepEqual(await tree(destination),
            {
                ...(protectedName ?
                {
                    [protectedName]:
                    {
                        "marker.txt": Buffer.from("destination test marker"),
                        nested:
                        {
                            "keep.txt": Buffer.from("nested test marker")
                        },
                    },
                } :
                {}),
                "index.html": Buffer.from("new index"),
            });
        }
        assert.equal(await readFile(path.join(source, ".SSH", "marker.txt"), "utf8"), "source test marker");
    }
});

test("npm run publish creates a missing destination and copies contents without an extra dist directory", async (t) =>
{
    const workspace = await fixture(t);
    const source = path.join(workspace, "deploy", "dist", "MusePages");
    await writeFile(path.join(source, "index.html"), 'new index<a href="collections/index.html">Collections</a>');
    await mkdir(path.join(source, "collections"));
    await writeFile(path.join(source, "collections", "index.html"), "administrator preview");
    const scripts = path.join(workspace, "src", "workflows", "script");
    await mkdir(scripts,
    {
        recursive: true
    });
    await copyFile(new URL("./publish-site.mjs", import.meta.url), path.join(scripts, "publish-site.mjs"));
    await copyFile(new URL("../../../package.json", import.meta.url), path.join(workspace, "package.json"));
    const command = process.platform === "win32" ? process.env.ComSpec : "npm";
    const args = process.platform === "win32" ? ["/d", "/s", "/c", "npm run publish"] : ["run", "publish"];
    const result = spawnSync(command, args,
    {
        cwd: workspace,
        encoding: "utf8",
        timeout: 30000
    });
    assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /Copied deploy\\dist\\MusePages contents to deploy[\\/]site[\\/]MusePages\. Local files only\./);
    assert.deepEqual(await tree(path.join(workspace, "deploy", "site")),
    {
        MusePages:
        {
            "index.html": Buffer.from("new index")
        },
    });
});
